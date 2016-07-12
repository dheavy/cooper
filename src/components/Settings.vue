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

            <div class="form-group" v-bind:class="[isEmailValid !== null ? (isEmailValid ? classHasSuccess : classHasWarning) : '']">
              <input
                type="email"
                class="form-control"
                placeholder="Email"
                v-model="editEmail.email"
                v-validate:password="{email: true}"
                v-on:keyup="resetEditEmailValidation()"
                v-bind:class="[isEmailValid !== null ? (isEmailValid ? classFormControlSuccess : classFormControlWarning) : '']"
              >
            </div>

            <div class="form-group">
              <button class="btn btn-primary" v-on:click.prevent="submitEditEmail()">Edit email</button>
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

            <div class="form-group" v-bind:class="[isPasswordValid !== null ? (isPasswordValid ? classHasSuccess : classHasWarning) : '']">
              <input
                type="password"
                class="form-control"
                placeholder="Password"
                v-model="editPassword.password"
                v-validate:password="{required: true, minlength: 6}"
                v-on:keyup="resetEditPasswordValidation()"
                v-bind:class="[isPasswordValid !== null ? (isPasswordValid ? classFormControlSuccess : classFormControlWarning) : '']"
              >
            </div>

            <div class="form-group" v-bind:class="[isPasswordConfirmValid !== null ? (isPasswordConfirmValid ? classHasSuccess : classHasWarning) : '']">
              <input
                type="password"
                class="form-control"
                placeholder="Confirm password"
                v-model="editPassword.passwordConfirm"
                v-validate:password-confirm="{required: true, minlength: 6}"
                v-on:keyup="resetEditPasswordValidation()"
                v-bind:class="[isPasswordConfirmValid !== null ? (isPasswordConfirmValid ? classFormControlSuccess : classFormControlWarning) : '']"
              >
            </div>

            <div class="form-group">
              <button class="btn btn-primary" v-on:click.prevent="submitEditPassword()">Change password</button>
            </div>
          </form>
        </validator>
      </div>

      <div class="col-sm-4">
        <h4>Deactivate account</h4>
        <button v-on:click="deactivate()" class="btn btn-secondary">Deactivate</button>
      </div>
    </div>
  </section>
</template>

<script>
import {USERS_URL, EMAIL_EDIT_URL, PASSWORD_EDIT_URL} from '../constants/api'
import {requestBody, headers} from '../services/utils'
import validator from 'vue-validator'
import {router} from '../main'
import store from '../store'
import _ from 'lodash'

export default {
  name: 'Settings',

  components: {
    validator
  },

  data () {
    return {
      store,
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

      const id = this.store.getUser().id

      if (this.$editEmailValidation.valid || this.editEmail.email === '') {
        this.$http
          .post(`${EMAIL_EDIT_URL}`, requestBody({
            user_id: id,
            email: this.editEmail.email
          }), headers(this.store.getToken()))
          .then(res => {
            this.successEditEmail = 'Email successfully modified!'
          })
          .catch(err => {
            if (err.data && err.data.error) {
              _.each(err.data.error, msg => {
                this.errorEditEmail += `${_.capitalize(msg)}<br>`
              })
            } else {
              this.errorEditEmail = 'Oops... something went wront on our end. Please try again.'
            }
          })
      }
    },

    submitEditPassword () {
      this.successEditPassword = ''
      this.errorEditPassword = ''

      const id = this.store.getUser().id

      if (this.$editPasswordValidation.valid) {
        this.$http
          .post(`${PASSWORD_EDIT_URL}`, requestBody({
            user_id: id,
            password: this.editPassword.password,
            current_password: this.editPassword.currentPassword,
            confirm_password: this.editPassword.passwordConfirm
          }), headers(this.store.getToken()))
          .then(res => {
            this.successEditPassword = 'Password successfully changed!'
          })
          .catch(err => {
            if (err.data && err.data.error) {
              _.each(err.data.error, msg => {
                this.errorEditPassword += `${_.capitalize(msg)}<br>`
              })
            } else {
              this.errorEditPassword = 'Oops... something went wront on our end. Please try again.'
            }
          })
      }
    },

    deactivate: () => {
      const id = this.store.getUser().id
      this.$http
        .delete(`${USERS_URL}/${id}`, headers(this.store.getToken()))
        .then(res => {
          router.go({path: '/logout'})
        })
        .catch(err => {
          console.log(err)
          this.errorDeactivate = 'Oops... There was an error on our end. Please try again.'
        })
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
