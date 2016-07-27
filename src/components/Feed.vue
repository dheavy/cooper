<template>
  <navigation
    :auth="true"
    :user-id="user.id"
  ></navigation>
  <section class="layout clearfix">
    <media
      v-for="video in playlist | orderBy 'id' -1"
      class="media-item {{video.scale}}"
      :video="video"
      :playlist="playlist"
      :scale="video.scale"
      :is-added="isVideoAdded(video.id)"
    ></media>
  </section>

  <div class="modal" v-el:modal>
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" v-on:click="hideModal">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title">Add video</h4>
        </div>
        <div class="modal-body">
          <div class="alert alert-danger" v-if="addVideoError">{{addVideoError}}</div>
          <div class="form-group">
            <input type="hidden" class="form-control" placeholder="Title" v-model="payload.hash">
          </div>
          <div class="form-group">
            <input type="text" class="form-control" placeholder="Title" v-model="payload.title">
          </div>
          <div class="form-group">
            <select v-model="payload.collection_id" class="c-select col-xs-12">
              <optgroup>
                <option selected>Choose a collection</option>
              </optgroup>
              <optgroup>
                <option v-if="collections" v-for="collection in collections" value="{{collection.id}}">{{collection.name}}</option>
              </optgroup>
              <optgroup>
                <option>...or create a new one</option>
              </optgroup>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  FEED_PUBLIC,
  FEED_MINE,
  FEED_COLLECTION
} from '../constants/config'
import {fetchFeed, fetchCollections} from '../services/api'
import CreateVideo from './CreateVideo'
import Navigation from './Navigation'
import Masonry from 'masonry-layout'
import store from '../store'
import Media from './media'

export default {
  name: 'Feed',

  components: {Media, Navigation, CreateVideo},

  data () {
    return {
      layout: null,
      addVideoError: '',
      playlist: [],
      type: '',
      user: store.getUser(),
      collections: store.getCollections(),
      payload: {
        hash: '',
        collection_id: -1,
        title: ''
      }
    }
  },

  ready () {
    this.getCollections()
  },

  methods: {
    determineFeedType (path) {
      if (/\/feed\/collection\/?$/.test(path)) return FEED_COLLECTION
      if (/\/feed\/mine\/?$/.test(path)) return FEED_MINE
      if (/\/feed\/?$/.test(path)) return FEED_PUBLIC
    },

    isVideoAdded (id) {
      return store.getVideosIndex().indexOf(id) > -1
    },

    getCollections () {
      if (!this.collections) {
        fetchCollections(store.getUser().id, store.getToken())
          .then(res => {
            this.collections = res.payload
          })
          .catch(err => {
            console.log(err)
            this.error = 'Oops... There was an error. Please refresh the page.'
          })
      }
    },

    showModal (hash, title) {
      this.payload.hash = hash
      this.payload.title = title
      this.$els.modal.style.display = 'block'
    },

    hideModal () {
      this.payload.hash = ''
      this.payload.title = ''
      this.$els.modal.style.display = 'none'
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
          this.playlist = res.payload
          console.log(res.payload)
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

.modal {
  background: rgba(0, 0, 0, 0.75);
}

.modal-dialog {
  height: 100vh;
}

.modal-body {
  height: 130px;
}

.modal-content {
  top: 100vh;
  margin-top: calc(-50vh - 270px/2);
}
</style>
