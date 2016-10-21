<template>
  <div class="site-wrapper">
    <div class="site-wrapper-inner">
      <div class="cover-container">
        <logo></logo>
        <login></login>
      </div>
    </div>
  </div>
</template>

<script>
  import Login from './Login'
  import Logo from './Logo'

  export default {
    name: 'Home',

    components: {Login, Logo}
  }
</script>

<style lang="scss" scoped>
  .logo {
    margin-bottom: 1rem;
  }

  .site-wrapper {
    margin-top: -70px;
    display: table;
    width: 100%;
    height: 100%;
    min-height: 100%;
    text-align: center;
  }

  .site-wrapper-inner {
    display: table-cell;
    vertical-align: middle;
    height: auto;
  }

  .cover-container {
    margin-right: auto;
    margin-left: auto;
    position: relative;
    height: auto;
  }

</style>
