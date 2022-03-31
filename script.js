let viewModel = {
	amountSquare: 400,

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

	eventKey: null,
	activeKey: null,

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

			gameModel.loadGame();
		}
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

	pressConBut: function (controlButton) {
		console.log(controlButton);
		viewModel.eventKey = controlButton;

		if (controlButton == 37) {
			this.buttonLeft.classList.add("buttonActive");
			this.buttonRight.classList.remove("buttonActive");
			this.buttonUp.classList.remove("buttonActive");
			this.buttonDown.classList.remove("buttonActive");
		} else if (controlButton == 39) {
			this.buttonLeft.classList.remove("buttonActive");
			this.buttonRight.classList.add("buttonActive");
			this.buttonUp.classList.remove("buttonActive");
			this.buttonDown.classList.remove("buttonActive");
		} else if (controlButton == 38) {
			this.buttonLeft.classList.remove("buttonActive");
			this.buttonRight.classList.remove("buttonActive");
			this.buttonUp.classList.add("buttonActive");
			this.buttonDown.classList.remove("buttonActive");
		} else if (controlButton == 40) {
			this.buttonLeft.classList.remove("buttonActive");
			this.buttonRight.classList.remove("buttonActive");
			this.buttonUp.classList.remove("buttonActive");
			this.buttonDown.classList.add("buttonActive");
		}
	}

}

let gameModel = {
	startSnakeLength: 3,

	loadGame: function() {
		console.log("LOAD GAME!");

		viewModel.spanScore.innerHTML = this.startSnakeLength;
	}
}

// ============================================
// INIT
// ============================================

function init() {
	// ============================================
	// RENDER OF ARENA
	// ============================================

	const boxGame = document.getElementById("boxGame");
	const w = document.getElementById("w");
	const h = document.getElementById("h");
	const { width, height } = boxGame.getBoundingClientRect();

	w.innerHTML = width;
	h.innerHTML = height;

	for (let i = 1; i <= viewModel.amountSquare; i++) {

		let div = document.createElement("div");
		div.classList.add("squareEmpty");
		div.textContent = i; // for count. this is temperarily!
		boxGame.append(div);
		console.log(i);
	}

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
			viewModel.pressConBut(key);
		} else if (viewModel.startGameValue && key === 80) {
			viewModel.pauseGame();
		}
	}

	// ============================================
}

window.onload = init;