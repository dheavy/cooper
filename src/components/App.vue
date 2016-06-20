<template>
  <div id="app" class="container">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
@import '../../node_modules/bootstrap/scss/bootstrap.scss';

body {
  margin-top: 70px;
}
</style>
