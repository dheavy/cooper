<template>
  <section class="collections">
    <div v-if="loading"><p>Loading collections...</p></div>
    <div v-if="error"><p>{{error}}</p></div>
    <collection-rack
      v-else
      v-if="collections"
      v-for="collection in collections | orderBy 'created_at' -1"
      :collection="collection"
    ></collection-rack>
  </section>
</template>

<script>
import collectionRack from './CollectionRack'
import {USERS_URL} from '../constants/api'
import store from '../store'

export default {
  name: 'Collections',

  components: {
    collectionRack
  },

  data () {
    return {
      store,
      loading: false,
      error: '',
      collections: null
    }
  },

  route: {
    // Leave a small delay to display message during data acquisition.
    data () {
      this.loading = true
      this.fetchCollections()
    }
  },

  methods: {
    fetchCollections () {
      const id = this.id ? this.id : this.store.getUser().id
      this.$http
        .get(`${USERS_URL}/${id}/collections`)
        .then(res => {
          console.log(res)
          this.loading = false
          this.collections = res.data
        })
        .catch(err => {
          console.log(err)
          this.loading = false
          this.error = 'Oops... There was an error on our end. Please refresh this page.'
        })
    }
  }
}
</script>

<style lang="scss" scroped>
.collections {
  margin-top: 2em;
}
</style>
