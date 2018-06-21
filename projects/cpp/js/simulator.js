var finished = false;
var env;
var renderedEnv;
var currEnvId = 0;

function loadEnvironment(envId) {

	resetSimulator();

	if (envId != undefined)
		currEnvId = envId;

	env = getEnvironmentById(currEnvId);
	renderedEnv = renderEnvironment(env);
	env.size = two.scene.getBoundingClientRect();
	
	env.unorderedEvents = getEventList();
	(env.events = env.unorderedEvents.slice()).sort(eventComparer);
	renderedEnv.events = new Array();

	env.cells = new Array();
	renderedEnv.cells = new Array();

	setStartupVariables();
	setupAnimator();

	two.update();
}

function setStartupVariables() {
	currEvent = 0;
	currNodeIx = 0;
	nodei = 1;
	nodej = 0;
	currPathIx = 0;
	nodeId = 0;
}

function resetSimulator() {
	stopSimulator();
	two.clear();
}

function startSimulator() {
	finished = false;
	two.bind('update', run).play();
}

function stopSimulator() {
	two.unbind('update', run);
}

function simulatorfinished() {
	stopSimulator();
	simulatorFinishedCallback();
	finished = true;
}

function loadSlice() {
	renderedEnv.slice = renderSlice(env.size);
}

var currEvent = 0;
function addNextEvent() {
	renderEvent(env.unorderedEvents[currEvent++]);
	return currEvent < env.events.length;
}

var currNodeIx = 0;
function addNextNode() {
	renderNode(renderedEnv.cells[currNodeIx++]);
	return currNodeIx < renderedEnv.cells.length;
}

function makeGraphAndPath() {
	renderCells();
	makeGraph();
	makePath();
}

var graph;
function makeGraph() {
	graph = [];
	
	for (var i = 0; i < env.cells.length; i++)
		graph[i] = [];
	
	for (var i = 0; i < env.cells.length; i++) {
		var node = env.cells[i];
		
		for (var j = 0; j < node.neighbours.length; j++) {
			var neighbour = node.neighbours[j];

			for (var k = i+1; k < env.cells.length; k++) {
				var checkNode = env.cells[k];

				if (checkNode.id == neighbour.id) {
					graph[i][k] = true;
					graph[k][i] = true;
					break;
				}
			}
		}
	}
}

var path;
function makePath() {
	path = [];
	var startI = Math.floor((Math.random() * env.cells.length));
	
	var currNode = env.cells[startI];
	currNode.visited = true;

	visitNeighboursOf(currNode);
}

function visitNeighboursOf(node) {
	for (var i = 0; i < node.neighbours.length; i++) {
		var neighbour = node.neighbours[i];
		if (!neighbour.visited) {
			neighbour.visited = true;
			path.push(renderedEnv.cells[node.id]);
			path.push(renderedEnv.cells[neighbour.id]);
			visitNeighboursOf(neighbour);
		}
	}
}

var nodei = 1;
var nodej = 0;
function addNextEdge() {
	for (var i = nodei; i <  env.cells.length; i++) {
		for (var j = nodej; j < i; j++) {
			if (graph[i][j]) {
				renderEdgeBetween(renderedEnv.cells[i], renderedEnv.cells[j]);

				nodej = (j+1) % i;
				if (!(nodej > j))
					nodei = i+1;
				else
					nodei = i;
				return nodei < env.cells.length;
			}
		}
		nodej = 0;
	}
}

var currPathIx = 0;
function addNextPathEdge() {
	renderPathBetween(
		path[currPathIx],
		path[currPathIx+1],
		currPathIx == 0,
		currPathIx+2 >= path.length);

	currPathIx+=2;
	return currPathIx < path.length;
}

function moveSlice() {
	var slice = renderedEnv.slice;
	if (slice.translation.x < env.size.right + 10 + speed) {
		var events = getEventsAtX(slice.translation.x);
		
		if (events.length > 0) {
			for (var i = 0; i < events.length; i++) {
				var event = events[i];
				switch(events[i].type) {
					case EVENT_TYPES.START:
						var newCell = new Cell([event.point],
							true, event, event);
						env.cells.push(newCell);
						break;
					case EVENT_TYPES.END:
						var cell = getCellsForEvent(event)[0];
						cell.points.push(event.point);
						cell.points.unshift(event.point);
						cell.open = false;
						makeGraphAndPath();
						break;
					case EVENT_TYPES.IN:
						var cell = getCellsForEvent(event)[0];
						var bottom = getCellBottomPointAtEvent(cell, event);
						var top = getCellTopPointAtEvent(cell, event);
						cell.points.unshift(top);
						cell.points.push(bottom);
						cell.open = false;

						var newCell1 = new Cell([top, event.point],
							true, cell.lastTopEvent, event);
						var newCell2 = new Cell([event.point, bottom],
							true, event, cell.lastBottomEvent);
						env.cells.push(newCell1);
						env.cells.push(newCell2);

						cell.neighbours.unshift(newCell1);
						cell.neighbours.unshift(newCell2);
						newCell1.neighbours.push(cell);
						newCell2.neighbours.push(cell);

						break;
					case EVENT_TYPES.OUT:
						var cells = getCellsForEvent(event);
						var top = getCellTopPointAtEvent(cells[0], event);
						var bottom = getCellBottomPointAtEvent(cells[1], event);
						cells[0].points.unshift(top);
						cells[0].points.push(event.point);
						cells[0].open = false;
						cells[1].points.unshift(event.point);
						cells[1].points.push(bottom);
						cells[1].open = false;

						var newCell = new Cell([top, bottom],
							true, cells[0].lastTopEvent, cells[1].lastBottomEvent);
						env.cells.push(newCell);

						cells[0].neighbours.unshift(newCell);
						cells[1].neighbours.unshift(newCell);
						newCell.neighbours.push(cells[0]);
						newCell.neighbours.push(cells[1]);

						break;
					case EVENT_TYPES.CEILING:
						var cell = getCellsForEvent(event)[0];
						cell.points.unshift(event.point);
						cell.lastTopEvent = event;
						cell.points.push(getCellCurrBottomPoint(cell));
						break;
					case EVENT_TYPES.FLOOR:
						var cell = getCellsForEvent(event)[0];
						cell.points.push(event.point);
						cell.lastBottomEvent = event;
						cell.points.unshift(getCellCurrTopPoint(cell));
						break;
				}

				unrenderEvent(event);
			}
		}
		slice.translation.x += speed;
		return true;
	} else
		return false;
}

function getCellsForEvent(event) {
	var cells = [];

	for (var i = 0; i < env.cells.length; i++) {
		var cell = env.cells[i];
		if (cell.open) {
			switch(event.type) {
				case EVENT_TYPES.END:
					cells.push(cell);
					break;
				case EVENT_TYPES.CEILING:
					if (cell.lastTopEvent.ceiling.x == event.point.x &&
						cell.lastTopEvent.ceiling.y == event.point.y)
						cells.push(cell);
					break;
				case EVENT_TYPES.FLOOR:
					if (cell.lastBottomEvent.floor.x == event.point.x &&
						cell.lastBottomEvent.floor.y == event.point.y)
						cells.push(cell);
					break;
				case EVENT_TYPES.IN:
					var bottom = getCellBottomPointAtEvent(cell, event);
					var top = getCellTopPointAtEvent(cell, event);
					if (top.y < event.point.y && bottom.y > event.point.y)
						cells.push(cell);
					break;
				case EVENT_TYPES.OUT:
					if (cell.lastBottomEvent.floor.x == event.point.x &&
						cell.lastBottomEvent.floor.y == event.point.y)
						cells.unshift(cell);
					else if (cell.lastTopEvent.ceiling.x == event.point.x &&
						cell.lastTopEvent.ceiling.y == event.point.y)
						cells.push(cell);
					break;
			}
		}
	}

	return cells;
}

function getCellCurrTopPoint(cell) {
	var event = cell.lastTopEvent;

	var m = (event.ceiling.x - event.point.x) /
		(event.ceiling.y - event.point.y);

	var x1 = event.point.x;
	var y1 = event.point.y;
	var x2 = renderedEnv.slice.translation.x;

	var y2 = ((x2 - x1) / m) + y1;

	return new Point(x2, y2);
}

function getCellCurrBottomPoint(cell) {
	var event = cell.lastBottomEvent;

	var m = (event.floor.x - event.point.x) /
		(event.floor.y - event.point.y);

	var x1 = event.point.x;
	var y1 = event.point.y;
	var x2 = renderedEnv.slice.translation.x;

	var y2 = ((x2 - x1) / m) + y1;

	return new Point(x2, y2);
}

function getCellTopPointAtEvent(cell, event) {
	var tEvent = cell.lastTopEvent;

	var m = (tEvent.ceiling.x - tEvent.point.x) /
		(tEvent.ceiling.y - tEvent.point.y);

	var x1 = tEvent.point.x;
	var y1 = tEvent.point.y;
	var x2 = event.point.x;

	var y2 = ((x2 - x1) / m) + y1;

	return new Point(x2, y2);
}

function getCellBottomPointAtEvent(cell, event) {
	var bEvent = cell.lastBottomEvent;

	var m = (bEvent.floor.x - bEvent.point.x) /
		(bEvent.floor.y - bEvent.point.y);

	var x1 = bEvent.point.x;
	var y1 = bEvent.point.y;
	var x2 = event.point.x;

	var y2 = ((x2 - x1) / m) + y1;

	return new Point(x2, y2);
}

var nodeId = 0;
function Cell(points, open, topEvent, bottomEvent) {
	return {
		id: nodeId++,
		points: points,
		open: open,
		lastTopEvent: topEvent,
		lastBottomEvent: bottomEvent,
		neighbours: [],
		visited: false
	}
}

loadEnvironment();