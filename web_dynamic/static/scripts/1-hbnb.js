// script that applies changes to the checkbox
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
});
