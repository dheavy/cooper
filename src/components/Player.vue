<template>
  <div class="player">
    <clip-loader
      :loading="loading"
    ></clip-loader>
    <iframe
      v-el:iframe
      v-if='video'
      scrolling="no"
      frameborder="0"
      style="border:none;"
      width="100%"
      height="400"
    ></iframe>
    <div class="meta" v-if='video'>
      <h5 class="title">{{video.title}}</h5>
      <p class="link">Original URL - <a href="{{video.original_url}}">{{video.original_url}}</a></p>
      <div class="playlist">
        <playlist-thumbnail v-for="item in playlist"></playlist-thumbnail>
      </div>
    </div>
  </div>
</template>

<script>
  import ClipLoader from 'vue-spinner/src/ClipLoader'
  import PlaylistThumbnail from './PlaylistThumbnail'
  import store from '../store'

  export default {
    name: 'Player',

    components: {ClipLoader, PlaylistThumbnail},

    data () {
      return {
        store,
        loading: false
      }
    },

    computed: {
      video () {
        return store.player.video
      },
      playlist () {
        return store.player.playlist
      }
    },

    watch: {
      'store.player.video': {
        handler (video) {
          if (video) {
            this.loadVideo()
          }
        },
        deep: true
      }
    },

    methods: {
      loadVideo () {
        if (this.video && this.video.embed_url) {
          this.$els.iframe.setAttribute('src', this.video.embed_url)
          this.loading = false
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .player {
    width: 100%;
    z-index: 0;
    border-radius: 0.3rem;
    overflow: hidden;
    position: relative;
  }

  .link {
    font-size: 10px;
  }

  .meta {
    margin-left: 1rem;
  }

  .v-spinner {
    left: 50%;
    margin-top: 20%;
    margin-left: calc(-35px / 2);
    position: absolute;
  }
</style>
