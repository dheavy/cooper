export const FACEBOOK_APP_ID = '1096543940416567'
export const FACEBOOK_OAUTH_REDIRECT_URL = 'http://localhost:8080/facebook'
export const FACEBOOK_GRAPH_ME_URL = 'https://graph.facebook.com/me?fields=id,name,email&access_token='
export const FACEBOOK_OAUTH_URL = `https://www.facebook.com/v2.6/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${FACEBOOK_OAUTH_REDIRECT_URL}&scope=public_profile,email&response_type=token`

export const MEDIA_NORMAL_WIDTH = 265
export const MEDIA_NORMAL_HEIGHT = 204
export const MEDIA_LARGE_WIDTH = 540
export const MEDIA_LARGE_HEIGHT = 418
export const MEDIA_SCALE_NORMAL = 'normal'
export const MEDIA_SCALE_LARGE = 'large'

export const FEED_PUBLIC = 'feed-public'
export const FEED_MINE = 'feed-mine'
export const FEED_COLLECTION = 'feed-collection'
