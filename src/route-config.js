import auth from './services/auth'
import Home from './components/Home'
import Login from './components/Login'
import Logout from './components/Logout'
import Blocked from './components/Blocked'
import Register from './components/Register'
import Settings from './components/Settings'
import Dashboard from './components/Dashboard'
import Collections from './components/Collections'
import PasswordReset from './components/PasswordReset'
import CreateEditDestroyCollection from './components/CreateEditDestroyCollection'

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
        '/collections': {
          name: 'collections',
          component: Collections
        },
        '/blocked': {
          name: 'blocked',
          component: Blocked
        },
        '/settings': {
          name: 'settings',
          component: Settings
        },
        '/create/collection': {
          name: 'create-collection',
          component: CreateEditDestroyCollection
        }
      }
    },
    '/users/:uid': {
      auth: true,
      component: Dashboard
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
