<script setup lang="ts">
import { ref } from 'vue'

// feature
import CustomAnchor from '@/components/feature/CustomAnchor/CustomAnchor.md?raw'
import CustomBadge from '@/components/feature/CustomBadge/CustomBadge.md?raw'
import CustomButton from '@/components/feature/CustomButton/CustomButton.md?raw'
import CustomButtonGroup from '@/components/feature/CustomButtonGroup/CustomButtonGroup.md?raw'
import CustomCard from '@/components/feature/CustomCard/CustomCard.md?raw'
import CustomCarousel from '@/components/feature/CustomCarousel/CustomCarousel.md?raw'
import CustomCollapse from '@/components/feature/CustomCollapse/CustomCollapse.md?raw'
import CustomColor from '@/components/feature/CustomColor/CustomColor.md?raw'
import CustomDivider from '@/components/feature/CustomDivider/CustomDivider.md?raw'
import CustomDividerView from '@/components/feature/CustomDividerView/CustomDividerView.md?raw'
import CustomDraggable from '@/components/feature/CustomDraggable/CustomDraggable.md?raw'
import CustomDrawer from '@/components/feature/CustomDrawer/CustomDrawer.md?raw'
import CustomEmpty from '@/components/feature/CustomEmpty/CustomEmpty.md?raw'
import CustomIcon from '@/components/feature/CustomIcon/CustomIcon.md?raw'
import CustomImage from '@/components/feature/CustomImage/CustomImage.md?raw'
import CustomLink from '@/components/feature/CustomLink/CustomLink.md?raw'
import CustomLockView from '@/components/feature/CustomLockView/CustomLockView.md?raw'
import CustomMarkdown from '@/components/feature/CustomMarkdown/CustomMarkdown.md?raw'
import CustomModal from '@/components/feature/CustomModal/CustomModal.md?raw'
import CustomPopover from '@/components/feature/CustomPopover/CustomPopover.md?raw'
import CustomProgress from '@/components/feature/CustomProgress/CustomProgress.md?raw'
import CustomScrollbar from '@/components/feature/CustomScrollbar/CustomScrollbar.md?raw'
import CustomSteps from '@/components/feature/CustomSteps/CustomSteps.md?raw'
import CustomTabs from '@/components/feature/CustomTabs/CustomTabs.md?raw'
import CustomTag from '@/components/feature/CustomTag/CustomTag.md?raw'
import CustomText from '@/components/feature/CustomText/CustomText.md?raw'
import CustomTimeLine from '@/components/feature/CustomTimeLine/CustomTimeLine.md?raw'
import CustomTooltip from '@/components/feature/CustomTooltip/CustomTooltip.md?raw'
import CustomTour from '@/components/feature/CustomTour/CustomTour.md?raw'
import CustomTree from '@/components/feature/CustomTree/CustomTree.md?raw'
import CustomTreeV2 from '@/components/feature/CustomTreeV2/CustomTreeV2.md?raw'
import CustomWatermark from '@/components/feature/CustomWatermark/CustomWatermark.md?raw'
import SimpleQRcode from '@/components/feature/SimpleQRcode/SimpleQRcode.md?raw'
// input
import CustomInput from '@/components/input/CustomInput/CustomInput.md?raw'
import CustomSearch from '@/components/input/CustomSearch/CustomSearch.md?raw'
import CustomSwitch from '@/components/input/CustomSwitch/CustomSwitch.md?raw'
import CustomUpload from '@/components/input/CustomUpload/CustomUpload.md?raw'
import FormAutocomplete from '@/components/input/FormAutocomplete/FormAutocomplete.md?raw'
import FormCheckbox from '@/components/input/FormCheckbox/FormCheckbox.md?raw'
import FormDatePicker from '@/components/input/FormDatePicker/FormDatePicker.md?raw'
import FormInput from '@/components/input/FormInput/FormInput.md?raw'
import FormList from '@/components/input/FormList/FormList.md?raw'
import FormOperator from '@/components/input/FormOperator/FormOperator.md?raw'
import FormRadio from '@/components/input/FormRadio/FormRadio.md?raw'
import FormSelect from '@/components/input/FormSelect/FormSelect.md?raw'
import FormSelectTree from '@/components/input/FormSelectTree/FormSelectTree.md?raw'
import FormSelectV2 from '@/components/input/FormSelectV2/FormSelectV2.md?raw'
import FormTimePicker from '@/components/input/FormTimePicker/FormTimePicker.md?raw'
import SimpleFilterInfo from '@/components/input/SimpleFilter/SimpleFilter.md?raw'
import TimeLevelManagement from '@/components/input/TimeLevelManagement/TimeLevelManagement.md?raw'
// table
import CustomTable from '@/components/table/CustomTable/CustomTable.md?raw'
import SimpleTable from '@/components/table/SimpleTable/SimpleTable.md?raw'
import TimeLineTable from '@/components/table/TimeLineTable/TimeLineTable.md?raw'
import VxeTable from '@/components/table/VxeTable/VxeTable.md?raw'
import WebViewTable from '@/components/table/WebViewTable/WebViewTable.md?raw'

import {
  CustomAnchor as Anchor,
  CustomScrollbar as Scrollbar,
  CustomMarkdown as Markdown
} from '@/components' // 系統組件

const markdownRef = ref()

const links = [
  // feature
  { title: 'CustomAnchor', href: '#CustomAnchor', text: CustomAnchor },
  { title: 'CustomBadge', href: '#CustomBadge', text: CustomBadge },
  { title: 'CustomButton', href: '#CustomButton', text: CustomButton },
  { title: 'CustomButtonGroup', href: '#CustomButtonGroup', text: CustomButtonGroup },
  { title: 'CustomCard', href: '#CustomCard', text: CustomCard },
  { title: 'CustomCarousel', href: '#CustomCarousel', text: CustomCarousel },
  { title: 'CustomCollapse', href: '#CustomCollapse', text: CustomCollapse },
  { title: 'CustomColor', href: '#CustomColor', text: CustomColor },
  { title: 'CustomDivider', href: '#CustomDivider', text: CustomDivider },
  { title: 'CustomDividerView', href: '#CustomDividerView', text: CustomDividerView },
  { title: 'CustomDraggable', href: '#CustomDraggable', text: CustomDraggable },
  { title: 'CustomDrawer', href: '#CustomDrawer', text: CustomDrawer },
  { title: 'CustomEmpty', href: '#CustomEmpty', text: CustomEmpty },
  { title: 'CustomIcon', href: '#CustomIcon', text: CustomIcon },
  { title: 'CustomImage', href: '#CustomImage', text: CustomImage },
  { title: 'CustomLink', href: '#CustomLink', text: CustomLink },
  { title: 'CustomLockView', href: '#CustomLockView', text: CustomLockView },
  { title: 'CustomMarkdown', href: '#CustomMarkdown', text: CustomMarkdown },
  { title: 'CustomModal', href: '#CustomModal', text: CustomModal },
  { title: 'CustomPopover', href: '#CustomPopover', text: CustomPopover },
  { title: 'CustomProgress', href: '#CustomProgress', text: CustomProgress },
  { title: 'CustomScrollbar', href: '#CustomScrollbar', text: CustomScrollbar },
  { title: 'CustomSteps', href: '#CustomSteps', text: CustomSteps },
  { title: 'CustomTabs', href: '#CustomTabs', text: CustomTabs },
  { title: 'CustomTag', href: '#CustomTag', text: CustomTag },
  { title: 'CustomText', href: '#CustomText', text: CustomText },
  { title: 'CustomTimeLine', href: '#CustomTimeLine', text: CustomTimeLine },
  { title: 'CustomTooltip', href: '#CustomTooltip', text: CustomTooltip },
  { title: 'CustomTour', href: '#CustomTour', text: CustomTour },
  { title: 'CustomTree', href: '#CustomTree', text: CustomTree },
  { title: 'CustomTreeV2', href: '#CustomTreeV2', text: CustomTreeV2 },
  { title: 'CustomWatermark', href: '#CustomWatermark', text: CustomWatermark },
  { title: 'SimpleQRcode', href: '#SimpleQRcode', text: SimpleQRcode },
  // input
  { title: 'CustomInput', href: '#CustomInput', text: CustomInput },
  { title: 'CustomSearch', href: '#CustomSearch', text: CustomSearch },
  { title: 'CustomSwitch', href: '#CustomSwitch', text: CustomSwitch },
  { title: 'CustomUpload', href: '#CustomUpload', text: CustomUpload },
  { title: 'FormAutocomplete', href: '#FormAutocomplete', text: FormAutocomplete },
  { title: 'FormCheckbox', href: '#FormCheckbox', text: FormCheckbox },
  { title: 'FormDatePicker', href: '#FormDatePicker', text: FormDatePicker },
  { title: 'FormInput', href: '#FormInput', text: FormInput },
  { title: 'FormList', href: '#FormList', text: FormList },
  { title: 'FormOperator', href: '#FormOperator', text: FormOperator },
  { title: 'FormRadio', href: '#FormRadio', text: FormRadio },
  { title: 'FormSelect', href: '#FormSelect', text: FormSelect },
  { title: 'FormSelectTree', href: '#FormSelectTree', text: FormSelectTree },
  { title: 'FormSelectV2', href: '#FormSelectV2', text: FormSelectV2 },
  { title: 'FormTimePicker', href: '#FormTimePicker', text: FormTimePicker },
  { title: 'SimpleFilterInfo', href: '#SimpleFilterInfo', text: SimpleFilterInfo },
  { title: 'TimeLevelManagement', href: '#TimeLevelManagement', text: TimeLevelManagement },
  // table
  { title: 'CustomTable', href: '#CustomTable', text: CustomTable },
  { title: 'SimpleTable', href: '#SimpleTable', text: SimpleTable },
  { title: 'TimeLineTable', href: '#TimeLineTable', text: TimeLineTable },
  { title: 'VxeTable', href: '#VxeTable', text: VxeTable },
  { title: 'WebViewTable', href: '#WebViewTable', text: WebViewTable }
]

const handleClick = (e: MouseEvent) => {
  e.preventDefault()
}
</script>

<template>
  <div class="page">
    <div ref="markdownRef" class="page-components">
      <div
        v-for="link in links"
        :key="link.title"
        :id="link.title"
        class="page-md"
      >
        <Markdown :text="link.text" />
      </div>
    </div>

    <Scrollbar class="page-anchor">
      <Anchor
        :container="markdownRef"
        direction="vertical"
        type="default"
        :offset="30"
        :links="links"
        @click="handleClick"
      ></Anchor>
    </Scrollbar>
  </div>
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  padding: 16px;
  position: relative;
  overflow: hidden;
  display: flex;
  gap: 16px;

  &-components {
    flex: 5;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 64px;
    padding: 8px 12px;
  }
  &-md {
    border-radius: 6px;
    padding: 8px 12px;
    transition-duration: 0.2s;
    &:hover {
      background: var(--el-color-primary-light-7);
      box-shadow: 2px 2px 8px 1px #778eb6;
    }
  }
  &-anchor {
    flex: 1;
    overflow: auto;
  }
}
</style>
