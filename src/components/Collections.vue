<template>
  <section class="collections">
    <div v-if="loading"><p>Loading collections...</p></div>
    <div v-if="error"><p>{{error}}</p></div>
    <collection-rack
      v-else
      v-if="collections"
      v-for="collection in collections | orderBy 'created_at' -1"
      :collection="collection"
      :other-collections="getOtherCollectionThanThis(collection)"
      :are-my-own="areMyOwn"
    ></collection-rack>
  </section>
</template>

<script>
import collectionRack from './CollectionRack'
import {USERS_URL} from '../constants/api'
import store from '../store'
import Vue from 'vue'

export default {
  name: 'Collections',

  props: ['userId', 'areMyOwn'],

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

  ready () {
    this.loading = true
    this.fetchCollections()

    // Force rendering of collections if currently shown user is changed.
    this.$watch('areMyOwn', (val, oldVal) => {
      this.fetchCollections()
    })
  },

  methods: {
    getOtherCollectionThanThis (collection) {
      const collections = [...this.collections]
      collections.splice(collections.indexOf(collection), 1)
      return collections
    },

    fetchCollections () {
      Vue.http.headers.common['Authorization'] = `Bearer ${this.store.getToken()}`

      this.$http
        .get(`${USERS_URL}/${this.userId}/collections`)
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
  overflow: hidden;
}
</style>
