/*
Andrés Senn
*/
let overlay;
let loaded = false;
let seed;
let elli = [];
let particles;
let rot;
let trans;
let id = 0;
function setup() {
	seed = int(fxrand() * 10000000000000);
	overlay = document.querySelector(".overlay");
	createCanvas(2160, 2160);
	pixelDensity(1);
	randomSeed(seed);
	noiseSeed(seed);
	// noLoop();
	c = color(random(255), random(255), random(255), 20);
	overlay.style.display = "none";
	rot = int(random(4)) * HALF_PI;
	trans = random(-500, 500);
	particles = [];
	for (let i = 0; i < 200; i++) {
		particles.push(new Particle(0, random(-500, 500)));
	}
	background(255);
	noStroke();
	rotateAll(4);
	fill(0);
	setShadow(0, 0, 20, 100);

	rect(0, 0, random(width), height);
	rotateAll(4);
	for (let i = 0; i < 8; i++) {
		noStroke();
		fill(int(random(2)) * 255);
		circle(width / 2, random(height), random(10, 600));
	}
	rotateAll(4);
	sliceCanvas("Y");
	// noisemix(0, height / 2, random(200, 500, 50), height);
	// Console
	document.title = `Otro | Andr\u00e9s Senn | 2022`;
	console.log(
		`%cOtro | Andr\u00e9s Senn | Projet: `,
		"background:#333;border-radius:10px;background-size:15%;color:#eee;padding:10px;font-size:15px;text-align:center;",
	);
	noFill();
}
function draw() {
	for (let i = 0; i < 3; i++) {
		push();
		translate(width / 2, height / 2 + trans);
		rotate(rot);
		particles.forEach((p) => {
			let a = p.a + frameCount * 0.01;
			p.update();
			strokeWeight(0.6);
			//push()
			//translate(width/2,height/2);
			push();
			translate(p.pos.x, p.pos.y);
			rotate(a);
			let s = map(sin(a*3), -1, 1, 5, 200);
			setShadow(0, 0, 0, 0);
			if (frameCount > 100) {
				stroke(
					map(sin(a * 5), -1, 1, 0, 255),
					map(sin(a * 3), -1, 1, 5, 20),
				);
				line(-s, 0, s, 0);
			} else {
				stroke(
					map(sin(a * 5), -1, 1, 0, 255),
					map(sin(a * 3), -1, 1, 2, 5),
				);
				rectMode(CENTER);
				let w = map(sin(a * 5), -1, 1, 50, 200);
				rect(0, 0, w, w);
			}
			pop();
			stroke(map(sin(a), -1, 1, 0, 255));
			strokeWeight(4);
			setShadow(5, 5, 10, 150);
			point(p.pos.x, p.pos.y);
			id++;
			push();
			// if (id % 300 == 0) {
			// 	for (let i = 0; i < 8; i++) {
			// 		noStroke();
			// 		fill(int(random(2)) * 255);
			// 		circle(width / 2, random(height), random(10, 400));
			// 	}
			// }
			pop();
		});
		pop();
	}
	if (frameCount > 250) {
		noLoop();
		if (!isFxpreview) {
			fxpreview();
		}
	}
}

function sliceCanvas(_slice) {
	push();
	noSmooth();
	const num = int(random(1, 5));
	let imgs = [];

	for (let s = 0; s < num; s++) {
		let img;
		if (_slice == "X") {
			img = get((s * width) / num, 0, width / num, height);
		} else {
			// Y default
			img = get(0, (s * height) / num, width, height / num);
		}
		imgs.push(img);
	}
	let rimg = imgs.sort((a, b) => 0.5 - random(1));
	setShadow(8, 8, 20, 200);
	for (let i = 0; i < num; i++) {
		noFill();
		if (_slice == "X") {
			let rpos = 0;
			//translate(0, random(-200, 200));
			image(rimg[i], int(width / num) * i + rpos, 0);
		} else {
			let rpos = 0;
			//translate(random(-200, 200), 0);
			image(rimg[i], 0, int(height / num) * i + rpos);
		}
	}
	pop();
}
function rotateAll(r = 8) {
	translate(width / 2, height / 2);
	rotate((int(random(r)) * TAU) / r);
	translate(-width / 2, -height / 2);
}
function noisemix(_x, _y, _w, _h) {
	push();
	let s = 20;
	let c = random(0, 255);
	let w = _w;
	let h = _h;
	for (let x = _x - w / 2; x < _x + w / 2; x += s) {
		for (let y = _y - h / 2; y < _y + h / 2; y += s) {
			s = random(2, 5);
			c = 255;
			if (random(1) > 0.5) {
				c = 0;
			}
			noStroke();
			fill(c);
			rect(x, y, s + random(1, 50), s);
		}
	}
	pop();
}
function setShadow(x = 3, y = 3, b = 15, a = 200) {
	// Shadow
	drawingContext.shadowOffsetX = x;
	drawingContext.shadowOffsetY = y;
	drawingContext.shadowBlur = b;
	drawingContext.shadowColor = color(0, a);
}
function colorRect(cx, cy, w, h, c) {
	fill(0);
	noStroke();
	let fi = drawingContext.createLinearGradient(
		cx - w / 2,
		cy - h / 2,
		cx + w / 2,
		cy + h / 2,
	);
	let c1 = color(c, 0, 255);
	let c2 = color(c + random(-50, 50), random(255), random(255));
	if (random(1) < 0.2) {
		c1 = color(c, 0, 255);
		c2 = color(c, 0, 0);
	}
	fi.addColorStop(0, color(0));
	fi.addColorStop(0.5, c1);
	fi.addColorStop(0.75, c2);
	fi.addColorStop(1, color(0, 100));
	drawingContext.fillStyle = fi;
	rect(width / 2, height / 2, w, h);
}

function bgRect(p, cx, cy, w, h, c) {
	p.push();
	p.fill(0);
	p.noStroke();
	p.background(255);
	let ctx = p.elt.getContext("2d");
	let fi = ctx.createLinearGradient(
		cx - w / 2,
		cy - h / 2,
		cx + w / 2,
		cy + h / 2,
	);
	fi.addColorStop(0, color(c, 100, 255), 40);
	fi.addColorStop(0.25, color(c, 100, 255), 40);
	fi.addColorStop(0.5, color(c, 100, 255), 40);
	fi.addColorStop(0.75, color(0, 0, 0), 40);
	fi.addColorStop(1, color(0, 100));
	ctx.fillStyle = fi;
	p.rect(width / 2, height / 2, w, h);
	p.pop();
}
function keyReleased() {
	switch (key) {
		case "1":
			pixelDensity(1);
			break;
		case "2":
			pixelDensity(2);
			break;
		case "3":
			pixelDensity(3);
			break;
		case "4":
			pixelDensity(4);
			break;
	}
	if (key == "s" || key == "S") {
		grabImage();
	}
}
function grabImage() {
	let date =
		year() +
		"" +
		month() +
		"" +
		day() +
		"" +
		hour() +
		"" +
		minute() +
		"" +
		second() +
		"" +
		".png";
	console.log(
		`%c SAVING ${
			String.fromCodePoint(0x1f5a4) + String.fromCodePoint(0x1f90d)
		}`,
		"background: #000; color: #ccc;padding:5px;font-size:15px",
	);
	saveCanvas("__" + date);
}

class Elli {
	constructor(x, y, r) {
		this.x = x;
		this.y = y;
		this.r = r;
	}
}
class Particle {
	constructor(x, y) {
		this.pos = createVector(x, y);
		this.vel = createVector(0, 0);
		this.a = 0;
		this.dir = createVector(0, 0);
		this.off = random(0.1, 0.2);
		this.mult = 0.7;
		this.n = 0;
		this.ns = 0.001;
		this.count = 0;
	}
	update() {
		this.n = noise(this.pos.x * this.ns, this.pos.y * this.ns, this.off);
		this.ns = map(this.n, 0, 1, 0.0008, 0.001);
		let dil = map(sin(this.n * TAU), 0, 1, 5, 10);
		//if (this.count % 20 == 0) {
		this.a = this.n * TAU * dil;
		this.dir.x = cos(this.a);
		this.dir.y = sin(this.a);
		//}
		this.vel.add(this.dir);
		this.vel.mult(this.mult);
		this.pos.add(this.vel);
		this.off += 0.0;
		this.count++;
	}
}
