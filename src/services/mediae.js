import store from '../store'

export const launchPlayer = (video, playlist = []) => {
  console.log(video, playlist)
  store.player.isVisible = true
}

export const exitPlayer = () => {
  store.player.isVisible = false
}
