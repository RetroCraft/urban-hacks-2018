document.addEventListener('DOMContentLoaded', function() {
// // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
// // The Firebase SDK is initialized and available here!
//
// firebase.auth().onAuthStateChanged(user => { });
// firebase.database().ref('/path/to/ref').on('value', snapshot => { });
// firebase.messaging().requestPermission().then(() => { });
// firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
//
// // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

  try {
    let app = firebase.app();
    let features = ['auth', 'firestore', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');   // doshit

    let hospitals = firebase.firestore().collection('hospitals');
    hospitals.onSnapshot(function(snapshot) {  
      snapshot.docChanges().forEach(function(change) {
        document.getElementById('beds').innerHTML = change.doc.data().beds;
      });
    });
  } catch (e) {
    console.error(e);
  }


  // Initialize the platform object:
  var platform = new H.service.Platform({
    'app_id': 'qcgWR8aU7oPofNNf8V62',
    'app_code': 'n1fzJoqHzGHB3NxdcxJpFA'
  });

  function moveMapToBerlin(map) {
    map.setCenter({lat:43.258904, lng:-79.870897});
    map.setZoom(12);
  }
  
  var pixelRatio = window.devicePixelRatio || 1;
  var defaultLayers = platform.createDefaultLayers({
    tileSize: pixelRatio === 1 ? 256 : 512,
    ppi: pixelRatio === 1 ? undefined : 320
  });
  
  //Step 2: initialize a map  - not specificing a location will give a whole world view.
  var map = new H.Map(document.getElementById('mapContainer'),
    defaultLayers.normal.map, {pixelRatio: pixelRatio});
  
  //Step 3: make the map interactive
  // MapEvents enables the event system
  // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
  var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
  
  // Create the default UI components
  var ui = H.ui.UI.createDefault(map, defaultLayers);
  
  // Now use the map as required...
  moveMapToBerlin(map);
});
