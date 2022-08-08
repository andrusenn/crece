/*

Estados en monocromo.

Andrés Senn
*/
let overlay;
let loaded = false;
let seed;
let particles;
let numPart;
let partConn = [];
let partConnSz;
let partBif, partBifDist;
let rot;
let id = 0;
let sinvel;
let llen;
let whench;
let rectr;
let monocromo, monocromo2;
let bicol;
let bright;
let sat = 10;
let maxRectSz;
let bw;
let partShape;
let maxMinp;
let maxMainp;
// Part circ
let partCirc;

// Slice
let sliaceW = 0;

// circles
let iscircl;
let diamMin, diamMax;

// Noise
let pbgNoise;

// Sizes
// let DEFSIZE = 2160;
// let CS = Math.min(window.innerWidth,window.innerHeight);
// let RZ = CS / DEFSIZE;

function setup() {
	seed = int(fxrand() * 1111111191111111);
	overlay = document.querySelector(".overlay");
	let cv = createCanvas(2160, 2160);
	cv.id("monocromo");
	pixelDensity(1);
	randomSeed(seed);
	noiseSeed(seed);
	// noLoop();
	colorMode(HSB, 360, 100, 100, 100);
	pbgNoise = createGraphics(width, height);
	monocromo = int(random(360)) % 360;
	monocromo2 = int(random(360)) % 360;
	bicol = boolean(int(random(2)));
	bright = 70;
	rot = int(random(4)) * HALF_PI;
	sinvel = random(1, 3);
	llen = random(0.5, 5);
	whench = random(20, 80);
	maxRectSz = random(80, 200);
	rectr = random(2.0) % 1.0;
	bw = random();
	partShape = random();
	partConnSz = random(0.1, 1);
	maxMainp = random(10, 50);
	maxMinp = random(5, 20);
	//
	partCirc = boolean(int(random(2)));
	partBif = boolean(int(random(2)));
	partBifDist = random(200,800);

	// Slice width
	sliaceW = random(50, 1000);
	// circles
	iscircl = random();
	diamMin = random(10, 50);
	diamMax = random(80, 400);

	rectMode(CENTER);

	render();

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
				if (id % 6 == 0) {
					strokeWeight(random(0.6, 2));
					stroke(
						monocromo,
						sat,
						map(sin(a * 10), -1, 1, 40, 100),
						map(sin(a * 10), -1, 1, 0, 4),
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
							map(sin(a * 2), -1, 1, 0, 5),
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
			// Render ---------------------------------------------------
			if (p.render) {
				setShadow(0, 15, 15, 100);
				// bright
				let b = map(frameCount, 0, 250, bright, 0);
				if (bw < 0.2) {
					b = 0;
				}
				if (frameCount > whench) {
					//noFill();

					// Main Points
					stroke(monocromo, b, map(sin(a), -1, 1, 40, 100), 100);
					if(bicol && frameCount % 250 > 30 && frameCount % 250 < 100){
						let lerp = lerpColor(monocromo,monocromo2,frameCount / 250);
						stroke(lerp, b, map(sin(a), -1, 1, 40, 100), 100);
					}
					let sw = 10;
					if (id % 50 == 0) {
						sw = maxMainp;
					}
					strokeWeight(map(sin(a * sinvel), -1, 1, 1, sw));
					point(p.pos.x, p.pos.y);

					if (id % 50 == 0) {
						for (let i = 0; i < 20; i++) {
							stroke(random(360), 30);
							strokeWeight(random(1, 2));
							point(
								p.pos.x + random(-sw / 2, sw / 2),
								p.pos.y + random(-sw / 2, sw / 2),
							);
						}
					}

					if (id % 20 == 0) {
						// Line points conn
						strokeWeight(1);
						stroke(int(random(2)) * 360, random(10, 50));
						let addx = random(-50, 50);
						let addy = random(-50, 50);
						if (random() < 0.01) {
							let idx = int(random(partConn.length));
							line(
								p.pos.x,
								p.pos.y,
								partConn[idx].x,
								partConn[idx].y,
							);
							strokeWeight(random(1, 20));
							circle(
								partConn[idx].x,
								partConn[idx].y,
								random(5, 10),
							);
							let sw = random(1, 100);
							strokeWeight(1, 100);
							let alp = map(
								sw,
								1,
								100,
								random(10, 50),
								random(5, 10),
							);
							stroke(random(360), alp);
							circle(
								partConn[idx].x,
								partConn[idx].y,
								map(
									frameCount,
									0,
									250,
									0,
									(width / 2) * partConnSz + random(-50, 50),
								),
							);
						} else {
							line(
								p.pos.x,
								p.pos.y,
								p.pos.x + addx,
								p.pos.y + addy,
							);
						}

						// Min Points
						strokeWeight(random(1, maxMinp));
						stroke(int(random(2)) * 360, random(20, 60));
						point(p.pos.x + addx, p.pos.y + addy);
					}
				} else {
					noStroke();
					rectMode(CENTER);
					stroke(monocromo, b, map(sin(a), -1, 1, 40, 100));
					if(bicol && frameCount % 250 > 30 && frameCount % 250 < 100){
						// Verrrrr 30 = 0% 45 = 100% 60 = 0%
						let lerp = lerpColor(monocromo,monocromo2,frameCount / 250);
						stroke(lerp, b, map(sin(a), -1, 1, 40, 100));
					}
					let sz = map(sin(a * sinvel), -1, 1, 5, maxRectSz);
					let szr = map(sin(a * sinvel), -1, 1, 0, maxRectSz);
					if (rectr < 0.5) {
						szr = 0;
					}
					if (id % 3 == 0) {
						// Dots
						strokeWeight(random(1, 6));
						stroke(int(random(2)) * 360, random(20, 60));
						point(
							p.pos.x + random(-20, 20),
							p.pos.y + random(-20, 20),
						);
					}
					strokeWeight(0.6);
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
function render() {
	randomSeed(seed);
	noiseSeed(seed);
	// background
	background(0);
	if (random() < 0.1) {
		background(255);
	}
	rotateAll(4);

	// BG Noise
	bgNoise2();

	setShadow(0, 20, 20, 100);

	rotateAll(4);

	particles = [];
	numPart = random(200, 350);
	let varh = random(0, 100);
	let partBX = random(0, 700);
	let partBY = random(0, 700);
	if (partShape < 0.45) {
		for (let i = 0; i < numPart; i++) {
			let x = 0;
			if(partBif){
				if(i % 3 == 0){
					x = partBifDist / 2;
				}else{
					x = -partBifDist / 2;
				}
			}
			let p = new Particle(x, random(-varh, varh));
			particles.push(p);
		}
	} else if (partShape < 0.55) {
		for (let x = -width / 2 + partBX; x < width / 2 - partBX; x += 100) {
			for (
				let y = -height / 2 + partBY;
				y < height / 2 - partBY;
				y += 100
			) {
				let p = new Particle(x, y);
				particles.push(p);
			}
		}
	} else {
		let ang = TAU / 255;
		let rad = random(100, 950);
		for (let i = 0; i < numPart; i++) {
			let d = 0;
			// If bif change rad
			let r = 1;
			if(partBif){
				if(i % 3 == 0){
					d = partBifDist / 2;
					r = 0.3;
				}else{
					d = -partBifDist / 2;
				}
			}
			let x = cos(ang * i) * rad * r + d;
			let y = sin(ang * i) * rad * r + d;
			let p = new Particle(x, y);
			particles.push(p);
		}
	}

	// Part conn
	let partConnNum = random(2, 8);
	for (let i = 0; i < partConnNum; i++) {
		let conn = createVector(
			random(-width / 2, width / 2),
			random(-height / 2, height / 2),
		);
		partConn.push(conn);
	}
	overlay.style.display = "none";
}
// function bgNoise() {
// 	let maxr = random(50, 120);
// 	let d = pixelDensity();
// 	pbgNoise.clear();
// 	pbgNoise.background(0, 0, 0, 0);
// 	pbgNoise.loadPixels();
// 	for (let x = 0; x < pbgNoise.width; x += 1) {
// 		for (let y = 0; y < pbgNoise.height; y += 1) {
// 			let index =
// 				4 *
// 				((x * d + int(random(5))) * (pbgNoise.width * d) +
// 					(y * d + int(random(5))));
// 			// loop over
// 			pbgNoise.pixels[index] =
// 				pbgNoise.pixels[index + 1] =
// 				pbgNoise.pixels[index + 2] =
// 					int(random(256));
// 			pbgNoise.pixels[index + 3] = int(
// 				map(x, 0, pbgNoise.width, 0, random(10, maxr)),
// 			);
// 		}
// 	}
// 	pbgNoise.updatePixels();
// 	image(pbgNoise, 0, 0);
// }

function bgNoise2() {
	pbgNoise.clear();
	pbgNoise.background(0, 0, 0, 0);
	for (let x = 0; x < pbgNoise.width; x += 4) {
		for (let y = 0; y < pbgNoise.height; y += 4) {
			strokeWeight(random(1, 3));
			stroke(random(361), map(x, 0, pbgNoise.width, 0, random(5, 20)));
			point(x + random(-5, 5), y + random(-5, 5));
		}
	}
	image(pbgNoise, 0, 0);
}
// function sliceCanvas(_slice) {
// 	push();
// 	imageMode(CORNER);
// 	noSmooth();
// 	const num = int(random(1, 5));
// 	let imgs = [];

// 	for (let s = 0; s < num; s++) {
// 		let img;
// 		if (_slice == "X") {
// 			img = get((s * width) / num, 0, width / num, height);
// 		} else {
// 			// Y default
// 			img = get(0, (s * height) / num, width, height / num);
// 		}
// 		imgs.push(img);
// 	}
// 	let rimg = imgs.sort((a, b) => 0.5 - random(1));
// 	setShadow(0, 10, 20, 50);
// 	for (let i = 0; i < num; i++) {
// 		noFill();
// 		if (_slice == "X") {
// 			let rpos = 0;
// 			image(rimg[i], int(width / num) * i + rpos, 0);
// 		} else {
// 			let rpos = 0;
// 			image(rimg[i], 0, int(height / num) * i + rpos);
// 		}
// 	}
// 	pop();
// }
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

function keyPressed() {
	switch (key) {
		case "0":
			overlay.style.display = "flex";
			clear();
			pixelDensity(0.6);
			frameCount = 0;
			break;
		case "1":
			overlay.style.display = "flex";
			clear();
			pixelDensity(1);
			frameCount = 0;
			break;
		case "2":
			overlay.style.display = "flex";
			clear();
			pixelDensity(2);
			frameCount = 0;
			break;
	}
}
function keyReleased() {
	switch (key) {
		case "0":
			render();
			loop();
			break;
		case "1":
			render();
			loop();
			break;
		case "2":
			render();
			loop();
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

class Particle {
	constructor(x, y) {
		this.pos = createVector(x, y);
		this.ipos = createVector(x, y);
		this.vel = createVector(0, 0);
		this.minMarg = 50;
		this.maxMarg = random(100, 300);
		this.a = 0;
		this.dir = createVector(0, 0);
		this.off = 0;
		this.mult = 0.7;
		this.n = 0;
		this.ns = 0.001;
		this.offc = random(0.0, 0.002);
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
		this.off += this.offc;
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
