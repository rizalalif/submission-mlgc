const { Firestore } = require("@google-cloud/firestore");

async function storeData(id, data) {
  const db = new Firestore();

  const predictsCollection = db.collection("predictions");
  return predictsCollection.doc(id).set(data);
}


module.exports = storeData;
