import './assets/styles.scss'

const { UIContainerPlugin, Log, template } = Clappr
const { Events: PlayerEvents } = WP3


export default class PlaybackRatePlugin extends UIContainerPlugin {
  get name() { return 'playback_rate_plugin' } 

  constructor(container) {
    Log.warn('Container Plugin is ready')
    Log.error('Container Plugin has error')
    
    super(container)
    this.container = container

    this.render()
  }

  bindEvents() {
    this.listenTo(this.container.playback, PlayerEvents.WM_VIDEO_METADATA_LOADED, this.onVideoMetadataLoaded)
  }

  onVideoMetadataLoaded() {
    console.log("::: Eu sou um evento de playback! :::")
  }

  render() {
    this.el
  }

}