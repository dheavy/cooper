import Vue from 'vue'

const store = new Vue({
  name: 'Store',

  data () {
    return {
      state: {
        user: null,
        token: null
      }
    }
  },

  methods: {
    setUser ({id, username, email, last_login, date_joined}) {
      this.state.user = {
        id, username, email,
        lastLogin: last_login,
        dateJoined: date_joined
      }
      localStorage.setItem('user', JSON.stringify(this.state.user))
    },

    getUser () {
      return this.state.user || JSON.parse(localStorage.getItem('user'))
    },

    setToken (token) {
      this.state.token = token
      localStorage.setItem('token', token)
    },

    getToken () {
      return this.state.token || localStorage.getItem('token')
    },

    clear () {
      this.state.user = null
      this.state.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
  }
})

export default store

Vue.component('store', store)
