<template>
  <li name="usermenu-component" class="usermenu-component nav-item pull-xs-right">
    <div class="btn-group btn-group-notifications {{isNotificationsOpen ? 'open' : ''}}">
      <button
        class="btn btn-notifications"
        type="button"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="{{isNotificationsOpen}}"
      >
        <img src="http://lorempixel.com/34/34/people/" width="34" height="34">
        {{username}} <span class="separator">|</span>
      </button>
      <div class="dropdown-menu">
        <div class="dropdown-item">Feed</div>
        <div class="dropdown-item">My collections</div>
        <div class="dropdown-item">Settings</div>
        <div class="dropdown-item">Blocked</div>
        <div class="dropdown-item">Log out</div>
      </div>
    </div>

    <div class="btn-group btn-group-user-menu {{isUserMenuOpen ? 'open' : ''}}">
      <button
        class="btn btn-user-menu dropdown-toggle"
        type="button"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="{{isUserMenuOpen}}"
        @click="toggleUserMenu"
      >
      </button>
      <ul class="dropdown-menu">
        <a class="dropdown-item" v-link="{name: 'feed-public'}">Feed</a>
        <a class="dropdown-item" v-link="{name: 'home'}">My collections</a>
        <a class="dropdown-item" v-link="{name: 'settings'}">Settings</a>
        <a class="dropdown-item" v-link="{name: 'blocked'}">Blocked</a>
        <a class="dropdown-item" v-link="{name: 'logout'}">Log out</a>
      </div>
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
        isUserMenuOpen: false,
        isNotificationsOpen: false
      }
    },

    methods: {
      toggleUserMenu () {
        this.isUserMenuOpen = !this.isUserMenuOpen
        this.isNotificationsOpen = false

        setTimeout(() => {
          this.isUserMenuOpen
          ? this.addListenersForClosing(this.monitorToggleUserMenu)
          : this.removeListenersForClosing(this.monitorToggleUserMenu)
        }, 500)
      },

      // TODO: Implement notifications
      toggleNotificationsMenu () {
        this.isNotificationsOpen = !this.isNotificationsOpen
        this.isUserMenuOpen = false

        this.isNotificationsOpen
        ? this.addListenersForClosing(this.monitorToggleNotificationsMenu)
        : this.removeListenersForClosing(this.monitorToggleNotificationsMenu)
      },

      monitorToggleUserMenu (e) {
        if (e.target.getAttribute('name') !== 'usermenu-component') {
          this.toggleUserMenu()
        }
      },

      addListenersForClosing (fn) {
        window.addEventListener('click', fn)
        window.addEventListener('touchstart', fn)
      },

      removeListenersForClosing (fn) {
        window.removeEventListener('click', fn)
        window.removeEventListener('touchstart', fn)
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

    .btn-user-menu, .btn-notifications {
      padding: 0;
      background: transparent;
      @include font-size(14px)
      @include color-dark-blue();
    }

    .btn-user-menu {
      top: -3px;
    }

    .btn-group-user-menu {
      .dropdown-menu {
        left: -67px;
        top: 25px;
      }
    }

    .btn-notifications {
      outline: none;
      outline-offset: 0;
    }

    .btn-group-notifications {
      .dropdown-menu {
        left: -30px;
      }
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
