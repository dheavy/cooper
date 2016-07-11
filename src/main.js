import routeConfig from './route-config'
import VueValidator from 'vue-validator'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import App from './components/app'
import Vue from 'vue'

require('./services/filters')

Vue.use(VueResource)
Vue.use(VueRouter)
Vue.use(VueValidator)
Vue.validator('email', function (val) {
  return /\S+@\S+\.\S+/.test(val)
})

export const router = new VueRouter({
  history: true,
  saveScrollPosition: true
})

routeConfig(router)

router.start(App, 'app')
