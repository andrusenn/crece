/*

Estados en monocromo.

Andrés Senn
*/
let overlay,
	loaded = false,
	laps = 2,
	lap = 0,
	seed,
	particles,
	numPart, // Particles amount
	partConn = [],
	partConnSz,
	partBif,
	partBifDist,
	psw = 10,
	gbg, // Background,
	gbgDo, // Background,
	rot,
	rerot,
	id = 0,
	sinvel,
	llen,
	whench,
	rectr,
	monocromo,
	monocromo2,
	monocromo3,
	bright,
	sat = 70,
	maxRectSz,
	bw, // black or white,
	partShape,
	maxMinp,
	maxMainp,
	limitf = 240,
	// palettes
	palette = [
		0, //Complementary
	],
	idxcolor,
	bgcolors = [0, 0, 290, 200, 320, 320, 290], // 0/190 - 0/60 - 290 / 60 -200/190 - 320/180
	fgcolors = [190, 60, 60, 190, 180, 290, 30],
	// Part circ
	partCirc,
	// Slice
	sliaceW = 0,
	// circles
	iscircl,
	diamMin,
	diamMax,
	// Noise
	pbgNoise;

function setup() {
	seed = int(fxrand() * 1111111191111111);
	overlay = document.querySelector(".overlay");
	let cv = createCanvas(2160, 2160);
	pbgNoise = createGraphics(width, height);
	cv.id("monocromo");
	// Pixel density param
	const uparams = getURLParams();
	if (uparams.pd) {
		pixelDensity(float(uparams.pd));
	} else {
		pixelDensity(1);
	}

	colorMode(HSB, 360, 100, 100, 100);

	render();

	document.title = `Otro | Andr\u00e9s Senn | 2022`;
	console.log(
		`%cOtro | Andr\u00e9s Senn | Projet: `,
		"background:#333;border-radius:10px;background-size:15%;color:#eee;padding:10px;font-size:15px;text-align:center;",
	);
	noFill();
}
function draw() {
	randomSeed(seed);
	noiseSeed(seed);
	push();
	if (lap == 1) {
		translate(width / 2, height / 2);
		rotate(rot + rerot);
		translate(-width / 2, -height / 2);
	}
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
							map(sin(a * 2), -1, 1, 0, 2),
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
				let SH = map(sin(a * 5), -1, 1, 3, 30);
				setShadow(0, SH, SH, 60);
				// let B = map(frameCount, 0, limitf, 40, 100);
				let B = map(sin(a * 2), -1, 1, 0, 100);
				// if (gbg > 200) {
				// 	B = map(sin(a * 2), -1, 1, 40, 100);
				// }
				let S = map(frameCount, sat, limitf, bright, 50);
				if (bw < 0.2) {
					S = 0;
				}
				if (frameCount > whench) {
					// POINTS --------------------------------------
					// Sizes
					let swp = map(frameCount / limitf, 0, 1, 1, 0.7);
					let sw = psw;
					if (id % 50 == 0) {
						sw = maxMainp;
					}
					strokeWeight(
						map(sin(a * sinvel), -1, 1, 1 * swp, sw * swp),
					);
					// Main Points
					stroke(monocromo, 0, B, 100);
					// if (
					// 	isbicolor
					// 	// &&
					// 	// frameCount % limitf > limitf * 0.12 &&
					// 	// frameCount % limitf < limitf * 0.6
					// ) {
					// 	// let amt = constrain(
					// 	// 	map(frameCount, limitf * 0.12, limitf * 0.6, 0, 1),
					// 	// 	0,
					// 	// 	1,
					// 	// );
					// 	// let c1 = color(bicolor[][0], S, B, 100);
					// 	// let c2 = color(monocromo2, S, B, 100);
					// 	// let lerp = lerpColor(c1, c2, amt);
					// 	stroke(monocromo2, S, B, 100);
					// }
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
							let sw = random(1, 10);
							strokeWeight(sw);
							let alp = map(
								sw,
								1,
								10,
								random(5, 50),
								random(2, 5),
							);
							stroke(random(360), alp);
							circle(
								partConn[idx].x,
								partConn[idx].y,
								map(
									frameCount,
									0,
									limitf,
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

						// Min dots
						strokeWeight(random(1, maxMinp));
						stroke(int(random(2)) * 360, random(20, 60));
						point(p.pos.x + addx, p.pos.y + addy);
					}
					// Light shine
					setShadow(0, 0, 0, 0);
					stroke(255, 50);
					point(p.pos.x - 3, p.pos.y - 3);
					strokeWeight(
						map(sin(a * sinvel), -1, 1, 0.2 * swp, sw * 0.2 * swp),
					);
				} else {
					// RECTS --------------------------------------
					noStroke();
					rectMode(CENTER);
					stroke(monocromo, S, B, 100);
					if (lap == 1) {
						stroke(monocromo, S * 0.3, B * 0.8, 100);
					}
					let sz = map(sin(a * sinvel), -1, 1, 5, maxRectSz);
					let szr = map(sin(a * sinvel), -1, 1, 0, maxRectSz);
					if (rectr < 0.5) {
						szr = 0;
					}
					if (id % 3 == 0) {
						// Dots
						strokeWeight(random(1, 3));
						stroke(int(random(2)) * 360, random(20, 60));
						point(
							p.pos.x + random(-100, 100),
							p.pos.y + random(-100, 100),
						);
					}
					strokeWeight(random(0.6, 1.6));
					rect(p.pos.x, p.pos.y, sz, sz, szr, 0, szr, 0);
				}
				id++;
			}
		});
		pop();
	}
	pop();
	if (frameCount > limitf) {
		lap++;
		//noLoop();
		frameCount = floor(limitf * random(0, 0.1));
		particles.forEach((p) => {
			p.reset();
		});
		const plength = particles.length;
		particles = particles.filter((e, i) => {
			return i < plength * random(0.3, 0.5);
		});
		if (lap == 1) {
			maxRectSz = maxRectSz * random(0.1, 0.2);
			maxMainp = maxMainp * 0.5;
			monocromo = monocromo3;
			psw = 5;
		}
		if (lap == laps) {
			noLoop();
			if (!isFxpreview) {
				fxpreview();
			}
		}
	}
}
function render() {
	randomSeed(seed);
	noiseSeed(seed);
	idxcolor = floor(random(fgcolors.length));
	// Colors ---------
	monocromo = (floor(random(360) / 30) * 30) % 360; //(floor(random(360) / 20) * 20 + 80) % 360;
	monocromo2 = (monocromo + 180) % 360; //bgcolors[idxcolor]; //(floor(random(360) / 20) * 20 + 40) % 360;
	monocromo3 = monocromo;
	if (random() < 0.5) {
		monocromo2 = (monocromo + 30) % 360; //bgcolors[idxcolor]; //(floor(random(360) / 20) * 20 + 40) % 360;
		monocromo3 = (monocromo - 30) % 360;
	}
	// ----------------
	console.log(monocromo, monocromo2);
	bright = 100;
	rot = int(random(4)) * HALF_PI;
	rerot = (floor(random(1, 9)) * HALF_PI) / 2;
	sinvel = random(1, 3);
	llen = random(0.5, 5);
	whench = random(20, limitf * 0.6);
	maxRectSz = random(80, 500);
	rectr = random(2.0) % 1.0;
	bw = 0; //random();
	partShape = random(); // Line / Circle / square
	partConnSz = random(0.1, 1);
	maxMainp = random(10, 50);
	maxMinp = random(5, 20);
	gbg = 0; // default bg color
	gbgDo = random();
	laps = 2;
	//
	partCirc = boolean(int(random(3) - 1));
	partBif = boolean(int(random(2)));
	partBifDist = random(200, 800);

	// Slice width
	sliaceW = random(50, 1000);
	// circles
	iscircl = random();
	diamMin = random(10, 50);
	diamMax = random(150, 400);

	rectMode(CENTER);

	// background
	if (gbgDo < 0.6) {
		gbg = 360;
	}

	background(gbg);
	if (gbgDo < 0.3) {
		// gbg = color(monocromo2, 100, 30);
		push();
		rotateAll(4);
		// if (random() < 0.5) {
		colorBg(color(monocromo2, sat, 20));
		// } else {
		// 	colorBg(color(monocromo, 100, 20));
		// }
		pop();
	}
	rotateAll(4);
	bgNoise2();

	setShadow(0, 20, 20, 100);

	rotateAll(4);

	particles = [];
	numPart = random(150, 220);

	// Create particles ----------------------
	let varh = random(150, 400);
	let partBX = random(400, 700);
	let partBY = random(400, 700);
	if (partShape < 0.45) {
		for (let i = 0; i < numPart; i++) {
			let x = 0;
			if (partBif) {
				if (i % 3 == 0) {
					x = partBifDist / 2;
				} else {
					x = -partBifDist / 2;
				}
			}
			let p = new Particle(x, random(-varh, varh));
			p.mult = random(0.6, 0.8);
			p.maxDil = 1;
			p.offc = random(0.0, 0.001);
			particles.push(p);
		}
	} else if (partShape < 0.55) {
		for (let x = -width / 2 + partBX; x < width / 2 - partBX; x += 80) {
			for (
				let y = -height / 2 + partBY;
				y < height / 2 - partBY;
				y += 80
			) {
				let p = new Particle(x, y);
				p.mult = random(0.6, 0.8);
				p.maxDil = 1;
				p.offc = random(0.0, 0.001);
				particles.push(p);
			}
		}
	} else {
		let ang = TAU / 255;
		let rad = random(100, 900);
		for (let i = 0; i < numPart; i++) {
			let d = 0;
			// If bif change rad
			let r = 1;
			if (partBif) {
				if (i % 3 == 0) {
					d = partBifDist / 2;
					r = random(0.3, 0.5);
				} else {
					d = -partBifDist / 2;
				}
			}
			let x = cos(ang * i) * rad * r + d;
			let y = sin(ang * i) * rad * r + d;
			let p = new Particle(x, y);
			p.mult = random(0.6, 0.8);
			p.maxDil = 1;
			p.offc = random(0.0, 0.001);
			particles.push(p);
		}
	}

	// Part conn
	let partConnNum = random(2, 8);
	partConn = [];
	for (let i = 0; i < partConnNum; i++) {
		let conn = createVector(
			random(-width / 2, width / 2),
			random(-height / 2, height / 2),
		);
		partConn.push(conn);
	}
	// pop();
	overlay.style.display = "none";
}
function colorBg(c) {
	fill(0);
	noStroke();
	let fi = drawingContext.createLinearGradient(
		0,
		0,
		width,
		random() * height,
	);
	fi.addColorStop(0, c);
	// fi.addColorStop(random(0.3, 0.5), color(0));
	fi.addColorStop(1, color(0));
	drawingContext.fillStyle = fi;
	rect(width / 2, height / 2, width, height);
}
function bgNoise2(amin = 5, amax = 10) {
	pbgNoise.clear();
	pbgNoise.background(0, 0, 0, 0);
	for (let x = 0; x < pbgNoise.width; x += 4) {
		for (let y = 0; y < pbgNoise.height; y += 4) {
			strokeWeight(random(1, 5));
			stroke(
				random(361),
				map(x, 0, pbgNoise.width, 0, random(amin, amax)),
			);
			point(x + random(-5, 5), y + random(-5, 5));
		}
	}
	image(pbgNoise, 0, 0);
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

// function keyPressed() {
// 	switch (key) {
// 		case "1":
// 			overlay.style.display = "flex";
// 			clear();
// 			pixelDensity(1);
// 			break;
// 		case "2":
// 			overlay.style.display = "flex";
// 			clear();
// 			pixelDensity(2);
// 			break;
// 	}
// }
function keyReleased() {
	switch (key) {
		case "1":
			doPD("1");
			break;
		case "2":
			doPD("2");
			break;
		case "3":
			doPD("2.4");
			break;
	}
	if (key == "s" || key == "S") {
		grabImage();
	}
}
function doPD(n) {
	if (window.location.href.includes("?")) {
		if (window.location.href.includes("pd")) {
			window.location.href = window.location.href.replace(
				/pd\=(.)+/gi,
				"pd=" + encodeURI(n),
			);
		} else {
			window.location.href = window.location.href + "&pd=" + encodeURI(n);
		}
	} else {
		window.location.href = window.location.href + "?pd=" + encodeURI(n);
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
		this.maxDil = 10;
		this.a = 0;
		this.dir = createVector(0, 0);
		this.off = 0;
		this.mult = 0.7;
		this.n = 0;
		this.ns = 0.001;
		this.offc = random(0.0, 0.002);
		this.count = 0;
		this.render = true;
		this.constrain = random();
		this.constrainAmt = 0.66;
	}
	update() {
		this.n = noise(this.pos.x * this.ns, this.pos.y * this.ns, this.off);
		this.ns = map(this.n, 0, 1, 0.0005, 0.0008);
		let dil = map(sin(this.n * TAU), 0, 1, 5, this.maxDil);
		let s = map(this.n * 8, 0, 1, 6, 0.5);
		let fa = this.n * TAU * dil;
		if (this.constrain < this.constrainAmt) {
			fa = this.n * TAU * 5;
			s = PI / 4;
		}
		this.a = round(fa / s) * s;
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
	reset() {
		this.pos.set(this.ipos);
	}
}
