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
    
    
    ctx.lineWidth = 1/canvas_scale_up;
    ctx.strokeStyle = "#FFFFFF";
    //player
    // console.log("players: " + gamestate.gameobjects.players.length);
    ctx.beginPath();
    for(var playerObj of gamestate.gameobjects.players) {
        drawPlayer(ctx, playerObj);
    }
    ctx.stroke();
    //projectiles    
    let rotation;
    for(var projectile of gamestate.gameobjects.projectiles) {
        ctx.translate(projectile.posX, projectile.posY);
        switch(projectile.projectileType) {            
            case 'laser':
                ctx.fillStyle = "#0000FF";
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
    
    ctx.moveTo(0, 3);
    ctx.lineTo(2, -3);
    ctx.lineTo(-2, -3);
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