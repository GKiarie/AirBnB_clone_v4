// api status indication

$('document').ready(function () {
  const domain = 'http://' + window.location.hostname;
  const dictAmenities = {};
  const dictStates = {};
  const dictCities = {};

  $('.amenities input[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
//      console.log($(this).attr('data-id'));
      dictAmenities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete dictAmenities[$(this).attr('data-id')];
    }
    $('.amenities h4').text(Object.values(dictAmenities).join(', '));
  });


  $('.ctBox').change(function () {
    if ($(this).is(':checked')) {
//      console.log($(this).attr('data-id'));
//      console.log($(this).attr('data-name'));
      dictCities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete dictCities[$(this).attr('data-id')];
    }
//    console.log("cities");
//    console.log(dictCities);
    $('.locations h4').text(Object.values(dictCities).join(', '));
  });
	
  $('h2').find('input[type="checkbox"]').change(function () {
    const checkbox = $(this);	  
    if (checkbox.is(':checked')) {
//      console.log(checkbox.attr('data-id'));
//      console.log(checkbox.attr('data-name'));
      dictStates[checkbox.attr('data-id')] = checkbox.attr('data-name');
    } else {
      delete dictStates[$(this).attr('data-id')];
    }
//    console.log("states");
//    console.log(dictStates);
    $('.locations h4').text(Object.values(dictStates).join(', '));
  });

  $.ajax({
    url: domain + ':5001/api/v1/status/',
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
    url: domain + ':5001/api/v1/places_search/',
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

  $('button').click(function () {
    const data1 = JSON.stringify({
      amenities: Object.keys(dictAmenities),
      states: Object.keys(dictStates),
      cities: Object.keys(dictCities)
    });
//    console.log(data1);
    $('section.places').html('');
    $.ajax({
      url: domain + ':5001/api/v1/places_search/',
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      data: data1,
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
          if (idx === 0) {
            $('section.places').html(markUp);
          } else {
            $('section.places').append(markUp);
          }
        });
//        console.log(data.length);
      }
    });
  });
});
