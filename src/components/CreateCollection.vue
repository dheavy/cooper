<template>
  <section class="create-collection">
    <form class="col-sm-6 col-sm-offset-3">
      <div class="form-group row">
        <button type="button" class="close" aria-label="Close">
          <span aria-hidden="true" v-on:click.prevent="exit">&times;</span>
        </button>
        <h4 class="col-sm-12">Create a new collection</h4>
      </div>
      <div class="form-group row">
        <label for="name" class="col-sm-4 form-control-label">Name</label>
        <div class="col-sm-12 col-md-6">
          <input type="text" name="name" class="form-control" placeholder="Name">
        </div>
      </div>
      <div class="form-group row">
        <label for="name" class="col-sm-4 form-control-label">Make private</label>
        <div class="col-sm-12 col-md-6">
          <toggle-switch></toggle-switch>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-sm-6 col-sm-offset-4">
          <button class="btn btn-primary col-sm-12 col-md-12" v-on:click="create">Create</button>
        </div>
      </div>
    </form>
  </section>
</template>

<script>
import toggleSwitch from './ToggleSwitch'
import {router} from '../main'

export default {
  name: 'CreateCollection',

  components: [toggleSwitch],

  methods: {
    create () {

    },

    exit () {
      router.go(window.history.back())
    }
  }
}
</script>


