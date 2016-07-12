import {
  LOGIN_URL,
  REGISTER_URL,
  CHECK_USERNAME_URL,
  FACEBOOK_URL,
  FACEBOOK_REGISTER_URL /* ,
  USERS_URL,
  COLLECTIONS_URL,
  PASSWORD_EDIT_URL,
  EMAIL_EDIT_URL,
  CURATION_ACQUIRE_URL*/
} from '../constants/api'

import {
  FACEBOOK_GRAPH_ME_URL,
  FACEBOOK_OAUTH_URL
} from '../constants/config'

import fetch from 'isomorphic-fetch'
import {requestBody, headers} from './utils'

require('es6-promise').polyfill()

export const data = (method, payload = null, token = null) => {
  const data = {
    method,
    headers: headers(token)
  }

  if (payload) {
    data.body = requestBody(payload)
  }

  return data
}

export const postData = (payload, token = null) => {
  return data('POST', payload, token)
}

export const getData = (token = null) => {
  return data('GET', null, token)
}

export const checkUsername = (username, fb = false) => {
  return fetch(`${CHECK_USERNAME_URL}/${username}`, getData()).then(res => res.json())
}

export const login = credentials => {
  return fetch(LOGIN_URL, postData(credentials)).then(res => res.json())
}

export const fbAuth = token => {
  if (!token) {
    window.location = FACEBOOK_OAUTH_URL
    return Promise.resolve(true)
  }

  return fetch(`${FACEBOOK_GRAPH_ME_URL}${token}`, getData())
    .then(res => res.json())
}

export const fbCheckUser = payload => {
  return fetch(FACEBOOK_URL, postData(payload)).then(res => res.json())
}

export const register = ({username, email, password, confirmPassword}) => {
  return fetch(REGISTER_URL, postData({
    username, email, password, confirm_password: confirmPassword
  })).then(res => res.json())
}

export const registerViaFb = payload => {
  return fetch(FACEBOOK_REGISTER_URL, postData(payload)).then(res => res.json())
}
