import {
  LOGIN_URL,
  REGISTER_URL,
  CHECK_USERNAME_URL,
  FACEBOOK_URL,
  FACEBOOK_REGISTER_URL,
  USERS_URL,
  COLLECTIONS_URL,
  VIDEOS_URL,
  PASSWORD_EDIT_URL,
  EMAIL_EDIT_URL,
  CURATION_ACQUIRE_URL,
  FEED_URL,
  SEARCH_URL
} from '../constants/api'

import {
  FACEBOOK_GRAPH_ME_URL,
  FACEBOOK_OAUTH_URL,
  FEED_MINE,
  FEED_COLLECTION
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

export const patchData = (payload, token = null) => {
  return data('PATCH', payload, token)
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

export const fetchUser = (userId, token) => {
  return http(`${USERS_URL}/${userId}`, getData(token))
}

export const fetchCollections = (uid, token, bustCache = false) => {
  const cached = store.getCollections()

  if (!cached || bustCache) {
    return http(`${USERS_URL}/${uid}/collections`, getData(token)).then(res => {
      store.setCollections(res.payload)
      return res
    })
  } else {
    return Promise.resolve({payload: cached})
  }
}

export const createCollection = (payload, token) => {
  // Mark collections for dirty checking and refreshment.
  store.markCollectionsDirty(true)
  return http(COLLECTIONS_URL, postData(payload, token))
}

export const addVideo = (payload, token) => {
  return http(CURATION_ACQUIRE_URL, postData(payload, token))
}

export const toggleCollectionVisibility = (cid, isPrivate, token) => {
  return http(`${COLLECTIONS_URL}/${cid}`, patchData({is_private: isPrivate}, token))
}

export const editCollectionName = (cid, name, token) => {
  return http(`${COLLECTIONS_URL}/${cid}`, patchData({name}, token))
}

export const deleteCollection = (cid, token) => {
  return fetch(`${COLLECTIONS_URL}/${cid}`, deleteData(token))
    .then(res => {
      if (res.status === 204) {
        return true
      }
    })
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

export const fetchBlockedUsers = token => {
  return http(`${USERS_URL}/blocked`, getData(token))
}

export const fetchBlockedCollections = token => {
  return http(`${COLLECTIONS_URL}/blocked`, getData(token))
}

export const userToUserRelationships = (type, id, token) => {
  return http(`${USERS_URL}/${id}/${type}`, getData(token))
}

export const fetchCollectionFeed = ({collectionId, token}) => {
  return http(`${COLLECTIONS_URL}/${collectionId}`, getData(token))
    .then(res => {
      return {
        payload: res.payload.videos,
        name: res.payload.name
      }
    })
}

export const fetchMyFeed = ({userId, token}) => {
  return http(`${FEED_URL}/${userId}`, getData(token))
}

export const fetchFeed = ({type, userId, token, collectionId, naughty}) => {
  if (type === FEED_COLLECTION && collectionId) {
    return fetchCollectionFeed({collectionId, token})
  }

  if (type === FEED_MINE && userId) {
    return fetchMyFeed({userId, token})
  }

  return http(`${FEED_URL}${naughty ? '/naughty' : ''}`, getData(token))
}

export const checkIfUserHasVideo = (userId, hash, token) => {
  return fetch(`${USERS_URL}/${userId}/hash/${hash}`, getData(token))
    .then(res => {
      return res.json()
    })
}

export const curateVideo = (userId, originalId, hash, url, title, scale, collection, newCollectionName, token) => {
  const data = {
    requester: userId,
    original_id: originalId,
    hash, url, title, scale
  }

  if (+collection < 0 && newCollectionName !== '') {
    data['new_collection_name'] = newCollectionName
  } else {
    data['collection_id'] = collection
  }

  return http(`${CURATION_ACQUIRE_URL}`, postData(data, token))
}

export const editVideo = (video, token) => {
  return http(`${VIDEOS_URL}/${video.id}`, patchData(video, token))
}

export const deleteVideo = (video, token) => {
  return fetch(`${VIDEOS_URL}/${video.id}`, deleteData(token))
    .then(res => {
      if (res.status === 204) {
        return true
      }
    })
}

export const search = (query, token) => {
  return http(SEARCH_URL, postData(query, token))
}
