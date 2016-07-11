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
    setUser ({id, username, email, last_login, date_joined, followers, following, blocking, collections_followed, collections_blocked}) {
      this.state.user = {
        id, username, email,
        lastLogin: last_login,
        dateJoined: date_joined,
        collectionsFollowed: collections_followed,
        collectionsBlocked: collections_blocked,
        followers, following,
        blocking
      }
      localStorage.setItem('user', JSON.stringify(this.state.user))
    },

    getUser () {
      return this.state.user || JSON.parse(localStorage.getItem('user'))
    },

    updateUser (newUser) {
      const oldUser = this.getUser()
      const user = Object.assign({}, oldUser, newUser)

      // Rename properties to fit the setter's arguments.
      user.collections_blocked = user.collectionsBlocked
      user.collections_followed = user.collectionsFollowed
      user.last_login = user.lastLogin
      user.date_joined = user.dateJoined
      this.setUser(user)
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
