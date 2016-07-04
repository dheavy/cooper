<template>
  <section class="blocked row">
    <div v-if="$loadingRouteData">Loading</div>

    <div class="row">
      <div v-else class="col-sm-6">
        <div class="alert alert-danger" v-if="errorUsers">{{errorUsers}}</div>
        <table v-else class="table">
          <thead>
            <th>Users</th>
            <th></th>
          </thead>
          <tbody>
            <tr v-for="blockedUser in blockedUsers">
              <td>{{blockedUser.username}}</td>
              <td>
                <block-button css-classes="btn btn-sm btn-secondary" :store.sync="store" :other-user="blockedUser"></block-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="col-sm-6">
        <div class="alert alert-danger" v-if="errorUsers">{{errorUsers}}</div>
        <table class="table">
          <thead>
            <th>Collections</th>
            <th></th>
          </thead>
          <tbody>
            <tr v-for="blockedCollection in blockedCollections">
              <td>{{blockedCollection.collection.name}} (from {{blockedCollection.owner.username}})</td>
              <td>
                <block-button css-classes="btn btn-sm btn-secondary" :store.sync="store" :collection="blockedCollection"></block-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script>
import {USERS_URL, COLLECTIONS_URL} from '../constants/api'
import blockButton from './BlockButton'
import store from '../store'
import Vue from 'vue'

export default {
  name: 'Blocked',

  components: {
    blockButton
  },

  data () {
    return {
      store,
      usersLoading: false,
      collectionsLoading: false,
      errorUsers: false,
      errorCollections: false,
      blockedUsers: null,
      blockedCollections: null
    }
  },

  route: {
    data () {
      Vue.http.headers.common['Authorization'] = `Bearer ${this.store.getToken()}`

      this.usersLoading = true

      // Blocked users
      this.$http
        .get(`${USERS_URL}/blocked`)
        .then(res => {
          this.usersLoading = false
          this.blockedUsers = res.data.payload
        })
        .catch(err => {
          console.log(err)
          this.usersLoading = false
          this.errorUsers = 'Oops... something went wrong. Please try again.'
        })

      // Blocked collections
      this.$http
        .get(`${COLLECTIONS_URL}/blocked`)
        .then(res => {
          this.collectionsLoading = false
          this.blockedCollections = res.data.payload
        })
        .catch(err => {
          console.log(err)
          this.collectionsLoading = false
          this.errorCollectioons = 'Oops... something went wrong. Please try again.'
        })
    }
  }
}
</script>
