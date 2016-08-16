<template>
  <div v-if="loading">
    <h2>Loading...</h2>
  </div>
  <div v-else>
    <div class="alert alert-danger" v-if="error">{{error}}</div>
    <div v-else>
      <member
        :id="shownUser.id"
        :current-user-id="user.id"
        :username="shownUser.username"
        :date-joined="shownUser.dateJoined | date"
        :followers="shownUser.followers.length"
        :following="shownUser.following.length"
        :can-create-collection="canCreateCollection"
      >
      </member>

      <follow-button
        css-classes="btn btn-secondary"
        :store="store"
        :other-user="shownUser"
      >
      </follow-button>

      <block-button
        css-classes="btn btn-secondary"
        :store="store"
        :other-user="shownUser"
      >
      </block-button>

      <collections
        :user-id="shownUser.id"
        :are-my-own="collectionsAreMyOwn"
        v-show="shouldShowCollections"
      ></collections>
    </div>
  </div>
  <router-view></router-view>
</template>

<script>
  import FollowButton from './FollowButton'
  import {fetchUser} from '../services/api'
  import Collections from './collections'
  import BlockButton from './BlockButton'
  import Navigation from './Navigation'
  import Member from './Member'
  import store from '../store'

  const PAGE_MEMBER = 'member'
  const PAGE_FRONT = 'frontpage'
  const PAGE_RELATIONSHIPS = 'relationships'

  export default {
    name: 'Dashboard',

    components: {
      Navigation, Member, Collections, FollowButton, BlockButton
    },

    data () {
      return {
        store,
        loading: true,
        shownUser: null,
        error: null,
        pageType: '',
        user: store.getUser()
      }
    },

    methods: {
      determinePageType (path) {
        // TODO: Refactor - this is inelegant and suboptimal!
        if (path === '/my') return PAGE_FRONT

        if (/\/users\/\d*\/(followers|followed)\/?$/i.test(path)) return PAGE_RELATIONSHIPS
        if (/\/users\/\d*\/?/i.test(path)) return PAGE_MEMBER
      }
    },

    computed: {
      canCreateCollection: {
        cache: false,
        get () {
          return this.shownUser.id === this.user.id &&
                 this.$route.path === '/my' || this.$route.path === '/my/collections'
        }
      },

      shouldShowCollections () {
        return this.pageType === PAGE_FRONT || (this.pageType === PAGE_MEMBER && this.pageType !== PAGE_RELATIONSHIPS)
      },

      collectionsAreMyOwn () {
        return this.shownUser.id === this.store.getUser().id
      },

      shouldFetchUser () {
        return this.pageType !== PAGE_FRONT
      }
    },

    route: {
      data () {
        this.pageType = this.determinePageType(this.$route.path)

        if (this.shouldFetchUser && this.$route.params.uid) {
          const id = this.$route.params.uid
          this.error = ''

          fetchUser(id, store.getToken())
            .then(res => {
              this.loading = false
              this.shownUser = res.payload
            })
            .catch(err => {
              console.log(err)
              this.loading = false
              if (err.status === 404) {
                this.error = 'User not found.'
                return
              }
              this.error = 'Oops... something went wrong. Please try again.'
            })
        } else {
          // Own user's page.
          this.shownUser = store.getUser()
          this.loading = false
        }
      }
    }
  }
</script>
