<template>
  <facebook-auth></facebook-auth>

  <div v-if="loading">
    <h2>Signing in via Facebook... </h2>
  </div>
  <div v-else>
    <div v-if="facebook">
      <validator name="registerValidation">
        <form novalidate class="col-sm-6 col-sm-offset-2">
          <h2>Almost there...</h2>
          <p>Choose a username and you're good to go.</p>

          <div class="alert alert-danger" v-if="error">{{{error}}}</div>

          <div class="form-group" v-bind:class="[fbUsernameAvailable !== null ? (fbUsernameAvailable ? classHasSuccess : classHasDanger) : '']">
            <input
              type="text"
              class="form-control"
              placeholder="Username"
              v-model="credentialsFb.username"
              v-validate:username="{required: true, minlength: 3}"
              v-on:keyup="checkUsername(true) | debounce 250"
              v-bind:class="[fbUsernameAvailable !== null ? (fbUsernameAvailable ? classFormControlSuccess : classFormControlDanger) : '']"
            >
          </div>

          <div class="form-group">
            <button class="btn btn-primary" v-on:click.prevent="submitFacebook()">Register</button>
          </div>
        </form>
      </validator>
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
              v-on:keyup="checkUsername() | debounce 250"
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
              v-validate:password="{required: true, minlength: 8}"
              v-bind:class="[isPasswordValid !== null ? (isPasswordValid ? classFormControlSuccess : classFormControlWarning) : '']"
            >
          </div>

          <div class="form-group" v-bind:class="[isPasswordConfirmValid !== null ? (isPasswordConfirmValid ? classHasSuccess : classHasWarning) : '']">
            <input
              type="password"
              class="form-control"
              placeholder="Confirm password"
              v-model="credentials.confirmPassword"
              v-validate:confirm-password="{required: true, minlength: 8}"
              v-bind:class="[isPasswordConfirmValid !== null ? (isPasswordConfirmValid ? classFormControlSuccess : classFormControlWarning) : '']"
            >
          </div>

          <div class="form-group">
            <button class="btn btn-primary" v-on:click.prevent="submit()">Register</button>
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
  </div>
</template>

<script>
import Registration from '../services/registration'
import FacebookAuth from './FacebookAuth'
import Validator from 'vue-validator'
import {parseError} from '../mixins'
import {router} from '../main'
import store from '../store'
import Login from './Login'
import Vue from 'vue'

export default {
  name: 'Register',

  mixins: [parseError],

  data () {
    return {
      store,
      facebook: false,
      loading: false,
      credentials: {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      credentialsFb: {
        fb_email: '',
        fb_id: '',
        intent: '',
        tmp_username: '',
        user_id: '',
        fb_name: ''
      },
      classHasSuccess: 'has-success',
      classHasWarning: 'has-warning',
      classHasDanger: 'has-danger',
      classFormControlSuccess: 'form-control-success',
      classFormControlWarning: 'form-control-warning',
      classFormControlDanger: 'form-control-danger',
      usernameAvailable: null,
      fbUsernameAvailable: null,
      submitted: false,
      error: ''
    }
  },

  components: {
    Validator, FacebookAuth, Login
  },

  methods: {
    checkUsername (forFacebookRegistration = false) {
      const username = forFacebookRegistration ? this.credentialsFb.username : this.credentials.username
      if (username.length > 2) {
        Registration.checkUsername(username, forFacebookRegistration)
          .then(res => {
            if (res.status === 200) {
              if (forFacebookRegistration) {
                this.fbUsernameAvailable = true
              } else {
                this.usernameAvailable = true
              }
            } else {
              if (forFacebookRegistration) {
                this.fbUsernameAvailable = false
              } else {
                this.usernameAvailable = false
              }
            }
          })
          .catch(err => {
            this.parseError(err)
          })
      } else {
        this.fbUsernameAvailable = null
        this.usernameAvailable = null
      }
    },

    fbAuthInit () {
      return FacebookAuth.auth()
    },

    fbAuthContinue (token) {
      return FacebookAuth.auth(token)
    },

    fbCheckUser (payload) {
      return FacebookAuth.checkUser(payload)
    },

    fbRegistrationLastStep (payload) {
      this.loading = false
      this.facebook = true
      this.credentialsFb = {
        username: payload.tmp_username,
        fb_id: payload.fb_id,
        user_id: payload.user_id,
        fb_email: payload.fb_email,
        tmp_username: payload.tmp_username
      }

      Vue.nextTick(() => {
        router.go({path: '/register'})
      })

      Registration.checkUsername(this, this.credentialsFb.username, true)
    },

    submit () {
      this.error = ''
      if (this.$registerValidation.valid) {
        Registration
          .register(this.credentials)
          .catch(err => {
            console.log(err.message)
            this.parseError(err)
          })
      }
    },

    submitFacebook () {
      this.error = ''
      if (this.$registerValidation.valid) {
        Registration
          .registerViaFacebook(this.credentialsFb)
          .catch(err => {
            this.parseError(err)
          })
      }
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
                'fb_id': res.id,
                'fb_name': res.name,
                'fb_email': res.email || ''
              })
              .then(res => {
                if (res.status === 200) {
                  Login.methods.fbLoginUser({token: res.token, user: res.user})
                } else {
                  this.fbRegistrationLastStep(res)
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
