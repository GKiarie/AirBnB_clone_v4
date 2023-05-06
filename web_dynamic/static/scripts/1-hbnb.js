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
});
