document.addEventListener('DOMContentLoaded', function () {
  window.activeHospital = null;
  window.hospitals = [];
  window.hospitalCounts = [];
  window.markers = [];
  window.paramedic = false;

  initFirebase();
  initMap();

  const $btn = $('<a>')
    .attr('id', 'switch')
    .addClass('button small is-outlined')
    .append('<i class="fas fa-ambulance"></i>')
    .click(function () {
      $('body')[paramedic ? 'removeClass' : 'addClass']('paramedic');
      $('#sidebar')[paramedic ? 'removeClass' : 'addClass']('columns is-multiline');
      paramedic = !paramedic;
      $(this).html(`<i class="fas fa-${paramedic ? 'user' : 'ambulance'}"></i>`);
      redrawSidebar();
    });
  $('.columns').append($btn);
});

document.addEventListener('ready', function () {
  window.scrollTo(0, 0);
});
