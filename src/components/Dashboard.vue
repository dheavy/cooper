<template>
  <navigation :auth="true"></navigation>
  <member :username="username" :date-joined="dateJoined"></member>
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
    return {
      username: store.getUser().username,
      dateJoined: moment(store.getUser().dateJoined).format('LL')
    }
  },

  route: {
    canActivate () {
      return auth.isAuthenticated()
    }
  }
}
</script>
