function onPlayerAvailable() {
  var player = new WM.Player({
    videosIDs: '5964122',
    plugins: [PlaybackRatePlugin()],
    width: '100%',
    height: '100%',
    startMuted: true,
    autoPlay: true
  });

  player.attachTo(document.querySelector('#player'));
}

WM.playerAvailable.then(onPlayerAvailable)
