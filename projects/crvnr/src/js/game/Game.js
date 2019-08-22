var Player = require("./Player"),
    GameMap = require("./Map.js");

var KEY_EVENTS = {
    ARROW_DOWN:40, 
    ARROW_UP:38,
    ARROW_LEFT:37,
    ARROW_RIGHT:39,
    WASD_DOWN: 83,
    WASD_UP: 87,
    WASD_LEFT: 65,
    WASD_RIGHT: 68,
}

function Game(canvas) {
    function onTick() {
        var new_view = player.move();
        map.setView(new_view.x, new_view.y);
        map.updateMapCanvas();
    }
    var gameTimer = null,
        fps = 5;
    
    function startGameTimer() {
        gameTimer = setInterval(onTick, fps)
    }
    
    function stopGameTimer() {
        if (gameTimer) clearInterval(gameTimer);
    }
    function onKeyEvent(e) {
        var key = e.keyCode;

        switch(key) {
            case KEY_EVENTS.ARROW_DOWN || KEY_EVENTS.WASD_DOWN:
                player.setDirection("s");
                break;
            case KEY_EVENTS.ARROW_UP || KEY_EVENTS.WASD_UP:
                player.setDirection("n");
                break;
            case KEY_EVENTS.ARROW_LEFT || KEY_EVENTS.WASD_LEFT:
                player.setDirection("w");
                break;
            case KEY_EVENTS.ARROW_RIGHT || KEY_EVENTS>WASD_RIGHT:
                player.setDirection("e");
                break;
        }
    }
    var player = null,
        map = null;
    
    function init() {
        player = new Player();
        map = new GameMap(canvas);
        console.log("Game canvas:", canvas);
        var playerPosition = player.getPosition();
        map.setView(playerPosition.x, playerPosition.y);

    }

    function start() {
        startGameTimer();
        document.addEventListener("keydown", onKeyEvent);
    }
    return {init, start}

}

window.Game = Game;