<template>
  <div
    class="thumb"
    :style="{'background-image': 'url(' + media.poster + ')'}"
    @click="clickHandler"
  ></div>
</template>

<script>
  export default {
    name: 'PlaylistThumbnail',

    props: ['media', 'onClick'],

    methods: {
      clickHandler () {
        this.onClick(this.media)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .thumb {
    float: left;
    margin-right: 0.3rem;
    position: relative;
    width: 60px;
    height: 60px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    background-color: #000;
    cursor: pointer;
    cursor: hand;
  }
</style>
