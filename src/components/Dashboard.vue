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
        :id="shownUser.id"
        :current-user-id="user.id"
        :username="shownUser.username"
        :date-joined="shownUser.dateJoined | date"
        :followers="shownUser.followers.length"
        :following="shownUser.following.length"
        :can-create-collection="canCreateCollection"
      >
      </member>

      <follow-button
        css-classes="btn btn-secondary"
        :store="store"
        :other-user="shownUser"
      >
      </follow-button>

      <block-button
        css-classes="btn btn-secondary"
        :store="store"
        :other-user="shownUser"
      >
      </block-button>

      <collections
        :user-id="shownUser.id"
        :are-my-own="collectionsAreMyOwn"
        v-show="isMyFrontpage || isMemberPage"
      ></collections>
    </div>
  </div>
  <router-view></router-view>
</template>

<script>
import followButton from './FollowButton'
import {fetchUser} from '../services/api'
import collections from './collections'
import blockButton from './BlockButton'
import navigation from './Navigation'
import member from './Member'
import store from '../store'

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
    },

    collectionsAreMyOwn () {
      return this.shownUser.id === this.store.getUser().id
    }
  },

  route: {
    data () {
      this.isMyFrontpage = this.$route.path === '/my'
      this.isMemberPage = /\/users\/\d*\/?$/i.test(this.$route.path)

      if (this.isMemberPage && this.$route.params.uid) {
        const id = this.$route.params.uid
        this.error = ''

        fetchUser(id, store.getToken())
          .then(res => {
            this.loading = false
            this.shownUser = res.payload
          })
          .catch(err => {
            console.log(err)
            this.loading = false
            if (err.status === 404) {
              this.error = 'User not found.'
              return
            }
            this.error = 'Oops... something went wrong. Please try again.'
          })
      } else {
        // Own user's page.
        this.shownUser = store.getUser()
        this.loading = false
      }
    }
  }
}
</script>
