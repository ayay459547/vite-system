<script setup lang="ts">
import { ref } from 'vue'

import { useFormSetting } from '@/lib/lib_columns'
import { scrollToEl, notification } from '@/lib/lib_utils' // 工具

import {
  FormInput,
  FormSelect,
  FormSelectV2,
  FormDatePicker,
  FormTimePicker,
  FormCheckbox,
  FormRadio,
  FormAutocomplete,
  FormOperator,
  CustomInput,
  CustomSearch
} from '@/components/input' // 系統組件: 輸入
import { CustomButton } from '@/components/feature' // 系統組件: 功能

import { columnSetting } from './columns'

const {
  columns: formColumn,
  forms: form,
  activeForms,
  activeConditions,
  conditions,
  reset: resetForm,
  validate: validateForm
} = useFormSetting<any>(columnSetting, 'filter')

const submit = () => {
  validateForm().then(successList => {
    notification({
      title: 'title',
      type: 'success',
      position: 'top-left',
      dangerouslyUseHTMLString: true,
      customClass: 'notification-container',
      message: `<div class="notification-message">${JSON.stringify(successList)}</div>`,
      showClose: true
    })

  }).catch(errorList => {
    notification({
      title: 'title',
      type: 'error',
      position: 'top-left',
      dangerouslyUseHTMLString: true,
      customClass: 'notification-container',
      message: `<div class="notification-message">${JSON.stringify(errorList)}</div>`,
      showClose: true
    })

    const error = errorList.find(errorItem => errorItem.el !== null)
    if (error) {
      const el = error.getDom()
      scrollToEl(el)
    }
  })
}
const value = ref('')
const options = [
  { label: '選項1', value: '1' },
  { label: '選項2', value: '2' },
  { label: '選項3', value: '3' }
]
</script>

<template>
  <div class="input-test grid-row">
    <div class="grid-col-xs-24">input 測試</div>
    <FormInput v-model="value"></FormInput>
    <FormInput
      v-model="form.input"
      v-bind="formColumn.input"
      class="grid-col-xs-8"
    >
      <template #prepend>prepend</template>
      <template #append>append</template>
      <template #prefix>prefix</template>
      <template #suffix>suffix</template>
    </FormInput>
    <CustomInput
      v-model="form.input"
      v-bind="formColumn.input"
      class="grid-col-xs-8"
    >
      <template #prepend>Pre</template>
      <template #append>App</template>
      <template #prefix>Pre</template>
      <template #suffix>Suff</template>
    </CustomInput>
    <CustomSearch
      v-model="form.input"
      v-model:active="activeForms.input"
      v-model:activeConditions="activeConditions.input"
      v-model:conditions="conditions.input"
      v-bind="formColumn.input"
      is-condition
      class="grid-col-xs-8"
    ></CustomSearch>

    <CustomInput
      v-model="form.number"
      v-bind="formColumn.number"
      class="grid-col-xs-8"
    >
      <template #prefix>prefix</template>
      <template #suffix>suffix</template>
    </CustomInput>
    <CustomInput
      v-model="form.number"
      v-bind="formColumn.number"
      text
      class="grid-col-xs-8"
    >
      <template #prefix>prefix</template>
      <template #suffix>suffix</template>
    </CustomInput>

    <CustomInput
      v-model="form.passowrd"
      v-bind="formColumn.passowrd"
      showPassword
      class="grid-col-xs-8"
    >
      <template #prepend>prepend</template>
      <template #append>append</template>
      <template #prefix>prefix</template>
      <template #suffix>suffix</template>
    </CustomInput>
    <CustomInput
      v-model="form.phone"
      v-bind="formColumn.phone"
      class="grid-col-xs-8"
    >
      <template #prepend>prepend</template>
      <template #append>append</template>
      <template #prefix>prefix</template>
      <template #suffix>suffix</template>
    </CustomInput>


    <div class="grid-col-xs-24">select 測試</div>
    <FormSelect v-model="value" :options="options"></FormSelect>
    <FormSelect
      v-model="form.select"
      v-bind="formColumn.select"
      class="grid-col-xs-8"
    >
      <template #label="{ label, value }">
        {{ `${label} (${value})` }}
      </template>
      <template #options="{ value }">
        {{ value }}
      </template>
      <template #header>header</template>
      <template #footer>footer</template>
      <template #prefix>prefix</template>
      <template #empty>empty</template>
      <template #tag>tag</template>
    </FormSelect>
    <CustomInput
      v-model="form.select"
      v-bind="formColumn.select"
      text
      class="grid-col-xs-8"
    >
      <template #label="{ label, value }">
        {{ `${label} (${value})` }}
      </template>
      <template #options="{ value }">
        {{ value }}
      </template>
      <template #header>header</template>
      <template #footer>footer</template>
      <template #prefix>prefix</template>
      <template #empty>empty</template>
      <template #tag>tag</template>
    </CustomInput>
    <CustomInput
      v-model="form.select"
      v-bind="formColumn.select"
      class="grid-col-xs-8"
    >
      <template #label="{ label, value }">
        {{ `${label} (${value})` }}
      </template>
      <template #options="{ value }">
        {{ value }}
      </template>
      <template #header>header</template>
      <template #footer>footer</template>
      <template #prefix>prefix</template>
      <template #empty>empty</template>
      <template #tag>tag</template>
    </CustomInput>


    <div class="grid-col-xs-24">selectv2 測試</div>
    <FormSelectV2
      v-model="form.selectv2"
      v-bind="formColumn.selectv2"
      class="grid-col-xs-8"
    >
      <template #label="{ label, value }">
        {{ `${label} (${value})` }}
      </template>
      <template #options="{ value }">
        {{ value }}
      </template>
      <template #header>header</template>
      <template #footer>footer</template>
      <template #prefix>prefix</template>
      <template #empty>empty</template>
      <template #tag>tag</template>
    </FormSelectV2>
    <CustomInput
      v-model="form.selectv2"
      v-bind="formColumn.selectv2"
      text
      class="grid-col-xs-8"
    >
      <template #label="{ label, value }">
        {{ `${label} (${value})` }}
      </template>
      <template #options="{ value }">
        {{ value }}
      </template>
      <template #header>header</template>
      <template #footer>footer</template>
      <template #prefix>prefix</template>
      <template #empty>empty</template>
      <template #tag>tag</template>
    </CustomInput>
    <CustomInput
      v-model="form.selectv2"
      v-bind="formColumn.selectv2"
      class="grid-col-xs-8"
    >
      <template #label="{ label, value }">
        {{ `${label} (${value})` }}
      </template>
      <template #options="{ value }">
        {{ value }}
      </template>
      <template #header>header</template>
      <template #footer>footer</template>
      <template #prefix>prefix</template>
      <template #empty>empty</template>
      <template #tag>tag</template>
    </CustomInput>


    <div class="grid-col-xs-24">date 測試</div>
    <FormDatePicker
      v-model="form.date"
      v-bind="formColumn.date"
      class="grid-col-xs-8"
    >
      <template #default="{ text }">{{ text }}</template>
      <template #prev-month>{{ '<' }}</template>
      <template #next-month>{{ '>' }}</template>
      <template #prev-year>{{ 'prev' }}</template>
      <template #next-year>{{ 'next' }}</template>
    </FormDatePicker>
    <CustomInput
      v-model="form.date"
      v-bind="formColumn.date"
      class="grid-col-xs-8"
    >
      <template #default="{ text }">{{ text }}</template>
      <template #prev-month>{{ '<' }}</template>
      <template #next-month>{{ '>' }}</template>
      <template #prev-year>{{ 'prev' }}</template>
      <template #next-year>{{ 'next' }}</template>
    </CustomInput>
    <CustomInput
      v-model="form.date"
      v-bind="formColumn.date"
      text
      class="grid-col-xs-8"
    >
      <template #default="{ text }">{{ text }}</template>
      <template #prev-month>{{ '<' }}</template>
      <template #next-month>{{ '>' }}</template>
      <template #prev-year>{{ 'prev' }}</template>
      <template #next-year>{{ 'next' }}</template>
    </CustomInput>

    <FormDatePicker
      v-model="form.daterange"
      v-bind="formColumn.daterange"
      class="grid-col-xs-8"
    ></FormDatePicker>
    <CustomInput
      v-model="form.daterange"
      v-bind="formColumn.daterange"
      class="grid-col-xs-8"
    >
      <template #range-separator>~</template>
      <template #prev-month>{{ 'prev' }}</template>
      <template #next-month>{{ 'next' }}</template>
      <template #prev-year>{{ '<' }}</template>
      <template #next-year>{{ '>' }}</template>
    </CustomInput>
    <CustomInput
      v-model="form.daterange"
      v-bind="formColumn.daterange"
      text
      class="grid-col-xs-8"
    >
      <template #range-separator>~</template>
      <template #prev-month>{{ 'prev' }}</template>
      <template #next-month>{{ 'next' }}</template>
      <template #prev-year>{{ '<' }}</template>
      <template #next-year>{{ '>' }}</template>
    </CustomInput>


    <div class="grid-col-xs-24">time 測試</div>
    <FormTimePicker
      v-model="form.time"
      v-bind="formColumn.time"
      class="grid-col-xs-8"
    ></FormTimePicker>
    <CustomInput
      v-model="form.time"
      v-bind="formColumn.time"
      class="grid-col-xs-8"
    ></CustomInput>
    <CustomInput
      v-model="form.time"
      v-bind="formColumn.time"
      text
      class="grid-col-xs-8"
    ></CustomInput>

    <FormTimePicker
      v-model="form.timerange"
      v-bind="formColumn.timerange"
      class="grid-col-xs-8"
    ></FormTimePicker>
    <CustomInput
      v-model="form.timerange"
      v-bind="formColumn.timerange"
      class="grid-col-xs-8"
    />
    <CustomInput
      v-model="form.timerange"
      v-bind="formColumn.timerange"
      text
      class="grid-col-xs-8"
    />


    <div class="grid-col-xs-24">autocomplete 測試</div>
    <FormAutocomplete
      v-model="form.autocomplete"
      v-bind="formColumn.autocomplete"
      class="grid-col-xs-8"
    >
      <template #default="{ item }">
        <div>
          <div class="value">{{ item?.value ?? 'value' }}</div>
          <div class="link">{{ item?.link ?? 'link' }}</div>
        </div>
      </template>
      <template #prepend>prepend</template>
      <template #append>append</template>
      <template #prefix>prefix</template>
      <template #suffix>suffix</template>
    </FormAutocomplete>
    <CustomInput
      v-model="form.autocomplete"
      v-bind="formColumn.autocomplete"
      class="grid-col-xs-8"
    >
      <template #default="{ item }">
        <div>
          <div class="value">{{ item?.value ?? 'value' }}</div>
          <div class="link">{{ item?.link ?? 'link' }}</div>
        </div>
      </template>
      <template #prepend>prepend</template>
      <template #append>append</template>
      <template #prefix>prefix</template>
      <template #suffix>suffix</template>
    </CustomInput>
    <CustomInput
      v-model="form.autocomplete"
      v-bind="formColumn.autocomplete"
      text
      class="grid-col-xs-8"
    >
      <template #default="{ item }">
        <div>
          <div class="value">{{ item?.value ?? 'value' }}</div>
          <div class="link">{{ item?.link ?? 'link' }}</div>
        </div>
      </template>
      <template #prepend>prepend</template>
      <template #append>append</template>
      <template #prefix>prefix</template>
      <template #suffix>suffix</template>
    </CustomInput>


    <div class="grid-col-xs-24">operator 測試</div>
    <FormOperator
      v-model="form.operator"
      v-bind="formColumn.operator"
      class="grid-col-xs-8"
    ></FormOperator>
    <CustomInput
      v-model="form.operator"
      v-bind="formColumn.operator"
      class="grid-col-xs-8"
    />
    <CustomInput
      v-model="form.operator"
      v-bind="formColumn.operator"
      text
      class="grid-col-xs-8"
    />


    <div class="grid-col-xs-24">select tree 測試</div>
    <CustomInput
      v-model="form.selectTree"
      v-bind="formColumn.selectTree"
      class="grid-col-xs-8"
    >
      <template #label="{ label, value }">
        {{ `${label} (${value})` }}
      </template>
      <template #options="{ value }">
        {{ value }}
      </template>
      <template #header>header</template>
      <template #footer>footer</template>
      <template #prefix>prefix</template>
      <template #empty>empty</template>
      <template #tag>tag</template>
    </CustomInput>
    <CustomInput
      v-model="form.selectTree"
      v-bind="formColumn.selectTree"
      text
      class="grid-col-xs-8"
    >
      <template #label="{ label, value }">
        {{ `${label} (${value})` }}
      </template>
      <template #options="{ value }">
        {{ value }}
      </template>
      <template #header>header</template>
      <template #footer>footer</template>
      <template #prefix>prefix</template>
      <template #empty>empty</template>
      <template #tag>tag</template>
    </CustomInput>

    <div class="grid-col-xs-24">checkbox 測試</div>
    <FormCheckbox
      v-model="form.checkbox"
      v-bind="formColumn.checkbox"
      class="grid-col-xs-8"
    ></FormCheckbox>
    <CustomInput
      v-model="form.checkbox"
      v-bind="formColumn.checkbox"
      class="grid-col-xs-8"
    ></CustomInput>
    <CustomInput
      v-model="form.checkbox"
      v-bind="formColumn.checkbox"
      text
      class="grid-col-xs-8"
    ></CustomInput>

    <FormCheckbox
      v-model="form.checkboxMultiple"
      v-bind="formColumn.checkboxMultiple"
      class="grid-col-xs-8"
    ></FormCheckbox>
    <CustomInput
      v-model="form.checkboxMultiple"
      v-bind="formColumn.checkboxMultiple"
      class="grid-col-xs-8"
    ></CustomInput>
    <CustomInput
      v-model="form.checkboxMultiple"
      v-bind="formColumn.checkboxMultiple"
      text
      class="grid-col-xs-8"
    ></CustomInput>

    <div class="grid-col-xs-24">redio 測試</div>
    <FormRadio
      v-model="form.radio"
      v-bind="formColumn.radio"
      radio-type="radio"
      class="grid-col-xs-8"
    ></FormRadio>
    <CustomInput
      v-model="form.radio"
      v-bind="formColumn.radio"
      radio-type="radio"
      class="grid-col-xs-8"
    ></CustomInput>
    <CustomInput
      v-model="form.radio"
      v-bind="formColumn.radio"
      radio-type="button"
      class="grid-col-xs-8"
    ></CustomInput>
    <CustomInput
      v-model="form.radio"
      v-bind="formColumn.radio"
      text
      class="grid-col-xs-8"
    ></CustomInput>

    <div class="input-btn">
      <CustomButton label="重置" class="i-mb-md" @click="resetForm" />

      <CustomButton label="提交" @click="submit" />
    </div>
  </div>
</template>

<style lang="scss">
.notification {
  &-container {
    width: 300px;
    // width: fit-content;
    // max-width: 30vw;
  }
  &-message {
    width: 100%;
    height: 100%;
    max-height: 90vh;
    word-break: break-all;
    overflow: auto;
    font-size: 1.3em;
    letter-spacing: 5px;
  }
}
.input {
  &-test {
    width: 100%;
    height: 100%;
    padding: 16px;
    columns: 400px;
  }

  &-btn {
    display: flex;
    gap: 8px;
  }
}
</style>
