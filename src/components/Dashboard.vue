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

      <button
        class="btn btn-primary"
        v-show="canFollowOther !== null"
        v-on:click="toggleFollow"
      >
        <span v-if="canFollowOther === true">Follow</span>
        <span v-if="canFollowOther === false">Unfollow</span>
      </button>

      <button
        class="btn btn-primary"
        v-show="canBlockOther !== null"
        v-on:click="toggleBlock"
      >
        <span v-if="canBlockOther === true">Block</span>
        <span v-if="canBlockOther === false">Unblock</span>
      </button>
    </div>
  </div>
  <router-view></router-view>
</template>

<script>
import {USERS_URL} from '../constants/api'
import collections from './Collections'
import navigation from './Navigation'
import member from './Member'
import store from '../store'
import moment from 'moment'
import Vue from 'vue'

export default {
  name: 'Dashboard',

  components: {
    navigation, member, collections
  },

  data () {
    return {
      store,
      loading: true,
      otherUser: null,
      error: null,
      user: store.getUser(),
      canFollowOther: null,
      canBlockOther: null
    }
  },

  methods: {
    canFollow (me, other) {
      return me.id !== other.id &&
             me.following.indexOf(other.id) === -1
    },

    canBlock (me, other) {
      return me.id !== other.id && me.blocking.indexOf(other.id) === -1
    },

    toggleFollow () {
      this.canFollow(this.store.getUser(), this.otherUser)
        ? this.follow(this.store.getUser(), this.otherUser)
        : this.unfollow(this.store.getUser(), this.otherUser)
    },

    toggleBlock () {
      this.canBlock(this.store.getUser(), this.otherUser)
        ? this.block(this.store.getUser(), this.otherUser)
        : this.unblock(this.store.getUser(), this.otherUser)
    },

    follow (me, other) {
      this.$http
        .post(`${USERS_URL}/${other.id}/follow`)
        .then(res => {
          me.following.push(other.id)
          store.updateUser(me)
          other.followers.push(me.id)
          this.canFollowOther = false
        })
        .catch(err => {
          console.log(err)
        })
    },

    unfollow (me, other) {
      this.$http
        .post(`${USERS_URL}/${other.id}/unfollow`)
        .then(res => {
          me.following.splice(me.following.indexOf(me.id), 1)
          store.updateUser(me)
          other.followers.splice(other.followers.indexOf(me.id), 1)
          this.canFollowOther = true
        })
        .catch(err => {
          console.log(err)
        })
    },

    block (me, other) {
      this.$http
        .post(`${USERS_URL}/${other.id}/block`)
        .then(res => {
          me.blocking.push(other.id)
          store.updateUser(me)
          this.canBlockOther = false
        })
        .catch(err => {
          console.log(err)
        })
    },

    unblock (me, other) {
      this.$http
        .post(`${USERS_URL}/${other.id}/unblock`)
        .then(res => {
          me.blocking.splice(me.blocking.indexOf(other.id), 1)
          store.updateUser(me)
          this.canBlockOther = true
        })
        .catch(err => {
          console.log(err)
        })
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
            this.canFollowOther = this.canFollow(this.store.getUser(), this.otherUser)
            this.canBlockOther = this.canBlock(this.store.getUser(), this.otherUser)
          })
          .catch(err => {
            console.log(err)
            this.loading = false
            this.error = 'Oops... something went wrong. Please try again.'
          })
      } else {
        // Own user's page.
        this.otherUser = this.store.getUser()
        this.canFollowOther = null
        this.canBlockOther = null
        this.loading = false
      }
    }
  }
}
</script>
