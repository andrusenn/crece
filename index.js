/*
Andrés Senn
*/
let overlay;
let loaded = false;
let seed;
let elli = [];
let particles;
let rot;
let id = 0;
let sinvel;
let llen;
let whench;
let rectr;
let monocromo;
let sat = 10;
let maxRectSz;
let bw;
// Part circ
let partCirc;

// Slice
let sliaceW = 0;

// circles
let iscircl;
let diamMin, diamMax;

// Noise
let pbgNoise;
function setup() {
	seed = int(fxrand() * 1111111191111111);
	overlay = document.querySelector(".overlay");
	createCanvas(2160, 2160);
	pixelDensity(2);
	randomSeed(seed);
	noiseSeed(seed);
	// noLoop();
	colorMode(HSB, 360, 100, 100, 100);
	pbgNoise = createGraphics(width, height);
	monocromo = int(random(360)) % 360;
	overlay.style.display = "none";
	rot = int(random(4)) * HALF_PI;
	sinvel = random(1, 3);
	llen = random(0.5, 5);
	whench = random(20, 80);
	maxRectSz = random(80, 200);
	rectr = random();
	bw = random();
	//
	partCirc = boolean(int(random(2)));

	// Slice width
	sliaceW = random(50, 1000);
	// circles
	iscircl = random();
	diamMin = random(10, 50);
	diamMax = random(80, 400);

	// background
	// background(int(random(2)) * 255);
	background(255);
	if (random() < 0.5) {
		background(0);
	}
	rotateAll(4);
	// if (random() < 0.5) {
	// 	bgRect();
	// }

	// Noise
	if (random() < 0.5) {
		bgNoise();
		rotateAll(4);
		bgNoise();
	}
	// for (let i = 0; i < 250000; i++) {
	// 	strokeWeight(random(1, 5));
	// 	stroke(int(random(2)) * 360, 3);
	// 	point(random(width), random(height));
	// }

	push();
	setShadow(0, 20, 20, 100);
	rotateAll(4);
	//sliceCanvas("Y");
	rectMode(CENTER);
	pop();

	particles = [];
	let varh = random(100, 600);
	if (random() < 0.33) {
		for (let i = 0; i < 250; i++) {
			let p = new Particle(0, random(-varh, varh));
			particles.push(p);
		}
	} else if (random() < 0.66) {
		for (let x = -width / 2 + 500; x < width / 2 - 500; x += 100) {
			for (let y = -height / 2 + 500; y < height / 2 + 500; y += 100) {
				let p = new Particle(x, y);
				particles.push(p);
			}
		}
	} else {
		let ang = TAU / 255;
		let rad = random(50, 600);
		for (let i = 0; i < 250; i++) {
			let x = cos(ang * i) * rad;
			let y = sin(ang * i) * rad;
			let p = new Particle(x, y);
			particles.push(p);
		}
	}

	push();
	rotateAll(4);
	strokeWeight(random(1, 5));
	stroke(monocromo, sat, random(100));
	//line(width / 2, 0, width / 2, height);
	pop();

	// push();
	// rotateAll(4);
	// sliceCanvas("Y");
	// pop();
	// Console
	document.title = `Otro | Andr\u00e9s Senn | 2022`;
	console.log(
		`%cOtro | Andr\u00e9s Senn | Projet: `,
		"background:#333;border-radius:10px;background-size:15%;color:#eee;padding:10px;font-size:15px;text-align:center;",
	);
	noFill();
}
function draw() {
	noSmooth();
	for (let i = 0; i < 3; i++) {
		push();
		translate(width / 2, height / 2);
		rotate(rot);
		particles.forEach((p) => {
			let a = p.a + frameCount * 0.01;
			p.update();
			strokeWeight(0.6);
			push();
			translate(p.pos.x, p.pos.y);
			let s = map(sin(a * 3), -1, 1, 5, 200);
			setShadow(0, 0, 0, 0);
			if (frameCount > 100) {
				if (id % 3 == 0) {
					strokeWeight(random(0.6, 2));
					stroke(
						monocromo,
						sat,
						map(sin(a * 10), -1, 1, 40, 100),
						map(sin(a * 10), -1, 1, 0, 5),
					);
					line(-s * llen * 0.4, 0, s * llen * 0.4, 0);
					if (random() > 0.8) {
						line(0, -s * llen * 0.2, 0, s * llen * 0.2);
					}

					if (iscircl < 0.5) {
						stroke(
							monocromo,
							sat,
							map(sin(a * 5), -1, 1, 20, 100),
							map(sin(a * 2), -1, 1, 0, 3),
						);
						circle(0, 0, map(sin(a * 2), -1, 1, diamMin, diamMax));
					}
				}
			} else {
				if (id % 10 == 0) {
					stroke(
						monocromo,
						sat,
						map(sin(a * 5), -1, 1, 40, 100),
						map(sin(a * 3), -1, 1, 2, 10),
					);
					rectMode(CENTER);
					noFill();
					strokeWeight(random(0.6, 2));
					let w = map(sin(a * 5), -1, 1, 50, 200);
					rect(0, 0, w * llen * 0.1, w * llen * 0.3);
				}
			}
			pop();

			if (p.render) {
				setShadow(0, 15, 15, 100);
				// bright
				let b = map(frameCount, 0, 250, 100, 0);
				if (bw < 0.2) {
					b = 0;
				}
				if (frameCount > whench) {
					noFill();
					stroke(monocromo, b, map(sin(a), -1, 1, 40, 100), 30);
					strokeWeight(map(sin(a * sinvel), -1, 1, 1, 10));
					point(p.pos.x, p.pos.y);
				} else {
					noStroke();
					rectMode(CENTER);
					stroke(monocromo, b, map(sin(a), -1, 1, 40, 100));
					let sz = map(sin(a * sinvel), -1, 1, 5, maxRectSz);
					let szr = map(sin(a * sinvel), -1, 1, 0, maxRectSz);
					if (rectr < 0.5) {
						szr = 0;
					}
					rect(p.pos.x, p.pos.y, sz, sz, szr, 0, szr, 0);
				}
				id++;
			}
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
function bgNoise() {
	let maxr = random(50, 90);
	let d = pixelDensity();
	pbgNoise.clear();
	pbgNoise.background(0, 0, 0, 0);
	pbgNoise.loadPixels();
	for (let x = 0; x < pbgNoise.width; x += 1) {
		for (let y = 0; y < pbgNoise.height; y += 1) {
			let index =
				4 *
				((x * d + int(random(5))) * pbgNoise.width + (y * d + int(random(5))));
			// loop over
			pbgNoise.pixels[index] =
				pbgNoise.pixels[index + 1] =
				pbgNoise.pixels[index + 2] =
					int(random(256));
			pbgNoise.pixels[index + 3] = int(
				map(x, 0, pbgNoise.width, 0, random(10, maxr)),
			);
		}
	}
	pbgNoise.updatePixels();
	image(pbgNoise, 0, 0);
}
function sliceCanvas(_slice) {
	push();
	imageMode(CORNER);
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
	setShadow(0, 10, 20, 50);
	for (let i = 0; i < num; i++) {
		noFill();
		if (_slice == "X") {
			let rpos = 0;
			image(rimg[i], int(width / num) * i + rpos, 0);
		} else {
			let rpos = 0;
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
function setShadow(x = 3, y = 3, b = 15, a = 200) {
	// Shadow
	drawingContext.shadowOffsetX = x;
	drawingContext.shadowOffsetY = y;
	drawingContext.shadowBlur = b;
	drawingContext.shadowColor = color(0, a);
}

function bgRect() {
	push();
	fill(0);
	noStroke();
	background(255);
	let fi = drawingContext.createLinearGradient(0, 0, width, 0);
	fi.addColorStop(0, color(monocromo, sat, 100));
	fi.addColorStop(1, color(monocromo, sat, 0));
	drawingContext.fillStyle = fi;
	rect(0, 0, width, height);
	pop();
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
		this.ipos = createVector(x, y);
		this.vel = createVector(0, 0);
		this.minMarg = 50;
		this.maxMarg = random(100, 300);
		this.a = 0;
		this.dir = createVector(0, 0);
		this.off = random(0.5, 1);
		this.mult = 0.7;
		this.n = 0;
		this.ns = 0.001;
		this.count = 0;
		this.render = true;
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
		this.check();
	}
	check() {
		if (
			this.pos.x < -width / 2 + this.maxMarg ||
			this.pos.x > width / 2 - this.maxMarg ||
			this.pos.y < -height / 2 + this.maxMarg ||
			this.pos.y > height / 2 - this.maxMarg
		) {
			this.render = false;
			// this.pos.set(this.ipos);
			// this.off = random(0.5, 1);
		} else {
			this.render = true;
		}
	}
}
