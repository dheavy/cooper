import {CHECK_USERNAME_URL, FACEBOOK_REGISTER_URL} from '../constants/api'
import {requestBody, headers} from './utils'
import {register} from './api'
import auth from './auth'

export default {
  checkUsername (context, username, fb = false) {
    context.$http
      .get(`${CHECK_USERNAME_URL}/${username}`)
      .then(res => {
        if (res.status === 200) {
          if (fb) {
            context.fbUsernameAvailable = true
          } else {
            context.usernameAvailable = true
          }
        } else {
          if (fb) {
            context.fbUsernameAvailable = false
          } else {
            context.usernameAvailable = false
          }
        }
      })
      .catch(err => {
        context.parseError(err)
      })
  },

  register (payload) {
    return register(payload)
      .then(res => {
        if (res.status >= 300) {
          throw new Error(JSON.parse(res.error.split("'").join('"')).code[0])
        }
      })
      .then(res => {
        auth.login({username: payload.username, password: payload.password}, '/my')
            .catch(err => { throw err })
      })
  },

  registerViaFacebook (context, payload) {
    context.$http
      .post(FACEBOOK_REGISTER_URL, requestBody(payload), headers())
      .then(res => {
        auth
          .loginViaTokenAndUser(res.data.token, res.data.user, '/my')
          .catch(err => context.parseError(err))
      })
      .catch(err => {
        context.parseError(err)
      })
  }
}
