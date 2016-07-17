<template>
  <section class="member">
    <header class="row">
      <div class="col-sm-4">
        <h1>{{username}}</h1>
        <small>member since {{dateJoined}}</small>
      </div>
      <div class="col-sm-4">
        <p><a v-if="+id === currentUserId" v-link="{path: '/users/' + id + '/followed'}">{{following}} followed</a></p>
      </div>
      <div class="col-sm-4">
        <p><a v-link="{path: '/users/' + id + '/followers'}">{{followers}} followers</a></p>
      </div>
    </header>
  </section>
  <button
    class="btn btn-primary"
    v-on:click.prevent="createNewCollectionHandler"
    v-if="canCreateCollection"
  >
    Create a new collection
  </button>
</template>

<script>
import {router} from '../main'

export default {
  name: 'Member',

  props: [
    'id',
    'currentUserId',
    'username',
    'dateJoined',
    'following',
    'followers',
    'canCreateCollection'
  ],

  methods: {
    createNewCollectionHandler () {
      router.go({name: 'create-collection'})
    }
  }
}
</script>

<style lang="scss" scoped>
.member {
  margin-bottom: 2em;
}
</style>
