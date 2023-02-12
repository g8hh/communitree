// ************ Options ************

let options = {}

function getStartOptions() {
	return {
		optionTab: "saving",

		autosave: true,
		msDisplay: "always",
		theme: null,
		hqTree: false,
		offlineProd: true,
		hideChallenges: false,
		showStory: true,
		forceOneTab: true,
		oldStyle: false,
		antiEpilepsy: false,
		notation: "default",
		notationLow: "default",
		newsTicker: false,
	}
}

function toggleOpt(name) {
	if (name == "oldStyle" && styleCooldown > 0)
		return;

	options[name] = !options[name];
	if (name == "hqTree")
		changeTreeQuality();
	if (name == "oldStyle")
		updateStyle();
	if (name == "newsTicker") {
		newsTicker.current = newsEntries[Math.floor(Math.random() * newsEntries.length)];
        while (!run(newsTicker.current[0])) newsTicker.current = newsEntries[Math.floor(Math.random() * newsEntries.length)];
        newsTicker.current = run(newsTicker.current[1]);
		newsTicker.pos = window.innerWidth;
	}
}
var styleCooldown = 0;
function updateStyle() {
	styleCooldown = 1;
	let css = document.getElementById("styleStuff");
	css.href = options.oldStyle ? "oldStyle.css" : "style.css";
	needCanvasUpdate = true;
}
function changeTreeQuality() {
	var on = options.hqTree;
	document.body.style.setProperty('--hqProperty1', on ? "2px solid" : "4px solid");
	document.body.style.setProperty('--hqProperty2a', on ? "-4px -4px 4px rgba(0, 0, 0, 0.25) inset" : "-4px -4px 4px rgba(0, 0, 0, 0) inset");
	document.body.style.setProperty('--hqProperty2b', on ? "0px 0px 20px var(--background)" : "");
	document.body.style.setProperty('--hqProperty3', on ? "2px 2px 4px rgba(0, 0, 0, 0.25)" : "none");
}
function toggleAuto(toggle) {
	player[toggle[0]][toggle[1]] = !player[toggle[0]][toggle[1]];
	needCanvasUpdate=true
}

const MS_DISPLAYS = ["ALL", "LAST, AUTO, INCOMPLETE", "AUTOMATION, INCOMPLETE", "INCOMPLETE", "NONE"];

const MS_SETTINGS = ["always", "last", "automation", "incomplete", "never"];

function adjustMSDisp() {
	options.msDisplay = MS_SETTINGS[(MS_SETTINGS.indexOf(options.msDisplay) + 1) % 5];
}
function milestoneShown(layer, id) {
	complete = player[layer].milestones.includes(id);
	auto = layers[layer].milestones[id].toggles;

	switch (options.msDisplay) {
		case "always":
			return true;
			break;
		case "last":
			return (auto) || !complete || player[layer].lastMilestone === id;
			break;
		case "automation":
			return (auto) || !complete;
			break;
		case "incomplete":
			return !complete;
			break;
		case "never":
			return false;
			break;
	}
	return false;
}

const NT_DISPLAYS = ["FGH-J NOTATION", "HYPER-E", "CHAINED ARROWS", "FALLBACK NOTATION"];

const NT_SETTINGS = ["default", "hypere", "chained", "fallback"];

function adjustNotation() {
	options.notation = NT_SETTINGS[(NT_SETTINGS.indexOf(options.notation) + 1) % NT_SETTINGS.length];
}

const NL_DISPLAYS = ["SCIENTIFIC", "STANDARD (BETA)"];

const NL_SETTINGS = ["default", "standard"];

function adjustNotationLow() {
	options.notationLow = NL_SETTINGS[(NL_SETTINGS.indexOf(options.notationLow) + 1) % NL_SETTINGS.length];
}