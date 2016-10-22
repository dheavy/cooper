<template>
  <section class="login-component">
    <validator name="loginValidation">
      <form novalidate class="col-sm-6 col-md-4 col-lg-4 offset-sm-3 offset-md-4">
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
            v-validate:password="{required: true, minlength: 8}"
            v-on:keyup="resetValidation()"
          >
        </div>

        <div class="form-group">
          <button
            class="btn btn-primary col-sm-12 btn-login {{canLogin ? '' : 'disabled'}}"
            @click.prevent="submit()"
            :disabled="canLogin ? false : true"
          >
            Sign In
          </button>
        </div>

        <div class="form-group">
          <a class="small link-forgot col-sm-12" v-link="{name: 'password-reset'}">I forgot my username or password</a>
        </div>
      </form>
    </validator>
    <div class="form-group col-sm-6 col-md-4 col-lg-4 offset-sm-3 offset-md-4">
      <hr>
      <button class="btn btn-secondary col-sm-12" @click.prevent="fbAuth">
        Sign in with Facebook
      </button>
    </div>
    <div class="form-group col-sm-6 col-md-4 col-lg-4 offset-sm-3 offset-md-4">
      <a class="btn btn-secondary col-sm-12" v-link="{name: 'register'}">
        Register
      </a>
    </div>
  </section>
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
        submitted: false,
        error: null
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
          this.error = null

          auth
            .login(this.credentials, '/my')
            .catch(err => this.displayError(err))

          this.resetValidation()
        }
      },

      displayError (err) {
        if (+err.status === 404 || +err.status === 400) {
          this.error = 'Incorrect username or password.'
        } else {
          this.error = 'Oops... something went wrong, please try again.'
        }
      }
    },

    computed: {
      canLogin () {
        return this.$loginValidation.valid
      }
    }
  }
</script>

<style lang="scss" scoped>
  .login-component {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
  }

  .btn-login {
    margin-top: 1px;
  }

  .link-forgot {
    text-align: center;
    margin-top: 1rem;
  }

  hr {
    border-top: 1px solid rgba(255, 255, 255, 0.5);
  }
</style>
