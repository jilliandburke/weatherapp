<template>
  <div class="home">
    <TemperatureList />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import TemperatureList from '@/components/TemperatureList.vue'

export default {
  name: 'Home',
  components: {
    // HelloWorld,
    TemperatureList
  }
}
</script>
