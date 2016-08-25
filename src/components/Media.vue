<template>
  <div class="media-item" :style="styles" class="clearfix">
    <div class="poster"></div>
    <div class="data {{scale}}">
      <div class="title">{{video.title | ellipsis '80'}}</div>
      <div class="duration">{{video.duration}}</div>
    </div>
    <div class="ui">
    <button v-if="feedType === 'feed-collection'" class="add-btn" @click="editHandler(video)">&#x270F;</button>
      <button v-else class="add-btn" @click="addHandler(video)">&hearts;</button>
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

  props: [
    'video', 'playlist', 'scale', 'feedType', 'addHandler', 'editHandler'
  ],

  data () {
    return {
      width: null,
      height: null,
      styles: {
        backgroundSize: 'cover',
        backgroundColor: '#CCC',
        backgroundImage: null
      }
    }
  },

  ready () {
    this.width = this.scale === MEDIA_SCALE_NORMAL ? MEDIA_NORMAL_WIDTH : MEDIA_LARGE_WIDTH
    this.height = this.scale === MEDIA_SCALE_NORMAL ? MEDIA_NORMAL_HEIGHT : MEDIA_LARGE_HEIGHT
    this.styles.backgroundImage = `url(${this.video.poster})`
  }
}
</script>

<style lang="scss" scoped>
.media-item {
  font-size: 12px;
  color: white;
  float: left;
  margin: 0;
  padding: 0;
  margin-bottom: 10px;

  &.normal {
    width: 270px;
    height: 204px;
  }

  &.large {
    width: 551px;
    height: 418px;
  }

  @media screen and (max-width: 767px) {
    &.large {
      width: 270px;
      height: 204px;
    }
  }

  .ui {
    position: absolute;
    width: 100%;
    height: 100%;
    // background: red;

    .add-btn {
      position: relative;
      width: 30px;
      height: 30px;
      border-radius: 30px;
      left: 100%;
      top: 10px;
      margin-left: -40px;
      background-color: transparent;
      border-color: white;
      color: white;
    }
  }

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
