import './assets/style.scss';

const { UICorePlugin, Log, template } = Clappr;
const { Events: PlayerEvents } = WP3;

const DEFAULT_PLAYBACK_RATES = [
  { value: 0.5, label: "0.5x" },
  { value: 0.7, label: "0.7x" },
  { value: 1, label: "1x" },
  { value: 1.2, label: "1.2x" },
  { value: 1.5, label: "1.5x" },
  { value: 1.7, label: "1.7x" },
  { value: 2, label: "2x" },
];

const DEFAULT_PLAYBACK_RATE = 1;
const DEFAULT_PLAYBACK_RATE_SUFFIX = "x"; // Used by getTitle method

const htmlContent = `
  <button class="media-control-button media-control-icon" data-playback-rate-button>
  <%= title %>
  </button>
  <ul>
  <% for (var i = 0; i < playbackRates.length; i++) { %>
    <li><a href="#" data-playback-rate-select="<%= playbackRates[i].value %>"><%= playbackRates[i].label %></a></li>
  <% }; %>
  </ul>
`;

export default class PlaybackRatePlugin extends UICorePlugin {
  get name() {
    return "playback_rate_plugin";
  }
  get template() {
    return template(htmlContent);
  }

  get attributes() {
    return {
      "class": "playback_rate",
      "data-playback-rate-select": "",
    };
  }

  get events() {
    return {
      "click [data-playback-rate-select]": "onRateSelect",
      "click [data-playback-rate-button]": "onShowMenu",
    };
  }
  get activeContainer() {
    return this.core && this.core.activeContainer;
  }
  constructor(core) {
    Log.warn("Core Plugin is ready");
    Log.error("Core Plugin has error");

    super(core);
    this.core = core;
    this.container = this.activeContainer;
  }

  get playback() {
    return this.core.getCurrentPlayback();
  }

  bindEvents() {
    this.listenTo(
      this.core,
      Clappr.Events.CORE_ACTIVE_CONTAINER_CHANGED,
      this.onContainerChange
    );
  }

  onContainerChange() {
    this.container = this.activeContainer
    this.listenTo(
      this.core.mediaControl,
      Clappr.Events.MEDIACONTROL_CONTAINERCHANGED,
      this.reload
    );
    this.listenTo(
      this.core.mediaControl,
      Clappr.Events.MEDIACONTROL_SHOW,
      this.render
    );
    this.listenTo(
      this.core.mediaControl,
      Clappr.Events.MEDIACONTROL_HIDE,
      this.hideContextMenu
    );
    this.listenTo(
      this.playback,
      PlayerEvents.WM_VIDEO_METADATA_LOADED,
      this.onVideoMetadataLoaded
    );
  }

  // just for onboarding task
  onVideoMetadataLoaded() {
    Log.warn("::: Eu sou um evento de playback! :::");
  }

  getExternalInterface() {
    return {
      getPlaybackRate: this.getSelectedRate,
      setPlaybackRate: this.setSelectedRate,
    };
  }

  reload() {
    this.stopListening();
    this.bindEvents();
  }

  shouldRender() {
    return this.container && this.playback;
  }

  render() {
    if (!this.shouldRender()) 
      return this

    const config = this.core.options.playbackRateConfig || {};
    this.playbackRates = config.options || DEFAULT_PLAYBACK_RATES;
    this.selectedRate = config.defaultValue || DEFAULT_PLAYBACK_RATE;
    this.rateSuffix = config.rateSuffix || DEFAULT_PLAYBACK_RATE_SUFFIX;

    this.core.$el.find('video, audio').get(0).playbackRate = this.selectedRate;

    this.$el.html(
      this.template({
        playbackRates: this.playbackRates,
        title: this.getTitle(),
      })
    );

    const mediaControlLower = document.getElementsByClassName("media-control-panel__lower")[0];
    const mediaControlRight = mediaControlLower.getElementsByClassName("media-control-position__right")[0];
    mediaControlRight.insertBefore(this.el, mediaControlRight.firstChild);
    this.updateText();

    return this;
  }

  // selection of playback rate options
  onRateSelect(event) {
    event.stopPropagation();
    let rate = event.target.dataset.playbackRateSelect; // data-playback-rate-select
    this.setSelectedRate(rate);
    this.toggleContextMenu();
    return false;
  }

  onShowMenu() {
    this.toggleContextMenu();
  }

  toggleContextMenu() {
    this.$(".playback_rate ul").toggle();
  }

  hideContextMenu() {
    this.$(".playback_rate ul").hide();
  }

  toNumber(value) {
    value = Number(value);
    return isNaN(value) ? DEFAULT_PLAYBACK_RATE : value;
  }

  setSelectedRate(rate) {
    rate = this.toNumber(rate);

    this.core.$el.find('video, audio').get(0).playbackRate = rate;
    this.selectedRate = rate;

    this.core.options.playbackRateConfig = {}
    this.core.options.playbackRateConfig.defaultValue = rate;
    
    this.updateText();
  }

  getSelectedRate() {
    return this.selectedRate;
  }

  setActiveListItem(rateValue) {
    this.$("a").removeClass("active");
    this.$(`a[data-playback-rate-select="${rateValue}"]`).addClass("active");
  }

  getTitle() {
    let rate = this.selectedRate;

    for (const i in this.playbackRates) {
      if (this.playbackRates[i].value == rate)
        return this.playbackRates[i].label;
    }

    // Unknown rate formatted title
    return rate + this.rateSuffix;
  }

  updateText() {
    this.$(".playback_rate button").text(this.getTitle());
    this.setActiveListItem(this.selectedRate);
  }
}
