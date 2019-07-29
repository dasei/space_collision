var canvas;
var ctx = null;
function drawFrame() {
    // console.log("drawing frame");
    if(ctx == null) {
        canvas = document.getElementById('canvas-game');
        ctx = canvas.getContext('2d');
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);    
    ctx.scale(canvas_scale_up, canvas_scale_up);
    //#############
    
    ctx.beginPath();
    ctx.lineWidth = 1/canvas_scale_up;
    ctx.strokeStyle = "#FFFFFF";
    //player
    // console.log("players: " + gamestate.gameobjects.players.length);
    for(var playerObj of gamestate.gameobjects.players) {
        console.log(ctx.strokeStyle);
        drawPlayer(ctx, playerObj);
    }
    ctx.stroke();
    ctx.beginPath();
    //projectiles    
    let rotation;
    for(var projectile of gamestate.gameobjects.projectiles) {
        ctx.translate(projectile.posX, projectile.posY);
        ctx.strokeStyle = PROJECTILE_DATA[projectile.projectileType].color;
        switch(projectile.projectileType) {            
            case 'laser':
                rotation = Math.atan2(projectile.speedY, projectile.speedX) + (Math.PI/2);
                ctx.rotate(rotation);
                ctx.moveTo(0, 1);
                ctx.lineTo(0, -1);
                ctx.rotate(-rotation);
                break;
        }
        ctx.translate(-projectile.posX, -projectile.posY);
    }
    ctx.stroke();

    //draw particles
    drawParticles(ctx);
    
    //TODO pro und retrograde richtung am Bidlschirmrand anzeigen
    drawNavBall(ctx);
    drawControlEdgeNodes(ctx);
    ctx.stroke();
    //#############
    ctx.scale(1/canvas_scale_up, 1/canvas_scale_up);
}

function drawPlayer(ctx, player) {
    // console.log(player);
    ctx.translate(player.posX, player.posY);
    ctx.rotate(-player.orientation);
    
    ctx.moveTo(0, 4);
    ctx.lineTo(2, -2);
    ctx.lineTo(-2, -2);
    ctx.closePath();
    // ctx.stroke();

    ctx.rotate(player.orientation);
    ctx.translate(-player.posX, -player.posY);
}

const navBallRadius = 15;
function drawNavBall(ctx) {
    let gameWidth = gamestate.gameWidth;
    let gameHeight = gamestate.gameHeight;
    
    ctx.fillStyle = "#FFFFFF";
    //inner point
    ctx.beginPath();
    ctx.arc(gameWidth/2, gameHeight-navBallRadius, 1, 0, 2*Math.PI);
    ctx.fill();

    //outline
    ctx.beginPath();
    ctx.arc(gameWidth/2, gameHeight-navBallRadius, navBallRadius, 0, 2*Math.PI);
    // ctx.stroke();


    ctx.strokeStyle = "#FFFFFF";
    //scale
    ctx.translate(gameWidth/2, gameHeight-navBallRadius);
    //bottom
    ctx.moveTo(0, navBallRadius-1);
    ctx.lineTo(0, navBallRadius+1);    
    //right
    ctx.moveTo(navBallRadius-1, 0);
    ctx.lineTo(navBallRadius+1, 0);    
    //top
    ctx.moveTo(0, -navBallRadius-1, 0);
    ctx.lineTo(0, -navBallRadius+1, 0);    
    //left
    ctx.moveTo(-navBallRadius-1, 0);
    ctx.lineTo(-navBallRadius+1, 0);

    // ctx.stroke();
    ctx.translate(-gameWidth/2, -(gameHeight-navBallRadius));
}

function drawControlEdgeNodes(ctx) {        
    if(getPlayer() == undefined) {
        // console.log("skipping");
        return;
    }
    let player = getPlayer();

    let gameWidth = gamestate.gameWidth;
    let gameHeight = gamestate.gameHeight;

    ctx.strokeStyle = "#FFFFFF";
    ctx.translate(gameWidth/2, gameHeight-navBallRadius);
    
    //prograde
    let playerProgradeDegree = Math.atan2(player.speedX, player.speedY);
    ctx.rotate(-playerProgradeDegree);   
        ctx.moveTo(-1, navBallRadius-2);
        ctx.lineTo(0, navBallRadius-1);
        ctx.lineTo(1, navBallRadius-2);
        ctx.stroke();
        
    //retrograde
    ctx.rotate(-Math.PI);
        ctx.moveTo(-1, navBallRadius-1);
        ctx.lineTo(0, navBallRadius-2);
        ctx.lineTo(1, navBallRadius-1);
        ctx.stroke();
    ctx.rotate(playerProgradeDegree + Math.PI);

    //orientation (forward)
    ctx.rotate(-player.orientation);    
        ctx.moveTo(0, 0);
        ctx.lineTo(0, navBallRadius*0.75);
        ctx.stroke();
    
    //orientation (backward)
    ctx.rotate(Math.PI);
        ctx.moveTo(0, 0);
        ctx.lineTo(0, navBallRadius*0.25);
        ctx.stroke();
    ctx.rotate(player.orientation-Math.PI);


    ctx.translate(-gameWidth/2, -(gameHeight-navBallRadius));
}

function drawParticles(ctx) {
    for(var particle of gamestateLocal.gameobjects.particles) {
        if(!particle.visible)
            continue;
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.alpha;
        ctx.fillRect(particle.posX, particle.posY, 1, 1);        
    }
    ctx.globalAlpha = 1;
}