import {login, fetchCollections} from './api'
import {router} from '../main'
import store from '../store'
import Vue from 'vue'

export default {
  isAuthenticated: () => !!(localStorage.getItem('token') && localStorage.getItem('user')),

  login (credentials, redirect) {
    return login(credentials)
      .then(res => {
        if (res.status === 400 || res.status === 404) {
          const err = new Error()
          err.status = res.status
          throw err
        }
        this.loginViaTokenAndUser(res.token, res.user, '/my')
        this.getCollections(res.user, res.token)
      })
  },

  loginViaTokenAndUser (token, user, redirect) {
    store.setToken(token)
    store.setUser(user)
    store.setAuthentication(true)
    redirect ? router.go(redirect) : void (0)
  },

  // Fetch and cache user's collections
  getCollections (user, token) {
    fetchCollections(user.id, token)
      .catch(err => {
        console.log(err)
      })
  },

  logout () {
    store.clear()
    store.setAuthentication(false)
    delete Vue.http.options.headers['Authorization']
  }
}
