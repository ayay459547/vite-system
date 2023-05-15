export declare type IconType = 'fas' | 'far' | 'fab'

export declare interface EventItem {
  icon: [IconType, string] | []
  label: string
  event: Function
}
declare namespace Hook {
  type openEventList = (
    click: MouseEvent,
    eventList?: Array<EventItem>,
    options?: {
      width: number
    }
  ) => void
}
export declare interface Hook {
  openEventList: Hook.openEventList
}