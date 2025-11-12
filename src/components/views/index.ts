// import { defineAsyncComponent } from 'vue'
import { useAsyncComponent } from '@/lib/lib_hook' // 自訂Composition API

/**
 * @author Caleb
 * @description 多階層 LogicRestriction 設定的表單
 */
export const LogicNested = useAsyncComponent<typeof import('./Common/LogicNested/LogicNested.vue')['default']>(
  () => import('./Common/LogicNested/LogicNested.vue'), 'rect'
)

/**
 * @author Caleb
 * @description LogicRestriction 結構的表單
 */
export const LogicRestrictionForm = useAsyncComponent<typeof import('./Common/LogicRestrictionForm/LogicRestrictionForm.vue')['default']>(
  () => import('./Common/LogicRestrictionForm/LogicRestrictionForm.vue'), 'rect'
)

/**
 * @author Caleb
 * @description Matcher 結構的表單
 */
export const MatcherForm = useAsyncComponent<typeof import('./Common/MatcherForm/MatcherForm.vue')['default']>(
  () => import('./Common/MatcherForm/MatcherForm.vue'), 'rect'
)

/**
 * @author Caleb
 * @description Restrictions 結構的表單
 */
export const RestrictionsForm = useAsyncComponent<typeof import('./Common/RestrictionsForm/RestrictionsForm.vue')['default']>(
  () => import('./Common/RestrictionsForm/RestrictionsForm.vue'), 'rect'
)

/**
 * @author Howard
 * @description 資料讀取
 */
export { default as DataLoader } from './Common/DataLoader.vue'
