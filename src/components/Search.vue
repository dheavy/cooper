<template>
  <div class="overlay" v-show="store.search.isOpened">
    <header class="header">
      <input type="text" name="search" class="search" placeholder="Search" v-el:input>
    </header>
    <main class="results">
    </main>
  </div>
</template>

<script>
  import store from '../store'

  export default {
    name: 'Search',

    data () {
      return {store}
    },

    watch: {
      'store.search.isOpened': {
        handler (isOpened) {
          isOpened ? this.registerCloseListener() : this.unregisterCloseListener()
        }
      }
    },

    methods: {
      registerCloseListener (e) {
        window.addEventListener('keyup', this.keyupHandler)
      },

      unregisterCloseListener () {
        window.removeEventListener('keyup', this.keyupHandler)
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
    margin-top: -20px;
    z-index: 20;
    color: white;
  }

  header {
    position: relative;
    top: 20px;
    padding: 0 1em;
    width: 100%;
    height: auto;
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
</style>
