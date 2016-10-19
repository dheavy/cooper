import {
  EMAIL_IN_USE,
  EMAIL_INVALID,
  EMAIL_NOT_IN_DB,
  CONFIRM_PASSWORD_MISSING,
  PASSWORD_MISMATCH,
  PASSWORD_INVALID,
  AUTH_FORBIDDEN,
  INVALID_UID,
  INVALID_TOKEN,
  URL_MISSING,
  URL_INVALID,
  DUPLICATE,
  COLLECTION_ID_INVALID,
  COLLECTION_ID_OR_NAME_MISSING,
  USER_NOT_FOUND,
  COLLECTION_NOT_FOUND,
  VIDEO_ALREADY_QUEUED
} from '../constants/codes'

const messages = {}

messages[EMAIL_IN_USE] = 'Email is already in use by another user.'
messages[EMAIL_INVALID] = 'Email address is invalid.'
messages[EMAIL_NOT_IN_DB] = "Sorry... But it looks like you didn't leave your email address... <br>Send us an <a href='mailto:contact@mypleasu.re'>email</a> directly to see how you can reset your password."
messages[CONFIRM_PASSWORD_MISSING] = 'Password confirmation is missing.'
messages[PASSWORD_INVALID] = 'Your password is invalid, please try again.'
messages[PASSWORD_MISMATCH] = 'Passwords mismatch.'
messages[AUTH_FORBIDDEN] = 'Authentication failed (forbidden).'
messages[INVALID_UID] = 'An error occured while attempting to reset password.'
messages[INVALID_TOKEN] = 'An error occured while attempting to reset password.'
messages[URL_MISSING] = 'URL is missing.'
messages[URL_INVALID] = 'The passed URL is invalid.'
messages[DUPLICATE] = 'Please be patient, your request is in queue and will be processed shortly.'
messages[COLLECTION_ID_INVALID] = 'The passed collection ID is invalid.'
messages[COLLECTION_ID_OR_NAME_MISSING] = 'Please provide a collection or the name create a new one.'
messages[USER_NOT_FOUND] = 'User was not found.'
messages[COLLECTION_NOT_FOUND] = 'Collection was not found.'
messages[VIDEO_ALREADY_QUEUED] = 'Please be patient... Video is already being processed.'

export default messages
