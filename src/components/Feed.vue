<template>
  <navigation
    :auth="true"
    :user-id="user.id"
  ></navigation>

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
    <div v-if="loaded && playlist.length === 0">
      Nothing to display here...
      <a v-if="type === 'feed-collection'" v-link="{name: 'create-video'}">Add a new video.</a>
    </div>
    <media
      v-else
      v-for="video in playlist | orderBy 'id' -1"
      class="media-item {{video.scale}}"
      :video="video"
      :playlist="playlist"
      :scale="video.scale"
      :feed-type="type"
      :add-handler="showAddModal"
      :edit-handler="showEditModal"
    ></media>
  </section>

  <!-- add video modal -->
  <div name="close" class="modal" v-el:add-modal @click.stop="hideModal">
    <div class="modal-dialog" role="document">
      <div class="modal-content"@>

        <validator name="addVideoValidation">
          <form novalidate>
            <div class="modal-header">
              <button type="button" class="close" @click.stop="hideModal">
                <span name="close" aria-hidden="true">&times;</span>
              </button>
              <div class="alert alert-success" v-if="success">{{success}}</div>
              <div class="alert alert-danger" v-if="error">{{error}}</div>
              <div class="alert alert-warning" v-if="warning" name="close">{{{warning}}}</div>
              <div class="alert alert-danger" v-if="submitted && !showNewCollectionForm && $addVideoValidation.cid.validExistingCollection">Please choose a collection.</div>
              <div class="alert alert-danger" v-if="submitted && showNewCollectionForm && $addVideoValidation.ncid.validNewCollection">Please choose a collection name.</div>
              <h4 v-if="!error && !warning && !success" class="col-sm-12">Add this video</h4>
            </div>

            <div class="modal-body" v-show="isFormVisible">
              <input type="hidden" class="form-control" v-model="payload.hash">
              <div class="form-group row">
                <div class="col-sm-12 col-md-12">
                  <label for="title" class="col-sm-4 form-control-label">Title</label>
                  <input type="text" class="form-control" name="title" placeholder="Title" v-model="payload.title">
                </div>
              </div>
              <div class="form-group row">
                <div class="col-sm-12 col-md-12">
                  <label for="collection" class="col-sm-4 form-control-label">Collection</label>
                  <select
                    v-model="payload.collection_id"
                    v-validate:cid="{validExistingCollection: true}"
                    class="c-select col-sm-12 col-md-12"
                    name="collection"
                  >
                    <optgroup>
                      <option selected value="-1">Choose a collection</option>
                    </optgroup>
                    <optgroup>
                      <option v-if="collections" v-for="collection in collections" value="{{collection.id}}">{{collection.name}}</option>
                    </optgroup>
                    <optgroup>
                      <option >{{createNewLabel}}</option>
                    </optgroup>
                  </select>
                </div>
              </div>
              <div class="form-group row">
                <div class="col-sm-12 col-md-12">
                  <input
                    type="text"
                    class="form-control"
                    v-model="payload.new_collection_name"
                    v-show="showNewCollectionForm"
                    placeholder="My new collection name"
                    v-validate:ncid="{validNewCollection: true}"
                  >
                </div>
              </div>
            </div>

            <div class="modal-footer" v-show="isFormVisible">
              <button name="close" type="button" class="btn btn-secondary" @click.stop="hideModal">Close</button>
              <button type="button" class="btn btn-primary" @click.prevent="addVideo(payload)">Save changes</button>
            </div>
          </form>
        </validator>

      </div>
    </div>
  </div>
  <!-- /add video modal -->

  <!-- edit video modal -->
  <div name="close" class="modal" v-el:edit-modal @click.stop="hideModal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">

        <validator name="editVideoValidation">
          <form novalidate>
            <div class="modal-header">
              <button type="button" class="close" @click.stop="hideModal">
                <span name="close" aria-hidden="true">&times;</span>
              </button>
              <div class="alert alert-success" v-if="success">{{success}}</div>
              <div class="alert alert-danger" v-if="error">{{error}}</div>
              <div class="alert alert-warning" v-if="warning">{{{warning}}}</div>
              <div class="alert alert-danger" v-if="submitted && !showNewCollectionForm && $editVideoValidation.cid.validExistingCollection">Please choose a collection.</div>
              <div class="alert alert-danger" v-if="submitted && showNewCollectionForm && $editVideoValidation.ncid.validNewCollection">Please choose a collection name.</div>
              <h4 v-if="!error && !warning && !success" class="col-sm-12">Edit this video</h4>
            </div>

            <div class="modal-body" v-show="isFormVisible">
              <input type="hidden" class="form-control" v-model="payload.hash">
              <div class="form-group row">
                <div class="col-sm-12 col-md-12">
                  <label for="title" class="col-sm-4 form-control-label">Title</label>
                  <input type="text" class="form-control" name="title" placeholder="Title" v-model="payload.title">
                </div>
              </div>
              <div class="form-group row">
                <div class="col-sm-12 col-md-12">
                  <label for="collection" class="col-sm-4 form-control-label">Collection</label>
                  <select
                    v-model="payload.collection_id"
                    v-validate:cid="{validExistingCollection: true}"
                    class="c-select col-sm-12 col-md-12"
                    name="collection"
                  >
                    <optgroup>
                      <option v-if="collections" v-for="collection in collections" value="{{collection.id}}">{{collection.name}}</option>
                    </optgroup>
                    <optgroup>
                      <option >{{createNewLabel}}</option>
                    </optgroup>
                  </select>
                </div>
              </div>
              <div class="form-group row">
                <div class="col-sm-12 col-md-12">
                  <input
                    type="text"
                    class="form-control"
                    v-model="payload.new_collection_name"
                    v-show="showNewCollectionForm"
                    placeholder="My new collection name"
                    v-validate:ncid="{validNewCollection: true}"
                  >
                </div>
              </div>
            </div>

            <div class="modal-footer" v-show="isFormVisible">
              <button name="close" type="button" class="btn btn-secondary" @click.stop="hideModal">Close</button>
              <button type="button" class="btn btn-primary" @click.prevent="editVideo(payload)">Save changes</button>
            </div>
          </form>
        </validator>

      </div>
    </div>
  </div>
  <!-- /edit video modal -->

</template>

<script>
import {
  FEED_PUBLIC,
  FEED_MINE,
  FEED_COLLECTION
} from '../constants/config'
import {
  fetchFeed,
  fetchCollections,
  checkIfUserHasVideo,
  curateVideo,
  editVideo
} from '../services/api'
import CreateVideo from './CreateVideo'
import Navigation from './Navigation'
import {parseError} from '../mixins'
import Masonry from 'masonry-layout'
import {router} from '../main'
import store from '../store'
import Media from './media'

export default {
  name: 'Feed',

  mixins: [parseError],

  components: {Media, Navigation, CreateVideo},

  validators: {
    validExistingCollection (val) {
      return val >= 1
    },

    validNewCollection (val) {
      return val.trim() !== ''
    }
  },

  computed: {
    showNewCollectionForm () {
      return this.payload.collection_id === this.createNewLabel
    }
  },

  data () {
    return {
      layout: null,
      loaded: false,
      isFormVisible: true,
      submitted: false,
      error: null,
      warning: null,
      success: null,
      playlist: [],
      createNewLabel: '...or create a new one',
      currentCollectionName: null,
      payload: {
        id: '',
        original_url: '',
        scale: '',
        title: '',
        hash: '',
        collection_id: -1,
        new_collection_name: ''
      },
      type: '',
      user: store.getUser(),
      collections: store.getCollections()
    }
  },

  ready () {
    this.getCollections()
  },

  methods: {
    determineFeedType (path) {
      if (/\/feed\/\d+\/?$/.test(path)) return FEED_COLLECTION
      if (/\/feed\/mine\/?$/.test(path)) return FEED_MINE
      if (/\/feed\/?$/.test(path)) return FEED_PUBLIC
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

    showAddModal (video) {
      this.payload.title = video.title
      this.payload.hash = video.hash
      this.payload.id = video.id
      this.payload.scale = video.scale
      this.$els.addModal.style.display = 'block'

      checkIfUserHasVideo(store.getUser().id, video.hash, store.getToken())
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

    showEditModal (video) {
      this.payload.title = video.title
      this.payload.hash = video.hash
      this.payload.id = video.id
      this.payload.scale = video.scale
      this.payload.collection_id = video.collection
      this.$els.editModal.style.display = 'block'
    },

    hideModal (e) {
      if (e.target.getAttribute('name') !== 'close') return

      this.payload = {hash: '', collection_id: -1, title: ''}
      this.warning = null
      this.error = null
      this.success = null
      this.$els.addModal.style.display = 'none'
      this.$els.editModal.style.display = 'none'
    },

    showPublicFeed () {
      router.go({name: 'feed-public'})
    },

    showMyFeed () {
      router.go({name: 'feed-mine'})
    },

    showForm () {
      this.isFormVisible = true
    },

    hideForm () {
      this.isFormVisible = false
    },

    resetValidation () {
      this.submitted = false
      this.resetForm()
      this.$resetValidation()

      this.isFormVisible = true

      this.payload = {
        id: '',
        original_url: '',
        scale: '',
        title: '',
        hash: '',
        collection_id: -1,
        new_collection_name: ''
      }
    },

    resetForm () {
      this.success = null
      this.error = null
      this.warning = null
      this.showForm = true
    },

    chooseNameOrId (payload) {
      if (payload.new_collection_name.trim() !== '') {
        payload.collection_id = -1
        payload.new_collection_name = payload.new_collection_name.trim()
      }
      return payload
    },

    addVideo (payload) {
      this.submitted = true

      if (!this.$addVideoValidation.cid.validExistingCollection || !this.$addVideoValidation.ncid.validNewCollection) {
        this.error = null
        this.payload = this.chooseNameOrId(this.payload)

        curateVideo(
          store.getUser().id,
          payload.id,
          payload.hash,
          payload.original_url,
          payload.title,
          payload.scale,
          +payload.collection_id,
          payload.new_collection_name,
          store.getToken()
        )
          .then(res => {
            this.success = 'Video added successfully!'
            this.hideForm()
            store.markCollectionsDirty(true)
          })
          .catch(err => {
            this.parseError(err)
          })

        this.resetValidation()
      }
    },

    editVideo (payload) {
      this.submitted = true

      if (!this.$addVideoValidation.cid.validExistingCollection || !this.$addVideoValidation.ncid.validNewCollection) {
        editVideo(payload, store.getToken())
          .then(res => {
            store.markCollectionsDirty(true)
            this.fetchData()
            this.success = 'Video edited successfully successfully!'
            this.hideForm()
          })
          .catch(err => {
            this.parseError(err)
          })

        this.resetValidation()
      }
    },

    fetchData () {
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

          this.loaded = true
        })
        .catch(err => {
          console.log(err)
        })
    }
  },

  route: {
    data () {
      this.type = this.determineFeedType(this.$route.path)
      this.fetchData()
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
