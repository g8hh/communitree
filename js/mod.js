let modInfo = {
	name: "The Communitree!",
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
	num: "0.4.1",
	name: "Highly Responsive to Modifications",
}

let changelog = `<h1>Changelog:</h1><br/>
	<i>(Be warned: this may contain spoilers!)</i><br/>
	<br/>
	<h3>v0.4.1</h3><br/>
		Changed all "barrels" to "mergables".<br/>
	<br/>
	<h2>v0.4</h2><br/>
	<h4><i>- Highly Responsive to Modifications -</i></h4>
		Added despacit creator layer.<br/>
		Fixed Aarex dimension buying was inconsistent.<br/>
		Fixed generator resets shown as reset for boosters.<br/>
		Added a link to the Prestreestuck server. <i>(why?)</i><br/>
		Bumped endgame to ${format([16, 2, 0, 1])}.<br/>
	<br/>
	<h3>v0.3.5</h3><br/>
		Added some more content.<br/>
		Fixed TMT upgrade tree showings upgrades need Acamaeda points instead of component points.<br/>
		Bumped endgame to ${format([1500000, 1, 0, 1])}.<br/>
	<br/>
	<h3>v0.3.4</h3><br/>
		Rebalanced the Aarex layer.<br/>
		Added automation to <b>The Long Awaited Upgrade</b> and <b>Ticksped</b>.<br/>
		Fixed the Aarex Dimensions tab consuming performance the more you keep it on.<br/>
	<br/>
	<h3>v0.3.3</h3><br/>
		Changed v0.1 endgame from ${format([68.475, 6, 1])} to ${format([68.475, 6])}.<br/>
	<br/>
	<h3>v0.3.2</h3><br/>
		Fixed the game formatting numbers greater than 1e9 and less than 1e16 with an extra "e".<br/>
	<br/>
	<h3>v0.3.1</h3><br/>
		Fixed ashes and flames sometimes not working correctly with high numbers.<br/>
		Fixed the game fails to reload upon completing the thefinaluptake layer.<br/>
		Fixed the game freezes instead of showing the endgame screen.<br/>
		Bumped thefinaluptake completion requirement.<br/>
		Bumped endgame to ${format([5000, 1, 0, 1])}.<br/>
	<br/>
	<h2>v0.3</h2><br/>
	<h4><i>- Alphablade -</i></h4>
		Added thefinaluptake creator layer.<br/>
		Added The Modding Tree... wait<br/>
		Fixed sliders not behaving as intended.<br/>
		Bumped endgame to ${format([2000, 1, 0, 1])}.<br/>
	<br/>
	<h3>v0.2.4</h3><br/>
		Modified number formatting, we now just use Hyper-E.<br/>
		Migrated to The Modding Tree 2.6.0.1.<br/>
	<br/>
	<h3>v0.2.3</h3><br/>
		Fixed a game-breaking bug where Acamaeda layer requiring higher that it should.<br/>
		Modified number formatting, once again. Why don't we just use Hyper-E?<br/>
		Fixed Aarex Dimensions buy-max makes dimension points flickering on high amounts.<br/>
		Fixed some NaN bugs (probably)<br/>
	<br/>
	<h3>v0.2.2</h3><br/>
		Fixed a game-breaking bug where Aarex layer is unintentionally locked.<br/>
	<br/>
	<h3>v0.2.1</h3><br/>
		Fixed a game-breaking bug where the game doesnt load or the game display numbers as NaN×10↑NaN and similar.<br/>
	<br/>
	<h2>v0.2</h2><br/>
	<h4><i>- Layer Omega -</i></h4>
		Added Acamaeda creator layer (note, the layer may contain flashing colors).<br/>
		You are now no longer able to do a sacrifice reset without an Aarex Dimension 10.<br/>
		Modified number formatting to use a more accurate one.<br/>
		Added epilepsy warning and epilepsy toggle.<br/>
		Changed the main font to Consolas from Lucida Console.<br/>
		Bumped endgame to ${format([9, 3, 2])}.<br/>
	<br/>
	<h2>v0.1</h2><br/>
	<h4><i>- Slow and Steady -</i></h4>
		Added Aarex creator layer.<br/>
		Added more layers in The Prestige Tree tab.<br/>
		Migrated to The Modding Tree 2.5.9.2.<br/>
		Changed from using ExpantaNum.js to OmegaNum.js (and therefore will wipe out everybody's saves, I'm sorry).<br/>
		Modified number formatting. (look ma, I invented new up arrow notation!)<br/>
		Bumped endgame to ${format([68.475, 6])}.<br/>
	<br/>
	<h2>v0.0</h2><br/>
		Initial release.<br/>
	<br/>
`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

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
	() => `<h5 style="opacity:.5"><br/><i>(Current endgame: ${format([1e16, 1, 0, 1])} points)`,
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
	return player.points.gte([16, 2, 0, 1])
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