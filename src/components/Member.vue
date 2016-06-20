<template>
  <header class="row">
    <div class="col-sm-4">
      <h1>{{username}}</h1>
      <small>member since {{dateJoined}}</small>
    </div>
  </header>
</template>

<script>
const member = {
  name: 'Member',
  props: [
    'username',
    'dateJoined'
  ]
}

export default member
</script>
