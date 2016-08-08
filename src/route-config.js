import auth from './services/auth'
import Home from './components/Home'
import Feed from './components/Feed'
import Login from './components/Login'
import Logout from './components/Logout'
import Follow from './components/Follow'
import Blocked from './components/Blocked'
import Register from './components/Register'
import Settings from './components/Settings'
import Dashboard from './components/Dashboard'
import CreateVideo from './components/CreateVideo'
// import PasswordReset from './components/PasswordReset'
import CreateCollection from './components/CreateCollection'

const routeConfig = router => {
  router.map({
    '/': {
      component: Home,
      redirectIfAuth: true,
      name: 'home'
    },
    '/login': {
      component: Login,
      redirectIfAuth: true,
      name: 'login'
    },
    '/logout': {
      component: Logout,
      auth: true,
      name: 'logout'
    },
    '/register': {
      component: Register,
      redirectIfAuth: true,
      name: 'register'
    },
    '/facebook': {
      component: Register,
      redirectIfAuth: true,
      name: 'facebook'
    },
    '/my': {
      component: Dashboard,
      auth: true,
      subRoutes: {
        '/followed': {
          name: 'followed',
          component: Follow
        },
        '/followers': {
          name: 'followed',
          component: Follow
        },
        '/blocked': {
          name: 'blocked',
          component: Blocked
        },
        '/settings': {
          name: 'settings',
          component: Settings
        },
        '/collections/create': {
          name: 'create-collection',
          component: CreateCollection
        },
        '/videos/create': {
          name: 'create-video',
          component: CreateVideo
        }
      }
    },
    '/users/:uid': {
      auth: true,
      name: 'users',
      component: Dashboard,
      subRoutes: {
        '/followed': {
          name: 'users-followed',
          component: Follow
        },
        '/followers': {
          name: 'users-followers',
          component: Follow
        }
      }
    },
    '/feed': {
      auth: true,
      name: 'feed-public',
      component: Feed
    },
    '/feed/mine': {
      auth: true,
      name: 'feed-mine',
      component: Feed
    },
    '/feed/:cid': {
      auth: true,
      name: 'feed-collection',
      component: Feed
    }
  })

  router.redirect({
    '*': '/'
  })

  router.beforeEach(transition => {
    if (transition.to.auth && !auth.isAuthenticated()) {
      return transition.redirect('/login')
    }

    if (transition.to.redirectIfAuth && auth.isAuthenticated()) {
      return transition.redirect('/my')
    }

    transition.next()
  })

  return router
}

export default routeConfig
