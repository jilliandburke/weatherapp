<template>
  <div class='menu-container'>
    <tabs>
      <tab title='All Cities'>
        <TemperatureList />
      </tab>
      <tab v-for='(location) in locations' :key='location' :title='location'>
        <cityView :location='location' />
      </tab>
    </tabs>
  </div>
</template>

<script>

import TemperatureList from '@/components/TemperatureList.vue'
import tabs from '@/components/Tabs.vue'
import tab from '@/components/Tab.vue'
import cityView from '@/components/CityView.vue'
const BASE_URL = process.env.VUE_APP_API_URL

export default {
  name: 'DynamicMenu',
  components: {
    TemperatureList,
    tabs,
    tab,
    cityView
  },
  data: () => ({
    temperatures: [],
    locations: []
  }),
  mounted () {
    fetch(BASE_URL + '/temperatures')
      .then(response => response.json())
      .then(result => {
        this.temperatures = result
        this.locations = this.getLocations(this.temperatures)
      })
  },
  methods: {
    getLocations (temps) {
      return temps.map(temp => temp.location)
        .filter((value, index, self) => self.indexOf(value) === index)
    }
  }
}
</script>

<style lang="scss" scoped>

  .menu-container {
    margin-top: 100px;
  }

</style>
