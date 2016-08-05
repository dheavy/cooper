import errors from '../services/errors'

export const parseError = {
  methods: {
    parseError (err) {
      // console.log(err)
      if (errors[err.message]) {
        this.error = errors[err.message]
      } else {
        this.error = 'Oops... something went wrong, please try again.'
      }
    }
  }
}
