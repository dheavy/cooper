import {register, checkUsername, registerViaFb} from './api'
import auth from './auth'

export default {
  checkUsername (username, fb = false) {
    return checkUsername(username)
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

  registerViaFacebook (payload) {
    return registerViaFb(payload)
      .then(res => {
        auth
          .loginViaTokenAndUser(res.token, res.user, '/my')
          .catch(err => {
            throw err
          })
      })
      .catch(err => {
        throw err
      })
  }
}
