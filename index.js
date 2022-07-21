import * as tf from "@tensorflow/tfjs-node-gpu";
import * as fs from "fs/promises";
import * as env from "dotenv";
env.config();
//import fetch from "node-fetch";
import express from "express";

const app = express();

const len = 784;
const totalData = 100000;

const classes = [
  {
    name: "bird",
    oneHot: [1, 0, 0, 0, 0, 0, 0],
  },
  {
    name: "car",
    oneHot: [0, 1, 0, 0, 0, 0, 0],
  },
  {
    name: "cat",
    oneHot: [0, 0, 1, 0, 0, 0, 0],
  },
  {
    name: "horse",
    oneHot: [0, 0, 0, 1, 0, 0, 0],
  },
  {
    name: "rainbow",
    oneHot: [0, 0, 0, 0, 1, 0, 0],
  },
  {
    name: "tiger",
    oneHot: [0, 0, 0, 0, 0, 1, 0],
  },
  {
    name: "whale",
    oneHot: [0, 0, 0, 0, 0, 0, 1],
  },
];

let testing = [];
let training = [];

//const set = mnist.set(10000, 2000);

let model;

(async () => {
  model = await tf.loadLayersModel("file://./model/model.json");
})();

// async function train(model, x_train, y_train) {
//   await model.fit(x_train, y_train, {
//     epochs: 300,
//     batchSize: 64,
//     shuffle: true,
//     validationSplit: 0.1,
//     verbose: true,
//   });
// }

// async function test(model, x_test, y_test) {
//   y_test = await y_test.array();
//   const raw = model.predict(x_test);
//   const output = await raw.array();
//   const total = output.length;
//   //console.log(total);
//   const sum = output.reduce((acc, val, i) => {
//     const index = val.indexOf(val.reduce((prev, now) => Math.max(prev, now)));
//     //console.log(y_test[i][digit]);
//     return y_test[i][index] == 1 ? acc + 1 : acc;
//   }, 0);
//   console.log(Math.floor((sum / total) * 100));
// }

app.listen(process.env.PORT, () => console.log("listening yayayyayayayayay"));

app.use(express.static("public"));
app.use(express.json({ limit: "5mb" }));

// app.get("/getImage", (req, res) => {
//   const digit = mnist[Math.floor(Math.random() * 10)].get();
//   res.send(digit);
// });

app.post("/predictImage", async (req, res) => {
  const input_arr = req.body;
  const xs = tf.tensor(input_arr, [1, 28, 28, 1]);
  const output = model.predict(xs);
  const ys = (await output.array())[0];
  xs.dispose();
  output.dispose();
  const json = [];
  for (let i = 0; i < ys.length; i++) {
    json.push({
      digit: classes[i].name,
      confidence: ys[i],
    });
  }
  json.sort((a, b) => b.confidence - a.confidence);
  //console.log(tf.memory().numTensors);
  res.send(json);
});
(async () => {
  await (async () => {
    const files = await fs.readdir("./dataset");

    const trainingLength = Math.floor(totalData * 0.8);
    const testingLength = totalData - trainingLength;
    const trainingDataPerClass = Math.floor(trainingLength / classes.length);
    const testingDataPerClass = Math.floor(testingLength / classes.length);

    for (let i = 0; i < classes.length; i++) {
      const obj = classes[i];
      const file = files[i];
      const data = await fs.readFile(`./dataset/${file}`);
      const arr = new Float32Array(data);
      // const trainingData = arr.subarray(0, trainingDataPerClass);
      // const testingData = arr.subarray(
      //   trainingDataPerClass,
      //   testingDataPerClass
      // );
      for (let i = 0; i < trainingDataPerClass; i++) {
        const offset = i * len;
        training.push({
          input: arr.subarray(offset, offset + len).map((val) => val / 255),
          output: obj.oneHot,
        });
      }

      for (let i = 0; i < testingDataPerClass; i++) {
        const offset = i * len;
        testing.push({
          input: arr.subarray(offset, offset + len).map((val) => val / 255),
          output: obj.oneHot,
        });
      }

      // for (let i = 0; i < totalData; i++) {
      //   //console.log(i);
      //   const offset = i * len;
      //   const threshold = Math.floor(totalData * 0.8);
      //   if (i < threshold) {
      //     training.push({
      //       input: arr.subarray(offset, offset + len).map((val) => val / 255),
      //       output: obj.oneHot,
      //     });
      //     continue;
      //   }
      //   testing.push({
      //     input: arr.subarray(offset, offset + len).map((val) => val / 255),
      //     output: obj.oneHot,
      //   });
      // }
    }
  })();
  //console.log(training, testing);
  // const model = tf.sequential();

  // model.add(
  //   tf.layers.conv2d({
  //     filters: 8,
  //     inputShape: [28, 28, 1],
  //     kernelSize: 5,
  //     kernelInitializer: "varianceScaling",
  //     activation: "relu",
  //   })
  // );
  // // model.add(
  // //   tf.layers.dropout({
  // //     rate: 0.2,
  // //   })
  // // );
  // model.add(
  //   tf.layers.maxPooling2d({
  //     poolSize: [2, 2],
  //     strides: [2, 2],
  //   })
  // );
  // // model.add(
  // //   tf.layers.dropout({
  // //     rate: 0.2,
  // //   })
  // // );
  // model.add(
  //   tf.layers.conv2d({
  //     filters: 16,
  //     kernelSize: 5,
  //     kernelInitializer: "varianceScaling",
  //     activation: "relu",
  //   })
  // );
  // // model.add(
  // //   tf.layers.dropout({
  // //     rate: 0.2,
  // //   })
  // // );
  // model.add(
  //   tf.layers.maxPooling2d({
  //     poolSize: [2, 2],
  //     strides: [2, 2],
  //   })
  // );
  // model.add(tf.layers.flatten());
  // model.add(
  //   tf.layers.dense({
  //     units: 512,
  //     kernelInitializer: "varianceScaling",
  //     activation: "relu",
  //   })
  // );

  // model.add(
  //   tf.layers.dropout({
  //     rate: 0.2,
  //   })
  // );

  // model.add(
  //   tf.layers.dense({
  //     units: 512,
  //     kernelInitializer: "varianceScaling",
  //     activation: "relu",
  //   })
  // );

  // model.add(
  //   tf.layers.dropout({
  //     rate: 0.2,
  //   })
  // );
  // // model.add(
  // //   tf.layers.dense({
  // //     units: 512,
  // //     kernelInitializer: "varianceScaling",
  // //     activation: "relu",
  // //   })
  // // );

  // // model.add(
  // //   tf.layers.dropout({
  // //     rate: 0.2,
  // //   })
  // // );
  // // model.add(
  // //   tf.layers.dense({
  // //     units: 512,
  // //     kernelInitializer: "varianceScaling",
  // //     activation: "relu",
  // //   })
  // // );

  // // model.add(
  // //   tf.layers.dropout({
  // //     rate: 0.2,
  // //   })
  // // );

  // model.add(
  //   tf.layers.dense({
  //     units: classes.length,
  //     kernelInitializer: "varianceScaling",
  //     activation: "softmax",
  //   })
  // );

  // const optimizer = tf.train.sgd(0.02, 1e-1);
  // model.compile({
  //   optimizer,
  //   loss: "categoricalCrossentropy",
  //   metrics: ["accuracy"],
  // });

  // //model.summary();

  // let x_train = [];
  // let y_train = [];
  // let x_test = [];
  // let y_test = [];

  // console.log(training[0].input.length, testing[0].input.length);
  // for (const sample of training) {
  //   x_train.push(sample.input);
  //   y_train.push(sample.output);
  // }

  // for (const sample of testing) {
  //   x_test.push(sample.input);
  //   y_test.push(sample.output);
  // }

  // x_train = tf.tensor(x_train, [x_train.length, 28, 28, 1]);
  // y_train = tf.tensor2d(y_train);
  // x_test = tf.tensor(x_test, [x_test.length, 28, 28, 1]);
  // y_test = tf.tensor2d(y_test);

  // console.log(x_train.shape, y_train.shape);
  // console.log(x_test.shape, y_test.shape);
  // train(model, x_train, y_train).then(async () => {
  //   await test(model, x_test, y_test);
  //   await model.save("file://./model");
  //   console.log("saved model");
  // });
})();
