<template>
  <div class="player {{tvMode ? 'fullscreen' : ''}}" id="player">
    <iframe
      class="player-iframe"
      v-el:player
      v-if='video'
      scrolling="no"
      frameborder="0"
      style="border:none;"
      width="100%"
      height="{{tvMode ? '100%' : 400}}"
    ></iframe>

    <div class="meta" v-if='video' v-el:commands>
      <h5 class="title">{{video.title}}</h5>
      <p class="link">Original URL - <a href="{{video.original_url}}">{{video.original_url}}</a></p>
      <div class="playlist clearfix">
        <playlist-thumbnail
          v-for="media in filterPlaylistByViewMode(playlist, store.state.isNaughtyMode).slice(0, 10)"
          :media="media"
          :on-click="playlistThumbnailClickHandler"
          :is-active="video.id === media.id"
        ></playlist-thumbnail>

        <div class="thumb-more">
          <a href="#" @click.prevent="thumbMoreClickHandler">...</a>
        </div>
      </div>

      <div class="commands">
        <button-add
          :video="video"
        ></button-add>

        <button-tv
          :toggle-handler="toggleTVMode"
          :video="video"
        ></button-tv>
      </div>
    </div>
  </div>

  <acquisition :enable-add="true"></acquisition>
</template>

<script>
  import PlaylistThumbnail from './PlaylistThumbnail'
  import Acquisition from './Acquisition'
  import ButtonAdd from './ButtonAdd'
  import ButtonTv from './ButtonTv'
  import store from '../store'

  export default {
    name: 'Player',

    components: {
      PlaylistThumbnail,
      Acquisition,
      ButtonAdd,
      ButtonTv
    },

    props: ['exit', 'tvMode'],

    data () {
      return {
        store,
        currentVideoIndex: 0,
        commandsHideInterval: null
      }
    },

    computed: {
      video () {
        return store.player.video
      },

      playlist () {
        return store.player.playlist
      },

      maxVideoIndex () {
        return store.player.playlist.length - 1
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
      },
      'tvMode': {
        handler (isTVMode) {
          if (isTVMode) {
            this.enableHidingCommands()
          } else {
            this.disableHidingCommands()
          }
        }
      }
    },

    ready () {
      window.addEventListener('keyup', this.keyupHandler)
      this.$on('video:curate', (video) => {
        this.$broadcast('video:curate', video)
      })
    },

    methods: {
      filterPlaylistByViewMode (playlist, mode) {
        return playlist.filter((m) => {
          return m.is_naughty === mode
        })
      },

      createTVModeCommandHideInterval (e) {
        this.showCommands()
        this.commandsHideInterval = setInterval(this.hideCommands, 3000)
      },

      destroyTVModeCommandHideTimer () {
        clearInterval(this.commandsHideInterval)
      },

      showCommands () {
        this.destroyTVModeCommandHideTimer()
        this.$els.commands.classList.remove('hidden-xs-up')
      },

      hideCommands () {
        this.$els.commands.classList.add('hidden-xs-up')
        this.destroyTVModeCommandHideTimer()
      },

      enableHidingCommands () {
        window.addEventListener('mousemove', this.createTVModeCommandHideInterval)
        window.addEventListener('touchstart', this.createTVModeCommandHideInterval)
        window.addEventListener('click', this.createTVModeCommandHideInterval)
        window.addEventListener('keyup', this.createTVModeCommandHideInterval)
      },

      disableHidingCommands () {
        window.removeEventListener('mousemove', this.createTVModeCommandHideInterval)
        window.removeEventListener('touchstart', this.createTVModeCommandHideInterval)
        window.removeEventListener('click', this.createTVModeCommandHideInterval)
        window.removeEventListener('keyup', this.createTVModeCommandHideInterval)
        this.destroyTVModeCommandHideTimer()
      },

      toggleTVMode () {
        this.setTVMode(!this.store.player.isTVMode)
      },

      setTVMode (enable) {
        this.store.player.isTVMode = enable

        if (enable) {
          window.addEventListener('keyup', this.escapeBtnHandler)
        } else {
          window.removeEventListener('keyup', this.escapeBtnHandler)
        }
      },

      escapeBtnHandler (e) {
        // "Esc" - 27
        if (e.keyCode === 27) this.setTVMode(false)
      },

      keyupHandler (e) {
        // Arrow left - 37, arrow right - 39
        if (e.keyCode === 37) this.prevVideo()
        if (e.keyCode === 39) this.nextVideo()
      },

      loadVideo () {
        if (this.video && this.video.embed_url) {
          this.$els.player.setAttribute('src', this.video.embed_url)
          // this.$router.go(`?v=${this.video.id}`)
        }
      },

      playlistThumbnailClickHandler (video) {
        this.currentVideoIndex = this.playlist.indexOf(video)
        this.store.player.video = video
      },

      thumbMoreClickHandler () {
        this.$router.go({name: 'feed-collection', params: {cid: this.video.collection}})
        this.exit()
      },

      prevVideo () {
        this.currentVideoIndex = this.currentVideoIndex === 0 ? this.filterPlaylistByViewMode(this.playlist, this.store.state.isNaughtyMode).length - 1 : this.currentVideoIndex - 1
        this.playVideoByIndex(this.currentVideoIndex)
      },

      nextVideo () {
        this.currentVideoIndex = this.currentVideoIndex < this.filterPlaylistByViewMode(this.playlist, this.store.state.isNaughtyMode).length - 1 ? this.currentVideoIndex + 1 : 0
        this.playVideoByIndex(this.currentVideoIndex)
      },

      playVideoByIndex (i) {
        const filtered = this.filterPlaylistByViewMode(this.playlist, this.store.state.isNaughtyMode)
        this.store.player.video = filtered[i]
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

  .player.fullscreen {
    height: 100vh;

    .meta {
      position: absolute;
      width: 97%;
      top: 100%;
      margin-top: -150px;
      background: rgba(255, 255, 255, 0.5);
      padding: 1em;
    }

    .commands {
      right: 10px;
    }
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

  .commands {
    position: absolute;
    background: black;
    width: 50px;
    height: 100px;
    bottom: 0;
    right: 0;
  }

  .v-spinner {
    left: 50%;
    margin-top: 20%;
    margin-left: calc(-35px / 2);
    position: absolute;
  }
</style>
