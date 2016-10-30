var borderPointColor = "#1abc9c"
var borderBorderColor = "#16a085"

var cityPointColor = "#e67e22"
var cityBorderColor = "#d35400"

var lineColor = "#8e44ad"

var circleRad = 1


var svgMap = document.getElementById('svgMap')
svgMap.onload = function(){
	run(5,3)
}



function run(maxNeighbors, maxBorderPointNeighbors){

	if(maxNeighbors === undefined)
		maxNeighbors = 5
	if(maxBorderPointNeighbors === undefined)
		maxBorderPointNeighbors = 3


	console.log(maxNeighbors, maxBorderPointNeighbors)

	var canvas = document.getElementById('two-canvas')

	canvas.innerHTML = ""

	two = new Two({width: window.innerWidth, height: window.innerHeight}).appendTo(canvas)

	var mySvg = svgMap.contentDocument.getElementsByTagName('svg')[0]

	var map = two.interpret(mySvg)

	two.scene.scale = 3.5
	two.update()

	svgMap.style.display = "none"
    

	var lineGroup = new Two.Group()

	two.add(lineGroup)

	handleData(map)



	function drawLine(startObj, endObj){
		var line =  new Two.Line(startObj.x, startObj.y, endObj.x, endObj.y)
		line.opacity = 0.5
		line.stroke = lineColor

		line.classList.push("connectingLine")

		return line
	}

	function squaredDistance(startObj, endObj){
		return Math.pow(startObj.x - endObj.x, 2) + Math.pow(startObj.y - endObj.y, 2)
	}

	function handleData(map){

		var capitalArr = []
		var pathArr = []

		var spacing = 10

		var pathVertices = map.children[0].children[0].vertices

		pathArr = pathVertices.filter(function(e, i){
			return i % spacing == 0
		}).map(function(e, i){
			var circle = two.makeCircle(e.x, e.y, circleRad);
			
			circle.fill = borderPointColor;
			circle.stroke = borderBorderColor;

			return {x: e.x, y: e.y, i: i, type: "border", connections: 0}
		})

		capitalArr = map.children[0].children[1].children.map(function(e, i){

			var circle = two.makeCircle(e.translation.x, e.translation.y, circleRad);

			circle.fill = cityPointColor;
			circle.stroke = cityBorderColor;


			return {x:e.translation.x, y:e.translation.y, i: i, type: "capital", connections: 0}
		})

		/*
			initially we'll just draw lines to the five closest entities, but we'll refine stuff later so that each city only has 5 lines coming out of it
		*/

		jointArr = pathArr.concat(capitalArr)

		capitalArr.forEach(function(homeCapital, i){

			
			var borders = 0

			jointArr.sort(function(a, b){
				return squaredDistance(homeCapital, a) - squaredDistance(homeCapital, b)
			}).filter(function(e){
				if(e.type == "border" && borders >= maxBorderPointNeighbors)
					return false
				else if(e.type == "border")
					borders++
				else if(e == homeCapital)
					return false
				else if(e.type == "capital" && e.connections >= maxNeighbors)
					return false

				return true
			}).slice(0,maxNeighbors).forEach(function(e){
				var line = drawLine(e, homeCapital)

				e.connections++
				homeCapital.connections++

				lineGroup.add(line)
			})


			
		})


		two.update()

	}
}
