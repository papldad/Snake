const version = "v1.3";
const versionInfo = document.getElementById("versionInfo");

let setAutoMove;

let viewModel = {

	boxGame: document.getElementById("boxGame"),
	amountSquare: 400,
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
			versionInfo.style.display = "none";
			this.scoreInfo.style.display = "block";
			this.buttonsControlLeft.style.display = "block";
			this.buttonsControlCenter.style.display = "block";
			this.buttonsControlRight.style.display = "block";

			this.buttonStart.textContent = "Restart";

			this.controlButtonValue = true;

			if (this.renderArena()) {
				gameModel.loadGame();
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
		/*console.log("squareEmpty: " + this.squareEmpty);
		console.log("squareBorder: " + this.squareBorder);*/
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

	gameOver: function (message) {
		if (this.pauseGameValue == false) {
			this.pauseGame();
		}
		this.buttonsControlCenter.style.display = "none";
		this.statusInfo.style.display = "block";
		this.spanStatus.style.color = "var(--food)";
		this.spanStatus.textContent = "Game Over! " + message;
		this.gameOverValue = true;
	},

	gameWin: function (message) {
		if (this.pauseGameValue == false) {
			this.pauseGame();
		}
		this.buttonsControlCenter.style.display = "none";
		this.statusInfo.style.display = "block";
		this.spanStatus.style.color = "var(--snakeBody)";
		this.spanStatus.textContent = "Winner! " + message;
		this.gameWinValue = true;
	},

}

let snake = {
	startSnakeLength: 4,
	startPosition: 190,
	position: [],
	maxSnakeLength: 50,
}

let food = {
	amountOnArena: 1,
	position: undefined,
}

let gameModel = {
	
	eventKey: null,
	activeKey: null,
	speedGame: 200,

	loadGame: function() {
		if (this.spawnSnake()) {
			viewModel.spanScore.textContent = snake.position.length;
			this.renderSnake();
			this.spawnFood();
			this.autoMove();
		}
	},

	spawnSnake: function () {
		snake.position[0] = snake.startPosition;
		for (let i = 1; i < snake.startSnakeLength; i++) {
			snake.position[i] = snake.position[i - 1] - 1;
		}
		this.eventKey = 39;
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

	spawnFood: function () {
		if (food.position !== undefined) {
			viewModel.squareAll[food.position].classList.remove("food");
		}

		function diff(a1, a2) {
			return a1.filter(i=>a2.indexOf(i)<0).concat(a2.filter(i=>a1.indexOf(i)<0));
		}
		let allowedNumber = diff(viewModel.squareEmpty, snake.position);

		var rand = Math.floor(Math.random() * allowedNumber.length);
		food.position = allowedNumber[rand];

		viewModel.squareAll[food.position].classList.add("food");
	}, 

	checkPositionSnake: function (positionSnake) {
		for (let x = 1; x < positionSnake.length; x++) {
			if (positionSnake[0] == positionSnake[x]) {
				viewModel.gameOver("Head Snake ate body.");
				return false;
			}
		}

		let snakeOnBorder = viewModel.squareBorder.filter(el => positionSnake.indexOf(el) > -1);
		
		if (snakeOnBorder.length != 0) {
			viewModel.gameOver("Snake on the border.");
			return false;
		} else if (positionSnake[0] === food.position) {
			snake.position.push(snake.position[snake.position.length-1]);
			viewModel.spanScore.textContent = snake.position.length;
			if (snake.position.length == snake.maxSnakeLength) {
				viewModel.squareAll[food.position].classList.remove("food");
				viewModel.gameWin("Congratulations!");
			} else {
				this.spawnFood();
			}
		} else {
			return true;
		}
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
			console.log("LEFT - " + this.activeKey);

			viewModel.buttonLeft.classList.add("buttonControlActive");
			viewModel.buttonRight.classList.remove("buttonControlActive");
			viewModel.buttonUp.classList.remove("buttonControlActive");
			viewModel.buttonDown.classList.remove("buttonControlActive");

			snake.position[0] = snake.position[0] - 1;
		} else if (this.activeKey == 39) {
			console.log("RIGHT - " + this.activeKey);

			viewModel.buttonLeft.classList.remove("buttonControlActive");
			viewModel.buttonRight.classList.add("buttonControlActive");
			viewModel.buttonUp.classList.remove("buttonControlActive");
			viewModel.buttonDown.classList.remove("buttonControlActive");

			snake.position[0] = snake.position[0] + 1;

		} else if (this.activeKey == 38) {
			console.log("UP - " + this.activeKey);

			viewModel.buttonLeft.classList.remove("buttonControlActive");
			viewModel.buttonRight.classList.remove("buttonControlActive");
			viewModel.buttonUp.classList.add("buttonControlActive");
			viewModel.buttonDown.classList.remove("buttonControlActive");

			snake.position[0] = snake.position[0] - 20;
		} else if (this.activeKey == 40) {
			console.log("DOWN - " + this.activeKey);

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

	addEventListener("keydown", function(event) {
		pressKey(event.keyCode);
	});

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