<template>
  <media
    v-for="video in playlist"
    :video="video"
    :playlist="playlist"
    :scale="video.scale"
    v-bind:style="{width: (video.scale === 'normal' ? sizes.normal.width : sizes.large.width) + 'px', height: (video.scale === 'normal' ? sizes.normal.height : sizes.large.height) + 'px'}"
  ></media>
  <!-- <waterfall
    id="wf"
    :line="v"
    :line-gap="sizes.normal.width + sizes.gutter"
    :watch="playlist"
  >
    <waterfall-slot
      v-for="video in playlist"
      move-class="item-move"
      :width="video.scale === 'normal' ? sizes.normal.width : sizes.large.width"
      :height="video.scale === 'normal' ? sizes.normal.height : sizes.large.height"
      :order="$index"
    >
      <media
        :video="video"
        :playlist="playlist"
        :scale="video.scale"
        v-bind:style="{width: (video.scale === 'normal' ? sizes.normal.width : sizes.large.width) + 'px', height: (video.scale === 'normal' ? sizes.normal.height : sizes.large.height) + 'px'}"
      ></media>
    </waterfall-slot>
  </waterfall> -->
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
import {fetchFeed} from '../services/api'
import store from '../store'
import Media from './media'

export default {
  name: 'Feed',

  components: {Media},

  data () {
    return {
      playlist: [],
      type: '',
      scales: {
        normal: MEDIA_SCALE_NORMAL,
        large: MEDIA_SCALE_LARGE
      },
      sizes: {
        gutter: 10,
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

  events: {
    // HACK: Fix height of WF container after reflow, otherwise
    // height of random, large mediae are not taken into account
    // and disappear under the hidden overflow.
    'wf-reflowed' () {
      const wf = document.getElementById('wf')
      setTimeout(() => {
        wf.style.overflow = 'auto'
        wf.style.height = wf.scrollHeight + this.sizes.gutter + 'px'
        wf.style.overflow = 'hidden'
      }, 500)
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
