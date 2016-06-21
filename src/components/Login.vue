<template>
  <navigation :auth="false" :user-id="null"></navigation>
  <div class="col-sm-4 col-sm-offset-4">
    <h2>Log In</h2>
    <div class="alert alert-danger" v-if="error">
      <p>{{error}}</p>
    </div>
    <div class="form-group">
      <input type="text" class="form-control" placeholder="Username" v-model="credentials.username">
    </div>
    <div class="form-group">
      <input type="password" class="form-control" placeholder="Password" v-model="credentials.password">
    </div>
    <div class="form-group">
      <button class="btn btn-primary" v-on:click="submit()">Log In</button>
    </div>
    <div class="form-group">
    <a class="small" v-link="{path: '/password/reset'}">I forgot my username or password</a>
    </div>
  </div>
</template>

<script>
import navigation from './Navigation'
import auth from '../services/auth'
import store from '../store'

export default {
  name: 'Login',

  data () {
    return {
      store,
      credentials: {
        username: '',
        password: ''
      },
      error: ''
    }
  },

  components: {
    navigation
  },

  methods: {
    submit () {
      this.error = ''
      const credentials = {
        username: this.credentials.username,
        password: this.credentials.password
      }
      auth.login(this, credentials, '/my')
    },
    parseError (err) {
      if (+err.status === 404) {
        this.error = 'Incorrect username or password.'
      } else {
        this.error = 'Oops... something went wrong, please try again.'
      }
    }
  }
}
</script>
