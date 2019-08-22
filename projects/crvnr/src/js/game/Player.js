
function Player() {
    var position = {
        x: 200,
        y: 200
    }
    var stats = {
        speed: 3,
    },
    direction = {
        x: 1,
        y: 1
    }
    
    function move() {
        position.x = position.x + direction.x * stats.speed;
        position.y = position.y + direction.y * stats.speed;
        return position;
    }
    
    function setDirection(dir) {
        var dir = {
            x: 0,
            y:0
        }
        if (dir.indexOf("n") > -1) dir.y -=1;
        if (dir.indexOf("s") > -1) dir.y -= 1;
    
        if (dir.indexOf("w") > -1) dir.x -=1;
        if (dir.indexOf("e") > -1) dir.x += 1;
    
        direction = dir;
        return direction;
    }
    
    function getPosition() {
        return position;
    }
    return {getPosition, setDirection, move}
}
module.exports = Player;