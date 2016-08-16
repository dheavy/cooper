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
  import {fetchCollections} from '../services/api'
  import CollectionRack from './CollectionRack'
  import store from '../store'

  export default {
    name: 'Collections',

    props: ['userId', 'areMyOwn'],

    components: {
      CollectionRack
    },

    data () {
      return {
        loading: false,
        error: '',
        collections: null
      }
    },

    ready () {
      this.loading = true
      this.fetchCollections(store.areCollectionsDirty())

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

      fetchCollections (bustCache = false) {
        return fetchCollections(this.userId, store.getToken(), bustCache)
          .then(res => {
            this.loading = false
            this.collections = res.payload
            if (bustCache) {
              store.setCollections(this.collections)
              store.markCollectionsDirty(false)
            }
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
