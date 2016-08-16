<template>
  <validator name="loginValidation">
    <form novalidate class="col-sm-4 col-sm-offset-4">
      <h2>Log In</h2>

      <div class="alert alert-danger" v-if="error">{{error}}</div>
      <div class="alert alert-danger" v-if="submitted && $loginValidation.username.required">Username is required.</div>
      <div class="alert alert-danger" v-if="submitted && $loginValidation.username.minlength">Username is too short.</div>
      <div class="alert alert-danger" v-if="submitted && $loginValidation.password.required">Password is required.</div>
      <div class="alert alert-danger" v-if="submitted && $loginValidation.password.minlength">Password is too short.</div>

      <div class="form-group">
        <input
          type="text"
          class="form-control"
          placeholder="Username"
          v-model="credentials.username"
          v-validate:username="{required: true, minlength: 3}"
          v-on:keyup="resetValidation()"
        >
      </div>

      <div class="form-group">
        <input
          type="password"
          class="form-control"
          placeholder="Password"
          v-model="credentials.password"
          v-validate:password="{required: true, minlength: 6}"
          v-on:keyup="resetValidation()"
        >
      </div>

      <div class="form-group">
        <button class="btn btn-primary" v-on:click.prevent="submit()">Log In</button>
      </div>

      <div class="form-group">
        <a class="small" v-link="{path: '/password/reset'}">I forgot my username or password</a>
      </div>
    </form>
  </validator>
  <div class="form-group col-sm-4 col-sm-offset-4">
    <hr/>
    <button class="btn btn-secondary" v-on:click.prevent="fbAuth">
      Sign in with Facebook
    </button>
  </div>
</template>

<script>
  import facebookAuth from './FacebookAuth'
  import Validator from 'vue-validator'
  import auth from '../services/auth'
  import {router} from '../main'
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
        submitted: '',
        error: ''
      }
    },

    components: {Validator},

    methods: {
      fbAuth () {
        return facebookAuth.auth()
      },

      resetValidation () {
        this.submitted = false
        this.$resetValidation()
      },

      fbLoginUser ({token, user}) {
        store.setToken(token)
        store.setUser(user)
        router.go({path: '/my'})
      },

      submit () {
        this.submitted = true
        if (this.$loginValidation.valid) {
          this.error = ''
          const credentials = {
            username: this.credentials.username,
            password: this.credentials.password
          }

          auth
            .login(credentials, '/my')
            .catch(err => this.parseError(err))

          this.resetValidation()
        }
      },

      parseError (err) {
        if (+err.status === 404 || +err.status === 400) {
          this.error = 'Incorrect username or password.'
        } else {
          this.error = 'Oops... something went wrong, please try again.'
        }
      }
    }
  }
</script>
