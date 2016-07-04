<template>
  <nav class="navbar navbar-fixed-top navbar-light bg-faded">
    <button class="navbar-toggler hidden-sm-up" type="button" data-toggle="collapse" data-target="#collapsing-navbar">
      &#9776;
    </button>
    <div class="collapse navbar-toggleable-xs" id="collapsing-navbar">
      <a class="navbar-brand" href="/">MyPleasu.re</a>
      <ul v-if="auth" class="nav navbar-nav">
        <li class="nav-item" name="collections">
          <a class="nav-link" v-link="{name: 'collections', params: {uid: userId}}">Collections</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" v-link="{path: '/my/settings'}">Settings</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" v-link="{path: '/my/blocked'}">Blocked</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" v-link="{path: '/logout'}">Log out</a>
        </li>
      </ul>
      <ul v-else class="nav navbar-nav">
        <li class="nav-item">
          <a class="nav-link" v-link="{path: '/'}">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" v-link="{path: '/register'}" href="#">Register</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" v-link="{path: '/login'}" href="#">Log In</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navigation',

  props: ['auth', 'userId']
}
</script>
