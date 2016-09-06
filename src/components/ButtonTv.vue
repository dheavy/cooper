<template>
  <button class="tv-btn" @click="toggleHandler(video)">TV</button>
</template>

<script>
  export default {
    name: 'ButtonTv',

    props: ['toggle-handler', 'video']
  }
</script>

<style lang="scss" scoped>
  .tv-btn {
    position: relative;
    width: 30px;
    height: 30px;
    border-radius: 30px;
    left: 100%;
    top: 48px;
    margin-left: -34px;
    background-color: transparent;
    border-color: white;
    color: white;
    font-size: 9px;
  }
</style>
