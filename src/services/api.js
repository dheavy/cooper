import {
  LOGIN_URL,
  REGISTER_URL,
  CHECK_USERNAME_URL,
  FACEBOOK_URL,
  FACEBOOK_REGISTER_URL,
  USERS_URL,
  COLLECTIONS_URL /* ,
  PASSWORD_EDIT_URL,
  EMAIL_EDIT_URL,
  CURATION_ACQUIRE_URL*/
} from '../constants/api'

import {
  FACEBOOK_GRAPH_ME_URL,
  FACEBOOK_OAUTH_URL
} from '../constants/config'

import {requestBody, headers} from './utils'
import fetch from 'isomorphic-fetch'
import {router} from '../main'
import store from '../store'

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

export const checkStatus = res => {
  if (+res.status >= 400) {
    if (+res.status === 403) {
      router.go({path: '/logout'})
    }

    throw res.error || new Error()
  }

  return res.json()
}

export const http = (...args) => {
  return fetch(...args).then(checkStatus)
}

export const checkUsername = (username, fb = false) => {
  return http(`${CHECK_USERNAME_URL}/${username}`, getData())
}

export const login = credentials => {
  return http(LOGIN_URL, postData(credentials))
}

export const fbAuth = token => {
  if (!token) {
    window.location = FACEBOOK_OAUTH_URL
    return Promise.resolve(true)
  }

  return http(`${FACEBOOK_GRAPH_ME_URL}${token}`, getData())
}

export const fbCheckUser = payload => {
  return http(FACEBOOK_URL, postData(payload))
}

export const register = ({username, email, password, confirmPassword}) => {
  return http(REGISTER_URL, postData({
    username, email, password, confirm_password: confirmPassword
  }))
}

export const registerViaFb = payload => {
  return http(FACEBOOK_REGISTER_URL, postData(payload))
}

export const fetchCollections = (userId, token, bustCache = false) => {
  const cached = store.getCollections()

  if (!cached || bustCache) {
    return http(`${USERS_URL}/${userId}/collections`, getData(token))
  } else {
    return Promise.resolve({payload: cached})
  }
}

export const createCollection = (payload, token) => {
  store.markCollectionsDirty(true)
  return http(COLLECTIONS_URL, postData(payload, token))
}
