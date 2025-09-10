const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // download from Firebase

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
 storageBucket: "governmentfile.appspot.com"
});

const bucket = admin.storage().bucket();
module.exports = bucket;
