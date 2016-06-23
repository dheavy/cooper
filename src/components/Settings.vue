<template>
  <section class="settings">
    <div class="row">
      <div class="col-sm-4">
        <h4>Edit email</h4>
      </div>

      <div class="col-sm-4">
        <h4>Edit password</h4>
      </div>

      <div class="col-sm-4">
        <h4>Deactivate account</h4>
        <button v-on:click="deactivate(this)" class="btn btn-secondary">Deactivate</button>
      </div>
    </div>
  </section>
</template>

<script>
import forbidden from '../mixins/forbidden'
import {USERS_URL} from '../constants/api'
import {headers} from '../services/utils'
import {router} from '../main'
import store from '../store'

export default {
  name: 'Settings',

  mixins: [forbidden],

  data () {
    return {
      store,
      errorDeactivate: '',
      errorEditEmail: '',
      errorEditPassword: ''
    }
  },

  methods: {
    deactivate: (context) => {
      const id = context.store.getUser().id
      context.$http
        .delete(`${USERS_URL}/${id}`, headers(context.store.token))
        .then(res => {
          router.go({path: '/logout'})
        })
        .catch(err => {
          console.log(err)
          context.logoutIfForbidden(err.status)
        })
    }
  }
}
</script>
