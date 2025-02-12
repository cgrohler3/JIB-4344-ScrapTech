import { functions } from "../lib/firebaseConfig"

exports.updateZipcodes = functions.firestore
    .document("donations/{docId}")
    .onWrite((change, context) => {
        console.log(change, context)
    })