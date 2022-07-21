let digitDiv;
let confidenceDiv;

let canvas;

let video;

let seeFiltered = false;

async function setup() {
  canvas = createCanvas(400, 400);
  background(0);
  // let digit = await (await fetch("/getImage")).json();
  // digit = digit.map((val) => floor(val * 255));
  // const img = createImage(28, 28);
  // console.log(digit);
  // img.loadPixels();
  // for (let i = 0; i < 784; i++) {
  //   const bright = digit[i];
  //   img.pixels[i * 4] = bright;
  //   img.pixels[i * 4 + 1] = bright;
  //   img.pixels[i * 4 + 2] = bright;
  //   img.pixels[i * 4 + 3] = 255;
  // }
  // img.updatePixels();

  // image(img, 0, 0, width, height);
  //createButton("predict").mousePressed(predict);

  digitDiv = createDiv("Drawing: ");
  confidenceDiv = createDiv("Confidence: ");

  video = createCapture(VIDEO);
  video.hide();

  predict();
}

async function predict() {
  const xs = [];

  const img = get();
  img.resize(28, 28);
  if (!seeFiltered) img.filter(THRESHOLD, 0.4);
  img.loadPixels();
  for (let i = 0; i < 784; i++) {
    const bright = abs(
      (+img.pixels.reduce((acc, val) => acc + +val < 255 / 2) <
        img.pixels.length / 2) *
        255 -
        img.pixels[i * 4]
    );
    //console.log(bright);
    xs.push(bright / 255);
  }
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(xs),
  };

  const result = await fetch("/predictImage", options);
  const json = await result.json();

  //console.log(json);

  digitDiv.html(`Drawing: ${json[0].digit}`);
  confidenceDiv.html(`Confidence: ${nf(json[0].confidence * 100, 2, 2)}%`);

  predict();
}

function draw() {
  image(video, 0, 0, width, height);
  if (seeFiltered) filter(THRESHOLD, 0.4);
}
