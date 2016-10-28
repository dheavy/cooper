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
      <button-follow :store="store" :collection="collection"></button-follow>
      <button-block :store="store" :collection="collection"></button-block>
    </div>

    <div class="name">
      <span class="display {{isEditMode ? 'hidden-xs-up' : ''}}">{{collection.name}}</span>
      <span class="edit {{isEditMode ? '' : 'hidden-xs-up'}}">
        <input type="text" value="{{collection.name}}" v-on:keyup.enter="editName">
      </span>
    </div>

    <article class="rack" v-for="n in 10 | orderBy 'created_at' -1">
      <div class="{{$index === 0 ? 'cover' : 'thumb thumb-' + $index}} {{matchViewMode(collection, $index) ? '' : 'empty'}}">
        <div v-if="collection.videos.length === 0 && $index === 0" class="nothing">
          <div class="message">There's nothing here.<br> Yet.</div><br>
          <a v-if="areMyOwn" v-link="{name: 'create-video'}">Add a video</a></p>
        </div>
        <a @click.prevent="openPlayer(collection.videos[$index], collection.videos, matchViewMode(collection, $index))">
          <img
            v-if="matchViewMode(collection, $index)"
            :src="collection.videos[$index].poster"
            width="auto"
            height="100%"
          >
        </a>
      </div>
    </article>
    <article>
      <a v-link="{name: 'feed-collection', params: {cid: collection.id}}" class="thumb thumb-more" rel="more">• • •</a>
    </article>
  </section>
</template>

<script>
  import {
    toggleCollectionVisibility,
    editCollectionName,
    deleteCollection as deleteCollectionService
  } from '../services/api'
  import DeleteCollection from './DeleteCollection'
  import {launchPlayer} from '../services/mediae'
  import ButtonFollow from './ButtonFollow'
  import ButtonBlock from './ButtonBlock'
  import store from '../store'

  export default {
    name: 'CollectionRack',

    props: ['collection', 'areMyOwn', 'otherCollections'],

    components: {
      DeleteCollection, ButtonFollow, ButtonBlock
    },

    data () {
      return {
        store,
        isDeleteMode: false,
        isEditMode: false,
        error: null
      }
    },

    methods: {
      openPlayer (video, playlist, canPlay) {
        if (canPlay) {
          launchPlayer(video, playlist)
        }
      },

      matchViewMode (collection, index) {
        return collection.videos[index] &&
               collection.videos[index].is_naughty === this.store.state.isNaughtyMode
      },

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

        deleteCollectionService(cid, store.getToken())
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
  @import '../assets/scss/app.scss';

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

  .nothing {
    margin: 1rem;

    .message {
      @include font-size(15px);
      line-height: 15px;
      font-weight: bold;
    }
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
    margin-bottom: 8px;
    font-weight: bold;
    @include font-size(18px);
  }

  .rack {
    float: left;
  }

  .collection {
    width: 100%;
    height: 230px;
    margin-bottom: 10px;
    overflow: hidden;

    &:after {
      border-bottom: 1px solid #CCCCCC;
    }
  }

  .cover {
    overflow: hidden;
    width: 300px;
    margin-left: 10px;
    height: 180px;
    float: left;
    background-color: black;
    @include border-radius(4px);
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
    @include border-radius(4px);
  }

  a.thumb-more {
    background-color: transparent;
    font-weight: bold;
    text-align: center;
    color: $color-mp-blue;
    @include font-size(42px);
    border: 1px solid $color-light-lavender;
    line-height: 80px;

    &:hover {
      text-decoration: none;
    }
  }

  .empty {
    background-color: transparent;
    border: 1px solid $color-light-lavender;
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
