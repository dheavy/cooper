<template>
  <section class="layout clearfix">
    <media
      v-for="video in playlist | orderBy 'id' -1"
      class="media-item {{video.scale}}"
      :video="video"
      :playlist="playlist"
      :scale="video.scale"
    ></media>
  </section>
</template>

<script>
import {
  FEED_PUBLIC,
  FEED_MINE,
  FEED_COLLECTION
} from '../constants/config'
import {fetchFeed} from '../services/api'
import Masonry from 'masonry-layout'
import store from '../store'
import Media from './media'

export default {
  name: 'Feed',

  components: {Media},

  data () {
    return {
      layout: null,
      playlist: [],
      type: ''
    }
  },

  methods: {
    determineFeedType (path) {
      if (/\/feed\/collection\/?$/.test(path)) return FEED_COLLECTION
      if (/\/feed\/mine\/?$/.test(path)) return FEED_MINE
      if (/\/feed\/?$/.test(path)) return FEED_PUBLIC
    }
  },

  route: {
    data () {
      this.type = this.determineFeedType(this.$route.path)

      const payload = {
        type: this.type,
        userId: store.getUser().id,
        token: store.getToken()
      }

      payload.collectionId = this.type === FEED_COLLECTION
                             ? this.$route.params.cid
                             : null

      fetchFeed(payload)
        .then(res => {
          this.playlist = res.payload.videos
          this.$nextTick(() => {
            this.layout = new Masonry('.layout', {
              itemSelector: '.media-item',
              isResizeBound: true,
              gutter: 10
            })
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.layout {
  width: 100%;
  position: relative;
  height: auto;
  min-height: 100vh;
}
</style>
