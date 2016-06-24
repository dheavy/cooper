<template>
  <navigation :auth="false" :user-id="null"></navigation>
  <facebook-auth></facebook-auth>

  <div v-if="loading">
    <h2>Signing in via Facebook... </h2>
  </div>
  <div v-else>
    <validator name="registerValidation">
      <form novalidate class="col-sm-4 col-sm-offset-4">
        <h2>Register</h2>

        <div class="alert alert-danger" v-if="error">{{{error}}}</div>

        <div class="form-group" v-bind:class="[usernameAvailable !== null ? (usernameAvailable ? classHasSuccess : classHasDanger) : '']">
          <input
            type="text"
            class="form-control"
            placeholder="Username"
            v-model="credentials.username"
            v-validate:username="{required: true, minlength: 3}"
            v-on:keyup="checkUsername | debounce 250"
            v-bind:class="[usernameAvailable !== null ? (usernameAvailable ? classFormControlSuccess : classFormControlDanger) : '']"
          >
        </div>

        <div class="form-group" v-bind:class="[isEmailValid !== null ? (isEmailValid ? classHasSuccess : classHasWarning) : '']">
          <input
            type="email"
            class="form-control"
            placeholder="Email"
            v-model="credentials.email"
            v-validate:email="{email: true}"
            v-bind:class="[isEmailValid !== null ? (isEmailValid ? classFormControlSuccess : classFormControlWarning) : '']"
          >
        </div>

        <div class="form-group" v-bind:class="[isPasswordValid !== null ? (isPasswordValid ? classHasSuccess : classHasWarning) : '']">
          <input
            type="password"
            class="form-control"
            placeholder="Password"
            v-model="credentials.password"
            v-validate:password="{required: true, minlength: 6}"
            v-bind:class="[isPasswordValid !== null ? (isPasswordValid ? classFormControlSuccess : classFormControlWarning) : '']"
          >
        </div>

        <div class="form-group" v-bind:class="[isPasswordConfirmValid !== null ? (isPasswordConfirmValid ? classHasSuccess : classHasWarning) : '']">
          <input
            type="password"
            class="form-control"
            placeholder="Confirm password"
            v-model="credentials.confirmPassword"
            v-validate:confirm-password="{required: true, minlength: 6}"
            v-bind:class="[isPasswordConfirmValid !== null ? (isPasswordConfirmValid ? classFormControlSuccess : classFormControlWarning) : '']"
          >
        </div>

        <div class="form-group">
          <button class="btn btn-primary" v-on:click.prevent="submit()">Log In</button>
        </div>

        <div class="form-group">
          <span class="small">
            <a v-link="{path: '/login'}">Log in</a> or
            <a href="#" v-on:click.prevent="fbAuthInit()">register via Facebook</a>
          </span>
        </div>
      </form>
    </validator>
  </div>
</template>

<script>
import registration from '../services/registration'
import facebookAuth from './FacebookAuth'
import navigation from './Navigation'
import validator from 'vue-validator'
import {router} from '../main'
import store from '../store'
import _ from 'lodash'

export default {
  name: 'Register',

  data () {
    return {
      store,
      loading: false,
      credentials: {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      classHasSuccess: 'has-success',
      classHasWarning: 'has-warning',
      classHasDanger: 'has-danger',
      classFormControlSuccess: 'form-control-success',
      classFormControlWarning: 'form-control-warning',
      classFormControlDanger: 'form-control-danger',
      usernameAvailable: null,
      submitted: '',
      error: ''
    }
  },

  components: {
    navigation, validator, facebookAuth
  },

  methods: {
    checkUsername () {
      if (this.credentials.username.length > 2) {
        registration.checkUsername(this, this.credentials.username)
      } else {
        this.usernameAvailable = null
      }
    },

    fbAuthInit () {
      return facebookAuth.auth()
    },

    fbAuthContinue (token) {
      return facebookAuth.auth(token)
    },

    fbCheckUser (payload) {
      return facebookAuth.checkUser(payload)
    },

    submit () {
      this.error = ''
      if (this.$registerValidation.valid) {
        registration.register(this, this.credentials)
      }
    },

    parseError (err) {
      if (err) {
        const parsed = typeof err.data.error === 'string'
          ? JSON.parse(err.data.error.split("'").join('"'))
          : err.data.error

        if (parsed) {
          for (const prop in parsed) {
            this.error += `${_.capitalize(prop)}: ${parsed[prop][0]} <br>`
          }
        }
        return
      }
      this.error = 'Oops... something went wrong, please try again.'
    }
  },

  computed: {
    isPasswordValid () {
      if (this.credentials.password.length === 0) return null
      return this.$registerValidation.password && this.$registerValidation.password.valid
    },

    isPasswordConfirmValid () {
      if (this.credentials.confirmPassword.length === 0) return null
      return this.$registerValidation.password &&
             this.credentials.password &&
             this.credentials.confirmPassword &&
             this.credentials.password === this.credentials.confirmPassword
    },

    isEmailValid () {
      if (this.credentials.email.length === 0) return null
      return this.$registerValidation.email && this.$registerValidation.email.valid
    }
  },

  route: {
    data () {
      try {
        if (window.location.hash.indexOf('access_token=') > -1) {
          this.loading = true

          const split = window.location.hash.split('=')
          const token = split.splice(1).join('=')
          this.fbAuthContinue(token)
            .then(res => {
              this.fbCheckUser({
                'fb_access_token': token,
                'fb_id': res.data.id,
                'fb_name': res.data.name,
                'fb_email': res.data.email || ''
              })
              .then(res => {
                if (res.status === 200) {
                  this.store.setToken(res.data.token)
                  this.store.setUser(res.data.user)
                  router.go({path: '/my'})
                }
              })
              .catch(err => {
                throw err
              })
            })
            .catch(err => {
              throw err
            })
        }
      } catch (err) {
        this.error = 'Oops... there was an error. Please try again.'
        this.loading = false
      }
    }
  }
}
</script>
