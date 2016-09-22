<template>
  <div class="overlay" v-show="store.search.isOpened">
    <header class="header">
      <input type="text" name="search" class="search" placeholder="Search">
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
    }
  }
</script>

<style type="scss" scoped>
  .overlay {
    background: rgba(255, 255, 255, 0.5);
    width: 100vw;
    height: 100vh;
    margin-top: -20px;
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
