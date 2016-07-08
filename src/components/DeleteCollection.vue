<template>
  <h5 class="col-sm-8">Are you sure you want to delete collection "{{collectionToDelete.name}}"?</h5>
  <div class="col-sm-10" v-if="!hasStartedDeletion">
    <button class="btn btn-danger col-xs-10 col-sm-6 col-md-5 col-lg-4" v-on:click="startDeletion">Yes, delete this collection</button>
    <button class="btn btn-secondary col-xs-10 col-sm-6 col-md-5 col-lg-4 cancel" v-on:click="onCancel">No, take me back</button>
  </div>
  <div class="col-sm-10" v-if="hasStartedDeletion">
    <p>What do you want to do with videos in this collections?</p>
    <select class="c-select col-xs-8">
      <option selected>Please choose...</option>
      <option value="-1">Delete all videos as well</option>
      <option v-for="collection in otherCollections" value="{{collection.id}}">Move to collection "{{collection.name}}"</option>
    </select>
  </div>
  <div class="col-sm-10" style="margin-top: 10px" v-if="hasStartedDeletion">
    <button class="btn btn-danger col-xs-10 col-sm-6 col-md-5 col-lg-4" v-on:click="finalizeDeletion">Proceed with deletion</button>
    <button class="btn btn-secondary col-xs-10 col-sm-6 col-md-5 col-lg-4 cancel" v-on:click="onCancel">I've changed my mind</button>
  </div>
</template>

<script>
export default {
  name: 'DeleteCollection',

  props: ['collectionToDelete', 'otherCollections', 'onCancel', 'onFinalize'],

  data () {
    return {
      hasStartedDeletion: false
    }
  },

  methods: {
    startDeletion () {
      this.hasStartedDeletion = true
    },

    finalizeDeletion () {

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
