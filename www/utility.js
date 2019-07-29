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

function registerParticle(particle) {
    gamestateLocal.gameobjects.particles.push(particle);
}

// /**
//  * @param {number} spreadRadius radius of sphere around x, y in which the Particle should be placed
//  * @param {number} speedSpreadPercX percentage of speedRandomization; 0.0 => no randmization; 0.5 => speedX in range of speedX*0.5 to speedX*1.5
//  * @param {number} speedSpreadPercY percentage of speedRandomization; 0.0 => no randmization; 0.5 => speedY in range of speedY*0.5 to speedY*1.5
//  * @param {string} color color of this particle as in '#1818FF'
//  */
// function generateParticle(x, y, spreadRadius, speedX, speedY, speedDirectionSpreadRangeHalfRadians, color, darklingRatePerSecond) {
    
    
//     gamestateLocal.gameobjects.particles.push({
//             posX: x + (Math.random()*spreadRadius*2) - spreadRadius,
//             posY: y + (Math.random()*spreadRadius*2) - spreadRadius,
//             speedX: Math.sin(newSpeedDirection)*speed,
//             speedY: Math.cos(newSpeedDirection)*speed,
//             alpha: 1,
//             color: color,
//             visible: true,
//             test: "woop",
//             updatePosition: (deltaTimeSeconds) => {
//                 console.log("visible " + this);
//                 if(!this.visible)
//                     return;
//                 this.posX += this.speedX*deltaTimeSeconds;
//                 this.posY += this.speedY*deltaTimeSeconds;
//                 this.alpha -= darklingRatePerSecond*deltaTimeSeconds;
//                 if(this.alpha <= 0)
//                     this.visible = false;
//                 // console.log(this.alpha);
//             }
//     });
// }