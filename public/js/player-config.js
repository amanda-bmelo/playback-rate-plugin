function onPlayerAvailable() {
  var player = new WM.Player({
    videosIDs: '9877957',
    token: '145c186a1572af2490412c917fc472188386536784f47454e734852423674626435616d52435168446c53676a4c52757956527377615054754d3038415759706b694a6831537938707744724548537762496452633452616e444934483148452d386a6a394f773d3d3a303a75766a6476616964636d337a6435766569357a67',
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
