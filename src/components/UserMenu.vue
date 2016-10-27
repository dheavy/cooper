<template>
  <li class="usermenu-component nav-item pull-xs-right btn-group {{isOpen ? 'open' : ''}}">
    <button
      class="btn btn-user-menu dropdown-toggle"
      type="button"
      data-toggle="dropdown"
      aria-haspopup="true"
      aria-expanded="{{isOpen}}"
      @click="toggleOpen"
    >
      <img src="http://lorempixel.com/34/34/people/" width="34" height="34">
      {{username}} <span class="separator">|</span>
    </button>
    <div class="dropdown-menu">
      <a class="dropdown-item" v-link="{name: 'feed-public'}">Feed</a>
      <a class="dropdown-item" v-link="{name: 'home'}">My collections</a>
      <a class="dropdown-item" v-link="{name: 'settings'}">Settings</a>
      <a class="dropdown-item" v-link="{name: 'blocked'}">Blocked</a>
      <a class="dropdown-item" v-link="{name: 'logout'}">Log out</a>
    </div>
  </li>
</template>

<script>
  import store from '../store'

  export default {
    name: 'UserMenu',

    data () {
      return {
        store,
        isOpen: false
      }
    },

    methods: {
      toggleOpen () {
        this.isOpen = !this.isOpen
      }
    },

    computed: {
      username () {
        return this.store.getUser().username
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../assets/scss/app.scss';

  .usermenu-component {
    margin-top: 7px;

    img {
      border-radius: 50px;
      border-style: solid;
      border-width: 1px;
      border-color: $color-light-lavender;
      background: transparent;
      margin-right: 0.35rem;
    }

    .separator {
      margin: 0 0.35rem;
      pointer-events: none;
      @include color-light-lavender();
    }

    .btn-user-menu {
      padding: 0;
      background: transparent;
      @include font-size(14px)
      @include color-dark-blue();
    }

    .dropdown-menu {
      border: none;
      margin-top: 10px;
      @include font-size(13px);
      @include prefix(box-shadow, 0px 0px 10px 0px rgba(0, 0, 0, 0.1));

      &:before {
        content: '\25B2';
        position: absolute;
        top: -18px;
        left: 67px;
        color: white;
        font-size: 20px;
      }
    }
  }
</style>
