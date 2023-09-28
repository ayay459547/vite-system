# CustomDrawer
### 使用範例
```vue
<script setup lang="ts">
import type { ButtonSize } from '@/components'
import { CustomButton } from '@/components'
import { ref } from 'vue'

const test = () => {
  console.log('test click')
}
const size: ButtonSize = 'large'
</script>

<template>
  <div>
    <CustomButton label="開啟Drawer" @click="isShow = true"/>
  
    <CustomDrawer
      v-model="isShow"
      title="title"
    >
      <template #header>
        <div class="fill-x border-info">
          header
        </div>
      </template>
      <template #footer>
        <div>footer</div> 
      </template>
      <span>Hi there!</span>
    </CustomDrawer>
  </div>
</template>
```

## Element UI Plus
[https://element-plus.org/en-US/component/drawer.html](https://element-plus.org/en-US/component/drawer.html)


