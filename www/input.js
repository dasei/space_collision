document.body.onkeydown = function(event) {
    socket.emit('key event', playerID, event.keyCode, true);
    getPlayer().keyRegister[event.keyCode] = true;
};

document.body.onkeyup = function(event) {
    socket.emit('key event', playerID, event.keyCode, false);
    // delete getPlayer().keyRegister[event.keyCode];
    getPlayer().keyRegister[event.keyCode] = false;
};