<template>
  <navigation
    :auth="true"
    :user-id="id"
  ></navigation>
  <member
    :username="username"
    :date-joined="dateJoined"
    :followers="followers"
    :following="following"
  >
  </member>
  <router-view></router-view>
</template>

<script>
import collections from './Collections'
import navigation from './Navigation'
import member from './Member'
import store from '../store'
import moment from 'moment'

export default {
  name: 'Dashboard',

  components: {
    navigation, member, collections
  },

  data () {
    const user = store.getUser()

    return {
      id: user.id,
      username: user.username,
      dateJoined: moment(user.dateJoined).format('LL'),
      followers: user.followers.length,
      following: user.following.length
    }
  }
}
</script>
