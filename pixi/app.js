const app = new PIXI.Application();
document.body.appendChild(app.view);
let kouhai;
let senpai;
let sensei;
const boundsPadding = 100;
const boundingBox = new PIXI.Rectangle(
	-boundsPadding,
	-boundsPadding,
	app.screen.width,
	app.screen.height
);
app.loader
	.add("spritesheets/akouhai-fr.json")
	.add("spritesheets/asempai-fr.json")
	.add("spritesheets/csensei-fl.json")
	.load(setup);
function setup() {
	const framesKouhai = [];
	const framesSenpai = [];
	const framesSensei = [];
	for (let i = 0; i < 3; i++) {
		framesKouhai.push(PIXI.Texture.from(`akouhai-fr${i}.png`));
		framesSenpai.push(PIXI.Texture.from(`asempai-fr${i}.png`));
		framesSensei.push(PIXI.Texture.from(`catch-fl${i}.png`));
	}
	//kouhai moves
	kouhai = new PIXI.AnimatedSprite(framesKouhai);
	kouhai.x = app.screen.width / 2;
	kouhai.y = app.screen.height / 2;
	kouhai.vx = 0;
	kouhai.vy = 0;
	kouhai.anchor.set(0.5);
	kouhai.animationSpeed = 0.1;
	kouhai.play();
	//senpai
	senpai = new PIXI.AnimatedSprite(framesSenpai);
	senpai.x = app.screen.width / 2;
	senpai.y = app.screen.height / 2;
	senpai.vx = 0;
	senpai.vy = 0;
	senpai.anchor.set(0.5);
	senpai.animationSpeed = 0.05;
	senpai.play();
	//sensei
	sensei = new PIXI.AnimatedSprite(framesSensei);
	sensei.x = 400;
	sensei.y = 500;
	sensei.vx = 0;
	sensei.vy = 0;
	sensei.anchor.set(0.5);
	sensei.animationSpeed = 0.1;
	sensei.play();
	app.stage.addChild(kouhai);
	app.stage.addChild(senpai);
	app.stage.addChild(sensei);
	// Animate the rotation
	let left = keyboard("ArrowLeft"),
		up = keyboard("ArrowUp"),
		right = keyboard("ArrowRight"),
		down = keyboard("ArrowDown");

	//Left arrow key `press` method
	left.press = () => {
		//Change the cat's velocity when the key is pressed
		senpai.vx = -2;
		senpai.vy = -2;
	};

	//Left arrow key `release` method
	// left.release = () => {
	// 	//If the left arrow has been released, and the right arrow isn't down,
	// 	//and the cat isn't moving vertically:
	// 	//Stop the cat
	// 	if (!right.isDown && kouhai.vy === 0) {
	// 		kouhai.vx = 0;
	// 	}
	// };

	//Up
	up.press = () => {
		senpai.vy = -2;
		senpai.vx = 2;
	};
	// up.release = () => {
	// 	if (!down.isDown && kouhai.vx === 0) {
	// 		kouhai.vy = 0;
	// 	}
	// };

	//Right
	right.press = () => {
		senpai.vx = 2;
		senpai.vy = 2;
	};
	// right.release = () => {
	// 	if (!left.isDown && kouhai.vy === 0) {
	// 		kouhai.vx = 0;
	// 	}
	// };

	//Down
	down.press = () => {
		senpai.vy = 2;
		senpai.vx = -2;
	};
	// down.release = () => {
	// 	if (!up.isDown && kouhai.vx === 0) {
	// 		kouhai.vy = 0;
	// 	}
	// };

	//Set the game state
	state = play;

	//Start the game loop
	app.ticker.add((delta) => {
		gameLoop(delta);
	});
}

function gameLoop(delta) {
	//Update the current game state:
	state(delta);
}

function play(delta) {
	//Use the cat's velocity to make it move
	senpai.x += senpai.vx;
	senpai.y += senpai.vy;
	if (senpai.x < boundingBox.x) {
		senpai.vx = 0;
		senpai.vy = 0;
	} else if (senpai.x > boundingBox.x) {
		senpai.vx = 0;
		senpai.vy = 0;
	}
	if (senpai.y < boundingBox.y) {
		senpai.vx = 0;
		senpai.vy = 0;
	} else if (senpai.y > boundingBox.y) {
		senpai.vx = 0;
		senpai.vy = 0;
	}
}

//keyboard events
function keyboard(value) {
	let key = {};
	key.value = value;
	key.isDown = false;
	key.isUp = true;
	key.press = undefined;
	key.release = undefined;
	//The `downHandler`
	key.downHandler = (event) => {
		if (event.key === key.value) {
			if (key.isUp && key.press) key.press();
			key.isDown = true;
			key.isUp = false;
			event.preventDefault();
		}
	};

	//The `upHandler`
	key.upHandler = (event) => {
		if (event.key === key.value) {
			if (key.isDown && key.release) key.release();
			key.isDown = false;
			key.isUp = true;
			event.preventDefault();
		}
	};

	//Attach event listeners
	const downListener = key.downHandler.bind(key);
	const upListener = key.upHandler.bind(key);

	window.addEventListener("keydown", downListener, false);
	window.addEventListener("keyup", upListener, false);

	// Detach event listeners
	key.unsubscribe = () => {
		window.removeEventListener("keydown", downListener);
		window.removeEventListener("keyup", upListener);
	};

	return key;
}

// let renderer = PIXI.autoDetectRenderer({
// 	// width: (window.innerWidth / 3) * 2,
// 	// height: window.innerHeight / 2,
// 	transparent: false,
// });
// renderer.backgroundColor = 0xaedbd3;
// let stage = new PIXI.Container();

// let ticker = PIXI.Ticker.shared;

// ticker.autoStart = false;
// //ticker.stop();
// ticker.start();
// const displayDiv = document.getElementById("pixi");
// displayDiv.appendChild(renderer.view);
// ticker.add(function (time) {
// 	renderer.render(stage);
// });
// // load the texture we need
// const asynckouhai = PIXI.Texture.from("/spritesheets/akouhai-clear.png");
// // const awaitsenpai = PIXI.Texture.from("/spritesheets/await-senpai.png");
// // const catchsensei = PIXI.Texture.from("/spritesheets/catch-sensei.png");
// createItem(300, 400, asynckouhai);

// function createItem(x, y, texture) {
// 	// create a sprite
// 	const item = new PIXI.Sprite(texture);
// 	stage.addChild(item);
// 	// make sprite interactive
// 	item.interactive = true;
// 	// make hand appear on rollover
// 	item.buttonMode = true;
// 	// center anchor point
// 	item.anchor.set(0.5);
// 	// setup events
// 	item
// 		// events for drag start
// 		.on("mousedown", onDragStart)
// 		.on("touchstart", onDragStart)
// 		// events for drag end
// 		.on("mouseup", onDragEnd)
// 		.on("mouseupoutside", onDragEnd)
// 		.on("touchend", onDragEnd)
// 		.on("touchendoutside", onDragEnd)
// 		// events for drag move
// 		.on("mousemove", onDragMove)
// 		.on("touchmove", onDragMove);

// 	// move the sprite to its designated position
// 	item.position.x = x;
// 	item.position.y = y;

// 	// add it to the stage
// 	// app.stage.addChild(item);
// }
// const hitTestRectangle = (spriteOne, spriteTwo) => {
// 	if (true) {
// 		return "yay";
// 	} else {
// 		//There's no collision
// 	}
// };
// function onDragStart(event) {
// 	// store a reference to the data
// 	// the reason for this is because of multitouch
// 	// we want to track the movement of this particular touch
// 	this.data = event.data;
// 	this.alpha = 0.5;
// 	this.dragging = true;
// }

// function onDragEnd() {
// 	this.alpha = 1;

// 	this.dragging = false;

// 	// set the interaction data to null
// 	this.data = null;
// }

// function onDragMove() {
// 	if (this.dragging) {
// 		var newPosition = this.data.getLocalPosition(this.parent);
// 		this.position.x = newPosition.x;
// 		this.position.y = newPosition.y;
// 	}
// }
