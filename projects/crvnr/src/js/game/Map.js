var mapData = require("./data/Map.json");
function GameMap(canvas) {

    var map_points = mapData.points;

    var view_sight = {
        x: canvas.width,
        y: canvas.height
    }
    
    var current_view = {
        x: 200,
        y: 200
    };
    
    var PSUEDO_CANVAS = createPseudoCanvas()
    
    
    function createPseudoCanvas() {
        var pcanvas = document.createElement("canvas");
        pcanvas.className = "pseudo-canvas";
        pcanvas.width = canvas.width;
        pcanvas.height = canvas.height;
        return pcanvas;
    }
    function clearCanvas(oldcanvas) {
        oldcanvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    }
    function setView(x, y) {
        current_view = {x, y}
    }
    function getEntitiesInView() {
        var entities = [],
            x = current_view.x,
            y = current_view.y;
        var view = {
            x: {
                min: Math.max(x - view_sight.x, 0),
                max: Math.min(x  + view_sight.y, mapData.size.width)
            },
            y: {
                min: Math.max(y - view_sight.y, 0),
                max: Math.min(y + view_sight.y, mapData.size.height)
            }
        }
        map_points.forEach(function(point) {
            if (point.position.x > view.x.min && point.position.x < view.x.max && point.position.y > view.y.min && point.position.y < view.y.max) entities.push(point)
        })
        return entities;
    }
    function drawCircle(x,y,diameter, label) {
        var context = PSUEDO_CANVAS.getContext("2d");
        context.beginPath();
        context.arc(x, y, diameter / 2, 0,  2 * Math.PI);
        context.stroke();
        if (label) {
            context.font = "20px Calibri";
            context.fillText(label, x + diameter + 5, y + diameter / 4);
        }
    }
    function updateMapCanvas() {
        clearCanvas(PSUEDO_CANVAS);
        var entities = getEntitiesInView();
        entities.forEach((entity) => {
            drawCircle((current_view.x + view_sight.x / 2) - entity.position.x, entity.position.y, entity.size.width, entity.name);
        })
        canvas.getContext("2d").drawImage(
            PSUEDO_CANVAS,
            0,
            0,
            canvas.width,
            canvas.height
        );
    }

    return {updateMapCanvas, setView}
}
module.exports = GameMap;
exports = module.exports