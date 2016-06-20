import {LOGIN_URL} from '../constants/api'
import {requestBody} from './utils'
import {router} from '../main'
import store from '../store'

export default {
  isAuthenticated: () => !!(localStorage.getItem('token') && localStorage.getItem('user')),

  login (context, credentials, redirect) {
    context.$http
      .post(LOGIN_URL, requestBody(credentials), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }
      })
      .then((res) => {
        store.setToken(res.data.token)
        store.setUser(res.data.user)
        redirect ? router.go(redirect) : void (0)
      })
      .catch(err => {
        context.parseError(err)
      })
  }
}
