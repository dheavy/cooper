<template>
  <div class="overlay" v-show="store.search.isOpened">
    <div class="container">
      <header class="header container">
        <button type="button" class="close" @click.stop="closeSearchPanel">
          <span rel="close" aria-hidden="true">&times;</span>
        </button>
        <input type="text" name="search" class="search col-xs-12" placeholder="Search" v-el:input>
      </header>
      <main class="results container">
        <div class="alert alert-danger" v-if="error">{{error}}</div>
        <h6 v-show="message" class="col-xs-12">{{message}}</h6>

        <div v-show="searchResults">
          <media
            v-else
            v-for="video in searchResults | orderBy 'id' -1"
            v-show="video.is_naughty === store.state.isNaughtyMode"
            class="media-item {{video.scale}}"
            :video="video"
            :playlist="searchResults"
            :scale="normal"
            :feed-type="search"
          ></media>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
  import {search} from '../services/api'
  import {parseError} from '../mixins'
  import store from '../store'
  import Media from './media'

  export default {
    name: 'Search',

    mixins: [parseError],

    components: {Media},

    data () {
      return {
        store,
        error: null,
        message: null,
        loading: false,
        searchResults: null
      }
    },

    watch: {
      'store.search.isOpened': {
        handler (isOpened) {
          isOpened ? this.isOpenedHandler() : this.isClosedHandler()
        }
      }
    },

    methods: {
      isOpenedHandler (e) {
        window.addEventListener('keyup', this.keyupHandler)
        document.body.style.overflow = 'hidden'
      },

      isClosedHandler () {
        window.removeEventListener('keyup', this.keyupHandler)
        document.body.style.overflow = 'auto'
      },

      keyupHandler (e) {
        // 'Esc' => 27, 'Return' => 13
        if (e.keyCode === 27) {
          this.closeSearchPanel()
        }

        if (e.keyCode === 13) {
          this.triggerSearch(this.$els.input.value)
        }
      },

      closeSearchPanel () {
        this.$els.input.value = ''
        this.store.search.isOpened = false
      },

      triggerSearch (val) {
        this.loading = true
        this.message = null
        this.searchResults = null
        search({query: val.toLowerCase()}, this.store.getToken())
          .then(res => {
            this.loading = false
            this.message = res.message
            this.searchResults = res.payload
            console.log(this.searchResults)
          })
          .catch(err => {
            this.loading = false
            console.log(err)
            this.parseError(err)
          })
      }
    }
  }
</script>

<style type="scss" scoped>
  .overlay {
    background: rgba(0, 0, 0, 0.8);
    width: 100vw;
    height: 100vh;
    position: fixed;
    margin-top: -70px;
    z-index: 1040;
    color: white;
    overflow: auto;
  }

  header {
    position: relative;
    top: 50px;
    padding: 0 1em;
    width: 100%;
    height: auto;
  }

  .close {
    color: white;
    text-shadow: none;
    opacity: 1;
  }

  .search {
    width: 100%;
    background: transparent;
    border-top: 0;
    border-left: 0;
    border-right: 0;
    height: 70px;
    font-size: 3rem;
    outline: 0;
  }

  .results {
    width: 100%;
    min-height: 300px;
    height: auto;
    margin-top: 70px;
  }

  h6 {
    margin-bottom: 2em;
  }

  .thumb {
    text-align: center;
    width: 100%;
    height: 200px;
    margin-right: 10%;
    margin-bottom: 1em;
    top: 0;
    left: 0;
    position: relative;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    background-color: #000;
  }
</style>
