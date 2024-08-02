const admin = require('firebase-admin');
const serviceAccount = require('./path/to/your/serviceAccountKey.json'); // 更新為您的服務帳戶金鑰文件路徑

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://<YOUR_PROJECT_ID>.firebaseio.com' // 更新為您的專案ID
});

const db = admin.firestore();

module.exports = db;
