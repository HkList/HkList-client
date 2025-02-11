import type {
  File,
  GetConfigRes,
  GetDownLoadLinksRes,
  GetFileListReq,
  GetFileListRes,
  GetLimitReq,
  GetLimitRes
} from '@main/ipc/parse.ts'
import { useConfigStore } from '@renderer/stores/config.ts'
import { formatBytes } from '@renderer/utils/format.ts'
import { invoke } from '@renderer/utils/invoke.ts'
import { MessagePlugin } from '@renderer/utils/MessagePlugin.ts'
import { defineStore, storeToRefs } from 'pinia'
import type { TableProps } from 'tdesign-vue-next'
import { ref, toRaw } from 'vue'

const configStore = useConfigStore()
const { config } = storeToRefs(configStore)

export const useParseStore = defineStore('parse', () => {
  const GetConfigRes = ref<GetConfigRes>({
    show_announce: false,
    announce: '',
    custom_button: '',
    show_hero: false,
    name: '',
    logo: '',
    debug: false,
    max_once: 0,
    min_single_filesize: 0,
    max_single_filesize: 0,
    max_all_filesize: 0,
    need_password: false,
    have_account: false
  })
  const getConfig = async () => {
    const res = await invoke('parse.getConfig')
    GetConfigRes.value = res
  }

  const GetLimitReq = ref<GetLimitReq>({
    token: config.value.parse.token
  })
  const GetLimitRes = ref<GetLimitRes>({
    count: 0,
    size: 0,
    expires_at: '1970-01-01 08:00:00'
  })
  const GetLimitError = ref('')

  const getLimit = async () => {
    try {
      const res = await invoke('parse.getLimit', GetLimitReq.value)
      GetLimitRes.value = res
      GetLimitError.value = ''
    } catch (error) {
      const res = error as { message: string }
      const message = res?.message
      if (message) GetLimitError.value = message
      throw error
    }
  }

  const GetFileListReq = ref<GetFileListReq>({
    url: '',
    surl: '',
    pwd: '',
    dir: '/',
    parse_password: config.value.parse.parse_password
  })
  const GetFileListRes = ref<GetFileListRes>()

  // 根据路径生成上一个路径的地址
  const getPreviousPath = () => {
    const newArr = GetFileListReq.value.dir.split('/')
    newArr.pop()
    const newPath = newArr.join('/')
    return newPath === '' ? '/' : newPath
  }

  const getFileList = async (sample = false) => {
    const req: GetFileListReq = sample
      ? {
          url: 'https://pan.baidu.com/s/1H5PkdA_zMfkOQ7U4maakGA?pwd=ymuk',
          dir: '/',
          parse_password: config.value.parse.parse_password,
          surl: '1H5PkdA_zMfkOQ7U4maakGA',
          pwd: 'ymuk'
        }
      : toRaw(GetFileListReq.value)
    const res = await invoke('parse.getFileList', req)
    if (sample) return
    GetFileListRes.value = res
    if (GetFileListReq.value.dir !== '/') {
      GetFileListRes.value.list.unshift({
        category: -1,
        fs_id: 0,
        is_dir: true,
        local_ctime: 0,
        local_mtime: 0,
        server_ctime: 0,
        server_mtime: 0,
        size: 0,
        md5: '',
        path: getPreviousPath(),
        server_filename: '返回上一层',
        dlink: ''
      })
    }
  }

  const selectedRowKeys = ref<number[]>([])
  const selectedRows = ref<File[]>([])
  const handleSelectChange: TableProps['onSelectChange'] = (value, ctx) => {
    selectedRowKeys.value = value as number[]
    selectedRows.value = ctx.selectedRowData as File[]
  }

  const vcode = ref({
    hit_captcha: false,
    vcode_str: '',
    vcode_img: '',
    vcode_input: ''
  })

  const pending = ref(false)
  const GetDownLoadLinksRes = ref<GetDownLoadLinksRes>([])
  const getDownloadLinks = async (event?: PointerEvent | number, row?: File) => {
    if (pending.value) {
      MessagePlugin.error('正在解析中,请稍后再试')
      return false
    }

    if (event && typeof event !== 'number' && row) {
      event.stopPropagation()
      selectedRows.value = [row]
    }

    const filteFolders = selectedRows.value.filter((item) => item && !item.is_dir)
    if (filteFolders.length !== selectedRows.value.length)
      MessagePlugin.warning('文件夹不会进行解析,已忽略')

    const filteMinSingleFilesize = filteFolders.filter(
      (file) => file.size > GetConfigRes.value.min_single_filesize
    )
    if (filteMinSingleFilesize.length !== filteFolders.length)
      MessagePlugin.warning('文件过小不会被解析')

    const filteMaxSingleFilesize = filteMinSingleFilesize.filter(
      (file) => file.size < GetConfigRes.value.max_single_filesize
    )
    if (filteMaxSingleFilesize.length !== filteMinSingleFilesize.length)
      MessagePlugin.warning('文件过大不会被解析')

    const rows = filteMaxSingleFilesize
    const sum = rows.reduce((prev, cur) => prev + cur.size, 0)

    if (sum > GetConfigRes.value.max_all_filesize) {
      MessagePlugin.error(`单次最多解析${formatBytes(GetConfigRes.value.max_all_filesize)}的文件`)
      return
    }

    if (rows.length > GetConfigRes.value.max_once) {
      MessagePlugin.error(`单次最多解析${GetConfigRes.value.max_once}个文件`)
      return
    }

    if (rows.length === 0) {
      MessagePlugin.error(`满足要求的文件数量为0`)
      return
    }

    try {
      pending.value = true
      const res = await invoke('parse.getDownloadLinks', {
        randsk: GetFileListRes.value!.randsk,
        uk: GetFileListRes.value!.uk,
        shareid: GetFileListRes.value!.shareid,
        fs_id: typeof event === 'number' ? [event] : rows.map((v) => v.fs_id),
        surl: GetFileListReq.value.surl,
        dir: GetFileListReq.value.dir,
        pwd: GetFileListReq.value.pwd,
        token: GetLimitReq.value.token,
        parse_password: GetFileListReq.value.parse_password,
        ...(vcode.value.hit_captcha
          ? { vcode_str: vcode.value.vcode_str, vcode_input: vcode.value.vcode_input }
          : {})
      })
      if (typeof event === 'number') {
        MessagePlugin.success('重新解析成功')
        return res
      } else {
        MessagePlugin.success('解析成功,下滑查看解析结果')
        GetDownLoadLinksRes.value = res
      }
      vcode.value.hit_captcha = false
    } catch (_error) {
      const error = _error as { response: { data: { message: string } } }
      if (error?.response?.data?.message?.includes('-20')) {
        // -20 为验证码
        const res = await invoke('parse.getVcode', {
          parse_password: GetFileListReq.value.parse_password
        })

        vcode.value = {
          hit_captcha: true,
          ...res,
          vcode_input: ''
        }
      } else {
        MessagePlugin.error('解析可能失败或超时了,请稍后前往历史记录中尝试查询是否成功')
      }
    } finally {
      pending.value = false
      await getLimit()
      await getConfig()
    }

    return true
  }

  return {
    getConfig,
    GetConfigRes,

    getLimit,
    GetLimitReq,
    GetLimitRes,
    GetLimitError,

    getFileList,
    GetFileListReq,
    GetFileListRes,

    selectedRowKeys,
    selectedRows,
    handleSelectChange,

    getDownloadLinks,
    GetDownLoadLinksRes,

    vcode
  }
})
