<h1>tl;dr</h1>
<p>Space-inspired pixelated Javascript game; Multiplayer via NodeJS server</p>

<h1>Manual</h1>
<ul>
	<li>Run 'index.js' with NodeJS</li>
	<li>Connect to the server via browser [=> URL/port printed to Console]</li>
</ul>

<h1>Controls</h1>
<ul>
	<li>W/S: pro/retrograde acceleration</li>
	<li>A/D: acceleration of reaction wheels resulting in rotary movement</li>
	<li>SPACE: shoot some AwESoMe lASer BeAMS</li>
</ul>

<h2>How it kinda works</h2>
<ul>
	<li>Game basicly runs completely on client-side</li>
	<li>All Game-relevant informations are stored in a single JS object (=> 'Gamestate-object')</li>
	<li>Server acts as event (e.g. keyboard input) distributer and Gamestate-synchronizer</li>
	<li>One client represents the 'main' client</li>
	<li>All other clients Gamestates get overwritten by the 'main' clients Gamestate in regular intervals => synchronization</li>
</ul>
