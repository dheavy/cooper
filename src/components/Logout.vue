<script>
  import auth from '../services/auth'
  import {router} from '../main'

  export default {
    route: {
      activate () {
        auth.logout()
        router.go({path: '/'})
      }
    }
  }
</script>
