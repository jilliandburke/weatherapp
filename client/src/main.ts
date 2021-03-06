import Vue from 'vue'
import App from './App.vue'
import router from './router'
import moment from 'vue-moment'

Vue.config.productionTip = false
Vue.use(moment)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
