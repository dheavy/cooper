export const FACEBOOK_APP_ID = '1096543940416567'
export const FACEBOOK_OAUTH_REDIRECT_URL = 'http://localhost:8080/facebook'
export const FACEBOOK_GRAPH_ME_URL = 'https://graph.facebook.com/me?fields=id,name,email&access_token='
export const FACEBOOK_OAUTH_URL = `https://www.facebook.com/v2.6/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${FACEBOOK_OAUTH_REDIRECT_URL}&scope=public_profile,email&response_type=token`