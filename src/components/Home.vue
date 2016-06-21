<template>
  <navigation :auth="false"></navigation>
  <div class="row">
    <div class="col-sm-4 col-sm-offset-4">
      <h2>Landing page</h2>
    </div>
  </div>
</template>

<script>
import navigation from './Navigation'

export default {
  name: 'Home',

  components: {
    navigation
  }
}
</script>
