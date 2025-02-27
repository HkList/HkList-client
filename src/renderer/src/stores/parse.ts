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
import { invoke } from '@renderer/utils/ipc.ts'
import { MessagePlugin } from '@renderer/utils/MessagePlugin.ts'
import { defineStore, storeToRefs } from 'pinia'
import type { MessageInstance, TableProps } from 'tdesign-vue-next'
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
  const getConfig = async (): Promise<void> => {
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

  const getLimit = async (): Promise<void> => {
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

  const paths = ref<string[]>([])

  // 根据路径生成上一个路径的地址
  const getPreviousPath = (): string => {
    if (paths.value.length === 0) return '/'
    return paths.value[paths.value.length - 2] ?? '/'
  }

  const getFileList = async (sample = false): Promise<void> => {
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
    } else {
      paths.value = []
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
  const getDownloadLinks = async (
    event?: PointerEvent | number,
    row?: File
  ): Promise<boolean | GetDownLoadLinksRes> => {
    if (pending.value) {
      MessagePlugin.error('正在解析中,请稍后再试')
      return false
    }

    if (event && typeof event !== 'number' && row) {
      event.stopPropagation()
      selectedRows.value = [row]
    }

    const isDirFsId: number[] = []
    const filteFolders = selectedRows.value.filter((item) => {
      if (item.is_dir) isDirFsId.push(item.fs_id)
      return item && !item.is_dir
    })
    if (filteFolders.length !== selectedRows.value.length)
      MessagePlugin.warning('暂时不支持解析文件夹')

    selectedRows.value = filteFolders
    selectedRowKeys.value = selectedRowKeys.value.filter((fs_id) => !isDirFsId.includes(fs_id))

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
      return false
    }

    if (rows.length > GetConfigRes.value.max_once) {
      MessagePlugin.error(`单次最多解析${GetConfigRes.value.max_once}个文件`)
      return false
    }

    if (rows.length === 0) {
      MessagePlugin.error(`满足要求的文件数量为0`)
      return false
    }

    try {
      pending.value = true
      vcode.value.hit_captcha = false

      if (typeof event === 'number') {
        const res = await invoke('parse.getDownloadLinks', {
          randsk: GetFileListRes.value!.randsk,
          uk: GetFileListRes.value!.uk,
          shareid: GetFileListRes.value!.shareid,
          fs_id: [event],
          surl: GetFileListReq.value.surl,
          dir: GetFileListReq.value.dir,
          pwd: GetFileListReq.value.pwd,
          token: GetLimitReq.value.token,
          parse_password: GetFileListReq.value.parse_password,
          ...(vcode.value.hit_captcha
            ? { vcode_str: vcode.value.vcode_str, vcode_input: vcode.value.vcode_input }
            : {})
        })
        MessagePlugin.success('重新解析成功')
        return res
      } else {
        const res: GetDownLoadLinksRes = []
        let message: MessageInstance | null = null
        let row: File

        try {
          for (const index in rows) {
            row = rows[index]

            if (message) message.close()

            message = await MessagePlugin.loading(
              `正在解析第${parseFloat(index) + 1}个文件:${row.server_filename}`,
              9999999
            )

            const link = await invoke('parse.getDownloadLinks', {
              randsk: GetFileListRes.value!.randsk,
              uk: GetFileListRes.value!.uk,
              shareid: GetFileListRes.value!.shareid,
              fs_id: [row.fs_id],
              surl: GetFileListReq.value.surl,
              dir: GetFileListReq.value.dir,
              pwd: GetFileListReq.value.pwd,
              token: GetLimitReq.value.token,
              parse_password: GetFileListReq.value.parse_password,
              ...(vcode.value.hit_captcha
                ? { vcode_str: vcode.value.vcode_str, vcode_input: vcode.value.vcode_input }
                : {})
            })
            res.push(...link)

            // 取消选中
            if (row === null) continue
            selectedRowKeys.value = selectedRowKeys.value.filter((item) => item !== row.fs_id)
            selectedRows.value = selectedRows.value.filter((item) => item.fs_id !== row.fs_id)
          }
        } catch (error) {
          if (message) message.close()
          GetDownLoadLinksRes.value = res
          MessagePlugin.success('部分解析成功,下滑查看解析结果')
          throw error
        }

        if (message) message.close()
        MessagePlugin.success('解析成功,下滑查看解析结果')
        GetDownLoadLinksRes.value = res
      }
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

    vcode,
    paths
  }
})
