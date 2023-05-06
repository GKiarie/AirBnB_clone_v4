//script thae applies cjanhes to the cehckbox

$( docum0ent ).ready(function () {
    const dictAmenities = {};
    $('input[type="checkbox"]').change(() => {
    if ($(this).is(':checked')) {
	dictAmenities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
	delete dictAmenities[$(this).attr('data-id')];
    }
    $('.amenities h4').text(Object.values(dictAmenities).join(', '));
    });

    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/status/';
      type: 'GET';
    }).done((response) => {
      if (response.status === 'OK') {
        $('#api_status").addClass('available');
	console.log(response.status);
      } else {
	$('#api_status').removeClass('available');
	console.log(response.status);
      }
    });
});
