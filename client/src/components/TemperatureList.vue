<template>
  <div class='container'>
    <ul class="temperature-list">
      <li class="temperature-entry" v-for='(temp, index) in temperatures' :key='temp._id'>
        <div class='card-header'>
          <button type='button' class='remove-temp' v-on:click='deleteTemperature(temp, index)'> x </button>
        </div>
        <div class='card-body'>
          <p class='temp'>{{temp.temperature}}°</p>
          <div class="meta-details">
            <p class='location'>{{temp.location}}</p>
            <p class='time'>{{temp.time | moment("h:mm a")}}</p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang='ts'>
const BASE_URL = process.env.VUE_APP_API_URL

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
      fetch(BASE_URL + `/temperature/${temp._id}`, {
        method: 'DELETE'
      })
        .then((result: any) => {
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
            const tempAsDate: any = new Date(temp.time)
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
  .container {
    width: 100%;
  }

  .temperature-list {
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    justify-content: center;
    padding: 0 40px;
    margin-top: 40px;
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
    position: relative;
  }

  .temp {
    font-size: 70px;
    font-weight: 800;
    margin: 0 -30px -40px 0;
  }

  .location {
    padding: 0 25px;
    margin-top: 30px;
    margin-bottom: 5px;
    font-size: 22px;
    line-height: 1;
  }

  .time {
    margin-top: 0;
  }

  .card-header {
    display: flex;
    justify-content: flex-end;
    position: relative;
    height: 30px;
  }

  .card-body {
    padding-bottom: 10px;
  }

  .remove-temp {
    margin: 10px 15px;
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;
    position: relative;
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 20px;
    height: 25px;
    width: 25px;
    vertical-align: middle;
    padding-bottom: 4px;
  }
</style>
