import routeConfig from './route-config'
import VueResource from 'vue-resource'
// import vueMasonry from './components/Masonry'
import VueRouter from 'vue-router'
import App from './components/app'
import Vue from 'vue'

require('./services/validators')
require('./services/filters')

Vue.use(VueResource)
Vue.use(VueRouter)

export const router = new VueRouter({
  history: true,
  saveScrollPosition: true
})

routeConfig(router)

router.start(App, 'app')
