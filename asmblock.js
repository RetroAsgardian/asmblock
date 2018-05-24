let open = true;
function updateSize() {
	let spaceTaken = 0;
	if (open) {
		spaceTaken = 510;
		$('#code-panel').css('transition','height 0.2s cubic-bezier(.6,0,.4,1)');
	} else {
		spaceTaken = 190;
		$('#code-panel').css('transition','height 0.6s cubic-bezier(.6,0,.4,1)');
	}
	$('#code-panel').hide();
	let spaceAvailable = $('html').height();
	$('#code-panel').show();
	$('#code-panel').height(spaceAvailable - spaceTaken);
}
$(document).ready(function() {
	sizeOfCollapsible = $('')
	$('.tooltipped').tooltip({enterDelay: 0, exitDelay: 0, inDuration: 150, outDuration: 100, transitionMovement: 5});
	$('.collapsible').collapsible({
		onOpenStart: function() {open = true; updateSize();},
		onCloseStart: function() {open = false; updateSize();},
	});
	updateSize();
	$(window).resize(function() {
		updateSize();
	});
	$('.collapsible.expandable').collapsible({accordion: false});
	$('select').formSelect();
	var celems = document.querySelectorAll('.collapsible.accordion-alt');
	var cinstances = M.Collapsible.init(celems, {
		accordion: false,
		onOpenEnd: function(e) {
			let index = $(e).index();
			for (let i = 0; i < 4; i++) {
				if (i != index) {
					cinstances[0].close(i);
				}
			}
		}
	});
	$('.collapsible-header').addClass('waves-effect waves-block');
	$('.modal').modal();
	$('.scrollspy').scrollSpy();
});
let palette = [
	'#393457',
	'#ffffff',
	'#6df7c1',
	'#11adc1',
	'#606c81',
	'#1e8875',
	'#5bb361',
	'#a1e55a',
	'#f7e476',
	'#f99252',
	'#cb4d68',
	'#6a3771',
	'#c92464',
	'#f48cb6',
	'#f7b69e',
	'#9b9c82',
];

let rom = [];
let ram = [];
let labels = [];
let subs = [];
let addr = 0;
let cmd = '';
function plotLineLow(ctx, x0, y0, x1, y1) {
	x0 = Math.floor(x0);
	y0 = Math.floor(y0);
	x1 = Math.floor(x1);
	y1 = Math.floor(y1);
	let dx = x1 - x0;
	let dy = y1 - y0;
	let yi = 1;
	if (dy < 0) {
		yi = -1;
		dy = -dy;
	}
	let D = 2*dy - dx;
	let y = y0;
	for (let x = x0; x <= x1; x++) {
		ctx.fillRect(x,y,1,1);
		if (D > 0) {
			y = y + yi;
			D = D - 2*dx;
		}
		D = D + 2*dy;
	}
}
function plotLineHigh(ctx, x0, y0, x1, y1) {
	x0 = Math.floor(x0);
	y0 = Math.floor(y0);
	x1 = Math.floor(x1);
	y1 = Math.floor(y1);
	let dx = x1 - x0;
	let dy = y1 - y0;
	let xi = 1;
	if (dx < 0) {
		xi = -1;
		dx = -dx;
	}
	let D = 2*dx - dy;
	let x = x0;
	for (let y = y0; y <= y1; y++) {
		ctx.fillRect(x,y,1,1);
		if (D > 0) {
			x = x + xi;
			D = D - 2*dy;
		}
		D = D + 2*dx;
	}
}
function line(ctx, x0, y0, x1, y1) {
	if (Math.abs(y1 - y0) < Math.abs(x1 - x0)) {
		if (x0 > x1) {
			plotLineLow(ctx,x1, y1, x0, y0);
		} else {
			plotLineLow(ctx,x0, y0, x1, y1);
		}
	} else {
		if (y0 > y1) {
			plotLineHigh(ctx,x1, y1, x0, y0);
		} else {
			plotLineHigh(ctx,x0, y0, x1, y1);
		}
	}
}
function rect(ctx, x0, y0, x1, y1) {
	line(ctx, x0, y0, x1, y0); // top
	line(ctx, x0, y1, x1, y1); // bottom
	line(ctx, x0, y0, x0, y1); // left
	line(ctx, x1, y0, x1, y1); // right
}
let stamps = [
	[
		0,0,0,0,0,0,0,0,
		0,1,0,0,0,0,1,0,
		0,1,0,0,0,0,1,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,1,0,0,0,0,1,0,
		0,0,1,1,1,1,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,0,0,0,0,1,0,
		0,1,0,0,0,0,1,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,1,1,1,1,0,0,
		0,1,0,0,0,0,1,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,0,0,0,0,1,0,
		0,1,0,0,0,0,1,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,1,1,0,0,1,0,
		0,1,0,0,1,1,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,0,0,0,0,1,0,
		0,0,1,0,0,1,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,1,0,0,0,0,1,0,
		0,0,1,1,1,1,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,0,0,0,0,1,0,
		0,0,1,0,0,1,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,1,1,1,1,0,0,
		0,1,0,0,0,0,1,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,1,0,1,1,0,0,
		1,0,0,1,0,0,1,0,
		1,0,0,0,0,0,1,0,
		1,0,0,0,0,0,1,0,
		0,1,0,0,0,1,0,0,
		0,0,1,0,1,0,0,0,
		0,0,0,1,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,1,0,1,1,0,0,
		1,1,1,1,1,1,1,0,
		1,1,1,1,1,1,1,0,
		1,1,1,1,1,1,1,0,
		0,1,1,1,1,1,0,0,
		0,0,1,1,1,0,0,0,
		0,0,0,1,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,0,0,1,0,0,0,0,
		0,0,1,0,1,0,0,0,
		0,1,0,0,0,1,0,0,
		1,0,0,0,0,0,1,0,
		0,1,0,0,0,1,0,0,
		0,0,1,0,1,0,0,0,
		0,0,0,1,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,0,0,1,0,0,0,0,
		0,0,1,1,1,0,0,0,
		0,1,1,1,1,1,0,0,
		1,1,1,1,1,1,1,0,
		0,1,1,1,1,1,0,0,
		0,0,1,1,1,0,0,0,
		0,0,0,1,0,0,0,0,
	],
	[
		0,0,0,1,0,0,0,0,
		0,0,1,0,1,0,0,0,
		0,0,0,1,0,0,0,0,
		0,1,0,1,0,1,0,0,
		1,0,1,1,1,0,1,0,
		0,1,0,1,0,1,0,0,
		0,0,0,1,0,0,0,0,
		0,0,1,1,1,0,0,0,
	],
	[
		0,0,0,1,0,0,0,0,
		0,0,1,1,1,0,0,0,
		0,0,0,1,0,0,0,0,
		0,1,0,1,0,1,0,0,
		1,1,1,1,1,1,1,0,
		0,1,0,1,0,1,0,0,
		0,0,0,1,0,0,0,0,
		0,0,1,1,1,0,0,0,
	],
	[
		0,1,1,1,1,1,0,0,
		1,1,0,0,1,1,1,0,
		1,1,0,1,0,1,1,0,
		1,1,0,0,1,1,1,0,
		1,1,0,1,0,1,1,0,
		1,1,0,0,1,1,1,0,
		0,1,1,1,1,1,0,0,
		0,0,0,0,0,0,0,0
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,1,1,1,1,1,0,
		0,1,0,0,0,0,1,0,
		0,1,0,0,0,0,1,0,
		0,1,0,0,0,0,1,0,
		0,1,0,0,0,0,1,0,
		0,1,1,1,1,1,1,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,1,1,1,1,1,0,
		0,1,1,1,1,1,1,0,
		0,1,1,1,1,1,1,0,
		0,1,1,1,1,1,1,0,
		0,1,1,1,1,1,1,0,
		0,1,1,1,1,1,1,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,0,1,1,1,1,0,0,
		0,1,0,0,0,0,1,0,
		0,1,0,0,0,0,1,0,
		0,1,0,0,0,0,1,0,
		0,1,0,0,0,0,1,0,
		0,0,1,1,1,1,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,0,1,1,1,1,0,0,
		0,1,1,1,1,1,1,0,
		0,1,1,1,1,1,1,0,
		0,1,1,1,1,1,1,0,
		0,1,1,1,1,1,1,0,
		0,0,1,1,1,1,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,0,0,1,0,0,0,0,
		0,0,1,0,1,0,0,0,
		0,1,0,0,0,1,0,0,
		1,0,0,0,0,0,1,0,
		0,1,1,1,1,1,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,0,0,1,0,0,0,0,
		0,0,1,1,1,0,0,0,
		0,1,1,1,1,1,0,0,
		1,1,1,1,1,1,1,0,
		0,1,1,1,1,1,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,1,1,1,1,1,0,0,
		1,0,0,0,0,0,1,0,
		0,1,0,0,0,1,0,0,
		0,0,1,0,1,0,0,0,
		0,0,0,1,0,0,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,1,1,1,1,1,0,0,
		1,1,1,1,1,1,1,0,
		0,1,1,1,1,1,0,0,
		0,0,1,1,1,0,0,0,
		0,0,0,1,0,0,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,1,0,0,0,
		0,0,0,1,0,1,0,0,
		0,0,1,0,0,1,0,0,
		0,1,0,0,0,1,0,0,
		0,0,1,0,0,1,0,0,
		0,0,0,1,0,1,0,0,
		0,0,0,0,1,0,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,1,0,0,0,
		0,0,0,1,1,1,0,0,
		0,0,1,1,1,1,0,0,
		0,1,1,1,1,1,0,0,
		0,0,1,1,1,1,0,0,
		0,0,0,1,1,1,0,0,
		0,0,0,0,1,0,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,1,0,0,0,0,
		0,0,1,0,1,0,0,0,
		0,0,1,0,0,1,0,0,
		0,0,1,0,0,0,1,0,
		0,0,1,0,0,1,0,0,
		0,0,1,0,1,0,0,0,
		0,0,0,1,0,0,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,1,0,0,0,0,
		0,0,1,1,1,0,0,0,
		0,0,1,1,1,1,0,0,
		0,0,1,1,1,1,1,0,
		0,0,1,1,1,1,0,0,
		0,0,1,1,1,0,0,0,
		0,0,0,1,0,0,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,1,1,1,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,0,1,0,1,0,0,
		0,1,0,1,0,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,1,1,1,1,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,0,1,1,0,0,0,0,
		0,0,0,1,0,0,0,0,
		0,0,0,1,0,0,0,0,
		0,0,0,1,0,0,0,0,
		0,0,0,1,0,0,0,0,
		0,0,1,1,1,0,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,1,1,1,1,0,0,
		0,0,0,0,0,1,0,0,
		0,1,1,1,1,1,0,0,
		0,1,0,0,0,0,0,0,
		0,1,0,0,0,0,0,0,
		0,1,1,1,1,1,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,1,1,1,1,0,0,
		0,0,0,0,0,1,0,0,
		0,1,1,1,1,1,0,0,
		0,0,0,0,0,1,0,0,
		0,0,0,0,0,1,0,0,
		0,1,1,1,1,1,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,0,0,0,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,1,1,1,1,0,0,
		0,0,0,0,0,1,0,0,
		0,0,0,0,0,1,0,0,
		0,0,0,0,0,1,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,1,1,1,1,0,0,
		0,1,0,0,0,0,0,0,
		0,1,1,1,1,0,0,0,
		0,0,0,0,0,1,0,0,
		0,0,0,0,0,1,0,0,
		0,1,1,1,1,0,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,1,1,1,1,0,0,
		0,1,0,0,0,0,0,0,
		0,1,1,1,1,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,1,1,1,1,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,1,1,1,1,0,0,
		0,0,0,0,0,1,0,0,
		0,0,0,0,0,1,0,0,
		0,0,0,0,0,1,0,0,
		0,0,0,0,0,1,0,0,
		0,0,0,0,0,1,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,1,1,1,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,1,1,1,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,1,1,1,1,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,1,1,1,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,1,1,1,1,0,0,
		0,0,0,0,0,1,0,0,
		0,0,0,0,0,1,0,0,
		0,1,1,1,1,1,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,1,1,1,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,1,1,1,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,0,0,0,1,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,1,1,1,0,0,0,
		0,1,0,0,1,0,0,0,
		0,1,1,1,1,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,1,1,1,1,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,1,1,1,1,0,0,
		0,1,0,0,0,0,0,0,
		0,1,0,0,0,0,0,0,
		0,1,0,0,0,0,0,0,
		0,1,0,0,0,0,0,0,
		0,1,1,1,1,1,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,1,1,1,0,0,0,
		0,1,0,0,0,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,1,1,1,0,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,1,1,1,1,0,0,
		0,1,0,0,0,0,0,0,
		0,1,1,1,1,0,0,0,
		0,1,0,0,0,0,0,0,
		0,1,0,0,0,0,0,0,
		0,1,1,1,1,1,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,1,1,1,1,0,0,
		0,1,0,0,0,0,0,0,
		0,1,1,1,1,0,0,0,
		0,1,0,0,0,0,0,0,
		0,1,0,0,0,0,0,0,
		0,1,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,1,1,1,1,0,0,
		0,1,0,0,0,0,0,0,
		0,1,0,1,1,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,1,1,1,1,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,0,0,0,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,1,1,1,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,0,0,0,1,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,1,1,1,1,0,0,
		0,0,0,1,0,0,0,0,
		0,0,0,1,0,0,0,0,
		0,0,0,1,0,0,0,0,
		0,0,0,1,0,0,0,0,
		0,1,1,1,1,1,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,1,1,1,1,0,0,
		0,0,0,0,1,0,0,0,
		0,0,0,0,1,0,0,0,
		0,0,0,0,1,0,0,0,
		0,1,0,0,1,0,0,0,
		0,1,1,1,1,0,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,0,0,0,1,0,0,
		0,1,0,0,1,0,0,0,
		0,1,1,1,0,0,0,0,
		0,1,0,0,1,0,0,0,
		0,1,0,0,0,1,0,0,
		0,1,0,0,0,1,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,0,0,0,0,0,0,
		0,1,0,0,0,0,0,0,
		0,1,0,0,0,0,0,0,
		0,1,0,0,0,0,0,0,
		0,1,0,0,0,0,0,0,
		0,1,1,1,1,1,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,1,1,1,1,0,0,
		0,1,0,1,0,1,0,0,
		0,1,0,1,0,1,0,0,
		0,1,0,1,0,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,0,0,0,1,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,1,1,1,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,0,0,0,1,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,1,1,1,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,1,1,1,1,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,1,1,1,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,1,1,1,1,0,0,
		0,1,0,0,0,0,0,0,
		0,1,0,0,0,0,0,0,
		0,1,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,1,1,1,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,1,1,1,1,0,0,
		0,0,0,0,0,1,0,0,
		0,0,0,0,0,1,0,0,
		0,0,0,0,0,1,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,1,1,1,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,1,1,1,1,0,0,
		0,1,0,0,1,0,0,0,
		0,1,0,0,0,1,0,0,
		0,1,0,0,0,1,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,1,1,1,1,0,0,
		0,1,0,0,0,0,0,0,
		0,1,1,1,1,1,0,0,
		0,0,0,0,0,1,0,0,
		0,0,0,0,0,1,0,0,
		0,1,1,1,1,1,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,1,1,1,1,0,0,
		0,0,0,1,0,0,0,0,
		0,0,0,1,0,0,0,0,
		0,0,0,1,0,0,0,0,
		0,0,0,1,0,0,0,0,
		0,0,0,1,0,0,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,0,0,0,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,1,1,1,1,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,0,0,0,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,0,0,1,0,0,0,
		0,1,1,1,0,0,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,0,0,0,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,0,1,0,1,0,0,
		0,1,0,1,0,1,0,0,
		0,1,0,1,0,1,0,0,
		0,1,1,1,1,1,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,0,0,0,1,0,0,
		0,1,0,0,0,1,0,0,
		0,0,1,1,1,0,0,0,
		0,1,0,0,0,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,0,0,0,1,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,0,0,0,1,0,0,
		0,1,0,0,0,1,0,0,
		0,1,1,1,1,1,0,0,
		0,0,0,1,0,0,0,0,
		0,0,0,1,0,0,0,0,
		0,0,0,1,0,0,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,1,1,1,1,0,0,
		0,0,0,0,1,0,0,0,
		0,0,0,1,0,0,0,0,
		0,0,1,0,0,0,0,0,
		0,1,0,0,0,0,0,0,
		0,1,1,1,1,1,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,1,1,1,1,0,0,
		0,1,0,0,0,1,0,0,
		0,0,0,0,0,1,0,0,
		0,0,0,1,1,1,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,1,0,0,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,0,0,1,0,0,0,0,
		0,0,0,1,0,0,0,0,
		0,0,0,1,0,0,0,0,
		0,0,0,1,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,1,0,0,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,0,1,0,0,0,0,0,
		0,1,0,0,0,1,1,1,
		0,1,0,0,1,0,1,0,
		0,1,0,0,0,0,0,1,
		0,1,0,0,0,0,0,0,
		0,0,1,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,1,0,0,0,1,1,
		1,0,1,0,0,1,0,1,
		0,0,1,1,0,0,0,0,
		0,0,0,1,0,0,0,0,
		0,0,1,1,0,0,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,0,0,1,0,0,0,0,
		1,0,0,0,1,0,0,0,
		0,1,0,0,1,0,0,0,
		1,0,0,0,1,0,0,0,
		0,0,0,0,1,0,0,0,
		0,0,0,1,0,0,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,0,0,0,0,1,0,
		0,0,1,1,1,1,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,0,1,1,1,1,0,0,
		0,1,0,0,0,0,1,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,1,1,1,1,1,1,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
	],
	[
		0,0,0,0,0,0,0,0,
		0,0,1,1,0,0,1,0,
		0,1,0,0,1,1,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
	],
];
function stamp(ctx, x, y, snum) {
	let mystamp = stamps[snum];
	for (let i = 0; i < 64; i++) {
		if (mystamp[i] == 1) {
			let myx = x + (i % 8);
			let myy = y + Math.floor(i / 8);
			ctx.fillRect(myx,myy,1,1);
		}
	}
}
