<template>
  <navigation :auth="true"></navigation>
  <member
    :username="username"
    :date-joined="dateJoined"
    :followers="followers"
    :following="following"
  >
  </member>
</template>

<script>
import navigation from './navigation'
import auth from '../services/auth'
import member from './member'
import store from '../store'
import moment from 'moment'

export default {
  name: 'Dashboard',

  components: {
    navigation, member
  },

  data () {
    const user = store.getUser()

    return {
      username: user.username,
      dateJoined: moment(user.dateJoined).format('LL'),
      followers: user.followers.length,
      following: user.following.length
    }
  },

  route: {
    canActivate () {
      return auth.isAuthenticated()
    }
  }
}
</script>
