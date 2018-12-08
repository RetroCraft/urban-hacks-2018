import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const hospitals = db.collection("hospitals");

export const updateBed = functions.https.onRequest((req, res) => {
  const { hospitalId, occupied } = req.query;

  if (!hospitalId || !occupied) {
    res.status(400).send("Missing parameters");
    return;
  }

  const hospital = hospitals.doc(hospitalId);
  db.runTransaction(t => {
    return hospital.get().then(doc => {
      // Add one person to beds
      if (!hospital.id) {
        throw new Error("Hospital does not exist");
      }
      const newBeds = +doc.data().beds + (!!+occupied ? -1 : 1);
      t.update(hospital, { beds: newBeds });
      return newBeds;
    });
  })
    .then(newBeds => {
      res.send("New capacity: " + newBeds);
    })
    .catch(err => {
      res.send("Transaction failure: " + err);
    });
});
