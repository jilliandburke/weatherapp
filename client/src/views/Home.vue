<template>
  <div class="home">
    <DynamicMenu />
  </div>
</template>

<script lang='ts'>
// @ is an alias to /src
import DynamicMenu from '@/components/DynamicMenu.vue'

export default {
  name: 'Home',
  components: {
    DynamicMenu
  }
}
</script>
