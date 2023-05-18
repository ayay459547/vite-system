export declare type IconType = 'fas' | 'far' | 'fab'

export declare interface EventItem {
  icon: [IconType, string] | []
  label: string
  event: Function
}
export declare namespace HookList {
  type loading = (isOpen: boolean, message?: string) => void

  type eventList = (
    click: MouseEvent,
    eventList?: Array<EventItem>,
    options?: {
      width: number
    }
  ) => void

  type i18nTranslate = (key: string) => string
}
export declare type Hook = () => {
  loading: HookList.loading
  eventList: HookList.eventList
  i18nTranslate: HookList.i18nTranslate
}