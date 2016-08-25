<template>
  <modal-player></modal-player>
  <navigation></navigation>
  <div id="app" class="container">
    <router-view></router-view>
  </div>
</template>

<script>
  import ModalPlayer from './ModalPlayer'
  import Navigation from './Navigation'

  export default {
    name: 'App',

    components: {Navigation, ModalPlayer}
  }
</script>

<style lang="scss">
  @import '../../node_modules/bootstrap/scss/bootstrap.scss';

  body {
    margin-top: 70px;
  }
</style>
