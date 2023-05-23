<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, onMounted } from 'vue'
import { CustomButton } from '@/components'

const props = defineProps({
  title: {
    type: String as PropType<string>,
    required: false,
    default: ''
  }
})

const emit = defineEmits([
  'update:modelValue',
  'cancel',
  'submit'
])

const cancel = () => {
  emit('cancel')
}

const submit = () => {
  emit('submit')
}

const isShow = ref(false)

onMounted(() => {
  isShow.value = true
})

</script>

<template>
  <div class="modal-wrapper">
    <Transition v-show="isShow" name="bounce">
      <div class="modal-container">
        <div class="modal-header">
          <slot name="header">
            <h3>{{ props.title }}</h3>
          </slot>
          <CustomButton
            icon-name="close"
            text
            @click="cancel"
          />
        </div>

        <div class="modal-body">
          <slot>Body</slot>
        </div>

        <div class="modal-footer">
          <slot name="footer">
            <div class="modal-footer-btn">
              <CustomButton
                label="取消"
                icon-name="angle-left"
                icon-move="translate"
                @click="cancel"
              />
              <CustomButton
                type="success"
                label="確認"
                icon-name="check"
                icon-move="scale"
                @click="submit"
              />
            </div>
          </slot>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>

.modal {
  &-wrapper {
    width: 100vw;
    height: 100vh;
    position: fixed;
    z-index: 10;
    left: 0;
    top: 0;
    background-color: #00000066;

    @extend %flex-center;
  }
  &-container {
    width: 80%;
    height: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    border: 1px solid #fff;
  }

  &-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 8px;
    height: 40px;
    border-bottom: 1px solid #d6d6d6;
  }

  &-body {
    width: 100%;
    padding: 16px;
    flex: 1;
  }

  &-footer {
    width: 100%;
    height: 48px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 8px;
    border-top: 1px solid #d6d6d6;

    &-btn {
      display: flex;
      gap: 12px;
    }
  }
}
</style>