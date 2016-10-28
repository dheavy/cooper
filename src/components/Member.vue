<template>
  <section class="member">
    <header class="row">
      <div class="col-sm-4">
        <h1>{{username}}</h1>
        <small>member since {{dateJoined}}</small>
      </div>
      <div class="col-sm-4">
        <p class="follow-data">
          <a
            v-if="+id === currentUserId"
            v-link="{path: '/users/' + id + '/followed'}"
          >
            <span class="link-number">{{following}}</span><br>
            <span>followed</span>
          </a>
        </p>
      </div>
      <div class="col-sm-4">
        <p class="follow-data">
          <a
            v-link="{path: '/users/' + id + '/followers'}"
          >
            <span class="link-number">{{followers}}</span><br>
            <span>followers</span>
          </a>
        </p>
      </div>
    </header>
  </section>
  <button-create-new-collection
    can-create-collection="canCreateCollection"
  ></button-create-new-collection>
</template>

<script>
  import ButtonCreateNewCollection from './ButtonCreateNewCollection'

  export default {
    name: 'Member',

    components: {ButtonCreateNewCollection},

    props: [
      'id',
      'currentUserId',
      'username',
      'dateJoined',
      'following',
      'followers',
      'canCreateCollection'
    ]
  }
</script>

<style lang="scss" scoped>
  @import '../assets/scss/app.scss';

  h1 {
    font-weight: bold;
  }

  small {
    font-size: 14px;
  }

  .member {
    margin-bottom: 0.5em;
  }

  .follow-data {
    margin-top: 15px;
  }

  .link-number {
    @include font-size(24px);
    font-weight: bold;
  }

  a, a:visited, a:active {
    color: $color-dark-blue;
  }

  a:hover {
    color: $color-dark-blue;
    text-decoration: none;
  }
</style>
