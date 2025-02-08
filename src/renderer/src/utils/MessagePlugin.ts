import {
  MessagePlugin as MessagePluginOrigin,
  type MessageInfoOptions,
  type MessagePluginType
} from 'tdesign-vue-next'

export const MessagePlugin = new Proxy(
  {},
  {
    get(_, key: string) {
      if (['info', 'success', 'warning', 'error', 'question', 'loading'].includes(key)) {
        return (message: string | MessageInfoOptions, duration?: number) => {
          const params = typeof message === 'string' ? { content: message } : message
          if (!params.placement) params.placement = 'top-right'
          if (!params.closeBtn) params.closeBtn = true
          return MessagePluginOrigin[key](params, duration ?? 5000)
        }
      } else {
        return MessagePluginOrigin[key]
      }
    }
  }
) as MessagePluginType
