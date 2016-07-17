import auth from './services/auth'
import Home from './components/Home'
import Login from './components/Login'
import Logout from './components/Logout'
import Follow from './components/Follow'
import Blocked from './components/Blocked'
import Register from './components/Register'
import Settings from './components/Settings'
import Dashboard from './components/Dashboard'
import CreateVideo from './components/CreateVideo'
import PasswordReset from './components/PasswordReset'
import CreateCollection from './components/CreateCollection'

const routeConfig = router => {
  router.map({
    '/': {
      component: Home,
      redirectIfAuth: true
    },
    '/login': {
      component: Login,
      redirectIfAuth: true
    },
    '/logout': {
      component: Logout,
      auth: true
    },
    '/register': {
      component: Register,
      redirectIfAuth: true
    },
    '/facebook': {
      component: Register,
      redirectIfAuth: true
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
          name: 'followed',
          component: Follow
        }
      }
    },
    '/password/reset': {
      component: PasswordReset,
      auth: true
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
