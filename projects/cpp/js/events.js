
function getEventList() {

	var events = getEventsForBoundary(env.boundary);

	for (var i = 0; i < env.obstacles.length; i++) {
		events = events.concat(
			getEventsForObstacle(env.obstacles[i]));
	}
	
	return events;
}

function getEventsForObstacle(obstacle) {
	var leftMostPoint = 0;
	var rightMostPoint = 0;

	//Find left and right-most points
	for (var i = 1; i < obstacle.length;i++) {
		if (obstacle[i].x < obstacle[leftMostPoint].x)
			leftMostPoint = i;
		if (obstacle[i].x > obstacle[rightMostPoint].x)
			rightMostPoint = i;
	}

	var events = new Array();
	var currIndex = leftMostPoint;
	var currType;
	//loop through starting from left-most point
	for (var i = 0; i < obstacle.length;i++) {
		currIndex = (leftMostPoint+i)%obstacle.length;

		if (currIndex == leftMostPoint)
			currType = EVENT_TYPES.IN;
		else if (currIndex == rightMostPoint)
			currType = EVENT_TYPES.OUT;

		var curr = obstacle[currIndex];
		var next = obstacle[(currIndex+1)%obstacle.length];
		var prev = obstacle[(currIndex-1+obstacle.length)%obstacle.length];

		if (currType == EVENT_TYPES.IN) {
			events.push(
				new Event(
					obstacle[currIndex],
					currType,
					prev,
					next
					)
				);

			currType = EVENT_TYPES.CEILING;
		} else if (currType == EVENT_TYPES.OUT) {
			events.push(
				new Event(
					obstacle[currIndex],
					currType,
					next,
					prev
					)
				);
			currType = EVENT_TYPES.FLOOR;
		} else if (currType == EVENT_TYPES.FLOOR) {
			events.push(
				new Event(
					obstacle[currIndex],
					currType,
					prev
					)
				);
		} else if (currType == EVENT_TYPES.CEILING) {
			events.push(
				new Event(
					obstacle[currIndex],
					currType,
					undefined,
					next
					)
				);
		}
	}
	
	return events;
}

function getEventsForBoundary(boundary) {
	var events = getEventsForObstacle(boundary);

	for (var i = 0; i < events.length;i++) {
		if (events[i].type == EVENT_TYPES.IN)
			events[i].type = EVENT_TYPES.START;
		else if (events[i].type == EVENT_TYPES.OUT)
			events[i].type = EVENT_TYPES.END;
		else if (events[i].type == EVENT_TYPES.FLOOR)
			events[i].type = EVENT_TYPES.CEILING;
		else if (events[i].type == EVENT_TYPES.CEILING)
			events[i].type = EVENT_TYPES.FLOOR;
		
		var swap = events[i].ceiling;
		events[i].ceiling = events[i].floor;
		events[i].floor = swap;
	}

	return events;
}

function getEventsAtX(x) {
	var events = new Array();

	for (var i = 0; i < env.events.length; i++) {
		for (var j = 0; j < speed; j++) {
			if (env.events[i].point.x == Math.floor(x)+j)
				events.push(env.events[i]);
		}
	}
	events.sort(eventComparer);
	return events;
}

function eventComparer(e1, e2) {

	if (e1.type == EVENT_TYPES.START ||
		e2.type == EVENT_TYPES.END)
		return -1;
	else if (e2.type == EVENT_TYPES.START ||
		e1.type == EVENT_TYPES.END)
		return 1;

	if (e1.point.x == e2.point.x &&
		e1.type == e2.type) {
		if (e1.type == EVENT_TYPES.FLOOR) {
			return e1.point.y - e2.point.y;
		} else if (e1.type == EVENT_TYPES.CEILING) {
			return e2.point.y - e1.point.y;
		} else
			return e1.point.x - e2.point.x;
	} else
		return e1.point.x - e2.point.x;
}

var EVENT_TYPES = {
	IN: "IN",
	OUT: "OUT",
	FLOOR: "FLOOR",
	CEILING: "CEILING",
	START: "START",
	END: "END"
};

function Event(point, type, floor, ceiling) {
	return {
		point: point,
		type: type,
		floor: floor,
		ceiling: ceiling
	};
}