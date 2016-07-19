<template>
  <div class="media" v-bind:style="styles" class="clearfix">
    <div class="poster"></div>
    <div class="data {{scale}}">
      <div class="title">{{video.title}}</div>
      <div class="duration">{{video.duration}}</div>
    </div>
  </div>
</template>

<script>
import {
  MEDIA_NORMAL_WIDTH,
  MEDIA_NORMAL_HEIGHT,
  MEDIA_LARGE_WIDTH,
  MEDIA_LARGE_HEIGHT,
  MEDIA_SCALE_NORMAL
} from '../constants/config'

export default {
  name: 'Media',

  props: ['video', 'playlist', 'scale'],

  data () {
    return {
      width: null,
      height: null,
      styles: {
        backgroundSize: 'cover',
        backgroundColor: '#CCC',
        backgroundImage: null,
        width: null,
        height: null
      }
    }
  },

  ready () {
    this.width = this.scale === MEDIA_SCALE_NORMAL ? MEDIA_NORMAL_WIDTH : MEDIA_LARGE_WIDTH
    this.height = this.scale === MEDIA_SCALE_NORMAL ? MEDIA_NORMAL_HEIGHT : MEDIA_LARGE_HEIGHT
    this.styles.width = this.width + 'px'
    this.styles.height = this.height + 'px'
    this.styles.backgroundImage = `url(${this.video.poster})`
  }
}
</script>

<style lang="scss" scoped>
.media {
  font-size: 11px;
  color: white;

  .data {
    background-color: rgba(0, 0, 0, 0.5);
    display: block;
    position: relative;
    width: 100%;
    height: 45px;
    top: 100%;
    margin-top: -45px;

    .title {
      width: 80%;
      height: auto;
      padding: 5px;
      float: left;
    }

    .duration {
      width: 20%;
      height: auto;
      float: left;
      padding: 5px;
      margin-top: 17px;
      text-align: right;
    }

    &.large {
      height: 25px;
      margin-top: -25px;

      .title {
        width: 90%;
      }

      .duration {
        margin-top: 0;
        width: 10%;
      }
    }
  }
}
</style>
