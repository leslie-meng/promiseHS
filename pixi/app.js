const { Rectangle } = require("pixi.js");

window.WebFontConfig = {
	google: {
		families: ["Roboto Mono"],
	},

	active() {
		init();
	},
};

/* eslint-disable */
// include the web-font loader script
(function () {
	const wf = document.createElement("script");
	wf.src = `${
		document.location.protocol === "https:" ? "https" : "http"
	}://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js`;
	wf.type = "text/javascript";
	wf.async = "true";
	const s = document.getElementsByTagName("script")[0];
	s.parentNode.insertBefore(wf, s);
})();
/* eslint-enabled */

function init() {
	// // create some white text using the Snippet webfont
	// const textSample = new PIXI.Text(
	// 	'Pixi.js text using the\ncustom "Snippet" Webfont',
	// 	{
	// 		fontFamily: "Roboto Mono",
	// 		fontSize: 50,
	// 		fill: "white",
	// 		align: "left",
	// 	}
	// );
	// textSample.position.set(50, 200);
	// app.stage.addChild(textSample);
}
const app = new PIXI.Application({
	transparent: true,
	width: (window.innerWidth / 3) * 2,
	height: window.innerHeight - 100,
});
let pixiDiv = document.getElementById("pixi");
pixiDiv.appendChild(app.view);
let kouhai;
let senpai;
let sensei;
let senpaiDirection = {};
let senseiDirection = {};
let promise = false;
let book;
let walls = [];
//fancy font
const style = new PIXI.TextStyle({
	fontFamily: "Roboto Mono",
	fontSize: 20,
	fontWeight: "bold",
	fill: "#000000", // gradient
	wordWrap: true,
	wordWrapWidth: app.screen.width - 300,
	lineJoin: "round",
});
//game rect
let gameRect = new PIXI.Graphics();
gameRect.beginFill(0x007ec7);
gameRect.lineStyle(5, 0xffffff, 1);
gameRect.drawRect(75, 85, app.screen.width - 155, app.screen.height - 250);
gameRect.endFill;
app.stage.addChild(gameRect);
//inventory window
let inventory = new PIXI.Graphics();
inventory.beginFill(0x24bdc2);
inventory.lineStyle(5, 0xffffff, 1);
inventory.drawRect(75, 10, app.screen.width - 155, 50);
inventory.endFill;
app.stage.addChild(inventory);
//reset button
let resetButton = new PIXI.Graphics();
resetButton.beginFill(0xffffff);
resetButton.drawRoundedRect(app.screen.width - 300, 15, 100, 40, 16);
resetButton.endFill;
resetButton.hitArea = new PIXI.Rectangle(app.screen.width - 300, 15, 100, 40);
app.stage.addChild(resetButton);
const resetText = new PIXI.Text("Reset", style);
resetText.x = app.screen.width - 285;
resetText.y = 20;
app.stage.addChild(resetText);
//info window
let info = new PIXI.Graphics();
info.beginFill(0xffffff);
info.lineStyle(5, 0x24bdc2, 1);
info.drawRect(75, app.screen.height - 130, app.screen.width - 155, 100);
info.endFill;
app.stage.addChild(info);

const richText = new PIXI.Text("inventory", style);
richText.x = 85;
richText.y = 20;

app.stage.addChild(richText);
const helpText = new PIXI.Text(
	"Collect your book and then return to Async-Kouhai!",
	style
);
helpText.x = 180;
helpText.y = app.screen.height - 110;
app.stage.addChild(helpText);
//speed lines
const trailTexture = PIXI.Texture.from("spritesheets/trail.png");
const historyX = [];
const historyY = [];
const historySize = 15;
const ropeSize = 100;
const points = [];
// Create history array.
for (let i = 0; i < historySize; i++) {
	historyX.push(0);
	historyY.push(0);
}
// Create rope points.
for (let i = 0; i < ropeSize; i++) {
	points.push(new PIXI.Point(0, 0));
}

// Create the rope
const rope = new PIXI.SimpleRope(trailTexture, points);

// Set the blendmode
rope.blendmode = PIXI.BLEND_MODES.ADD;

app.stage.addChild(rope);

app.loader
	.add("spritesheets/akouhai-fr.json")
	.add("spritesheets/asempai-fr.json")
	.add("spritesheets/asempai-fl.json")
	.add("spritesheets/asempai-br.json")
	.add("spritesheets/csensei-fl.json")
	.add("spritesheets/csensei-fr.json")
	.add("spritesheets/csensei-br.json")
	.add("wall", "spritesheets/basicwall.png")
	.add("book", "spritesheets/book.png")
	.load(setup);
function setup() {
	const framesKouhai = [];
	const framesSenpai = { left: [], right: [], up: [] };
	const framesSensei = { left: [], right: [], up: [] };
	for (let i = 0; i < 3; i++) {
		framesKouhai.push(PIXI.Texture.from(`akouhai-fr${i}.png`));
		framesSenpai.right.push(PIXI.Texture.from(`asempai-fr${i}.png`));
		framesSenpai.left.push(PIXI.Texture.from(`asempai-fl${i}.png`));
		framesSenpai.up.push(PIXI.Texture.from(`asempai-br${i}.png`));
		framesSensei.left.push(PIXI.Texture.from(`catch-fl${i}.png`));
		framesSensei.right.push(PIXI.Texture.from(`catch-fr${i}.png`));
		framesSensei.up.push(PIXI.Texture.from(`catch-br${i}.png`));
	}
	book = new PIXI.Sprite(PIXI.Texture.from("book"));

	//kouhai moves
	kouhai = new PIXI.AnimatedSprite(framesKouhai);
	kouhai.vx = 0;
	kouhai.vy = 0;
	kouhai.anchor.set(0.5);
	kouhai.animationSpeed = 0.1;
	kouhai.scale.set(1.5, 1.5);
	kouhai.play();
	//senpai
	senpaiDirection.left = framesSenpai.left;
	senpaiDirection.right = framesSenpai.right;
	senpaiDirection.up = framesSenpai.up;
	senpai = new PIXI.AnimatedSprite(framesSenpai.right);
	senpai.x = app.screen.width / 2;
	senpai.y = app.screen.height / 2;
	senpai.vx = 0;
	senpai.vy = 0;
	senpai.anchor.set(0.5);
	senpai.animationSpeed = 0.05;
	senpai.scale.set(1.5, 1.5);
	senpai.play();
	//sensei
	senseiDirection.left = framesSensei.left;
	senseiDirection.right = framesSensei.right;
	senseiDirection.up = framesSensei.up;
	sensei = new PIXI.AnimatedSprite(framesSensei.left);
	sensei.vx = -2;
	sensei.vy = 0;
	sensei.anchor.set(0.5);
	sensei.animationSpeed = 0.1;
	sensei.scale.set(1.5, 1.5);
	sensei.play();
	app.stage.addChild(kouhai);
	app.stage.addChild(senpai);
	app.stage.addChild(sensei);
	app.stage.addChild(book);
	reset();
	resetButton.interactive = true;
	resetButton.buttonMode = true;

	resetButton.on("pointerdown", (event) => onClick(resetButton));
	resetButton.on("pointerup", (event) => (resetButton.tint = 0xffffff));

	// Animate the rotation
	let left = keyboard("ArrowLeft"),
		up = keyboard("ArrowUp"),
		right = keyboard("ArrowRight"),
		down = keyboard("ArrowDown"),
		space = keyboard(" " || "Spacebar");

	//Left arrow key `press` method
	left.press = () => {
		//Change the player's velocity when the key is pressed

		if (senpai.vx === 0 && senpai.vy === 0) {
			senpai.textures = senpaiDirection.left;
			senpai.play();
			if (senpai.x > 100) {
				senpai.vx = -4;
				senpai.vy = 0;
			}
		}
	};

	//Up
	up.press = () => {
		if (senpai.vx === 0 && senpai.vy === 0) {
			senpai.textures = senpaiDirection.up;
			senpai.play();
			if (senpai.y > 100) {
				senpai.vy = -4;
				senpai.vx = 0;
			}
		}
	};

	//Right
	right.press = () => {
		if (senpai.vx === 0 && senpai.vy === 0) {
			senpai.textures = senpaiDirection.right;
			senpai.play();
			if (senpai.x < app.screen.width - 100) {
				senpai.vx = 4;
				senpai.vy = 0;
			}
		}
	};

	//Down
	down.press = () => {
		if (senpai.vx === 0 && senpai.vy === 0) {
			if (senpai.textures === senpaiDirection.up) {
				senpai.textures = senpaiDirection.right;
				senpai.play();
			}
			if (senpai.y < app.screen.height - 185) {
				senpai.vy = 4;
				senpai.vx = 0;
			}
		}
	};
	//spacebar
	space.press = () => {
		if (Math.abs(senpai.vx) === 4 || Math.abs(senpai.vy) === 4) {
			senpai.vx *= 3;
			senpai.vy *= 3;
		}
	};
	space.release = () => {
		if (Math.abs(senpai.vx) > 4 || Math.abs(senpai.vy) > 4) {
			senpai.vx /= 3;
			senpai.vy /= 3;
		}
	};

	//Set the game state
	state = play;

	//Start the game loop
	app.ticker.add((delta) => {
		gameLoop(delta);
		historyX.pop();
		historyX.unshift(senpai.x);
		historyY.pop();
		historyY.unshift(senpai.y);
		// Update the points to correspond with history.
		for (let i = 0; i < ropeSize; i++) {
			const p = points[i];

			// Smooth the curve with cubic interpolation to prevent sharp edges.
			const ix = cubicInterpolation(historyX, (i / ropeSize) * historySize);
			const iy = cubicInterpolation(historyY, (i / ropeSize) * historySize);

			p.x = ix;
			p.y = iy;
		}
	});
}
function onClick(object) {
	object.tint = 0x777ec7;
	reset();
}
function gameLoop(delta) {
	//Update the current game state:
	state(delta);
	checkPosition();
}

function play(delta) {
	//senpai directions
	senpai.x += senpai.vx;
	senpai.y += senpai.vy;
	if (senpai.x < 100) {
		senpai.x += Math.abs(senpai.vx);
		senpai.vx = 0;
	} else if (senpai.x > app.screen.width - 100) {
		senpai.x -= Math.abs(senpai.vx);
		senpai.vx = 0;
	}
	if (senpai.y < 100) {
		senpai.y += Math.abs(senpai.vy);
		senpai.vy = 0;
	} else if (senpai.y > app.screen.height - 185) {
		senpai.y -= Math.abs(senpai.vy);
		senpai.vy = 0;
	}
	//sensei-directions
	sensei.x += sensei.vx;
	sensei.y += sensei.vy;
	if (sensei.x < 100) {
		sensei.textures = senseiDirection.right;
		sensei.play();
		sensei.vx = 2;
	} else if (sensei.x > app.screen.width - 100) {
		sensei.textures = senseiDirection.left;
		sensei.play();
		sensei.vx = -2;
	}
	if (sensei.y < 100) {
		sensei.textures = senseiDirection.right;
		sensei.play();
		sensei.vy = 2;
	} else if (sensei.y > app.screen.height - 185) {
		sensei.textures = senseiDirection.up;
		sensei.play();
		sensei.vy = -2;
	}
}
function makeWalls() {
	let spacing = app.screen.width / 12,
		xOffset = 100;
	for (let i = 0; i < 9; i++) {
		if (walls[i]) app.stage.removeChild(walls[i].sprite);
		walls[i] = {
			sprite: new PIXI.Sprite(PIXI.Texture.from("wall")),
			x: spacing * i + xOffset,
			y: Math.floor(
				Math.random() * Math.floor(app.screen.height - 185 - 100) + 100
			),
		};
		walls[i].sprite.x = walls[i].x;
		walls[i].sprite.y = walls[i].y;
		app.stage.addChild(walls[i].sprite);
	}
}
function reset() {
	promise = false;
	makeWalls();
	kouhai.x = Math.floor(
		Math.random() * Math.floor(app.screen.width - 100 - 100) + 100
	);
	kouhai.y = Math.floor(
		Math.random() * Math.floor(app.screen.height - 185 - 100) + 100
	);
	book.x = Math.floor(
		Math.random() * Math.floor(app.screen.width - 100 - 100) + 100
	);
	book.y = Math.floor(
		Math.random() * Math.floor(app.screen.height - 185 - 100) + 100
	);
	sensei.x = Math.floor(
		Math.random() * Math.floor(app.screen.width - 100 - 100) + 100
	);
	sensei.y = Math.floor(
		Math.random() * Math.floor(app.screen.height - 185 - 100) + 100
	);
	sensei.textures = senseiDirection.right;
	sensei.play();
	sensei.vx = 2;
	helpText.text = "Collect your book and then return to Async-Kouhai!";
}
function collision(movingSprite, stillSprite) {
	const bounds1 = movingSprite.getBounds();
	const bounds2 = stillSprite.getBounds();
	if (
		bounds1.x < bounds2.x + bounds2.width &&
		bounds1.x + bounds1.width > bounds2.x &&
		bounds1.y < bounds2.y + bounds2.height &&
		bounds1.y + bounds1.height > bounds2.y
	) {
		movingSprite.x -= movingSprite.vx;
		movingSprite.y -= movingSprite.vy;
		if (movingSprite === senpai) {
			senpai.vx = senpai.vy = 0;
			return true;
		} else {
			movingSprite.vx *= -1;
			movingSprite.vy *= -1;
			movingSprite.play();
			return true;
		}
	} else return false;
}
function checkPosition() {
	// If the player and target are at the same position, spawn the target in another position
	for (let i = 0; i < walls.length; i++) {
		collision(senpai, walls[i].sprite);
		if (collision(sensei, walls[i].sprite)) {
			if (sensei.vx > 0) {
				sensei.textures = senseiDirection.right;
				sensei.play();
			} else if (sensei.vx < 0) {
				sensei.textures = senseiDirection.left;
				sensei.play();
			} else if (sensei.vy > 0) {
				sensei.textures = senseiDirection.right;
				sensei.play();
			} else {
				sensei.textures = senseiDirection.up;
				sensei.play();
			}
		}
	}
	if (collision(senpai, book) && !promise) {
		promise = true;
		senpai.vx = senpai.vy = 0;
		helpText.text = "Got your book! Now return to Async-Kouhai!";
		book.position.set(210, 23);
	} else if (collision(senpai, sensei)) {
		helpText.text = `Catch-Sensei: "No running in the halls!"`;
		sensei.vx = sensei.vy = 0;
		setTimeout(() => reset(), 1500);
	} else if (collision(senpai, kouhai)) {
		if (promise) {
			helpText.text = `Async-Kouhai: "Await-senpai, you kept your promise!"`;
			senpai.vx = senpai.vy = 0;
			setTimeout(() => reset(), 1500);
		} else {
			helpText.text = `Async-Kouhai: "That's no good, senpai! It looks like you returned in error!"`;
			senpai.vx = senpai.vy = 0;
			setTimeout(() => reset(), 1500);
		}
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
function clipInput(k, arr) {
	if (k < 0) k = 0;
	if (k > arr.length - 1) k = arr.length - 1;
	return arr[k];
}

function getTangent(k, factor, array) {
	return (factor * (clipInput(k + 1, array) - clipInput(k - 1, array))) / 2;
}

function cubicInterpolation(array, t, tangentFactor) {
	if (tangentFactor == null) tangentFactor = 1;

	const k = Math.floor(t);
	const m = [
		getTangent(k, tangentFactor, array),
		getTangent(k + 1, tangentFactor, array),
	];
	const p = [clipInput(k, array), clipInput(k + 1, array)];
	t -= k;
	const t2 = t * t;
	const t3 = t * t2;
	return (
		(2 * t3 - 3 * t2 + 1) * p[0] +
		(t3 - 2 * t2 + t) * m[0] +
		(-2 * t3 + 3 * t2) * p[1] +
		(t3 - t2) * m[1]
	);
}
