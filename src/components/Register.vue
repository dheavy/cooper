<template>
  <navigation :auth="false" :user-id="null"></navigation>
  <validator name="registerValidation">
    <form novalidate class="col-sm-4 col-sm-offset-4">
      <h2>Register</h2>

      <div class="form-group" v-bind:class="[usernameAvailable !== null ? (usernameAvailable ? classHasSuccess : classHasDanger) : '']">
        <input
          class="form-control"
          placeholder="Username"
          v-model="credentials.username"
          v-validate:username="{required: true, minlength: 3}"
          v-on:keyup="checkUsername | debounce 250"
          v-bind:class="[usernameAvailable !== null ? (usernameAvailable ? classFormControlSuccess : classFormControlDanger) : '']"
        >
      </div>
    </form>
  </validator>
</template>

<script>
import registration from '../services/registration'
import navigation from './Navigation'
import validator from 'vue-validator'

export default {
  name: 'Register',

  data () {
    return {
      credentials: {
        username: '',
        password: ''
      },
      classHasSuccess: 'has-success',
      classHasDanger: 'has-danger',
      classFormControlSuccess: 'form-control-success',
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

    parseError (err) {
      console.log(err)
    }
  }
}
</script>
