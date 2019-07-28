var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

// var gameserver_module = require('./server/game-server.js');

//WEBSERVER FUNCTIONALITÄT
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/www/index.html');
});
//make the www directory the main webspace directory
app.get('/*', (req, res) => {
    if(req.url.includes(".."))
        console.error("forbidden: " + req.url);
    res.sendFile(__dirname + "/www/" + req.url);
});



var clientsSocketQueue = []; //queue of clients/players (=> their socket), that are waiting to join the game (waiting until next gamestate synchronization)
var clientsSocketQueueWaitingForPlayerID = []; // queue of clients, where the main client was asked to create them, but did not yet respond

var playersToRemoveFromGame = [];

//socket.io
io.on('connection', (socket) => {
    // //send client size of game
    // socket.emit('gamesize', gameserver_module.getGamestate().gameWidth, gameserver_module.getGamestate().gameHeight);
    
    var playerID;

    //put the client/player in the playersQueue
    clientsSocketQueue.push(socket);

    socket.on('my playerID is', (myPlayerID) => {
        playerID = myPlayerID;
    });

    socket.on('key event', (playerID, keyCode, keyDown) => {
        socket.broadcast.emit('key event', playerID, keyCode, keyDown);
    });

    //synchronization (requested by gamestateSynchronization() (on server) loop). The gamestate received should be passed to all other clients
    socket.on('this is my master gamestate', (gamestate_master, newPlayerIDs, nthSynchronization) => {        
        // check if there was already a newer version of gamestate synchronized
        if(highestSynchronizationIndexAccepted >= nthSynchronization)
            return;
        highestSynchronizationIndexAccepted = nthSynchronization;
        console.log("highestSynchronizationIndexAccepted: " + highestSynchronizationIndexAccepted);
        socket.broadcast.emit('master gamestate override', gamestate_master);        

        console.log("sync ['this is my master gamestate' event sent to server]");

        //tell every new client, which playerID is his
        var client;
        for(var i = 0; i < newPlayerIDs.length && clientsSocketQueueWaitingForPlayerID.length > 0; i++) {
            client = clientsSocketQueueWaitingForPlayerID.pop();
            console.log("completely registered player: " + newPlayerIDs[i]);
            client.emit('player registered', newPlayerIDs[i]);

            // //diesem socket seinen player zuweisen
            // if(client == socket) {
            //     playerID = newPlayerIDs[i];
            // }
        }
    });

    //delete player from gamestate object
    socket.on('disconnect', () => {
        playersToRemoveFromGame.push(playerID);
        console.log("telling to delete: " + playerID);        
    });
});

//synchronization loop
var highestSynchronizationIndexAccepted = 0;
var synchronizationsRequested = 0;
setTimeout(gamestateSynchronization, 100);
function gamestateSynchronization() {
    //ask on client to send his current complete gamestate
    // and gently ask him to create a specific amount of new players
    var clientMaster = Object.values(io.sockets.sockets)[0];
    // TODO derzeitiges Problem: Wenn der User F5 drückt, dann wird der alte user trotzdem nochmal fürs synchronizen an dieser Stelle hier genommen. Da der aber nichtmehr antwortet, verläuft sich das ganze im Sand => 1. automatisches retryen => 2. das Problem auch tatsächlich lösen 
    if(clientMaster == undefined) {
        setTimeout(gamestateSynchronization, 500);
        console.log("no connected socket found for synchronization");
        return;
    }

    // console.log("socket still exists");

    // console.log(clientsSocketQueue);
    clientMaster.emit('pls send your gamestate', clientsSocketQueue.length, synchronizationsRequested, playersToRemoveFromGame);
    synchronizationsRequested++;
    playersToRemoveFromGame = [];

    for(var client of clientsSocketQueue.values())
        clientsSocketQueueWaitingForPlayerID.push(client);
    clientsSocketQueue = [];
    // => client will answer with 'this is my master gamestate'

    setTimeout(gamestateSynchronization, 2000);
}

http.listen(3000, () => {
    console.log("Spacecollision server listening on *:3000");
});