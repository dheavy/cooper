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
    <div class="meta">
      <h4 class="title">{{video.title}}</h4>
      <p class="link"><a href="{{video.original_url}}">{{video.original_url}}</a></p>
      <div class="playlist">
        <thumbnail v-for="item in playlist"></thumbnail>
      </div>
    </div>
  </div>
</template>

<script>
  import ClipLoader from 'vue-spinner/src/ClipLoader'
  import Thumbnail from './Thumbnail'

  export default {
    name: 'Player',

    props: ['video', 'playlist'],

    components: {ClipLoader, Thumbnail},

    data () {
      return {
        loading: false
      }
    },

    ready () {
      this.loading = true
      this.loadVideo()
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
