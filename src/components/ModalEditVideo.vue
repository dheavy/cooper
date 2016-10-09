<template>
  <div rel="close" class="modal" @click.stop="hideModal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">

        <validator name="editVideoValidation">
          <form novalidate>
            <div class="modal-header">
              <button type="button" class="close" @click.stop="hideModal">
                <span rel="close" aria-hidden="true">&times;</span>
              </button>
              <div class="alert alert-success" v-if="success">{{success}}</div>
              <div class="alert alert-danger" v-if="error">{{error}}</div>
              <div class="alert alert-warning" v-if="warning">{{{warning}}}</div>
              <div class="alert alert-danger" v-if="submitted && !showNewCollectionForm && $editVideoValidation.cid.validExistingCollection">Please choose a collection.</div>
              <div class="alert alert-danger" v-if="submitted && showNewCollectionForm && $editVideoValidation.ncid.validNewCollection">Please choose a collection name.</div>
              <h4 v-if="!error && !warning && !success" class="col-sm-12">Edit this video</h4>
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
                      <option v-for="collection in collections" value="{{collection.id}}">{{collection.name}}</option>
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
              <span v-show="!isDeleting">
                <button name="delete" type="button" class="btn btn-danger" @click.stop="confirmDelete(payload)">Delete video</button>
                <button name="edit" type="button" class="btn btn-primary" @click.prevent="editVideo(payload, $editVideoValidation)">Save changes</button>
              </span>

              <span v-show="isDeleting" v-show="!success">
                <button name="cancel" type="button" class="btn btn-secondary" @click.stop="cancelDelete">No, go back</button>
                <button name="confirm" type="button" class="btn btn-danger" @click.stop="applyDelete(payload)">Yes, delete video</button>
              </span>
            </div>
          </form>
        </validator>

      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ModalEditVideo',

    props: [
      'hideModal', 'success', 'error', 'warning', 'isFormVisible',
      'payload', 'collections', 'showNewCollectionForm', 'createNewLabel',
      'editVideo', 'cancelDelete', 'applyDelete'
    ]
  }
</script>

<style>
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
