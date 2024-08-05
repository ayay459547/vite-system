<script setup lang="ts">
import { useFormSetting } from '@/lib/lib_columns'
import { scrollToEl, isEmpty } from '@/lib/lib_utils'
import { CustomInput, CustomButton } from '@/components'

const columnSetting = {
  autocomplete: {
    label: '搜尋',
    filter: {
      type: 'autocomplete',
      default: null,
      required: true
    }
  },
  operator: {
    label: '條件',
    filter: {
      type: 'operator',
      default: ['', ''],
      options: [
        { label: '=', value: 'equal' },
        { label: '>=', value: 'greatthan' },
        { label: '<=', value: 'lessthan' }
      ],
      required: true,
      onlyNumber: true
    }
  },
  passowrd: {
    label: '密碼',
    filter: {
      type: 'password',
      default: null,
      validate: ['password'],
      required: true
    }
  },
  phone: {
    label: '手機',
    filter: {
      type: 'text',
      default: null,
      validate: ['phone'],
      required: false
    }
  },
  date: {
    label: '選擇日期',
    filter: {
      type: 'date',
      default: null,
      required: true
    }
  },
  daterange: {
    label: '選擇日期區間',
    filter: {
      type: 'daterange',
      default: [],
      required: true
    }
  },
  timerange: {
    label: '選擇時間區間',
    filter: {
      type: 'timerange',
      default: ['', ''],
      required: true
    }
  },
  select: {
    label: '選擇框',
    filter: {
      type: 'select',
      default: null,
      required: true,
      options: [
        { label: 'test1', value: '0' },
        { label: 'test2', value: '1' },
        { label: 'test3', value: '2' }
      ]
    }
  },
  checkbox: {
    label: '多選',
    filter: {
      type: 'checkbox',
      default: [],
      required: true,
      options: [
        { label: 'checkbox1', value: 0 },
        { label: 'checkbox2', value: 1 },
        { label: 'checkbox3', value: 2 },
        { label: 'checkbox4', value: 3 }
      ]
    }
  },
  radio: {
    label: '單選',
    filter: {
      type: 'radio',
      default: null,
      required: true,
      options: [
        { label: 'radio1', value: 0 },
        { label: 'radio2', value: 1 },
        { label: 'radio3', value: 2 }
      ]
    }
  }
}

interface Form {
  autocomplete?: string
  operator?: [string, string]
  passowrd?: string
  phone?: string
  date?: string
  daterange?: [string, string]
  timerange?: any
  select?: string
  checkbox?: []
  radio?: number
}

const {
  columns: formColumn,
  forms: form,
  reset: resetForm,
  validate: validateForm
} = useFormSetting<Form>(columnSetting, 'filter')

const submit = () => {
  validateForm()
    .then(successList => {
      console.log('vee success => ', successList)
    })
    .catch(errorList => {
      console.log('vee error => ', errorList)
      const error = errorList.find(errorItem => {
        return errorItem.el !== null
      })
      if (error) {
        const el = error.getDom()
        scrollToEl(el)
      }
    })
}

const list = [
  { value: 'vue', link: 'https://github.com/vuejs/vue' },
  { value: 'element', link: 'https://github.com/ElemeFE/element' },
  { value: 'cooking', link: 'https://github.com/ElemeFE/cooking' },
  { value: 'mint-ui', link: 'https://github.com/ElemeFE/mint-ui' },
  { value: 'vuex', link: 'https://github.com/vuejs/vuex' },
  { value: 'vue-router', link: 'https://github.com/vuejs/vue-router' },
  { value: 'babel', link: 'https://github.com/babel/babel' }
]

const fetchSuggestions = (queryString: string, cb: (data: any[]) => void) => {
  if (isEmpty(queryString)) {
    cb([])
    return
  }
  const results = list.filter(item => {
    return item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
  })

  cb(results)
}
</script>

<template>
  <div class="input-test">
    <CustomInput
      v-model="form.autocomplete"
      v-bind="formColumn.autocomplete"
      :fetch-suggestions="fetchSuggestions"
    >
      <template #default="{ item }">
        <div>
          <div class="value">{{ item?.value ?? 'value' }}</div>
          <div class="link">{{ item?.link ?? 'link' }}</div>
        </div>
      </template>
    </CustomInput>

    <CustomInput v-model="form.operator" v-bind="formColumn.operator" />

    <CustomInput v-model="form.passowrd" v-bind="formColumn.passowrd" />

    <CustomInput v-model="form.phone" v-bind="formColumn.phone" />

    <CustomInput v-model="form.select" v-bind="formColumn.select" />

    <CustomInput v-model="form.date" v-bind="formColumn.date" />

    <CustomInput v-model="form.daterange" v-bind="formColumn.daterange" />

    <CustomInput v-model="form.timerange" v-bind="formColumn.timerange" />

    <CustomInput v-model="form.checkbox" v-bind="formColumn.checkbox" />

    <CustomInput v-model="form.radio" v-bind="formColumn.radio" />

    <div class="input-btn">
      <CustomButton label="重置" class="i-mb-md" @click="resetForm" />

      <CustomButton label="提交" @click="submit" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.input {
  &-test {
    width: 100%;
    height: 100%;
    padding: 32px;
  }

  &-btn {
    display: flex;
    gap: 8px;
  }
}
</style>
