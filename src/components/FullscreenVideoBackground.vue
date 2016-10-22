<template>
  <section class="fs-bg-component">
    <video
      v-if="!store.device.isMobile"
      loop muted autoplay
      poster="{{poster}}"
      :style="dimensions"
    >
      <source
        v-for="video in videos"
        :src="video.src"
        :type="video.type"
      >
    </video>
  </section>
</template>

<script>
  import store from '../store'

  export default {
    name: 'FullscreenVideoBackground',

    data () {
      return {
        store,
        posters: [
          'static/images/mp-poster-0.png',
          'static/images/mp-poster-1.png',
          'static/images/mp-poster-2.png',
          'static/images/mp-poster-3.png',
          'static/images/mp-poster-4.png',
          'static/images/mp-poster-5.png'
        ],
        videos: [
          {src: 'static/videos/mp.mp4', type: 'video/mp4'},
          {src: 'static/videos/mp.webm', type: 'video/webm'}
        ]
      }
    },

    computed: {
      poster () {
        if (this.store.device.isMobile) {
          return this.posters[Math.floor(Math.random() * ((this.posters.length - 1) + 1))]
        }
        return ''
      },

      dimensions () {
        const videoRatio = 16 / 9
        const ratio = window.innerWidth / window.innerHeight

        // Landscape.
        if (window.innerWidth > window.innerHeight) {
          // Window width exceeds or equals video width.
          if (ratio > videoRatio) {
            return {'width': '100%', 'height': 'auto'}
          } else {
            return {'height': '100%', 'width': 'auto'}
          }
        }
      }
    }
  }
</script>

<style>
  .fs-bg-component {
    background: black;
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 0;
  }

  video {
    opacity: .25;
  }

  a.link-forgot,
  a.link-forgot:visited,
  a.link-forgot:active,
  a.link-forgot:hover {
    color: white;
    text-decoration: none;
  }
</style>
