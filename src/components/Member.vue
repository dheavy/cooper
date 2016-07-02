<template>
  <section class="member">
    <header class="row">
      <div class="col-sm-4">
        <h1>{{username}}</h1>
        <small>member since {{dateJoined}}</small>
      </div>
      <div class="col-sm-4">
        <p>{{followed}} followed</p>
      </div>
      <div class="col-sm-4">
        <p>{{followers}} followers</p>
      </div>
    </header>
  </section>
</template>

<script>
const member = {
  name: 'Member',
  props: [
    'username',
    'dateJoined',
    'followed',
    'followers'
  ]
}

export default member
</script>

<style lang="scss" scoped>
.member {
  margin-bottom: 2em;
}
</style>
