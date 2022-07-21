let digitDiv;
let confidenceDiv;

let canvas;

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
  createButton("reset").mousePressed(() => background(0));
  //createButton("predict").mousePressed(predict);

  digitDiv = createDiv("Drawing: ");
  confidenceDiv = createDiv("Confidence: ");

  predict();
}

async function predict() {
  const xs = [];

  const img = get();
  img.resize(28, 28);
  img.loadPixels();
  for (let i = 0; i < 784; i++) {
    const bright = img.pixels[i * 4];
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
  if (mouseIsPressed && mouseX < width && mouseY < height) {
    stroke(255);
    strokeWeight(8);
    line(mouseX, mouseY, pmouseX, pmouseY);
  }
}
