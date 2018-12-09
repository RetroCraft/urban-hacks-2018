function initMap() {
  // Initialize the platform object:
  var platform = new H.service.Platform({
    'app_id': 'qcgWR8aU7oPofNNf8V62',
    'app_code': 'n1fzJoqHzGHB3NxdcxJpFA'
  });

  var pixelRatio = window.devicePixelRatio || 1;
  var defaultLayers = platform.createDefaultLayers({
    tileSize: pixelRatio === 1 ? 256 : 512,
    ppi: pixelRatio === 1 ? undefined : 320
  });

  var map = new H.Map($('#mapContainer')[0], defaultLayers.normal.map, { pixelRatio: pixelRatio });
  var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
  var ui = H.ui.UI.createDefault(map, defaultLayers);

  resetMap(map, { lat: 43.24264989622573, lng: -79.8437745024414 });
  restrictMap(map, 43.279297, -79.937526, 43.216140, -79.759902, 13);

  loadHospitals().then(hospitals => {
    window.hospitals = hospitals;

    const markers = new H.map.Group();
    map.addObject(markers);

    markers.addEventListener('tap', function (evt) {
      const hospital = evt.target.getData();
      window.activeHospital = hospital.objectid;
      redrawSidebar();
    }, false);

    hospitals.forEach(hospital => {
      const marker = new H.map.Marker(
        { lat: hospital.latitude, lng: hospital.longitude },
        { icon: generateIcon('#18D') }
      );
      marker.setData(hospital);
      markers.addObject(marker);
    });

    window.markers = markers;
    window.initSidebar();
  });

  window.map = map;
}

function resetMap(map, coords) {
  map.setCenter(coords);
  map.setZoom(13);
}

function loadHospitals() {
  return new Promise((resolve, reject) => {
    $.ajax('data/hospitals.csv').done((response) => {
      const hospitals = [];
      const rows = response.split(/\r?\n/);
      const columns = rows[0].split(',');
      for (const line of rows.slice(1, -1)) {
        const hospital = {};
        const values = line.split(',');
        for (let i = 0; i < values.length; i++) {
          hospital[columns[i].toLowerCase()] = values[i];
        }
        hospitals.push(hospital);
      }
      resolve(hospitals);
    })
  })
}

function restrictMap(map, lat1, long1, lat2, long2, minZoom) {
  var bounds = new H.geo.Rect(lat1, long1, lat2, long2);

  map.getViewModel().addEventListener('sync', function () {
    var center = map.getCenter();
    if (!bounds.containsPoint(center)) {
      if (center.lat > bounds.getTop()) {
        center.lat = bounds.getTop();
      } else if (center.lat < bounds.getBottom()) {
        center.lat = bounds.getBottom();
      }
      if (center.lng < bounds.getLeft()) {
        center.lng = bounds.getLeft();
      } else if (center.lng > bounds.getRight()) {
        center.lng = bounds.getRight();
      }
      map.setCenter(center);
    }
    var zoom = map.getZoom();
    if (zoom < minZoom) {
      map.setZoom(minZoom)
    }
  });

  //Debug code to visualize where your restriction is
  // map.addObject(new H.map.Rect(bounds, {
  // 	style: {
  // 		fillColor: 'rgba(55, 85, 170, 0.1)',
  // 		strokeColor: 'rgba(55, 85, 170, 0.6)',
  // 		lineWidth: 8
  // 	}
  // }
  // ));
}

function generateIcon(color) {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="28px" height="36px">' +
    '<path d="M 19 31 C 19 32.7 16.3 34 13 34 C 9.7 34 7 32.7 7 31 C 7 29.3 9.7 ' +
    '28 13 28 C 16.3 28 19 29.3 19 31 Z" fill="#000" fill-opacity=".2"></path>' +
    '<path d="M 13 0 C 9.5 0 6.3 1.3 3.8 3.8 C 1.4 7.8 0 9.4 0 12.8 C 0 16.3 1.4 ' +
    '19.5 3.8 21.9 L 13 31 L 22.2 21.9 C 24.6 19.5 25.9 16.3 25.9 12.8 C 25.9 9.4 24.6 ' +
    '6.1 22.1 3.8 C 19.7 1.3 16.5 0 13 0 Z" fill="#fff"></path>' +
    '<path d="M 13 2.2 C 6 2.2 2.3 7.2 2.1 12.8 C 2.1 16.1 3.1 18.4 5.2 20.5 L ' +
    '13 28.2 L 20.8 20.5 C 22.9 18.4 23.8 16.2 23.8 12.8 C 23.6 7.07 20 2.2 ' +
    `13 2.2 Z" fill="${color}"></path></svg>`;
  return new H.map.Icon(svg);
}