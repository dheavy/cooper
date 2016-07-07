<template>
  <section class="follow row">
    <div v-if="loading">Loading</div>

    <div v-else class="row">
      <div class="col-sm-6">
        <div class="alert alert-danger" v-if="error">{{error}}</div>
        <table v-else class="table">
          <thead>
            <th>{{relationship}}</th>
            <th></th>
          </thead>
          <tbody>
            <tr v-for="user in usersList">
              <td><a v-link="{name: 'users', params: {uid: user.id}}">{{user.username}}</a></td>
              <td>
                <follow-button css-classes="btn btn-sm btn-secondary" :store.sync="store" :other-user="user"></block-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script>
import {USERS_URL} from '../constants/api'
import followButton from './FollowButton'
import store from '../store'
import Vue from 'vue'

export default {
  name: 'Follow',

  components: {
    followButton
  },

  data () {
    return {
      store,
      error: null,
      loading: null,
      usersList: null,
      relationship: null
    }
  },

  route: {
    data () {
      Vue.http.headers.common['Authorization'] = `Bearer ${this.store.getToken()}`

      this.loading = true
      this.error = false

      this.relationship = this.$route.path.indexOf('followed') > -1 ? 'followed' : 'followers'

      this.$http
        .get(`${USERS_URL}/${this.relationship}`)
        .then(res => {
          console.log(res)
          this.loading = false
          this.usersList = res.data.payload
        })
        .catch(err => {
          console.log(err)
          this.loading = false
          this.error = 'Oops... something went wrong. Please refresh the page.'
        })
    }
  }
}
</script>
