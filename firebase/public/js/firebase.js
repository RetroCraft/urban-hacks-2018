function initFirebase() {
  try {
    let app = firebase.app();
    let hospitals = firebase.firestore().collection('hospitals');
    hospitals.onSnapshot(function(snapshot) {  
      snapshot.docChanges().forEach(function(change) {
        const data = change.doc.data();
        window.hospitalCounts[change.doc.id] = data;
      });
      redrawSidebar();
    });
  } catch (e) {
    console.error(e);
  }
}