let modInfo = {
	name: "社区树 - The Communitree!",
	id: "allofem",
	author: "ducdat0507",
	pointsName: "points",
	discordName: "The Prestreestuck Server",
	discordLink: "https://discord.gg/fHcWmmprGm",
	initialStartPoints: EN (10), // Used for hard resets and new players
	
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.5",
	name: "Two Years Later",
}

let changelog = () => `<h1>Changelog:</h1><br/>
	<i>(Be warned: this contains spoilers!)</i><br/>
	<br/>
	<h2>v0.5</h2><br/>
	<h4><i>- Two Years Later -</i></h4>
		Added <spoiler>thepaperpilot</spoiler> creator layer.<br/>
		Added the news ticker (because I can).<br/>
		Static resets in <spoiler>The Prestige Tree</spoiler> will now display their requirements as "requires" instead of "next at" when bulk reseting is not available.<br/>
		Spoilers in the changelog are now hidden until you hover the mouse over it, like this:
		<spoiler>hi, i do not have anything to spoil though</spoiler><br/>
		Bumped endgame to ${format([16, 2, 0, 1])}.<br/>
	<br/>
	<h3>v0.4.2</h3><br/>
		Added the <spoiler>Giftcode tab</spoiler> in the <spoiler>despacit creator layer</spoiler>. This is basically <spoiler>my first attempt at making a text adventure</spoiler>.<br/>
		Added a notation system. Now you can change your preferred way of expressing numbers using a bunch of pre-crafted notations!<br/>
		Attempted to optimize the game by disabling inactive modder layers.<br/>
		Bumped endgame to ${format([800, 2, 0, 1])}.<br/>
	<br/>
	<h3>v0.4.1</h3><br/>
		Changed all occurences of "<spoiler>barrels</spoiler>" to "<spoiler>mergables</spoiler>" (wrong game reference).<br/>
		Bumped endgame to ${format([240, 2, 0, 1])}.<br/>
	<br/>
	<h2>v0.4</h2><br/>
	<h4><i>- Highly Responsive to Modifications -</i></h4>
		Added <spoiler>despacit</spoiler> creator layer.<br/>
		Fixed <spoiler>Aarex dimension</spoiler> buying was inconsistent.<br/>
		Fixed <spoiler>generator resets</spoiler> shown as <spoiler>reset for boosters</spoiler>.<br/>
		Added a link to the Prestreestuck server (and added a channel specifically for the game on the server).<br/>
		Bumped endgame to ${format([16, 2, 0, 1])}.<br/>
	<br/>
	<h3>v0.3.5</h3><br/>
		Added some more content.<br/>
		Fixed <spoiler>TMT upgrade tree</spoiler> showings upgrades as needing <spoiler>Acamaeda points</spoiler> instead of <spoiler>component points</spoiler>.<br/>
		Bumped endgame to ${format([1500000, 1, 0, 1])}.<br/>
	<br/>
	<h3>v0.3.4</h3><br/>
		Rebalanced the <spoiler>Aarex layer</spoiler>.<br/>
		Added automation to <spoiler><b>The Long Awaited Upgrade</b></spoiler> and <spoiler><b>Ticksped</b></spoiler>.<br/>
		Fixed the <spoiler>Aarex Dimensions</spoiler> tab consuming performance the more you keep it on.<br/>
	<br/>
	<h3>v0.3.3</h3><br/>
		Changed v0.1 endgame from ${format([68.475, 6, 1])} to ${format([68.475, 6])}.<br/>
	<br/>
	<h3>v0.3.2</h3><br/>
		Fixed the game formatting numbers greater than 1e9 and less than 1e16 with an extra "e".<br/>
	<br/>
	<h3>v0.3.1</h3><br/>
		Fixed <spoiler>ashes and flames</spoiler> sometimes not working correctly with high numbers.<br/>
		Fixed the game fails to reload upon completing the <spoiler>thefinaluptake</spoiler> layer.<br/>
		Fixed the game freezing instead of showing the endgame screen.<br/>
		Bumped <spoiler>thefinaluptake</spoiler> completion requirement.<br/>
		Bumped endgame to ${format([5000, 1, 0, 1])}.<br/>
	<br/>
	<h2>v0.3</h2><br/>
	<h4><i>- Alphablade -</i></h4>
		Added <spoiler>thefinaluptake</spoiler> creator layer.<br/>
		Added <spoiler>The Modding Tree... wait</spoiler><br/>
		Fixed sliders not behaving as intended.<br/>
		Bumped endgame to ${format([2000, 1, 0, 1])}.<br/>
	<br/>
	<h3>v0.2.4</h3><br/>
		Modified number formatting, we now just use Hyper-E.<br/>
		Migrated to The Modding Tree 2.6.0.1.<br/>
	<br/>
	<h3>v0.2.3</h3><br/>
		Fixed a game-breaking bug where <spoiler>Acamaeda</spoiler> layer requiring higher that it should.<br/>
		Modified number formatting, once again. Why don't we just use Hyper-E?<br/>
		Fixed <spoiler>Aarex Dimensions</spoiler> buy-max makes <spoiler>dimension points</spoiler> flickering on high amounts.<br/>
		Fixed some NaN bugs (probably)<br/>
	<br/>
	<h3>v0.2.2</h3><br/>
		Fixed a game-breaking bug where <spoiler>Aarex</spoiler> layer is unintentionally locked.<br/>
	<br/>
	<h3>v0.2.1</h3><br/>
		Fixed a game-breaking bug where the game doesnt load or the game display numbers as NaN×10↑NaN and similar.<br/>
	<br/>
	<h2>v0.2</h2><br/>
	<h4><i>- Layer Omega -</i></h4>
		Added <spoiler>Acamaeda</spoiler> creator layer (note, the layer may contain flashing colors).<br/>
		You are now no longer able to do a <spoiler>sacrifice</spoiler> reset without an <spoiler>Aarex Dimension 10</spoiler>.<br/>
		Modified number formatting to use a more accurate one.<br/>
		Added epilepsy warning and epilepsy toggle.<br/>
		Changed the main font to Consolas from Lucida Console.<br/>
		Bumped endgame to ${format([9, 3, 2])}.<br/>
	<br/>
	<h2>v0.1</h2><br/>
	<h4><i>- Slow and Steady -</i></h4>
		Added <spoiler>Aarex</spoiler> creator layer.<br/>
		Added more layers in <spoiler>The Prestige Tree</spoiler> tab.<br/>
		Migrated to The Modding Tree 2.5.9.2.<br/>
		Changed from using ExpantaNum.js to OmegaNum.js (and therefore will wipe out everybody's saves, I'm sorry).<br/>
		Modified number formatting. (look ma, I invented new up arrow notation!)<br/>
		Bumped endgame to ${format([68.475, 6])}.<br/>
	<br/>
	<h2>v0.0</h2><br/>
		Initial release. (hello world!!)<br/>
	<br/>
`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["onCooldown", "blowUpEverything"]

function getStartPoints(){
    return new ExpantaNum(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return hasUpgrade("jac", 101) && player.points.lt(EN.tetrate(10, "e1000000"))
}

// Calculate points/sec!
function getPointGen() {
	if(!hasUpgrade("jac", 101) && !hasUpgrade("aar", 101))
		return EN(0)

	let gain = EN(1)
	if (hasUpgrade("jac", 102)) gain = gain.mul(upgradeEffect("jac", 102))
	if (hasUpgrade("jac", 103)) gain = gain.mul(upgradeEffect("jac", 103))
	if (hasUpgrade("jac", 223)) gain = gain.mul(buyableEffect("jac", 111)).mul(buyableEffect("jac", 112))
	gain = gain.mul(buyableEffect("jac", 101))
	gain = gain.mul(buyableEffect("jac", 121))
	gain = gain.mul(buyableEffect("jac", 123).ppp)
	gain = gain.mul(buyableEffect("jac", 131))
	gain = gain.mul(buyableEffect("jac", 132))
	
	if (hasUpgrade("aar", 101)) gain = gain.mul(10)
	if (hasUpgrade("aar", 103)) gain = gain.mul(player.aar.bal.add(1))
	
	if (hasUpgrade("aar", 201)) gain = gain.mul(upgradeEffect("aar", 201))

	if (hasUpgrade("aca", 125)) gain = gain.mul(tmp.aca.effect.pointMult)

	if (hasUpgrade("aca", 101)) gain = gain.pow(upgradeEffect("aca", 101))

	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	() => `<h5 style="opacity:.5"><br/><i>(Current endgame: ${format([30000, 2, 0, 1])} points)`,
	() => !player.isWarned ? `
		<div style="border:2px solid var(--color);margin-top:10px;padding:5px;display:inline-block">
		Important notice: Some parts of the game may contain flashing lights.<br/>
		To prevent this, turn on "Anti-Epilepsy Mode" in the settings tab.<br/>
		(the gear icon in the top-left corner)<br/>
		<button style="margin-top:10px;" onclick="player.isWarned = true">Got it!</button>
	` : ""
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte([30000, 2, 0, 1])
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}