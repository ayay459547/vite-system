export declare type IconType = 'fas' | 'far' | 'fab'

export declare interface EventItem {
  icon: [IconType, string]
  label: string
  event: Function
}

export declare interface Hook {
  openEventList: (click: MouseEvent, eventList?: Array<EventItem>) => void
}