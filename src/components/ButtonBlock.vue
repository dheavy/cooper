<template>
  <button
    class="{{cssClasses}}"
    v-show="canBlockOther !== null"
    @click="toggleBlock"
  >
    <span v-if="canBlockOther === true">Block</span>
    <span v-if="canBlockOther === false">Unblock</span>
  </button>
</template>

<script>
  import {block, unblock} from '../services/api'

  export default {
    props: ['cssClasses', 'otherUser', 'collection', 'store'],

    computed: {
      canBlockOther: {
        cache: false,
        get () {
          return this.canBlock(this.store.getUser(), this.otherUser, this.collection)
        }
      }
    },

    methods: {
      canBlock (me, other, collection) {
        if (other) {
          if (me.id === other.id) return null
          return me.id !== other.id && me.blocking.indexOf(other.id) === -1
        }

        if (collection) {
          if (me.id === collection.owner.id) return null
          return me.id !== collection.owner.id && me.collectionsBlocked.indexOf(collection.id) === -1
        }
      },

      toggleBlock () {
        this.canBlock(this.store.getUser(), this.otherUser, this.collection)
          ? this.block(this.store.getUser(), this.otherUser, this.collection)
          : this.unblock(this.store.getUser(), this.otherUser, this.collection)
      },

      block (me, other, collection) {
        if (other) {
          return block('user', other.id, this.store.getToken())
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
          return block('collection', collection.id, this.store.getToken())
            .then(res => {
              me.collectionsBlocked.push(collection.id)
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
          return unblock('user', other.id, this.store.getToken())
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
          return block('collection', collection.id, this.store.getToken())
            .then(res => {
              me.collectionsBlocked.splice(me.collectionsBlocked.indexOf(collection.id), 1)
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
