import Vue from 'vue'
import moment from 'moment'

const filters = () => {
  Vue.filter('date', value => {
    return moment(value).format('LL')
  })

  Vue.filter('ellipsis', (value, length, dots = '...') => {
    if (value.length > length) {
      return value.slice(0, length - dots.length) + dots
    }
    return value
  })
}

export default filters()
