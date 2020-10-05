import React from "react";
import ReactDOM from "react-dom";
import "../public/style.css";
import * as PixiApp from "../pixi/app.js";
// import socket from "socket.io-client";

// const clientSocket = socket(window.location.origin);

// clientSocket.on("connect", () => {
// 	console.log("Connected to server");
// });

ReactDOM.render(
	<div id="instructions">
		<h1>Promise.HS</h1>
		<div>
			<div>
				<b>Await-Senpai and Async-Kouhai are the best of friends!</b>
				<p>
					They have a standing <span className="shiny">Promise</span> to hang
					out together after school.
				</p>
				<p>
					Help Await-Senpai finish their tasks before returning to their kouhai
					so they can be a good role model!
				</p>
				<b>Watch out for Catch-sensei!</b>
				<p>If Catch-sensei tags Await-Senpai, their plans will be ruined!</p>
				<br />
				<p>Use the arrow keys to direct Await-Senpai.</p>
				<p>
					Await-Senpai can be a bit focused, so they'll keep going until they
					bump into walls or objects.
				</p>
			</div>
		</div>
	</div>,
	document.getElementById("app")
);
