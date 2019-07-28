New Plan:
- dont send entire gamestate array hundreds of times each second
- have the game run at the clients side, and the server only acts as the event distributer and synchronizer
- one client basicly is the 'main' client, whose version of the game gets sent to all other clients after a specific delay => synchronization

- every player has a keyregister (=> normal object, not an array!)