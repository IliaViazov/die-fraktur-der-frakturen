window.startSynthesis = async function(appState) {
  const input = appState.input;
  const params = appState.params;

  await Tone.start();

  const fft = new Tone.FFT({ size: 32, smoothing: 10.0 });
  Tone.Destination.connect(fft);

  const reverb = new Tone.Reverb();
  const distortion = new Tone.Distortion(0.8);
  const crusher = new Tone.BitCrusher(4);
  const eq = new Tone.EQ3({ low: 0 });
  const limiter = new Tone.Limiter(-20).toDestination();
  const pitchshift = new Tone.PitchShift();
  const feedbackDelay = new Tone.FeedbackDelay(0.001, 0.9);
  const tremolo = new Tone.Tremolo(1000, 1);

  distortion.connect(reverb);
  crusher.connect(reverb);
  reverb.connect(eq);
  eq.connect(limiter);

  function makeVoice(randomOffset) {
    const fmOsc = new Tone.FMOscillator({
      frequency: 0,
      type: "sine",
      modulationType: "sine",
      harmonicity: 2 + randomOffset * 0.5,
      modulationIndex: 10,
      volume: -60,
    }).connect(feedbackDelay);

    feedbackDelay.connect(pitchshift);
    pitchshift.connect(distortion);

    const fmOsc2 = new Tone.FMOscillator({
      frequency: 10 + randomOffset * 2,
      type: "triangle",
      modulationType: "triangle",
      harmonicity: 2.5 + randomOffset * 0.3,
      modulationIndex: 6 + randomOffset * 4,
      volume: -100,
    }).connect(distortion);

    const fmOsc3 = new Tone.FMOscillator({
      frequency: 1000 + randomOffset * 500,
      type: "square",
      modulationType: "square",
      harmonicity: 1.01 + randomOffset * 0.05,
      modulationIndex: 1000,
      volume: -100,
    }).connect(tremolo);
    tremolo.connect(distortion);

    fmOsc.start();
    fmOsc2.start();
    fmOsc3.start();

    return { fmOsc, fmOsc2, fmOsc3, feedbackDelay, tremolo };
  }

  const vA = makeVoice(Math.random());
  const vB = makeVoice(Math.random());

  function mapVelocityToVolume(velocity) {
    return Math.max(-30, Math.min(-15, -30 + 15 * (velocity / 2000)));
  }

  function updateSynth() {
    const xA = input.voiceAX;
    const yA = input.voiceAY;
    const xB = input.voiceBX;
    const yB = input.voiceBY;
    const xSpawnA = input.spawnAX;
    const ySpawnA = input.spawnAY;
    const xSpawnB = input.spawnBX;
    const ySpawnB = input.spawnBY;
    const velocity = input.velocity;
    const mappedVol = mapVelocityToVolume(velocity);

    vA.fmOsc.frequency.value = xA * 25;
    vA.fmOsc.modulationIndex.value = (1 - yA) * 30;
    vA.fmOsc2.frequency.value = xA * 20;
    vA.fmOsc2.harmonicity.value = 1 + yA * 9;
    vA.fmOsc.volume.value = mappedVol;

    vB.fmOsc.frequency.value = xB * 25;
    vB.fmOsc.modulationIndex.value = (1 - yB) * 30;
    vB.fmOsc2.frequency.value = xB * 20;
    vB.fmOsc2.harmonicity.value = 1 + yB * 9;
    vB.fmOsc.volume.value = mappedVol;

    const spawnA = input.activeTouches >= 5;
    const spawnB = input.activeTouches >= 6;

    if (spawnA) {
      const baseA = 250 + xSpawnA * 750;
      const octaveA = Math.pow(2, -Math.max(0, Math.min(4, input.activeTouches - 5)));
      vA.fmOsc3.frequency.value = baseA * octaveA;
      vA.fmOsc3.modulationIndex.value = 1000 + Math.random() * 300 + 1000 * Math.sin(performance.now() / 1000) + 500 * (1 - xSpawnA);
      vA.fmOsc3.harmonicity.value = Math.random() * 0.1 + 1.01 + 0.2 * ySpawnA;
      vA.fmOsc3.volume.rampTo(-20, 0.05);
    } else {
      vA.fmOsc3.volume.rampTo(-100, 0.1);
    }

    if (spawnB) {
      const baseB = 250 + xSpawnB * 750;
      const octaveB = Math.pow(2, -Math.max(0, Math.min(4, input.activeTouches - 6)));
      vB.fmOsc3.frequency.value = baseB * octaveB;
      vB.fmOsc3.modulationIndex.value = 1000 + Math.random() * 300 + 1000 * Math.sin(performance.now() / 1000) + 500 * (1 - xSpawnB);
      vB.fmOsc3.harmonicity.value = Math.random() * 0.1 + 1.01 + 0.2 * ySpawnB;
      vB.fmOsc3.volume.rampTo(-20, 0.05);
    } else {
      vB.fmOsc3.volume.rampTo(-100, 0.1);
    }
  }

  setTimeout(() => {
    vA.fmOsc2.volume.exponentialRampTo(-35, 2.5);
  }, 0);

  setTimeout(() => {
    vB.fmOsc2.volume.exponentialRampTo(-35, 2.5);
  }, 1200);

  function droneDrift(voice) {
    setInterval(() => {
      voice.fmOsc2.frequency.rampTo(10 + Math.random() * 2, 10.0);
      voice.fmOsc2.modulationIndex.rampTo(10 + Math.random() * 30, 10.0);
      voice.fmOsc2.harmonicity.rampTo(1.5 + Math.random() * 1, 10.0);
    }, 10000);
  }

  droneDrift(vA);
  setTimeout(() => droneDrift(vB), 5000);

  setInterval(() => {
    updateSynth();
    const t = performance.now() / 1000;

    const newDelayA = (Math.sin(t * 2) * Math.random() + 1) * 0.0002;
    const newFeedbackA = Math.random() * 0.1 + 0.9;
    let newHarmA = vA.fmOsc.harmonicity.value;
    newHarmA += Math.random() >= 0.5 ? Math.random() : -Math.random();
    vA.feedbackDelay.delayTime.rampTo(newDelayA, 0.1);
    vA.feedbackDelay.feedback.rampTo(newFeedbackA, 0.1);
    vA.fmOsc.harmonicity.rampTo(newHarmA, 0.1);
    vA.tremolo.frequency.rampTo(1000 + input.xA * Math.sin(500 * t) * 300, 0.1);

    const newDelayB = (Math.sin(t * 1.7) * Math.random() + 1) * 0.0002;
    const newFeedbackB = Math.random() * 0.1 + 0.9;
    let newHarmB = vB.fmOsc.harmonicity.value;
    newHarmB += Math.random() >= 0.5 ? Math.random() : -Math.random();
    vB.feedbackDelay.delayTime.rampTo(newDelayB, 0.1);
    vB.feedbackDelay.feedback.rampTo(newFeedbackB, 0.1);
    vB.fmOsc.harmonicity.rampTo(newHarmB, 0.1);
    vB.tremolo.frequency.rampTo(1000 + input.yA * Math.sin(300 * t) * 300, 0.1);

    eq.low.rampTo(input.yA * 12.0, 0.1);
  }, 100);
};
