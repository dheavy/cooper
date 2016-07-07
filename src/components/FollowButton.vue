<template>
  <button
    class="{{cssClasses}}"
    v-show="canFollowOther !== null"
    v-on:click="toggleFollow"
  >
    <span v-if="canFollowOther === true">Follow</span>
    <span v-if="canFollowOther === false">Unfollow</span>
  </button>
</template>

<script>
import {USERS_URL} from '../constants/api'

export default {
  props: ['cssClasses', 'otherUser', 'store'],

  computed: {
    canFollowOther: {
      cache: false,
      get () {
        return this.canFollow(this.store.getUser(), this.otherUser)
      }
    }
  },

  methods: {
    canFollow (me, other) {
      if (me.id === other.id) return null
      return me.id !== other.id && me.following.indexOf(other.id) === -1
    },

    toggleFollow () {
      this.canFollow(this.store.getUser(), this.otherUser)
        ? this.follow(this.store.getUser(), this.otherUser)
        : this.unfollow(this.store.getUser(), this.otherUser)
    },

    follow (me, other) {
      this.$http
        .post(`${USERS_URL}/${other.id}/follow`)
        .then(res => {
          me.following.push(other.id)
          this.store.updateUser(me)
          other.followers.push(me.id)
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
          this.store.updateUser(me)
          other.followers.splice(other.followers.indexOf(me.id), 1)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
