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
        :username="otherUser.username"
        :date-joined="dateJoined"
        :followers="otherUser.followers.length"
        :following="otherUser.following.length"
      >
      </member>

      <follow-button
        css-classes="btn btn-primary"
        :store.sync="store"
        :other-user="otherUser"
      >
      </follow-button>

      <block-button
        css-classes="btn btn-primary"
        :store.sync="store"
        :other-user="otherUser"
      >
      </block-button>
    </div>
  </div>
  <router-view></router-view>
</template>

<script>
import {USERS_URL} from '../constants/api'
import followButton from './FollowButton'
import blockButton from './BlockButton'
import collections from './Collections'
import navigation from './Navigation'
import member from './Member'
import store from '../store'
import moment from 'moment'
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
      otherUser: null,
      error: null,
      user: store.getUser()
    }
  },

  computed: {
    dateJoined () {
      return moment(this.otherUser.dateJoined).format('LL')
    }
  },

  route: {
    data () {
      if (this.$route.path.indexOf('/users') > -1 && this.$route.params.uid) {
        const id = this.$route.params.uid
        this.error = ''

        Vue.http.headers.common['Authorization'] = `Bearer ${this.store.getToken()}`

        this.$http
          .get(`${USERS_URL}/${id}`)
          .then(res => {
            this.loading = false
            this.otherUser = res.data.payload
          })
          .catch(err => {
            console.log(err)
            this.loading = false
            this.error = 'Oops... something went wrong. Please try again.'
          })
      } else {
        // Own user's page.
        this.otherUser = this.store.getUser()
        this.loading = false
      }
    }
  }
}
</script>
