const tf = require("@tensorflow/tfjs-node");
const InputError = require("../exceptions/InputError");

async function predictClassification(model, image) {
  try {
    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat();

    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const confidence = Math.max(...score) * 100;

    const classResult = tf.argMax(prediction, 1).dataSync()[0];

    let result, suggestion;
    if (confidence > 50) {
      result = 'Cancer'
      suggestion = 'Segera periksa ke dokter!'
    } else {
      result = 'Non-cancer'
      suggestion = 'Anda sehat!'


    }

    return { result, suggestion };
  } catch (error) {
    throw new InputError("Terjadi kesalahan dalam melakukan prediksi");
  }
}


module.exports = predictClassification;
