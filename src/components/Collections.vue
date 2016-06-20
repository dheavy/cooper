<template>
  <section class="collections">
    <div v-if="$loadingRouteData">Loading collections...</div>
    <div v-if="!$loadingRouteData">
      <div class="alert alert-danger" v-if="error">
        <p>{{error}}</p>
      </div>
    </div>
  </section>
</template>

<script>
import {API_URL} from '../constants/api'
import store from '../store'

export default {
  name: 'Collections',

  data () {
    return {
      store,
      error: ''
    }
  },

  props: [
    'id'
  ],

  route: {
    data ({next}) {
      setTimeout(() => {
        next()
      }, 1000)
    }
  },

  ready () {
    this.fetchCollections(this)
  },

  methods: {
    fetchCollections: (context) => {
      const id = context.id ? context.id : context.store.getUser().id
      context.$http
        .get(`${API_URL}users/${id}/collections`)
        .then((res) => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
          context.error = 'Oops... There was an error on our end. Please refresh this page.'
        })
    }
  }
}
</script>

<style lang="scss" scoped>
section {
  margin-top: 2em;
}
</style>
