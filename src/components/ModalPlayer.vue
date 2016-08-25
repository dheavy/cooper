<template>
  <div rel="close" class="modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" @click.stop="close">
            <span rel="close">&times;</span>
          </button>

          <div class="modal-body">
            hello
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ModalPlayer',

    methods: {
      close () {

      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
