import {
  EMAIL_IN_USE,
  EMAIL_INVALID,
  CONFIRM_PASSWORD_MISSING,
  PASSWORD_MISMATCH,
  AUTH_FORBIDDEN,
  INVALID_UID,
  INVALID_TOKEN,
  URL_MISSING,
  URL_INVALID,
  DUPLICATE,
  COLLECTION_ID_INVALID,
  COLLECTION_ID_OR_NAME_MISSING,
  USER_NOT_FOUND,
  COLLECTION_NOT_FOUND
} from '../constants/codes'

const messages = {}

messages[EMAIL_IN_USE] = 'Email is already in use by another user.'
messages[EMAIL_INVALID] = 'Email address is invalid.'
messages[CONFIRM_PASSWORD_MISSING] = 'Password confirmation is missing.'
messages[PASSWORD_MISMATCH] = 'Passwords mismatch.'
messages[AUTH_FORBIDDEN] = 'Authentication failed (forbidden).'
messages[INVALID_UID] = 'The passed UID is invalid.'
messages[INVALID_TOKEN] = 'The passed token is invalid.'
messages[URL_MISSING] = 'URL is missing.'
messages[URL_INVALID] = 'The passed URL is invalid.'
messages[DUPLICATE] = 'Please be patient, your request is in queue and will be processed shortly.'
messages[COLLECTION_ID_INVALID] = 'The passed collection ID is invalid.'
messages[COLLECTION_ID_OR_NAME_MISSING] = 'Please provide a collection or the name create a new one.'
messages[USER_NOT_FOUND] = 'User was not found.'
messages[COLLECTION_NOT_FOUND] = 'Collection was not found.'

export default messages
