<script>
import {router} from '../main'
import store from '../store'

export default {
  route: {
    activate () {
      store.clear()
      router.go({path: '/'})
    }
  }
}
</script>
