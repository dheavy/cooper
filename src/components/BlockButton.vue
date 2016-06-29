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
import {USERS_URL} from '../constants/api'

export default {
  data () {
    return {
      canBlockOther: this.canBlock(this.store.getUser(), this.otherUser)
    }
  },

  props: ['cssClasses', 'otherUser', 'store'],

  methods: {
    canBlock (me, other) {
      if (me.id === other.id) return null
      return me.id !== other.id && me.blocking.indexOf(other.id) === -1
    },

    toggleBlock () {
      this.canBlock(this.store.getUser(), this.otherUser)
        ? this.block(this.store.getUser(), this.otherUser)
        : this.unblock(this.store.getUser(), this.otherUser)
    },

    block (me, other) {
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
    },

    unblock (me, other) {
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
  }
}
</script>
