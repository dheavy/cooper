<template>
  <button
    class="{{cssClasses}}"
    v-show="canBlockOther !== null"
    v-on:click="toggleBlock"
  >
    <span v-if="canBlockOther === true">Block</span>
    <span v-if="canBlockOther === false">Unblock</span>
  </button>
</template>

<script>
import {USERS_URL, COLLECTIONS_URL} from '../constants/api'

export default {
  data () {
    return {
      canBlockOther: this.canBlock(this.store.getUser(), this.otherUser, this.collection)
    }
  },

  props: ['cssClasses', 'otherUser', 'collection', 'store'],

  methods: {
    canBlock (me, other, collection) {
      if (other) {
        if (me.id === other.id) return null
        return me.id !== other.id && me.blocking.indexOf(other.id) === -1
      }

      if (collection) {
        if (me.id === collection.owner.id) return null
        return me.id !== collection.owner.id && me.collectionsBlocked.indexOf(collection.collection.id) === -1
      }
    },

    toggleBlock () {
      this.canBlock(this.store.getUser(), this.otherUser, this.collection)
        ? this.block(this.store.getUser(), this.otherUser, this.collection)
        : this.unblock(this.store.getUser(), this.otherUser, this.collection)
    },

    block (me, other, collection) {
      if (other) {
        this.$http
          .post(`${USERS_URL}/${other.id}/block`)
          .then(res => {
            me.blocking.push(other.id)
            this.store.updateUser(me)
            this.canBlockOther = false
          })
          .catch(err => {
            console.log(err)
          })
      }

      if (collection) {
        this.$http
          .post(`${COLLECTIONS_URL}/${collection.collection.id}/block`)
          .then(res => {
            me.collectionsBlocked.push(collection.collection.id)
            this.store.updateUser(me)
            this.canBlockOther = false
          })
          .catch(err => {
            console.log(err)
          })
      }
    },

    unblock (me, other, collection) {
      if (other) {
        this.$http
          .post(`${USERS_URL}/${other.id}/unblock`)
          .then(res => {
            me.blocking.splice(me.blocking.indexOf(other.id), 1)
            this.store.updateUser(me)
            this.canBlockOther = true
          })
          .catch(err => {
            console.log(err)
          })
      }

      if (collection) {
        this.$http
          .post(`${COLLECTIONS_URL}/${collection.collection.id}/unblock`)
          .then(res => {
            me.collectionsBlocked.splice(me.collectionsBlocked.indexOf(collection.collection.id), 1)
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
