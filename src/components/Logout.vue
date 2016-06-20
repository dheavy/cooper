<script>
import {router} from '../main'
import auth from '../services/auth'

export default {
  route: {
    activate () {
      auth.logout()
      router.go({path: '/'})
    }
  }
}
</script>
