import {CHECK_USERNAME_URL, REGISTER_URL, FACEBOOK_REGISTER_URL} from '../constants/api'
import {requestBody, headers} from './utils'
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

  register (context, {username, email, password, confirmPassword}) {
    context.$http
      .post(REGISTER_URL, requestBody({
        username, email, password, confirm_password: confirmPassword
      }), headers())
      .then(res => {
        auth.login(context, {username, password}, '/my')
      })
      .catch(err => {
        context.parseError(err)
      })
  },

  registerViaFacebook (context, payload) {
    context.$http
      .post(FACEBOOK_REGISTER_URL, requestBody(payload), headers())
      .then(res => {
        auth.loginViaTokenAndUser(res.data.token, res.data.user, '/my')
      })
      .catch(err => {
        context.parseError(err)
      })
  }
}
