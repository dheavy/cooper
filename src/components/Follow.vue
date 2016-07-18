<template>
  <section class="follow row">
    <div v-if="loading">Loading</div>

    <div v-else class="row">
      <div class="col-sm-6">
        <div class="alert alert-danger" v-if="error">{{error}}</div>
        <table v-else class="table">
          <thead>
            <th>{{relationship}}</th>
            <th></th>
          </thead>
          <tbody>
            <tr v-for="user in usersList">
              <td><a v-link="{name: 'users', params: {uid: user.id}}">{{user.username}}</a></td>
              <td>
                <follow-button css-classes="btn btn-sm btn-secondary" :store="store" :other-user="user"></block-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script>
import {userToUserRelationships} from '../services/api'
import followButton from './FollowButton'
import store from '../store'

export default {
  name: 'Follow',

  components: {
    followButton
  },

  data () {
    return {
      store,
      error: null,
      loading: null,
      usersList: null,
      relationship: null
    }
  },

  route: {
    data () {
      this.loading = true
      this.error = false
      this.relationship = this.$route.path.indexOf('followers') > -1 || +store.getUser().id !== +this.$route.params.uid
                          ? 'followers' : 'followed'

      return userToUserRelationships(this.relationship, this.$route.params.uid, store.getToken())
        .then(res => {
          this.loading = false
          this.usersList = res.payload
        })
        .catch(err => {
          console.log(err)
          this.loading = false
          this.error = 'Oops... something went wrong. Please refresh the page.'
        })
    }
  }
}
</script>
