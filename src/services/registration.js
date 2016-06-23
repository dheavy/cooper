import {CHECK_USERNAME_URL, REGISTER_URL} from '../constants/api'
import {requestBody, headers} from './utils'
import auth from './auth'

export default {
  checkUsername (context, username) {
    context.$http
      .get(`${CHECK_USERNAME_URL}/${username}`)
      .then(data => {
        if (data.status === 200) {
          context.usernameAvailable = true
        } else {
          context.usernameAvailable = false
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
      .then(data => {
        auth.login(context, {username, password}, '/my')
      })
      .catch(err => {
        context.parseError(err)
      })
  }
}
