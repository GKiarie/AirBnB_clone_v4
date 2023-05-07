// api status indication

$('document').ready(function () {
  const dictAmenities = {};
  $('input[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
      dictAmenities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete dictAmenities[$(this).attr('data-id')];
    }
    $('.amenities h4').text(Object.values(dictAmenities).join(', '));
  });

  $.ajax({
    url: 'http://24272da151a2.115532cb.alx-cod.online:5001/api/v1/status/',
    type: 'GET'
  }).done(function (response) {
    if (response.status === 'OK') {
      $('#api_status').addClass('available');
      console.log(response.status);
    } else {
      $('#api_status').removeClass('available');
      console.log(response.status);
    }
  });

  $.ajax({
    url: 'http://24272da151a2.115532cb.alx-cod.online:5001/api/v1/places_search/',
    method: 'POST',
    data: '{}',
    contentType: 'application/json',
    dataType: 'json',
    success: function (data) {
      $.each(data, function (idx, place) {
        const markUp = `
                <article>
                <div class="title_box">
                    <h2>${place.name}</h2>
                    <div class="price_by_night">$${place.price_by_night}</div>
                </div>
                <div class="information">
                    <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
                    <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
                    <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
                </div>
                <div class="description">
                    ${place.description}
                </div>
                </article>`;
        $('section.places').append(markUp);
      });
    }
  });
});
