import {CHECK_USERNAME_URL} from '../constants/api'

export default {
  checkUsername (context, username) {
    console.log(username)
    context.$http
      .get(`${CHECK_USERNAME_URL}${username}`)
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
  }
}
