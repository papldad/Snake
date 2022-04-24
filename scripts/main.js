const version = "v1.7.2";
const versionInfo = document.getElementById("versionInfo");

let demoModel = {
	demo: document.getElementById("demo"),
}

let settingsGame = {
	arenaLength: document.getElementsByName('arenaLength'),
	snakeLength: document.getElementsByName('snakeLength'),
	maxSnakeLength: document.getElementsByName('maxSnakeLength'),
	amountFood: document.getElementsByName('amountFood'),
	speedGame: document.getElementsByName('speedGame'),

	getValuesSettings: function() {
		let selArenaLength = Array.from(this.arenaLength).find(radio => radio.checked);
		let valArena = selArenaLength.value;
		let selSnakeLength = Array.from(this.snakeLength).find(radio => radio.checked);
		let valSnake = selSnakeLength.value;
		let selMaxSnakeLength = Array.from(this.maxSnakeLength).find(radio => radio.checked);
		let valMaxSnake = selMaxSnakeLength.value;
		let selAmountFood = Array.from(this.amountFood).find(radio => radio.checked);
		let valAmountFood = selAmountFood.value;
		let selSpeedGame = Array.from(this.speedGame).find(radio => radio.checked);
		let valSpeedGame = selSpeedGame.value;

		if (!(valArena == 80 || valArena == 200 || valArena == 400)) {
			return false;
		} else {
			viewModel.amountSquare = valArena;
		}

		if (!(valSnake == 1 || valSnake == 4 || valSnake == 10)) {
			return false;
		} else {
			snake.startSnakeLength = valSnake;
		}

		if (!(valMaxSnake == 15 || valMaxSnake == 25 || valMaxSnake == 50 || valMaxSnake == 324)) {
			return false;
		} else {
			snake.maxSnakeLength = valMaxSnake;
		}

		if (!(valAmountFood == 1 || valAmountFood == 2 || valAmountFood == 15 || valAmountFood == 100)) {
			return false;
		} else {
			food.amountOnArena = valAmountFood;
		}

		if (!(valSpeedGame == 800 || valSpeedGame == 500 || valSpeedGame == 200)) {
			return false;
		} else {
			gameModel.speedGame = valSpeedGame;
		}

		return true;
	}


}

let viewModel = {
	containerGame: document.getElementById("containerGame"),
	boxGame: document.getElementById("boxGame"),
	amountSquare: 400, // min 80, max 400
	squareAll: document.getElementsByClassName("squareEmpty"),
	squareEmpty: [],
	squareBorder: [],

	buttonStart: document.getElementById("83"),
	buttonPause: document.getElementById("80"),
	buttonLeft: document.getElementById("37"),
	buttonRight: document.getElementById("39"),
	buttonUp: document.getElementById("38"),
	buttonDown: document.getElementById("40"),

	buttonsControlLeft: document.getElementById("buttonsControlLeft"),
	buttonsControlCenter: document.getElementById("buttonsControlCenter"),
	buttonsControlRight: document.getElementById("buttonsControlRight"),

	scoreInfo: document.getElementById("scoreInfo"),
	spanScore: document.getElementById("spanScore"),
	statusInfo: document.getElementById("statusInfo"),
	spanStatus: document.getElementById("spanStatus"),

	startGameValue: false,
	pauseGameValue: false,
	controlButtonValue: false,
	gameOverValue: false,
	gameWinValue: false,

	startGame: function () {
		if (this.startGameValue) {
			if (!this.pauseGameValue) {
				this.pauseGame();
			}
			const restart = confirm("Restart?");
			if (restart) {
				document.location.reload();
			}
		} else {

			this.startGameValue = true;
			demoModel.demo.style.display = "none";
			this.scoreInfo.style.display = "block";
			this.containerGame.classList.add("containerGameActive");
			this.boxGame.classList.add("boxGameActive");
			this.buttonsControlLeft.style.display = "block";
			this.buttonsControlCenter.style.display = "block";
			this.buttonsControlRight.style.display = "block";

			this.buttonStart.textContent = "Restart";

			this.controlButtonValue = true;

			if (settingsGame.getValuesSettings() && this.renderArena()) {
				gameModel.loadGame();
			} else {
				console.log("Code have some errors.");
			}
		}
	},

	renderArena: function () {
		for (let i = 0; i < this.amountSquare; i++) {
			let div = document.createElement("div");
			div.classList.add("squareEmpty");
			/*div.textContent = i; // for count. this is temperarily!*/
			if (i <= 20 || (i % 20) == 19 || (i % 20) == 0 || i >= (this.amountSquare - 20)) {
				div.classList.add("squareBorder");
				this.squareBorder.push(i);
			} else {
				this.squareEmpty.push(i);
			}
			this.boxGame.append(div);
		}
		return true;		
	},

	pauseGame: function () {
		if (this.pauseGameValue && this.gameOverValue === false && this.gameWinValue === false) {
			this.pauseGameValue = false;
			this.buttonPause.classList.remove("buttonActive");
			this.buttonsControlLeft.style.display = "block";
			this.buttonsControlRight.style.display = "block";
			this.controlButtonValue = true;
			gameModel.autoMove();
		} else if (this.gameOverValue === false && this.gameWinValue === false) {
			this.pauseGameValue = true;
			this.buttonPause.classList.add("buttonActive");
			this.buttonsControlLeft.style.display = "none";
			this.buttonsControlRight.style.display = "none";
			this.controlButtonValue = false;
			clearInterval(setAutoMove);
		}
	},

	endGame: function (status, message) {
		if (this.pauseGameValue == false) {
			this.pauseGame();
		}
		this.buttonsControlCenter.style.display = "none";
		this.statusInfo.style.display = "block";
		if (status === "gameWin") {
			this.spanStatus.style.color = "var(--snakeBody)";
			this.spanStatus.textContent = "Winner! " + message;
			this.gameWinValue = true;
		} else if (status === "gameOver") {
			this.spanStatus.style.color = "var(--food)";
			this.spanStatus.textContent = "Game Over! " + message;
			this.gameOverValue = true;
		}
		
	},

}

let snake = {
	startSnakeLength: 4,
	startPosition: 30, // What is the starting position of the snake.
	position: [],
	maxSnakeLength: 324, // Value for win.
}

let food = {
	amountOnArena: 1,
	position: [],
}

let setAutoMove;

let gameModel = {
	
	eventKey: null,
	activeKey: null,
	speedGame: 500, // min 200

	loadGame: function() {
		if (this.spawnSnake()) {
			viewModel.spanScore.textContent = snake.position.length;
			this.renderSnake();
			this.spawnFoods();
			this.autoMove();
		}
	},

	spawnSnake: function () {
		snake.position[0] = snake.startPosition;
		for (let i = 1; i < snake.startSnakeLength; i++) {
			snake.position[i] = snake.position[i - 1] - 1;
		}
		this.eventKey = 39; // First movement of the snake.
		this.activeKey = this.eventKey;
		return true;
	},

	renderSnake: function () {
		viewModel.squareAll[snake.position[0]].classList.add("snakeHead");
		for (let i = 1; i < snake.position.length; i++) {
			viewModel.squareAll[snake.position[i]].classList.add("snakeBody");
		}
		this.checkPositionSnake(snake.position);
	},

	spawnFoods: function(posEatenFood) { // Get number square eaten a food.
		let availableSquareForFood = [];
		let positionEatenFood = food.position.indexOf(posEatenFood);

		function updateSquareForFood() {
			function diff(a1, a2) {
				return a1.filter(i=>a2.indexOf(i)<0).concat(a2.filter(i=>a1.indexOf(i)<0));
			}
			return diff(diff(viewModel.squareEmpty, snake.position), food.position);
		}

		function generatorPositions() {
			availableSquareForFood = updateSquareForFood().slice(0);
			let rand = Math.floor(Math.random() * availableSquareForFood.length);
			return availableSquareForFood[rand];
		}

		function renderFood(newPosition) {
			food.position.push(newPosition);
			viewModel.squareAll[newPosition].classList.add("food");
			return;
		}

		if (positionEatenFood != -1) { // For respawn eaten food.

			viewModel.squareAll[food.position[positionEatenFood]].classList.remove("food");
			food.position.splice(positionEatenFood, 1);

			availableSquareForFood = updateSquareForFood().slice(0);
			if (availableSquareForFood.length != 0) {
				renderFood(generatorPositions());
			} else {
				return;
			}
		} else { // For first spawn food.
			for (let n = 0; n < food.amountOnArena; n++) {
				availableSquareForFood = updateSquareForFood().slice(0);
				if (availableSquareForFood.length != 0) {
					renderFood(generatorPositions());
				} else {
					return;
				}
			}
		}
	},

	checkPositionSnake: function (positionSnake) {
		for (let x = 1; x < positionSnake.length; x++) {
			if (positionSnake[0] == positionSnake[x]) {
				viewModel.endGame("gameOver", "Head Snake ate body.");
				return false;
			}
		}

		let snakeOnBorder = viewModel.squareBorder.filter(el => positionSnake.indexOf(el) > -1);
		if (snakeOnBorder.length != 0) {
			viewModel.endGame("gameOver", "Snake on the border.");
			return false;
		}

		food.position.filter(function (positionFood) { // Checking snakes positions about foods.
			if (positionFood === positionSnake[0]) {
				if (snake.position.length >= snake.maxSnakeLength || snake.position.length >= viewModel.squareEmpty.length) {
					viewModel.squareAll[positionFood].classList.remove("food");
					viewModel.endGame("gameWin", "Congratulations! You are the biggest snake!");
				} else {
					gameModel.spawnFoods(positionFood); // Send to spawnFoods number square eaten a food.
				}

				snake.position.push(snake.position[snake.position.length-1]);
				viewModel.spanScore.textContent = snake.position.length;
			}
		});

		return true;
	},

	directionSnake: function () {
		if (this.activeKey == 37 && this.eventKey == 39) {
			this.activeKey = 37;
		} else if (this.activeKey == 39 && this.eventKey == 37) {
			this.activeKey = 39;
		} else if (this.activeKey == 38 && this.eventKey == 40) {
			this.activeKey = 38;
		} else if (this.activeKey == 40 && this.eventKey == 38) {
			this.activeKey = 40;
		} else {
			this.activeKey = this.eventKey;
		}

		let oldPositionSnake = snake.position.slice();

		if (this.activeKey == 37) {
			viewModel.buttonLeft.classList.add("buttonControlActive");
			viewModel.buttonRight.classList.remove("buttonControlActive");
			viewModel.buttonUp.classList.remove("buttonControlActive");
			viewModel.buttonDown.classList.remove("buttonControlActive");

			snake.position[0] = snake.position[0] - 1;
		} else if (this.activeKey == 39) {
			viewModel.buttonLeft.classList.remove("buttonControlActive");
			viewModel.buttonRight.classList.add("buttonControlActive");
			viewModel.buttonUp.classList.remove("buttonControlActive");
			viewModel.buttonDown.classList.remove("buttonControlActive");

			snake.position[0] = snake.position[0] + 1;

		} else if (this.activeKey == 38) {
			viewModel.buttonLeft.classList.remove("buttonControlActive");
			viewModel.buttonRight.classList.remove("buttonControlActive");
			viewModel.buttonUp.classList.add("buttonControlActive");
			viewModel.buttonDown.classList.remove("buttonControlActive");

			snake.position[0] = snake.position[0] - 20;
		} else if (this.activeKey == 40) {
			viewModel.buttonLeft.classList.remove("buttonControlActive");
			viewModel.buttonRight.classList.remove("buttonControlActive");
			viewModel.buttonUp.classList.remove("buttonControlActive");
			viewModel.buttonDown.classList.add("buttonControlActive");

			snake.position[0] = snake.position[0] + 20;
		}

		viewModel.squareAll[oldPositionSnake[0]].classList.remove("snakeHead");
		for (let i = 1; i < snake.position.length; i++) {
			viewModel.squareAll[oldPositionSnake[i]].classList.remove("snakeBody");
			snake.position[i] = oldPositionSnake[i - 1];
		}
		this.renderSnake();
	},

	autoMove: function () {
		setAutoMove = setInterval(() => this.directionSnake(), this.speedGame);
	},
}

// ============================================
// INIT
// ============================================

function init() {

	$( "#parSettings" ).click(function(){ // Animation of "settings".
		$( "#settingsValue" ).slideToggle();
		$( "#splashScreen" ).slideToggle();
		$( "#parSettings" ).toggleClass( "settingsParActive" );

	});

	// ============================================
	versionInfo.textContent = version;
	// ============================================

	// ============================================
	// CONTROL
	// ============================================

	let buttons = document.querySelectorAll('button');

	buttons.forEach(button => {
		button.addEventListener('click', function () {
			pressKey(Number(button.id));
		});
	});

	// ============================================

	addEventListener("keydown", function(event) {
		pressKey(event.keyCode);
	});

	// ============================================

	let startPoint = {};
	let nowPoint;
	let ldelay;
	
	viewModel.boxGame.addEventListener('touchstart', function(event) {
		if (viewModel.controlButtonValue) {
			event.preventDefault();
			event.stopPropagation();
			startPoint.x = event.changedTouches[0].pageX;
			startPoint.y = event.changedTouches[0].pageY;
			ldelay = new Date();
		}
	}, false);

	viewModel.boxGame.addEventListener('touchmove', function(event) {
		if (viewModel.controlButtonValue) {
			event.preventDefault();
			event.stopPropagation();
			let otk = {};
			nowPoint = event.changedTouches[0];
			otk.x = nowPoint.pageX - startPoint.x;
			if (Math.abs(otk.x) > 200) {
				startPoint = {
					x:nowPoint.pageX,y:nowPoint.pageY
				};
			}
		}
	}, false);

	viewModel.boxGame.addEventListener('touchend', function(event) {
		if (viewModel.controlButtonValue) {
			let pdelay = new Date();
			nowPoint = event.changedTouches[0];
			let xAbs = Math.abs(startPoint.x - nowPoint.pageX);
			let yAbs = Math.abs(startPoint.y - nowPoint.pageY);
			if ((xAbs > 20 || yAbs > 20) && (pdelay.getTime()-ldelay.getTime()) < 200) {
				if (xAbs > yAbs) {
					if (nowPoint.pageX < startPoint.x) {
						pressKey(37);
					}
					else {
						pressKey(39);
					}
				}
				else {
					if (nowPoint.pageY < startPoint.y) {
						pressKey(38);
					}
					else {
						pressKey(40);
					}
				}
			}
		}
	}, false);

	// ============================================

	function pressKey(key) {
		if (key === 83) {
			viewModel.startGame();
		} else if (viewModel.controlButtonValue && (key === 37 || key === 39 || key === 38 || key === 40)) {
			gameModel.eventKey = key;
		} else if (viewModel.startGameValue && key === 80) {
			viewModel.pauseGame();
		}
	}

	// ============================================
}

window.onload = init;