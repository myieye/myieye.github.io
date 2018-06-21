var envs;
var totalEnvs = 0;

function loadEnvironments() {
	envs = new Array();

	addDummyEnvironments();
}

function addDummyEnvironments() {
	addDummyEnvironment1();
	addDummyEnvironment2();
	addDummyEnvironment3();
}


function getEnvironmentById(id) {
	return envs[id];
}

function Point(x, y) {
	var Point = {
		x: x,
		y: y
	};

	return Point;
}

function addDummyEnvironment1() {
	var dummyArea =
		[
			new Point(130, 350),
			new Point(150, 480),
			new Point(400, 530),
			new Point(650, 470),
			new Point(750, 370),
			new Point(770, 270),
			new Point(730, 150),
			new Point(530, 50),
			new Point(330, 30),
			new Point(230, 40),
			new Point(50, 100),
			new Point(30, 230)
		];

	var dummyObstacles = [
		[
			new Point(220, 180),
			new Point(310, 230),
			new Point(370, 190),
			new Point(390, 160),
			new Point(340, 100),
			new Point(300, 130),
			new Point(200, 120)
		],
		[
			new Point(320, 380),
			new Point(510, 430),
			new Point(570, 390),
			new Point(590, 360),
			new Point(540, 300),
			new Point(500, 330),
			new Point(400, 320)
		],
		[
			new Point(610, 220),
			new Point(640, 140),
			new Point(600, 170),
			new Point(500, 160)
		]
	];

	envs[totalEnvs++] = {
		boundary: dummyArea,
		obstacles: dummyObstacles
	};
}

function addDummyEnvironment2() {
	var dummyArea =
		[
			new Point(100, 100),
			new Point(105, 500),
			new Point(300, 380),
			new Point(400, 540),
			new Point(600, 560),
			new Point(720, 330),
			new Point(725, 580),
			new Point(760, 400),
			new Point(770, 350),
			new Point(650, 200),
			new Point(600, 100),
			new Point(520, 150),
			new Point(500, 200),
			new Point(460, 200),
			new Point(420, 100),
			new Point(200, 200)
		];

	var dummyObstacles = [
		[
			new Point(220, 330),
			new Point(370, 340),
			new Point(390, 310),
			new Point(300, 250),
			new Point(290, 280),
			new Point(150, 270)
		],
		[
			new Point(510, 430),
			new Point(570, 390),
			new Point(590, 360),
			new Point(540, 300),
			new Point(500, 330),
			new Point(450, 360)
		],
		[
			new Point(570, 200),
			new Point(590, 200),
			new Point(610, 170),
			new Point(580, 170),
			new Point(560, 160)
		]
	];

	envs[totalEnvs++] = {
		boundary: dummyArea,
		obstacles: dummyObstacles
	};
}

function addDummyEnvironment3() {
	var dummyArea =
		[
			new Point(20, 50),
			new Point(20, 600),
			new Point(800, 600),
			new Point(800, 50)
		];

	var dummyObstacles = [
		[
			new Point(410, 150),
			new Point(210, 450),
			new Point(610, 450)
		]
	];

	envs[totalEnvs++] = {
		boundary: dummyArea,
		obstacles: dummyObstacles
	};
}

loadEnvironments();