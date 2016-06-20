<template>
  <header class="row">
    <div class="col-sm-4">
      <h1>{{username}}</h1>
      <small>member since {{dateJoined}}</small>
    </div>
    <div class="col-sm-4">
      <p>{{following}} followed</p>
    </div>
    <div class="col-sm-4">
      <p>{{followers}} followers</p>
    </div>
  </header>
</template>

<script>
const member = {
  name: 'Member',
  props: [
    'username',
    'dateJoined',
    'following',
    'followers'
  ]
}

export default member
</script>
