function initSidebar() {
  redrawSidebar();
}

function redrawSidebar() {
  const $sidebar = $('#sidebar');
  $sidebar.empty();

  hospitals.sort((a, b) => {
    const afirebaseData = window.hospitalCounts[a.objectid] || {};
    const bfirebaseData = window.hospitalCounts[b.objectid] || {};
    const aPercent = afirebaseData.beds / afirebaseData.maxbeds;
    const bPercent = bfirebaseData.beds / bfirebaseData.maxbeds;
    
    if (aPercent < bPercent) return 1;
    if (aPercent > bPercent) return -1;
    return 0;
  }).forEach(hospital => {
    const $block = $('<div>');

    const firebaseData = window.hospitalCounts[hospital.objectid];
    if (!firebaseData) return;
    const $progress = $('<progress>');

    $progress
      .addClass('progress is-small is-primary is-marginless')
      .attr('value', firebaseData.beds)
      .attr('max', firebaseData.maxbeds);

    $block
      .addClass('box hospital')
      .attr('id', `${hospital.objectid}-box`)
      .append(`<strong>${hospital.name}</strong>`)
      .append($progress)
      .append(`<small class="beds">${firebaseData.beds}/${firebaseData.maxbeds}</small>`)
      .mouseover(function () {
        $sidebar.addClass('faded');
        $(this).addClass('hover');
      })
      .mouseout(function () {
        $('.hospital').removeClass('hover');
      })
      .click(function () {
        activeHospital = hospital.objectid;
        $('.hospital').removeClass('active');
        redrawSidebar();
      });

    if (hospital.objectid === activeHospital || paramedic) {
      $sidebar.addClass('faded');
      $block
        .addClass('active')
        .append(`
          <p><small>
            ${hospital.address}<br>
            ${hospital.phone}
          </small></p>
        `);

      resetMap(window.map, { lat: hospital.latitude, lng: hospital.longitude });
      window.markers.forEach((marker => {
        if (marker.getData() && marker.getData().objectid === window.activeHospital) {
          marker.setIcon(generateIcon('#f00'));
        } else {
          marker.setIcon(generateIcon('#18d'));
        }
      }))
    }
    if (paramedic) {
      $col = $('<div class="column is-4">');
      $col.append($block);
      $sidebar.append($col);
    } else {
      $sidebar.append($block);
    }
  });

  if ($('.active')[0]) {
    $('.active')[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}