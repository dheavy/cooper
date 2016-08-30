<template>
  <div name="player-modal" rel="close" class="modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <button type="button" class="close" @click.stop="close">
            <span rel="close">&times;</span>
          </button>
          <player
            v-if="video"
            :video="video"
            :playlist="playlist"
          ></player>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {exitPlayer} from '../services/mediae'
  import Player from './Player'
  import store from '../store'

  export default {
    name: 'ModalPlayer',

    components: {Player},

    data () {
      return {
        'playlist': store.player.playlist,
        'video': store.player.video
      }
    },

    methods: {
      close () {
        exitPlayer()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .modal {
    display: block;
  }

  .modal-content {
    top: 0;
    margin-top: 0;
    border-radius: 10px;
    height: 510px;
  }

  .modal-body {
    padding: 0;
    height: auto;
  }

  .modal-dialog {
    width: 860px;
  }

  button.close {
    margin-right: -2rem;
    opacity: 1;
    text-shadow: none;
    color: white;
  }
</style>
