<template>
  <button
    class="btn btn-primary"
    @click.prevent="createNewCollection"
    v-if="canCreateCollection"
  >
    <span class="plus">+</span>
    <span class="label">Create a new collection</span>
  </button>
</template>

<script>
  import {router} from '../main'

  export default {
    name: 'ButtonCreateNewCollection',

    props: ['canCreateCollection'],

    methods: {
      createNewCollection () {
        router.go({name: 'create-collection'})
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../assets/scss/app.scss';

  .plus {
    @include font-size(24px);
    line-height: 0;
    font-weight: bold;
  }
</style>
