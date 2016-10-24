<template>
  <nav
    class="navbar navbar-fixed-top navbar-light bg-faded"
     v-if="store.state.isAuthenticated"
  >
    <button
      class="navbar-toggler hidden-sm-up"
      type="button"
      data-toggle="collapse"
      data-target="#collapsing-navbar"
    >
      &#9776;
    </button>
    <div class="collapse navbar-toggleable-xs" id="collapsing-navbar">
      <a class="navbar-brand" v-link="{name: 'home'}">
        <logo size="small"></logo>
      </a>
      <ul class="nav navbar-nav">
        <li class="nav-item">
          <a class="nav-link" href="#" @click.prevent="toggleSearch">
            <button-search></button-search>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" v-link="{name: 'create-video'}">Add video</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" v-link="{name: 'feed-public'}">Feed</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" v-link="{name: 'home'}">My collections</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" v-link="{name: 'settings'}">Settings</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" v-link="{name: 'blocked'}">Blocked</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" v-link="{name: 'logout'}">Log out</a>
        </li>

        <li class="nav-item pull-xs-right">
          <toggle-switch :checked.sync="store.state.isNaughtyMode"></toggle-switch>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
  import ButtonSearch from './ButtonSearch'
  import ToggleSwitch from './ToggleSwitch'
  import store from '../store'
  import Logo from './Logo'

  export default {
    name: 'Navigation',

    components: {ButtonSearch, ToggleSwitch, Logo},

    data () {
      return {store}
    },

    methods: {
      toggleSearch () {
        this.store.search.isOpened = !this.store.search.isOpened
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../assets/scss/definitions';

  nav {
    @include background-color-light();
    @include border-color-light-lavender();
    border-bottom-width: 1px;
    border-bottom-style: solid;
  }
</style>
