<template>
  <fullscreen-video-background></fullscreen-video-background>
  <section class="home-component">
    <div class="wrapper">
      <div class="cover-container">
        <logo size="large"></logo>
        <p>Binge watching made easy</p>
        <hr class="spacer">
        <login></login>
      </div>
    </div>
  </section>
</template>

<script>
  import FullscreenVideoBackground from './FullscreenVideoBackground'
  import Login from './Login'
  import Logo from './Logo'

  export default {
    name: 'Home',

    components: {
      FullscreenVideoBackground,
      Login,
      Logo
    }
  }
</script>

<style lang="scss" scoped>
  .home-component {
    margin-top: -70px;
    display: table;
    width: 100%;
    height: 100%;
    min-height: 100%;
    text-align: center;
  }

  .wrapper {
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

  .spacer {
    visibility: hidden;
    margin-bottom: 1rem;
  }

  p {
    color: #8fa3d2;
  }
</style>
