<template>
  <section class="blocked row">
    <div v-if="usersLoading">Loading</div>

    <div v-else class="row">
      <div class="col-sm-6">
        <div class="alert alert-danger" v-if="errorUsers">{{errorUsers}}</div>
        <table v-else class="table">
          <thead>
            <th>Users</th>
            <th></th>
          </thead>
          <tbody>
            <tr v-for="blockedUser in blockedUsers">
              <td><a v-link="{name: 'users', params: {uid: blockedUser.id}}">{{blockedUser.username}}</a></td>
              <td>
                <block-button css-classes="btn btn-sm btn-secondary" :store="store" :other-user="blockedUser"></block-button>
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
                <block-button css-classes="btn btn-sm btn-secondary" :store="store" :collection="blockedCollection"></block-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script>
  import {fetchBlockedUsers, fetchBlockedCollections} from '../services/api'
  import BlockButton from './BlockButton'
  import store from '../store'

  export default {
    name: 'Blocked',

    components: {
      BlockButton
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
        this.usersLoading = true

        // Blocked users
        fetchBlockedUsers(this.store.getToken())
          .then(res => {
            this.usersLoading = false
            this.blockedUsers = res.payload
          })
          .catch(err => {
            console.log(err)
            this.usersLoading = false
            this.errorUsers = 'Oops... something went wrong. Please try again.'
          })

        // Blocked collections
        fetchBlockedCollections(this.store.getToken())
          .then(res => {
            this.collectionsLoading = false
            this.blockedCollections = res.payload
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
