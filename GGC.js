var canvas;
var ctx;
var maxX;
var minX;
var maxY;
var minY;

//objects have a "draw" function which draws them
var objects = [];

//initializes Canvas
function init(_id, _maxX, _minX, _maxY, _minY){
	canvas = document.getElementById(_id);
	ctx = canvas.getContext("2d");
	maxX = _maxX;
	minX = _minX;
	maxY = _maxY;
	minY = _minY;
}

//converts world points to graphics points
function gX(_x){
	return (canvas.width / (maxX - minX)) * (_x - minX);
}

function gY(_y){
	return (canvas.height / (maxY - minY)) * (maxY - _y);
}

//clearing and drawing
function clearCanvas(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
}

function drawCanvas(){
	for(var i = 0; i < objects.length; i++){
		if(typeof objects[i].color != "undefined"){
			setStrokeColor(objects[i].color);
			setFillColor(objects[i].color);
		}
		objects[i].draw();
	}
}

//setting colors
function setStrokeColor(_color){
	ctx.strokeStyle = _color;
}

function setFillColor(_color){
	ctx.fillStyle = _color;
}

//objects array manipulation
function addObject(_object){
	objects.push(_object);
}

function removeObject(_object){
	i = object.indexOf(_object);
	objects.splice(i,0);
}

function clearObjects(){
	objects = [];
}

//changing view port
function setViewRectangle(_maxX, _minX, _maxY, _minY){
	maxX = _maxX;
	minX = _minX;
	maxY = _maxY;
	minY = _minY;
	clearCanvas();
	drawCanvas();
}

function setViewCenter(_x, _y){
	width = maxX - minX;
	height = maxY - minY;
	maxX = _x + width/2;
	minX = _x - width/2;
	maxY = _y + height/2;
	minY = _y - height/2;
	clearCanvas();
	drawCanvas();
}

function getViewCenter(){
	return [(maxX + minX)/2, (maxY + minY)/2];
}

//drawing functions
function drawText(_text, _x, _y){
	ctx.fillText(_text, gX(_x), gY(_y));
}

function drawSegment(_x1, _y1, _x2, _y2){
	ctx.beginPath();
	ctx.moveTo(gX(_x1), gY(_y1));
	ctx.lineTo(gX(_x2), gY(_y2));
	ctx.stroke();
}

//draws line through both _x1,_y1 and _x2,_y2
function drawLine(_x1, _y1, _x2, _y2){
	if(_x1 == _x2){
		if(_y1 == _y2){
			return;
		}
		drawSegment(_x1, maxY, _x2, minY);
		return;
	}
	
	m = (_y1 - _y2) / (_x1 - _x2);
	yi = _y1 - (m * _x1);
	drawSegment(minX, (m * minX) + yi, maxX, (m * maxX) + yi);
}

//draws a ray from _x1,_y1 through _x2,_y2
function drawRay(_x1, _y1, _x2, _y2){
	if(_x1 == _x2){
		if(_y1 == _y2){
			return;
		}
		drawSegment(_x1, _y1, _x2, _y1 > _y2 ? minY : maxY);
	}
	
	m = (_y1 - _y2) / (_x1 - _x2);
	yi = _y1 - (m * _x1);
	edgeX = _x1 > _x2 ? minX : maxX;
	drawSegment(_x1, _y1, edgeX, (m * edgeX) + yi);
}

function drawPoint(_x,_y){
	ctx.beginPath();
	ctx.arc(gX(_x), gY(_y), 2, 0, Math.PI*2);
	ctx.fill();
}

//draws function _f with step precision _dx
function drawFunction(_f, _dx = 0.1, _minX = minX, _maxX = maxX){
	ctx.beginPath();
	ctx.moveTo(gX(_minX), gY(_f(_minX)));
	for(x = _minX + _dx; x < _maxX + _dx; x += _dx){
		ctx.lineTo(gX(x), gY(_f(x)));
	}
	ctx.stroke();
}

//draws function f(t) = (_x(t),_y(t)) with step precision _dt
function drawCurve(_x, _y, _minT, _maxT, _dt = 0.1){
	ctx.beginPath();
	ctx.moveTo(gX(_x(_minT)), gY(_y(_minT)));
	for(t = _minT + _dt; t < _maxT + dt; t += _dt){
		ctx.lineTo(gX(_x(t)), gY(_y(t)));
	}
	ctx.stroke();
}

//an "enum" of types of graphical objects, each tied to their drawing functions
objectTypes = {
	TEXT: drawText,
	SEGMENT: drawSegment,
	LINE: drawLine,
	RAY: drawRay,
	POINT: drawPoint,
	FUNCTION: drawFunction,
	CURVE: drawCurve
	
}

//object creation functions
function makeObject(_objectType){
	o = {
		args: Array.from(arguments),
		func: _objectType,
		draw: function(){
			func.apply(null,this.args.slice(1,this.args.length));
			
		},
		color: "black"
	};
	
	addObject(o);
	return o;
}