<template>
  <modal-player
    v-show="store.player.isVisible"
  ></modal-player>
  <navigation></navigation>
  <div id="app" class="container">
    <router-view></router-view>
  </div>
</template>

<script>
  import ModalPlayer from './ModalPlayer'
  import Navigation from './Navigation'
  import store from '../store'

  export default {
    name: 'App',

    components: {Navigation, ModalPlayer},

    data () {
      return {store}
    }
  }
</script>

<style lang="scss">
  @import '../../node_modules/bootstrap/scss/bootstrap.scss';

  body {
    margin-top: 70px;
  }
</style>
