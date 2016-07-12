import {
  LOGIN_URL,
  REGISTER_URL /* ,
  CHECK_USERNAME_URL,
  FACEBOOK_URL,
  FACEBOOK_REGISTER_URL,
  USERS_URL,
  COLLECTIONS_URL,
  PASSWORD_EDIT_URL,
  EMAIL_EDIT_URL,
  CURATION_ACQUIRE_URL*/
} from '../constants/api'

import fetch from 'isomorphic-fetch'
import {requestBody, headers} from './utils'

require('es6-promise').polyfill()

export const data = (method, payload, token = null) => {
  return {
    method,
    headers: headers(token),
    body: requestBody(payload)
  }
}

export const postData = (payload, token = null) => {
  return data('POST', payload, token)
}

export const login = credentials => {
  return fetch(LOGIN_URL, postData(credentials))
    .then(res => res.json())
}

export const register = ({username, email, password, confirmPassword}) => {
  return fetch(REGISTER_URL, postData({
    username, email, password, confirm_password: confirmPassword
  })).then(res => res.json())
}
