<template>
  <div name="player-modal" rel="close" class="modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <button type="button" class="close" @click.stop="exitPlayer">
            <span rel="close">&times;</span>
          </button>
          <player></player>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {exitPlayer} from '../services/mediae'
  import Player from './Player'

  export default {
    name: 'ModalPlayer',

    components: {Player},

    methods: {
      exitPlayer: exitPlayer
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
