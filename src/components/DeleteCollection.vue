<template>
  <h5 class="col-sm-8">Are you sure you want to delete collection "{{collectionToDelete.name}}"?</h5>
  <p class="col-sm-10">
    <button class="btn btn-danger col-xs-10 col-sm-6 col-md-5 col-lg-4">Yes, delete this collection</button>
    <button class="btn btn-secondary col-xs-10 col-sm-6 col-md-5 col-lg-4 cancel" v-on:click="onCancel">No, take me back</button>
  </p>
</template>

<script>
export default {
  name: 'DeleteCollection',

  props: ['collectionToDelete', 'otherCollections', 'onCancel', 'onFinalize']
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
