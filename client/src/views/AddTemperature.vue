<template>
  <div>
    <form @submit.prevent="addTemperature" class="mb-3">
      <div v-if="error" class="alert alert-dismissible alert-warning">
        <button type="button" class="close" data-dismiss="alert">&times;</button>
        <h4 class="alert-heading">Error!</h4>
        <p class="mb-0">{{error}}</p>
      </div>
      <div class="form-group">
        <label for="time">Time</label>
        <validation-provider rules="required" v-slot="{ errors }">
          <input
            v-model="temperature.time"
            type="time"
            class="form-control"
            id="time" required>
          <ul>
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
            <ul>
              <li v-for='error in errors' :key='error'>
                {{ error }}
              </li>
            </ul>
        </validation-provider>
      </div>
      <div class="form-group">
        <label for="location">Location</label>
        <validation-provider rules="required|alpha_spaces|min_length:2" v-slot="{ errors }">
          <input
            v-model.trim="temperature.location"
            class="form-control"
            id="location">
          <ul>
            <li v-for='error in errors' :key='error'>
              {{ error }}
            </li>
          </ul>
        </validation-provider>
      </div>
      <button type="submit" class="btn btn-primary">Add Temperature</button>
    </form>
    <div class="temperature-list">
      <ul>
        <li class="temperature-entry" v-for='temp in temperatures' :key='temp._id'>
          {{temp.time}}
          {{temp.temperature}}
          {{temp.location}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import '../validation/formValidation'
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
    }
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

<style>
  form {
    margin-bottom: 70px;
  }

  .temperature-entry {
    list-style: none;
  }

  .form-control:focus::-webkit-input-placeholder {
    color: transparent;
  }

  .is-invalid {
    color: red;
  }
</style>
