// import { defineAsyncComponent } from 'vue'
import { useAsyncComponent } from '@/lib/lib_hook' // 自訂Composition API

/**
 * @author Caleb
 * @description 錨點
 * @see https://element-plus.org/en-US/component/anchor.html
 */
export type {
  Types as CustomAnchorTypes,
  Props as CustomAnchorProps,
  Emits as CustomAnchorEmits,
  Expose as CustomAnchorExpose
} from './CustomAnchor/CustomAnchorInfo'
export const CustomAnchor = useAsyncComponent<typeof import('./CustomAnchor/CustomAnchor.vue')['default']>(
  () => import('./CustomAnchor/CustomAnchor.vue'), 'empty'
)

/**
 * @author Caleb
 * @description 區塊右上方顯示 數字/圖示/其他
 * @see https://element-plus.org/en-US/component/badge.html#badge
 */
export type {
  Types as CustomBadgeTypes,
  Props as CustomBadgeProps,
  Emits as CustomBadgeEmits,
  Expose as CustomBadgeExpose
} from './CustomBadge/CustomBadgeInfo'
export const CustomBadge = useAsyncComponent<typeof import('./CustomBadge/CustomBadge.vue')['default']>(
  () => import('./CustomBadge/CustomBadge.vue'), 'caption'
)

/**
 * @author Caleb
 * @contributors Howard
 * @description 按鈕
 * @see https://element-plus.org/en-US/component/button.html
 */
export type {
  Types as CustomButtonTypes,
  Props as CustomButtonProps,
  Emits as CustomButtonEmits,
  Expose as CustomButtonExpose
} from './CustomButton/CustomButtonInfo'
export { default as CustomButton } from './CustomButton/CustomButton.vue'
/**
 * @author Caleb
 * @description 群組按鈕
 */
export type {
  Types as ButtonGroupTypes,
  Props as ButtonGroupProps,
  Emits as ButtonGroupEmits,
  Expose as ButtonGroupExpose
} from './CustomButtonGroup/CustomButtonGroupInfo'
export { default as CustomButtonGroup } from './CustomButtonGroup/CustomButtonGroup.vue'

/**
 * @author Caleb
 * @description 卡片
 * @see https://element-plus.org/en-US/component/card.html
 */
export type {
  Types as CustomCardTypes,
  Props as CustomCardProps,
  Emits as CustomCardEmits,
  Expose as CustomCardExpose
} from './CustomCard/CustomCardInfo'
export const CustomCard = useAsyncComponent<typeof import('./CustomCard/CustomCard.vue')['default']>(
  () => import('./CustomCard/CustomCard.vue'), 'rect'
)

/**
 * @author Howard
 * @description 輪播
 * @see https://element-plus.org/en-US/component/carousel.html
 */
export type {
  Types as CarouselTypes,
  Props as CarouselProps,
  Emits as CarouselEmits,
  Expose as CarouselExpose
} from './CustomCarousel/CustomCarouselInfo'
export const CustomCarousel = useAsyncComponent<typeof import('./CustomCarousel/CustomCarousel.vue')['default']>(
  () => import('./CustomCarousel/CustomCarousel.vue'), 'rect'
)

/**
 * @author Caleb
 * @description 展開/縮起 區塊
 * @see https://element-plus.org/en-US/component/collapse.html
 */
export type {
  Types as CustomCollapseTypes,
  Props as CustomCollapseProps,
  Emits as CustomCollapseEmits,
  Expose as CustomCollapseExpose
} from './CustomCollapse/CustomCollapseInfo'
export const CustomCollapse = useAsyncComponent<typeof import('./CustomCollapse/CustomCollapse.vue')['default']>(
  () => import('./CustomCollapse/CustomCollapse.vue'), 'rect'
)

/**
 * @author Howard
 * @description 選色器
 * @see https://element-plus.org/en-US/component/color-picker.html
 */
export type {
  Types as CustomColorTypes,
  Props as CustomColorProps,
  Emits as CustomColorEmits,
  Expose as CustomColorExpose
} from './CustomColor/CustomColorInfo'
export const CustomColor = useAsyncComponent<typeof import('./CustomColor/CustomColor.vue')['default']>(
  () => import('./CustomColor/CustomColor.vue'), 'rect'
)

/**
 * @author Caleb
 * @description CustomModal 代替
 * @see https://element-plus.org/en-US/component/dialog.html
 */
// export type {
//   Types as CustomDialogTypes,
//   Props as CustomDialogProps,
//   Emits as CustomDialogEmits,
//   Expose as CustomDialogExpose
// } from './CustomDialog/CustomDialogInfo'
// export const CustomDialog = useAsyncComponent<typeof import('./CustomDialog/CustomDialog.vue')['default']>(
//   () => import('./CustomDialog/CustomDialog.vue'), 'p'
// )

/**
 * @author Caleb
 * @description 分隔線
 * @see https://element-plus.org/en-US/component/divider.html
 */
export type {
  Types as CustomDividerTypes,
  Props as CustomDividerProps,
  Emits as CustomDividerEmits,
  Expose as CustomDividerExpose
} from './CustomDivider/CustomDividerInfo'
export const CustomDivider = useAsyncComponent<typeof import('./CustomDivider/CustomDivider.vue')['default']>(
  () => import('./CustomDivider/CustomDivider.vue'), 'p'
)

/**
 * @author Caleb
 * @description 分隔檢視(可拖拉設定左右檢視範圍)
 */
export type {
  Types as CustomDividerViewTypes,
  Props as CustomDividerViewProps,
  Emits as CustomDividerViewEmits,
  Expose as CustomDividerViewExpose
} from './CustomDividerView/CustomDividerViewInfo'
export const CustomDividerView = useAsyncComponent<typeof import('./CustomDividerView/CustomDividerView.vue')['default']>(
  () => import('./CustomDividerView/CustomDividerView.vue'), 'rect'
)

/**
 * @author Caleb
 * @description 拖拉
 * @see https://sortablejs.github.io/vue.draggable.next/#/simple
 * @see https://github.com/SortableJS/vue.draggable.next
 */
export type {
  Types as CustomDraggableTypes,
  Props as CustomDraggableProps,
  Emits as CustomDraggableEmits,
  Expose as CustomDraggableExpose
} from './CustomDraggable/CustomDraggableInfo'
export const CustomDraggable = useAsyncComponent<typeof import('./CustomDraggable/CustomDraggable.vue')['default']>(
  () => import('./CustomDraggable/CustomDraggable.vue'), 'rect'
)

/**
 * @author Caleb
 * @description 抽屜(從銀幕外插入畫面)
 * @see https://element-plus.org/en-US/component/drawer.html
 */
export type {
  Types as CustomDrawerTypes,
  Props as CustomDrawerProps,
  Emits as CustomDrawerEmits,
  Expose as CustomDrawerExpose
} from './CustomDrawer/CustomDrawerInfo'
export const CustomDrawer = useAsyncComponent<typeof import('./CustomDrawer/CustomDrawer.vue')['default']>(
  () => import('./CustomDrawer/CustomDrawer.vue'), 'empty'
)

/**
 * @author Caleb
 * @description 無資料
 * @see https://element-plus.org/en-US/component/empty.html
 */
export type {
  Types as CustomEmptyTypes,
  Props as CustomEmptyProps,
  Emits as CustomEmptyEmits,
  Expose as CustomEmptyExpose
} from './CustomEmpty/CustomEmptyInfo'
export { default as CustomEmpty } from './CustomEmpty/CustomEmpty.vue'

/**
 * @author Caleb
 * @description 幫助(教育訓練 => PDF)
 * 先將 教育訓練PPT 匯出 PDF
 * 放到 /public/PDF/ 中
 */
export type {
  Types as CustomHelpTypes,
  Props as CustomHelpProps,
  Emits as CustomHelpEmits,
  Expose as CustomHelpExpose
} from './CustomHelp/CustomHelpInfo'
export { default as CustomHelp } from './CustomHelp/CustomHelp.vue'

/**
 * @author Caleb
 * @description 圖示
 * @see https://fontawesome.com/search?ic=free
 * @see https://www.xicons.org/#/
 * @see https://www.svgrepo.com/
 */
export type {
  Types as CustomIconTypes,
  Props as CustomIconProps,
  Emits as CustomIconEmits,
  Expose as CustomIconExpose
} from './CustomIcon/CustomIconInfo'
export { default as CustomIcon } from './CustomIcon/CustomIcon.vue'

/**
 * @author Caleb
 * @description 圖片
 * @see https://element-plus.org/en-US/component/image.html
 */
export type {
  Types as CustomImageTypes,
  Props as CustomImageProps,
  Emits as CustomImageEmits,
  Expose as CustomImageExpose
} from './CustomImage/CustomImageInfo'
export const CustomImage = useAsyncComponent<typeof import('./CustomImage/CustomImage.vue')['default']>(
  () => import('./CustomImage/CustomImage.vue'), 'image'
)

/**
 * @author Howard
 * @description 跳轉用組件
 * @see https://element-plus.org/en-US/component/link.html
 */
export type {
  Types as CustomLinkTypes,
  Props as CustomLinkProps,
  Emits as CustomLinkEmits,
  Expose as CustomLinkExpose
} from './CustomLink/CustomLinkInfo'
export { default as CustomLink } from './CustomLink/CustomLink.vue'

/**
 * @author Caleb
 * @description 鎖定特定區塊
 */
export type {
  Types as CustomLockViewTypes,
  Props as CustomLockViewProps,
  Emits as CustomLockViewEmits,
  Expose as CustomLockViewExpose
} from './CustomLockView/CustomLockViewInfo'
export const CustomLockView = useAsyncComponent<typeof import('./CustomLockView/CustomLockView.vue')['default']>(
  () => import('./CustomLockView/CustomLockView.vue'), 'rect'
)

/**
 * @author Caleb
 * @description Markdown(.md) 顯示
 * @see https://github.com/imzbf/md-editor-v3
 * @see https://imzbf.github.io/md-editor-v3/en-US
 */
export type {
  Types as CustomMarkdownTypes,
  Props as CustomMarkdownProps,
  Emits as CustomMarkdownEmits,
  Expose as CustomMarkdownExpose
} from './CustomMarkdown/CustomMarkdownInfo'
export const CustomMarkdown = useAsyncComponent<typeof import('./CustomMarkdown/CustomMarkdown.vue')['default']>(
  () => import('./CustomMarkdown/CustomMarkdown.vue'), 'rect'
)

/**
 * @author Caleb
 * @description 彈窗
 * @see https://interactjs.io/
 */
export type {
  Types as CustomModalTypes,
  Props as CustomModalProps,
  Emits as CustomModalEmits,
  Expose as CustomModalExpose
} from './CustomModal/CustomModalInfo'
export { default as CustomModal } from './CustomModal/CustomModal.vue'

/**
 * @author Caleb
 * @description 彈出 區塊提示
 * @see https://element-plus.org/en-US/component/popover.html
 */
export type {
  Types as CustomPopoverTypes,
  Props as CustomPopoverProps,
  Emits as CustomPopoverEmits,
  Expose as CustomPopoverExpose
} from './CustomPopover/CustomPopoverInfo'
export const CustomPopover = useAsyncComponent<typeof import('./CustomPopover/CustomPopover.vue')['default']>(
  () => import('./CustomPopover/CustomPopover.vue'), 'p'
)

/**
 * @author Caleb
 * @description 進度條
 * @see https://element-plus.org/en-US/component/progress.html
 */
export type {
  Types as CustomProgressTypes,
  Props as CustomProgressProps,
  Emits as CustomProgressEmits,
  Expose as CustomProgressExpose
} from './CustomProgress/CustomProgressInfo'
export const CustomProgress = useAsyncComponent<typeof import('./CustomProgress/CustomProgress.vue')['default']>(
  () => import('./CustomProgress/CustomProgress.vue'), 'rect'
)

/**
 * @author Caleb
 * @description 滾輪
 * @see https://element-plus.org/en-US/component/scrollbar.html
 */
export type {
  Types as CustomScrollbarTypes,
  Props as CustomScrollbarProps,
  Emits as CustomScrollbarEmits,
  Expose as CustomScrollbarExpose
} from './CustomScrollbar/CustomScrollbarInfo'
export { default as CustomScrollbar } from './CustomScrollbar/CustomScrollbar.vue'

/**
 * @author Caleb
 * @description 步驟
 * @see https://element-plus.org/en-US/component/steps.html
 */
export type {
  Types as CustomStepsTypes,
  Props as CustomStepsProps,
  Emits as CustomStepsEmits,
  Expose as CustomStepsExpose
} from './CustomSteps/CustomStepsInfo'
export const CustomSteps = useAsyncComponent<typeof import('./CustomSteps/CustomSteps.vue')['default']>(
  () => import('./CustomSteps/CustomSteps.vue'), 'empty'
)

/**
 * @author Caleb
 * @description 顯示特殊圖示(svg)
 * @see https://www.svgrepo.com/
 */
export type {
  Types as CustomSvgTypes,
  Props as CustomSvgProps,
  Emits as CustomSvgEmits,
  Expose as CustomSvgExpose
} from './CustomSvg/CustomSvgInfo'
export const CustomSvg = useAsyncComponent<typeof import('./CustomSvg/CustomSvg.vue')['default']>(
  () => import('./CustomSvg/CustomSvg.vue'), 'button'
)

/**
 * @author Caleb
 * @description 分頁
 * @see https://element-plus.org/en-US/component/tabs.html
 */
export type {
  Types as CustomTabsTypes,
  Props as CustomTabsProps,
  Emits as CustomTabsEmits,
  Expose as CustomTabsExpose
} from './CustomTabs/CustomTabsInfo'
export const CustomTabs = useAsyncComponent<typeof import('./CustomTabs/CustomTabs.vue')['default']>(
  () => import('./CustomTabs/CustomTabs.vue'), 'h1'
)

/**
 * @author Caleb
 * @description 標籤(類似按鈕)
 * @see https://element-plus.org/en-US/component/tag.html
 */
export type {
  Types as CustomTagTypes,
  Props as CustomTagProps,
  Emits as CustomTagEmits,
  Expose as CustomTagExpose
} from './CustomTag/CustomTagInfo'
export const CustomTag = useAsyncComponent<typeof import('./CustomTag/CustomTag.vue')['default']>(
  () => import('./CustomTag/CustomTag.vue'), 'button'
)

/**
 * @author Caleb
 * @description 文字
 * @see https://element-plus.org/en-US/component/text.html
 */
export type {
  Types as CustomTextTypes,
  Props as CustomTextProps,
  Emits as CustomTextEmits,
  Expose as CustomTextExpose
} from './CustomText/CustomTextInfo'
export { default as CustomText } from './CustomText/CustomText.vue'

/**
 * @author Caleb
 * @description 時間線
 * @see https://element-plus.org/en-US/component/timeline.html
 */
export type {
  Types as CustomTimeLineTypes,
  Props as CustomTimeLineProps,
  Emits as CustomTimeLineEmits,
  Expose as CustomTimeLineExpose
} from './CustomTimeLine/CustomTimeLineInfo'
export const CustomTimeLine = useAsyncComponent<typeof import('./CustomTimeLine/CustomTimeLine.vue')['default']>(
  () => import('./CustomTimeLine/CustomTimeLine.vue'), 'rect'
)

/**
 * @author Caleb
 * @description 彈出 文字提示
 * @see https://element-plus.org/en-US/component/tooltip.html
 */
export type {
  Types as CustomTooltipTypes,
  Props as CustomTooltipProps,
  Emits as CustomTooltipEmits,
  Expose as CustomTooltipExpose
} from './CustomTooltip/CustomTooltipInfo'
export const CustomTooltip = useAsyncComponent<typeof import('./CustomTooltip/CustomTooltip.vue')['default']>(
  () => import('./CustomTooltip/CustomTooltip.vue'), 'p'
)

/**
 * @author Caleb
 * @description 引導
 * @see https://element-plus.org/en-US/component/tour.html
 */
export type {
  Types as CustomTourTypes,
  Props as CustomTourProps,
  Emits as CustomTourEmits,
  Expose as CustomTourExpose
} from './CustomTour/CustomTourInfo'
export const CustomTour = useAsyncComponent<typeof import('./CustomTour/CustomTour.vue')['default']>(
  () => import('./CustomTour/CustomTour.vue'), 'empty'
)

/**
 * @author Caleb
 * @description 樹狀
 * @see https://element-plus.org/en-US/component/tree.html
 */
export type {
  Types as CustomTreeTypes,
  Props as CustomTreeProps,
  Emits as CustomTreeEmits,
  Expose as CustomTreeExpose
} from './CustomTree/CustomTreeInfo'
export const CustomTree = useAsyncComponent<typeof import('./CustomTree/CustomTree.vue')['default']>(
  () => import('./CustomTree/CustomTree.vue'), 'rect'
)

/**
 * @author Caleb
 * @description 虛擬樹狀
 * @see https://element-plus.org/en-US/component/tree-v2.html
 */
export type {
  Types as CustomTreeV2Types,
  Props as CustomTreeV2Props,
  Emits as CustomTreeV2Emits,
  Expose as CustomTreeV2Expose
} from './CustomTreeV2/CustomTreeV2Info'
export const CustomTreeV2 = useAsyncComponent<typeof import('./CustomTreeV2/CustomTreeV2.vue')['default']>(
  () => import('./CustomTreeV2/CustomTreeV2.vue'), 'rect'
)

/**
 * @author Howard
 * @description 浮水印
 * @see https://element-plus.org/en-US/component/watermark.html
 */
export type {
  Types as CustomWatermarkTypes,
  Props as CustomWatermarkProps,
  Emits as CustomWatermarkEmits,
  Expose as CustomWatermarkExpose
} from './CustomWatermark/CustomWatermarkInfo'
export const CustomWatermark = useAsyncComponent<typeof import('./CustomWatermark/CustomWatermark.vue')['default']>(
  () => import('./CustomWatermark/CustomWatermark.vue'), 'rect'
)

/**
 * @author Caleb
 * @description QRcode
 * @see https://github.com/Binaryify/vue-qr
 */
export type {
  Types as SimpleQRcodeTypes,
  Props as SimpleQRcodeProps,
  Emits as SimpleQRcodeEmits,
  Expose as SimpleQRcodeExpose
} from './SimpleQRcode/SimpleQRcodeInfo'
export { default as SimpleQRcode } from './SimpleQRcode/SimpleQRcode.vue'
