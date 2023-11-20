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

import {
  FormInput,
  FormSelect,
  FormDatePicker,
  FormCheckbox,
  FormRadio,
  FormAutocomplete,
  FormOperator
  // @ts-ignore
} from '@/components'
import styles from './CustomInput.module.scss'
import { isEmpty, tipLog } from '@/lib/lib_utils'
import { datetimeFormat } from '@/lib/lib_day'
// @ts-ignore
import type { ModelValue } from './props'
import {
  custom,
  elCommon,
  elInput,
  elSelect,
  elDatePicker,
  elCheckbox,
  elRadio,
  elAutocomplete
} from './props'

// @ts-ignore
import type { VeeRes, ValidateType } from '@/lib/lib_validate'
import validateFun from '@/lib/lib_validate'
import { useField } from 'vee-validate'

const CustomInput = defineComponent({
  name: 'CustomInput',
  props: {
    ...custom,
    ...elCommon,
    ...elInput,
    ...elSelect,
    ...elDatePicker,
    ...elCheckbox,
    ...elRadio,
    ...elAutocomplete
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
    'visible-change',
    // autocomplete
    'select'
  ],
  setup (props, { slots, emit, expose }) {
    const hook: Hook = inject('hook')
    const { i18nTranslate, i18nTest } = hook()

    // const inputValue = computed({
    //   get: () => props.modelValue,
    //   set: (value: ModelValue) => {
    //     emit('update:modelValue', value)
    //   }
    // })

    const validateCount = ref(0)
    // 驗證
    const validateField = (veeValue: ModelValue) => {
      // 一開始不驗證
      if (validateCount.value === 0) {
        validateCount.value++
        return true
      }
      // 必填
      if (props.required) {
        switch (props.type) {
          case 'operator':
            if (
              !Array.isArray(veeValue) ||
              isEmpty(veeValue[0]) ||
              isEmpty(veeValue[1])
            ) {
              // 此輸入框為必填
              return 'required'
            }
            break
          case 'text':
          case 'autocomplete':
          default:
            if (isEmpty(veeValue)) {
              return 'required'
            }
            break
        }
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
      errorMessage,      // 錯誤訊息
      value: inputValue, // 值
      handleChange,      // 換值
      handleReset,       // 重置
      validate           // 驗證
    } = useField('field', validateField, {
      // validateOnValueUpdate: true
      // initialValue: inputValue,
      // valueProp: inputValue
    })

    const i18nErrorMessage = computed(() => {
      const keyword = errorMessage?.value ?? ''
      if (i18nTest(keyword)) return i18nTranslate(keyword)
      return keyword
    })

    // element ui plus 相關屬性直接綁定
    const bindAttributes = computed(() => {
      return {
        clearable: props.clearable,
        disabled: props.disabled,
        rows: props.rows,
        showPassword: props.showPassword,
        loading: props.loading,
        // select
        remote: props.remote,
        remoteMethod: props.remoteMethod,
        multiple: props.multiple,
        multipleLimit: props.multipleLimit,
        maxCollapseTags: props.maxCollapseTags,
        collapseTags: props.multiple,
        collapseTagsTooltip: props.multiple,
        filterable: props.filterable,
        allowCreate: props.allowCreate,
        // datePicker
        format: props.format,
        valueFormat: props.valueFormat,
        shortcuts: props.shortcuts,
        // autocomplete
        valueKey: props.valueKey,
        fitInputWidth: props.fitInputWidth,
        fetchSuggestions: props.fetchSuggestions
      }
    })

    // event
    const onEvent = computed(() => {
      const _event = {
        onFocus: (e: FocusEvent): void => {
          emit('focus', e)
        },
        onClear: (): void => {
          emit('clear')
        },
        onBlur: async (e: FocusEvent): Promise<void> => {
          emit('blur', e)

          // 確保畫面更新完才做驗證
          // 太快做驗證會一瞬間 出現紅色
          await nextTick()
          setTimeout(() => {
            handleChange(inputValue.value, true)
          }, 300)
        },
        onChange: (value: any): void => {
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
        },
        // autocomplete
        onSelect: (item: any): void => {
          emit('select', item)
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

    const inputRef = ref()
    const selectRef = ref()
    const datePickerRef = ref()
    const autocompleteRef = ref()
    expose({
      key: props.validateKey,
      value: inputValue.value,
      handleReset,
      validate,
      setvalidateKey (validateKey: string) {
        _domValidateKey.value = validateKey
      },
      getDom () {
        return document.querySelector(`[class*="input-${domValidateKey.value}"]`)
      },
      focus () {
        switch (props.type) {
          case 'text':
          case 'textarea':
          case 'password':
            inputRef.value.focus()
            break
          case 'select':
            selectRef.value.focus()
            break
          case 'year':
          case 'month':
          case 'date':
          case 'dates':
          case 'datetime':
          case 'week':
          case 'datetimerange':
          case 'daterange':
          case 'monthrange':
            datePickerRef.value.focus()
            break
          case 'autocomplete':
            autocompleteRef.value.focus()
            break
        }
      },
      blur () {
        switch (props.type) {
          case 'text':
          case 'textarea':
          case 'password':
            inputRef.value.blur()
            break
          case 'select':
            selectRef.value.blur()
            break
          case 'year':
          case 'month':
          case 'date':
          case 'dates':
          case 'datetime':
          case 'week':
          case 'datetimerange':
          case 'daterange':
          case 'monthrange':
            datePickerRef.value.blur()
            break
          case 'autocomplete':
            autocompleteRef.value.blur()
            break
        }
      }
    })

    // render

    // 'text' | 'textarea' | 'password' |
    // 'select' | 'checkbox' | 'radio' |
    // 'data' | 'datetime' | 'daterange' | 'dateitmerange'
    const getTextValue = computed(() => {
      if (isEmpty(inputValue.value)) return ''

      switch (props.type) {
        case 'text':
        case 'textarea':
        case 'password':
        case 'autocomplete':
          return inputValue.value
        case 'select': {
          const option = props.options.find(_option => _option.value === inputValue.value)
          return option?.label ?? ''
        }
        case 'year':
        case 'month':
        case 'date':
        case 'dates':
        case 'datetime':
        case 'week':
        case 'datetimerange':
        case 'daterange':
        case 'monthrange':
          if (Array.isArray(inputValue.value)) {
            const [value1, value2] = inputValue.value
            return `${datetimeFormat(value1, props.format)} ~ ${datetimeFormat(value2, props.format)}`
          } else {
            return datetimeFormat(inputValue.value, props.format)
          }
        case 'checkbox':
          if (Array.isArray(inputValue.value)) {
            return inputValue.value.map(item => {
              const option = props.options.find(_option => _option.value === item)
              return option.label
            })
          } else {
            return `${inputValue.value}`
          }
        case 'radio': {
            const option = props.options.find(_option => _option.value === inputValue.value)
            return option?.label ?? ''
          }
        case 'operator': {
            const [ selectValue = '', inputText = '' ] = inputValue.value
            const option = props.options.find(_option => _option.value === selectValue)
            return `${option?.label ?? ''}-${inputText}`
          }
        default:
          return ''
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
          return (
            <FormInput
              ref={inputRef}
              modelValue={inputValue.value}
              onUpdate:modelValue={
                ($event: any) => (inputValue.value = $event)
              }
              // v-bind 綁定屬性
              { ...bindAttributes.value }
              type={props.type}
              onlyNumber={props.onlyNumber}
              errorMessage={errorMessage.value}
              // v-on 接收事件
              onFocus={ (e: any) => onEvent.value.onFocus(e) }
              onClear={ () => onEvent.value.onClear() }
              onBlur={ (e: any) => onEvent.value.onBlur(e) }
              onChange={ (e: any) => onEvent.value.onChange(e) }
              onInput={ (e: any) => onEvent.value.onInput(e) }
            >
              {{
                ...getTemplate([
                  'prepend',
                  'append',
                  'prefix',
                  'suffix'
                ])
              }}
            </FormInput>
          )
        case 'password':
          return (
            <form>
              <FormInput
                ref={inputRef}
                modelValue={inputValue.value}
                onUpdate:modelValue={
                  ($event: any) => (inputValue.value = $event)
                }
                // v-bind 綁定屬性
                { ...bindAttributes.value }
                type={props.type}
                onlyNumber={props.onlyNumber}
                errorMessage={errorMessage.value}
                // v-on 接收事件
                onFocus={ (e: any) => onEvent.value.onFocus(e) }
                onClear={ () => onEvent.value.onClear() }
                onBlur={ (e: any) => onEvent.value.onBlur(e) }
                onChange={ (e: any) => onEvent.value.onChange(e) }
                onInput={ (e: any) => onEvent.value.onInput(e) }
              >
                {{
                  ...getTemplate([
                    'prepend',
                    'append',
                    'prefix',
                    'suffix'
                  ])
                }}
              </FormInput>
            </form>
          )
        case 'select':
          return (
            <FormSelect
              ref={selectRef}
              modelValue={inputValue.value}
              onUpdate:modelValue={
                ($event: any) => (inputValue.value = $event)
              }
              // v-bind 綁定屬性
              { ...bindAttributes.value }
              type={props.type}
              options={props.options}
              errorMessage={errorMessage.value}
              // v-on 接收事件
              onFocus={ (e: any) => onEvent.value.onFocus(e) }
              onClear={ () => onEvent.value.onClear() }
              onBlur={ (e: any) => onEvent.value.onBlur(e) }
              onChange={ (e: any) => onEvent.value.onChange(e) }
              onRemove-tag={ (e: any) => onEvent.value.onRemoveTag(e) }
              onVisible-change={ (e: boolean) => onEvent.value.onVisibleChange(e) }
            >
              {{ ...getTemplate(['prefix', 'empty']) }}
            </FormSelect>
          )
        case 'year':
        case 'month':
        case 'date':
        case 'dates':
        case 'datetime':
        case 'week':
        case 'datetimerange':
        case 'daterange':
        case 'monthrange':
          return (
            <FormDatePicker
              ref={datePickerRef}
              modelValue={inputValue.value}
              onUpdate:modelValue={
                ($event: any) => (inputValue.value = $event)
              }
              // v-bind 綁定屬性
              { ...bindAttributes.value }
              type={props.type}
              errorMessage={errorMessage.value}
              // v-on 接收事件
              onFocus={ (e: any) => onEvent.value.onFocus(e) }
              onBlur={ (e: any) => onEvent.value.onBlur(e) }
              onChange={ (e: any) => onEvent.value.onChange(e) }
            >
              {{ ...getTemplate(['default', 'range-separator']) }}
            </FormDatePicker>
          )
        case 'checkbox':
          return (
            <FormCheckbox
              modelValue={inputValue.value}
              onUpdate:modelValue={
                ($event: any) => (inputValue.value = $event)
              }
              // v-bind 綁定屬性
              { ...bindAttributes.value }
              label={props.label}
              options={props.options}
              errorMessage={errorMessage.value}
              onChange={ (e: any) => onEvent.value.onChange(e) }
            >
              {{ ...getTemplate(['default', 'option']) }}
            </FormCheckbox>
          )
        case 'radio':
          return (
            <FormRadio
              modelValue={inputValue.value}
              onUpdate:modelValue={
                ($event: any) => (inputValue.value = $event)
              }
              // v-bind 綁定屬性
              { ...bindAttributes.value }
              options={props.options}
              errorMessage={errorMessage.value}
              onChange={ (e: any) => onEvent.value.onChange(e) }
            >
              {{ ...getTemplate(['option']) }}
            </FormRadio>
          )
        case 'autocomplete':
          return (
            <FormAutocomplete
              ref={autocompleteRef}
              modelValue={inputValue.value}
              onUpdate:modelValue={
                ($event: any) => (inputValue.value = $event)
              }
              // v-bind 綁定屬性
              { ...bindAttributes.value }
              errorMessage={errorMessage.value}
              onSelect={ (e: any) => onEvent.value.onSelect(e) }
              onChange={ (e: any) => onEvent.value.onChange(e) }
            >
              {{
                ...getTemplate([
                  'prepend',
                  'append',
                  'prefix',
                  'suffix'
                ]),
                default: ({ item }) => {
                  return slots.default?.({ item })
                }
              }}
            </FormAutocomplete>
          )
        case 'operator':
          return (
            <FormOperator
              modelValue={inputValue.value}
              onUpdate:modelValue={
                ($event: any) => (inputValue.value = $event)
              }
              // v-bind 綁定屬性
              { ...bindAttributes.value }
              options={props.options}
              onlyNumber={props.onlyNumber}
              errorMessage={errorMessage.value}
              // v-on 接收事件
              onClear={ () => onEvent.value.onClear() }
              onChange={ (e: any) => onEvent.value.onChange(e) }
            >
              {{
                ...getTemplate([
                  // 'prepend',
                  'append',
                  'prefix',
                  'suffix'
                ]),
                default: ({ label, value }) => {
                  return slots.default?.({ label, value })
                }
              }}
            </FormOperator>
          )
        default:
          tipLog(`輸入框類型 ${props.type} 不存在`, [
            '以下為可用類型',
            'text', 'textarea', 'password', 'select',
            'year', 'month', 'date', 'dates', 'datetime', 'week',
            'datetimerange', 'daterange', 'monthrange',
            'checkbox', 'radio'
          ])
          return (
            <div></div>
          )
      }
    }

    return () => (
      <div
        class={[
          styles['input-container'],
          `input-${domValidateKey.value}-${validateRes.value}`,
          styles[`input-${props.direction}`]
        ]}
      >
        {
          !props.hiddenLabel && (
            <label class={styles['input-label']}>
              {
                props.isValidate && props.required && <span class={[
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
          {
            props.isValidate && <span class={styles['input-error']}>{ i18nErrorMessage.value }</span>
          }
        </div>
      </div>
    )
  }
})

export default CustomInput
