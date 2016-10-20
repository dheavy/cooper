<template>
  <modal-player
    v-show="store.player.isVisible"
  ></modal-player>

  <navigation></navigation>

  <search></search>

  <div id="app" class="container">
    <router-view></router-view>
  </div>
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
</style>
