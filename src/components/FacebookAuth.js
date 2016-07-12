import {fbAuth, fbCheckUser} from '../services/api'
import Vue from 'vue'

const facebookAuth = new Vue({
  methods: {
    auth (token) {
      return fbAuth(token)
    },

    checkUser (payload) {
      return fbCheckUser(payload)
    }
  }
})

export default facebookAuth
