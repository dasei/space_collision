var crypto = require("crypto");

module.exports = {
    startGameServer: () => {
        setTimeout(gameLoopServerCycle);
    },
    getGamestate: () => {
        return gamestate;
    },
    getPlayerWithID: (playerID) => {
        for(var player of gamestate.gameobjects.players) {
            if(player.id == playerID)
                return player;
        }
        return null;
    },
    registerPlayer: () => {
        var playerID;
        do {
            playerID = crypto.randomBytes(20).toString('hex');
        } while(module.exports.getPlayerWithID(playerID) != null);
        gamestate.gameobjects.players.push(new Player(0, 0, playerID));
        return playerID;
    }
}

//  ##GAME STRUCTURE##


// ####GAMESTATE####
var gamestate = {
    gameWidth: 100,
    gameHeight: 150,
    gameobjects: {
        players: [],
        projectiles: []
    }
};

//##########GAME LOOP
var deltaTimeSeconds = 0;
var deltaTimeLoopCycleFinishedLast = undefined;
function gameLoopServerCycle() {

    //look into keyregisters of all players and process their movements
    for(var player of gamestate.gameobjects.players) {
        player.processInputs(deltaTimeSeconds);
    }

    //update position of all game objects
    for(var gameobjectArrayKey in gamestate.gameobjects) {
        if(!gamestate.gameobjects.hasOwnProperty(gameobjectArrayKey))
            continue;        
        gamestate.gameobjects[gameobjectArrayKey].forEach(element => {
            element.updatePosition(deltaTimeSeconds);
        });
    };

    onGameLoopServerFinish();
}
function onGameLoopServerFinish() {
    console.log(deltaTimeSeconds);
    //delta time calculation
    var timeNow = new Date().getTime();
    if(deltaTimeLoopCycleFinishedLast != undefined)
        deltaTimeSeconds = (timeNow - deltaTimeLoopCycleFinishedLast) / 1000;
    deltaTimeLoopCycleFinishedLast = timeNow;
    //restart loop
    setTimeout(gameLoopServerCycle);
}