<template>
  <section class="settings">
    <div class="row">
      <div class="col-sm-4">
        <h4>Edit email</h4>
        <validator name="editEmailValidation">
          <form novalidate>
            <div class="alert alert-success" v-if="successEditEmail">{{{successEditEmail}}}</div>
            <div class="alert alert-danger" v-if="errorEditEmail">{{{errorEditEmail}}}</div>
            <div class="alert alert-danger" v-if="editEmailSubmitted && ($editEmailValidation.email.email)">Please enter a valid email address.</div>

            <div class="form-group" :class="[isEmailValid !== null ? (isEmailValid ? classHasSuccess : classHasWarning) : '']">
              <input
                type="email"
                class="form-control"
                placeholder="Email"
                v-model="editEmail.email"
                v-validate:email="{email: true}"
                v-on:keyup="resetEditEmailValidation()"
                :class="[isEmailValid !== null ? (isEmailValid ? classFormControlSuccess : classFormControlWarning) : '']"
              >
            </div>

            <div class="form-group">
              <button class="btn btn-primary" @click.prevent="submitEditEmail()">Edit email</button>
            </div>
          </form>
        </validator>
      </div>

      <div class="col-sm-4">
        <h4>Edit password</h4>
        <validator name="editPasswordValidation">
          <form novalidate>
            <div class="alert alert-success" v-if="successEditPassword">{{{successEditPassword}}}</div>
            <div class="alert alert-danger" v-if="errorEditPassword">{{{errorEditPassword}}}</div>
            <div class="alert alert-danger" v-if="editPasswordSubmitted && ($editPasswordValidation.currentPassword.required || $editPasswordValidation.password.required || $editPasswordValidation.passwordConfirm.required)">All fields are required.</div>
            <div class="alert alert-danger" v-if="editPasswordSubmitted && (editPassword.password !== editPassword.passwordConfirm)">Passwords do not match.</div>

            <div class="form-group">
              <input
                type="password"
                class="form-control"
                placeholder="Current password"
                v-model="editPassword.currentPassword"
                v-on:keyup="resetEditPasswordValidation()"
              >
            </div>

            <div class="form-group" :class="[isPasswordValid !== null ? (isPasswordValid ? classHasSuccess : classHasWarning) : '']">
              <input
                type="password"
                class="form-control"
                placeholder="Password"
                v-model="editPassword.password"
                v-validate:password="{required: true, minlength: 8}"
                v-on:keyup="resetEditPasswordValidation()"
                :class="[isPasswordValid !== null ? (isPasswordValid ? classFormControlSuccess : classFormControlWarning) : '']"
              >
            </div>

            <div class="form-group" :class="[isPasswordConfirmValid !== null ? (isPasswordConfirmValid ? classHasSuccess : classHasWarning) : '']">
              <input
                type="password"
                class="form-control"
                placeholder="Confirm password"
                v-model="editPassword.passwordConfirm"
                v-validate:password-confirm="{required: true, minlength: 8}"
                v-on:keyup="resetEditPasswordValidation()"
                :class="[isPasswordConfirmValid !== null ? (isPasswordConfirmValid ? classFormControlSuccess : classFormControlWarning) : '']"
              >
            </div>

            <div class="form-group">
              <button class="btn btn-primary" @click.prevent="submitEditPassword()">Change password</button>
            </div>
          </form>
        </validator>
      </div>

      <div class="col-sm-4">
        <h4>Deactivate account</h4>
        <button @click="deactivate()" class="btn btn-secondary">Deactivate</button>
      </div>
    </div>
  </section>
</template>

<script>
  import {editPassword, editEmail, deactivate} from '../services/api'
  import errors from '../services/errors'
  import Validator from 'vue-validator'
  import {router} from '../main'
  import store from '../store'

  export default {
    name: 'Settings',

    components: {Validator},

    data () {
      return {
        editPassword: {
          currentPassword: '',
          password: '',
          passwordConfirm: ''
        },
        editEmail: {
          email: ''
        },
        editPasswordSubmitted: null,
        classHasSuccess: 'has-success',
        classHasWarning: 'has-warning',
        classHasDanger: 'has-danger',
        classFormControlSuccess: 'form-control-success',
        classFormControlWarning: 'form-control-warning',
        classFormControlDanger: 'form-control-danger',
        errorDeactivate: '',
        errorEditEmail: '',
        errorEditPassword: '',
        successEditPassword: '',
        successEditEmail: ''
      }
    },

    methods: {
      resetForms () {
        this.editPassword = {
          currentPassword: '',
          password: '',
          passwordConfirm: ''
        }

        this.editEmail = {
          email: ''
        }
      },

      resetEditPasswordValidation () {
        this.editPasswordSubmitted = false
        this.$resetValidation()
      },

      resetEditEmailValidation () {
        this.editEmailSubmitted = false
        this.$resetValidation()
      },

      submitEditEmail () {
        this.successEditEmail = ''
        this.errorEditEmail = ''

        const id = store.getUser().id

        if (this.$editEmailValidation.valid || this.editEmail.email === '') {
          return editEmail({
            user_id: id,
            email: this.editEmail.email,
            token: store.getToken()
          })
            .then(res => {
              this.successEditEmail = 'Email successfully modified!'
              this.resetForms()
            })
            .catch(err => {
              this.parseEmailError(err)
            })
        }
      },

      submitEditPassword () {
        this.successEditPassword = ''
        this.errorEditPassword = ''

        const id = store.getUser().id

        if (this.$editPasswordValidation.valid) {
          return editPassword({
            user_id: id,
            password: this.editPassword.password,
            current_password: this.editPassword.currentPassword,
            confirm_password: this.editPassword.passwordConfirm,
            token: store.getToken()
          })
            .then(res => {
              this.successEditPassword = 'Password successfully changed!'
              this.resetForms()
            })
            .catch(err => {
              this.parsePasswordError(err)
            })
        }
      },

      deactivate () {
        const id = store.getUser().id

        return deactivate(id, store.getToken())
          .then(res => {
            router.go({path: '/logout'})
          })
          .catch(err => {
            console.log(err)
            this.errorDeactivate = 'Oops... There was an error on our end. Please try again.'
          })
      },

      parseEmailError (err) {
        if (err.message && errors[err.message]) {
          this.errorEditEmail = errors[err.message]
        } else {
          this.errorEditEmail = 'Oops... there was an error. Please try again.'
        }
      },

      parsePasswordError (err) {
        if (err.message && errors[err.message]) {
          this.errorEditPassword = errors[err.message]
        } else {
          this.errorEditPassword = 'Oops... there was an error. Please try again.'
        }
      }
    },

    computed: {
      isPasswordValid () {
        if (this.editPassword.password.length === 0) return null
        return this.$editPasswordValidation.password && this.$editPasswordValidation.password.valid
      },

      isPasswordConfirmValid () {
        if (this.editPassword.passwordConfirm.length === 0) return null
        return this.$editPasswordValidation.passwordConfirm &&
               this.$editPasswordValidation.passwordConfirm.valid &&
               this.editPassword.password === this.editPassword.passwordConfirm
      },

      isEmailValid () {
        if (this.editEmail.email.length === 0) return null
        return this.$editEmailValidation.valid
      }
    }
  }
</script>
