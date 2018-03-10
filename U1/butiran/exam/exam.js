/*
	exam.js
	Represent problems for exam in JS
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180303
	Start this library.
	20180304
	Continue improving this library.
*/

// 20180304.1658 ok
function executeScript(target, menu) {
	var target = window.event.target;
	var value = target.value;
	var idx = target.selectedIndex;
	var script = menu[idx][1];
	script();
}

// 20180306.0514 
function examThreeGrains() {
	var eout = document.getElementById("scriptResult");
	eout.innerHTML = "";
	var sel = window.event.target;
	
	// Execute a test function
	test_define_rectangle();

	// 20180213.0751-1512 ok
	function test_define_rectangle() {
		// Define a box coordinates
		/*
				z
				|
				
				H           G
				 .---------.
				/         /|
		 E /       F / |
			.---------.  |
			|  .      |  .
			| D       | / C
			|         |/
			.---------.    -- x
		 A           B
		*/
		var s = 1;
		var rA = new Vect3(0, 0, 0);
		var rB = new Vect3(s, 0, 0);
		var rC = new Vect3(s, s, 0);
		var rD = new Vect3(0, s, 0);
		var rE = new Vect3(0, 0, s);
		var rF = new Vect3(s, 0, s);
		var rG = new Vect3(s, s, s);
		var rH = new Vect3(0, s, s);
		
		// Define box sides
		var surf = new Grid4();
		var sides = [];
		surf = new Grid4(rE, rF, rB, rA);
		sides.push(surf);
		surf = new Grid4(rF, rG, rC, rB);
		sides.push(surf);
		surf = new Grid4(rG, rH, rD, rC);
		sides.push(surf);
		surf = new Grid4(rH, rE, rA, rD);
		sides.push(surf);
		surf = new Grid4(rE, rH, rG, rF);
		sides.push(surf);
		
		// Defina spherical particles
		var p = new Sphere();
		var pars = [];
		p = new Sphere();
		p.m = 4;
		p.d = 0.2;
		p.r = new Vect3(0.25, 0.25, 0.25);
		p.v = new Vect3(0.1, 0.05, 0);
		pars.push(p);
		p = new Sphere();
		p.m = 4;
		p.d = 0.2;
		p.r = new Vect3(0.25, 0.5, 0.25);
		p.v = new Vect3(0.0, 0.05, 0);
		pars.push(p);
		p = new Sphere();
		p.m = 4;
		p.d = 0.2;
		p.r = new Vect3(0.8, 0.8, 0.25);
		p.v = new Vect3(-0.02, 0.05, 0);
		pars.push(p);
		
		// Define world coordinate
		var xmin = -0.1;
		var ymin = -0.1;
		var xmax = 1.1;
		var ymax = 1.1;
		
		// Define canvas size
		var canvasWidth = 150;
		var canvasHeight = 150;
		
		// Define canvas coordinate
		var XMIN = 0;
		var YMIN = canvasHeight;
		var XMAX = canvasWidth;
		var YMAX = 0;
		
		// Create a canvas
		var c = document.createElement("canvas");
		c.id = "drawingboard";
		c.width = canvasWidth;
		c.height = canvasHeight;
		c.style.border = "1px solid #ccc";
		
		// Create some divs
		var d;
		d	= document.createElement("div");
		d.id = "ekin";
		document.body.appendChild(d);
		d	= document.createElement("div");
		d.id = "hidtext";
		document.body.appendChild(d);
		
		// Draw a circle
		function drawSphere(id, s, color) {
			var cx = document.getElementById(id).getContext("2d");
			cx.fillStyle = color;
			cx.strokeStyle = color;
			cx.beginPath();
			var rr = transform({x: s.r.x, y: s.r.y});
			var rr2 = transform({x: s.r.x + s.d, y: s.r.y});
			var DD = rr2.x - rr.x;
			cx.arc(rr.x, rr.y, 0.5 * DD, 0, 2 * Math.PI);
			cx.stroke();
		}
		
		// Draw sides of rectangle
		function drawRectangles(id, surfs, color) {
			var cx = document.getElementById(id).getContext("2d");
			cx.strokeStyle = color;
			var N = surfs.length;
			for(var i = 0; i < N; i++) {
				var M = surfs[i].p.length;
				cx.beginPath();
				for(var j = 0; j < M; j++) {
					var s = surfs[i];
					var rr = transform({x: s.p[j].x, y: s.p[j].y});
					if(j == 0) {
						cx.moveTo(rr.x, rr.y);
					} else {
						cx.lineTo(rr.x, rr.y);
					}
				}
				cx.stroke();
			}
		}
		
		// Clear canvas with color
		function clearCanvas() {
			var id = arguments[0];
			var el = document.getElementById(id);
			var color = arguments[1];
			var cx = el.getContext("2d");
			cx.fillStyle = color;
			cx.fillRect(0, 0, c.width, c.height);
		}
		
		// Transform (x, y) to (X, Y)
		function transform(r) {
			var X = (r.x - xmin) / (xmax - xmin) * (XMAX - XMIN);
			X += XMIN;
			var Y = (r.y - ymin) / (ymax - ymin) * (YMAX - YMIN);
			Y += YMIN;
			return {x: X, y: Y};
		}
		
		// Collide particle and a rectangle surface
		function collide(p, surf) {
			// Declare force variable
			var F = new Vect3();
			
			// Define constants
			var kN = 100;
			var gN = 0.2;
			
			if(arguments[1] instanceof Grid4) {
				// Get colliding objects
				var p = arguments[0];
				var surf = arguments[1];
				
				// Calculate normal vector
				var r10 = Vect3.sub(surf.p[1], surf.p[0]);
				var r21 = Vect3.sub(surf.p[2], surf.p[1]);
				var n = Vect3.cross(r10, r21);
				
				// Calculate distance from surface
				var r = p.r;
				var dr = Vect3.sub(r, surf.p[0]);
				var h = Math.abs(Vect3.dot(dr, n));
				
				// Calculate overlap
				var xi = Math.max(0, 0.5 * p.d - h);
				var xidot = Vect3.dot(p.v, n);
				
				// Calculate force
				var f = (xi > 0) ? kN * xi - gN * xidot : 0;
				F = Vect3.mul(f, n);
			} else {
				// Get colliding objects
				var p0 = arguments[0];
				var p1 = arguments[1];
				
				// Calculate overlap
				var r10 = Vect3.sub(p1.r, p0.r);
				var l10 = r10.len();
				var n = r10.unit();
				var v10 = Vect3.sub(p1.v, p0.v);
				var xi = Math.max(0, 0.5 * (p1.d + p0.d) - l10);
				var xidot = Vect3.dot(v10, n);
				
				// Calculate force
				var f = (xi > 0) ? kN * xi - gN * xidot : 0;
				var m0 = p0.m;
				var m1 = p1.m;
				var mu = (m1 * m0) / (m0 + m1);
				f /= mu;
				F = Vect3.mul(f, n);
			}
			
			// Return force value
			return F;
		}
		
		var TBEG = new Date().getTime()
		console.log("BEG: " + TBEG);
		var tbeg = 0;
		var tend = 1000;
		var dt = 5E-2;
		var t = tbeg;
		var NT = 100;
		var iT = 0;
		var NT2 = 10;
		var iT2 = 0;
		
		// 20180222.2117
		var div = document.createElement("div");
		div.style.textAlign = "center";
		var b1 = document.createElement("button");
		b1.innerHTML = "Start";
		div.append(c);
		div.appendChild(b1);
		eout.append(div);
		var ekin = document.createElement("div");
		ekin.id = "ekin";
		div.append(ekin);
		
		var iter;
		
		b1.addEventListener("click", function() {
			if(b1.innerHTML == "Start") {
				b1.innerHTML = "Stop";
				sel.disabled = true;
				iter = setInterval(simulate, 5);
			} else {
				b1.innerHTML = "Start";
				clearInterval(iter);
				sel.disabled = false;
			}
		});
				
		function calculate() {
			var M = pars.length;
			
			for(var j = 0; j < M; j++) {
				var p = pars[j];
				
				// Calculate force with wall
				var SF = new Vect3();
				var N = sides.length;
				for(var i = 0; i < N; i++) {
					var F = collide(p, sides[i]);
					SF = Vect3.add(SF, F);
				}
				
				// Calculate force with other particles
				for(var i = 0; i < M; i++) {
					if(i != j) {
						var F = collide(pars[i], pars[j]);
						SF = Vect3.add(SF, F);
					}
				}
				
				// Calculate acceleration
				p.a = Vect3.div(SF, p.m);
				
				// Perform Euler numerical integration
				p.v = Vect3.add(p.v, Vect3.mul(p.a, dt));
				p.r = Vect3.add(p.r, Vect3.mul(p.v, dt));
			}
			
			// Increase time
			t += dt;
			
			// Stop simulation
			if(t > tend) {
				clearInterval(iter);
				var TEND = new Date().getTime();
				console.log("END: " + TEND);
				var TDUR = TEND - TBEG;
				console.log("DUR: " + TDUR);
			}
		}
		
		function simulate() {
			calculate();
			
			iT++;
			iT2++;
			
			if(iT2 >= NT2) {
				// Clear and draw
				clearCanvas("drawingboard", "#fff");
				drawRectangles("drawingboard", sides, "#f00");
				var M = pars.length;
				for(var j = 0; j < M; j++) {
					drawSphere("drawingboard", pars[j], "#00CED1"); //#00f
				}
				iT2 = 0;
			}
			if(iT >= NT) {
				// Calculate total kenetic energy
				var K = 0;
				var M = pars.length;
				for(var j = 0; j < M; j++) {
					var v = pars[j].v.len();
					var m = pars[j].m;
					K += (0.5 * m * v * v);
				var sK = K.toExponential(2)
				}
				var aa = sK.split("e")[0];
				var bb = sK.split("e")[1];
				var textEkin = "<i>K</i> = " + aa
					+ " &times; 10<sup>" + bb + "</sup> J";
				ekin.innerHTML = textEkin;
				
				iT = 0;
			}
		}
	}
}

// 20180305.2023 ok
function examRandomLines() {
	var eout = document.getElementById("scriptResult");
	eout.innerHTML = "";
	
	var w = 200;
	var h = 200;
	
	var can = createCanvasWithId("drawingArea", w, h);
	eout.appendChild(can);
	var cx = can.getContext("2d");
	
	var i = 0;
	var di = 1;
	var iend = 1000;
	var sel = window.event.target;
	sel.disabled = true;
	
	var tid = setInterval(randomLine, 10);
	
	var x = w / 2;
	var y = h / 2;
	
	function randomLine() {
		if(i >= iend) {
			i = iend;
			clearInterval(tid);
			sel.disabled = false;
		}
		
		var theta = randInt(0, 360);
			if(theta < 45){
				theta = 0;
			} else if(theta < 135) { 
				theta = 90;
			} else if(theta < 225){
				theta = 180;
			} else{
				theta = 270;
			}
		var dr = 10;
		var dx = dr * Math.cos(theta * Math.PI / 180);
		var dy = dr * Math.sin(theta * Math.PI / 180);
		
		var j = (i / iend) * 255;
		cx.strokeStyle = int2rgb(255 - j, 0, j);
		cx.beginPath();
		cx.moveTo(x, y);
		x += dx;
		if(x > w || x < 0) x -= dx;
		y += dy;
		if(y > h || y < 0) y -= dy;
		cx.lineTo(x, y);
		cx.stroke();
		
		i += di;
	}
		
	function createCanvasWithId(id, w, h) {
		var can = document.createElement("canvas");
		can.width = w;
		can.height = h;
		can.style.width = w + "px";
		can.style.height = h + "px";
		can.style.border = "1px solid #bbb";
		can.id = id;
		return can;
	}
}


// 20180305.1948 ok
function examToggleButton() {
	var eout = document.getElementById("scriptResult");
	eout.innerHTML = "";
	
	var div = document.createElement("div");
	div.style.width = "40px";
	div.style.height = "40px";
	div.style.border = "1px solid #000";
	div.style.background = "#eee";
	
	var btn = document.createElement("button");
	btn.innerHTML = "Off";
	btn.style.width = "42px";
	btn.style.height = "20px";
	btn.addEventListener("click", switchOnOff);
	
	eout.appendChild(div);
	eout.appendChild(btn);

	var div1 = document.createElement("div");
	div1.style.width = "40px";
	div1.style.height = "40px";
	div1.style.border = "1px solid #000";
	div1.style.background = "#eee";
	
	var btn1 = document.createElement("button");
	btn1.innerHTML = "Off";
	btn1.style.width = "42px";
	btn1.style.height = "20px";
	btn1.addEventListener("click", switchOnOff1);
	
	eout.appendChild(div1);
	eout.appendChild(btn1);

	var div2 = document.createElement("div");
	div2.style.width = "40px";
	div2.style.height = "40px";
	div2.style.border = "1px solid #000";
	div2.style.background = "#eee";
	
	var btn2 = document.createElement("button");
	btn2.innerHTML = "Off";
	btn2.style.width = "42px";
	btn2.style.height = "20px";
	btn2.addEventListener("click", switchOnOff2);
	
	eout.appendChild(div2);
	eout.appendChild(btn2);

	console.log(div);
	function switchOnOff() {
		var btn = window.event.target;
		var div = btn.previousSibling;
		if(btn.innerHTML == "Off") {
			btn.innerHTML = "On";
			div.style.background = "#faa";
		} else {
			btn.innerHTML = "Off";
			div.style.background = "#eee";
		}
	}
	function switchOnOff1() {
		var btn = window.event.target;
		var div = btn.previousSibling;
		if(btn.innerHTML == "Off") {
			btn.innerHTML = "On";
			div.style.background = "#7FFF00";
		} else {
			btn.innerHTML = "Off";
			div.style.background = "#eee";
		}
	}

	function switchOnOff2() {
		var btn = window.event.target;
		var div = btn.previousSibling;
		if(btn.innerHTML == "Off") {
			btn.innerHTML = "On";
			div.style.background = "#00BFFF";
		} else {
			btn.innerHTML = "Off";
			div.style.background = "#eee";
		}
	}

}

// 20180304.2142 ok
function examChartXY() {
	var eout = document.getElementById("scriptResult");
	eout.innerHTML = "";
	
	var ecan = document.createElement("canvas");
	ecan.width = "300";
	ecan.height = "200";
	ecan.style.width = "300px";
	ecan.style.height = "200px";
	ecan.id = "drawingArea"
	ecan.style.background = "#f8f8f8";
		
	eout.appendChild(ecan);
	
	var t = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	var x = new Array();
	for(var i = 0; i < t.length; i++){
		x[i] = 2*Math.sin(2*Math.PI*t[i]*Math.PI/1800);
	}
	var series = new XYSeries("series1", t, x);
	var chart = new Chart2("drawingArea");
	chart.yAxis.Ntics = 4;
	chart.xAxis.Ntics = 8;
	chart.addSeries(series);
	chart.drawSeries("series1");
}

// 20180304.2107 ok
function examTextareaMatrix() {
	var eout = document.getElementById("scriptResult");
	eout.innerHTML = "";
	
	var elef = document.createElement("div");
	elef.style.width = "125px";
	elef.style.float = "left";
	
	var erig = document.createElement("div");
	erig.style.float = "left";
	erig.style.padding = "4px 50px 4px 50px";
	erig.id = "mathjax-matrix"
	
	var etxa = document.createElement("textarea");
	etxa.style.width = "120px";
	etxa.style.height = "120px";
	etxa.style.overflowY = "scroll"
	etxa.value = "1 2 3 4\n"
	+ "0 4 0 4\n"
	+ "1 3 9 7\n"
	+ "6 4 5 8";
	
	var etxa1 = document.createElement("text");
	etxa1.value = "\\frac{1}{10} 2 3 log\\frac{3}{9}\n"
	+ "0 4 sin(x^2) 4\n"
	+ "1 -\exp(y) 9 7\n"
	+ "6 4 5 \\frac{z}{x}";

	var ebtn = document.createElement("button");
	ebtn.innerHTML = "MathJax matrix";
	ebtn.style.width = "125px";
	ebtn.addEventListener("click", btnClick);
	
	eout.appendChild(elef);
		elef.appendChild(etxa);
		elef.appendChild(ebtn);
	eout.appendChild(erig);
	

	function btnClick() {
		var content = etxa1.value;
		//car content = 
		var lines = content.split("\n");
		var M = [];
		for(var j = 0; j < lines.length; j++) {
			var words = lines[j].split(" ");
			var row = [];
			for(var i = 0; i < words.length; i++) {
				var Mel = words[i];
				row.push(Mel);
			}
			M.push(row);
		}
		console.log(M);
		var ROW = M.length;
		
		var latex = "\\begin{equation}\n"
			+ "M = \\left[\n"
			+ "\\begin{array}\n";
		var COL = M[0].length;
		latex += "{" + "c".repeat(COL) + "}\n";
		for(var j = 0; j < ROW; j++) {
			var arow = M[j];
			var COL = arow.length;
			for(var i = 0; i < COL; i++) {
				latex += M[j][i];
				if(i < COL - 1) {
					latex += " & ";
				} else {
					latex += " \\\\\n";
				}
			}
		}
		latex += "\\end{array}\n"
			+ "\\right]\n"
			+ "\\end{equation}";
		
		updateMath("mathjax-matrix", latex)
	}
}

// 20180304.1608 ok
function examTable() {
	var div = document.getElementById("scriptResult");
	div.innerHTML = "";
	var t = [];
	var x = [];
	var y = [];

	for(var i = 0; i < 11; i++){
		t[i] = i;
		x[i] = 2*Math.cos(2*Math.PI*t[i]*Math.PI/1800); //sinus kosinus menggunakan satuan sudut
		y[i] = 2*Math.sin(2*Math.PI*t[i]*Math.PI/1800); 
		console.log(x[i]);
	}

	var str = new Array(11).fill(new Array(3).fill(0));
	str[0] = new Array("t", "x", "y");
	
	for(var i = 1; i < 12; i++){	
		str[i] = new Array(t[i-1], x[i-1], y[i-1]);
		
	}

	var tab = document.createElement("table");
	tab.style.background = "#fee";
	var ROW = str.length;
	for(var j = 0; j < ROW; j++) {
		var row = document.createElement("tr");
		if(j == 0) {
			row.style.background = "#fde";
			row.style.fontWeight = "bold";
			row.style.fontStyle = "italic";
			row.style.fontFamily = "Times";
			row.style.color = "red";
		} else {
			row.style.background = "#ffe";
		}
		var dataRow = str[j];
		var COL = dataRow.length;
		for(var i = 0; i < COL; i++) {
			var dataCol = dataRow[i];
			var col = document.createElement("td");
			col.style.border = "1px solid #fde";
			col.style.width = "80px";
			col.style.textAlign = "center";
			col.innerHTML = dataCol;
			row.appendChild(col);
		}
		tab.appendChild(row);
	}
	div.appendChild(tab);
}

// 20180304.0929 ok
function examSimpleStatistics() {
	var div = document.getElementById("scriptResult");
	div.innerHTML = "&nbsp;";
	var min = 2;
	var max = 10;
	var N = 20;
	var x = randIntN(min, max, N);
	var xsum = 0;
	for(var i = 0; i < N; i++) {
		xsum += x[i];
	}
	
	x = x.sort(function(a,b){return a - b});
	
	var xavg = xsum / N;
	var xmed = (x[N/2] + x[N/2 + 1])/2;
	var xdevsum = 0;
	for(var i = 0; i < N; i++) {
		xdevsum += (x[i] - xavg)*(x[i] - xavg);
		console.log(xdevsum);
	}
	var xdev = (xdevsum/19)^0.5;
	
	var str = "xmin = " + min + "<br/>";
	str += "xmax = " + max + "<br/>";
	str += "xsum = " + xsum + "<br/>";
	str += "x = [" + x + "]<br/>";
	str += "N = " + N + "<br/>";
	str += "xavg = " + xavg + "<br/>";
	str += "xmed = " + xmed + "<br/>";
	str += "xdev = " + xdev + "<br/>";
	div.innerHTML = str;
}

// 20180304.0617 ok
function examProgressBar() {
	var div = document.getElementById("scriptResult");
	div.innerHTML = "&nbsp;";
	var i = 0;
	var di = 2;
	var iend = 100;
	var sel = window.event.target;
	sel.disabled = true;
	
	var tid = setInterval(progressBar, 100);
	
	function progressBar() {
		if(i >= iend) {
			i = iend;
			clearInterval(tid);
			sel.disabled = false;
		}
		var N = Math.round(i / di);
		var s = "#".repeat(N) + " " + i + " %";
		div.innerHTML = s;
		i += di;
	}
}

// 20180304.0553 ok
function examButtonClick() {
	var div = document.getElementById("scriptResult");
	div.innerHTML = "&nbsp;";
	var btn = document.createElement("button");
	btn.id = "b1";
	btn.style.width = "120px";
	btn.innerHTML = "Not yet clicked";
	btn.addEventListener("click", buttonClick);
	div.appendChild(btn);
	var clicked1 = 0;

	var btn1 = document.createElement("button");
	btn1.style.width = "120px";
	btn1.innerHTML = "Not yet clicked";
	btn1.addEventListener("click", buttonClick);
	div.appendChild(btn1);
	var clicked2 = 0;
	var clicked = 0;

	function buttonClick() {
		clicked++;
		var a = window.event.target;//document.getElementById("b1");//
		var i = a.nextSibling;
		if( i == null){
			var target = a.previousSibling;
			clicked1++;
			clicked = clicked1;
		} else {
			var target = a.nextSibling;
			clicked2++;
			clicked = clicked2;
		}
		
		console.log(target) ;
		if(clicked == 1) {
			target.innerHTML = "Clicked once";
		} else if(clicked == 2) {
			target.innerHTML = "Clicked twice";
		} else {
			target.innerHTML = "Clicked " + clicked + " times";
		}


	}
}

// 20180304.0545 ok
function examColorBar() {
	var div = document.getElementById("scriptResult");
	div.innerHTML = "&nbsp;";
	N = 16;
	for(var i = 0; i < N; i++) {
		var sp = document.createElement("span");
		var x = i * 16 - 1; var y = i * 22 - 1;
		var color = int2rgb(0 + x, 0 + y, 0);
		sp.style.background = color;
		sp.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;\
		&nbsp;&nbsp;&nbsp;&nbsp;";
		div.appendChild(sp);
	}
}

// 20180304.0530 ok
function examLetterConfiguration() {
	var div = document.getElementById("scriptResult");
	var str = "Komputasi Sistem Fisis";
	var N = str.length;
	var str2 = "";
	for(var i = N-1; i > -2; i-=3) {
		str2 += str.substring(0, i + 1) + "<br/>";
	}
	div.innerHTML = str2;
}

// 20180304.0004 ok
function examDrawCircle() {
	var div = document.getElementById("scriptResult");
	div.innerHTML = "&nbsp;";
	var can = document.createElement("canvas");
	div.appendChild(can);
	var cx = can.getContext("2d");
	cx.fillStyle = "#00CED1";
	cx.strokeStyle = "#0000FF";
	cx.lineWidth = 3;
	cx.beginPath();
	cx.arc(50, 50, 40, 0, 2 * Math.PI);
	cx.fill();
	cx.stroke();
	
	cx.fillStyle = "#ADFF2F";
	cx.strokeStyle = "#008000";
	cx.lineWidth = 3;
	cx.beginPath();
	cx.arc(100 + 50, 50, 40, 0, 2 * Math.PI);
	cx.fill();
	cx.stroke();
	
	cx.fillStyle = "#E9967A";
	cx.strokeStyle = "#8B0000";
	cx.lineWidth = 3;
	cx.beginPath();
	cx.arc(200 + 50, 50, 40, 0, 2 * Math.PI);
	cx.fill();
	cx.stroke();
}

// 20180303.2347 ok
function examMathJaxRootFormula() {
	var div = document.getElementById("scriptResult");	
	var str = "";
	str += "\\begin{equation}";
	str += "ax^2 + bx + c = 0 \\" + " \(1\)" + "\\\\";
	str += "x_{1,2} = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}" + " \(2\)" + "\\\\" ;
	str += "x^2 + \\frac{b}{a}x + \\frac{c}{a} = 0 \\" + " \(3\)" + "\\\\";
	str += "\(x - x_1\)\(x-x_2\) = 0 \\" + " \(4\)" + "\\\\";
	str += "x_1 + x_2 = -\\frac{b}{a} \\" + " \(6\)" + "\\\\";
	str += "x_1.x_2 = \\frac{c}{a} \\" + " \(7\)" + "\\\\";
	str += "\\end{equation}";
	updateMath("scriptResult", str);
 

}

// 20180303.2308 ok
function examDisplaySeries() {
	var div = document.getElementById("scriptResult");
	var N = 10;
	var str = "";
	for(var i = 0; i < N; i++) {
		var n = i*i + 2; 
		str += n + "<br/>";
	}
	div.innerHTML = str;
}

// 20180303.2249 ok
function examClear() {
	var div = document.getElementById("scriptResult");
	

}

// 20180303.2249 ok
function examHelloWorld() {
	var div = document.getElementById("scriptResult");
	div.innerHTML = "Selamat pagi dan selamat datang di folder solusi saya untuk U1. <br/> Nama saya adalah Ardhi Rofi Mufdhila <br/> NIM saya adalah 10215068  <br/> Senang berkenalan dengan Anda. ";
}

function examTextareaAndChartXY() {
	var eout = document.getElementById("scriptResult");
	eout.innerHTML = "";
	
	var elef = document.createElement("div");
	elef.style.width = "150px";
	elef.style.float = "left";

	var text = document.createElement("textarea");
	text.style.width = "150px";
	text.style.heigth = "150px";
	text.style.overflowY = "scroll";
	text.style.overflowX = "scroll";
	text.value = "x y\n"
	+ "1 1\n"
	+ "2 4\n"
	+ "3 9\n"
	+ "4 16\n"
	+ "5 25\n"
	+ "6 36\n"
	+ "7 49"
	
	var canv = document.createElement("canvas");
	canv.width = "300";
	canv.heigth = "200";
	canv.style.width = "300px";
	canv.style.heigth = "200px";
	canv.id = "drawingArea";
	canv.style.background = "#f8f8f8";
	eout.appendChild(canv);
	//tombol
	var tombol = document.createElement("button");
	tombol.style.width = "100px";
	tombol.innerHTML = "Plot data";
	tombol.addEventListener("click", btnClick);
	//KOTAK
	//WARNA STROKE


	
	
	function btnClick(){
		var content = text.value;
		var lines = content.split("\n");
		var mx = [];
		var my = [];
 		for(var j= 1; j < lines.length; j++){
			var words = lines[j].split(" ");
			var x = [];
			var y = [];
			for(var i =0; i < 1; i++){
				var Melx = words[i];
				var Mely = words[i+1];
				x.push(Melx);
				y.push(Mely);
			}		
			mx.push(x);
			my.push(y);
		}
		
		console.log(mx);
		console.log(my);

		var series = new XYSeries("series1", mx, my);
		var chart = new Chart2("drawingArea");
		chart.yAxis.Ntics = 4;
		chart.xAxis.Ntics = 8;
		chart.addSeries(series);
		chart.drawSeries("series1");

	}

	 eout.appendChild(elef);
	 	elef.appendChild(text);
		elef.appendChild(tombol);
	
}

function examArrayOfCircle() {
	var div = document.getElementById("scriptResult");
	div.innerHTML = "";

	var can = document.createElement("canvas");
	can.width = "600";
	can.heigth = "600";
	div.appendChild(can);
	var cx = can.getContext("2d");
	var j = 0;

	for(var i = 1; i < 6; i++){
		for(var j = 0; j < i; j++){
			cx.fillStyle = "#00CED1";
			cx.strokeStyle = "#0000FF";
			cx.lineWidth = 3;
			cx.beginPath();
			cx.arc(50 + 30*j, 15 + 30*i, 10, 0, 2 * Math.PI);
			cx.fill();
			cx.stroke();
		}
	}

	
}

function examDrawCircularMotion() {
	var eout = document.getElementById("scriptResult");
	eout.innerHTML = "";
	var sel = window.event.target;
	
	// Execute a test function
	test_define_rectangle();

	// 20180213.0751-1512 ok
	function test_define_rectangle() {

		// Defina spherical particles
		var p = new Sphere();
		var pars = [];
		p = new Sphere();
		p.m = 4;
		p.d = 0.2;
		p.r = new Vect3(0.25, 0.25, 0.25);
		p.v = new Vect3(0.1, 0.05, 0);
		pars.push(p);
	
		// Define world coordinate
		var xmin = -1.1;
		var ymin = -1.1;
		var xmax = 1.1;
		var ymax = 1.1;
		
		// Define canvas size
		var canvasWidth = 150;
		var canvasHeight = 150;
		
		// Define canvas coordinate
		var XMIN = 0;
		var YMIN = canvasHeight;
		var XMAX = canvasWidth;
		var YMAX = 0;
		
		// Create a canvas
		var c = document.createElement("canvas");
		c.id = "drawingboard";
		c.width = canvasWidth;
		c.height = canvasHeight;
		c.style.border = "1px solid #ccc";
		
		// Create some divs
		var d;
		d	= document.createElement("div");
		d.id = "ekin";
		document.body.appendChild(d);
		d	= document.createElement("div");
		d.id = "hidtext";
		document.body.appendChild(d);
		
		// Draw a circle
		function drawSphere(id, s, color) {
			var cx = document.getElementById(id).getContext("2d");
			cx.fillStyle = color;
			cx.strokeStyle = color;
			cx.beginPath();
			var rr = transform({x: s.r.x, y: s.r.y});
			var rr2 = transform({x: s.r.x + s.d, y: s.r.y});
			var DD = rr2.x - rr.x;
			cx.arc(rr.x, rr.y, 0.05 * DD, 0, 2 * Math.PI);
			cx.stroke();
		}
		
		// Draw sides of rectangle
		function drawRectangles(id, surfs, color) {
			var cx = document.getElementById(id).getContext("2d");
			cx.strokeStyle = color;
			var N = surfs.length;
			for(var i = 0; i < N; i++) {
				var M = surfs[i].p.length;
				cx.beginPath();
				for(var j = 0; j < M; j++) {
					var s = surfs[i];
					var rr = transform({x: s.p[j].x, y: s.p[j].y});
					if(j == 0) {
						cx.moveTo(rr.x, rr.y);
					} else {
						cx.lineTo(rr.x, rr.y);
					}
				}
				cx.stroke();
			}
		}
		
		// Clear canvas with color
		function clearCanvas() {
			var id = arguments[0];
			var el = document.getElementById(id);
			var color = arguments[1];
			var cx = el.getContext("2d");
			cx.fillStyle = color;
			cx.fillRect(0, 0, c.width, c.height);
		}
		
		// Transform (x, y) to (X, Y)
		function transform(r) {
			var X = (r.x - xmin) / (xmax - xmin) * (XMAX - XMIN);
			X += XMIN;
			var Y = (r.y - ymin) / (ymax - ymin) * (YMAX - YMIN);
			Y += YMIN;
			return {x: X, y: Y};
		}
		
		// Collide particle and a rectangle surface
		// function collide(p, surf) {
		// 	// Declare force variable
		// 	var F = new Vect3();
			
		// 	// Define constants
		// 	var kN = 100;
		// 	var gN = 0.2;
			
		// 	if(arguments[1] instanceof Grid4) {
		// 		// Get colliding objects
		// 		var p = arguments[0];
		// 		var surf = arguments[1];
				
		// 		// Calculate normal vector
		// 		var r10 = Vect3.sub(surf.p[1], surf.p[0]);
		// 		var r21 = Vect3.sub(surf.p[2], surf.p[1]);
		// 		var n = Vect3.cross(r10, r21);
				
		// 		// Calculate distance from surface
		// 		var r = p.r;
		// 		var dr = Vect3.sub(r, surf.p[0]);
		// 		var h = Math.abs(Vect3.dot(dr, n));
				
		// 		// Calculate overlap
		// 		var xi = Math.max(0, 0.5 * p.d - h);
		// 		var xidot = Vect3.dot(p.v, n);
				
		// 		// Calculate force
		// 		var f = (xi > 0) ? kN * xi - gN * xidot : 0;
		// 		F = Vect3.mul(f, n);
		// 	} else {
		// 		// Get colliding objects
		// 		var p0 = arguments[0];
		// 		var p1 = arguments[1];
				
		// 		// Calculate overlap
		// 		var r10 = Vect3.sub(p1.r, p0.r);
		// 		var l10 = r10.len();
		// 		var n = r10.unit();
		// 		var v10 = Vect3.sub(p1.v, p0.v);
		// 		var xi = Math.max(0, 0.5 * (p1.d + p0.d) - l10);
		// 		var xidot = Vect3.dot(v10, n);
				
		// 		// Calculate force
		// 		var f = (xi > 0) ? kN * xi - gN * xidot : 0;
		// 		var m0 = p0.m;
		// 		var m1 = p1.m;
		// 		var mu = (m1 * m0) / (m0 + m1);
		// 		f /= mu;
		// 		F = Vect3.mul(f, n);
		// 	}
			
		// 	// Return force value
		// 	return F;
		// }
		
		var TBEG = new Date().getTime()
		console.log("BEG: " + TBEG);
		var tbeg = 0;
		var tend = 10000;
		var dt = 1;
		var t = tbeg;
		var NT = 100;
		var iT = 0;
		var NT2 = 10;
		var iT2 = 0;
		
		// 20180222.2117
		var div = document.createElement("div");
		div.style.textAlign = "center";
		var b1 = document.createElement("button");
		b1.innerHTML = "Start";
		div.append(c);
		div.appendChild(b1);
		eout.append(div);
		var ekin = document.createElement("div");
		ekin.id = "ekin";
		div.append(ekin);
		
		var iter;
		
		b1.addEventListener("click", function() {
			if(b1.innerHTML == "Start") {
				b1.innerHTML = "Stop";
				sel.disabled = true;
				iter = setInterval(simulate, 5);
			} else {
				b1.innerHTML = "Start";
				clearInterval(iter);
				sel.disabled = false;
			}
		});
				
		function calculate() {
			var M = pars.length;
		
				var p = pars[0];
				p.r.x =  Math.cos(2*Math.PI*t*Math.PI/1800);
				p.r.y =  Math.sin(2*Math.PI*t*Math.PI/1800);
				console.log(p.r);
			
			// Increase time
			t += dt;
			
			// Stop simulation
			if(t > tend) {
				clearInterval(iter);
				var TEND = new Date().getTime();
				console.log("END: " + TEND);
				var TDUR = TEND - TBEG;
				console.log("DUR: " + TDUR);
			}
		}
		
		function simulate() {
			calculate();
			
			iT++;
			iT2++;
			
			if(iT2 >= NT2) {
				// Clear and draw
				clearCanvas("drawingboard", "#fff");
				var M = pars.length;
				for(var j = 0; j < M; j++) {
					drawSphere("drawingboard", pars[j], "#00CED1"); //#00f
				}
				iT2 = 0;
			}
		}
	}
}
//p.r.x = 50*Math.cos(2*Math.PI*t*Math.PI/1800);
//			p.r.y = 50*Math.sin(2*Math.PI*t*Math.PI/1800);
function examDynamicColor() {
	var div = document.getElementById("scriptResult");
	div.innerHTML = "&nbsp;";
	var sel = window.event.target;
	
	var can = document.createElement("canvas");
	can.id = "drawingboard";
	// c.width = canvasWidth;
	// c.height = canvasHeight;
	
	var cx = can.getContext("2d");
	var warna = "#00CED1";
	cx.fillStyle = warna; //"#00CED1"
	cx.strokeStyle = "#0000FF";
	cx.lineWidth = 3;
	cx.beginPath();
	cx.arc(50, 50, 40, 0, 2 * Math.PI);
	cx.fill();
	cx.stroke();
	console.log(cx);

	var tombol = document.createElement("button");
	tombol.id = "tmbl";
	tombol.style.width = "50px";
	tombol.style.float = "left";
	tombol.innerHTML = "Start";
	var iter;
	var k = 0;
	tombol.addEventListener("click", function() {
			if(tombol.innerHTML == "Start") {
				tombol.innerHTML = "Stop";
				sel.disabled = true;
				iter = setInterval(btnClick, 500);
			} else {
				tombol.innerHTML = "Start";
				clearInterval(iter);
				sel.disabled = false;
				var cx = can.getContext("2d");
				cx.id = "bola";
				cx.fillStyle = warna;
				cx.strokeStyle = "#0000FF";
				cx.lineWidth = 3;
				cx.beginPath();
				cx.arc(50, 50, 40, 0, 2 * Math.PI);
				cx.fill();
				cx.stroke();
			}
	});

	div.appendChild(can);
	div.appendChild(tombol);

	function btnClick(){
			k++;
			if(k%2 == 0){
				var cx = can.getContext("2d");
				cx.id = "bola";
				cx.fillStyle = "#f8f8f8";
				cx.strokeStyle = "#7FFF00";
				cx.lineWidth = 3;
				cx.beginPath();
				cx.arc(50, 50, 40, 0, 2 * Math.PI);
				cx.fill();
				cx.stroke();
				console.log(cx.fillStyle);
			} else {
				var cx = can.getContext("2d");
				cx.id = "bola";
				cx.fillStyle = "#FF0000";
				cx.strokeStyle = "#7FFF00";
				cx.lineWidth = 3;
				cx.beginPath();
				cx.arc(50, 50, 40, 0, 2 * Math.PI);
				cx.fill();
				cx.stroke();
				console.log(cx.fillStyle);
			}
	}
}

function examMatrixAdditionMathJax() {
	var eout = document.getElementById("scriptResult");
	eout.innerHTML = "";
	
	var elef = document.createElement("div");
	elef.style.width = "150px";
	elef.style.float = "left";

	var erig = document.createElement("div");
	erig.style.float = "left";
	erig.style.padding = "4px 50px 4px 50px";
	erig.id = "mathjax-matrix"

	var matrix = document.createElement("textarea");
	matrix.style.width = "150px";
	matrix.style.heigth = "150px";
	matrix.style.overflowY = "scroll";
	matrix.style.overflowX = "scroll";
	matrix.value = "1 1 1\n"
	+ "2 4 8\n"
	+ "3 9 27";
	

	var matrix1 = document.createElement("textarea");
	matrix1.style.width = "150px";
	matrix1.style.heigth = "150px";
	matrix1.style.overflowY = "scroll";
	matrix1.style.overflowX = "scroll";
	matrix1.value = "1 1 -1\n"
	+ "2 4 10\n"
	+ "3 9 20"

	var canv = document.createElement("canvas");
	canv.width = "300";
	canv.heigth = "200";
	canv.style.width = "300px";
	canv.style.heigth = "200px";
	canv.id = "drawingArea";
	canv.style.background = "#f8f8f8";
	eout.appendChild(canv);
	//tombol
	var tombol = document.createElement("button");
	tombol.style.width = "100px";
	tombol.innerHTML = "Add matrices";
	tombol.addEventListener("click", btnClick);
	
	function btnClick(){
		var m = matrix.value;
		var m1 = matrix1.value;
		var lines = m.split("\n");
		var lines1 = m1.split("\n");
		var mx = [];
		var mx1 = [];
		var msum = [];
		var q = 0;
 		for(var j= 0; j < lines.length; j++){
			var words = lines[j].split(" ");
			var words1 = lines1[j].split(" ");
			var x = [];
			var x1 = [];
			var sum = [];
			for(var i = 0; i < words.length; i++){
				var Melx = parseInt(words[i]);
				var Melx1 = parseInt(words1[i]);
				console.log(parseInt(words[i]));
				console.log(parseInt(words1[i]));
				var Melsum = parseInt(words[i]) +parseInt(words1[i]);
				x.push(Melx);
				x1.push(Melx1);
				sum.push(Melsum);
			}		
			mx.push(x);
			mx1.push(x1);
			msum.push(sum);
			
		}
		

		console.log(mx);
		console.log(msum);
		var str;
		var ROW = msum.length;

		var latex = "\\begin{equation}\n"
		+ "Pertambahan Matrix = \\left[\n"
		+ "\\begin{array}\n";
		var COL = msum[0].length;

		latex += "{" + "c".repeat(COL) + "}\n";
		for(var j = 0; j < msum.length; j++) {
			var arow = msum[j];
			var COL = arow.length;
			for(var i = 0; i < COL; i++) {
				latex += msum[j][i];
				if(i < COL - 1) {
					latex += " & ";
				} else {
					latex += " \\\\\n";
				}
			}
		}
		latex += "\\end{array}\n"
		+ "\\right]\n"
		+ "\\end{equation}";
	
	updateMath("mathjax-matrix", latex)
	}
	
	 eout.appendChild(elef);
	 	elef.appendChild(matrix);
	 	elef.appendChild(matrix1);
		elef.appendChild(tombol);
	eout.appendChild(erig);
	
}


function examRandomDataChart() {
	var div = document.getElementById("scriptResult");
	div.innerHTML = "&nbsp;";
	var sel = window.event.target;
	
	var ecan = document.createElement("canvas");
	ecan.width = "300";
	ecan.height = "200";
	ecan.style.width = "300px";
	ecan.style.height = "200px";
	ecan.id = "drawingArea"
	ecan.style.background = "#f8f8f8";
		
	div.appendChild(ecan);
	
	
	var tombol = document.createElement("button");
	tombol.id = "tmbl";
	tombol.style.width = "50px";
	tombol.style.float = "left";
	tombol.innerHTML = "Start";
	var iter;
	var k = 0;
	var t = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	tombol.addEventListener("click", function() {
			if(tombol.innerHTML == "Start") {
				tombol.innerHTML = "Stop";
				sel.disabled = true;
				iter = setInterval(btnClick, 500);
			} else {
				tombol.innerHTML = "Start";
				clearInterval(iter);
				sel.disabled = false;
			}
	});

	div.appendChild(ecan);
	div.appendChild(tombol);

	function btnClick(){
		k++;
		
		var x = new Array();
			for(var i = 0; i < 10; i++){
				x[i] = t[i]*t[i];

			}
			var series = new XYSeries("series1", t, x);
			var chart = new Chart2("drawingArea");
			chart.yAxis.Ntics = 4;
			chart.xAxis.Ntics = 8;
			chart.addSeries(series);
			chart.drawSeries("series1");
			for(var i =0; i < 10; i++){
				t[i]++;
			}
		
	}
}

function examMyProject() {
	var eout = document.getElementById("scriptResult");
	eout.innerHTML = "";
	var sel = window.event.target;
	
	// Execute a test function
	test_define_rectangle();

	// 20180213.0751-1512 ok
	function test_define_rectangle() {
		// Define a box coordinates
		
		var s = 1;
		var rA = new Vect3(0, 0, 0);
		var rB = new Vect3(s, 0, 0);
		var rC = new Vect3(s, s, 0);
		var rD = new Vect3(0, s, 0);
		var rE = new Vect3(0, 0, s);
		var rF = new Vect3(s, 0, s);
		var rG = new Vect3(s, s, s);
		var rH = new Vect3(0, s, s);
		
		// Define box sides
		var surf = new Grid4();
		var sides = [];
		surf = new Grid4(rE, rF, rB, rA);
		sides.push(surf);
		surf = new Grid4(rF, rG, rC, rB);
		sides.push(surf);
		surf = new Grid4(rG, rH, rD, rC);
		sides.push(surf);
		surf = new Grid4(rH, rE, rA, rD);
		sides.push(surf);
		surf = new Grid4(rE, rH, rG, rF);
		sides.push(surf);
		
		// Defina spherical particles
		var p = new Sphere();
		var pars = [];
		p = new Sphere();
		p.m = 4;
		p.d = 0.2;
		p.r = new Vect3(0.25, 0.25, 0.25);
		p.v = new Vect3(0.1, 0.05, 0);
		pars.push(p);
		for(var i = 1; i < 1; i+=0.2){
			p = new Sphere();
			p.m = 4;
			p.d = 0.1;
			console.log(x);
			p.r = new Vect3(0.1+i, 0.2+(2*i), 0.25);
			p.v = new Vect3(0.0, 0.05, 0);
			pars.push(p);
		}
		
		// Define world coordinate
		var xmin = -0.1;
		var ymin = -0.1;
		var xmax = 1.1;
		var ymax = 1.1;
		
		// Define canvas size
		var canvasWidth = 150;
		var canvasHeight = 150;
		
		// Define canvas coordinate
		var XMIN = 0;
		var YMIN = canvasHeight;
		var XMAX = canvasWidth;
		var YMAX = 0;
		
		// Create a canvas
		var c = document.createElement("canvas");
		c.id = "drawingboard";
		c.width = canvasWidth;
		c.height = canvasHeight;
		c.style.border = "1px solid #ccc";
		
		// Create some divs
		var d;
		d	= document.createElement("div");
		d.id = "ekin";
		document.body.appendChild(d);
		d	= document.createElement("div");
		d.id = "hidtext";
		document.body.appendChild(d);
		
		// Draw a circle
		function drawSphere(id, s, color) {
			var cx = document.getElementById(id).getContext("2d");
			cx.fillStyle = color;
			cx.strokeStyle = color;
			cx.beginPath();
			var rr = transform({x: s.r.x, y: s.r.y});
			var rr2 = transform({x: s.r.x + s.d, y: s.r.y});
			var DD = rr2.x - rr.x;
			cx.arc(rr.x, rr.y, 0.5 * DD, 0, 2 * Math.PI);
			cx.stroke();
		}
		
		// Draw sides of rectangle
		function drawRectangles(id, surfs, color) {
			var cx = document.getElementById(id).getContext("2d");
			cx.strokeStyle = color;
			var N = surfs.length;
			for(var i = 0; i < N; i++) {
				var M = surfs[i].p.length;
				cx.beginPath();
				for(var j = 0; j < M; j++) {
					var s = surfs[i];
					var rr = transform({x: s.p[j].x, y: s.p[j].y});
					if(j == 0) {
						cx.moveTo(rr.x, rr.y);
					} else {
						cx.lineTo(rr.x, rr.y);
					}
				}
				cx.stroke();
			}
		}
		
		// Clear canvas with color
		function clearCanvas() {
			var id = arguments[0];
			var el = document.getElementById(id);
			var color = arguments[1];
			var cx = el.getContext("2d");
			cx.fillStyle = color;
			cx.fillRect(0, 0, c.width, c.height);
		}
		
		// Transform (x, y) to (X, Y)
		function transform(r) {
			var X = (r.x - xmin) / (xmax - xmin) * (XMAX - XMIN);
			X += XMIN;
			var Y = (r.y - ymin) / (ymax - ymin) * (YMAX - YMIN);
			Y += YMIN;
			return {x: X, y: Y};
		}
		
		// Collide particle and a rectangle surface
		function collide(p, surf) {
			// Declare force variable
			var F = new Vect3();
			
			// Define constants
			var kN = 100;
			var gN = 0.2;
			
			if(arguments[1] instanceof Grid4) {
				// Get colliding objects
				var p = arguments[0];
				var surf = arguments[1];
				
				// Calculate normal vector
				var r10 = Vect3.sub(surf.p[1], surf.p[0]);
				var r21 = Vect3.sub(surf.p[2], surf.p[1]);
				var n = Vect3.cross(r10, r21);
				
				// Calculate distance from surface
				var r = p.r;
				var dr = Vect3.sub(r, surf.p[0]);
				var h = Math.abs(Vect3.dot(dr, n));
				
				// Calculate overlap
				var xi = Math.max(0, 0.5 * p.d - h);
				var xidot = Vect3.dot(p.v, n);
				
				// Calculate force
				var f = (xi > 0) ? kN * xi - gN * xidot : 0;
				F = Vect3.mul(f, n);
			} else {
				// Get colliding objects
				var p0 = arguments[0];
				var p1 = arguments[1];
				
				// Calculate overlap
				var r10 = Vect3.sub(p1.r, p0.r);
				var l10 = r10.len();
				var n = r10.unit();
				var v10 = Vect3.sub(p1.v, p0.v);
				var xi = Math.max(0, 0.5 * (p1.d + p0.d) - l10);
				var xidot = Vect3.dot(v10, n);
				
				// Calculate force
				var f = (xi > 0) ? kN * xi - gN * xidot : 0;
				var m0 = p0.m;
				var m1 = p1.m;
				var mu = (m1 * m0) / (m0 + m1);
				f /= mu;
				F = Vect3.mul(f, n);
			}
			
			// Return force value
			return F;
		}
		
		var TBEG = new Date().getTime()
		console.log("BEG: " + TBEG);
		var tbeg = 0;
		var tend = 1000;
		var dt = 5E-2;
		var t = tbeg;
		var NT = 100;
		var iT = 0;
		var NT2 = 10;
		var iT2 = 0;
		
		// 20180222.2117
		var div = document.createElement("div");
		div.style.textAlign = "center";
		var b1 = document.createElement("button");
		b1.innerHTML = "Start";
		div.append(c);
		div.appendChild(b1);
		eout.append(div);
		var ekin = document.createElement("div");
		ekin.id = "ekin";
		div.append(ekin);
		
		var iter;
		
		b1.addEventListener("click", function() {
			if(b1.innerHTML == "Start") {
				b1.innerHTML = "Stop";
				sel.disabled = true;
				iter = setInterval(simulate, 5);
			} else {
				b1.innerHTML = "Start";
				clearInterval(iter);
				sel.disabled = false;
			}
		});
				
		function calculate() {
			var M = pars.length;
			
			for(var j = 0; j < M; j++) {
				var p = pars[j];
				
				// Calculate force with wall
				var SF = new Vect3();
				var N = sides.length;
				for(var i = 0; i < N; i++) {
					var F = collide(p, sides[i]);
					SF = Vect3.add(SF, F);
				}
				
				// Calculate force with other particles
				for(var i = 0; i < M; i++) {
					if(i != j) {
						var F = collide(pars[i], pars[j]);
						SF = Vect3.add(SF, F);
					}
				}
				
				// Calculate acceleration
				p.a = Vect3.div(SF, p.m);
				
				// Perform Euler numerical integration
				p.v = Vect3.add(p.v, Vect3.mul(p.a, dt));
				p.r = Vect3.add(p.r, Vect3.mul(p.v, dt));
			}
			
			// Increase time
			t += dt;
			
			// Stop simulation
			if(t > tend) {
				clearInterval(iter);
				var TEND = new Date().getTime();
				console.log("END: " + TEND);
				var TDUR = TEND - TBEG;
				console.log("DUR: " + TDUR);
			}
		}
		
		function simulate() {
			calculate();
			
			iT++;
			iT2++;
			
			if(iT2 >= NT2) {
				// Clear and draw
				clearCanvas("drawingboard", "#fff");
				drawRectangles("drawingboard", sides, "#f00");
				var M = pars.length;
				for(var j = 0; j < M; j++) {
					drawSphere("drawingboard", pars[j], "#00CED1"); //#00f
				}
				iT2 = 0;
			}
			if(iT >= NT) {
				// Calculate total kenetic energy
				var K = 0;
				var M = pars.length;
				for(var j = 0; j < M; j++) {
					var v = pars[j].v.len();
					var m = pars[j].m;
					K += (0.5 * m * v * v);
				var sK = K.toExponential(2)
				}
				var aa = sK.split("e")[0];
				var bb = sK.split("e")[1];
				var textEkin = "<i>K</i> = " + aa
					+ " &times; 10<sup>" + bb + "</sup> J";
				ekin.innerHTML = textEkin;
				
				iT = 0;
			}
		}
	}
}

// 20180304.0937 ok
function executeFunctionByValue(value) {
	switch(value) {
		case "Select problems":
			examClear();
			break;
		case "Hello world":
			examHelloWorld();
			break;
		case "Letter configuration":
			examLetterConfiguration();
			break;
		case "Display series":
			examDisplaySeries();
			break;
		case "Root formula":
			examMathJaxRootFormula();
			break;
		case "Draw circle":
			examDrawCircle();
			break;
		case "Color bar":
			examColorBar();
			break;
		case "Button click":
			examButtonClick();
			break;
		case "Progress bar":
			examProgressBar();
			break;
		case "Simple statistics":
			examSimpleStatistics();
			break;
		case "Table":
			examTable();
			break; 					
		case "Textarea and chart xy":
			examTextareaAndChartXY();
			break;
		case "Area of circle":
			examArrayOfCircle();
			break;
		case "Draw circular motion":
			examDrawCircularMotion();
			break;
		case "Dynamic color":
			examDynamicColor();
			break;	
		case "Matrix addition MathJax":
			examMatrixAdditionMathJax();
			break;
		case "Random data chart":
			examRandomDataChart();
			break;
		case "My project":
			examMyProject();
			break;
		default:
	}
}
