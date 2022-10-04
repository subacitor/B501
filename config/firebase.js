const firebase = require("firebase-admin");


var serviceAccount = require("../thuongmaidientu-1211f-firebase-adminsdk-ctezk-3cc255f0e0.json");
const defaultAppConfig = {
    apiKey: "AIzaSyDD7Y5eelmdHmAW8xEwEcmMAFdZGVDzbSE",
    authDomain: "thuongmaidientu-1211f.firebaseapp.com",
    databaseURL: "https://thuongmaidientu-1211f-default-rtdb.firebaseio.com",
    projectId: "thuongmaidientu-1211f",
    storageBucket: "thuongmaidientu-1211f.appspot.com",
    messagingSenderId: "1008396240937",
    appId: "1:1008396240937:web:c4f4819834bfbac3e37438",
    measurementId: "G-LJM6J3R796"
}
const storageBucket = "thuongmaidientu-1211f.appspot.com";

const defaultApp = firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: defaultAppConfig.databaseURL,
    serviceAccountId: '111294584117946002964@thuongmaidientu-1211f.iam.gserviceaccount.com',
    storageBucket: storageBucket
});
const storageFire = defaultApp.storage().bucket();
const firestore = defaultApp.firestore();
firestore.settings({
    timestampsInSnapshots: true,
    ignoreUndefinedProperties: true
});

const defaultAuth = defaultApp.auth();

module.exports = {
    defaultApp, firestore, defaultAuth, defaultAppConfig, storageFire
}