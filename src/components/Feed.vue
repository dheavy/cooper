<template>
  <h3 v-if="type === 'feed-collection'">
    {{currentCollectionName}}
  </h3>

  <div v-else class="btn-group" data-toggle="buttons">
    <label class="btn btn-primary {{type === 'feed-public' ? 'active' : ''}}">
      <input
        type="radio"
        name="options"
        autocomplete="off"
        :checked="type === 'feed-public' ? true : false"
        @click.prevent="showPublicFeed()"
      > Public Feed
    </label>
    <label class="btn btn-primary {{type === 'feed-mine' ? 'active' : ''}}">
      <input
        type="radio"
        name="options"
        autocomplete="off"
        :checked="type === 'feed-mine' ? true : false"
        @click.prevent="showMyFeed()"
      > My Feed
    </label>
  </div>

  <section class="layout clearfix">
    <div v-if="isLoaded && playlist.length === 0">
      Nothing to display here...
      <a v-if="type === 'feed-collection'" v-link="{name: 'create-video'}">Add a new video.</a>
    </div>
    <media
      v-else
      v-for="video in playlist | orderBy 'id' -1"
      v-show="video.is_naughty === store.state.isNaughtyMode"
      class="media-item {{video.scale}}"
      :video="video"
      :playlist="playlist"
      :scale="video.scale"
      :feed-type="type"
      :edit-handler="$options.components.Acquisition.showEditModal"
    ></media>
  </section>

  <acquisition
    :enable-add="true"
    :enable-edit="true"
    :add-video-callback="fetchData(store.state.isNaughtyMode)"
  ></acquisition>

</template>

<script>
  import {
    FEED_PUBLIC,
    FEED_MINE,
    FEED_COLLECTION
  } from '../constants/config'
  import {fetchFeed} from '../services/api'
  import {parseError, watchViewModeChanges} from '../mixins'
  import CreateVideo from './CreateVideo'
  import Acquisition from './Acquisition'
  import Masonry from 'masonry-layout'
  import {router} from '../main'
  import store from '../store'
  import Media from './media'

  export default {
    name: 'Feed',

    mixins: [parseError, watchViewModeChanges],

    components: {
      Media, CreateVideo, Acquisition
    },

    data () {
      return {
        store,
        layout: null,
        isLoaded: false,
        playlist: [],
        currentCollectionName: null,
        type: ''
      }
    },

    ready () {
      this.fetchData(this.store.state.isNaughtyMode)
    },

    methods: {
      determineFeedType (path) {
        if (/\/feed\/\d+\/?$/.test(path)) return FEED_COLLECTION
        if (/\/feed\/mine\/?$/.test(path)) return FEED_MINE
        if (/\/feed\/?$/.test(path)) return FEED_PUBLIC
      },

      showPublicFeed () {
        router.go({name: 'feed-public'})
      },

      showMyFeed () {
        router.go({name: 'feed-mine'})
      },

      fetchData (naughty = false) {
        const payload = {
          type: this.type,
          userId: this.store.getUser().id,
          token: this.store.getToken(),
          naughty: naughty
        }

        payload.collectionId = this.type === FEED_COLLECTION
                               ? this.$route.params.cid
                               : null

        fetchFeed(payload)
          .then(res => {
            this.playlist = res.payload

            // In case we're dealing with feed-collection,
            // expect a collection `name`.
            if (res.name) {
              this.currentCollectionName = res.name
            }

            if (this.playlist.length > 0) {
              this.$nextTick(() => {
                this.layout = new Masonry('.layout', {
                  itemSelector: '.media-item',
                  isResizeBound: true,
                  gutter: 10
                })
              })
            }

            this.isLoaded = true
          })
          .catch(err => {
            console.log(err)
          })
      },

      viewModeChangeHandler (val) {
        this.fetchData(val)
      }
    },

    route: {
      data () {
        this.type = this.determineFeedType(this.$route.path)
        this.fetchData(this.store.state.isNaughtyMode)
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

  .modal {
    background: rgba(0, 0, 0, 0.75);
  }

  .modal-dialog {
    height: 100vh;
  }

  .modal-body {
    min-height: 200px;
    height: auto;
  }

  .modal-content {
    top: 100vh;
    margin-top: calc(-50vh - 200px);
  }
</style>
