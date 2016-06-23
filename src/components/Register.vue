<template>
  <navigation :auth="false" :user-id="null"></navigation>
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
    </form>
  </validator>
</template>

<script>
import registration from '../services/registration'
import navigation from './Navigation'
import validator from 'vue-validator'
import _ from 'lodash'

export default {
  name: 'Register',

  data () {
    return {
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
    navigation, validator
  },

  methods: {
    checkUsername () {
      if (this.credentials.username.length > 2) {
        registration.checkUsername(this, this.credentials.username)
      } else {
        this.usernameAvailable = null
      }
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
  }
}
</script>
