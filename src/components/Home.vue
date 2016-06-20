<template>
  <navigation :auth="false"></navigation>
  <div class="row">
    <div class="col-sm-4 col-sm-offset-4">
      <h2>Landing page</h2>
    </div>
  </div>
</template>

<script>
import navigation from './navigation'
import auth from '../services/auth'
import {router} from '../main'

export default {
  name: 'Home',

  components: {
    navigation
  },

  route: {
    activate () {
      if (auth.isAuthenticated()) {
        router.go({path: '/my'})
      }
    }
  }
}
</script>
