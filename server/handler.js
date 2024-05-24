const predictClassification = require("../services/inferenceService");
const storeData = require('../services/storeData');
const { Firestore } = require("@google-cloud/firestore");

const crypto = require('crypto');

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  const { result, suggestion } =
    await predictClassification(model, image);

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();


  const data = {
    "id": id,
    "result": result,
    "suggestion": suggestion,
    "createdAt": createdAt
  }

  await storeData(id, data)

  const response = h.response({
    status: 'success',
    message: 'Model is predicted successfully',
    data
  })
  response.code(201);
  return response;
}
async function getHistory(request, h) {
  const db = new Firestore();
  const getAll = await db.collection('predictions').get();
  const documents = [];
  getAll.forEach(doc => {
    const document = {id: doc.data().id, history: doc.data() };
    documents.push(document);
  }
  )

  const response = h.response({
    status:'success',
    data: documents
  })
  return response;
  // const doc =  getAll.listDocuments()

  // doc.forEach(col => {
  //   return col.id
  // })
  // try {
  //   const predictionCollections = await getAll.listCollections;
  //   return predictionCollections;
  // } catch (error) {
  //   const response = h.response({
  //     status: 'fail',
  //     message: error.message

  //   });
  //   response.code(404);
  //   return response;
  // }
  // console.log(getAll);


}

module.exports = { postPredictHandler, getHistory };
