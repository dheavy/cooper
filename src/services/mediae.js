import store from '../store'

export const launchPlayer = (video, playlist = []) => {
  store.setupPlayer(video, playlist)
  store.player.isVisible = true
}

export const exitPlayer = () => {
  store.player.isVisible = false
  store.resetPlayer()
}
