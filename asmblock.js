$(document).ready(function() {
	$('.tooltipped').tooltip({enterDelay: 0, exitDelay: 0, inDuration: 150, outDuration: 100, transitionMovement: 5});
	$('.collapsible').collapsible({});
	$('.collapsible-header').addClass('waves-effect waves-block');
	$('.modal').modal({});
	$('.scrollspy').scrollSpy({});
	var elems = document.querySelectorAll('.tap-target');
	var instances = M.TapTarget.init(elems, {});
	$.each(instances, function(index, instance) {
		instance.open();
	});
	setTimeout(function() {
		$.each(instances, function(index, instance) {
			instance.close();
		});
	}, 2000);
});
