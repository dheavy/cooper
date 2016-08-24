<template>
  <div name="close" class="modal" @click.stop="hideModal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">

        <validator name="addVideoValidation">
          <form novalidate>
            <div class="modal-header">
              <button type="button" class="close" @click.stop="hideModal">
                <span name="close" aria-hidden="true">&times;</span>
              </button>
              <div class="alert alert-success" v-if="success">{{success}}</div>
              <div class="alert alert-danger" v-if="error">{{error}}</div>
              <div class="alert alert-warning" v-if="warning" name="close">{{{warning}}}</div>
              <div class="alert alert-danger" v-if="submitted && !showNewCollectionForm && $addVideoValidation.cid.validExistingCollection">Please choose a collection.</div>
              <div class="alert alert-danger" v-if="submitted && showNewCollectionForm && $addVideoValidation.ncid.validNewCollection">Please choose a collection name.</div>
              <h4 v-if="!error && !warning && !success" class="col-sm-12">Add this video</h4>
            </div>

            <div class="modal-body" v-show="isFormVisible">
              <input type="hidden" class="form-control" v-model="payload.hash">
              <div class="form-group row">
                <div class="col-sm-12 col-md-12">
                  <label for="title" class="col-sm-4 form-control-label">Title</label>
                  <input type="text" class="form-control" name="title" placeholder="Title" v-model="payload.title">
                </div>
              </div>
              <div class="form-group row">
                <div class="col-sm-12 col-md-12">
                  <label for="collection" class="col-sm-4 form-control-label">Collection</label>
                  <select
                    v-model="payload.collection_id"
                    v-validate:cid="{validExistingCollection: true}"
                    class="c-select col-sm-12 col-md-12"
                    name="collection"
                  >
                    <optgroup>
                      <option selected value="-1">Choose a collection</option>
                    </optgroup>
                    <optgroup>
                      <option v-if="collections" v-for="collection in collections" value="{{collection.id}}">{{collection.name}}</option>
                    </optgroup>
                    <optgroup>
                      <option >{{createNewLabel}}</option>
                    </optgroup>
                  </select>
                </div>
              </div>
              <div class="form-group row">
                <div class="col-sm-12 col-md-12">
                  <input
                    type="text"
                    class="form-control"
                    v-model="payload.new_collection_name"
                    v-show="showNewCollectionForm"
                    placeholder="My new collection name"
                    v-validate:ncid="{validNewCollection: true}"
                  >
                </div>
              </div>
            </div>

            <div class="modal-footer" v-show="!success">
              <button name="close" type="button" class="btn btn-secondary" @click.stop="hideModal">Close</button>
              <button type="button" class="btn btn-primary" @click.prevent="addVideo(payload, $addVideoValidation)">Save changes</button>
            </div>
          </form>
        </validator>

      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ModalAddVideo',

    props: [
      'hideModal', 'success', 'error', 'warning', 'isFormVisible',
      'payload', 'collections', 'showNewCollectionForm', 'createNewLabel',
      'addVideo'
    ]
  }
</script>

<style lang="scss" scoped>
  .modal {
    background: rgba(0, 0, 0, 0.75);
  }

  .modal-dialog {
    height: 100vh;
  }

  .modal-body {
    min-height: 200px;
    height: auto;
  }

  .modal-content {
    top: 100vh;
    margin-top: calc(-50vh - 200px);
  }
</style>
