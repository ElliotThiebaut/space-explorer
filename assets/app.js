// Firebase configuration
var firebaseConfig = {
	apiKey: 'AIzaSyDJg4Fe8yrAO3wNa-8Y29spc9_uHRxLqvs',
	authDomain: 'space-explorer-e3e10.firebaseapp.com',
	databaseURL: 'https://space-explorer-e3e10-default-rtdb.firebaseio.com',
	projectId: 'space-explorer-e3e10',
	storageBucket: 'space-explorer-e3e10.appspot.com',
	messagingSenderId: '35947797301',
	appId: '1:35947797301:web:5f1625e433472476e30a7c'
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

// Variable definitions
let playerPseudo = '';
let score = 0;
let clockInterval;
let ennemiesInterval;
let playing = false;

// Gsap animation def
let timeline_1 = gsap.timeline({ repeat: -1 });
let timeline_2 = gsap.timeline({ repeat: -1 });
let bot3_anim;
let bot4_anim;

// HTML element def
let gameOverDiv = document.getElementById('gameOverText');

// Audio def
let currentMusic = new Audio();
let soundtrack_1 = new Audio('assets/music/soundtrack_1.mp3');
let soundtrack_2 = new Audio('assets/music/soundtrack_2.mp3');
let soundtrack_3 = new Audio('assets/music/soundtrack_3.mp3');
let soundtrack_4 = new Audio('assets/music/soundtrack_4.mp3');

let menuTheme = new Audio('assets/music/menu_theme.mp3');
menuTheme.volume = 0.2;

let gemSFX = new Audio('assets/music/gem.mp3');
gemSFX.volume = 0.1;

let laserSFX = new Audio('assets/music/laser.mp3');
laserSFX.loop = false;
laserSFX.volume = 0.1;

let crashSFX = new Audio('assets/music/crash.mp3');
crashSFX.loop = false;
crashSFX.volume = 0.1;

let wooshSFX = new Audio('assets/music/woosh.mp3');
wooshSFX.loop = false;
wooshSFX.volume = 0.1;

// Starting game from menu
const startFirstGame = () => {
	playerPseudo = playerName.value;
	startGame();
	console.log(playerPseudo);
};

// Reset game
const startGame = () => {
	// Pause and reset music
	menuTheme.pause();
	currentMusic.pause();
	currentMusic.currentTime = 0;

	// Playing random music
	let musicNumber = Math.floor(Math.random() * 4) + 1;
	switch (musicNumber) {
		case 1:
			currentMusic = soundtrack_1;
			break;
		case 2:
			currentMusic = soundtrack_2;
			break;
		case 3:
			currentMusic = soundtrack_3;
			break;
		case 4:
			currentMusic = soundtrack_4;
			break;
		default:
			break;
	}
	currentMusic.play();
	currentMusic.volume = 0.2;

	// Hiding game over screen
	control_screen.style.display = 'none';
	gameOverScreen.style.display = 'none';
	highScoreList.style.display = 'none';
	chrono.style.display = 'block';

	// Show score
	scoreDiv.innerHTML = score;
	scoreDiv.style.display = 'block';

	// Reset game over screen to red
	gameOverScreen.style.backgroundColor = 'rgba(206, 28, 22, 0.582)';
	game_over_container.style.backgroundColor = 'rgb(167, 16, 16)';

	// Reset player position
	gsap.to('#player', {
		startAt: { x: 0, y: 0, rotate: 0 }
	});

	// Start counter and colision detection
	ennemiesInterval = setInterval(checkEnnemies, 500);
	clockInterval = setInterval(counter, 1000);

	// Randomly position gems
	gem.style.display = 'block';
	gem.style.top = Math.floor(Math.random() * 90) + 1 + '%';
	gem.style.left = Math.floor(Math.random() * 90) + 1 + '%';

	// Randomly position portals and fake portals
	let portals = document.querySelectorAll('.portals');
	portals.forEach((portal) => {
		portal.style.top = Math.floor(Math.random() * 70) + 10 + '%';
		portal.style.left = Math.floor(Math.random() * 80) + 10 + '%';

		if (Math.random() < 0.1) {
			portal.classList.add('fake_portal');
			portal.src = 'assets/img/fake_portal.png';
		} else {
			portal.classList.add('true_portal');
		}
	});

	// Setting ramdom countdown
	countdown = Math.floor(Math.random() * 19) + 9;
	chrono.innerHTML = countdown;
	playing = true;

	// Starting bot animations
	timeline_1.to('#bot_1', {
		duration: 2,
		y: -300
	});
	timeline_1.to('#bot_1', {
		rotate: 180
	});
	timeline_1.to('#bot_1', {
		duration: 5,
		y: 250
	});
	timeline_1.to('#bot_1', {
		rotate: 0
	});
	timeline_1.to('#bot_1', {
		duration: 2,
		y: 0
	});

	timeline_2.to('#bot_2', {
		rotate: '250_short'
	});
	timeline_2.to('#bot_2', {
		duration: 3,
		y: 170,
		x: -600
	});
	timeline_2.to('#bot_2', {
		rotate: '70_short'
	});
	timeline_2.to('#bot_2', {
		duration: 3,
		y: 0,
		x: 0
	});

	bot3_anim = gsap.to('#bot_3', {
		duration: 10,
		rotate: -270,
		motionPath: {
			path: '#path_3',
			align: '#path_3',
			autoRotate: 90,
			alignOrigin: [ 0.5, 0.5 ]
		},
		ease: Linear.easeNone,
		repeat: -1
	});

	bot4_anim = gsap.to('#bot_4', {
		duration: 8,

		motionPath: {
			path: '#path_4',
			align: '#path_4',
			autoRotate: 90,
			alignOrigin: [ 0.5, 0.5 ],
			start: 2
		},
		ease: Linear.easeNone,
		repeat: -1
	});

	// Reseting bot position
	timeline_1.play(0);
	timeline_2.play(0);
	bot3_anim.play(0);
	bot4_anim.play(0);
};

// Displaying control menu and hiding main menu
const showControls = () => {
	starter_screen.style.display = 'none';
	control_screen.style.display = 'flex';

	menuTheme.play();
};

// Game Over function
const gameOver = (death) => {
	// Stoping game logic
	playing = false;
	clearInterval(clockInterval);
	clearInterval(ennemiesInterval);

	// Mutating in database
	const playerRef = db.collection('players').doc(playerPseudo);
	playerRef
		.get()
		.then(function(doc) {
			// Checking if player exists
			if (doc.exists) {
				const playerData = doc.data();

				// Updating high score of player
				if (score > playerData.score) {
					playerRef
						.set({
							name: playerPseudo,
							score: score
						})
						.then(function() {
							console.log('Status saved !');
						})
						.catch(function(error) {
							console.error('Error writing document: ', error);
						});
				}
			} else {
				// Creating player in DB and saving score
				playerRef
					.set({
						name: playerPseudo,
						score: score
					})
					.then(function() {
						console.log('Status saved !');
					})
					.catch(function(error) {
						console.error('Error writing document: ', error);
					});
			}
		})
		.catch(function(error) {
			console.error('Error getting document:', error);
		});

	// Reseting portals
	let portals = document.querySelectorAll('.portals');
	portals.forEach((portal) => {
		portal.classList.remove('fake_portal');
		portal.classList.remove('true_portal');
		portal.src = 'assets/img/portal.png';
	});

	// Change game over screen
	switch (death) {
		case 'island':
			score = 0;
			crashSFX.play();
			gameOverDiv.innerHTML = 'YOU CRASHED INTO AN ASTEROID';
			break;

		case 'bot':
			score = 0;
			laserSFX.play();
			gameOverDiv.innerHTML = 'YOU WHERE SHOT';
			break;

		case 'time':
			score = 0;
			gameOverDiv.innerHTML = 'YOU RAN OUT OF FUEL';
			break;

		case 'portal':
			score = 0;
			gameOverDiv.innerHTML = 'I WARNED YOU ABOUT THOSE PORTALS';
			break;

		case 'win':
			score++;
			scoreDiv.innerHTML = score;
			wooshSFX.play();
			gameOverDiv.innerHTML = 'YOU ESCAPED !';
			gameOverScreen.style.backgroundColor = 'rgba(52, 165, 29, 0.582)';
			game_over_container.style.backgroundColor = 'rgb(13, 153, 43)';
			break;

		default:
			break;
	}

	// Display game over screen
	gameOverScreen.style.display = 'flex';

	// Stoping bot animations and chrono
	chrono.style.display = 'none';
	timeline_1.pause();
	timeline_2.pause();
	bot3_anim.pause();
	bot4_anim.pause();
};

// Player mouvement
const movePlayer = (e) => {
	if (playing) {
		switch (e.keyCode) {
			case 38:
				gsap.to('#player', {
					y: '-=50',
					rotate: '0_short'
				});
				break;

			case 40:
				gsap.to('#player', {
					y: '+=50',
					rotate: '180_short'
				});
				break;

			case 37:
				gsap.to('#player', {
					x: '-=50',
					rotate: '-90_short'
				});
				break;

			case 39:
				gsap.to('#player', {
					x: '+=50',
					rotate: '90_short'
				});
				break;

			default:
				break;
		}
	}
};
document.addEventListener('keydown', movePlayer);

// Collision check function
const checkCollision = (div1, div2) => {
	let threshold = 12;
	let rect1 = div1.getBoundingClientRect();
	let rect2 = div2.getBoundingClientRect();
	return !(
		rect1.right < rect2.left + threshold ||
		rect1.left > rect2.right - threshold ||
		rect1.bottom < rect2.top + threshold ||
		rect1.top > rect2.bottom - threshold
	);
};

// Game over trigger function
let checkEnnemies = () => {
	let bots = document.querySelectorAll('.bot');
	bots.forEach((bot) => {
		if (checkCollision(player, bot)) {
			gameOver('bot');
		}
	});

	let islands = document.querySelectorAll('.island');
	islands.forEach((island) => {
		if (checkCollision(player, island)) {
			gameOver('island');
		}
	});

	let fake_portals = document.querySelectorAll('.fake_portal');
	fake_portals.forEach((fake_portal) => {
		if (checkCollision(player, fake_portal)) {
			gameOver('portal');
		}
	});

	let true_portals = document.querySelectorAll('.true_portal');
	true_portals.forEach((true_portal) => {
		if (checkCollision(player, true_portal)) {
			gameOver('win');
		}
	});

	if (checkCollision(player, gem)) {
		countdown += 10;
		gem.style.display = 'none';
		gemSFX.play();
	}
};

// Reseting countdown
let countdown = 0;

// Countdown logic
let counter = () => {
	countdown -= 1;
	chrono.innerHTML = countdown;
	if (countdown == 0) {
		gameOver('time');
	}
};

// Loader
window.onload = () => {
	loader_wrapper.style.display = 'none';
};

// Getting data from DB for score list
const showResults = () => {
	highScoreUl.textContent = '';
	highScoreList.style.display = 'block';
	db.collection('players').orderBy('score', 'desc').get().then(function(querySnapshot) {
		querySnapshot.forEach(function(doc) {
			const scoreData = doc.data();
			let li = document.createElement('li');
			li.innerHTML = `<span class="bold-white">${scoreData.name}</span> has a score of <span class="bold-white">${scoreData.score}</span>`;
			highScoreUl.appendChild(li);
		});
	});
};

// Hide score list modal
const closeHighScoreList = () => {
	highScoreList.style.display = 'none';
	highScoreUl.textContent = '';
};
