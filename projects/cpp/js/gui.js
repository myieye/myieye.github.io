var running = false;
var needsReseting = false;

$("#slider").slider({ min: 1, max: 10, value: 3, focus: false });
$("#slider").on("slide", function(slideEvt) {
	setSpeed(slideEvt.value);
});

function startStop() {
	if (needsReseting) {
		needsReseting = false;
		reset();
	}

	if (running) {
		console.log("stop()");
		stopSimulator();
		running = false;
		$('#btnStartStop').text("Start")
			.addClass('btn-success')
			.removeClass('btn-warning');
	}
	else {
		console.log("start()");
		startSimulator();
		running = true;
		$('#btnStartStop').text("Stop")
			.addClass('btn-warning')
			.removeClass('btn-success');
	}
}

function simulatorFinishedCallback() {
	running = false;
	needsReseting = true;
	$('#btnStartStop').text("Restart")
		.addClass('btn-success')
		.removeClass('btn-warning');
}

function reset() {
	if (running)
		startStop();

	loadEnvironment();
}

function setEnvironment(envId) {
	if (envId != currEnvId) {
		if (running)
			startStop();

		loadEnvironment(envId);
		$('#btnStartStop').text("Start")
			.addClass('btn-success')
			.removeClass('btn-warning');
	}
}

function setSpeed(speed) {
	setAnimationSpeed(speed);
}