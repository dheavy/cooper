import Vue from 'vue'

const store = new Vue({
  name: 'Store',

  data () {
    return {
      search: {
        isOpened: false
      },
      player: {
        'isVisible': false,
        'video': null,
        'playlist': [],
        'isTVMode': false
      },
      state: {
        isAuthenticated: false,
        isNaughtyMode: !!JSON.parse(String(localStorage.getItem('naughty')).toLowerCase()) || false,
        isPlayerOn: false,
        user: null,
        token: null,
        collections: null
      },
      dirty: {
        collections: null
      }
    }
  },

  watch: {
    // Keep view mode value in local storage. Update as we change.
    'state.isNaughtyMode': (val) => {
      if (!!JSON.parse(String(localStorage.getItem('naughty')).toLowerCase()) !== val) {
        localStorage.setItem('naughty', val)
      }
    }
  },

  methods: {
    setAuthentication (auth) {
      if (this.state.isAuthenticated !== auth) {
        this.state.isAuthenticated = auth
      }
    },

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
     * Cache results, both as collections for later retrieval.
     *
     * @param {Array} collections
     */
    setCollections (collections) {
      this.state.collections = collections
    },

    getUser () {
      this.state.user = this.state.user ? this.state.user : JSON.parse(localStorage.getItem('user'))
      return this.state.user
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
      this.state.token = this.state.token ? this.state.token : localStorage.getItem('token')
      return this.state.token
    },

    clear () {
      this.state.user = null
      this.state.token = null

      this.markCollectionsDirty(false)

      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('collections')
      localStorage.removeItem('collections_dirty')
    },

    setupPlayer (video, playlist) {
      store.player.video = video
      store.player.playlist = playlist
    },

    resetPlayer () {
      store.player.video = null
      store.player.playlist = []
    }
  }
})

export default store
