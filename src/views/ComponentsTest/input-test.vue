<script setup lang="ts">
import { ref, inject } from 'vue'
import { ElOption } from 'element-plus'
// import { useI18n } from 'vue-i18n'

// const { t } = useI18n({ useScope: 'global' })
// console.log(t)

const value = ref<string>('')
const valuePhone = ref<string>('')
const locale = inject('locale')

const valueSelect = ref<string>('')
const list = [
  {
    label: 'test1',
    value: '0'
  },
  {
    label: 'test2',
    value: '1'
  },
  {
    label: 'test3',
    value: '2'
  }
]

</script>

<template>
  <div class="input-test">
    <h1 class="i-mb-md">{{ $t('test') }}</h1>
    <h2 class="i-mb-md">{{ locale }}</h2>
    <FormInput
      v-model="value"
      label="測試密碼"
      required
      :validate="['password']"
    />
    <FormInput
      v-model="valuePhone"
      label="測試phone"
      :validate="['phone']"
    />

    <FormSelect
      v-model="valueSelect"
      label="測試select"
      :options="list"
    />

    <FormSelect
      v-model="$i18n.locale"
      label="測試select"
      :options="list"
    >
      <ElOption
        v-for="locale in $i18n.availableLocales"
        :key="`locale-${locale}`"
        :label="locale"
        :value="locale"
      />
    </FormSelect>

    <div class="locale-changer">
      <select v-model="$i18n.locale">
        <option
          v-for="locale in $i18n.availableLocales"
          :key="`locale-${locale}`"
          :value="locale"
        >
          {{ locale }}
        </option>
      </select>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.input-test {
  width: 100%;
  height: 100%;
  padding: 32px;
}
</style>