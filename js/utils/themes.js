// ************ Themes ************
const themes = {
	"default": {
		name: "Default",
		colors: { 1: "#ffffff", 2: "#bfbfbf", 3: "#7f7f7f" },
		variables: {
			"--background": "#0f0f0f",
			"--background_tooltip": "rgba(0, 0, 0, 0.75)",
			"--color": "#dfdfdf",
			"--points": "#ffffff",
			"--locked": "#bf8f8f",
			"--bought": "#77bf5f",
		}
	},
	"aqua": {
		name: "Aqua",
		colors: { 1: "#bfdfff", 2: "#8fa7bf", 3: "#5f6f7f" },
		variables: {
			"--background": "#001f3f",
			"--background_tooltip": "rgba(0, 15, 31, 0.75)",
			"--color": "#bfdfff",
			"--points": "#dfefff",
			"--locked": "#c4a7b3",
			"--bought": "#77bf5f",
		}
	},
};
function changeTheme() {
	let theme = options.theme || "default";
	colors_theme = themes[theme].colors;
	for (let [key, value] of Object.entries(themes[theme].variables)) {
		document.body.style.setProperty(key, value);
	}
}
function getThemeName() {
	return options.theme ? themes[options.theme].name : "Default";
}

function switchTheme() {
	if (options.theme === null) options.theme = "default";
	let keys = Object.keys(themes);
	options.theme = keys[(keys.indexOf(options.theme) + 1) % keys.length];
	changeTheme();
	resizeCanvas();
}