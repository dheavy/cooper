<template>
  <navigation :auth="store.state.authenticated"></navigation>
  <div id="app" class="container">
    <router-view></router-view>
  </div>
</template>

<script>
import Navigation from './Navigation'
import store from '../store'

export default {
  name: 'App',

  components: {Navigation},

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
