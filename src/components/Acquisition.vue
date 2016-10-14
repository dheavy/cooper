<template>
  <modal-add-video
    v-el:add-modal
    v-ref:add-modal
    v-if="enableAdd"
    :error-msg="store.curation.messages.error"
    :warning-msg="store.curation.messages.warning"
    :success-msg="store.curation.messages.success"
    :on-add-video="addVideo"
    :on-hide-modal="hideModal"
    :is-form-visible="isFormVisible"
    :should-show-new-collection-form="shouldShowNewCollectionForm"
    :label-create-new-collection="labelCreateNewCollection"
    :payload.sync="store.curation.payload"
    :collections="store.getCollections()"
  ></modal-add-video>

  <modal-edit-video
    v-el:edit-modal
    v-ref:edit-modal
    v-if="enableEdit"
    :error-msg="store.curation.messages.error"
    :warning-msg="store.curation.messages.warning"
    :success-msg="store.curation.messages.success"
    :on-add-video="addVideo"
    :on-hide-modal="hideModal"
    :on-edit-video="editVideo"
    :on-cancel-delete="cancelDelete"
    :on-apply-delete="applyDelete"
    :is-form-visible="isFormVisible"
    :should-show-new-collection-form="shouldShowNewCollectionForm"
    :label-create-new-collection="labelCreateNewCollection"
    :payload.sync="store.curation.payload"
    :collections="store.getCollections()"
  ></modal-edit-video>
</template>

<script>
  import store from '../store'
  import ModalAddVideo from './ModalAddVideo'
  import ModalEditVideo from './ModalEditVideo'
  import {
    checkIfUserHasVideo,
    curateVideo,
    editVideo,
    deleteVideo
  } from '../services/api'

  export default {
    name: 'Acquisition',

    components: {ModalAddVideo, ModalEditVideo},

    props: [
      'enableAdd', 'enableEdit', 'addVideoCallback'
    ],

    watch: {
      'store.curation.messages': {
        handler (val) {
          this.successMsg = val.success
          this.warningMsg = val.warning
          this.errorMsg = val.error
        },
        deep: true
      }
    },

    data () {
      return {
        store,
        isDeleting: false,
        isFormVisible: true,
        areFormButtonsVisible: true,
        successMsg: null,
        warningMsg: null,
        errorMsg: null,
        submitted: false,
        collections: store.getCollections()
      }
    },

    ready () {
      this.$on('video:curate', (video) => {
        this.showAddModal(video)
      })
    },

    computed: {
      shouldShowNewCollectionForm () {
        return this.store.curation.payload.collection_id === this.store.curation.labelCreateNewCollection
      }
    },

    methods: {
      showAddModal (video) {
        this.store.curation.payload.title = video.title
        this.store.curation.payload.hash = video.hash
        this.store.curation.payload.id = video.id
        this.store.curation.payload.scale = video.scale
        this.$els.addModal.style.display = 'block'

        checkIfUserHasVideo(this.store.getUser().id, video.hash, this.store.getToken())
          .then(res => {
            if (+res.status === 206) {
              this.store.curation.messages.warning = `Pssst... You have already curated this video <a href="/feed/${res.payload.id}">here</a>.`
            }
          })
          .catch(err => {
            console.log(err)
            this.store.curation.messages.error = 'Oops... there was an error. Please close and try again.'
          })
      },

      showEditModal (video) {
        this.showForm()

        this.store.setCuratedPayload({
          id: video.id,
          title: video.title,
          hash: video.hash,
          scale: video.scale,
          collection_id: video.collection
        })

        this.$els.editModal.style.display = 'block'
      },

      hideModal (e) {
        if (e.target.getAttribute('rel') !== 'close') return

        this.showForm()
        this.store.resetCuratedPayload()

        this.store.curation.messages.warning = null
        this.store.curation.messages.error = null
        this.store.curation.messages.success = null
        this.isDeleting = false

        if (this.$els.addModal) {
          this.$els.addModal.style.display = 'none'
        }

        if (this.$els.editModal) {
          this.$els.editModal.style.display = 'none'
        }
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

        this.store.curation.payload = {
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
        this.store.curation.messages.success = null
        this.store.curation.messages.error = null
        this.store.curation.messages.warning = null
        this.showForm()
      },

      chooseNameOrId (payload) {
        if (this.store.curation.payload.new_collection_name && this.store.curation.payload.new_collection_name.trim() !== '') {
          this.store.curation.payload.collection_id = -1
          this.store.curation.payload.new_collection_name = this.store.curation.payload.new_collection_name.trim()
        }
        return payload
      },

      addVideo (payload, $validator) {
        this.submitted = true

        if (!$validator.cid.validExistingCollection || !$validator.ncid.validNewCollection) {
          this.error = null
          this.store.curation.payload = this.chooseNameOrId(this.store.curation.payload)

          curateVideo(
            this.store.getUser().id,
            this.store.curation.payload.id,
            this.store.curation.payload.hash,
            this.store.curation.payload.original_url,
            this.store.curation.payload.title,
            this.store.curation.payload.scale,
            +this.store.curation.payload.collection_id,
            this.store.curation.payload.new_collection_name,
            this.store.getToken()
          )
            .then(res => {
              this.store.curation.messages.success = 'Video added successfully!'
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
              this.store.curation.messages.success = 'Video successfully edited!'
              this.hideForm()

              if (this.editVideoCallback) {
                this.editVideoCallback()
              }
            })
            .catch(err => {
              this.parseError(err)
            })

          this.resetValidation()
        }
      },

      confirmDelete (payload) {
        this.isDeleting = true
        this.warning = `<p>Are you sure you want to delete <strong>${this.store.curation.payload.title}</strong>?</p>`
        this.hideForm(true)
      },

      applyDelete (payload) {
        this.submitted = true

        deleteVideo(this.store.payload, this.store.getToken())
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
      }
    }
  }
</script>
