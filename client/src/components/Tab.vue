<template lang="html">
  <div class='tab' v-show='isActive'>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Tab'
    }
  },
  data () {
    return {
      isActive: false
    }
  }
}
</script>

<style lang="scss">
  .tab {
    display: flex;
    flex-direction: row;
    width: 100%;
    padding-top: 0;
    margin-top: 0;
  }
</style>
