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
	const placeId = place.id;
//	console.log('Place:\n\n:');
	console.log(place.id + ' : ' + place.name);
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
		<div class="reviews">
			<span>Show</span>
                        <h2>Reviews</h2>
			<ul></ul>
		</div>
                </article>`;
        $('section.places').append(markUp);
	$('.reviews').find('span').attr('data-id', placeId);
	
      });
    }
  });

  $('button.search').click(function () {
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
	  const placeId = place.id;
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
		<div class="reviews">
                   <h2>Reviews</h2>
		   <span>Show</span>
		   <ul></ul>
                </div>
                </article>`;
          if (idx === 0) {
            $('section.places').html(markUp);
          } else {
            $('section.places').append(markUp);
          }
	  $('.reviews').find('span').attr('data-id', placeId);
        });
//        console.log(data.length);
      }
    });
  });

  $('.places').on('click', 'span', function() {
    console.log('button clicked');
    const placeId = $(this).attr('data-id'); // Replace with the actual place ID obtained from place.id

    const apiUrl = domain + ':5001/api/v1/places/' + placeId + '/reviews'; // API endpoint URL
    const show = 'Show';
    const hide = 'Hide';
    const span = $(this); // span is the element to click show|hide

    console.log('button clicked');
    if (span.text() === show) {
      // Make an AJAX request to fetch the reviews
      const myReviews = $.ajax(apiUrl);
      let myUser;

      myReviews.done(function (data) {
        for (let i = 0; i < data.length; i++) {
          myUser = $.ajax(domain + ':5001/api/v1/users/' + data[i].user_id);
          myUser.done(function (userData) {
            let date = new Date(data[i].created_at);
            date = date.getDate() + 'th ' + ' ' + date.toLocaleString('default', { month: 'long' }) + ' ' + date.getFullYear();
            span.parent().find('ul').append('<li><h2>From ' + userData.first_name + ' ' + userData.last_name + ' the ' + date + '</h2><p>' + data[i].text + '</p></li>');
            });
          }
        });
        span.text(hide);
    } else {
      // Means u_want to hide
      $(this).parent().find('ul').empty();
      span.text(show);
    }
  });
});
