import Vue from 'vue'
import App from './components/App'
import VueRouter from 'vue-router'
import Home from './components/Home'
import Login from './components/Login'
import VueResource from 'vue-resource'
import Logout from './components/Logout'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import Collections from './components/Collections'
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
    component: Dashboard,
    subRoutes: {
      '/collections': {
        name: 'collections',
        component: Collections
      }
    }
  },
  /* '/users/:uid': {
    subRoutes: {
      '/collections': {

      }
    }
  }, */
  '/password/reset': {
    component: PasswordReset
  }
})

router.redirect({
  '*': '/'
})

router.start(App, 'app')
