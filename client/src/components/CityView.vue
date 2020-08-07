<template>
  <div class='container'>
    <div class="latest-temp">
      <div class='card'>
        <div class="card-header"></div>
        <div class='card-body'>
          <p class='temp'>{{tempsForLocation[0].temperature}}°</p>
          <p class='location'>{{tempsForLocation[0].location}}</p>
          <p class='time'>{{tempsForLocation[0].time | moment("h:mm a")}}</p>
        </div>
      </div>
    </div>
    <div v-if='tempsForLocation.length > 1' class='history-table'>
      <h2>Temperature history for {{ location }}</h2>
      <table>
        <thead>
          <tr>
            <th>Temperature</th>
            <th>Time</th>
            <th>Date Recorded</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for='(temp, index) in tempsForLocation.slice(1)' :key='temp'>
            <td>{{ temp.temperature }}°</td>
            <td>{{ temp.time | moment("h:mm a") }}</td>
            <td>{{ temp.createdAt | moment('dddd, MMMM Do YYYY') }}</td>
            <td>
              <button class="delete" v-on:click='deleteTemperature(temp, index)'>Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class='no-history'>
      <h3>There are no previously recorded temperatures for this city.</h3>
    </div>
  </div>
</template>

<script lang='ts'>
const BASE_URL = process.env.VUE_APP_API_URL

export default {
  name: 'cityView',
  props: ['location'],
  data: () => ({
    tempsForLocation: []
  }),
  mounted () {
    fetch(BASE_URL + '/temperatures')
      .then(response => response.json())
      .then(result => {
        this.temperatures = result
        this.tempsForLocation = this.getTempsForLocation(this.temperatures, this.$props.location)
      })
  },
  methods: {
    getTempsForLocation (temps, location) {
      return temps.filter(t => t.location === location)
        .sort((a, b) => {
          const dateA: any = new Date(a)
          const dateB: any = new Date(a)
          return dateA - dateB
        })
    },
    deleteTemperature (temp, i) {
      console.log(i)
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
            this.tempsForLocation.splice(i + 1, 1)
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0 auto;
  }

  .latest-temp {
    display: flex;
    justify-content: center;
    margin-top: 50px;

    .card {
      padding: 20px;
      margin: 10px;
      min-height: 100px;
      min-width: 200px;
      align-content: center;
      background-color: rgba(255, 255, 255, 0.3);
      border-radius: 4px;
      box-shadow: 2px 2px 6px 0px  rgba(0, 0, 0, 0.3);
      padding: 20px;
    }

    .temp {
      font-size: 70px;
      font-weight: 800;
      margin: 0 -30px -40px 0;
    }

    .card-header {
      display: flex;
      justify-content: flex-end;
      position: relative;
      height: 15px;
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

    .card-body {
      padding-bottom: 10px;
    }

    .remove-temp {
      text-decoration: none;
      margin: 10px 15px;
      color: #fff;
    }
  }

  .no-history {
    margin: 70px 0 50px 0;
  }

  .history-table {
    display: flex;
    flex-direction: column;
    margin: 30px 0 50px 0;
    align-content: center;

    table {
      min-width: 70%;
      align-self: center;
      border-collapse: collapse;

      th {
        border-right: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        padding: 7px;

        &:last-child {
          border-right: 0;
        }
      }

      td {
        border-right: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        padding: 7px;

        &:last-child {
          border-right: 0;
        }
      }
    }

    h2 {
      margin-bottom: 40px;
      text-decoration: underline;
    }

    .delete {
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
      border-radius: 8px;
      vertical-align: middle;
      padding: 7px 15px;
      box-shadow: 0px 4px 4px -1px rgba(0, 0, 0, 0.3);

      &:hover {
        background-color: rgba(0, 0, 0, 0.15);
      }
    }
  }
</style>
