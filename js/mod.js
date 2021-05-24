let modInfo = {
	name: "The Communitree!",
	id: "allofem",
	author: "ducdat0507",
	pointsName: "points",
	discordName: "",
	discordLink: "",
	initialStartPoints: EN (10), // Used for hard resets and new players
	
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1",
	name: "Slow and Steady",
}

let changelog = `<h1>Changelog:</h1><br/>
	<br/>
	<h2>v0.1</h2><br/>
	<h4><i>- Slow and Steady -</i></h4>
		Added Aarex creator layer.<br/>
		Added more layers in The Prestige Tree tab.<br/>
		Migrated to The Modding Tree 2.5.9.2.<br/>
		Changed from using ExpantaNum.js to OmegaNum.js (and therefore will wipe out everybody's saves, I'm sorry).<br/>
		Modified number formatting. (look ma, I invented new up arrow notation!)<br/>
		Bumped endgame to 10↑↑6↑68.475.<br/>
	<br/>
	<h2>v0.0</h2><br/>
		Initial release.<br/>
`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return EN(modInfo.initialStartPoints)
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

	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	() => `<h5 style="opacity:.5"><br/><i>(Current endgame: ${format("eeeeee68.475")} points)`
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte("eeeeee68.475")
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