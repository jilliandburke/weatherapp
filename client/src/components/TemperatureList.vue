<template>
  <div>
    <ul class="temperature-list">
      <li class="temperature-entry" v-for='(temp, index) in temperatures' :key='temp._id'>
        <div class='card-header'>
          <a href='' @click.prevent="openThread" class='remove-temp' v-on:click='deleteTemperature(temp, index)'> x </a>
        </div>
        <div class='card-body'>
          <p class='temp'>{{temp.temperature}}</p>
          <p class='location'>{{temp.location}}</p>
          <p class='time'>{{temp.time | moment("h:mm a")}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
const BASE_URL = process.env.VUE_APP_API_URL

console.log(process.env.VUE_APP_API_URL)

export default {
  name: 'TemperatureList',
  data: () => ({
    error: '',
    temperatures: []
  }),
  computed: {
  },
  mounted () {
    fetch(BASE_URL + '/temperatures')
      .then(response => response.json())
      .then(result => {
        this.temperatures = this.latestTemps(result)
      })
  },
  methods: {
    deleteTemperature (temp, i) {
      fetch(BASE_URL + `/temperature/${temp.id}`, {
        method: 'DELETE'
      })
        .then(result => {
          if (result.details) {
            // there was an error...
            const error = result.details
              .map(detail => detail.message)
              .join('. ')
            this.error = error
          } else {
            this.error = ''
            this.temperatures.splice(i, 1)
          }
        })
    },
    latestTemps (temps) {
      const finalTemps = []
      const Now = new Date().getTime()
      const locations = temps.map(temp => temp.location)
        .filter((value, index, self) => self.indexOf(value) === index)

      locations.forEach(location => {
        const diffs = []
        const cityTemps = temps.filter(t => t.location === location)

        if (cityTemps.length === 1) {
          finalTemps.push(cityTemps[0])
        } else {
          cityTemps.forEach((temp, index) => {
            const tempAsDate = new Date(temp.time)
            diffs.push({
              diff: Now - tempAsDate,
              index: index
            })
          })
          finalTemps.push(cityTemps[diffs.sort()[0].index])
        }
      })

      return finalTemps
    }
  }
}
</script>

<style lang="scss" scoped>
  .temperature-list {
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    justify-content: center;
    padding: 0 40px;
    // color: #fff;
  }

  .temperature-entry {
    flex: 0 0 200px;
    flex-wrap: wrap;
    margin: 10px;
    min-height: 100px;
    align-content: center;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    box-shadow: 2px 2px 6px 0px  rgba(0, 0, 0, 0.3);
    list-style: none;
  }

  .temp {
    font-size: 40px;
    line-height: 0;
    font-weight: 800;
    margin: 0;
  }

  .location {
    margin-top: 25px;
  }

  .time {
    margin-top: 0;
  }

  .card-header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
  }

  .card-body {
    padding-bottom: 10px;
  }

  .remove-temp {
    text-decoration: none;
    margin: 10px 15px;
    color: #fff;
  }
</style>
