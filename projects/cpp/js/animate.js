var currStep;

var FRAMES_PER_SECOND = 60;
var frameCount = 0;
var speed = 3;

var STEPS = {
	MAKE_EVENT_LIST: "MAKE_EVENT_LIST",
	RUN_SWEEP_LINE: "RUN_SWEEP_LINE",
	MAKE_NODES: "MAKE_NODES",
	MAKE_EDGES: "MAKE_EDGES",
	MAKE_PATH: "MAKE_PATH"
};

var FRAMES_PER_EVENT;

function setupAnimator() {
	FRAMES_PER_EVENT = {
		MAKE_EVENT_LIST: Math.ceil(30/speed),
		RUN_SWEEP_LINE: 2,
		RENDER_CELLS: 5,
		MAKE_NODES: Math.ceil(60/speed),
		MAKE_EDGES: Math.ceil(60/speed),
		MAKE_PATH: Math.ceil(100/speed)
	};
	currStep = STEPS.MAKE_EVENT_LIST;
}

function setAnimationSpeed(newSpeed) {
	speed = newSpeed;
	FRAMES_PER_EVENT = {
		MAKE_EVENT_LIST: Math.ceil(30/speed),
		RUN_SWEEP_LINE: 2,
		RENDER_CELLS: 5,
		MAKE_NODES: Math.ceil(60/speed),
		MAKE_EDGES: Math.ceil(60/speed),
		MAKE_PATH: Math.ceil(100/speed)
	};
}

function run(frames) {

	switch (currStep) {

		case (STEPS.MAKE_EVENT_LIST):
			if (frames%FRAMES_PER_EVENT.MAKE_EVENT_LIST == 0) {
				if (!addNextEvent()) {
					loadSlice();
					currStep = STEPS.RUN_SWEEP_LINE;
				}
			}
			break;


		case (STEPS.RUN_SWEEP_LINE):
			if (frames%FRAMES_PER_EVENT.RUN_SWEEP_LINE == 0) {
				if (!moveSlice())
					currStep = STEPS.MAKE_NODES;
				if (frames%FRAMES_PER_EVENT.RENDER_CELLS == 0)
					renderCells();
			}
			break;


		case (STEPS.MAKE_NODES):
			if (frames%FRAMES_PER_EVENT.MAKE_NODES == 0) {
				if(!addNextNode())
					currStep = STEPS.MAKE_EDGES;
			}
			break;


		case (STEPS.MAKE_EDGES):
			if (frames%FRAMES_PER_EVENT.MAKE_EDGES == 0) {
				if(!addNextEdge())
					currStep = STEPS.MAKE_PATH;
			}
			break;


		case (STEPS.MAKE_PATH):
			if (frames%FRAMES_PER_EVENT.MAKE_PATH == 0) {
				if(!addNextPathEdge())
					currStep = STEPS.FINISHED;
			}
			break;
		case (STEPS.FINISHED):
			simulatorfinished();
			console.log("finished");
			break;
	}
}

function LineAnimator(a1, a2, line, callback) {
	var m = Math.abs((a2.x - a1.x) / (a2.y - a1.y));
	var xDir = a1.x < a2.x ? 1 : -1;
	var yDir = a1.y < a2.y ? 1 : -1;
	var counter = 0;
	var lineAnimator = {
		m: m,
		a1: a1,
		a2: a2,
		line: line,
		start: function() {
			two.bind('update', this.run).play();
		},
		run: function(run, callback) {
			var v2 = line.vertices[1];
			if (counter++%30==0) {
				console.log("v2.x: " + v2.x);
				console.log("a2.x: " + a2.x);
			}
			if (Math.floor(v2.x) < Math.floor(a2.x) 
				&& Math.floor(v2.y) != Math.floor(a2.y)) {
				var x = Math.sqrt(1/(Math.abs(m)+1));
				v2.x += x*m * xDir;
				v2.y += x * yDir;
			} else {
				console.log("UNBIND!");
				callback.apply();
			}
		}
	}

	return lineAnimator;
}