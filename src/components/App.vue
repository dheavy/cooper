<template>
  <navigation></navigation>
  <modal-player></modal-player>
  <search></search>
  <section id="app" class="container app-component">
    <router-view></router-view>
  </section>
</template>

<script>
  import ModalPlayer from './ModalPlayer'
  import Navigation from './Navigation'
  import Search from './Search'
  import store from '../store'

  export default {
    name: 'App',

    components: {Navigation, ModalPlayer, Search},

    data () {
      return {store}
    }
  }
</script>

<style lang="scss">
  @import '../assets/scss/app.scss';

  .app-component {
    height: 100%;
    position: relative;
  }
</style>
