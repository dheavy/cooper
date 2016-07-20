<template>
  <waterfall :line="h" :line-gap="sizes.normal.width + 10" :watch="playlist">
    <waterfall-slot v-for="video in playlist" move-class="item-move" :width="sizes.normal.width" :height="sizes.normal.height" :order="$index">
      <media :video="video" :playlist="playlist" :scale="scales.normal"></media>
    </waterfall-slot>
  </waterfall>
</template>

<script>
import {
  MEDIA_SCALE_NORMAL,
  MEDIA_SCALE_LARGE,
  MEDIA_NORMAL_WIDTH,
  MEDIA_NORMAL_HEIGHT,
  MEDIA_LARGE_WIDTH,
  MEDIA_LARGE_HEIGHT,
  FEED_PUBLIC,
  FEED_MINE,
  FEED_COLLECTION
} from '../constants/config'
import WaterfallSlot from 'vue-waterfall/lib/waterfall-slot'
import Waterfall from 'vue-waterfall/lib/waterfall'
import {fetchFeed} from '../services/api'
import store from '../store'
import Media from './media'

export default {
  name: 'Feed',

  components: {
    Waterfall, WaterfallSlot, Media
  },

  data () {
    return {
      playlist: [],
      type: '',
      scales: {
        normal: MEDIA_SCALE_NORMAL,
        large: MEDIA_SCALE_LARGE
      },
      sizes: {
        normal: {
          width: MEDIA_NORMAL_WIDTH,
          height: MEDIA_NORMAL_HEIGHT
        },
        large: {
          width: MEDIA_LARGE_WIDTH,
          height: MEDIA_LARGE_HEIGHT
        }
      }
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
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style>
  .item-move {
    /* applied to the element when moving */
    transition: transform .5s cubic-bezier(.55,0,.1,1);
  }
</style>
