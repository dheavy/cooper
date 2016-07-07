<template>
  <navigation
    :auth="true"
    :user-id="user.id"
  ></navigation>
  <div v-if="loading">
    <h2>Loading...</h2>
  </div>
  <div v-else>
    <div class="alert alert-danger" v-if="error">{{error}}</div>
    <div v-else>
      <member
        :username="shownUser.username"
        :date-joined="shownUser.dateJoined | date"
        :followers="shownUser.followers.length"
        :following="shownUser.following.length"
        :can-create-collection="canCreateCollection"
      >
      </member>

      <follow-button
        css-classes="btn btn-secondary"
        :store.sync="store"
        :other-user="shownUser"
      >
      </follow-button>

      <block-button
        css-classes="btn btn-secondary"
        :store.sync="store"
        :other-user="shownUser"
      >
      </block-button>

      <collections
        :user-id="shownUser.id"
        :are-my-own="shownUser.id === store.getUser().id"
        v-show="isMyFrontpage || isMemberPage"
      ></collections>
    </div>
  </div>
  <router-view></router-view>
</template>

<script>
import {USERS_URL} from '../constants/api'
import followButton from './FollowButton'
import collections from './collections'
import blockButton from './BlockButton'
import navigation from './Navigation'
import member from './Member'
import store from '../store'
import Vue from 'vue'

export default {
  name: 'Dashboard',

  components: {
    navigation, member, collections, followButton, blockButton
  },

  data () {
    return {
      store,
      loading: true,
      shownUser: null,
      error: null,
      isMyFrontpage: false,
      isMemberPage: false,
      user: store.getUser()
    }
  },

  computed: {
    canCreateCollection: {
      cache: false,
      get () {
        return this.shownUser.id === this.user.id &&
               this.$route.path === '/my' || this.$route.path === '/my/collections'
      }
    }
  },

  route: {
    data () {
      this.isMyFrontpage = this.$route.path === '/my'
      this.isMemberPage = /\/users\/\d/.test(this.$route.path)

      if (this.isMemberPage && this.$route.params.uid) {
        const id = this.$route.params.uid
        this.error = ''

        Vue.http.headers.common['Authorization'] = `Bearer ${this.store.getToken()}`

        this.$http
          .get(`${USERS_URL}/${id}`)
          .then(res => {
            this.loading = false
            this.shownUser = res.data.payload
          })
          .catch(err => {
            console.log(err)
            this.loading = false
            this.error = 'Oops... something went wrong. Please try again.'
          })
      } else {
        // Own user's page.
        this.shownUser = this.store.getUser()
        this.loading = false
      }
    }
  }
}
</script>
