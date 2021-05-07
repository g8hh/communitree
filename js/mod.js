let modInfo = {
	name: "The Communitree!",
	id: "all",
	author: "ducdat0507",
	pointsName: "points",
	discordName: "",
	discordLink: "",
	initialStartPoints: EN (10), // Used for hard resets and new players
	
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0",
	name: "",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- Added things.<br>
		- Added stuff.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return EN(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return hasUpgrade("jac", 101)
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return EN(0)

	let gain = EN(1)
	if (hasUpgrade("jac", 102)) gain = gain.mul(upgradeEffect("jac", 102))
	if (hasUpgrade("jac", 103)) gain = gain.mul(upgradeEffect("jac", 103))
	if (hasUpgrade("jac", 223)) gain = gain.mul(buyableEffect("jac", 111)).mul(buyableEffect("jac", 112))
	gain = gain.mul(buyableEffect("jac", 101))
	gain = gain.mul(buyableEffect("jac", 121))
	gain = gain.mul(buyableEffect("jac", 123).ppp)

	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return false
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