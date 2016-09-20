<template>
  <div name="player-modal" class="modal player-modal {{store.player.isTVMode ? 'fullscreen' : ''}}" rel="close"  @click.stop="hideModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <button type="button" class="close" @click.stop="exitPlayer">
            <span rel="close">&times;</span>
          </button>
          <player
            :tv-mode="store.player.isTVMode"
            :exit="exitPlayer"
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
      return {store}
    },

    methods: {
      hideModal (e) {
        if (e.target.getAttribute('rel')) {
          this.exitPlayer()
        }
      },

      exitPlayer: exitPlayer
    }
  }
</script>

<style lang="scss" scoped>
  .player-modal.fullscreen {
    .player-iframe {
      height: 100vh;
    }

    .modal-content {
      width: 100vw;
      height: 100vh;
      top: 0;
      left: 0;
      margin: 0;
    }

    .modal-dialog {
      width: 100vw;
      height: 100vh;
      margin: 0;
      padding: 0;
      top: 0;
      left: 0;
    }

    .modal-body {
      height: 100vh;
      margin: 0;
    }
  }

  .modal {
    display: block;
  }

  .modal-content {
    top: 0;
    margin-top: 0;
    border-radius: 10px;
    height: 550px;
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
