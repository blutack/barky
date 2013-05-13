var barky_urls = [];

var overlay = $('<div id="overlay"> </div>');
overlay.appendTo(document.body);

$(".overlay > .action").each(
	function(i) {
		var text = $(this).html();
		var href = $(this).attr("href");
		barky_urls.push({href: href, onclick: new Function($(this).attr("onclick")) });
		$(this).html( DrawBarcode( barky_urls.length.toString(), text ) );
	}
);

$(".action").not(".overlay > .action").each(
	function() {
		var text = $(this).html();
		var href = $(this).attr("href");
		// Can't get onclick as a function proto, we'll just eval it...
		barky_urls.push({href: href, onclick: new Function($(this).attr("onclick")) });
		$(this).html( $('<a />', {href: href, class: 'barky-link'}).html(DrawBarcode( barky_urls.length.toString(), text )) );
	}
);

$("#overlay").width()
var increase = Math.PI * 2 / $(".overlay > .action").length;
var x = 0, y = 0, angle = 0;

$(".overlay > .action").each(
	function(){
		var width = 112;
		var height = 54;
		var elem = $(this).get()[0];
		x = ((150 + width) * Math.cos(angle)) + ($("#overlay").width()/2 - width);
		y = ((150 + height) * Math.sin(angle)) + ($("#overlay").height()/2 - height);
		elem.style.position = 'absolute';
		elem.style.left = x + 'px';
		elem.style.top = y + 'px';
		angle += increase;
	}
);

$(document).keypress(function(event) {
	if((48 <= event.which <= 57) && String.fromCharCode(event.which) < barky_urls.length) {
		if (typeof barky_urls[String.fromCharCode(event.which)].onclick == "function") {
		    barky_urls[String.fromCharCode(event.which)].onclick();
		}
		window.location = barky_urls[String.fromCharCode(event.which)].href;
	}
});

function DrawBarcode(url, text, options) {
	var defaults = {
		width:	2,
		height:	50,
		quite: 10,
		format:	"CODE128"
	};
	
	var options = $.extend({}, defaults, options);

	//Create the canvas where the barcode will be drawn on
	var canvas = document.createElement('canvas');
	
	//Abort if the browser does not support HTML5canvas
	if (!canvas.getContext) {
		return this;
	}
	
	var encoder = new window[options.format](url);
	
	//Abort if the barcode format does not support the content
	if(!encoder.valid()){
		return this;
	}
	
	//Encode the content
	var binary = encoder.encoded();
	
	//Get the canvas context
	var ctx    = canvas.getContext("2d");
	
	//Set the width and height of the barcode
	canvas.width = binary.length*options.width+2*options.quite;
	canvas.height = options.height;
	
	//Paint the canvas white
	ctx.fillStyle = "#fff";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	
	//Creates the barcode out of the encoded binary
	for(var i=0;i<binary.length;i++){
	
		var x = i*options.width+options.quite;
		
		if(binary[i] == "1"){
			ctx.fillStyle = "#000";
		}
		else{
			ctx.fillStyle = "#fff";
		}
		
		ctx.fillRect(x,0,options.width,options.height);
	}
	var textopts = {
		padding: 2,
		height: canvas.height/3
	}
	ctx.font = "bold " + (textopts.height - textopts.padding) + "px Arial";
	ctx.textAlign = "right";
	ctx.textBaseline = "bottom";
	ctx.fillStyle = "#fff";
	ctx.fillRect(canvas.width - ctx.measureText(text)['width'] - 2, canvas.height - textopts.height, canvas.height,canvas.width, canvas.height);
	
	ctx.fillStyle = "#000";
	ctx.fillText(text, canvas.width,canvas.height)
	
	//Grab the dataUri from the canvas
	uri = canvas.toDataURL('image/png');
	var barcode = $("<img />", { "src": uri, "class": "barky", "alt": text });
	//Put the data uri into the image
	return barcode
}

function CODE128(string){

	this.string128 = string;

	this.valid = valid;

	//The public encoding function
	this.encoded = function(){
		if(valid(string)){
			return calculateCode128(string);
		}
		else{
			return "";
		}
	}

	//Data for each character, the last characters will not be encoded but are used for error correction
	var code128b = [
	[" ","11011001100",0],
	["!","11001101100",1],
	["\"","11001100110",2],
	["#","10010011000",3],
	["$","10010001100",4],
	["%","10001001100",5],
	["&","10011001000",6],
	["'","10011000100",7],
	["(","10001100100",8],
	[")","11001001000",9],
	["*","11001000100",10],
	["+","11000100100",11],
	[",","10110011100",12],
	["-","10011011100",13],
	[".","10011001110",14],
	["/","10111001100",15],
	["0","10011101100",16],
	["1","10011100110",17],
	["2","11001110010",18],
	["3","11001011100",19],
	["4","11001001110",20],
	["5","11011100100",21],
	["6","11001110100",22],
	["7","11101101110",23],
	["8","11101001100",24],
	["9","11100101100",25],
	[":","11100100110",26],
	[";","11101100100",27],
	["<","11100110100",28],
	["=","11100110010",29],
	[">","11011011000",30],
	["?","11011000110",31],
	["@","11000110110",32],
	["A","10100011000",33],
	["B","10001011000",34],
	["C","10001000110",35],
	["D","10110001000",36],
	["E","10001101000",37],
	["F","10001100010",38],
	["G","11010001000",39],
	["H","11000101000",40],
	["I","11000100010",41],
	["J","10110111000",42],
	["K","10110001110",43],
	["L","10001101110",44],
	["M","10111011000",45],
	["N","10111000110",46],
	["O","10001110110",47],
	["P","11101110110",48],
	["Q","11010001110",49],
	["R","11000101110",50],
	["S","11011101000",51],
	["T","11011100010",52],
	["U","11011101110",53],
	["V","11101011000",54],
	["W","11101000110",55],
	["X","11100010110",56],
	["Y","11101101000",57],
	["Z","11101100010",58],
	["[","11100011010",59],
	["\\","11101111010",60],
	["]","11001000010",61],
	["^","11110001010",62],
	["_","10100110000",63],
	["`","10100001100",64],
	["a","10010110000",65],
	["b","10010000110",66],
	["c","10000101100",67],
	["d","10000100110",68],
	["e","10110010000",69],
	["f","10110000100",70],
	["g","10011010000",71],
	["h","10011000010",72],
	["i","10000110100",73],
	["j","10000110010",74],
	["k","11000010010",75],
	["l","11001010000",76],
	["m","11110111010",77],
	["n","11000010100",78],
	["o","10001111010",79],
	["p","10100111100",80],
	["q","10010111100",81],
	["r","10010011110",82],
	["s","10111100100",83],
	["t","10011110100",84],
	["u","10011110010",85],
	["v","11110100100",86],
	["w","11110010100",87],
	["x","11110010010",88],
	["y","11011011110",89],
	["z","11011110110",90],
	["{","11110110110",91],
	["|","10101111000",92],
	["}","10100011110",93],
	["~","10001011110",94],
	["DEL","10111101000",95],
	["FNC3","10111100010",96],
	["FNC2","11110101000",97],
	["SHIFT","11110100010",98],
	["Code C","10111011110",99],
	["FNC4","10111101110",100],
	["Code A","11101011110",101],
	["FNC1","11110101110",102],
	["START A","11010000100",103],
	["START B","11010010000",104],
	["START C","11010011100",105]];


	//The start bits
	var startBin = "11010010000";
	//The end bits
	var endBin = "1100011101011";

	//This regexp is used for validation
	var regexp = /^[!-~ ]+$/;

	//Use the regexp variable for validation
	function valid(){
		if(string.search(regexp)==-1){
			return false;
		}
		return true;
	}

	//The encoder function that return a complete binary string. Data need to be validated before sent to this function
	function calculateCode128(string){
		var result = "";
		
		//Add the start bits
		result += startBin;
		
		//Add the encoded bits
		result += encode(string);
		
		//Add the checksum
		result += encodingById(checksum(string));
			
		//Add the end bits
		result += endBin;
		
		return result;
	}

	//Encode the characters
	function encode(string){
		var result = "";
		for(var i=0;i<string.length;i++){
			result+=encodingByChar(string[i]);
		}
		return result;
	}


	//Calculate the checksum
	function checksum(string){
		var sum = 0;
		for(var i=0;i<string.length;i++){
			sum += weightByCharacter(string[i])*(i+1);
		}
		return (sum+104) % 103;
	}

	//Get the encoded data by the id of the character
	function encodingById(id){
		for(var i=0;i<code128b.length;i++){
			if(code128b[i][2]==id){
				return code128b[i][1];
			}
		}
		return "";
	}

	//Get the id (weight) of a character
	function weightByCharacter(character){
		for(var i=0;i<code128b.length;i++){
			if(code128b[i][0]==character){
				return code128b[i][2];
			}
		}
		return 0;
	}

	//Get the encoded data of a character
	function encodingByChar(character){
		for(var i=0;i<code128b.length;i++){
			if(code128b[i][0]==character){
				return code128b[i][1];
			}
		}
		return "";
	}
}