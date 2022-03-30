function init() {

	// ============================================

	console.log("init is ok.");
	console.log("=================================");

	// ============================================
	// 
	// ============================================

	let eventKey;
	let activeKey;

	let startGameValue = false;
	let buttonStart = document.getElementById("83");
	let scoreInfo = document.getElementById("scoreInfo");
	
	let pauseGameValue;
	let buttonPause = document.getElementById("80");

	let assentPressButton = false;
	let buttonLeft = document.getElementById("37");
	let buttonRight = document.getElementById("39");
	let buttonUp = document.getElementById("38");
	let buttonDown = document.getElementById("40");

	let buttonsControlLeft = document.getElementById("buttonsControlLeft");
	let buttonsControlCenter = document.getElementById("buttonsControlCenter");
	let buttonsControlRight = document.getElementById("buttonsControlRight");

	function startGame() {
		if (startGameValue) {
			if (!pauseGameValue) {
				pauseGame();
			}
			const restart = confirm("Restart?");
			if (restart) {
				document.location.reload();
			}
		} else {
			startGameValue = true;
			scoreInfo.style.display = "block";
			buttonsControlLeft.style.display = "block";
			buttonsControlCenter.style.display = "block";
			buttonsControlRight.style.display = "block";

			buttonStart.innerHTML = "Restart";

			assentPressButton = true;

			/*LOAD GAME()*/
		}
	}

	function pauseGame() {
		if (pauseGameValue) {
			pauseGameValue = false;
			buttonPause.classList.remove("buttonActive");
			buttonsControlLeft.style.display = "block";
			buttonsControlRight.style.display = "block";
			assentPressButton = true;
		} else {
			pauseGameValue = true;
			buttonPause.classList.add("buttonActive");
			buttonsControlLeft.style.display = "none";
			buttonsControlRight.style.display = "none";
			assentPressButton = false;
			/*stopGame()*/
		}
	}

	function pressConBut(controlButton) {
		console.log(controlButton);
		if (controlButton == 37) {
			buttonLeft.classList.add("buttonActive");
			buttonRight.classList.remove("buttonActive");
			buttonUp.classList.remove("buttonActive");
			buttonDown.classList.remove("buttonActive");
		} else if (controlButton == 39) {
			buttonLeft.classList.remove("buttonActive");
			buttonRight.classList.add("buttonActive");
			buttonUp.classList.remove("buttonActive");
			buttonDown.classList.remove("buttonActive");
		} else if (controlButton == 38) {
			buttonLeft.classList.remove("buttonActive");
			buttonRight.classList.remove("buttonActive");
			buttonUp.classList.add("buttonActive");
			buttonDown.classList.remove("buttonActive");
		} else if (controlButton == 40) {
			buttonLeft.classList.remove("buttonActive");
			buttonRight.classList.remove("buttonActive");
			buttonUp.classList.remove("buttonActive");
			buttonDown.classList.add("buttonActive");
		}
	}

	// ============================================
	// BIND
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
		eventKey = key;
		if (eventKey === 83) {
			startGame();
		} else if (assentPressButton && (eventKey === 37 || eventKey === 39 || eventKey === 38 || eventKey === 40)) {
			pressConBut(eventKey);
		} else if (startGameValue && eventKey === 80) {
			pauseGame();
		}
	}

	// ============================================

}

window.onload = init;