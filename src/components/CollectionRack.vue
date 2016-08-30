<template>
  <div v-if="error" class="alert alert-danger">{{error}}</div>

  <section class="collection clearfix" v-el:rack>

    <section v-if="isDeleteMode" class="delete-collection">
      <delete-collection
        :collection-to-delete="collection"
        :other-collections="otherCollections"
        :on-cancel="cancelDeletion"
        :on-finalize="finalizeDeletion"
      ></delete-collection>
    </section>

    <div class="tools" v-if="areMyOwn">
      <button @click="toggleVisibility">{{collection.is_private ? 'x' : 'o'}}</button>
      <button @click="toggleEditMode">*</button>
      <button @click="setDeletion">!</button>
    </div>
    <div class="tools" v-else>
      <follow-button :store="store" :collection="collection"></follow-button>
      <block-button :store="store" :collection="collection"></block-button>
    </div>

    <div class="name">
      <span class="display {{isEditMode ? 'hidden-xs-up' : ''}}">{{collection.name}}</span>
      <span class="edit {{isEditMode ? '' : 'hidden-xs-up'}}">
        <input type="text" value="{{collection.name}}" v-on:keyup.enter="editName">
      </span>
    </div>

    <article class="rack" v-for="n in 10 | orderBy 'created_at' -1">
      <div class="{{$index === 0 ? 'cover' : 'thumb thumb-' + $index}} {{collection.videos[$index] && collection.videos[$index].is_naughty === store.state.isNaughtyMode ? '' : 'empty'}}">
        <div v-if="collection.videos.length === 0 && $index === 0" class="nothing">
          <p>There's nothing here... yet.<br>
          <a v-if="areMyOwn" v-link="{name: 'create-video'}" href="#">Add a video</a></p>
        </div>
        <a @click.prevent="launchPlayer(collection.videos[$index], collection.videos)" href="#">
          <img
            v-if="collection.videos[$index] && collection.videos[$index].is_naughty === store.state.isNaughtyMode"
            :src="collection.videos[$index].poster"
            width="auto"
            height="100%"
          >
        </a>
      </div>
    </article>
    <article>
      <a v-link="{name: 'feed-collection', params: {cid: collection.id}}" class="thumb thumb-more">more...</a>
    </article>
  </section>
</template>

<script>
  import {
    toggleCollectionVisibility,
    editCollectionName,
    deleteCollection as deleteCollectionCommand} from '../services/api'
  import DeleteCollection from './DeleteCollection'
  import {launchPlayer} from '../services/mediae'
  import FollowButton from './FollowButton'
  import BlockButton from './BlockButton'
  import store from '../store'

  export default {
    name: 'CollectionRack',

    props: ['collection', 'areMyOwn', 'otherCollections'],

    components: {
      DeleteCollection, FollowButton, BlockButton
    },

    data () {
      return {
        store,
        launchPlayer: launchPlayer,
        isDeleteMode: false,
        isEditMode: false,
        error: null
      }
    },

    methods: {
      toggleVisibility () {
        const currentVisibility = this.collection.is_private

        toggleCollectionVisibility(this.collection.id, !currentVisibility, store.getToken())
          .then(res => {
            this.collection.is_private = res.is_private
          })
          .catch(err => {
            console.log(err)
          })
      },

      toggleEditMode () {
        this.isEditMode = !this.isEditMode
      },

      editName (e) {
        if (this.isEditMode) {
          const name = e.srcElement.value.trim() !== '' ? e.srcElement.value.trim() : 'Untitled'
          this.collection.name = name
          this.isEditMode = false

          editCollectionName(this.collection.id, name, store.getToken())
            .then(res => {
              console.log(res)
            })
            .catch(err => {
              console.log(err)
            })
        }
      },

      setDeletion () {
        this.isDeleteMode = true
      },

      cancelDeletion () {
        this.isDeleteMode = false
      },

      finalizeDeletion (cid, vm, reqBody) {
        this.error = null

        deleteCollectionCommand(cid, store.getToken())
          .then(res => {
            vm.$destroy(true)
            this.$els.rack.remove()
            this.store.markCollectionsDirty(true)
          })
          .catch(err => {
            console.log(err)
            this.error = 'Oops... there was an error. Please try again.'
          })
      }
    }
  }
</script>

<style lang="scss" scoped>
  a {
    position: relative;
    width: 100%;
    height: 100%;
    display: block;
  }

  .delete-collection {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 2;
    margin-top: 20px;
    margin-left: 40px;
  }

  .tools {
    float: left;
    margin-top: 35px;

    button {
      width: 50px;
      height: 50px;
      display: block;
      margin-bottom: 10px;
    }
  }

  .name {
    position: relative;
    display: block;
    margin-left: 60px;
    margin-bottom: 10px;
  }

  .rack {
    float: left;
  }

  .collection {
    width: 100%;
    height: 230px;
    margin-bottom: 10px;
    border-bottom: 1px solid #CCCCCC;
    overflow: hidden;
  }

  .cover {
    overflow: hidden;
    width: 300px;
    margin-left: 10px;
    height: 180px;
    float: left;
    background-color: black;
  }

  .thumb {
    overflow: hidden;
    width: 140px;
    height: 85px;
    float: left;
    background-color: black;
    margin-bottom: 10px;
    margin-left: 10px;
    display: none;
  }

  .thumb-more {
    background-color: #CCCCCC;
  }

  .empty {
    background-color: #CCCCCC;
  }

  @media screen and (min-width: 1200px) {
    .thumb-0,
    .thumb-1,
    .thumb-2,
    .thumb-3,
    .thumb-4,
    .thumb-5,
    .thumb-6,
    .thumb-7,
    .thumb-8,
    .thumb-9,
    .thumb-more {
      display: block;
    }
  }

  @media screen and (max-width: 1200px) {
    .cover {
      width: 280px;
    }

    .thumb {
      width: 132px;
    }

    .thumb-0,
    .thumb-1,
    .thumb-2,
    .thumb-3,
    .thumb-4,
    .thumb-5,
    .thumb-6,
    .thumb-7,
    .thumb-more {
      display: block;
    }
  }

  @media screen and (max-width: 990px) {
    .cover {
      width: 204px;
    }

    .thumb-0,
    .thumb-1,
    .thumb-2,
    .thumb-3,
    .thumb-4,
    .thumb-5,
    .thumb-more {
      display: block;
    }

    .thumb-6,
    .thumb-7,
    .thumb-8,
    .thumb-9 {
      display: none;
    }
  }

  @media screen and (max-width: 770px) {
    .thumb {
      width: 131px;
    }

    .thumb-0,
    .thumb-1,
    .thumb-2,
    .thumb-3,
    .thumb-more {
      display: block;
    }

    .thumb-4,
    .thumb-5,
    .thumb-6,
    .thumb-7,
    .thumb-8,
    .thumb-9 {
      display: none;
    }
  }

  @media screen and (max-width: 575px) {
    .thumb {
      width: 130px;
    }
  }

  @media screen and (max-width: 574px) {
    .cover {
      width: 100%;

      img {
        width: 100%;
        height: auto;
      }
    }

    .rack {
      width: calc(100% - 60px);
    }

    .thumb-1,
    .thumb-2,
    .thumb-3,
    .thumb-4,
    .thumb-5,
    .thumb-6,
    .thumb-7,
    .thumb-8,
    .thumb-9 {
      display: none;
    }

    .thumb-more {
      margin-top: -85px;
      width: 90px;
      height: 75px;
      position: relative;
      margin-left: calc(100% - 100px);
    }
  }
</style>
