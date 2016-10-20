<template>
  <section class="row password-reset">
    <div class="col-sm-4 offset-sm-4">
      <div v-show="showForm">
        <h2>Password reset</h2>
        <p v-show="!error">
          If you have stored your email on your account, you may use this form
          to reset your password if you have forgotten it.
        </p>
        <validator name="passwordResetValidation">
          <form novalidate>
            <div class="alert alert-danger" v-if="error">{{{error}}}</div>
            <div class="alert alert-danger" v-if="submitted && $passwordResetValidation.email.required">Email is required.</div>
            <div class="alert alert-danger" v-if="submitted && $passwordResetValidation.email.email">Email is invalid.</div>

            <div class="form-group" :class="[isEmailValid !== null ? (isEmailValid ? classHasSuccess : classHasWarning) : '']">
              <input
                type="email"
                name="email"
                class="form-control"
                placeholder="E-mail address"
                v-model="email"
                v-validate:email="{required: true, email: true}"
                v-on:keyup="resetValidation()"
                :class="[isEmailValid !== null ? (isEmailValid ? classFormControlSuccess : classFormControlWarning) : '']"
              >
            </div>

            <div class="form-group">
              <button
                class="btn btn-primary {{isEmailValid ? '' : 'disabled'}}"
                @click.prevent="submit()"
                :disabled="isEmailValid ? false : true"
              >
                Reset my password
              </button>
            </div>
          </form>
        </validator>
      </div>
    </div>
  </section>
</template>

<script>
  import {resetPassword} from '../services/api'
  import Validator from 'vue-validator'
  import {parseError} from '../mixins'

  export default {
    name: 'PasswordReset',

    components: {Validator},

    mixins: [parseError],

    data () {
      return {
        error: null,
        showForm: true,
        email: '',
        classHasSuccess: 'has-success',
        classHasWarning: 'has-warning',
        classFormControlSuccess: 'form-control-success',
        classFormControlWarning: 'form-control-warning'
      }
    },

    methods: {
      resetValidation () {
        this.error = null
        this.showForm = true
        this.$resetValidation()
      },

      submit () {
        if (this.$passwordResetValidation.valid) {
          resetPassword({email: this.email})
            .then(res => {
              console.log(res)
            })
            .catch(err => this.parseError(err))
        }
      }
    },

    computed: {
      isEmailValid () {
        if (this.email.length === 0) return null
        return this.$passwordResetValidation.valid
      }
    }
  }
</script>
