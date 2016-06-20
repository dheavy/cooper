export const requestBody = payload => {
  let body = ''
  for (const prop in payload) {
    body += prop + '=' + payload[prop] + '&'
  }
  body = body.substring(0, body.length - 1)
  return body
}
