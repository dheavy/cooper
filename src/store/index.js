import Vue from 'vue'

const store = new Vue({
  name: 'Store',

  data () {
    return {
      state: {
        user: null,
        token: null,
        collections: null
      },
      dirty: {
        collections: null
      }
    }
  },

  methods: {
    /**
     * Set user once acquired after login. Store in localstorage as well.
     */
    setUser ({id, username, email, last_login, date_joined, followers, following, blocking, collections_followed, collections_blocked}) {
      this.state.user = {
        id, username, email,
        lastLogin: last_login,
        dateJoined: date_joined,
        collectionsFollowed: collections_followed,
        collectionsBlocked: collections_blocked,
        followers, following, blocking
      }
      localStorage.setItem('user', JSON.stringify(this.state.user))
    },

    /**
     * Mark a collection as dirty to invalidate its cache and fetch it again.
     *
     * @param  {Boolean} mark   Set as dirty or not.
     */
    markCollectionsDirty (mark) {
      this.dirty.collections = mark
      mark ? localStorage.setItem('collections_dirty', true) : localStorage.removeItem('collections_dirty')
    },

    /**
     * Whether collections are to be cache-invalidated or not.
     *
     * @return {Boolean}
     */
    areCollectionsDirty () {
      return this.dirty.collections !== null ? this.dirty.collections : !!localStorage.getItem('collections_dirty')
    },

    /**
     * Set collections to store.
     * Cache results, both as collections for later retrieval,
     * and as a set of videos' IDs to keep an index and compare with displayed
     * videos on feeds to see if user already added the video.
     *
     * @param {Array} collections
     */
    setCollections (collections) {
      this.state.collections = collections
      this.createOrUpdateVideosIndex(this.reduceVideosInCollections(collections))
      localStorage.setItem('collections', JSON.stringify(this.state.collections))
    },

    /**
     * Create and store in localStorage an index of videos ID currently owned by user.
     *
     * @param  {Array} videos  Array of IDs
     */
    createOrUpdateVideosIndex (videos) {
      localStorage.setItem('videos_index', JSON.stringify(videos.map(v => v.id)))
    },

    /**
     * Given a set of collections, traverse and reduce the it
     * as a flat array of videos.
     *
     * @param  {Array} collections
     * @return {Array}
     */
    reduceVideosInCollections (collections) {
      const flatten = list => list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), [])
      return flatten(collections.map(c => c.videos))
    },

    getVideosIndex () {
      return localStorage.getItem('videos_index') || []
    },

    getUser () {
      return this.state.user || JSON.parse(localStorage.getItem('user'))
    },

    getCollections () {
      return this.state.collections || JSON.parse(localStorage.getItem('collections'))
    },

    updateUser (newUser) {
      const oldUser = this.getUser()
      const user = Object.assign({}, oldUser, newUser)

      // Rename properties to fit the setter's arguments.
      user.collections_blocked = user.collectionsBlocked
      user.collections_followed = user.collectionsFollowed
      user.last_login = user.lastLogin
      user.date_joined = user.dateJoined
      this.setUser(user)
    },

    updateCollections (newCollections) {
      const oldCollections = this.getCollections()
      const collections = Object.assign({}, oldCollections, newCollections)
      this.setCollections(collections)
    },

    setToken (token) {
      this.state.token = token
      localStorage.setItem('token', token)
    },

    getToken () {
      return this.state.token || localStorage.getItem('token')
    },

    clear () {
      this.state.user = null
      this.state.token = null

      this.markCollectionsDirty(false)

      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('collections')
      localStorage.removeItem('videos_index')
      localStorage.removeItem('collections_dirty')
    }
  }
})

export default store

// Vue.component('store', store)
