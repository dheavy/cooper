<template>
  <nav class="navbar navbar-fixed-top navbar-light bg-faded">
    <button class="navbar-toggler hidden-sm-up" type="button" data-toggle="collapse" data-target="#collapsing-navbar">
      &#9776;
    </button>
    <div class="collapse navbar-toggleable-xs" id="collapsing-navbar">
      <a class="navbar-brand" v-link="{name: 'home'}">MyPleasu.re</a>
      <ul v-if="auth" class="nav navbar-nav">
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
      </ul>
      <ul v-else class="nav navbar-nav">
        <li class="nav-item">
          <a class="nav-link" v-link="{name: 'home'}">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" v-link="{name: 'register'}" href="#">Register</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" v-link="{name: 'login'}" href="#">Log In</a>
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
