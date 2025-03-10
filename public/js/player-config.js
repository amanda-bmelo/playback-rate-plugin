function onPlayerAvailable() {
  var player = new WM.Player({
    videosIDs: '5964532',
    plugins: {
      core: [PlaybackRatePlugin()]
    },
    width: '100%',
    height: '100%',
    startMuted: true,
    autoPlay: true,
    skipDFP: true
  });

  player.attachTo(document.querySelector('#player'));
}

WM.playerAvailable.then(onPlayerAvailable)
