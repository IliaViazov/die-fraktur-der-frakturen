window.initHydraVisuals = function(appState) {
  const input = appState.input;
  const params = appState.params;

  const canvas = document.getElementById("myCanvas");
  const dpr = window.devicePixelRatio || 1;

  const hydra = new Hydra({
    canvas: canvas,
    detectAudio: false,
  });

  function resize() {
    input.width = window.innerWidth;
    input.height = window.innerHeight;
    
    // Set canvas CSS size
    canvas.style.width = input.width + "px";
    canvas.style.height = input.height + "px";
    
    // Set actual canvas resolution for sharp rendering
    canvas.width = input.width * dpr;
    canvas.height = input.height * dpr;
    
    // Scale the drawing context to match device pixel ratio
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
    
    setResolution(input.width * dpr, input.height * dpr);
  }

  resize();
  window.addEventListener("resize", resize);

  const s0 = voronoi(
    () => 10 + params.a1 * 5,
    () => input.voiceAX / 200 + 0.5,
    () => input.voiceAY * -5
  )
    .modulate(o0, () => 0.03 + params.a2 * 0.1)
    .mult(src(o0).modulateRotate(voronoi(() => 20 + params.a3 * 5).color(() => 1, () => 2, () => 3).r()), 0.1)
    .modulateScrollX(src(o0).scrollX(() => input.voiceAX / 10), () => 0.03 + params.a5 * 0.1)
    .thresh(() => 0.5 + params.a6 * 0.1)
    .color(() => 1, () => 0.9 + params.a7 * 0.01, () => 0.9 + params.a8 * 0.01);

  const s1 = voronoi(
    () => 3 + params.a9 * 5,
    () => input.voiceAX / 200 + 0.5,
    () => input.voiceAY * -5
  )
    .modulateRotate(o0, () => {
      const clickMod = input.press ? input.triggerScale : 0;
      return 0.03 + input.trigger * Math.sin(time / 10) * clickMod * 0.5 + Math.random() * 0.001;
    })
    .mult(src(o0).modulateRotate(voronoi(() => 20 + params.a10).color(() => 1, () => 2, () => 3).r()), () => 0.2 + params.a11 * 0.01)
    .modulateScrollX(src(o0).scrollX(() => input.voiceAX / 10), () => 0.03)
    .modulate(shape().repeat(() => 20 + params.a12 * 5).modulateScrollX(noise(() => 100)))
    .thresh(() => 0.5 + params.a13 * 0.1)
    .color(() => 1, () => 0.9 + params.a15 * 0.01, () => 0.85 + params.a16 * 0.1)
    .modulate(src(o0).repeat(() => input.voiceAX / 200 + 2), () => 0.2);

  const s2 = voronoi(
    () => 20 + params.a17 * 5,
    () => input.voiceBX / 200 + 0.5,
    () => input.voiceBY * -5
  )
    .modulate(o0, () => 0.06 + params.a18 * 0.1)
    .mult(src(o0).modulateRotate(voronoi(() => 10 + params.a19 * 5)), () => 0.2 + params.a20 * 0.1)
    .modulateScrollX(src(o0).scrollX(() => input.voiceBX / 10), () => 0.3 + params.a21 * 0.1)
    .thresh(() => 0.5 + params.a22 * 0.1);

  const s3 = voronoi(
    () => 30 + params.a23 * 5,
    () => input.voiceBX / 300 + 0.5,
    () => input.voiceBY * -5
  )
    .modulate(o0, () => 0.08 + params.a24 * 0.21)
    .mult(src(o0).modulateRotate(voronoi(() => 20 + params.a25 * 5)), () => 0.3 + params.a26 * 0.4)
    .modulateScrollX(src(o0).scrollX(() => input.voiceBX / 30), () => 0.5 + params.a27 * 0.2)
    .thresh(() => 0.5 + params.a28 * 0.1)
    .r()
    .brightness(() => Math.sin(time * (params.a29 + 1) * 70 * Math.random() * 30 * (input.spawnAY / 2 + 0.5)) * 0.03 * (input.spawnAX / 2 + 0.5));

  function getClickMod() {
    return input.press ? input.triggerScale : 0;
  }

  if (0.0 < params.kubik && params.kubik <= 1.0) {
    s0
      .blend(s1, () => input.xA / (2 * params.i1))
      .blend(s2, () => input.yA / (2 * params.i2))
      .add(s3, getClickMod)
      .brightness(() => Math.min((time - 10) * 0.1, 0))
      .out();
  } else if (1.0 < params.kubik && params.kubik <= 2.0) {
    s0
      .blend(s2, () => input.xA / (2 * params.i1))
      .blend(s1, () => input.yA / (2 * params.i2))
      .sub(s3, getClickMod)
      .brightness(() => Math.min((time - 10) * 0.1, 0))
      .out();
  } else if (2.0 < params.kubik && params.kubik <= 3.0) {
    s1
      .blend(s0, () => input.xA / (2 * params.i1))
      .blend(s2, () => input.yA / (2 * params.i2))
      .mult(s3, getClickMod)
      .brightness(() => Math.min((time - 10) * 0.1, 0))
      .out();
  } else if (3.0 < params.kubik && params.kubik <= 4.0) {
    s1
      .blend(s2, () => input.xA / (2 * params.i1))
      .blend(s0, () => input.yA / (2 * params.i2))
      .add(s3, getClickMod)
      .brightness(() => Math.min((time - 10) * 0.1, 0))
      .out();
  } else if (4.0 < params.kubik && params.kubik <= 5.0) {
    s2
      .blend(s0, () => input.xA / (2 * params.i1))
      .blend(s1, () => input.yA / (2 * params.i2))
      .sub(s3, getClickMod)
      .brightness(() => Math.min((time - 10) * 0.1, 0))
      .out();
  } else if (5.0 < params.kubik && params.kubik <= 6.0) {
    s2
      .blend(s1, () => input.xA / (2 * params.i1))
      .blend(s0, () => input.yA / (2 * params.i2))
      .mult(s3, getClickMod)
      .brightness(() => Math.min((time - 10) * 0.1, 0))
      .out();
  }
};
