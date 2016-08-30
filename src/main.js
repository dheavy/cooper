import routeConfig from './route-config'
import VueRouter from 'vue-router'
import App from './components/app'
import Vue from 'vue'

require('./services/validators')
require('./services/filters')

Vue.use(VueRouter)

export const router = new VueRouter({
  history: true
})

routeConfig(router)

router.start(App, 'app')
