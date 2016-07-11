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
import {USERS_URL, COLLECTIONS_URL} from '../constants/api'

export default {
  props: ['cssClasses', 'otherUser', 'collection', 'store'],

  computed: {
    canFollowOther: {
      cache: false,
      get () {
        return this.canFollow(this.store.getUser(), this.otherUser, this.collection)
      }
    }
  },

  methods: {
    canFollow (me, other, collection) {
      if (other) {
        if (me.id === other.id) return null
        return me.id !== other.id && me.following.indexOf(other.id) === -1
      }

      if (collection) {
        if (me.id === collection.owner.id) return null
        return me.id !== collection.owner.id && me.collectionsFollowed.indexOf(collection.id) === -1
      }
    },

    toggleFollow () {
      this.canFollow(this.store.getUser(), this.otherUser, this.collection)
        ? this.follow(this.store.getUser(), this.otherUser, this.collection)
        : this.unfollow(this.store.getUser(), this.otherUser, this.collection)
    },

    follow (me, other, collection) {
      if (other) {
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
      }

      if (collection) {
        this.$http
          .post(`${COLLECTIONS_URL}/${collection.id}/follow`)
          .then(res => {
            me.collectionsFollowed.push(collection.id)
            this.store.updateUser(me)
            this.canBlockOther = false
          })
          .catch(err => {
            console.log(err)
          })
      }
    },

    unfollow (me, other, collection) {
      if (other) {
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

      if (collection) {
        this.$http
          .post(`${COLLECTIONS_URL}/${collection.id}/unfollow`)
          .then(res => {
            me.collectionsFollowed.splice(me.collectionsFollowed.indexOf(collection.id), 1)
            this.store.updateUser(me)
            this.canBlockOther = true
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
  }
}
</script>
