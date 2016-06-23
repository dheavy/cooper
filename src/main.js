import Vue from 'vue'
import App from './components/app'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import routeConfig from './route-config'
import VueValidator from 'vue-validator'

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
