const version = "v1.4.7";
const versionInfo = document.getElementById("versionInfo");

let setAutoMove;

let demoModel = {

	demo: document.getElementById("demo"),

}

let viewModel = {

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
	startPosition: 30,
	position: [],
	maxSnakeLength: 50, // should be max 324, because emptySquare = 324
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
			if (snake.position.length == snake.maxSnakeLength || snake.position.length >= viewModel.squareEmpty.length) {
				viewModel.squareAll[food.position].classList.remove("food");
				viewModel.gameWin("Congratulations! You are the biggest snake!");
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
			/*console.log("LEFT - " + this.activeKey);*/

			viewModel.buttonLeft.classList.add("buttonControlActive");
			viewModel.buttonRight.classList.remove("buttonControlActive");
			viewModel.buttonUp.classList.remove("buttonControlActive");
			viewModel.buttonDown.classList.remove("buttonControlActive");

			snake.position[0] = snake.position[0] - 1;
		} else if (this.activeKey == 39) {
			/*console.log("RIGHT - " + this.activeKey);*/

			viewModel.buttonLeft.classList.remove("buttonControlActive");
			viewModel.buttonRight.classList.add("buttonControlActive");
			viewModel.buttonUp.classList.remove("buttonControlActive");
			viewModel.buttonDown.classList.remove("buttonControlActive");

			snake.position[0] = snake.position[0] + 1;

		} else if (this.activeKey == 38) {
			/*console.log("UP - " + this.activeKey);*/

			viewModel.buttonLeft.classList.remove("buttonControlActive");
			viewModel.buttonRight.classList.remove("buttonControlActive");
			viewModel.buttonUp.classList.add("buttonControlActive");
			viewModel.buttonDown.classList.remove("buttonControlActive");

			snake.position[0] = snake.position[0] - 20;
		} else if (this.activeKey == 40) {
			/*console.log("DOWN - " + this.activeKey);*/

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

	// ============================================

	addEventListener("keydown", function(event) {
		pressKey(event.keyCode);
	});

	// ============================================

	var startPoint={};
	var nowPoint;
	var ldelay;
	
	viewModel.boxGame.addEventListener('touchstart', function(event) {
		event.preventDefault();
		event.stopPropagation();
		startPoint.x = event.changedTouches[0].pageX;
		startPoint.y = event.changedTouches[0].pageY;
		ldelay = new Date();
	}, false);

	/*Ловим движение пальцем*/
	viewModel.boxGame.addEventListener('touchmove', function(event) {
		event.preventDefault();
		event.stopPropagation();
		var otk = {};
		nowPoint = event.changedTouches[0];
		otk.x = nowPoint.pageX - startPoint.x;
		/*Обработайте данные*/
		/*Для примера*/
		if (Math.abs(otk.x) > 200) {
			if (otk.x < 0) {
				/*СВАЙП ВЛЕВО(ПРЕД.СТРАНИЦА)*/
			}
			if (otk.x > 0) {
				/*СВАЙП ВПРАВО(СЛЕД.СТРАНИЦА)*/
			}
			startPoint = {
				x:nowPoint.pageX,y:nowPoint.pageY
			};
		}
	}, false);

	/*Ловим отпускание пальца*/
	viewModel.boxGame.addEventListener('touchend', function(event) {
		var pdelay = new Date();
		nowPoint = event.changedTouches[0];
		var xAbs = Math.abs(startPoint.x - nowPoint.pageX);
		var yAbs = Math.abs(startPoint.y - nowPoint.pageY);
		if ((xAbs > 20 || yAbs > 20) && (pdelay.getTime()-ldelay.getTime()) < 200) {
			if (xAbs > yAbs) {
				if (nowPoint.pageX < startPoint.x) {
					/*console.log("влево");*/
					pressKey(37);
				}
				else {
					/*console.log("право");*/
					pressKey(39);
				}
			}
			else {
				if (nowPoint.pageY < startPoint.y) {
					/*console.log("вверх");*/
					pressKey(38);
				}
				else {
					/*console.log("вниз");*/
					pressKey(40);
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

/*var treshold = 10; // пороговое значение (если расстояние тача больше него, значит у нас свайп, а не клик)
var touchStart = { // тут храним начальные координаты тача
	x: 0,
	y: 0
};

const slider = document.getElementById("boxGame");
let startPoint;
let moved = false;
function touch(e) {
	e.preventDefault();
	startPoint = e.changedTouches[0].pageX;
}
function move(e) {
	if (moved) {
		return;
	}
	e.preventDefault();
	if (e.changedTouches[0].pageX > startPoint + slider.offsetWidth / 4) {
		console.log("направо");
		moved = true;
	}
	if (e.changedTouches[0].pageX < startPoint - slider.offsetWidth / 4) {
		console.log("налево");
		moved = true;
	}
}
slider.addEventListener("touchmove", move);
slider.addEventListener("touchstart", touch);
slider.addEventListener("touchend", () => {
	setTimeout(() => {
		moved = !moved;
	}, 200);
});*/

