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

	startGameValue: false,
	pauseGameValue: false,
	controlButtonValue: false,

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
			this.scoreInfo.style.display = "block";
			this.buttonsControlLeft.style.display = "block";
			this.buttonsControlCenter.style.display = "block";
			this.buttonsControlRight.style.display = "block";

			this.buttonStart.innerHTML = "Restart";

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
			div.textContent = i; // for count. this is temperarily!
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
		if (this.pauseGameValue) {
			this.pauseGameValue = false;
			this.buttonPause.classList.remove("buttonActive");
			this.buttonsControlLeft.style.display = "block";
			this.buttonsControlRight.style.display = "block";
			this.controlButtonValue = true;
		} else {
			this.pauseGameValue = true;
			this.buttonPause.classList.add("buttonActive");
			this.buttonsControlLeft.style.display = "none";
			this.buttonsControlRight.style.display = "none";
			this.controlButtonValue = false;
		}
	},

	gameOver: function (message) {
		console.log("GAME OVER! " + message);
		if (this.pauseGameValue == false) {
			this.pauseGame();
		}
		this.buttonsControlCenter.style.display = "none";
	},

}

let snake = {
	startSnakeLength: 3,
	startPosition: 184,
	position: [],
}

let food = {
	amountOnArena: 1,
	startPosition: 150,
	position: undefined,
}

let gameModel = {
	
	eventKey: null,
	activeKey: null,

	loadGame: function() {
		console.log("LOAD GAME!");
		this.renderSnakeStart();
	},

	renderSnakeStart: function () {
		for (let i = 0; i < snake.startSnakeLength; i++) {
			if (i == 0) {
				snake.position[i] = snake.startPosition;
			} else {
				snake.position[i] = snake.position[i - 1] - 1;
			}
		}
		if (this.checkPositionSnake(snake.position)) {
			this.renderSnake();
		}
	},

	checkPositionSnake: function (positionSnake) {
		let snakeOnBorder = viewModel.squareBorder.filter(el => positionSnake.indexOf(el) > -1);
		
		if (snakeOnBorder.length != 0) {
			viewModel.gameOver("Snake on the border: " + snakeOnBorder);
			return false;
		} else {
			return true;
		}
	},

	renderSnake: function () {
		viewModel.spanScore.innerHTML = snake.startSnakeLength;

		viewModel.squareAll[snake.position[0]].classList.add("snakeHead");
		for (let i = 1; i < snake.position.length; i++) {
			viewModel.squareAll[snake.position[i]].classList.add("snakeBody");
		}
	},

	directionSnake: function (controlButton) {
		this.eventKey = controlButton;

		if (controlButton == 37) {
			console.log("LEFT - " + controlButton);
			viewModel.buttonLeft.classList.add("buttonActive");
			viewModel.buttonRight.classList.remove("buttonActive");
			viewModel.buttonUp.classList.remove("buttonActive");
			viewModel.buttonDown.classList.remove("buttonActive");
		} else if (controlButton == 39) {
			console.log("RIGHT - " + controlButton);
			viewModel.buttonLeft.classList.remove("buttonActive");
			viewModel.buttonRight.classList.add("buttonActive");
			viewModel.buttonUp.classList.remove("buttonActive");
			viewModel.buttonDown.classList.remove("buttonActive");
		} else if (controlButton == 38) {
			console.log("UP - " + controlButton);
			viewModel.buttonLeft.classList.remove("buttonActive");
			viewModel.buttonRight.classList.remove("buttonActive");
			viewModel.buttonUp.classList.add("buttonActive");
			viewModel.buttonDown.classList.remove("buttonActive");
		} else if (controlButton == 40) {
			console.log("DOWN - " + controlButton);
			viewModel.buttonLeft.classList.remove("buttonActive");
			viewModel.buttonRight.classList.remove("buttonActive");
			viewModel.buttonUp.classList.remove("buttonActive");
			viewModel.buttonDown.classList.add("buttonActive");
		}
	},
}

// ============================================
// INIT
// ============================================

function init() {
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
			gameModel.directionSnake(key);
		} else if (viewModel.startGameValue && key === 80) {
			viewModel.pauseGame();
		}
	}

	// ============================================
}

window.onload = init;