<template>
  <h5 class="col-sm-8">Are you sure you want to delete collection "{{collectionToDelete.name}}"?</h5>
  <div class="col-sm-10" v-if="!hasStartedDeletion">
    <button class="btn btn-danger col-xs-10 col-sm-6 col-md-5 col-lg-4" @click="startDeletion">Yes, delete this collection</button>
    <button class="btn btn-secondary col-xs-10 col-sm-6 col-md-5 col-lg-4 cancel" @click="onCancel">No, take me back</button>
  </div>
  <div class="col-sm-10" v-if="hasStartedDeletion && collectionToDelete.videos.length > 0">
    <p>What do you want to do with videos in this collections?</p>
    <select v-el:videos-decision v-on:change="maybeDisable()" class="c-select col-xs-8">
      <option selected>Please choose...</option>
      <option value="-1">Delete all videos as well</option>
      <option v-for="collection in otherCollections" value="{{collection.id}}">Move to collection "{{collection.name}}"</option>
    </select>
  </div>
  <div v-else class="col-sm-10">

  </div>
  <div class="col-sm-10" style="margin-top: 10px" v-if="hasStartedDeletion">
    <button
      class="btn btn-danger col-xs-10 col-sm-6 col-md-5 col-lg-4 {{enableFinalizeBtn ? '' : 'disabled'}}"
      @click="finalizeDeletion"
      :disabled="enableFinalizeBtn ? false : true"
    >
      Proceed with deletion
    </button>
    <button class="btn btn-secondary col-xs-10 col-sm-6 col-md-5 col-lg-4 cancel" @click="onCancel">I've changed my mind</button>
  </div>
</template>

<script>
  import {requestBody} from '../services/utils'

  export default {
    name: 'DeleteCollection',

    props: ['collectionToDelete', 'otherCollections', 'onCancel', 'onFinalize'],

    data () {
      return {
        hasStartedDeletion: false,
        enableFinalizeBtn: false
      }
    },

    methods: {
      maybeDisable () {
        this.enableFinalizeBtn = +this.$els.videosDecision.value >= -1
      },

      startDeletion () {
        if (this.collectionToDelete.videos.length === 0) {
          return this.finalizeDeletion()
        }
        this.hasStartedDeletion = true
      },

      finalizeDeletion () {
        const body = (this.$els.videosDecision && +this.$els.videosDecision.value > 0)
                     ? requestBody({replacement: +this.$els.videosDecision.value})
                     : null

        this.onFinalize(this.collectionToDelete.id, this, body)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .cancel {
    margin-left: 10px;
  }

  @media screen and (max-width: 800px) {
    .cancel {
      margin-left: 0px;
      margin-top: 0px;
    }
  }

  @media screen and (max-width: 570px) {
    .cancel {
      margin-left: 0px;
      margin-top: 10px;
    }
  }
</style>
