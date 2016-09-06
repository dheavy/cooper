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
          v-if="media.is_naughty === store.state.isNaughtyMode && $index < 10"
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
          :add-handler="showAddModal"
          :video="video"
        ></button-add>

        <button-tv
          :toggle-handler="() => {}"
          :video="video"
        ></button-tv>
      </div>
    </div>

  </div>

  <!-- add video modal -->
  <modal-add-video
    v-el:add-modal
    :hide-modal='hideModal'
    :success='success'
    :error='error'
    :warning='warning'
    :is-form-visible='isFormVisible'
    :payload.sync='payload'
    :collections='collections'
    :show-new-collection-form='showNewCollectionForm'
    :add-video='addVideo'
    :create-new-label='createNewLabel'
  ></modal-add-video>
  <!-- /add video modal -->
</template>

<script>
  import {checkIfUserHasVideo, curateVideo} from '../services/api'
  import ClipLoader from 'vue-spinner/src/ClipLoader'
  import PlaylistThumbnail from './PlaylistThumbnail'
  import ModalAddVideo from './ModalAddVideo'
  import ButtonAdd from './ButtonAdd'
  import ButtonTv from './ButtonTv'
  import store from '../store'

  export default {
    name: 'Player',

    components: {
      ClipLoader,
      PlaylistThumbnail,
      ButtonAdd,
      ButtonTv,
      ModalAddVideo
    },

    props: ['exit'],

    // TODO: Refactor AddVideoModal

    data () {
      return {
        store,
        loading: false,
        currentVideoIndex: 0,
        createNewLabel: '...or create a new one',
        error: null,
        warning: null,
        success: null,
        isFormVisible: true,
        areFormButtonsVisible: true,
        payload: {
          id: '',
          original_url: '',
          scale: '',
          title: '',
          hash: '',
          collection_id: -1,
          new_collection_name: ''
        },
        collections: store.getCollections()
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
        return store.player.playlist.length > 9 ? 9 : store.player.playlist.length
      },

      showNewCollectionForm () {
        return this.payload.collection_id === this.createNewLabel
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

    ready () {
      window.addEventListener('keyup', this.keyupHandler)
    },

    methods: {
      keyupHandler (e) {
        // Arrow left - 37, arrow right - 39
        if (e.keyCode === 37) this.prevVideo()
        if (e.keyCode === 39) this.nextVideo()
      },

      loadVideo () {
        if (this.video && this.video.embed_url) {
          this.$els.iframe.setAttribute('src', this.video.embed_url)
          this.$router.go(`?v=${this.video.id}`)
          this.loading = false
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
        this.currentVideoIndex = this.currentVideoIndex === 0 ? this.maxVideoIndex - 1 : this.currentVideoIndex - 1
        this.playVideoByIndex(this.currentVideoIndex)
      },

      nextVideo () {
        this.currentVideoIndex = this.currentVideoIndex < this.maxVideoIndex - 1 ? this.currentVideoIndex + 1 : 0
        this.playVideoByIndex(this.currentVideoIndex)
      },

      playVideoByIndex (i) {
        this.store.player.video = this.playlist[i]
      },

      showAddModal (video) {
        this.payload.title = video.title
        this.payload.hash = video.hash
        this.payload.id = video.id
        this.payload.scale = video.scale
        this.$els.addModal.style.display = 'block'

        checkIfUserHasVideo(this.store.getUser().id, video.hash, this.store.getToken())
          .then(res => {
            if (+res.status === 206) {
              this.warning = `Pssst... You have already curated this video <a href="/feed/${res.payload.id}">here</a>.`
            }
          })
          .catch(err => {
            console.log(err)
            this.error = 'Oops... there was an error. Please close and try again.'
          })
      },

      addVideo (payload, $validator) {
        this.submitted = true

        if (!$validator.cid.validExistingCollection || !$validator.ncid.validNewCollection) {
          this.error = null
          this.payload = this.chooseNameOrId(this.payload)

          curateVideo(
            this.store.getUser().id,
            payload.id,
            payload.hash,
            payload.original_url,
            payload.title,
            payload.scale,
            +payload.collection_id,
            payload.new_collection_name,
            this.store.getToken()
          )
            .then(res => {
              this.success = 'Video added successfully!'
              this.hideForm()
              this.store.markCollectionsDirty(true)
            })
            .catch(err => {
              this.parseError(err)
            })

          this.resetValidation()
        }
      },

      hideModal (e) {
        if (e.target.getAttribute('rel') !== 'close') return

        this.showForm()

        this.payload = {hash: '', collection_id: -1, title: ''}

        this.warning = null
        this.error = null
        this.success = null
        this.isDeleting = false
        this.$els.addModal.style.display = 'none'
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
