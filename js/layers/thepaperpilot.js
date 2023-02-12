

"use strict";

function getTPPPointGain(release) {
    return EN.floor(release.views).mul(EN.floor(release.likes).add(1)).mul(EN.floor(release.shares).add(1)).add(1).sub(release.points)
}

function claimTPPRelease(id, force = false) {
    let gain = getTPPPointGain(player.tpp.releases[id]);
    addPoints("tpp", gain);
    if (player.tpp.releases[id].exposure <= 0 || force) player.tpp.releases.splice(id, 1);
    else player.tpp.releases[id].points = EN.add(player.tpp.releases[id].points, gain);
}

function setTPPMastery(target, amount) {
    console.log(target, amount);
    player.tpp.masteries[target] = amount;
}

function generateGameName() {
    let first = ["Thing", "Civilization", "Shape", "Noun", "Developer", "Generic"];
    let last = ["Idle", "Shooter", "Simulator", "Battlefield", "Royale", "RPG"];
    return first[Math.floor(Math.random() * first.length)] + " " + last[Math.floor(Math.random() * last.length)];
}

addLayer("tpp", {
    name: "thepaperpilot",
    symbol: "",

    row: 4,
    displayRow: 1,
    position: 0,
    branches: ["aca"],
    layerShown() { return player.aca.modActive && player.aca.modLevel == 2 },
    deactivated() { return !this.layerShown() },

    startData() {
        let data = {
            points: EN(0),

            isDev: true,

            masteries: {},
            dev: {
                loc: EN(0), 
                bugs: EN(0),

                gameplay: EN(0), 
                playtime: EN(0),

                graphics: [EN(0), EN(0), EN(0), EN(0), EN(0), EN(0)],
                audios: [EN(0), EN(0), EN(0), EN(0), EN(0), EN(0)],
                cooldowns: {}
            },
            releases: []
        }
        for (let x in this.masteries) data.masteries[x] = 0;
        for (let x in this.clickables) if (this.clickables[x].cooldown) data.dev.cooldowns[x] = 0;
        return data;
    },

    effect() {
        if (tmp[this.layer].deactivated) return {}
        let eff = {
            compBonus: player.tpp.points.add(10).log().pow(player.tpp.total.add(1).log10()),

            qualityMultis: [
                EN.pow(player.tpp.dev.loc, player.tpp.masteries.logic >= 5 ? .5 : .4).div(2),
                EN.pow(player.tpp.dev.gameplay, .6).div(4).add(1),
                EN.pow(player.tpp.dev.graphics[0], .3).add(1),
                EN.pow(player.tpp.dev.audios[0], .3).add(1),
            ],
            quality: EN(1),

            bugDebuff: EN.add(player.tpp.dev.bugs, 1).pow(0.9),
            playtestBuff: EN.add(player.tpp.dev.playtime, 1).pow(0.15),
        }

        eff.qualityMultis[0] = eff.qualityMultis[0].div(eff.bugDebuff);
        eff.qualityMultis[1] = eff.qualityMultis[1].mul(eff.playtestBuff);

        for (let x in eff.qualityMultis) eff.quality = eff.quality.mul(eff.qualityMultis[x]);

        return eff
    },
    effectDescription() {
        return `which are making despacit time ${format(tmp.tpp.effect.compBonus)}× faster.`
    },

    resource: "thepaperpilot points",
    color: "#dfdfdf",
    type: "none",

    style: {
        background: "#2a323d !important",
    },

    buyables: {
        100: {
            title() {
                return ""
            },
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>Level Up</h3>
                    Gain 1 mastery point.

                    Cost: ${format(data.cost)} thepaperpilot points
                `
            },
            unlocked() {
                return tmp.tpp.layerShown
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(x.div(5).add(3.8), x).mul(10)
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.tpp.points.gte(data.cost)
            },
            buy() {
                player.tpp.points = player.tpp.points.sub(this.cost())
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            style: { ...tmtBuyable }
        },
        101: {
            title() {
                return ""
            },
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>Skill Get</h3>
                    Unlock a new skill.

                    Cost: ${format(data.cost)} thepaperpilot points
                `
            },
            unlocked() {
                return tmp.tpp.layerShown
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(100, EN.pow(2, x))
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.tpp.points.gte(data.cost)
            },
            buy() {
                player.tpp.points = player.tpp.points.sub(this.cost())
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            style: { ...tmtBuyable }
        },
    },

    clickables: {
        0: {
            display() {
                return player.tpp.isDev 
                    ? ("Release game<br/>(" + (tmp.tpp.effect.quality?.lt(1) 
                        ? "Requires " + format(tmp.tpp.effect.quality) + " / 1 quality" 
                        : format(tmp.tpp.effect.quality) + " quality") + ")")
                    : "Begin game production"
            },
            cooldown: 10,
            unlocked() {
                return true
            },
            canClick() {
                return player.tpp.isDev ? tmp.tpp.effect.quality.gte(1) : true
            },
            onClick() {
                if (player.tpp.isDev) {
                    player.tpp.releases.push({
                        name: generateGameName(),
                        quality: tmp.tpp.effect.quality, 
                        exposure: 1,
                        timer: 0,
                        views: EN(0),
                        likes: EN(0),
                        shares: EN(0),
                        points: EN(0),
                    });
                    player.tpp.dev = layers.tpp.startData().dev
                } else {

                }
                player.tpp.isDev = !player.tpp.isDev;
            },
            onHold() {
            },
            style: { ...smallClickable }
        },
        "c1": {
            display() {
                return "Write some code<br/>(" + formatTime(player.tpp.dev.cooldowns[this.id] || run(this.cooldown)) + ")"
            },
            cooldown: 10,
            unlocked() {
                return true
            },
            canClick() {
                return !player.tpp.dev.cooldowns[this.id]
            },
            multiplier() {
                let mul = EN(1);
                if (player.tpp.masteries.logic >= 8) mul = mul.add(player.tpp.buyables[100]).div(tmp.tpp.effect.bugDebuff);
                if (player.tpp.masteries.gameplay >= 2) mul = mul.mul(tmp.tpp.effect.qualityMultis?.[1] || 1);
                return mul;
            },
            onClick() {
                player.tpp.dev.loc = EN.add(player.tpp.dev.loc, tmp.tpp.clickables[this.id].multiplier);
                player.tpp.dev.cooldowns[this.id] = run(this.cooldown);
            },
            onCooldown(delta) {
                if (player.tpp.masteries.logic < 1) return;

                let speed = EN(0.5).mul(tmp.tpp.clickables[this.id].multiplier);
                if (player.tpp.masteries.logic >= 2) speed = EN.pow(1.2, player.tpp.masteries.logic).mul(speed);

                player.tpp.dev.loc = EN.add(player.tpp.dev.loc, EN.mul(delta, speed));
                if (player.tpp.masteries.logic >= 4) player.tpp.dev.bugs = EN.add(player.tpp.dev.bugs, EN.mul(delta, speed.sqrt().div(100)));
            },
            onHold() {
            },
            style: { ...smallClickable }
        },
        "c2": {
            display() {
                return "Squash bugs<br/>(" + formatTime(player.tpp.dev.cooldowns[this.id] || run(this.cooldown)) + ")"
            },
            cooldown: 20,
            unlocked() {
                return true
            },
            canClick() {
                return !player.tpp.dev.cooldowns[this.id]
            },
            multiplier() {
                let mul = EN(1);
                return mul;
            },
            speed() {
                let mul = EN(1);
                return mul;
            },
            onClick() {
                player.tpp.dev.bugs = EN.sub(player.tpp.dev.bugs, tmp.tpp.clickables[this.id].multiplier).max(0);
                player.tpp.dev.cooldowns[this.id] = run(this.cooldown);
            },
            onCooldown(delta) {
                if (player.tpp.masteries.logic < 6) return;

                let speed = EN(0.1);
                if (player.tpp.masteries.logic >= 12) speed = EN.pow(1.05, player.tpp.masteries.logic).mul(speed);

                player.tpp.dev.bugs = EN.sub(player.tpp.dev.bugs, EN.mul(delta, speed)).max(0);
            },
            onHold() {
            },
            style: { ...smallClickable }
        },
        "g1": {
            display() {
                return "Make some gameplay<br/>(" + formatTime(player.tpp.dev.cooldowns[this.id] || run(this.cooldown)) + ")"
            },
            cooldown: 12,
            unlocked() {
                return true
            },
            canClick() {
                return !player.tpp.dev.cooldowns[this.id]
            },
            onClick() {
                player.tpp.dev.cooldowns[this.id] = run(this.cooldown);
            },
            onCooldown(delta) {
                let speed = EN(1);
                if (player.tpp.masteries.gameplay >= 2) speed = EN.pow(1.1, player.tpp.masteries.gameplay).mul(speed);
                if (player.tpp.masteries.gameplay >= 5) speed = speed.mul(tmp.tpp.effect.playtestBuff);
                if (player.tpp.masteries.gameplay >= 8) speed = speed.mul(tmp.tpp.effect.qualityMultis?.[0].max(1) || 1);

                let gain = EN.min(player.tpp.dev.loc, EN.mul(delta, speed));
                player.tpp.dev.gameplay = EN.add(player.tpp.dev.gameplay, gain);
                player.tpp.dev.loc = EN.sub(player.tpp.dev.loc, gain);
            },
            onHold() {
            },
            style: { ...smallClickable }
        },
        "g2": {
            display() {
                return "Do some playtesting<br/>(" + formatTime(player.tpp.dev.cooldowns[this.id] || run(this.cooldown)) + ")"
            },
            cooldown: 30,
            unlocked() {
                return true
            },
            canClick() {
                return !player.tpp.dev.cooldowns[this.id]
            },
            speed() {
                let speed = EN(1);
                return speed;
            },
            onClick() {
                player.tpp.dev.cooldowns[this.id] = run(this.cooldown);
            },
            onCooldown(delta) {
                let speed = tmp.tpp.clickables[this.id].speed;

                let gain = EN.mul(delta, speed);
                player.tpp.dev.playtime = EN.add(player.tpp.dev.playtime, gain);
            },
            onHold() {
            },
            style: { ...smallClickable }
        },
        "v1": {
            display() {
                return "Draw some pixels<br/>(" + formatTime(player.tpp.dev.cooldowns[this.id] || run(this.cooldown)) + ")"
            },
            cooldown: 15,
            unlocked() {
                return true
            },
            canClick() {
                return !player.tpp.dev.cooldowns[this.id]
            },
            speed() {
                let speed = EN.add(player.tpp.dev.graphics[1], 1).mul(EN.add(player.tpp.dev.graphics[4], 1)).mul(0.1);
                return speed;
            },
            onClick() {
                player.tpp.dev.cooldowns[this.id] = run(this.cooldown);
            },
            onCooldown(delta) {
                let speed = tmp.tpp.clickables[this.id].speed;

                let gain = EN.mul(delta, speed);
                player.tpp.dev.graphics[0] = EN.add(player.tpp.dev.graphics[0], gain);
            },
            onHold() {
            },
            style: { ...smallClickable }
        },
        "v2": {
            display() {
                return "Draw some sprites<br/>(" + formatTime(player.tpp.dev.cooldowns[this.id] || run(this.cooldown)) + ")"
            },
            cooldown: 18,
            unlocked() {
                return true
            },
            canClick() {
                return !player.tpp.dev.cooldowns[this.id]
            },
            speed() {
                let speed = EN.add(player.tpp.dev.graphics[2], 1).mul(EN.add(player.tpp.dev.graphics[4], 1)).mul(0.1);
                return speed;
            },
            onClick() {
                player.tpp.dev.cooldowns[this.id] = run(this.cooldown);
            },
            onCooldown(delta) {
                let speed = tmp.tpp.clickables[this.id].speed;

                let gain = EN.mul(delta, speed);
                player.tpp.dev.graphics[1] = EN.add(player.tpp.dev.graphics[1], gain);
            },
            onHold() {
            },
            style: { ...smallClickable }
        },
        "v3": {
            display() {
                return "Draw some textures<br/>(" + formatTime(player.tpp.dev.cooldowns[this.id] || run(this.cooldown)) + ")"
            },
            cooldown: 21,
            unlocked() {
                return true
            },
            canClick() {
                return !player.tpp.dev.cooldowns[this.id]
            },
            speed() {
                let speed = EN.add(player.tpp.dev.graphics[3], 1).mul(EN.add(player.tpp.dev.graphics[4], 1)).mul(0.1);
                return speed;
            },
            onClick() {
                player.tpp.dev.cooldowns[this.id] = run(this.cooldown);
            },
            onCooldown(delta) {
                let speed = tmp.tpp.clickables[this.id].speed;

                let gain = EN.mul(delta, speed);
                player.tpp.dev.graphics[2] = EN.add(player.tpp.dev.graphics[2], gain);
            },
            onHold() {
            },
            style: { ...smallClickable }
        },
        "v4": {
            display() {
                return "Draw some sceneries<br/>(" + formatTime(player.tpp.dev.cooldowns[this.id] || run(this.cooldown)) + ")"
            },
            cooldown: 25,
            unlocked() {
                return true
            },
            canClick() {
                return !player.tpp.dev.cooldowns[this.id]
            },
            speed() {
                let speed = EN.add(player.tpp.dev.graphics[4], 1).mul(0.1);
                return speed;
            },
            onClick() {
                player.tpp.dev.cooldowns[this.id] = run(this.cooldown);
            },
            onCooldown(delta) {
                let speed = tmp.tpp.clickables[this.id].speed;

                let gain = EN.mul(delta, speed);
                player.tpp.dev.graphics[3] = EN.add(player.tpp.dev.graphics[3], gain);
            },
            onHold() {
            },
            style: { ...smallClickable }
        },
        "v5": {
            display() {
                return "Implement some VFXs<br/>(" + formatTime(player.tpp.dev.cooldowns[this.id] || run(this.cooldown)) + ")"
            },
            cooldown: 60,
            unlocked() {
                return true
            },
            canClick() {
                return !player.tpp.dev.cooldowns[this.id]
            },
            speed() {
                let speed = EN(0.05);
                return speed;
            },
            onClick() {
                player.tpp.dev.cooldowns[this.id] = run(this.cooldown);
            },
            onCooldown(delta) {
                let speed = tmp.tpp.clickables[this.id].speed;

                let gain = EN.mul(delta, speed);
                player.tpp.dev.graphics[4] = EN.add(player.tpp.dev.graphics[4], gain);
            },
            onHold() {
            },
            style: { ...smallClickable }
        },
        "a1": {
            display() {
                return "Design some FXs<br/>(" + formatTime(player.tpp.dev.cooldowns[this.id] || run(this.cooldown)) + ")"
            },
            cooldown: 5,
            unlocked() {
                return true
            },
            canClick() {
                return !player.tpp.dev.cooldowns[this.id]
            },
            multiplier() {
                let mul = EN(1);
                return mul;
            },
            onClick() {
                let gain = tmp.tpp.clickables[this.id].multiplier;

                player.tpp.dev.audios[0] = EN.add(player.tpp.dev.audios[0], gain);
                player.tpp.dev.cooldowns[this.id] = run(this.cooldown);
            },
            onHold() {
            },
            style: { ...smallClickable }
        },
    },

    masteries: {
        logic: {
            0: "Unlock writing code.",
            1: "Gain 0.5 lines of code per second while the action is on cooldown.",
            2: "Multiply lines of code per second by 1.2 per logic mastery allocated.",
            4: "Unlock bugs.",
            5: "Increase line of code to quality exponent from 0.4 to 0.5.",
            6: "Squash 0.1 bugs per second while the action is on cooldown.",
            8: "Increase base dev speed by 1 per mastery point, but it is divided by the bug debuff.",
            12: "Multiply bug squashing speed by 1.05 per logic mastery allocated.",
        },
        gameplay: {
            0: "Unlock gameplay machanics.",
            2: "Multiply lines of code gained by gameplay's quality multipler.",
            3: "Multiply gameplay machanics per second by 1.1 per gameplay mastery allocated.",
            5: "Unlock play testing.",
            8: "Multiply gameplay machanic speed by logic's quality multipler.",
        },
        graphics: {
            0: "Unlock pixels.",
            1: "Unlock sprites.",
            3: "Unlock textures.",
            6: "Unlock sceneries.",
            10: "Unlock visual effects.",
        },
        audio: {
            0: "Unlock sound effects.",
        }
    },
    
    update(delta) {
        for (let x in player.tpp.dev.cooldowns) if (player.tpp.dev.cooldowns[x] > 0) {
            layers.tpp.clickables[x].onCooldown?.(Math.min(delta, player.tpp.dev.cooldowns[x]));
            player.tpp.dev.cooldowns[x] -= delta;
            if (player.tpp.dev.cooldowns[x] <= 0) player.tpp.dev.cooldowns[x] = 0;
        }
        for (let x in player.tpp.releases) {
            let release = player.tpp.releases[x];
            
            let exposureFactor = EN.add(release.shares, 1).log10().pow(0.5);
            release.exposure -= delta / 100 / (exposureFactor.toNumber() + 1);
            if (release.exposure <= 0) {
                release.exposure = 0;
                continue;
            }

            release.timer += delta * EN.add(release.shares, 1).pow(0.4).mul(release.exposure).min(5).toNumber();
            let qualityFactor = EN.max(release.quality, 1).log10().add(1);
            while (release.timer >= 1) {
                let views = EN.pow(Math.min(1 / Math.random(), 1000), qualityFactor.add(exposureFactor).mul(0.25)).div(10).mul(qualityFactor);
                release.views = EN.add(release.views, views);
                let likes = views.mul(Math.random() ** EN.div(5, qualityFactor));
                release.likes = EN.add(release.likes, likes);
                let shares = likes.mul(Math.random() ** EN.div(5, qualityFactor.pow(0.5).div(2)));
                release.shares = EN.add(release.shares, shares);
                release.timer--;
            }

            player.tpp.releases[x] = release;
        }
    },

    microtabs: {
        main: {
            "dev": {
                title: "Development",
                content: [
                    ["blank", "10px"],
                    ["microtabs", "dev"]
                ],
            },
        },
        dev: {
            "workstation": {
                title: "Workstation",
                content: [
                    ["blank", "10px"],
                    ["clickable", 0],
                    ["blank", "10px"],
                    ["column", () => !player.tpp.isDev ? [
                        ["row", [["buyable", 100], ["buyable", 101]]],
                        ["raw-html", `
                            You have <h2>${format(player.tpp.buyables[100], 0)}</h2> mastery points
                            (<h2>${format(player.tpp.buyables[100].sub(Object.values(player.tpp.masteries).reduce((a, b) => a + b)), 0)}</h2> unspent).
                        `],
                        ["blank", "10px"],
                    ] : []],
                    ["row", [
                        ["column", () => player.tpp.isDev ? [
                            ["raw-html", "<h3>Logic</h3><hr style='margin-block: 10px'/>"],
                            ["raw-html", "<h3>" + format(player.tpp.dev.loc, 0) + "</h3> lines of code<br/><h5>(" + format(tmp.tpp.effect.qualityMultis[0]) + " quality)</h5>"],
                            ["blank", "5px"],
                            ["clickable", "c1"],
                            ["blank", "5px"],
                            ...player.tpp.masteries.logic >= 4 ? [
                                ["raw-html", "<h3>" + format(player.tpp.dev.bugs, 0) + "</h3> bugs<br/><h5>(/" + format(tmp.tpp.effect.bugDebuff) + " quality)</h5>"],
                                ["blank", "5px"],
                                ["clickable", "c2"],
                                ["blank", "5px"],
                            ] : [],
                        ] : [
                            ["raw-html", "<h3>Logic</h3><hr style='margin-block: 10px'/>"],
                            ["tpp-mastery", "logic"],
                            ["blank", "5px"],
                        ], { width: "400px" }],
                        () => player.tpp.buyables[101].gte(1) ? ["column", (player.tpp.isDev ? [
                            ["raw-html", "<h3>Gameplay</h3><hr style='margin-block: 10px'/>"],
                            ["raw-html", "<h3>" + format(player.tpp.dev.gameplay, 0) + "</h3> gameplay mechanics<br/><h5>(×" + format(tmp.tpp.effect.qualityMultis[1]) + " quality)</h5>"],
                            ["blank", "5px"],
                            ["clickable", "g1"],
                            ["blank", "5px"],
                            ...player.tpp.masteries.gameplay >= 5 ? [
                                ["raw-html", "<h3>" + formatTime(player.tpp.dev.playtime) + "</h3> playtest time<br/><h5>(×" + format(tmp.tpp.effect.playtestBuff) + " quality and gameplay mechanic speed)</h5>"],
                                ["blank", "5px"],
                                ["clickable", "g2"],
                                ["blank", "5px"],
                            ] : [],
                        ] : [
                            ["raw-html", "<h3>Gameplay</h3><hr style='margin-block: 10px'/>"],
                            ["tpp-mastery", "gameplay"],
                            ["blank", "5px"],
                        ]), { width: "400px" }] : [],
                        () => player.tpp.buyables[101].gte(1) ? ["column", (player.tpp.isDev ? [
                            ["raw-html", "<h3>Graphics</h3><hr style='margin-block: 10px'/>"],
                            ["raw-html", "<h3>" + format(player.tpp.dev.graphics[0], 0) + "</h3> pixels<br/><h5>(×" + format(tmp.tpp.effect.qualityMultis[2]) + " quality)</h5>"],
                            ["blank", "5px"],
                            ["clickable", "v1"],
                            ["blank", "5px"],
                            ...player.tpp.masteries.graphics >= 1 ? [
                                ["raw-html", "<h3>" + format(player.tpp.dev.graphics[1], 0) + "</h3> sprites<br/><h5>(×" + format(EN.add(player.tpp.dev.graphics[1], 1)) + " pixel gain)</h5>"],
                                ["blank", "5px"],
                                ["clickable", "v2"],
                                ["blank", "5px"],
                            ] : [],
                            ...player.tpp.masteries.graphics >= 3 ? [
                                ["raw-html", "<h3>" + format(player.tpp.dev.graphics[2], 0) + "</h3> textures<br/><h5>(×" + format(EN.add(player.tpp.dev.graphics[2], 1)) + " sprite gain)</h5>"],
                                ["blank", "5px"],
                                ["clickable", "v3"],
                                ["blank", "5px"],
                            ] : [],
                            ...player.tpp.masteries.graphics >= 6 ? [
                                ["raw-html", "<h3>" + format(player.tpp.dev.graphics[3], 0) + "</h3> sceneries<br/><h5>(×" + format(EN.add(player.tpp.dev.graphics[3], 1)) + " texture gain)</h5>"],
                                ["blank", "5px"],
                                ["clickable", "v4"],
                                ["blank", "5px"],
                            ] : [],
                            ...player.tpp.masteries.graphics >= 10 ? [
                                ["raw-html", "<h3>" + format(player.tpp.dev.graphics[4], 0) + "</h3> visual effects<br/><h5>(×" + format(EN.add(player.tpp.dev.graphics[4], 1)) + " all previous gains)</h5>"],
                                ["blank", "5px"],
                                ["clickable", "v5"],
                                ["blank", "5px"],
                            ] : [],
                        ] : [
                            ["raw-html", "<h3>Graphics</h3><hr style='margin-block: 10px'/>"],
                            ["tpp-mastery", "graphics"],
                            ["blank", "5px"],
                        ]), { width: "400px" }] : [],
                        () => player.tpp.buyables[101].gte(1) ? ["column", (player.tpp.isDev ? [
                            ["raw-html", "<h3>Audio</h3><hr style='margin-block: 10px'/>"],
                            ["raw-html", "<h3>" + format(player.tpp.dev.audios[0], 0) + "</h3> sound effects<br/><h5>(×" + format(tmp.tpp.effect.qualityMultis[3]) + " quality)</h5>"],
                            ["blank", "5px"],
                            ["clickable", "a1"],
                            ["blank", "5px"],
                        ] : [
                            ["raw-html", "<h3>Audio</h3><hr style='margin-block: 10px'/>"],
                            ["tpp-mastery", "audio"],
                            ["blank", "5px"],
                        ]), { width: "400px" }] : [],
                    ]]
                ],
            },
            "dashboard": {
                title: "Dashboard",
                unlocked() { return player.tpp.releases.length > 0 || player.tpp.total.gt(0) },

                content: [
                    ["blank", "10px"],
                    ["raw-html", `<h5>
                        Claiming points from a game with 0 exposure will remove the game from the list.<br/>
                        You can also "force unlist" a game to remove the game regardless of its exposure.
                    </h5>`],
                    ["blank", "10px"],
                    ["raw-html", () => player.tpp.releases.length <= 0 ? `<i>You currently have no games on release</i>` : ""],
                    ["column", () => player.tpp.releases.map((x, i) => ["raw-html", `
                        <div style="text-align: left; width: 500px; margin: 5px; padding: 5px 8px; border: 2px solid var(--color); border-radius: 8px">
                            <h2>${x.name}</h2>
                            <div style="height: 5px"></div>
                            Quality: ${format(x.quality)} | Exposure: ${format(x.exposure * 100, 0)}%<br/>
                            ${format(EN.floor(x.views), 0)} views | ${format(EN.floor(x.likes), 0)} likes | ${format(EN.floor(x.shares), 0)} shares
                            <div style="height: 5px"></div>
                            <button class="upg" style="width: fit-content; min-height: fit-content; font-size: 14px; border-radius: 5px; cursor: pointer" onclick="claimTPPRelease(${i})">
                                Claim ${formatWhole(getTPPPointGain(x))} thepaperpilot points
                            </button>
                            ${x.exposure <= 0 ? `and unlist the game` : `
                                <button class="upg" style="width: fit-content; min-height: fit-content; font-size: 14px; border-radius: 5px; cursor: pointer" onclick="claimTPPRelease(${i}, true)">
                                    Force unlist
                                </button>
                            `}
                        </div>
                    `])]
                ],
            },
        },
    },

    tabFormat: [
        "main-display",
        "prestige-button",
        ["blank", "10px"],
        ["microtabs", "main"],
        ["blank", "20px"],
    ],
})