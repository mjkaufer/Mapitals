var svgMap = document.getElementById('svgMap')
var map = null

var borderPointColor = "#1abc9c"
var borderBorderColor = "#16a085"

var cityPointColor = "#e67e22"
var cityBorderColor = "#d35400"

var circleRad = 1

svgMap.onload = function(){
	var canvas = document.getElementById('two-canvas')
    two = new Two({width: window.innerWidth, height: window.innerHeight}).appendTo(canvas)

    var mySvg = svgMap.contentDocument.getElementsByTagName('svg')[0]

    map = two.interpret(mySvg)

    two.scene.scale = 3.5
    two.update()


    svgMap.parentElement.removeChild(svgMap)

    
    handleData(map)

    
};

function handleData(map){

	var capitalArr = []
	var pathArr = []

	var spacing = 16

	var pathVertices = map.children[0].children[0].vertices

	pathArr = pathVertices.filter(function(e, i){
		return i % spacing == 0
	}).map(function(e){
		var circle = two.makeCircle(e.x, e.y, circleRad);
		
		circle.fill = borderPointColor;
		circle.stroke = borderBorderColor;

		return {x: e.x, y: e.y}
	})

	capitalArr = map.children[0].children[1].children.map(function(e){

		var circle = two.makeCircle(e.translation.x, e.translation.y, circleRad);

		circle.fill = cityPointColor;
		circle.stroke = cityBorderColor;


		return {x:e.translation.x, y:e.translation.y}
	})

	two.update()


	// var states = map.children[0].children[0]
	// var capitals = map.children[0].children[1]

	// for(var i = 0; i < states.length; i++){
	// 	// states.children[i].fill = 
	// }
}