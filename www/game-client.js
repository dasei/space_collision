var canvas_scale_up = 1;

function updateCanvasSize() {
    if(gamestate.gameWidth != 0 && gamestate.gameHeight != 0) {
        canvas_scale_up = Math.max(1, Math.floor(window.innerHeight / gamestate.gameHeight));
        
        document.getElementById('canvas-game').width = gamestate.gameWidth * canvas_scale_up;
        document.getElementById('canvas-game').height = gamestate.gameHeight * canvas_scale_up;
        $('#canvas-game').width(gamestate.gameWidth * canvas_scale_up);
        $('#canvas-game').height(gamestate.gameHeight * canvas_scale_up);
    }
    setTimeout(updateCanvasSize, 500);
}

//   #######   GAMESTATE   ######
var gamestate = {
    gameWidth: 100,
    gameHeight: 150,
    gameobjects: {
        players: [],
        projectiles: []
    }
};

updateCanvasSize();

var playerID;
var socket = io();

// socket.on('gamesize', (gameWidthNew, gameHeightNew) => {
//     gameWidth = gameWidthNew;
//     gameHeight = gameHeightNew;
// });

socket.on('player registered', (playerIDNew) => {
    playerID = playerIDNew;
    console.log("received playerID: '" + playerID + "'");
    socket.emit('my playerID is', playerID);
    // setTimeout(() => {
    //     console.log(gamestate);
    //     console.log(gamestate.gameobjects.players);
    //     console.log(gamestate.gameobjects.players.length);
    // }, 3000);
});

socket.on('pls send your gamestate', (amountOfPlayersToRegister, nthSynchronization, playersToRemoveFromGame) => {
    var newPlayerIDs = [];
    var newPlayer;
    for(var i = 0; i < amountOfPlayersToRegister; i++) {
        newPlayer = new Player(0, 0, generateRandomPlayerID());
        newPlayerIDs[i] = newPlayer.id;
        gamestate.gameobjects.players.push(newPlayer);
        // console.log("pushing: ");
        // console.log(newPlayer.id)
        // console.log(gamestate.gameobjects.players);
        // console.log(gamestate.gameobjects.players.length);
    }

    //remove (disconnected) players
    for(var i = 0; i < playersToRemoveFromGame.length; i++) {
        if(getPlayerWithID(playersToRemoveFromGame[i]) == null)
            continue;
        let playerIndex = gamestate.gameobjects.players.indexOf(gamestate.gameobjects.players[playerID]);
        gamestate.gameobjects.players.splice(playerIndex, 1);
        console.log("players after: " + gamestate.gameobjects.players);
    }
    socket.emit('this is my master gamestate', gamestate, newPlayerIDs, nthSynchronization);
})

socket.on('master gamestate override', (gamestateMaster) => {
    gamestate = castAllObjects(gamestateMaster);
});

socket.on('key event', (playerIDInvoker, keyCode, keyDown) => {
    getPlayerWithID(playerIDInvoker).keyRegister[keyCode] = keyDown;
});


//##########GAME LOOP
var deltaTimeSeconds = 0;
var deltaTimeLoopCycleFinishedLast = undefined;
setTimeout(gameLoop);
function gameLoop() {

    if(getPlayer() != null)
        console.log(getPlayer().keyRegister[87]);

    //look into keyregisters of all players and process their movements
    for(var playerD of gamestate.gameobjects.players) {
        // console.log(player.keyRegister[87]);
        playerD.processInputs(deltaTimeSeconds);
    }

    //update position of all game objects
    for(var gameobjectArrayKey in gamestate.gameobjects) {
        if(!gamestate.gameobjects.hasOwnProperty(gameobjectArrayKey))
            continue;        
        gamestate.gameobjects[gameobjectArrayKey].forEach(element => {
            element.updatePosition(deltaTimeSeconds);
        });
    };

    drawFrame();
    // console.log(gamestate);

    onGameLoopFinish();
}
function onGameLoopFinish() {
    //delta time calculation
    var timeNow = new Date().getTime();
    if(deltaTimeLoopCycleFinishedLast != undefined)
        deltaTimeSeconds = (timeNow - deltaTimeLoopCycleFinishedLast) / 1000;
    deltaTimeLoopCycleFinishedLast = timeNow;
    //restart loop
    window.requestAnimationFrame(gameLoop);
    // setTimeout(gameLoop, 50);
    // setTimeout(gameLoop);
}