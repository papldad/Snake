const version = "v1.1.10-1";
const versionInfo = document.getElementById("versionInfo");

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
		if (this.pauseGameValue == false) {
			this.pauseGame();
		}
		this.buttonsControlCenter.style.display = "none";
		this.statusInfo.style.display = "block";
		this.spanStatus.style.color = "var(--food)";
		this.spanStatus.innerHTML = "Game Over! " + message;
	},

}

let snake = {
	startSnakeLength: 5,
	startPosition: 190,
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
		if (this.spawnSnake()) {
			viewModel.spanScore.innerHTML = snake.position.length;
			this.renderSnake();
		}
	},

	spawnSnake: function () {
		snake.position[0] = snake.startPosition;
		for (let i = 1; i < snake.startSnakeLength; i++) {
			snake.position[i] = snake.position[i - 1] - 1;
		}
		return true;
	},

	renderSnake: function () {
		viewModel.squareAll[snake.position[0]].classList.add("snakeHead");
		for (let i = 1; i < snake.position.length; i++) {
			viewModel.squareAll[snake.position[i]].classList.add("snakeBody");
		}
		this.checkPositionSnake(snake.position);
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
		} else {
			return true;
		}
	},

	directionSnake: function (controlButton) {
		this.eventKey = controlButton;
		let oldPositionSnake = snake.position.slice();

		if (controlButton == 37) {
			console.log("LEFT - " + controlButton);

			viewModel.buttonLeft.classList.add("buttonActive");
			viewModel.buttonRight.classList.remove("buttonActive");
			viewModel.buttonUp.classList.remove("buttonActive");
			viewModel.buttonDown.classList.remove("buttonActive");

			snake.position[0] = snake.position[0] - 1;
		} else if (controlButton == 39) {
			console.log("RIGHT - " + controlButton);

			viewModel.buttonLeft.classList.remove("buttonActive");
			viewModel.buttonRight.classList.add("buttonActive");
			viewModel.buttonUp.classList.remove("buttonActive");
			viewModel.buttonDown.classList.remove("buttonActive");

			snake.position[0] = snake.position[0] + 1;

		} else if (controlButton == 38) {
			console.log("UP - " + controlButton);

			viewModel.buttonLeft.classList.remove("buttonActive");
			viewModel.buttonRight.classList.remove("buttonActive");
			viewModel.buttonUp.classList.add("buttonActive");
			viewModel.buttonDown.classList.remove("buttonActive");

			snake.position[0] = snake.position[0] - 20;
		} else if (controlButton == 40) {
			console.log("DOWN - " + controlButton);

			viewModel.buttonLeft.classList.remove("buttonActive");
			viewModel.buttonRight.classList.remove("buttonActive");
			viewModel.buttonUp.classList.remove("buttonActive");
			viewModel.buttonDown.classList.add("buttonActive");

			snake.position[0] = snake.position[0] + 20;
		}
		viewModel.squareAll[oldPositionSnake[0]].classList.remove("snakeHead");
		for (let i = 1; i < snake.position.length; i++) {
			viewModel.squareAll[oldPositionSnake[i]].classList.remove("snakeBody");
			snake.position[i] = oldPositionSnake[i - 1];
		}
		this.renderSnake();
	},
}

// ============================================
// INIT
// ============================================

function init() {
	// ============================================
	versionInfo.innerHTML = version;
	// ============================================

	// ============================================
	// fix user-scalable=no for ios
	// ============================================

	/*document.addEventListener('touchmove', function (event) {
		if (event.scale !== 1) {
			event.preventDefault(); 
		}
	}, false);*/

	window.addEventListener(
    		"touchmove",
    		function(event) {
        	if (event.scale !== 1) {
           	 event.preventDefault();
        	}
   		 },
   	 		{ passive: false }
	);

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
			gameModel.directionSnake(key);
		} else if (viewModel.startGameValue && key === 80) {
			viewModel.pauseGame();
		}
	}

	// ============================================
}

window.onload = init;
