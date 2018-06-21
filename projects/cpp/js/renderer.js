var styles;

function initStyles() {
	styles = {
		areaColor: "#FF8000",
		areaBorderColor: "orangered",
		areaLineWidth: 5,

		obstacleColor: "#336699",
		obstacleBorderColor: "#333",
		obstacleLineWidth: 3,

		cellColor: "#16A085",
		cellBorderColor: "black",
		cellLineWidth: 3,

		blobSize: 5,
		blobFill: "black",
		blobStroke: "green",
		blobLineWidth: 1.5,

    	eventTextSize: 15,
    	eventTextFill: "black",

    	nodeSize: 17,
		nodeFill: "#E67E22",
		nodeRing: "#F1C40F",
		nodeRingSize: 20,
		nodeRingLineWidth: 7,

		edgeColor: "black",
		edgeLineWidth: 5,

		pathColor: "white",
		pathLineWidth: 2,

    	startEndTextSize: 30,
		startEndColor: "white",

		sliceColor: "purple"
	}
}

function changePointsToAnchors(points) {
	var anchors = new Array();

	for (var i = 0; i < points.length; i++) {
		var p = points[i];
		anchors.push(new Two.Anchor(p.x, p.y));
	}

	return anchors;
}

function renderBoundary(boundary) {

	var anchors = changePointsToAnchors(boundary);

	var renderedBoundary = two.makePath(anchors);
	renderedBoundary.fill = styles.areaColor;
	renderedBoundary.stroke = styles.areaBorderColor;
	renderedBoundary.linewidth = styles.areaLineWidth;

	return renderedBoundary;
}

function renderObstacle(obstacle) {

	var anchors = changePointsToAnchors(obstacle);

	var renderedObstacle = two.makePath(anchors);
	renderedObstacle.fill = styles.obstacleColor;
	renderedObstacle.stroke = styles.obstacleBorderColor;
	renderedObstacle.linewidth = styles.obstacleLineWidth;

	return renderedObstacle;
}

function renderSlice(size) {
	slice = two.makeLine(size.left, size.top, size.left, size.bottom);
	slice.stroke = styles.sliceColor;
	slice.linewidth = 6;

	return slice;
}

function getVerticesAtX(x) {

	var vertices = new Array();
	vertices = vertices.concat(
		getVerticesInPathAtX(env.boundary,x));

	for (var i = 0; i < env.obstacles.length; i++) {
		vertices = vertices.concat(
			getVerticesInPathAtX(env.obstacles[i],x));
	}

	return vertices;
}

function getVerticesInPathAtX(path, x) {

	var vertices = new Array();

	for (var i = 0; i < path.length; i++) {
		var a = path[i];

		if (Math.floor(a.x) == Math.floor(x))
			vertices.push(a);
	}

	return vertices;
}

function renderBlobAt(point) {
	var circle = two.makeCircle(point.x, point.y, styles.blobSize);
	circle.fill = styles.blobFill;
	circle.stroke = styles.blobStroke;
	circle.linewidth = styles.blobLineWidth;
	return circle;
}

function getAbsolutePositionRelativeTo(point, relation) {
	var x = relation.x + point.x;
	var y = relation.y + point.y;
	
	return new Two.Anchor(x, y);
}

function renderEvent(event) {

	var xOffset = 0;
	var yOffset = -10;

	var eventText = new Two.Text(event.type,
		event.point.x + xOffset, event.point.y + yOffset);

	var blob = renderBlobAt(event.point);

    eventText.weight = 'bold';
    eventText.size = styles.eventTextSize;
    eventText.fill = styles.eventTextFill;

    two.add(eventText);

    renderedEnv.events.push([blob,eventText]);
}

function unrenderEvent(event) {
	var p1 = event.point;
	for (var i = 0; i < renderedEnv.events.length;i++) {
		var p2 = renderedEnv.events[i][0].translation;
		if (pointsAreEqual(event.point, p2)) {
			two.remove(
				renderedEnv.events[i][0],
				renderedEnv.events[i][1]);
			
			break;
		}
	}
}

function renderCells() {
	for (var i = 0; i < renderedEnv.cells.length;i++)
		renderedEnv.cells[i].remove();

	renderedEnv.cells = [];

	for (var i = 0; i < env.cells.length;i++) {
		var cell = env.cells[i];

		var anchors = changePointsToAnchors(cell.points);

		var renderedCell = two.makePath(anchors, cell.open);

		renderedCell.fill = styles.cellColor;
		renderedCell.stroke = styles.cellBorderColor;
		renderedCell.linewidth = styles.cellLineWidth;
		//renderedCell.opacity = 0.7;
		renderedEnv.cells.push(renderedCell);
		//two.add(renderedCell);
	}

	var group = two.makeGroup();
}

function renderNode(cell) {
	var point = cell.translation;

	var circle = two.makeCircle(point.x, point.y, styles.nodeSize);
	circle.fill = styles.nodeFill;
	circle.stroke = undefined;

	var ring = two.makeCircle(point.x, point.y, styles.nodeRingSize);
	ring.stroke = styles.nodeRing;
	ring.linewidth = styles.nodeRingLineWidth;
	ring.fill = 'rgba(0,0,0,0)'

	return circle;
}

function renderEdgeBetween(n1, n2) {
	var a1 = new Two.Anchor(n1.translation.x, n1.translation.y,
		20,20,20,20, Two.Commands.curve);
	var a2 = new Two.Anchor(n2.translation.x, n2.translation.y,
		20,20,20,20, Two.Commands.curve);

	var edge = two.makeLine(a1.x, a1.y, a2.x, a2.y, true);
	edge.stroke = styles.edgeColor;
	edge.linewidth = styles.edgeLineWidth;

	var dot1 = two.makeCircle(n1.translation.x, n1.translation.y, styles.edgeLineWidth);
	var dot2 = two.makeCircle(n2.translation.x, n2.translation.y, styles.edgeLineWidth);

	dot1.fill = dot2.fill = styles.edgeColor;
}

function pointsAreEqual(p1, p2) {
	return p1.x == p2.x && p1.y == p2.y;
}

function renderPathBetween(n1, n2, isFirst, isLast) {

	//Get the two points we need to use
	var p1 = new Point(n1.translation.x, n1.translation.y);
	var p2 = new Point(n2.translation.x, n2.translation.y);

	//Draw the first dot
	var dot1 = two.makeCircle(p1.x, p1.y, styles.pathLineWidth);
	dot1.fill = styles.pathColor;
	dot1.stroke = "none";

	//If it's the first in the path, mark it
	if (isFirst)
		renderStartAt(p1);

	//draw the edge
	var edge = two.makeLine(p1.x, p1.y, p2.x, p2.y);
	edge.stroke = styles.pathColor;
	edge.linewidth = styles.pathLineWidth;

	var dot2 = two.makeCircle(p2.x, p2.y, styles.pathLineWidth);
	dot2.fill = styles.pathColor;
	dot2.stroke = "none";

	if (isLast)
		renderEndAt(n2 != undefined ? p2 : p1);
}

function renderStartAt(p) {

	var xOffset = 0;
	var yOffset = -20;

	var startText = new Two.Text("START",
		p.x + xOffset, p.y + yOffset);

    startText.weight = 'bold';
    startText.size = styles.startEndTextSize;
    startText.fill = styles.startEndColor;
    startText.stroke = "black";
    startText.linewidth = 2;

    two.add(startText);
}

function renderEndAt(p) {

	var xOffset = 0;
	var yOffset = -20;

	var endText = new Two.Text("END",
		p.x + xOffset, p.y + yOffset);

    endText.weight = 'bold';
    endText.size = styles.startEndTextSize;
    endText.fill = styles.startEndColor;
    endText.stroke = "black";
    endText.linewidth = 2;

    two.add(endText);
}

function renderEnvironment() {
	renderedEnv = {};

	renderedEnv.boundary = renderBoundary(env.boundary);
	
	var obstacles = new Array();
	for (var i = 0; i < env.obstacles.length; i++) {
		var obstacle = renderObstacle(env.obstacles[i]);
		obstacles.push(obstacle);
	}
	renderedEnv.obstacles = obstacles;

	return renderedEnv;
}

initStyles();