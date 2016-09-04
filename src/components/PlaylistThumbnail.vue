<template>
  <div
    class="thumb-container"
    @click="clickHandler"
  >
    <div
      class="thumb"
      :style="{'background-image': 'url(' + media.poster + ')'}"
    ></div>
    <div :class="thumbFrameCssClass(isActive)"></div>
  </div>
</template>

<script>
  export default {
    name: 'PlaylistThumbnail',

    props: ['media', 'onClick', 'isActive'],

    methods: {
      clickHandler () {
        this.onClick(this.media)
      },

      thumbFrameCssClass (isActive) {
        return `thumb-frame ${isActive ? ' is-active' : ''}`
      }
    }
  }
</script>

<style lang="scss" scoped>
  .thumb-container {
    float: left;
    margin-right: 0.3rem;
    position: relative;
    width: 60px;
    height: 60px;
    cursor: pointer;
    cursor: hand;
  }

  .thumb-frame {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: border 1s;

    &.is-active {
      border: 7px solid #CCC;
    }
  }

  .thumb {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: absolute;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    background-color: #000;
  }
</style>
