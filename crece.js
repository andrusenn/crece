/*
Project: Crece. ¿Cuál es la forma de la metáfora?
Platform: fxhash.xyz
By Andrés Senn
*/
let overlay,
	features = {},
	loaded = false, // overlay loaded
	laps = 2, // Draw times
	lap = 0, // Lap counter
	isLooping = true,
	seed,
	beyond = false,
	particles, // Paricles array
	iparticles, // Particles array copy
	numPart, // Particles amount
	partConn = [], // Particle connections
	partConnSz, // Particle connections
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
	// palettes
	palette,
	cromo1,
	cromo2,
	cromo3,
	cromo4,
	randomRectColor,
	sat = 0, // Palete saturation 0-100
	maxRectSz,
	bw, // black or white,
	partShape,
	maxMinp,
	maxMainp,
	limitf = 240,
	iscircl,
	diamMin,
	diamMax;

function setup() {
	seed = int(fxrand() * 9876556789);
	overlay = document.querySelector(".overlay");
	let cv = createCanvas(2160, 2160);
	cv.id("Crece");
	// Pixel density param
	const uparams = getURLParams();
	if (uparams.pd) {
		pixelDensity(float(uparams.pd));
	} else {
		pixelDensity(1);
	}

	colorMode(HSB, 360, 100, 100, 100);

	init();

	document.title = `Crece | Andr\u00e9s Senn | septiembre - 2022`;
	console.log(
		`%cCrece | Cu\u00E1l es la forma de la met\u00E1fora? - Andr\u00e9s Senn 2022 | Projet: https://github.com/andrusenn/crece`,
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
	// Three times asceleration
	for (let i = 0; i < 3; i++) {
		push();
		// Transate to center of canvas
		translate(width / 2, height / 2);
		// rotate
		rotate(rot);
		// Particles
		particles.forEach((p) => {
			// Angle
			let a = p.a + frameCount * 0.01;
			p.update();
			strokeWeight(0.6);
			push();
			translate(p.pos.x, p.pos.y);
			let s = map(sin(a * 3), -1, 1, 5, 200); // Scale line

			setShadow(0, 0, 0, 0);

			// Draw background details texture ----------------------
			if (frameCount > 100) {
				// Draw after frame 100
				if (id % 6 == 0) {
					strokeWeight(random(0.6, 2));

					let mcc = cromo1;
					// If analogue palette set different color space
					if (p.pos.y > height / 2) {
						mcc = cromo3;
					}
					if (p.pos.y > width / 2) {
						mcc = cromo4;
					}
					stroke(
						mcc,
						sat,
						map(sin(a * 10), -1, 1, 40, 100),
						map(sin(a * 10), -1, 1, 0, 4),
					);
					// Draw smooth lines texture
					line(-s * llen * 0.4, 0, s * llen * 0.4, 0);
					if (random() > 0.8) {
						// prob 20%
						line(0, -s * llen * 0.2, 0, s * llen * 0.2);
					}
					// Draw smooth cicles 50 prob
					if (iscircl < 0.5) {
						stroke(
							cromo1,
							sat,
							map(sin(a * 5), -1, 1, 20, 100),
							map(sin(a * 2), -1, 1, 0, 2),
						);
						circle(0, 0, map(sin(a * 2), -1, 1, diamMin, diamMax));
					}
				}
			} else {
				if (id % 10 == 0) {
					// Draw smooth rects
					let mcc = cromo1;
					// Set different color with height reference
					if (p.pos.y > height / 2) {
						mcc = cromo3;
					}

					stroke(
						mcc,
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
			// ----------------------------------------------------------
			// Render ---------------------------------------------------
			if (p.render) {
				// Only render away from canvas limits

				// Shadow
				let SH = map(sin(a * 5), -1, 1, 3, 30); // Sahdow offset
				setShadow(0, SH, SH, 40);

				// Sat depends on frames
				let S = map(frameCount, sat, limitf, 40, 0);
				// Bright 0 - 100 Depends on particle angle
				let B = map(sin(a * 2), -1, 1, 0, 100);

				// BW
				if (bw < 0.5) {
					S = 0;
				}

				// ---------------------
				// Draw points or rects
				// ---------------------

				if (frameCount < whench) {
					// first draw the rects *************************************
					noStroke();
					rectMode(CENTER);

					// Each 3 draw dots
					if (id % 3 == 0) {
						// Dots decoration --------------------------------
						strokeWeight(random(1, 3));
						// Dots in BW and change stroke settings
						stroke(int(random(2)) * 360, random(20, 60));
						if (
							randomRectColor &&
							frameCount > 20 &&
							frameCount < 50
						) {
							stroke(int(random(361)), 100, 100, random(80, 100));
						}
						point(
							p.pos.x + random(-100, 100),
							p.pos.y + random(-100, 100),
						);
					}

					// Rect size
					let sz = map(sin(a * sinvel), -1, 1, 5, maxRectSz);
					// Rounded size
					let szr = map(sin(a * sinvel), -1, 1, 0, maxRectSz);
					// set roundness to zero
					if (rectr < 0.5) {
						szr = 0;
					}

					// Colors and draw rects -------------------------------
					stroke(cromo1, S, B, 100);
					if (
						map(frameCount, 0, limitf, 0, 10) > 2 &&
						features["palette"] == "Near"
					) {
						stroke(cromo2, S, B, 100);
					}
					// Lap 1 is second lap
					if (lap == 1) {
						// Set low values
						stroke(cromo1, S * 0.3, B * 0.8, 100);
					}
					strokeWeight(random(0.6, 1.6));
					rect(p.pos.x, p.pos.y, sz, sz, szr, 0, szr, 0);
				} else {
					// Second, draw the points ---------------------
					// % size depends on frames
					let swp = map(frameCount / limitf, 0, 1, 1, 0.7);
					// Stroke weight
					let sw = psw;
					if (id % 50 == 0) {
						// Each 50 incrase weight
						sw = maxMainp;
					}
					// SW Depends on particle angle
					strokeWeight(
						map(sin(a * sinvel), -1, 1, 1 * swp, sw * swp),
					);
					// Main Points color
					stroke(cromo1, 0, B, 100);
					// Draw points
					point(p.pos.x, p.pos.y);

					if (id % 50 == 0) {
						// Each count 50 draw dots texture
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
							// Connected dots inside cicles ----------
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
							// Big circles ------------------------------
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
				}
				id++;
			}
		});
		pop();
	}
	pop();

	// Animation limit
	if (frameCount > limitf) {
		lap++;
		// reset framecount
		frameCount = floor(limitf * random(0, 0.1));
		particles.forEach((p) => {
			p.reset();
		});
		// Reduce particles
		const plength = particles.length;
		particles = particles.filter((e, i) => {
			return i < plength * random(0.3, 0.5);
		});
		// Second lap set/reset
		if (lap == 1) {
			maxRectSz = maxRectSz * random(0.1, 0.2);
			maxMainp = maxMainp * 0.5;
			cromo1 = cromo3;
			psw = 5;
		}
		// Ends
		if (lap == laps && !beyond) {
			noLoop();
			isLooping = false;
			if (!isFxpreview) {
				fxpreview();
			}
		}
		// What happens beyond?
		if (particles.length <= 1) {
			particles = iparticles.map((x) => x);
			lap = 0;
			maxRectSz = maxRectSz * random(0.1, 0.2);
			maxMainp = maxMainp * 0.5;
			cromo1 = cromo3;
			psw = 5;
		}
	}
}
function init() {
	// Initializations
	randomSeed(seed);
	noiseSeed(seed);

	// ----------------

	limitf = int(random(180, 280));
	rot = int(random(4)) * HALF_PI; // Rotate all
	rerot = (floor(random(1, 9)) * HALF_PI) / 2; // Add second rotation
	sinvel = random(1, 3); // Multiply velicity of angle in particles
	llen = random(0.5, 5); // Lines length
	whench = random(0, limitf * 0.6); // When change rects with points
	maxRectSz = random(80, 300); // Max rect size
	rectr = random(2.0) % 1.0; // Rect roundness
	bw = (random() + random()) / 2;
	partShape = random(); // Line / Circle / square
	partConnSz = random(0.1, 1);
	maxMainp = random(10, 50);
	maxMinp = random(5, 20);
	gbg = 0; // default bg color
	gbgDo = (random() + random()) / 2;
	let grow_impulse = random(2);
	laps = floor(grow_impulse) + 1; // laps
	randomRectColor = boolean(floor(random(2)));
	palette = random();
	partBif = boolean(floor(random(2)));
	partBifDist = random(200, 800);
	sat = round(random(0, 50));
	// circles
	iscircl = (random() + random() + random()) / 3;
	diamMin = random(10, 50);
	diamMax = random(150, 400);

	// Complementary palette
	features["palette"] = "Opposite";
	let cnums = [0, 0, 35, 35, 60, 60, 170, 275, 302, 320];
	cromo1 = cnums[floor(random() * cnums.length)];
	cromo2 = (cromo1 + 180) % 360;
	cromo3 = cromo1; // Same as 2
	cromo4 = cromo2; // Same as 2

	// Analogue palette
	// Near in the wheel
	if (palette < 0.8) {
		features["palette"] = "Near";
		cromo2 = (cromo1 + 30) % 360;
		cromo3 = (cromo1 - 30) % 360;
		cromo4 = cromo1;
	}
	// Triade
	if (palette < 0.5) {
		features["palette"] = "Triangle";
		cromo2 = (cromo1 + 120) % 360;
		cromo3 = (cromo1 - 120) % 360;
		cromo4 = cromo3;
	}
	// Double complementary
	if (palette < 0.3) {
		features["palette"] = "Quad";
		cromo2 = (cromo1 + floor(random(60, 91))) % 360;
		cromo3 = (cromo1 + 180) % 360;
		cromo4 = (cromo2 + 180) % 360;
	}

	rectMode(CENTER);

	// background
	features["moment"] = "Void";
	if (gbgDo < 0.6) {
		features["moment"] = "In thoughts";
		gbg = 360;
	}

	background(gbg);
	if (gbgDo < 0.3) {
		features["moment"] = "Any moment";
		push();
		rotateAll(4);
		colorBg(color(cromo2, sat, random(10, 80)));
		if (palette < 0.5) {
			colorBg(color(cromo3, sat, random(10, 80)));
		}
		if (palette < 0.3) {
			colorBg(color(cromo4, sat, random(10, 80)));
		}
		pop();
	}
	rotateAll(4);
	bgNoise();

	setShadow(0, 20, 20, 100);

	rotateAll(4);

	particles = [];
	numPart = random(150, 220);
	// Create particles ----------------------
	let varh = random(300, 800);
	let partBX = random(400, 800);
	let partBY = random(400, 800);
	if (partShape < 0.45) {
		features["shape"] = "Line";
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
			p.ns = random(0.0004, 0.0008);
			p.offc = map(p.ns,0.0004, 0.0008,0.0004,0.0);//random(0.0, 0.0003);
			particles.push(p);
		}
	} else if (partShape < 0.55) {
		features["shape"] = "Square";
		for (let x = -width / 2 + partBX; x < width / 2 - partBX; x += 80) {
			for (
				let y = -height / 2 + partBY;
				y < height / 2 - partBY;
				y += 80
			) {
				let p = new Particle(x, y);
				p.mult = random(0.6, 0.8);
				p.maxDil = 1;
				p.ns = random(0.0004, 0.0008);
				p.offc = map(p.ns,0.0004, 0.0008,0.0004,0.0);//random(0.0, 0.0003);
				particles.push(p);
			}
		}
	} else {
		features["shape"] = "Circle";
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
			p.ns = random(0.0004, 0.0008);
			p.offc = map(p.ns,0.0004, 0.0008,0.0004,0.0);//random(0.0, 0.0003);
			particles.push(p);
		}
	}
	//
	iparticles = particles.map((e) => e);
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
	overlay.style.display = "none";

	// Features -----------------------------

	features["grows"] = round(map(grow_impulse, 0, 2, 1, 100));
	window.$fxhashFeatures = {
		"Pigmentary composition of the metaphor": features["palette"],
		"Grow impulse of shape": features["grows"] + "%",
		"Oldness of the metaphor": round(map(sat, 0, 50, 1, 100)) + "%",
		"The moment": features["moment"],
		"Growth duration": round(map(limitf, 180, 280, 1, 100)) + "%",
		Rhizome: round(numPart) + " ramifications",
		"Shape of the metaphor": "May be a " + features["shape"] + "?",
	};
	console.log(window.$fxhashFeatures);
}
function colorBg(c) {
	push();
	fill(0);
	noStroke();
	let fi = drawingContext.createLinearGradient(
		0,
		0,
		width,
		random() * height,
	);
	fi.addColorStop(0, c);
	fi.addColorStop(1, color(0));
	drawingContext.fillStyle = fi;
	rect(width / 2, height / 2, width, height);
	pop();
	noFill();
}
function bgNoise(amin = 5, amax = 10) {
	push();
	noFill();
	for (let x = 0; x < width; x += 4) {
		for (let y = 0; y < height; y += 4) {
			strokeWeight(random(1, 5));
			stroke(random(361), map(x, 0, width, 0, random(amin, amax)));
			point(x + random(-5, 5), y + random(-5, 5));
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
	drawingContext.shadowOffsetX = x * pixelDensity();
	drawingContext.shadowOffsetY = y * pixelDensity();
	drawingContext.shadowBlur = b * pixelDensity();
	drawingContext.shadowColor = color(0, a);
}

function bgRect() {
	push();
	fill(0);
	noStroke();
	background(255);
	let fi = drawingContext.createLinearGradient(0, 0, width, 0);
	fi.addColorStop(0, color(cromo1, sat, 100));
	fi.addColorStop(1, color(cromo1, sat, 0));
	drawingContext.fillStyle = fi;
	rect(0, 0, width, height);
	pop();
	noFill();
}

function keyReleased() {
	switch (key) {
		case "1":
			doPD("1");
			break;
		case "2":
			doPD("2");
			break;
		case "3":
			doPD("3");
			break;
	}
	if (key == "s" || key == "S") {
		grabImage();
	}
	if (key == "l" || key == "L") {
		beyond = true;
		if (!isLooping) {
			loop();
		} else {
			noLoop();
		}
		isLooping = !isLooping;
	}
}

function doubleClicked() {
	grabImage();
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
	let file =
		fxhash.slice(2, 5) +
		"_" +
		fxhash.slice(-3) +
		"_" +
		width * pixelDensity() +
		"x" +
		height * pixelDensity() +
		".png";
	console.log(
		`%c SAVING ${
			String.fromCodePoint(0x1f5a4) + String.fromCodePoint(0x1f90d)
		}`,
		"background: #000; color: #ccc;padding:5px;font-size:15px",
	);
	saveCanvas(file);
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
		this.ns = random(0.0003, 0.00081);
		this.offc = random(0.0, 0.002);
		this.count = 0;
		this.render = true;
		this.constrain = random();
		this.constrainAmt = 0.66;
	}
	update() {
		this.n = noise(this.pos.x * this.ns, this.pos.y * this.ns, this.off);
		this.ns = map(this.n, 0, 1, 0.0003, 0.0008);
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
		} else {
			this.render = true;
		}
	}
	reset() {
		this.pos.set(this.ipos);
	}
}
