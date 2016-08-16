<template>
  <section class="create-video">
    <validator name="createVideoValidation">
      <form novalidate class="col-sm-6 col-sm-offset-3">
        <div class="form-group row">
          <button type="button" class="close" aria-label="Close">
            <span aria-hidden="true" v-on:click.prevent="exit">&times;</span>
          </button>
          <h4 class="col-sm-12">Add a video</h4>
        </div>
        <div class="alert alert-success" v-if="success">{{success}} <a href="#" v-on:click.prevent="exit">Back to collections.</a></div>
        <div class="alert alert-danger" v-if="error">{{error}}</div>
        <div class="alert alert-warning" v-if="warning">{{warning}}</div>
        <div class="alert alert-danger" v-if="submitted && !showNewCollectionForm && $createVideoValidation.cid.validExistingCollection">Please choose a collection.</div>
        <div class="alert alert-danger" v-if="submitted && showNewCollectionForm && $createVideoValidation.ncid.validNewCollection">Please choose a collection name.</div>
        <div class="alert alert-danger" v-if="submitted && $createVideoValidation.url.url">Please enter a valid URL.</div>
        <div v-show="!success">
          <div class="form-group row">
            <div class="col-sm-12 col-md-12">
              <input
                type="text"
                v-model="payload.url"
                v-validate:url="{url: true}"
                class="form-control"
                placeholder="Webpage URL (where you found the video)"
              >
            </div>
          </div>
          <div class="form-group row">
            <div class="col-sm-12 col-md-12">
              <select
                v-model="payload.collection_id"
                v-validate:cid="{validExistingCollection: true}"
                class="c-select col-sm-12 col-md-12"
              >
                <optgroup>
                  <option selected>Choose a collection</option>
                </optgroup>
                <optgroup>
                  <option v-if="collections" v-for="collection in collections" value="{{collection.id}}">{{collection.name}}</option>
                </optgroup>
                <optgroup>
                  <option>{{createNewLabel}}</option>
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
          <div class="form-group row">
            <div class="col-sm-6 col-sm-offset-6">
              <button class="btn btn-primary col-sm-12 col-md-12" v-on:click.prevent="create">Create</button>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="form-group row">
            <div class="col-sm-12 text-xs-center">
              or
            </div>
          </div>
          <div class="form-group row">
            <div class="col-sm-12">
              <button class="btn btn-secondary col-sm-12 col-md-12" v-on:click.prevent="resetForm">Add another video</button>
            </div>
          </div>
        </div>
      </form>
    </validator>
  </section>
</template>

<script>
  import {fetchCollections, addVideo} from '../services/api'
  import Validator from 'vue-validator'
  import {parseError} from '../mixins'
  import {router} from '../main'
  import store from '../store'

  export default {
    name: 'CreateCollection',

    components: {Validator},

    mixins: [parseError],

    validators: {
      validExistingCollection (val) {
        return val >= 1
      },

      validNewCollection (val) {
        return val.trim() !== ''
      }
    },

    data () {
      return {
        createNewLabel: '...or create a new one',
        submitted: false,
        success: null,
        error: null,
        warning: null,
        collections: store.getCollections(),
        payload: {
          collection_id: -1,
          url: '',
          new_collection_name: null
        }
      }
    },

    computed: {
      showNewCollectionForm () {
        return this.payload.collection_id === this.createNewLabel
      }
    },

    ready () {
      this.getCollections()
    },

    methods: {
      create () {
        const addUrlSchemeIfNeeded = payload => {
          let url = payload.url
          if (url.indexOf('http') === -1) {
            url = `http://${url}`
            payload = Object.assign({}, payload, {url})
          }
          return payload
        }

        const chooseNameOrId = payload => {
          if (payload.new_collection_name !== null) {
            payload.collection_id = -1
            payload.new_collection_name = payload.new_collection_name.trim() === '' ? 'Untitled' : payload.new_collection_name
          }
          return payload
        }

        this.submitted = true

        if (!this.$createVideoValidation.url.url && (!this.$createVideoValidation.cid.validExistingCollection || !this.$createVideoValidation.ncid.validNewCollection)) {
          this.error = null
          this.payload = chooseNameOrId(addUrlSchemeIfNeeded(this.payload))

          addVideo(this.payload, store.getToken())
            .then(res => {
              console.log(res)
              this.success = 'Video will be added to your collection shortly.'
            })
            .catch(err => {
              console.log(err)
              this.parseError(err)
            })

          this.resetValidation()
        }
      },

      resetValidation () {
        this.submitted = false
        this.resetForm()
        this.$resetValidation()
      },

      exit () {
        router.go(window.history.back())
      },

      resetForm () {
        this.success = null
        this.error = null
        this.warning = null
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
      }
    }
  }
</script>
