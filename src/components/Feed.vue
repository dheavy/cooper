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
      :add-handler="showAddModal"
      :edit-handler="showEditModal"
    ></media>
  </section>

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

  <!-- edit video modal -->
  <modal-edit-video
    v-el:edit-modal
    :hide-modal='hideModal'
    :success='success'
    :error='error'
    :warning='warning'
    :is-form-visible='isFormVisible'
    :payload.sync='payload'
    :collections='collections'
    :show-new-collection-form='showNewCollectionForm'
    :edit-video='editVideo'
    :cancel-delete='cancelDelete'
    :create-new-label='createNewLabel'
    :apply-delete='applyDelete'
  ></modal-edit-video>
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
    checkIfUserHasVideo,
    curateVideo,
    editVideo,
    deleteVideo
  } from '../services/api'
  import {parseError, watchViewModeChanges} from '../mixins'
  import ModalEditVideo from './ModalEditVideo'
  import ModalAddVideo from './ModalAddVideo'
  import CreateVideo from './CreateVideo'
  import Masonry from 'masonry-layout'
  import {router} from '../main'
  import store from '../store'
  import Media from './media'

  export default {
    name: 'Feed',

    mixins: [parseError, watchViewModeChanges],

    components: {
      Media, CreateVideo, ModalAddVideo, ModalEditVideo
    },

    computed: {
      showNewCollectionForm () {
        return this.payload.collection_id === this.createNewLabel
      }
    },

    data () {
      return {
        store,
        layout: null,
        isLoaded: false,
        isDeleting: false,
        isFormVisible: true,
        areFormButtonsVisible: true,
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
      this.fetchData(this.store.state.isNaughtyMode)
    },

    methods: {
      determineFeedType (path) {
        if (/\/feed\/\d+\/?$/.test(path)) return FEED_COLLECTION
        if (/\/feed\/mine\/?$/.test(path)) return FEED_MINE
        if (/\/feed\/?$/.test(path)) return FEED_PUBLIC
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

      showEditModal (video) {
        this.showForm()

        this.payload.title = video.title
        this.payload.hash = video.hash
        this.payload.id = video.id
        this.payload.scale = video.scale
        this.payload.collection_id = video.collection
        this.$els.editModal.style.display = 'block'
      },

      hideModal (e) {
        if (e.target.getAttribute('name') !== 'close') return

        this.showForm()

        this.payload = {hash: '', collection_id: -1, title: ''}

        this.warning = null
        this.error = null
        this.success = null
        this.isDeleting = false
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
        this.areFormButtonsVisible = true
      },

      hideForm (hideButtons = true) {
        this.isFormVisible = false
        this.areFormButtonsVisible = hideButtons
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
        this.showForm()
      },

      chooseNameOrId (payload) {
        if (payload.new_collection_name && payload.new_collection_name.trim() !== '') {
          payload.collection_id = -1
          payload.new_collection_name = payload.new_collection_name.trim()
        }
        return payload
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

      editVideo (payload, $validator) {
        this.submitted = true

        if (!$validator.cid.validExistingCollection || !$validator.ncid.validNewCollection) {
          editVideo(payload, this.store.getToken())
            .then(res => {
              this.store.markCollectionsDirty(true)
              this.fetchData(this.store.state.isNaughtyMode)
              this.success = 'Video successfully edited!'
              this.hideForm()
            })
            .catch(err => {
              this.parseError(err)
            })

          this.resetValidation()
        }
      },

      confirmDelete (payload) {
        this.isDeleting = true
        this.warning = `<p>Are you sure you want to delete <strong>${payload.title}</strong>?</p>`
        this.hideForm(true)
      },

      applyDelete (payload) {
        this.submitted = true

        deleteVideo(payload, this.store.getToken())
          .then(res => {
            this.store.markCollectionsDirty(true)
            this.fetchData(this.store.state.isNaughtyMode)
            this.success = 'Video successfully deleted!'
            this.hideForm(false)
          })
          .catch(err => {
            this.parseError(err)
          })

        this.resetValidation()
      },

      cancelDelete () {
        this.warning = null
        this.isDeleting = false
        this.showForm()
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
