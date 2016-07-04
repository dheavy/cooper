import Vue from 'vue'
import moment from 'moment'

const filters = () => {
  Vue.filter('date', value => {
    return moment(value).format('LL')
  })
}

export default filters()
