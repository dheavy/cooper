import errors from '../services/errors'
import store from '../store'

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

// Component mixing in `watchViewModeChanges` must
// implement a `viewModeChangeHandler` method.
export const watchViewModeChanges = {
  created () {
    store.$watch('state.isNaughtyMode', (val, oldVal) => {
      if (val !== oldVal) {
        this.viewModeChangeHandler(val)
      }
    }, {
      deep: true
    })
  },

  methods: {
    viewModeChangeHandler (val) {}
  }
}
