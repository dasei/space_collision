class GameObject {
    constructor(posX, posY) {
        this.posX = posX;
        this.posY = posY;
        this.speedX = 0;
        this.speedY = 0;
        this.rotationSpeed = 0;
        this.orientation = 0; //current rotation
        this.mass = 10;
    }
    updatePosition(deltaTimeSeconds) {        
        this.posX += this.speedX * deltaTimeSeconds;        
        this.posY += this.speedY * deltaTimeSeconds;

        this.orientation += this.rotationSpeed * deltaTimeSeconds;        
    };
}

class Spaceship extends GameObject {
    constructor(posX, posY) {
        super(posX, posY);

        this.boosterStrengthSide = 1;
        this.boosterStrengthPrograde = 5;
        this.boosterStrengthRetrograde = 4;        

        this.reactionWheelsSpeed = 0;
        this.reactionWheelsAcceleration = 1;
        this.reactionWheelsMass = 10;
        this.reactionWheelsSpeedMax = 5;

        this.shootingCooldownMillis = 100;
        this.shootingCooldownLastShot = null;
    }
    updatePosition(deltaTimeSeconds) {
        super.updatePosition(deltaTimeSeconds);
        
        //reaction wheels
        this.orientation += (this.reactionWheelsSpeed * this.reactionWheelsMass * deltaTimeSeconds) / this.mass;        
    };
}

class Player extends Spaceship {
    constructor(posX, posY, id) {
        super(posX, posY);
        this.id = id;
        this.keyRegister = {};
    }
    processInputs(deltaTimeSeconds) {
        // pro/retrograde acceleration
        if(this.keyRegister[87]) { //W
            // console.log("W");
            this.speedX += Math.sin(this.orientation) * this.boosterStrengthPrograde * deltaTimeSeconds;
            this.speedY += Math.cos(this.orientation) * this.boosterStrengthPrograde * deltaTimeSeconds;
        } else if(this.keyRegister[83]) { //S
            this.speedX -= Math.sin(this.orientation) * this.boosterStrengthRetrograde * deltaTimeSeconds;
            this.speedY -= Math.cos(this.orientation) * this.boosterStrengthRetrograde * deltaTimeSeconds;
        }

        //reaktionsräder / reaction wheels
        if(this.keyRegister[65]) { //a
            this.reactionWheelsSpeed += this.reactionWheelsAcceleration * deltaTimeSeconds * (this.reactionWheelsSpeed < 0 ? 2 : 1);
        } else if(this.keyRegister[68]) { //d
            this.reactionWheelsSpeed -= this.reactionWheelsAcceleration * deltaTimeSeconds * (this.reactionWheelsSpeed > 0 ? 2 : 1);
        } else {
            this.reactionWheelsSpeed += (this.reactionWheelsSpeed < 0 ? +1 : -1) * this.reactionWheelsAcceleration * deltaTimeSeconds;
            if(Math.abs(this.reactionWheelsSpeed) < this.reactionWheelsAcceleration * deltaTimeSeconds)
                this.reactionWheelsSpeed * 0.5;
        }
        //min max reaction wheel speed
        this.reactionWheelsSpeed = Math.max(-this.reactionWheelsSpeedMax, 
                Math.min(this.reactionWheelsSpeedMax, this.reactionWheelsSpeed)
            );

        //shooting
        if(this.keyRegister[32]) { //space
            let timeNow = new Date().getTime();

            if(timeNow > this.shootingCooldownLastShot + this.shootingCooldownMillis || this.shootingCooldownLastShot == null) {
                this.shootingCooldownLastShot = timeNow;
                gamestate.gameobjects.projectiles.push(new Projectile(this.posX, this.posY, Math.sin(this.orientation)*30, Math.cos(this.orientation)*30, 'laser', this));                
                // registerParticle(new Particle(this.posX, this.posY, 3, this.speedX*4, this.speedY*4, Math.PI/4, '#00FFFF', 0.2));
            }
        }
    }
}

class Projectile extends GameObject {
    constructor(posX, posY, speedX, speedY, projectileType, initiator) {
        super(posX, posY);
        this.speedX = speedX;
        this.speedY = speedY;
        this.projectileType = projectileType;
        this.initiator = initiator;
        this.timeLivedSeconds = 0;
        switch(projectileType) {
            case 'laser':
                this.lifetimeSeconds = 1.5;
            break;
            default:
                this.lifetimeSeconds = 1;
        }
    }
    updatePosition(deltaTimeSeconds) {
        super.updatePosition(deltaTimeSeconds);

        // check if this particle has outlived his livespan
        this.timeLivedSeconds += deltaTimeSeconds;
        if(this.timeLivedSeconds > this.lifetimeSeconds) {
            gamestate.gameobjects.projectiles.splice(
                gamestate.gameobjects.projectiles.indexOf(this), 1);
darklingrate/alpha is not doing anything in the line below
            for(var i = 0; i < 3; i++) {
                registerParticle(new Particle(this.posX, this.posY, 0, this.speedX, this.speedY, 1, PROJECTILE_DATA[this.projectileType].color))
            }
        }
    }
}
const PROJECTILE_DATA = {
    'laser': {
        color: '#00FFFF',
        lifetimeSeconds: 1.5
    },
    'default': {
        color: '#FFFFFF',
        lifetimeSeconds: 0.5
    }
}

class Particle extends GameObject{
    /**
     * @param {number} spreadRadius radius of sphere around x, y in which the Particle should be placed
     * @param {string} color color of this particle as in '#1818FF'
     */
    constructor(x, y, spreadRadius, speedX, speedY, speedDirectionSpreadRangeHalfRadians, color, darklingRatePerSecond) {
        super(
            x + (Math.random()*spreadRadius*2) - spreadRadius,
            y + (Math.random()*spreadRadius*2) - spreadRadius
        );

        var speed = Math.sqrt((speedX*speedX)+(speedY*speedY));
        var newSpeedDirection = Math.atan2(speedX, speedY) + (Math.random()*speedDirectionSpreadRangeHalfRadians*2) - speedDirectionSpreadRangeHalfRadians;

        this.speedX = Math.sin(newSpeedDirection)*speed;
        this.speedY = Math.cos(newSpeedDirection)*speed;
        this.alpha = 1;
        this.color = color;
        this.visible = true;
        this.darklingRatePerSecond = darklingRatePerSecond;
    }
    updatePosition(deltaTimeSeconds) {
        super.updatePosition(deltaTimeSeconds);

        if(!this.visible)
            return;
        this.alpha -= this.darklingRatePerSecond*deltaTimeSeconds;
        if(this.alpha <= 0)
            this.visible = false;
    }
}