$('.dropdown-el').click(function (e) {
  e.preventDefault();
  e.stopPropagation();
  $(this).toggleClass('expanded');
  $('#' + $(e.target).attr('for')).prop('checked', true);
});
$(document).click(function () {
  $('.dropdown-el').removeClass('expanded');
});
$('#createbutton').click((e) => {
  e.preventDefault();
  $('#popup-background').toggleClass('hidden');
})

$('#closepopup').click(() => {
  $('#popup-background').toggleClass('hidden');
})


