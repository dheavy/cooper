<template>
  <validator name="passwordResetValidation">
    <form
      novalidate
      class="col-sm-4 offset-sm-4"
      v-show="showForm"
    >
      <h2>Change password</h2>

      <div class="alert alert-danger" v-if="error">{{error}}</div>
      <div class="alert alert-danger" v-if="submitted && $passwordResetValidation.password.required">Password is required.</div>
      <div class="alert alert-danger" v-if="submitted && $passwordResetValidation.password.minlength">Password is too short.</div>
      <div class="alert alert-danger" v-if="submitted && $passwordResetValidation.confirmPassword.required">Password confirmation is required.</div>
      <div class="alert alert-danger" v-if="submitted && $passwordResetValidation.confirmPassword.minlength">Password confirmation is too short.</div>

      <input
        v-model="payload.token"
        type="hidden"
        name="token"
        id="token"
      >
      <input
        v-model="payload.uid"
        type="hidden"
        name="uid"
        id="uid"
      >

      <div class="form-group">
        <input
          type="password"
          class="form-control"
          placeholder="New password"
          v-model="payload.password"
          v-validate:password="{required: true, minlength: 6}"
          v-on:keyup="resetValidation()"
        >
      </div>

      <div class="form-group">
        <input
          type="password"
          class="form-control"
          placeholder="New password"
          v-model="payload.confirmPassword"
          v-validate:confirm-password="{required: true, minlength: 6}"
          v-on:keyup="resetValidation()"
        >
      </div>

      <div class="form-group">
        <button class="btn btn-primary" @click.prevent="submit()">Change my password</button>
      </div>
    </form>
  </validator>

  <div
    class="col-sm-6 offset-sm-3"
    v-show="tokenUidMissing"
  >
    <h2>Oops...</h2>
    <p>Some important data is missing to proceed...</p>
    <p><a v-link="{name: 'home'}">Back to homepage</a></p>
  </div>
</template>

<script>
  import {resetPassword} from '../services/api'
  import Validator from 'vue-validator'
  import {parseError} from '../mixins'

  export default {
    name: 'PasswordResetConfirm',

    components: {Validator},

    mixins: [parseError],

    data () {
      return {
        payload: {
          token: null,
          uid: null,
          password: '',
          confirmPassword: ''
        },
        submitted: false,
        error: null,
        showForm: false,
        showMessage: false
      }
    },

    methods: {
      resetValidation () {
        this.submitted = false
        this.showForm = true
        this.showMessage = false
        this.error = null
        this.$resetValidation()
      },

      submit () {
        if (this.payload.password !== this.payload.confirmPassword) {
          this.error = "Passwords don't match."
          return
        }

        this.submitted = true

        if (this.$passwordResetValidation.valid) {
          this.error = null
        }

        resetPassword({
          token: this.payload.token,
          uid: this.payload.uid,
          password: this.payload.password,
          confirm_password: this.payload.confirmPassword
        })
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          this.parseError(err)
        })
      }
    },

    route: {
      data () {
        const snippet = this.$route.params.tokenUid.split('-')

        if (snippet.length === 2) {
          this.payload.token = snippet[0]
          this.payload.uid = snippet[1]
          this.showForm = true
        }
      }
    }
  }
</script>
