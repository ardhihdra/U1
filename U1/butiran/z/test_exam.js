/*
	test_exam.js
	Test the use of exam.js and related function
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180303
	Start this test functions.
	20180404
	Modify adding options to select.
*/

// 20180305.1949 ok
function test_exam() {
	// Create select element
	var esel = document.createElement("select");
	esel.addEventListener("change", selectProblem)
	esel.style.fontFamily = "Arial";
	esel.style.fontSize = "13px";
	var menu = [
		["Select problem", examClear],
		["Hello world", examHelloWorld],
		["Letter configuration", examLetterConfiguration],
		["Display series", examDisplaySeries],
		["Root formula", examMathJaxRootFormula],
		["Draw circle", examDrawCircle],
		["Color bar", examColorBar],
		["Button click", examButtonClick],
		["Progress bar", examProgressBar],
		["Simple statistics", examSimpleStatistics],
		["Table", examTable],
		["Textarea matrix", examTextareaMatrix],
		["Chart xy", examChartXY],
		["Toggle button", examToggleButton],
		["Random lines", examRandomLines],
		["Three grains", examThreeGrains],
		["Textarea and chart xy", examTextareaAndChartXY],
		["Area of circle", examArrayOfCircle],
		["Draw circular motion", examDrawCircularMotion],
		["Dynamic color", examDynamicColor],
		["Matrix addition MathJax", examMatrixAdditionMathJax],
		["Random data chart", examRandomDataChart],
		["My project", examMyProject],
		["Free Mode" , ],
	];
	
	// Add menu using option element
	var N = menu.length;
	for(var i = 0; i < N; i++) {
		var opt = document.createElement("option");
		opt.text = menu[i][0];
		esel.options.add(opt);
	}
	
	// Create information
	var etxt = document.createElement("div");
	etxt.innerHTML = "Open browser console with Ctrl + Shift + J (in Google Chrome)"
	etxt.style.color = "#f8f8f8";
	etxt.style.float = "right";
	etxt.style.fontSize = "13px";
	etxt.style.fontFamily = "Arial";
	
	// Create div element for top part
	var etop = document.createElement("div");
	//etop.style.border = "1px solid #888";
	etop.style.background = "#bbb";
	etop.style.height = "20px";
	etop.style.padding = "6px";
	
	// Create div element for displaying output
	var eout = document.createElement("div");
	var welkom = document.createElement("div");
	var des = document.createElement("p");
	eout.id = "scriptResult";
	welkom.innerHTML = "Assalamualaikum Worlds!";
	des.innerHTML = "Silahkan pilih fitur-fitur di bagian kiri atas";
	eout.style.border = "10px solid #bbb";
	eout.style.background = "#f8f8f8";
	eout.style.padding = "10px";
	eout.style.fontFamily = "Verdana";
	eout.style.fontSize = "12px";
	eout.style.height = "300px";
	welkom.style.background = "#f8f8f8";
	welkom.style.padding = "15px";
	des.style.fontSize = "12px";
	welkom.style.fontFamily = "Verdana";
	welkom.style.fontSize = "36px";
	welkom.style.height = "100px";
	// Set document layout
	document.body.appendChild(etop);
		etop.appendChild(esel);
		etop.appendChild(etxt);
	document.body.appendChild(eout);
		eout.appendChild(welkom);
			welkom.appendChild(des);
	
	// Execute script related to selected problem
	function selectProblem() {
		executeScript(window.event.target, menu)
	}
}
