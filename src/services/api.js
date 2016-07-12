import {
  LOGIN_URL,
  REGISTER_URL,
  CHECK_USERNAME_URL,
  FACEBOOK_URL,
  FACEBOOK_REGISTER_URL,
  USERS_URL,
  COLLECTIONS_URL,
  PASSWORD_EDIT_URL,
  EMAIL_EDIT_URL /* ,
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

export const deleteData = token => {
  return data('DELETE', null, token)
}

export const checkStatus = res => {
  if (+res.status === 403) {
    return router.go({path: '/logout'})
  }

  if (+res.status >= 400) {
    return res.json().then(res => {
      throw new Error(res.error.code)
    })
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
  // Mark collections for dirty checking and refreshment.
  store.markCollectionsDirty(true)
  return http(COLLECTIONS_URL, postData(payload, token))
}

export const editPassword = ({user_id, password, current_password, confirm_password, token}) => {
  return http(PASSWORD_EDIT_URL, postData({user_id, password, current_password, confirm_password}, token))
}

export const editEmail = ({user_id, email, token}) => {
  return http(EMAIL_EDIT_URL, postData({user_id, email}, token))
    .then(res => {
      // Update locally stored reference of user.
      const user = store.getUser()
      user.email = email
      store.updateUser(user)
      return res
    })
}

export const deactivate = (userId, token) => {
  return fetch(`${USERS_URL}/${userId}`, deleteData(token))
    .then(res => {
      if (res.status === 204) {
        return true
      }
    })
}

export const follow = (type, id, token) => {
  const url = type === 'user' ? USERS_URL : COLLECTIONS_URL
  return http(`${url}/${id}/follow`, postData({}, token))
}

export const unfollow = (type, id, token) => {
  const url = type === 'user' ? USERS_URL : COLLECTIONS_URL
  return http(`${url}/${id}/unfollow`, postData({}, token))
}

export const block = (type, id, token) => {
  const url = type === 'user' ? USERS_URL : COLLECTIONS_URL
  return http(`${url}/${id}/block`, postData({}, token))
}

export const unblock = (type, id, token) => {
  const url = type === 'user' ? USERS_URL : COLLECTIONS_URL
  return http(`${url}/${id}/unblock`, postData({}, token))
}
