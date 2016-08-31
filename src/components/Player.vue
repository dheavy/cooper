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
      <div class="playlist clearfix">
        <playlist-thumbnail
          v-for="media in playlist"
          v-if="media.is_naughty === store.state.isNaughtyMode"
          :media="media"
          :on-click="playlistThumbnailClickHandler"
        ></playlist-thumbnail>
        <div class="thumb-more">
          <a href="#" @click.prevent="thumbMoreClickHandler">...</a>
        </div>
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

    props: ['exit'],

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
          this.$router.go(`?v=${this.video.id}`)
          this.loading = false
        }
      },

      playlistThumbnailClickHandler (video) {
        this.store.player.video = video
      },

      thumbMoreClickHandler () {
        this.$router.go({name: 'feed-collection', params: {cid: this.video.collection}})
        this.exit()
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

  .thumb-more {
    position: relative;
    float: left;
    width: 60px;
    height: 60px;
    background-color: #CCC;

    a {
      position: relative;
      width: 100%;
      height: 100%;
      display: block;
    }
  }

  .v-spinner {
    left: 50%;
    margin-top: 20%;
    margin-left: calc(-35px / 2);
    position: absolute;
  }
</style>
