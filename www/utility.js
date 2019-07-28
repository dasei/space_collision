function generateRandomPlayerID() {
    var playerID;
    var colliding = true;
    while(colliding) {
        playerID = parseInt(Math.random()*1000000000).toString();
        //check if playerID is already taken
        colliding = false;
        for(var player of gamestate.gameobjects.players) {
            if(playerID == player.id){
                colliding = true;
                break;
            }
        }
    };
    return playerID;
}

function getPlayerWithID(id) {
    // console.log(gamestate);
    for(var player of gamestate.gameobjects.players) {
        // console.log("ujp: " + player);
        if(player.id == id)
            return player;
    }
    return null;
}

function getPlayer() {
    return getPlayerWithID(playerID);
}

function castAllObjects(gamestate) {
    for(var player of gamestate.gameobjects.players) {
        player.__proto__ = Player.prototype;
    }
    for(var projectile of gamestate.gameobjects.projectiles) {
        projectile.__proto__ = Projectile.prototype;
    }
    return gamestate;
}