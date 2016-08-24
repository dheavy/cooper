import VueValidator from 'vue-validator'
import Vue from 'vue'

Vue.use(VueValidator)

Vue.validator('email', val => /\S+@\S+\.\S+/.test(val))
Vue.validator('url', val => /^(http:\/\/|https:\/\/)(.{4,})$/.test(val))
Vue.validator('validExistingCollection', val => val >= 1)
Vue.validator('validNewCollection', val => val.trim() !== '')
