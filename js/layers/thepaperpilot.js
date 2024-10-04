

"use strict";

function getTPPPointGain(release) {
    if (!release) return 0;
    return EN.floor(release.views).mul(EN.floor(release.likes).add(1)).mul(EN.floor(release.shares).add(1)).add(1).mul(tmp.tpp.effect.tppMulti).sub(release.points)
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
    let noun = [
        "Thing", "Civilization", "Shape", "Noun", "Developer", "Generic", "Point", "Button", "Troll"
    ];
    let noun2 = [
        "Idle", "Shooter", "Simulator", "Battlefield", "Royale", "RPG", "Battle", "Game"
    ];
    return noun[Math.floor(Math.random() * noun.length)] + " " + noun2[Math.floor(Math.random() * noun2.length)];
}

function toggleAutoAction(action) {
    let index = player.tpp.autoActions.indexOf(action)
    if (index >= 0) {
        player.tpp.autoActions.splice(index, 1);
    } else {
        if (EN.lt(Object.keys(player.tpp.autoActions).length, player.tpp.buyables.d))
            player.tpp.autoActions.push(action);
    }
}

let restartUpg = {
    title() {
        return ""
    },
    display() {
        let x = player[this.layer].buyables[this.id]
        let data = tmp[this.layer].buyables[this.id]
        return `<h3>${data.name}</h3>${data.purchaseLimit > 1 ? `\n(${format(x, 0)} / ${format(data.purchaseLimit, 0)})` : ""}
        ${data.description}
        
        ${x.gt(data.purchaseLimit) ? (data.purchaseLimit <= 1 ? "Bought" : "Maxed out") : `Cost: ${format(data.cost, 0)} restart shards`}`
    },
    req: [],
    unlocked() {
        if (this.req.length == 0) return 1;
        if (getBuyableAmount(this.layer, this.id).gt(0)) return 1;
        let best = Infinity;
        for (let a of this.req) {
            if (tmp.tpp.buyables[a].unlocked) best = Math.min(tmp.tpp.buyables[a].unlocked, best);
        }
        return best <= 2 ? best + 1 : false;
    },
    canAfford() {
        for (let a of this.req) if (getBuyableAmount("tpp", a).lte(0)) return ""
        return player.tpp.restart.shards.gte(tmp.tpp.buyables[this.id].cost) 
    },
    buy() {
        player.tpp.restart.shards = player.tpp.restart.shards.sub(this.cost())
        player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
    },
    branches() { 
        let x = player[this.layer].buyables[this.id];
        let data = tmp[this.layer].buyables[this.id];
        let col = x.gte(data.purchaseLimit) ? "#77df5f" : 
            tmp[this.layer].buyables[this.id].canAfford === "" ? "#4e3a3a" : "#9c7575"
        return this.req.map(x => [x, col]) 
    },
    style() {
        return { ...tmtBuyable, filter: tmp[this.layer].buyables[this.id].canAfford === "" ? "brightness(.5)" : "" }
    }
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
            autoActions: [],
            assignMode: "mastery",
            dev: {
                logic: [player?.tpp?.buyables?.d2 || EN(0), EN(0), EN(0), EN(0), EN(0), EN(0)],
                gameplay: [EN(0), EN(0), EN(0), EN(0), EN(0), EN(0)],
                graphics: [EN(0), EN(0), EN(0), EN(0), EN(0), EN(0)],
                audios: [EN(0), EN(0), EN(0), EN(0), EN(0), EN(0)],
                marketing: [EN(0), EN(0), EN(0), EN(0), EN(0), EN(0)],
                cooldowns: {}
            },
            autoTimers: {
                claim: 0,
            },
            restart: {
                points: EN(0),
                pointsUnclaimed: EN(0),
                shards: EN(0),
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
                EN.pow(player.tpp.dev.logic[0], player.tpp.masteries.logic >= 5 ? .5 : .4).div(2),
                EN.pow(player.tpp.dev.gameplay[0], .6).div(4).add(1),
                EN.pow(player.tpp.dev.graphics[0], player.tpp.buyables.l3u.mul(.05).add(.3)).add(1),
                EN.pow(player.tpp.dev.audios[0], player.tpp.buyables.l3d.mul(.05).add(.3)).add(1),
                EN.mul(player.tpp.dev.marketing[1], 10).pow(.1).add(1),
            ],
            quality: EN(1),

            bugDebuff: EN.add(player.tpp.dev.logic[1], 1).pow(0.9),
            refactorBuff: EN.add(player.tpp.dev.logic[2], 1).pow(2),

            playtestBuff: EN.add(player.tpp.dev.gameplay[1], 1).pow(0.15),
            playloopBuff: EN.add(player.tpp.dev.gameplay[2], 1).pow(2),

            startExposure: 1 + player.tpp.dev.marketing[0].add(1).log10().sqrt().mul(.1).min(9).toNumber(),

            tppMulti: EN.pow(5, player.tpp.buyables.start),

            shardGain: EN.pow(2, player.tpp.buyables.r2).mul(player.tpp.restart.points),
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
                if (x.gt(2)) x = x.pow(2).div(2)
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
        102: {
            title() {
                return ""
            },
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>Restart Machine</h3>
                    Gain 1 ???? per second.

                    Cost: ${format(data.cost)} thepaperpilot points
                `
            },
            unlocked() {
                return tmp.tpp.layerShown
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(10000, EN.pow(x, 1.2)).mul(1e25)
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.tpp.points.gte(data.cost)
            },
            buy() {
                player.tpp.points = player.tpp.points.sub(this.cost())
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            effect() {
                let x = player[this.layer].buyables[this.id];
                let eff = EN.pow(2, player.tpp.buyables.r).mul(x);
                return eff;
            },
            style: { ...tmtBuyable }
        },

        // Restart upgrades
        "start": {
            ...restartUpg,
            name: "Re: Start",
            description: "5× thepaperpilot (tpp) point gain.",
            purchaseLimit: 25,
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.add(x, 1).pow(3).max(EN.pow(2, x)).mul(100)
            },
        },
        "u": {
            ...restartUpg,
            name: "Better Platform",
            description: "Increase the chance of a game blowing up in popularity.",
            req: ["start"],
            purchaseLimit: 5,
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(5, x).mul(1000)
            },
        },
        "u2": {
            ...restartUpg,
            name: "Multi-view",
            description: "If the game's exposure is higher than 1, multiply its view gain by its exposure.",
            req: ["u"],
            purchaseLimit: 1,
            cost: () => EN(250000),
        },
        "u3": {
            ...restartUpg,
            name: "Multi-like",
            description: "If the game's exposure is higher than 1, multiply its like gain by its exposure.",
            req: ["u2"],
            purchaseLimit: 1,
            cost: () => EN(10000000),
        },
        "u4": {
            ...restartUpg,
            name: "Multi-share",
            description: "If the game's exposure is higher than 1, multiply its share gain by its exposure.",
            req: ["u3"],
            purchaseLimit: 1,
            cost: () => EN(500000000),
        },
        "d": {
            ...restartUpg,
            name: "Hire Employee",
            description: "Hire a person that'll help you automate one task of your choice.",
            req: ["start"],
            purchaseLimit: 15,
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(2, x.min(10)).mul(EN.pow(3, x.sub(10).max(0))).mul(100)
            },
        },
        "d2": {
            ...restartUpg,
            name: "Use Templates",
            description: "Start each game with 1 extra line of code.",
            req: ["d"],
            purchaseLimit: 5,
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(3, x).mul(15000)
            },
        },
        "d3": {
            ...restartUpg,
            name: "Hire Manager",
            description: "Hire a manager to automatically claim the first game on the game list every 30 seconds.",
            req: ["d2"],
            purchaseLimit: 1,
            cost: () => EN(150000),
        },
        "d3l": {
            ...restartUpg,
            name: "Co-Managers",
            description: "Hire more managers to claim more games at once.",
            req: ["d3"],
            purchaseLimit: 5,
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(5, x).mul(450000)
            },
        },
        "d3r": {
            ...restartUpg,
            name: "Manager Pills",
            description: "Decrease the auto-claim interval by 1 second.",
            req: ["d3"],
            purchaseLimit: 25,
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.add(1, x).pow(2).mul(100000)
            },
        },
        "l": {
            ...restartUpg,
            name: "Passive Income",
            description: "Gain 1% times exposure of a game's claimed tpp points per second.",
            req: ["start"],
            purchaseLimit: 10,
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.add(x, 1).pow(3).mul(10000)
            },
        },
        "l2": {
            ...restartUpg,
            name: "Coffee",
            description: "Increase all action speeds by +10%.",
            req: ["l"],
            purchaseLimit: 10,
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(3, x).mul(25000)
            },
        },
        "l2u": {
            ...restartUpg,
            name: "Better Graphic Cards",
            description: "Multiply all Graphics action speeds by 1.1×.",
            req: ["l2"],
            purchaseLimit: 10,
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(3, x).mul(250000)
            },
        },
        "l3u": {
            ...restartUpg,
            name: "Better Graphic Animation",
            description: "Increase pixels' quality exponent by +0.05.",
            req: ["l2u"],
            purchaseLimit: 5,
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(5, x).mul(400000)
            },
        },
        "l2d": {
            ...restartUpg,
            name: "Better Sound System",
            description: "Multiply all Audio action speeds by 1.1×.",
            req: ["l2"],
            purchaseLimit: 10,
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(3, x).mul(250000)
            },
        },
        "l3d": {
            ...restartUpg,
            name: "Master Sound System",
            description: "Increase sound effects' quality exponent by +0.05.",
            req: ["l2d"],
            purchaseLimit: 5,
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(5, x).mul(400000)
            },
        },
        "r": {
            ...restartUpg,
            name: "Re: Re: Start",
            description: "Double restart point gain.",
            req: ["start"],
            purchaseLimit: 10,
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(25, x).mul(1000)
            },
        },
        "r2": {
            ...restartUpg,
            name: "Re:^3 Start",
            description: "Double restart shard gain.",
            req: ["r"],
            purchaseLimit: 10,
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(50, x).mul(10000)
            },
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
                return player.tpp.isDev ? tmp.tpp.effect.quality?.gte(1) : true
            },
            onClick() {
                if (player.tpp.isDev) {
                    player.tpp.releases.push({
                        name: generateGameName(),
                        quality: tmp.tpp.effect.quality, 
                        exposure: tmp.tpp.effect.startExposure,
                        timer: 0,
                        views: EN(0),
                        likes: EN(0),
                        shares: EN(0),
                        points: EN(0),
                    });
                    player.tpp.dev = layers.tpp.startData().dev
                } else {
                    for (let a = 0; a < player.tpp.autoActions.length; a) {
                        let act = player.tpp.autoActions[a];
                        let req = tmp.tpp.clickables[act].masteryReq;
                        if (player.tpp.masteries[req[0]] < req[1]) player.tpp.autoActions.splice(a, 1);
                        else a++;
                    }
                }
                player.tpp.isDev = !player.tpp.isDev;
            },
            onHold() {
            },
            style: { ...smallClickable }
        },
        1: {
            display() {
                return "Select assign mode\nCurrent mode: " + {
                    mastery: "Mastery",
                    employee: "Employee"
                }[player.tpp.assignMode]
            },
            cooldown: 10,
            unlocked() {
                return player.tpp.buyables.d.gte(1)
            },
            canClick() {
                return true;
            },
            onClick() {
                let list = ["mastery", "employee"];
                player.tpp.assignMode = list[(list.indexOf(player.tpp.assignMode) + 1) % list.length];

                for (let a = 0; a < player.tpp.autoActions.length; a) {
                    let act = player.tpp.autoActions[a];
                    let req = tmp.tpp.clickables[act].masteryReq;
                    if (player.tpp.masteries[req[0]] < req[1]) player.tpp.autoActions.splice(a, 1);
                    else a++;
                }
            },
            onHold() {
            },
            style: { ...tmtBuyable }
        },
        "c1": {
            display() {
                let auto = player.tpp.autoActions.includes(this.id);
                return "Write some code<br/>(" + (player.tpp.isDev ? (auto ? "AUTO ON" : formatTime(player.tpp.dev.cooldowns[this.id] || run(this.cooldown))) : (auto ? "ON" : "OFF")) + ")"
            },
            masteryReq: ["logic", 0],
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
                if (player.tpp.masteries.gameplay >= 2) mul = mul.mul(tmp.tpp.effect.qualityMultis?.[1].min(1000) || 1);
                if (player.tpp.masteries.logic >= 18) mul = mul.mul(tmp.tpp.effect.refactorBuff);
                return mul;
            },
            onClick() {
                if (!player.tpp.isDev) {
                    toggleAutoAction(this.id);
                    return;
                }
                player.tpp.dev.logic[0] = EN.add(player.tpp.dev.logic[0], tmp.tpp.clickables[this.id].multiplier);
                player.tpp.dev.cooldowns[this.id] = run(this.cooldown);
            },
            onCooldown(delta) {
                if (player.tpp.masteries.logic < 1) return;

                let speed = EN(0.5).mul(tmp.tpp.clickables[this.id].multiplier);
                if (player.tpp.masteries.logic >= 2) speed = EN.pow(1.2, player.tpp.masteries.logic).mul(speed);

                player.tpp.dev.logic[0] = EN.add(player.tpp.dev.logic[0], EN.mul(delta, speed));
                if (player.tpp.masteries.logic >= 4) player.tpp.dev.logic[1] = EN.add(player.tpp.dev.logic[1], EN.mul(delta, speed.sqrt().div(100)));
            },
            onHold() {
            },
            style: { ...smallClickable }
        },
        "c2": {
            display() {
                let auto = player.tpp.autoActions.includes(this.id);
                return "Squash some bugs<br/>(" + (player.tpp.isDev ? (auto ? "AUTO ON" : formatTime(player.tpp.dev.cooldowns[this.id] || run(this.cooldown))) : (auto ? "ON" : "OFF")) + ")"
            },
            masteryReq: ["logic", 4],
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
                if (player.tpp.masteries.logic >= 18) mul = mul.pow(tmp.tpp.effect.refactorBuff);
                if (player.tpp.masteries.gameplay >= 15) mul = mul.mul(tmp.tpp.effect.playloopBuff);
                return mul;
            },
            onClick() {
                if (!player.tpp.isDev) {
                    toggleAutoAction(this.id);
                    return;
                }
                player.tpp.dev.logic[1] = EN.sub(player.tpp.dev.logic[1], tmp.tpp.clickables[this.id].multiplier).max(0);
                player.tpp.dev.cooldowns[this.id] = run(this.cooldown);
            },
            onCooldown(delta) {
                if (player.tpp.masteries.logic < 6) return;

                let speed = EN(0.1).mul(tmp.tpp.clickables[this.id].speed);
                if (player.tpp.masteries.logic >= 12) speed = EN.mul(1.05, player.tpp.masteries.logic).mul(speed);

                player.tpp.dev.logic[1] = EN.sub(player.tpp.dev.logic[1], EN.mul(delta, speed)).max(0);
            },
            onHold() {
            },
            style: { ...smallClickable }
        },
        "c3": {
            display() {
                let auto = player.tpp.autoActions.includes(this.id);
                return "Refactor some code<br/>(" + (player.tpp.isDev ? "Requires " + format(tmp.tpp.clickables.c3.requirement) + " lines of code" : (auto ? "ON" : "OFF")) + ")"
            },
            masteryReq: ["logic", 18],
            unlocked() {
                return true
            },
            requirement() {
                return EN.pow(10, player.tpp.dev.logic[2]).mul(10000)
            },
            canClick() {
                return !player.tpp.isDev || EN.gt(player.tpp.dev.logic[0], tmp.tpp.clickables.c3.requirement)
            },
            multiplier() {
                let mul = EN(1);
                return mul;
            },
            onClick() {
                if (!player.tpp.isDev) {
                    toggleAutoAction(this.id);
                    return;
                }
                if (!tmp.tpp.clickables[this.id].canClick) return;
                player.tpp.dev.logic[0] = player.tpp.dev.logic[1] = EN(0);
                player.tpp.dev.logic[2] = EN.add(player.tpp.dev.logic[2], tmp.tpp.clickables[this.id].multiplier);
            },
            onHold() {
            },
            style: { ...smallClickable }
        },
        "g1": {
            display() {
                let auto = player.tpp.autoActions.includes(this.id);
                return "Make some gameplay<br/>(" + (player.tpp.isDev ? (auto ? "AUTO ON" : formatTime(player.tpp.dev.cooldowns[this.id] || run(this.cooldown))) : (auto ? "ON" : "OFF")) + ")"
            },
            masteryReq: ["gameplay", 0],
            cooldown: 12,
            unlocked() {
                return true
            },
            canClick() {
                return !player.tpp.dev.cooldowns[this.id]
            },
            onClick() {
                if (!player.tpp.isDev) {
                    toggleAutoAction(this.id);
                    return;
                }
                player.tpp.dev.cooldowns[this.id] = run(this.cooldown);
            },
            onCooldown(delta) {
                let speed = EN(1);
                if (player.tpp.masteries.gameplay >= 2) speed = EN.pow(1.1, player.tpp.masteries.gameplay).mul(speed);
                if (player.tpp.masteries.gameplay >= 5) speed = speed.mul(tmp.tpp.effect.playtestBuff);
                if (player.tpp.masteries.gameplay >= 8) speed = speed.mul(tmp.tpp.effect.qualityMultis?.[0].max(1).min(1000) || 1);
                if (player.tpp.masteries.logic >= 18) speed = speed.mul(tmp.tpp.effect.refactorBuff);
                if (player.tpp.masteries.gameplay >= 15) speed = speed.mul(tmp.tpp.effect.playloopBuff);

                let gain = EN.min(player.tpp.dev.logic[0], EN.mul(delta, speed));
                player.tpp.dev.gameplay[0] = EN.add(player.tpp.dev.gameplay[0], gain);
                player.tpp.dev.logic[0] = EN.sub(player.tpp.dev.logic[0], gain);
            },
            onHold() {
            },
            style: { ...smallClickable }
        },
        "g2": {
            display() {
                let auto = player.tpp.autoActions.includes(this.id);
                return "Do some playtesting<br/>(" + (player.tpp.isDev ? (auto ? "AUTO ON" : formatTime(player.tpp.dev.cooldowns[this.id] || run(this.cooldown))) : (auto ? "ON" : "OFF")) + ")"
            },
            masteryReq: ["gameplay", 5],
            cooldown: 30,
            unlocked() {
                return true
            },
            canClick() {
                return !player.tpp.dev.cooldowns[this.id]
            },
            speed() {
                let speed = EN(1);
                if (player.tpp.masteries.gameplay >= 15) speed = speed.mul(tmp.tpp.effect.playloopBuff);
                return speed;
            },
            onClick() {
                if (!player.tpp.isDev) {
                    toggleAutoAction(this.id);
                    return;
                }
                player.tpp.dev.cooldowns[this.id] = run(this.cooldown);
            },
            onCooldown(delta) {
                let speed = tmp.tpp.clickables[this.id].speed;

                let gain = EN.mul(delta, speed);
                player.tpp.dev.gameplay[1] = EN.add(player.tpp.dev.gameplay[1], gain);
            },
            onHold() {
            },
            style: { ...smallClickable }
        },
        "g3": {
            display() {
                let auto = player.tpp.autoActions.includes(this.id);
                return "Make some gameplay loop<br/>(" + (player.tpp.isDev ? "Requires " + format(tmp.tpp.clickables.g3.requirement) + " gameplay mechanics" : (auto ? "ON" : "OFF")) + ")"
            },
            masteryReq: ["gameplay", 15],
            unlocked() {
                return true
            },
            requirement() {
                return EN.pow(10, player.tpp.dev.gameplay[2]).mul(10000)
            },
            canClick() {
                return !player.tpp.isDev || EN.gt(player.tpp.dev.gameplay[0], tmp.tpp.clickables.g3.requirement)
            },
            multiplier() {
                let mul = EN(1);
                return mul;
            },
            onClick() {
                if (!player.tpp.isDev) {
                    toggleAutoAction(this.id);
                    return;
                }
                if (!tmp.tpp.clickables[this.id].canClick) return;
                player.tpp.dev.gameplay[0] = player.tpp.dev.gameplay[1] = EN(0);
                player.tpp.dev.gameplay[2] = EN.add(player.tpp.dev.gameplay[2], tmp.tpp.clickables[this.id].multiplier);
            },
            onHold() {
            },
            style: { ...smallClickable }
        },
        "v1": {
            display() {
                let auto = player.tpp.autoActions.includes(this.id);
                return "Draw some pixels<br/>(" + (player.tpp.isDev ? (auto ? "AUTO ON" : formatTime(player.tpp.dev.cooldowns[this.id] || run(this.cooldown))) : (auto ? "ON" : "OFF")) + ")"
            },
            masteryReq: ["graphics", 0],
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
                if (!player.tpp.isDev) {
                    toggleAutoAction(this.id);
                    return;
                }
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
                let auto = player.tpp.autoActions.includes(this.id);
                return "Draw some sprites<br/>(" + (player.tpp.isDev ? (auto ? "AUTO ON" : formatTime(player.tpp.dev.cooldowns[this.id] || run(this.cooldown))) : (auto ? "ON" : "OFF")) + ")"
            },
            masteryReq: ["graphics", 1],
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
                if (!player.tpp.isDev) {
                    toggleAutoAction(this.id);
                    return;
                }
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
                let auto = player.tpp.autoActions.includes(this.id);
                return "Draw some textures<br/>(" + (player.tpp.isDev ? (auto ? "AUTO ON" : formatTime(player.tpp.dev.cooldowns[this.id] || run(this.cooldown))) : (auto ? "ON" : "OFF")) + ")"
            },
            masteryReq: ["graphics", 3],
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
                if (!player.tpp.isDev) {
                    toggleAutoAction(this.id);
                    return;
                }
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
                let auto = player.tpp.autoActions.includes(this.id);
                return "Draw some sceneries<br/>(" + (player.tpp.isDev ? (auto ? "AUTO ON" : formatTime(player.tpp.dev.cooldowns[this.id] || run(this.cooldown))) : (auto ? "ON" : "OFF")) + ")"
            },
            masteryReq: ["graphics", 6],
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
                if (!player.tpp.isDev) {
                    toggleAutoAction(this.id);
                    return;
                }
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
                let auto = player.tpp.autoActions.includes(this.id);
                return "Implement some VFXs<br/>(" + (player.tpp.isDev ? (auto ? "AUTO ON" : formatTime(player.tpp.dev.cooldowns[this.id] || run(this.cooldown))) : (auto ? "ON" : "OFF")) + ")"
            },
            masteryReq: ["graphics", 10],
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
                if (!player.tpp.isDev) {
                    toggleAutoAction(this.id);
                    return;
                }
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
                let auto = player.tpp.autoActions.includes(this.id);
                return "Design some FXs<br/>(" + (player.tpp.isDev ? (auto ? "AUTO ON" : formatTime(player.tpp.dev.cooldowns[this.id] || run(this.cooldown))) : (auto ? "ON" : "OFF")) + ")"
            },
            masteryReq: ["audio", 0],
            cooldown: 5,
            unlocked() {
                return true
            },
            canClick() {
                return !player.tpp.dev.cooldowns[this.id]
            },
            multiplier() {
                let mul = EN.mul(player.tpp.dev.audios[1], 0.1).add(1);
                return mul;
            },
            onClick() {
                if (!player.tpp.isDev) {
                    toggleAutoAction(this.id);
                    return;
                }
                let gain = tmp.tpp.clickables[this.id].multiplier;

                player.tpp.dev.audios[0] = EN.add(player.tpp.dev.audios[0], gain);
                player.tpp.dev.cooldowns[this.id] = run(this.cooldown);
            },
            onHold() {
            },
            style: { ...smallClickable }
        },
        "a2": {
            display() {
                let auto = player.tpp.autoActions.includes(this.id);
                return "Design some ambient sounds<br/>(" + (player.tpp.isDev ? (auto ? "AUTO ON" : formatTime(player.tpp.dev.cooldowns[this.id] || run(this.cooldown))) : (auto ? "ON" : "OFF")) + ")"
            },
            masteryReq: ["audio", 2],
            cooldown: 4,
            unlocked() {
                return true
            },
            canClick() {
                return !player.tpp.dev.cooldowns[this.id]
            },
            multiplier() {
                let mul = EN.mul(player.tpp.dev.audios[2], 0.1).add(1);
                return mul;
            },
            onClick() {
                if (!player.tpp.isDev) {
                    toggleAutoAction(this.id);
                    return;
                }
                let gain = tmp.tpp.clickables[this.id].multiplier;

                player.tpp.dev.audios[1] = EN.add(player.tpp.dev.audios[1], gain);
                player.tpp.dev.cooldowns[this.id] = run(this.cooldown);
            },
            onHold() {
            },
            style: { ...smallClickable }
        },
        "a3": {
            display() {
                let auto = player.tpp.autoActions.includes(this.id);
                return "Compose some soundtrack<br/>(" + (player.tpp.isDev ? (auto ? "AUTO ON" : formatTime(player.tpp.dev.cooldowns[this.id] || run(this.cooldown))) : (auto ? "ON" : "OFF")) + ")"
            },
            masteryReq: ["audio", 5],
            cooldown: 3,
            unlocked() {
                return true
            },
            canClick() {
                return !player.tpp.dev.cooldowns[this.id]
            },
            multiplier() {
                let mul = EN.mul(player.tpp.dev.audios[3], 0.1).add(1);
                return mul;
            },
            onClick() {
                if (!player.tpp.isDev) {
                    toggleAutoAction(this.id);
                    return;
                }
                let gain = tmp.tpp.clickables[this.id].multiplier;

                player.tpp.dev.audios[2] = EN.add(player.tpp.dev.audios[2], gain);
                player.tpp.dev.cooldowns[this.id] = run(this.cooldown);
            },
            onHold() {
            },
            style: { ...smallClickable }
        },
        "a4": {
            display() {
                let auto = player.tpp.autoActions.includes(this.id);
                return "Compose some albums<br/>(" + (player.tpp.isDev ? (auto ? "AUTO ON" : formatTime(player.tpp.dev.cooldowns[this.id] || run(this.cooldown))) : (auto ? "ON" : "OFF")) + ")"
            },
            cooldown: 2,
            masteryReq: ["audio", 10],
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
                if (!player.tpp.isDev) {
                    toggleAutoAction(this.id);
                    return;
                }
                let gain = tmp.tpp.clickables[this.id].multiplier;

                player.tpp.dev.audios[3] = EN.add(player.tpp.dev.audios[3], gain);
                player.tpp.dev.cooldowns[this.id] = run(this.cooldown);
            },
            onHold() {
            },
            style: { ...smallClickable }
        },
        "m1": {
            display() {
                let auto = player.tpp.autoActions.includes(this.id);
                return "Do some advertising<br/>(" + (player.tpp.isDev ? (auto ? "AUTO ON" : formatTime(player.tpp.dev.cooldowns[this.id] || run(this.cooldown))) : (auto ? "ON" : "OFF")) + ")"
            },
            cooldown: 5,
            masteryReq: ["marketing", 0],
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
                if (!player.tpp.isDev) {
                    toggleAutoAction(this.id);
                    return;
                }
                let gain = tmp.tpp.clickables[this.id].multiplier;

                player.tpp.dev.marketing[0] = EN.add(player.tpp.dev.marketing[0], gain);
                player.tpp.dev.cooldowns[this.id] = run(this.cooldown);
            },
            onHold() {
            },
            style: { ...smallClickable }
        },
        "m2": {
            display() {
                let auto = player.tpp.autoActions.includes(this.id);
                return "Do some harder advertising<br/>(" + (player.tpp.isDev ? (auto ? "AUTO ON" : formatTime(player.tpp.dev.cooldowns[this.id] || run(this.cooldown))) : (auto ? "ON" : "OFF")) + ")"
            },
            cooldown: 10,
            masteryReq: ["marketing", 1],
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
                if (!player.tpp.isDev) {
                    toggleAutoAction(this.id);
                    return;
                }
                let gain = tmp.tpp.clickables[this.id].multiplier;

                player.tpp.dev.marketing[1] = EN.add(player.tpp.dev.marketing[1], gain);
                player.tpp.dev.cooldowns[this.id] = run(this.cooldown);
            },
            onHold() {
            },
            style: { ...smallClickable }
        },
        100: {
            display() {
                return "Restart and claim " + format(player.tpp.restart.pointsUnclaimed, 0) + (tmp.tpp.clickables[this.id].canClick ? "" : " / 100") + " restart points";
            },
            cooldown: 10,
            unlocked() {
                return true
            },
            canClick() {
                return player.tpp.restart.pointsUnclaimed.gte(100)
            },
            onClick() {
                if (confirm("Do you want to restart and claim restart points? All thepaperpilot progress below this point will be lost!")) {
                    let startData = layers.tpp.startData();
                    
                    player.tpp.points = EN(0);
                    
                    player.tpp.isDev = false;
                    player.tpp.dev = startData.dev;
                    player.tpp.masteries = startData.masteries;
                    player.tpp.releases = [];
                    player.tpp.autoActions = [];

                    for (let a = 100; a <= 102; a++) player.tpp.buyables[a] = EN(0);

                    player.tpp.restart.points = player.tpp.restart.points.add(player.tpp.restart.pointsUnclaimed);
                    player.tpp.restart.pointsUnclaimed = EN(0);
                }
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
            18: "Unlock refactors.",
        },
        gameplay: {
            0: "Unlock gameplay mechanics.",
            2: "Multiply lines of code gained by gameplay's quality multipler (max 1,000).",
            3: "Multiply gameplay mechanics per second by 1.1 per gameplay mastery allocated.",
            5: "Unlock play testing.",
            8: "Multiply gameplay mechanic speed by logic's quality multipler (max 1,000).",
            15: "Unlock gameplay loops.",
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
            2: "Unlock ambient sounds.",
            5: "Unlock soundtracks.",
            10: "Unlock albums.",
        },
        marketing: {
            0: "Unlock visibility.",
            1: "Unlock publicity.",
        }
    },
    
    bars: {
        claimBar: {
            direction: RIGHT,
            width: 400,
            height: 18,
            unlocked() { return player.tpp.buyables.d3.gt(0) },
            progress() { return player.tpp.autoTimers.claim },
            display() { 
                let dur = 30 - player.tpp.buyables.d3r.toNumber();
                return "<span>Auto-claiming first " + format(player.tpp.buyables.d3l.add(1), 0) + " games in " + formatTime((1 - player.tpp.autoTimers.claim) * dur) + "</span>";
            },
            borderStyle: { "margin-top": "10px" },
            fillStyle: { "background": "#59bd77" },
            baseStyle: { "background": "#3a704b" },
            textStyle: { color: "black", "font-size": "13px" },
        },
    },
    
    update(delta) {
        if (tmp[this.layer].deactivated) return

        let speed = delta * (1 + player.tpp.buyables.l2.toNumber() * .1);
        for (let x in player.tpp.dev.cooldowns) if (player.tpp.dev.cooldowns[x] > 0) {
            let spd = speed;
            if (x.startsWith("v")) spd = spd * 1.1 ** player.tpp.buyables.l2u.toNumber();
            if (x.startsWith("a")) spd = spd * 1.1 ** player.tpp.buyables.l2d.toNumber();
            layers.tpp.clickables[x].onCooldown?.(Math.min(spd, player.tpp.dev.cooldowns[x]));
            player.tpp.dev.cooldowns[x] -= spd;
            if (player.tpp.dev.cooldowns[x] <= 0) player.tpp.dev.cooldowns[x] = 0;
        }

        if (player.tpp.isDev) {
            for (let act of player.tpp.autoActions) {
                if ((player.tpp.dev.cooldowns[act] || 0) <= 0) layers.tpp.clickables[act].onClick();
            }
            for (let x = 1; x < player.tpp.dev.marketing; x++) {
                player.tpp.dev.marketing[x - 1] = player.tpp.dev.marketing[x - 1].add(player.tpp.dev.marketing[x].div(60).mul(delta));
            }
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
                let views = EN.pow(Math.min(EN.pow(Math.random(), player.tpp.buyables.u.mul(.1).add(1)).rec(), 1000), qualityFactor.add(exposureFactor).mul(0.25)).div(10).mul(qualityFactor);
                if (player.tpp.buyables.u2.lt(0)) views = views.mul(Math.max(release.exposure, 1));
                release.views = EN.add(release.views, views);
                let likes = views.mul(Math.random() ** EN.div(5, qualityFactor));
                if (player.tpp.buyables.u3.lt(0)) views = views.mul(Math.max(release.exposure, 1));
                release.likes = EN.add(release.likes, likes);
                let shares = likes.mul(Math.random() ** EN.div(5, qualityFactor.pow(0.5).div(2)));
                if (player.tpp.buyables.u4.lt(0)) views = views.mul(Math.max(release.exposure, 1));
                release.shares = EN.add(release.shares, shares);
                release.timer--;
            }

            player.tpp.points = player.tpp.points.add(player.tpp.buyables.l.mul(release.points).mul(release.exposure).mul(delta).div(100))

            player.tpp.releases[x] = release;
        }

        if (player.tpp.buyables[102].gt(0)) {
            player.tpp.restart.pointsUnclaimed = player.tpp.restart.pointsUnclaimed.add(EN.mul(tmp.tpp.buyables[102].effect, delta));
        }

        player.tpp.restart.shards = player.tpp.restart.shards.add(EN.mul(tmp.tpp.effect.shardGain, delta).div(60));

        if (player.tpp.buyables.d3.gt(0) && player.tpp.releases.length > 0) {
            player.tpp.autoTimers.claim += delta / (30 - player.tpp.buyables.d3r.toNumber());
            if (player.tpp.autoTimers.claim >= 1) {
                let count = Math.min(player.tpp.buyables.d3l.toNumber() + 1, player.tpp.releases.length);
                for (let x = 0; x < count; x++) claimTPPRelease(x);
                player.tpp.autoTimers.claim = player.tpp.autoTimers.claim % 1;
            }
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
                        ["row", [["clickable", 1], ["buyable", 100], ["buyable", 101], ["buyable", 102]]],
                        ["raw-html", player.tpp.assignMode == 'employee' ? `
                            You have <h2>${format(player.tpp.buyables.d, 0)}</h2> employees
                            (<h2>${format(player.tpp.buyables.d.sub(player.tpp.autoActions.length), 0)}</h2> unassigned).
                        ` : `
                            You have <h2>${format(player.tpp.buyables[100], 0)}</h2> mastery points
                            (<h2>${format(player.tpp.buyables[100].sub(Object.values(player.tpp.masteries).reduce((a, b) => a + b)), 0)}</h2> unspent).
                        `],
                        ["blank", "10px"],
                    ] : []],
                    ["row", [
                        ["column", () => (player.tpp.isDev || player.tpp.assignMode == "employee") ? [
                            ["raw-html", "<h3>Logic</h3><hr style='margin-block: 10px'/>"],
                            ["raw-html", "<h3>" + format(player.tpp.dev.logic[0], 0) + "</h3> lines of code<br/><h5>(" + format(tmp.tpp.effect.qualityMultis?.[0]) + " quality)</h5>"],
                            ["blank", "5px"],
                            ["clickable", "c1"],
                            ["blank", "5px"],
                            ...player.tpp.masteries.logic >= 4 ? [
                                ["raw-html", "<h3>" + format(player.tpp.dev.logic[1], 0) + "</h3> bugs<br/><h5>(/" + format(tmp.tpp.effect.bugDebuff) + " quality)</h5>"],
                                ["blank", "5px"],
                                ["clickable", "c2"],
                                ["blank", "5px"],
                            ] : [],
                            ...player.tpp.masteries.logic >= 18 ? [
                                ["raw-html", "<h3>" + format(player.tpp.dev.logic[2], 0) + "</h3> refactors<br/><h5>(×" + format(tmp.tpp.effect.refactorBuff) + " code, gameplay, and bug fixing speed)</h5>"],
                                ["blank", "5px"],
                                ["clickable", "c3"],
                                ["blank", "5px"],
                            ] : [],
                        ] : [
                            ["raw-html", "<h3>Logic</h3><hr style='margin-block: 10px'/>"],
                            ["tpp-mastery", "logic"],
                            ["blank", "5px"],
                        ], { width: "400px" }],
                        () => player.tpp.buyables[101].gte(1) ? ["column", ((player.tpp.isDev || player.tpp.assignMode == "employee") ? [
                            ["raw-html", "<h3>Gameplay</h3><hr style='margin-block: 10px'/>"],
                            ["raw-html", "<h3>" + format(player.tpp.dev.gameplay[0], 0) + "</h3> gameplay mechanics<br/><h5>(×" + format(tmp.tpp.effect.qualityMultis?.[1]) + " quality)</h5>"],
                            ["blank", "5px"],
                            ["clickable", "g1"],
                            ["blank", "5px"],
                            ...player.tpp.masteries.gameplay >= 5 ? [
                                ["raw-html", "<h3>" + formatTime(player.tpp.dev.gameplay[1]) + "</h3> playtest time<br/><h5>(×" + format(tmp.tpp.effect.playtestBuff) + " quality and gameplay mechanic speed)</h5>"],
                                ["blank", "5px"],
                                ["clickable", "g2"],
                                ["blank", "5px"],
                            ] : [],
                            ...player.tpp.masteries.gameplay >= 15 ? [
                                ["raw-html", "<h3>" + format(player.tpp.dev.gameplay[2], 0) + "</h3> gameplay loops<br/><h5>(×" + format(tmp.tpp.effect.playloopBuff) + " gameplay, test and bug fixing speed)</h5>"],
                                ["blank", "5px"],
                                ["clickable", "g3"],
                                ["blank", "5px"],
                            ] : [],
                        ] : [
                            ["raw-html", "<h3>Gameplay</h3><hr style='margin-block: 10px'/>"],
                            ["tpp-mastery", "gameplay"],
                            ["blank", "5px"],
                        ]), { width: "400px" }] : [],
                        () => player.tpp.buyables[101].gte(2) ? ["column", ((player.tpp.isDev || player.tpp.assignMode == "employee") ? [
                            ["raw-html", "<h3>Graphics</h3><hr style='margin-block: 10px'/>"],
                            ["raw-html", "<h3>" + format(player.tpp.dev.graphics[0], 0) + "</h3> pixels<br/><h5>(×" + format(tmp.tpp.effect.qualityMultis?.[2]) + " quality)</h5>"],
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
                        () => player.tpp.buyables[101].gte(3) ? ["column", ((player.tpp.isDev || player.tpp.assignMode == "employee") ? [
                            ["raw-html", "<h3>Audio</h3><hr style='margin-block: 10px'/>"],
                            ["raw-html", "<h3>" + format(player.tpp.dev.audios[0], 0) + "</h3> sound effects<br/><h5>(×" + format(tmp.tpp.effect.qualityMultis?.[3]) + " quality)</h5>"],
                            ["blank", "5px"],
                            ["clickable", "a1"],
                            ["blank", "5px"],
                            ...player.tpp.masteries.audio >= 2 ? [
                                ["raw-html", "<h3>" + format(player.tpp.dev.audios[1], 0) + "</h3> ambient sounds<br/><h5>(×" + format(EN.mul(player.tpp.dev.audios[1], .1).add(1)) + " sound effect gain)</h5>"],
                                ["blank", "5px"],
                                ["clickable", "a2"],
                                ["blank", "5px"],
                            ] : [],
                            ...player.tpp.masteries.audio >= 5 ? [
                                ["raw-html", "<h3>" + format(player.tpp.dev.audios[2], 0) + "</h3> soundtracks<br/><h5>(×" + format(EN.mul(player.tpp.dev.audios[2], .1).add(1)) + " ambient sound gain)</h5>"],
                                ["blank", "5px"],
                                ["clickable", "a3"],
                                ["blank", "5px"],
                            ] : [],
                            ...player.tpp.masteries.audio >= 10 ? [
                                ["raw-html", "<h3>" + format(player.tpp.dev.audios[3], 0) + "</h3> albums<br/><h5>(×" + format(EN.mul(player.tpp.dev.audios[3], .1).add(1)) + " soundtrack gain)</h5>"],
                                ["blank", "5px"],
                                ["clickable", "a4"],
                                ["blank", "5px"],
                            ] : [],
                        ] : [
                            ["raw-html", "<h3>Audio</h3><hr style='margin-block: 10px'/>"],
                            ["tpp-mastery", "audio"],
                            ["blank", "5px"],
                        ]), { width: "400px" }] : [],
                        () => player.tpp.buyables[101].gte(4) ? ["column", ((player.tpp.isDev || player.tpp.assignMode == "employee") ? [
                            ["raw-html", "<h3>Marketing</h3><hr style='margin-block: 10px'/>"],
                            ["raw-html", "<h3>" + format(player.tpp.dev.marketing[0], 0) + "</h3> visibility<br/><h5>(" + format(tmp.tpp.effect.startExposure * 100) + "% starting exposure)</h5>"],
                            ["blank", "5px"],
                            ["clickable", "m1"],
                            ["blank", "5px"],
                            ...player.tpp.masteries.marketing >= 1 ? [
                                ["raw-html", "<h3>" + format(player.tpp.dev.marketing[1], 0) + "</h3> publicity<br/><h5>(×" + format(tmp.tpp.effect.qualityMultis?.[4]) + " quality, " + format(player.tpp.dev.marketing[1], 0) + " visibility/min)</h5>"],
                                ["blank", "5px"],
                                ["clickable", "m2"],
                                ["blank", "5px"],
                            ] : [],
                        ] : [
                            ["raw-html", "<h3>Marketing</h3><hr style='margin-block: 10px'/>"],
                            ["tpp-mastery", "marketing"],
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
                    ["bar", "claimBar"],
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
            "restart": {
                title: "Restart",
                unlocked() { return player.tpp.buyables[102].gt(0) || player.tpp.restart.points.gt(0) || player.tpp.buyables.start.gt(0) },

                content: [
                    ["blank", "10px"],
                    ["raw-html", () => `
                        You have <h2>${format(player.tpp.buyables[102], 0)}</h2> restart machines, which generate ${format(tmp.tpp.buyables[102].effect)} restart points per second.<br/>
                        You have <h2>${format(player.tpp.restart.points, 0)}</h2> restart points, which generate ${format(tmp.tpp.effect.shardGain, 0)} restart shards per minute.<br/>
                        You have <h2>${format(player.tpp.restart.shards, 0)}</h2> restart shards, which can be used to buy upgrades below.
                    `],
                    ["blank", "10px"],
                    ["clickable", 100],
                    ["blank", "10px"],
                    ["restart-tree", {
                          "0:0":   "start",
                          "0:-1":  "u",
                          "0:-2":  "u2",
                          "0:-3":  "u3",
                          "0:-4":  "u4",
                          "0:1":   "d",
                          "0:2":   "d2",
                          "0:3":   "d3",
                         "-1:3":   "d3l",
                          "1:3":   "d3r",
                         "-1:0":   "l",
                         "-2:0":   "l2",
                         "-2:-1":  "l2u",
                         "-3:-1":  "l3u",
                         "-2:1":   "l2d",
                         "-3:1":   "l3d",
                          "1:0":   "r",
                          "2:0":   "r2",
                    }],
                ]
            }
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