<template>
  <div class='container'>
    <div class='success' v-if='successful === true'>
      <p>Temperature Successfully Added!</p>
    </div>
    <form @submit.prevent="addTemperature" class="mb-3">
      <div class="form-group">
        <label for="time">Time</label>
        <validation-provider rules="required" v-slot="{ errors }">
          <input
            v-model="temperature.time"
            type="time"
            class="form-control"
            id="time" required>
          <ul class='errors'>
            <li v-for='error in errors' :key='error'>
              {{ error }}
            </li>
          </ul>
        </validation-provider>
      </div>
      <div class="form-group">
        <label for="temperature">Temperature</label>
        <validation-provider rules="required|min_value:-88|max_value:50|integer" v-slot="{ errors }">
          <input
            v-model="temperature.temperature"
            type="number"
            class="form-control"
            id="temperature" required>
          <ul class='errors' >
            <li v-for='error in errors' :key='error'>
              {{ error }}
            </li>
          </ul>
        </validation-provider>
      </div>
      <div class="form-group">
        <label for="location">Location</label>
        <validation-provider rules="required|alpha_spaces" v-slot="{ errors }">
          <input
            v-model.trim="temperature.location"
            class="form-control"
            id="location">
          <ul class='errors'>
            <li v-for='error in errors' :key='error'>
              {{ error }}
            </li>
          </ul>
        </validation-provider>
      </div>
      <button type="submit" class="submit-button" @click='successful = true'>Add Temperature</button>
    </form>
  </div>
</template>

<script lang='ts'>
import moment from 'moment'
import { ValidationProvider, extend, configure } from 'vee-validate'
import * as rules from 'vee-validate/dist/rules'
import { messages } from 'vee-validate/dist/locale/en.json'
const BASE_URL = process.env.VUE_APP_API_URL

for (const [rule, validation] of Object.entries(rules)) {
  extend(rule, {
    ...validation,
    message: messages[rule]
  })
}

configure({
  classes: {
    valid: 'is-valid',
    invalid: 'is-invalid',
    dirty: 'is-dirty'
  }
})

export default {
  name: 'addTemperature',
  components: {
    ValidationProvider
  },
  data: () => ({
    error: '',
    temperatures: [],
    temperature: {
      time: '',
      temperature: '',
      location: ''
    },
    successful: false
  }),
  mounted () {
    fetch(BASE_URL + '/temperatures')
      .then(response => response.json())
      .then(result => {
        this.temperatures = result
      })
  },
  methods: {
    addTemperature () {
      console.log(this.temperature)
      const temp = {
        time: this.convertTimeToISO(this.temperature.time),
        temperature: this.temperature.temperature,
        location: this.temperature.location
      }
      console.log(temp)
      fetch(BASE_URL + '/temperatures', {
        method: 'POST',
        body: JSON.stringify(temp),
        headers: {
          'content-type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(result => {
          if (result.details) {
            // there was an error...
            const error = result.details
              .map(detail => detail.message)
              .join('. ')
            this.error = error
          } else {
            this.error = ''
            this.temperatures.unshift(result)
          }
        })
    },
    convertTimeToISO (time) {
      const isoStart = moment().format('YYYY-MM-DD')
      const isoMiddle = time
      const isoEnd = moment().format('SSZZ')

      return `${isoStart}T${isoMiddle}:${isoEnd}`
    }
  }
}
</script>

<style lang='scss' scoped>
  .container {
    margin-top: 120px;
    align-items: center;
    display: flex;
    flex-direction: column;
  }

  .temperature-entry {
    list-style: none;
  }

  form {
    margin-top: 20px;
    margin-bottom: 70px;
    align-content: center;

    .form-group {
      text-align: left;

      .label {
        display: block;
      }

      .form-control {
        border-radius: 4px;
        display: block;
        border: 1px solid #ccc;
        padding: 5px 15px;
        min-width: 200px;
      }
    }

    .submit-button {
      margin: 30px 15px 10px 15px;
      background: none;
      color: inherit;
      border: none;
      padding: 0;
      font: inherit;
      cursor: pointer;
      outline: inherit;
      position: relative;
      background-color: #42b983;
      color: #fff;
      border-radius: 8px;
      vertical-align: middle;
      padding: 10px 20px;
      box-shadow: 0px 4px 4px -1px rgba(0, 0, 0, 0.3);

      &:hover {
        background-color: #36966b
      }
    }

    .errors {
      list-style: none;
      padding-left: 0;
      font-size: 14px;
      margin: 5px auto;
      text-align: center;
      color: red;
      max-width: 200px;
    }
  }

  .success p {
    padding: 15px 25px;
    background-color: #d4edda;
    color: #155724;
    border-radius: 8px;
    border-color: #c3e6cb;
  }
</style>
