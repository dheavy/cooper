export const requestBody = payload => {
  let body = ''
  for (const prop in payload) {
    body += prop + '=' + payload[prop] + '&'
  }
  body = body.substring(0, body.length - 1)
  return body
}

export const headers = token => {
  const headers = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    }
  }

  if (token) {
    headers.headers['Authorization'] = `Bearer ${token}`
  }

  return headers
}
