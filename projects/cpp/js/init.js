var two;

function init() {
	// Make an instance of two and place it on the page.
	var elem = document.getElementById('simulation');
	var params = { width: 900, height: 630, fullscreen: false };
	two = new Two(params).appendTo(elem);
}

init();