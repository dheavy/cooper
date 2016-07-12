import {router} from '../main'
import store from '../store'
import {login} from './api'
import Vue from 'vue'

export default {
  isAuthenticated: () => !!(localStorage.getItem('token') && localStorage.getItem('user')),

  login (credentials, redirect) {
    return login(credentials)
      .then(res => {
        this.loginViaTokenAndUser(res.token, res.user, '/my')
      })
  },

  loginViaTokenAndUser (token, user, redirect) {
    store.setToken(token)
    store.setUser(user)
    redirect ? router.go(redirect) : void (0)
  },

  logout () {
    store.clear()
    delete Vue.http.options.headers['Authorization']
  }
}
