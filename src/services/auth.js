import {requestBody, headers} from './utils'
import {LOGIN_URL} from '../constants/api'
import {router} from '../main'
import store from '../store'
import Vue from 'vue'

export default {
  isAuthenticated: () => !!(localStorage.getItem('token') && localStorage.getItem('user')),

  login (context, credentials, redirect) {
    context.$http
      .post(LOGIN_URL, requestBody(credentials), headers())
      .then(res => {
        this.loginViaTokenAndUser(res.data.token, res.data.user, '/my')
      })
      .catch(err => {
        context.parseError(err)
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
