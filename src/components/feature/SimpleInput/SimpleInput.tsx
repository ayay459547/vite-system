// @ts-ignore
import type { Hook } from '@/declare/hook'
import {
  defineComponent,
  inject,
  computed,
  ref,
  renderSlot,
  nextTick
} from 'vue'

import type { PopoverPlacement } from '@/components'
import {
  FormInput,
  FormCheckbox,
  FormRadio,
  FormDatePicker,
  FormSelect
} from '@/components'
import styles from './SimpleInput.module.scss'
import { isEmpty } from '@/lib/lib_utils'
// @ts-ignore
import type { ModelValue } from './props'
import {
  custom,
  elCommon,
  elInput,
  elSelect
} from './props'

// @ts-ignore
import type { VeeRes, ValidateType } from '@/lib/lib_validate'
import validateFun from '@/lib/lib_validate'
import { useField } from 'vee-validate'

const SimpleInput = defineComponent({
  name: 'SimpleInput',
  props: {
    ...custom,
    ...elCommon,
    ...elInput,
    ...elSelect
  },
  emits: [
    'update:modelValue',
    'click',
    'change',
    'input',
    'focus',
    'clear',
    'blur',
    // select
    'remove-tag',
    'visible-change'
  ],
  setup (props, { slots, emit, expose }) {
    const hook: Hook = inject('hook')
    const { i18nTranslate } = hook()

    const inputValue = computed({
      get: () => props.modelValue,
      set: (value: ModelValue) => {
        emit('update:modelValue', value)
      }
    })

    // 驗證
    const validateField = (veeValue: ModelValue) => {
      // 必填
      if (props.required && isEmpty(veeValue)) {
        return '此輸入框為必填'
      }
      // 非必填
      if (isEmpty(veeValue)) return true

      // 多個驗證格式
      if (Object.prototype.toString.call(props.validate) === '[object Array]') {
        for (const type of (props.validate as ValidateType[])) {
          const { test, msg } = (validateFun[type](veeValue) as VeeRes)
          if (!test) return msg
        }
      }

      // 單一驗證格式
      if (Object.prototype.toString.call(props.validate) === '[object String]') {
        const { test, msg } = (validateFun[(props.validate as ValidateType)](veeValue) as VeeRes)
        if (!test) return msg
      }

      return true
    }

    /**
     * https://vee-validate.logaretm.com/v4/guide/composition-api/validation/
     * 如果您useField在輸入組件中使用，您不必自己管理它，它會自動為您完成。
     * 每當useField值發生變化時，它都會發出update:modelValue事件，
     * 並且每當modelValueprop 發生變化時useField，值都會自動同步和驗證。
     */
    const {
      errorMessage,     // 錯誤訊息
      value: tempValue, // 值
      handleChange,     // 換值
      handleReset,      // 重置
      validate          // 驗證
    } = useField('field', validateField, {
      validateOnValueUpdate: false,
      initialValue: inputValue.value,
      valueProp: inputValue.value
    })

    // element ui plus 相關屬性直接綁定
    const bindAttributes = computed(() => {
      return {
        clearable: props.clearable,
        disabled: props.disabled,
        rows: props.rows,
        showPassword: props.showPassword
      }
    })

    // event
    const onEvent = computed(() => {
      const _event = {
        onFocus: (e: FocusEvent): void => emit('focus', e),
        onClear: (): void => emit('clear'),
        onBlur: async (e: FocusEvent): Promise<void> => {
          emit('blur', e)

          // 確保畫面更新完才做驗證
          // 太快做驗證會一瞬間 出現紅色
          await nextTick()
          setTimeout(() => {
            handleChange(inputValue.value, true)
          }, 300)
        },
        onChange: (value: string | number): void => {
          emit('change', value)
          handleChange(value, true)
        },
        onInput: (value: string | number): void => {
          emit('input', value)
          handleChange(value, true)
        },
        // select
        onRemoveTag: (tagValue: any): void => {
          emit('remove-tag', tagValue)
        },
        onVisibleChange: (visible: boolean): void => {
          emit('visible-change', visible)
        }
      }
      if ([null, undefined, ''].includes(errorMessage.value)) {
        return {
          ..._event,
          onInput: (value: string | number): void => {
            emit('input', value)
            handleChange(value, false)
          }
        }
      } else {
        return _event
      }
    })

    const validateRes = computed<string>(() => {
      if (isEmpty(errorMessage.value)) return 'success'
      return 'error'
    })

    const _domValidateKey = ref<string>('')
    const domValidateKey = computed(() => {
      return _domValidateKey.value.length > 0 ? _domValidateKey.value : props.validateKey
    })

    expose({
      key: props.validateKey,
      value: tempValue,
      handleReset,
      validate,
      setvalidateKey (validateKey: string) {
        _domValidateKey.value = validateKey
      },
      getDom () {
        return document.querySelector(`[class*="input-${domValidateKey.value}"]`)
      }
    })

    // render

    // 'text' | 'textarea' | 'password' |
    // 'select' | 'checkbox' | 'radio' |
    // 'data' | 'datetime' | 'daterange' | 'dateitmerange'

    const getTextValue = computed(() => {
      if (isEmpty(tempValue)) return ''

      switch (props.type) {
        case 'text':
        case 'textarea':
        case 'password':
          return tempValue.value
        case 'select': {
          const _option = props.options.find(_option => _option.value === tempValue.value)
          return _option?.label ?? ''
        }
        case 'checkbox':
        case 'radio':
        case 'data':
        case 'datetime':
        case 'daterange':
        case 'dateitmerange':
        default:
          return 'empty'
      }
    })

    /**
     * 依照插槽 建立template
     * @param slotList 插槽名稱列表
     * @returns 要渲染的插槽
     */
    const getTemplate = (slotList: string[] = []) => {
      const res = {}
      slotList.forEach(slotName => {
        if (!isEmpty(slots[slotName])) {
          res[slotName] = () => {
            return renderSlot(slots, slotName)
          }
        }
      })
      return res
    }

    const renderInput = () => {
      switch (props.type) {
        case 'text':
        case 'textarea':
        case 'password':
          return (
            <FormInput
              modelValue={inputValue.value}
              onUpdate:modelValue={
                ($event: string) => (inputValue.value = $event)
              }
              // v-bind 綁定屬性
              { ...bindAttributes.value }
              type={props.type}
              onlyNumber={props.onlyNumber}
              errorMessage={errorMessage.value}
              // v-on 接收事件
              onFocus={ (e) => { onEvent.value.onFocus(e) } }
              onClear={ () => { onEvent.value.onClear() } }
              onBlur={ (e) => { onEvent.value.onBlur(e) } }
              onChange={ (e) => { onEvent.value.onChange(e) } }
              onInput={ (e) => { onEvent.value.onInput(e) } }
            >
              {{ ...getTemplate(['prepend', 'append', 'prefix', 'suffix']) }}
            </FormInput>
          )
        case 'select':
          return (
            <FormSelect
              modelValue={inputValue.value}
              onUpdate:modelValue={
                ($event: string) => (inputValue.value = $event)
              }
              // v-bind 綁定屬性
              { ...bindAttributes.value }
              type={props.type}
              options={props.options}
              errorMessage={errorMessage.value}
              // v-on 接收事件
              onFocus={ (e) => { onEvent.value.onFocus(e) } }
              onClear={ () => { onEvent.value.onClear() } }
              onBlur={ (e) => { onEvent.value.onBlur(e) } }
              onChange={ (e) => { onEvent.value.onChange(e) } }
              onRemove-tag={ (e) => { onEvent.value.onRemoveTag(e) } }
              onVisible-change={ (e) => { onEvent.value.onVisibleChange(e) } }
            >
              {{ ...getTemplate(['prefix', 'empty']) }}
            </FormSelect>
          )
        case 'checkbox':
        case 'radio':
        case 'data':
        case 'datetime':
        case 'daterange':
        case 'dateitmerange':
        default:
          break
      }
    }

    return () => (
      <div
        class={[
          styles['input-container'],
          `input-${domValidateKey.value}-${validateRes.value}`,
          styles[`input-${props.direction}`],
          props.hiddenLabel ? 'input-hidden-label' : ''
        ]}
      >
        {
          !props.hiddenLabel && (
            <label class={styles['input-label']}>
              {
                props.required && <span class={[
                  styles['input-required'],
                  styles['input-prefix']
                ]}>*</span>
              }
              <span>{ props.label }</span>
            </label>
          )
        }


        <div class={styles['input-main']}>
          {
            props.text ?
            <div class="i-pt-sm">{ getTextValue.value }</div> :
            renderInput()
          }
          <span class={styles['input-error']}>{ errorMessage.value }</span>
        </div>
      </div>
    )
  }
})

export default SimpleInput
