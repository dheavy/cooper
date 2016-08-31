import store from '../store'

export const launchPlayer = (video, playlist = []) => {
  store.setupPlayer(video, playlist)
  store.player.isVisible = true
}

export const exitPlayer = () => {
  store.player.isVisible = false
  store.resetPlayer()

  // Remove possible query params mentionning video.
  if (window.location.href.indexOf('?v=') > -1) {
    window.location.href = window.location.href.substr(0, window.location.href.indexOf('?v='))
  }
}
