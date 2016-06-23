import {router} from '../main'

export default {
  methods: {
    logoutIfForbidden: status => {
      if (status === 403) {
        router.go({path: '/logout'})
      }
    }
  }
}
