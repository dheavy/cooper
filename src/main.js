import Vue from 'vue'
import App from './components/App'
import VueRouter from 'vue-router'
import Home from './components/Home'
import Login from './components/Login'
import VueResource from 'vue-resource'
import Logout from './components/Logout'
import Dashboard from './components/Dashboard'
import Register from './components/Register'
import PasswordReset from './components/PasswordReset'

Vue.use(VueResource)
Vue.use(VueRouter)

export const router = new VueRouter({
  history: true
})

router.map({
  '/': {
    component: Home
  },
  '/login': {
    component: Login
  },
  '/logout': {
    component: Logout
  },
  '/register': {
    component: Register
  },
  '/my': {
    component: Dashboard
  },
  '/password/reset': {
    component: PasswordReset
  }
})

router.redirect({
  '*': '/'
})

router.start(App, 'app')
