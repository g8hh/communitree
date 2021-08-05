"use strict";

let smallBuyable = {
    width: '125px',
    height: '125px',
    'min-height': '125px',
    'font-size': '10px',
}

let despacitBuyable = {
    title() {
        return ""
    }, 
    canAfford() {
        let data = tmp[this.layer].buyables[this.id]
        return player.des.points.gte(data.cost)
    }, 
    buy() { 
        let data = tmp[this.layer].buyables[this.id]
        if (player.des.points.lt(data.cost)) return;
        player.des.points = player.des.points.sub(data.cost)
        player.des.buyables[this.id] = player.des.buyables[this.id].add(1)
        player.des.mods = player.des.mods.add(1)
    },
    style() { 
        return { ...smallBuyable }
    }
}

const typeNames = {
    normal: "Normal",
    multi: "Multiplier",
    accel: "Accelerator",
    sine: "Sinusoidal",
    desp: "Despacit",
    spawn: "Spawner",
    golden: "Golden",
    rank: "Ranker",
    metal: "Metallic",
    flame: "Flame",
    recur: "Recursion",
    power: "Battery",
    life: "Synthesis",
    power2: "Factory",
    life2: "Tree",
    axisX: "Dimension X",
    axisY: "Dimension Y",
    luxury: "Luxury",
    gacha: "Gachapon",
}

const typeDescriptions = {
    normal: "Just a normal mergable",
    multi: "A flat increase to mergent gain",
    accel: "Produces accelerons",
    sine: "Fluctuates over time",
    desp: "Based on your despacit mods",
    spawn: "Based on your spawning tier",
    golden: "Boosts golden mergents gain",
    rank: "Based on your merge level",
    metal: "Based on your current magnets",
    flame: "Based on your despacit point effect",
    recur: "Based on your current mergents",
    power: "Based on your power tokens",
    life: "Based on your life tokens",
    power2: "Boosts power token gain",
    life2: "Boosts life token gain",
    axisX: "Based on your merge field columns",
    axisY: "Based on your merge field rows",
    luxury: "Based on your golden mergents",
    gacha: "Based on your gacha count",
}

function formatRoman(num) {
    var roman = {
      M: 1000, CM: 900, D: 500, CD: 400,
      C: 100, XC: 90, L: 50, XL: 40,
      X: 10, IX: 9, V: 5, IV: 4, I: 1
    };
    var str = '';
  
    for (var i of Object.keys(roman)) {
      var q = Math.floor(num / roman[i]);
      num -= q * roman[i];
      str += i.repeat(q);
    }
  
    return str;
}

function seededRandom(seed) {
    let value = seed % 16777216
    var x = Math.tan(value*1000+1);
    x = x / 125
    x = Math.min(Math.sin(x+1) * 16777216, 16777216)
    return x - Math.floor(x);
}

function getMergeColor(seed, tier) {
    let value = Math.floor(seededRandom(seed * Math.sin(((+tier * (seed ** 1.1))))) * 16777216)
    return "#" + value.toString(16).padStart(6, '0')
}

addLayer("des", {
    name: "despacit",
    symbol: "☯",

    row: 4,
    displayRow: 1,
    position: 0,
    branches: ["aca"],
    layerShown() { return player.aca.modActive && player.aca.modLevel == 1 },
    deactivated() { return !this.layerShown() },

    startData() { return {
        points: EN(0),
        mods: EN(0),

        upg105Time: EN(0),
        upg115Time: EN(0),
        upg125Time: EN(0),
        upg135Time: EN(0),

        mergents: EN(0),
        mergeTime: 0,
        autoTime: 0,
        selectedMerge: "",
        gachaDraws: {},
        mergeColors: {},
        accelerons: EN(0),

        goldenMergents: EN(0),
        goldenMergentsSpent: EN(0),
        goldResetTime: 0,
        mergePool: ["multi", "accel", "sine", "desp", "spawn", "golden"],
        branchOrders: {},
        firstBranchs: 1,
        powBranchs: 1,
        lifeBranchs: 1,

        mergeLevel: 1,
        mergeExp: 0,
        magnets: EN(0),

        powTokens: EN(0),
        powTokensSpent: EN(0),
        lifeTokens: EN(0),
        lifeTokensSpent: EN(0),

        bonusMerges: 0,
        gachaMastery: {},
    }},

    resource: "despacit points",
    color: "#6eff55",
    type: "none",
    
    effect() {
        let bonus = buyableEffect("des", 132)
        for (let a = 302; a <= 305; a++) if (hasUpgrade("des", a)) bonus = bonus.add(upgradeEffect("des", a))
        let mb = player.des.mergents.add(1).log().pow(1.5)
        bonus = bonus.add(mb)
        let mods = player.des.mods.add(bonus)

        let eff = {
            bonusMods: bonus,
            compBonus: EN.pow(2, player.des.points.add(1).log10().pow(0.2)),
            pointGain: mods.pow(softcap(mods, EN(3), 0.5).add(1)).mul(EN.pow(player.des.mods.max(1), getBuyableAmount("des", 131))),
            mergentPerSec: EN(0),
            mergentBonus: mb,
            mergentMultis: {},
            mergentMulti: buyableEffect("des", 206),
            acceleronPerSec: EN(0),
            acceleronBonus: player.des.accelerons.div(30).add(1).sqrt(),
            goldenGain: player.des.mergents.div(1e20).max(1).log().pow(1.2).mul(20),
            goldenBonus: player.des.goldenMergents.div(100).add(1),
            goldenMulti: EN(1),
            levelBonus: EN.pow(1.1 + (player.des.mergeLevel * 0.01), player.des.mergeLevel - 1),
            bonusPowTokens: EN(0),
            bonusLifeTokens: EN(0),
            maxBonusMerges: 20,
            bonusMergesChance: 0.1,
        }
        if (getBuyableAmount("des", 114).gte(1)) eff.compBonus = eff.compBonus.mul(player.des.mods.max(1))
        if (hasUpgrade("des", 322)) for (let a = 244; a <= 247; a++) 
            if (hasUpgrade("des", a)) eff.compBonus = eff.compBonus.mul(upgradeEffect("des", a))
        if (hasUpgrade("des", 324)) for (let a = 295; a <= 296; a++) 
            if (hasUpgrade("des", a)) eff.compBonus = eff.compBonus.mul(upgradeEffect("des", a))
        if (hasUpgrade("des", 326)) for (let a = 297; a <= 298; a++) 
            if (hasUpgrade("des", a)) eff.compBonus = eff.compBonus.mul(upgradeEffect("des", a))
        if (hasUpgrade("des", 328)) for (let a = 264; a <= 266; a++) 
            if (hasUpgrade("des", a)) eff.compBonus = eff.compBonus.mul(upgradeEffect("des", a))

        if (getBuyableAmount("des", 103).gte(1)) eff.pointGain = eff.pointGain.mul(buyableEffect("des", 103))
        if (getBuyableAmount("des", 121).gte(1)) eff.pointGain = eff.pointGain.mul(buyableEffect("des", 121))
        if (hasUpgrade("des", 213)) eff.compBonus = eff.compBonus.mul(eff.acceleronBonus)
        eff.pointGain = eff.pointGain.mul(eff.compBonus.pow(getBuyableAmount("des", 123))).mul(buyableEffect("des", 105))

        for(let a in player.des.grid) {
            let ef = layers.des.grid.getEffect(player.des.grid[a], a)
            let type = player.des.grid[a].type
            switch (type) {
                case "": break;
                case "normal": eff.mergentPerSec = eff.mergentPerSec.add(ef); break
                case "accel": eff.acceleronPerSec = eff.acceleronPerSec.add(ef); break
                case "golden": eff.goldenMulti = eff.goldenMulti.add(ef); break
                case "power2": eff.bonusPowTokens = eff.bonusPowTokens.add(ef); break
                case "life2": eff.bonusLifeTokens = eff.bonusLifeTokens.add(ef); break
                default: eff.mergentMultis[type] = (eff.mergentMultis[type] || EN(1)).add(ef); break
            }
        }

        eff.goldenGain = eff.goldenGain.mul(eff.goldenMulti)
        if (hasUpgrade("des", 226)) eff.goldenGain = eff.goldenGain.mul(upgradeEffect("des", 226))
        if (hasUpgrade("des", 228)) eff.goldenGain = eff.goldenGain.mul(upgradeEffect("des", 228))
        if (hasUpgrade("des", 231)) eff.goldenGain = eff.goldenGain.mul(upgradeEffect("des", 231))
        for (let a = 264; a <= 266; a++) if (hasUpgrade("des", a)) eff.goldenGain = eff.goldenGain.mul(upgradeEffect("des", a))
        for (let a = 295; a <= 298; a++) if (hasUpgrade("des", a)) eff.goldenGain = eff.goldenGain.mul(upgradeEffect("des", a))

        for(let a in eff.mergentMultis) {
            if (hasUpgrade("des", 214)) eff.mergentMultis[a] = eff.mergentMultis[a].mul(1.25)
            if (hasUpgrade("des", 253)) eff.mergentMultis[a] = eff.mergentMultis[a].mul(upgradeEffect("des", 253))
            eff.mergentMulti = eff.mergentMulti.mul(eff.mergentMultis[a])
        }
        eff.mergentPerSec = eff.mergentPerSec.mul(eff.mergentMulti).mul(eff.acceleronBonus).mul(eff.goldenBonus).mul(eff.levelBonus).mul(buyableEffect("des", 300))
        if (hasUpgrade("des", 224)) eff.mergentPerSec = eff.mergentPerSec.mul(upgradeEffect("des", 224))
        if (hasUpgrade("des", 236)) eff.mergentPerSec = eff.mergentPerSec.mul(upgradeEffect("des", 236))
        if (hasUpgrade("des", 237)) eff.mergentPerSec = eff.mergentPerSec.mul(upgradeEffect("des", 237))
        for (let a = 261; a <= 263; a++) if (hasUpgrade("des", a)) eff.mergentPerSec = eff.mergentPerSec.mul(upgradeEffect("des", a))
        for (let a = 271; a <= 273; a++) if (hasUpgrade("des", a)) eff.mergentPerSec = eff.mergentPerSec.mul(upgradeEffect("des", a))

        if (hasUpgrade("des", 283)) eff.maxBonusMerges += 40
        if (hasUpgrade("des", 285)) eff.maxBonusMerges += 50
        for (let a = 291; a <= 294; a++) if (hasUpgrade("des", a)) eff.maxBonusMerges += upgradeEffect("des", a)
        for (let a = 321; a <= 323; a += 2) if (hasUpgrade("des", a)) eff.maxBonusMerges += upgradeEffect("des", a)
        if (hasUpgrade("des", 325)) eff.maxBonusMerges += buyableEffect("des", 304)
        if (hasUpgrade("des", 327)) eff.maxBonusMerges += upgradeEffect("des", 327)

        if (hasUpgrade("des", 301)) eff.bonusMergesChance += upgradeEffect("des", 301)
        if (hasUpgrade("des", 306)) eff.bonusMergesChance += 0.05

        return eff
    },
    effectDescription() {
        return `which are making thefinaluptake time ${format(tmp.des.effect.compBonus)}× faster.`
    },

    upgrades: {
        101: {
            title: "A Prestige Tree Mod About Merging",
            description: "Unlocks a new tab.",
            cost: EN("1e150"),
            unlocked() { return getBuyableAmount("des", 135).gte(1) },
        },
        102: {
            title: "Golden Mergant",
            description: "Unlocks Golden Mergant.",
            cost: EN("1e256"),
            unlocked() { return hasUpgrade("des", 101) },
        },
        103: {
            title: "Stars",
            description: "Unlocks Stars.",
            cost: EN("1e450"),
            unlocked() { return hasUpgrade("des", 101) },
        },
        201: {
            title: "Better Mergables II",
            description: "50% chance that a Normal Mergable spawns 1 tier higher.",
            currencyDisplayName: "golden mergents",
            cost: EN(10),
            req: [],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        211: {
            title: "Merge Mastery",
            description: "Unlocks Leveling, which boost your production the more you merge.",
            currencyDisplayName: "golden mergents",
            cost() {
                return EN.pow(10, player.des.branchOrders["levels"] || player.des.firstBranchs).mul(10)
            },
            req: [201],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
                player.des.branchOrders["levels"] = player.des.firstBranchs
                player.des.firstBranchs += 1
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px 80px 10px 10px" }
        },
        212: {
            title: "Push and Pull",
            description: "Unlocks Magnets, which have a chance to appear when you merge. Also unlocks new upgrades.",
            currencyDisplayName: "golden mergents",
            cost() {
                return EN.pow(10, player.des.branchOrders["magnet"] || player.des.firstBranchs).mul(10)
            },
            req: [201],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
                player.des.branchOrders["magnet"] = player.des.firstBranchs
                player.des.firstBranchs += 1
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px 80px 10px 80px" }
        },
        213: {
            title: "Wow, such accelerate",
            description: "Acceleron effect multiplies despacit point effect.",
            currencyDisplayName: "golden mergents",
            cost() {
                return EN.pow(10, player.des.branchOrders["premerge"] || player.des.firstBranchs).mul(10)
            },
            req: [201],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
                player.des.branchOrders["premerge"] = player.des.firstBranchs
                player.des.firstBranchs += 1
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px 80px 10px 80px" }
        },
        214: {
            title: "Multiplier Multiplier",
            description: "Multiplies all mergent multipliers by 1.25× if you unlock them.",
            currencyDisplayName: "golden mergents",
            cost() {
                return EN.pow(10, player.des.branchOrders["postmerge"] || player.des.firstBranchs).mul(10)
            },
            req: [201],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
                player.des.branchOrders["postmerge"] = player.des.firstBranchs
                player.des.firstBranchs += 1
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px 10px 10px 80px" }
        },
        221: {
            title: "Ranker",
            description: "Unlocks the <b>Ranker</b> special mergable, which is based on your highest level.",
            currencyDisplayName: "golden mergents",
            cost() {
                return EN.pow(9, player.des.branchOrders["levels"] || player.des.firstBranchs).mul(1000 / 9)
            },
            req: [211],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
                player.des.mergePool.push("rank")
                player.des.gachaDraws["rank"] = 1
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        222: {
            title: "Faster Levels",
            description: "You have a 10% chance for a merge to yield an extra 1 bonus merge.",
            currencyDisplayName: "golden mergents",
            cost() {
                return EN.pow(9, player.des.branchOrders["levels"] || player.des.firstBranchs).mul(1000 / 9)
            },
            req: [211],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        223: {
            title: "Metallic",
            description: "Unlocks the <b>Metallic</b> special mergable, which is based on your current magnets.",
            currencyDisplayName: "golden mergents",
            cost() {
                return EN.pow(9, player.des.branchOrders["magnet"] || player.des.firstBranchs).mul(1000 / 9)
            },
            req: [212],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
                player.des.mergePool.push("metal")
                player.des.gachaDraws["metal"] = 1
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        224: {
            title: "Mergent Attractor",
            description: "Unspent magnets boost mergent gain.",
            currencyDisplayName: "golden mergents",
            cost() {
                return EN.pow(9, player.des.branchOrders["magnet"] || player.des.firstBranchs).mul(1000 / 9)
            },
            effect() {
                return player.des.magnets.mul(0.8).add(1)
            },
            effectDisplay() { return "×" + format(upgradeEffect(this.layer, this.id)) },
            req: [212],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: () => ({ margin: "10px", "margin-right": hasUpgrade("des", 103) ? "25px" : "10px" })
        },
        225: {
            title: "Flame",
            description: "Unlocks the <b>Flame</b> special mergable, which is based on your despacit point effect.",
            currencyDisplayName: "golden mergents",
            cost() {
                return EN.pow(9, player.des.branchOrders["premerge"] || player.des.firstBranchs).mul(1000 / 9)
            },
            req: [213],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
                player.des.mergePool.push("flame")
                player.des.gachaDraws["flame"] = 1
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: () => ({ margin: "10px", "margin-left": hasUpgrade("des", 103) ? "25px" : "10px" })
        },
        226: {
            title: "Golden Flame",
            description: "Despacit effect boosts golden mergent gain.",
            currencyDisplayName: "golden mergents",
            cost() {
                return EN.pow(9, player.des.branchOrders["premerge"] || player.des.firstBranchs).mul(1000 / 9)
            },
            effect() {
                return EN.pow(2.5, tmp.des.effect.compBonus.log10().sqrt()).pow(0.3)
            },
            effectDisplay() { return "×" + format(upgradeEffect(this.layer, this.id)) },
            req: [213],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        227: {
            title: "Recursion",
            description: "Unlocks the <b>Recursion</b> special mergable, which is based on your mergent.",
            currencyDisplayName: "golden mergents",
            cost() {
                return EN.pow(9, player.des.branchOrders["postmerge"] || player.des.firstBranchs).mul(1000 / 9)
            },
            req: [214],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
                player.des.mergePool.push("recur")
                player.des.gachaDraws["recur"] = 1
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        228: {
            title: "Multiply the Gold",
            description: "Mergent multiplier boosts golden mergent gain.",
            currencyDisplayName: "golden mergents",
            cost() {
                return EN.pow(9, player.des.branchOrders["postmerge"] || player.des.firstBranchs).mul(1000 / 9)
            },
            effect() {
                return EN.pow(2, tmp.des.effect.mergentMulti.log10().sqrt()).pow(0.3)
            },
            effectDisplay() { return "×" + format(upgradeEffect(this.layer, this.id)) },
            req: [214],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        231: {
            title: "Deeper Mines",
            description: "Your level boosts golden mergent gain.",
            currencyDisplayName: "golden mergents",
            cost() {
                return EN.pow(8, player.des.branchOrders["levels"] || player.des.firstBranchs).mul(5000 / 8)
            },
            effect() {
                return EN.mul(player.des.mergeLevel, 0.05).add(1)
            },
            effectDisplay() { return "×" + format(upgradeEffect(this.layer, this.id)) },
            req: [221],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        232: {
            title: "Special Snowflake",
            description: "Doubles merge experience gain from merging special mergables.",
            currencyDisplayName: "golden mergents",
            cost() {
                return EN.pow(8, player.des.branchOrders["levels"] || player.des.firstBranchs).mul(5000 / 8)
            },
            req: [222],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        233: {
            title: "Runner Game Logic",
            description: "Unspent magnets boost golden mergent gain.",
            currencyDisplayName: "golden mergents",
            cost() {
                return EN.pow(8, player.des.branchOrders["magnet"] || player.des.firstBranchs).mul(5000 / 8)
            },
            effect() {
                return EN.mul(player.des.magnets.sqrt(), 0.05).add(1)
            },
            effectDisplay() { return "×" + format(upgradeEffect(this.layer, this.id)) },
            req: [223],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        234: {
            title: "Magnetized Mergables",
            description: "Triples magnet gain from merging special mergables.",
            currencyDisplayName: "golden mergents",
            cost() {
                return EN.pow(8, player.des.branchOrders["magnet"] || player.des.firstBranchs).mul(5000 / 8)
            },
            req: [224],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: () => ({ margin: "10px", "margin-right": hasUpgrade("des", 103) ? "25px" : "10px" })
        },
        235: {
            title: "Do we really need this?",
            description: "Increases all pre-merge upgrade caps by 2.",
            currencyDisplayName: "golden mergents",
            cost() {
                return EN.pow(8, player.des.branchOrders["premerge"] || player.des.firstBranchs).mul(5000 / 8)
            },
            req: [225],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: () => ({ margin: "10px", "margin-left": hasUpgrade("des", 103) ? "25px" : "10px" })
        },
        236: {
            title: "Mergentsmith",
            description: "Despacit effect boost mergent gain.",
            currencyDisplayName: "golden mergents",
            cost() {
                return EN.pow(8, player.des.branchOrders["premerge"] || player.des.firstBranchs).mul(5000 / 8)
            },
            req: [226],
            effect() {
                return tmp.des.effect.compBonus.cbrt()
            },
            effectDisplay() { return "×" + format(upgradeEffect(this.layer, this.id)) },
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        237: {
            title: "Recursion.",
            description: "Mergent gain boosts itself.",
            currencyDisplayName: "golden mergents",
            cost() {
                return EN.pow(8, player.des.branchOrders["postmerge"] || player.des.firstBranchs).mul(5000 / 8)
            },
            req: [227],
            effect() {
                return tmp.des.effect.mergentPerSec.add(10).log10()
            },
            effectDisplay() { return "×" + format(upgradeEffect(this.layer, this.id)) },
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        238: {
            title: "Better Mergables III",
            description: "20% chance that a mergable (Normal or Special) spawns 1 tier higher.",
            currencyDisplayName: "golden mergents",
            cost() {
                return EN.pow(8, player.des.branchOrders["postmerge"] || player.des.firstBranchs).mul(5000 / 8)
            },
            req: [228],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        241: {
            title: "Mergeyard",
            description: "Unlocks Mergeyard, where you can spend mergents to reduce the star requirements.",
            currencyDisplayName: "golden mergents",
            cost: EN(100000),
            unlocked() { return hasUpgrade("des", 103) },
            req: [201],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "50px 10px 10px 10px" }
        },
        242: {
            title: "Power Factory",
            description: "Produces power tokens based on golden mergents.",
            currencyDisplayName: "golden mergents",
            effect() {
                let eff = player.des.goldenMergents.add(1).pow(0.2).div(10)
                for (let a = 244; a <= 247; a++) if (hasUpgrade("des", a)) eff = eff.mul(upgradeEffect("des", a))
                return eff.mul(buyableEffect("des", 302)).add(tmp.des.effect.bonusPowTokens)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "/s" },
            cost: EN(5000),
            unlocked() { return hasUpgrade("des", 103) },
            req: [241],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px 150px 10px 10px" }
        },
        243: {
            title: "Life Garden",
            description: "Produces life tokens based on normal mergents.",
            currencyDisplayName: "golden mergents",
            effect() {
                let eff = EN.pow(2, player.des.mergents.add(1).log10().pow(0.3)).div(10)
                for (let a = 244; a <= 247; a++) if (hasUpgrade("des", a)) eff = eff.mul(upgradeEffect("des", a))
                return eff.mul(buyableEffect("des", 303)).add(tmp.des.effect.bonusLifeTokens)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "/s" },
            cost: EN(5000),
            unlocked() { return hasUpgrade("des", 103) },
            req: [241],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px 10px 10px 150px" }
        },
        244: {
            title: "Level Tokens",
            description: "Level boosts token gain.",
            currencyDisplayName: "golden mergents",
            effect() {
                return EN(player.des.mergeLevel / 50 + 1)
            },
            effectDisplay() { return "×" + format(upgradeEffect(this.layer, this.id)) },
            cost() {
                return EN.pow(7, player.des.branchOrders["levels"] || player.des.firstBranchs).mul(25000 / 7)
            },
            unlocked() { return hasUpgrade("des", 257) },
            req: [231, 232],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px 80px 50px 10px" }
        },
        245: {
            title: "Magnet Factories",
            description: "Unspent magnets boosts token gain.",
            currencyDisplayName: "golden mergents",
            effect() {
                return player.des.magnets.sqrt().div(50).add(1)
            },
            effectDisplay() { return "×" + format(upgradeEffect(this.layer, this.id)) },
            cost() {
                return EN.pow(7, player.des.branchOrders["magnets"] || player.des.firstBranchs).mul(25000 / 7)
            },
            unlocked() { return hasUpgrade("des", 257) },
            req: [233, 234],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px 25px 50px 80px" }
        },
        246: {
            title: "Fire Flower",
            description: "Despacit effect boost token gain.",
            currencyDisplayName: "golden mergents",
            effect() {
                return tmp.des.effect.compBonus.log10().div(50).add(1)
            },
            effectDisplay() { return "×" + format(upgradeEffect(this.layer, this.id)) },
            cost() {
                return EN.pow(7, player.des.branchOrders["premerge"] || player.des.firstBranchs).mul(25000 / 7)
            },
            unlocked() { return hasUpgrade("des", 257) },
            req: [235, 236],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px 80px 50px 25px" }
        },
        247: {
            title: "Second Life",
            description: "Mergents boost token gain.",
            currencyDisplayName: "golden mergents",
            effect() {
                return player.des.mergents.add(1).log10().sqrt().div(50).add(1)
            },
            effectDisplay() { return "×" + format(upgradeEffect(this.layer, this.id)) },
            cost() {
                return EN.pow(7, player.des.branchOrders["postmerge"] || player.des.firstBranchs).mul(25000 / 7)
            },
            unlocked() { return hasUpgrade("des", 257) },
            req: [237, 238],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px 10px 50px 80px" }
        },
        251: {
            title: "More Faster Mergables",
            description: "Incrase the <b>Faster Mergables</b> upgrade cap by 5.",
            currencyDisplayName: "power tokens",
            cost() {
                return EN.pow(2, player.des.branchOrders["pow1"] || player.des.powBranchs).mul(50)
            },
            unlocked() { return hasUpgrade("des", 103) },
            req: [242],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.powTokens.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.powTokens = player.des.powTokens.sub(cost) 
                player.des.branchOrders["pow1"] = player.des.powBranchs
                player.des.powBranchs += 1;
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        252: {
            title: "<i>東方の木？？",
            description: "Add 10% of bonus mods to <b>Despacit</b> mergable effect.",
            currencyDisplayName: "power tokens",
            cost() {
                return EN.pow(2, player.des.branchOrders["pow2"] || player.des.powBranchs).mul(50)
            },
            unlocked() { return hasUpgrade("des", 103) },
            req: [242],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.powTokens.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.powTokens = player.des.powTokens.sub(cost) 
                player.des.branchOrders["pow2"] = player.des.powBranchs
                player.des.powBranchs += 1;
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        253: {
            title: "Meta-Multiplier",
            description: "Boosts all your multipliers based on the amount of different mergables in the gacha pool.",
            currencyDisplayName: "power tokens",
            effect() {
                return EN.mul(player.des.mergePool.length, 0.075).add(1)
            },
            effectDisplay() { return "×" + format(upgradeEffect(this.layer, this.id)) },
            cost() {
                return EN.pow(2, player.des.branchOrders["pow3"] || player.des.powBranchs).mul(50)
            },
            unlocked() { return hasUpgrade("des", 103) },
            req: [242],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.powTokens.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.powTokens = player.des.powTokens.sub(cost) 
                player.des.branchOrders["pow3"] = player.des.powBranchs
                player.des.powBranchs += 1;
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        254: {
            title: "Bulk Auto-Merge",
            description: "<b>Auto-Merge</b> now merges all mergables at once, but its cost grows faster. Resets the upgrade.",
            currencyDisplayName: "life tokens",
            cost() {
                return EN.pow(2, player.des.branchOrders["life1"] || player.des.lifeBranchs).mul(50)
            },
            unlocked() { return hasUpgrade("des", 103) },
            req: [243],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.lifeTokens.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.lifeTokens = player.des.lifeTokens.sub(cost) 
                player.des.branchOrders["life1"] = player.des.lifeBranchs
                player.des.lifeBranchs += 1;
                player.des.buyables[205] = EN(0)
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        255: {
            title: "Obsolescence",
            description: "Automatically upgrades despacit mod upgrades.",
            currencyDisplayName: "life tokens",
            cost() {
                return EN.pow(2, player.des.branchOrders["life2"] || player.des.lifeBranchs).mul(50)
            },
            unlocked() { return hasUpgrade("des", 103) },
            req: [243],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.lifeTokens.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.lifeTokens = player.des.lifeTokens.sub(cost) 
                player.des.branchOrders["life2"] = player.des.lifeBranchs
                player.des.lifeBranchs += 1;
                player.des.buyables[205] = EN(0)
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        256: {
            title: "Buying no More",
            description: "Automatically upgrades merge upgrades.",
            currencyDisplayName: "life tokens",
            cost() {
                return EN.pow(2, player.des.branchOrders["life3"] || player.des.lifeBranchs).mul(50)
            },
            unlocked() { return hasUpgrade("des", 103) },
            req: [243],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.lifeTokens.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.lifeTokens = player.des.lifeTokens.sub(cost) 
                player.des.branchOrders["life3"] = player.des.lifeBranchs
                player.des.lifeBranchs += 1;
                player.des.buyables[205] = EN(0)
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        257: {
            title: "Blessing from the Mergent",
            description: "Unlocks upgrades for fastening token gain.",
            currencyDisplayName: "golden mergents",
            cost: EN(200000),
            unlocked() { return hasUpgrade("des", 103) },
            req: [241],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        261: {
            title: "Upgrade Upgrades",
            description: "Boosts mergent gain based on your mergent upgrades count.",
            currencyDisplayName: "power tokens",
            effect() {
                let x = EN(0)
                for(let a = 200; a <= 205; a++) x = x.add(player.des.buyables[a])
                return x.div(5).add(1)
            },
            effectDisplay() { return "×" + format(upgradeEffect(this.layer, this.id)) },
            cost() {
                return EN.pow(1.8, player.des.branchOrders["pow1"] || player.des.powBranchs).mul(250)
            },
            unlocked() { return hasUpgrade("des", 103) },
            req: [251],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.powTokens.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.powTokens = player.des.powTokens.sub(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        262: {
            title: "Embodiment of Despacit Mods",
            description: "Boosts mergent gain based on your bonus despacit mods.",
            currencyDisplayName: "power tokens",
            effect() {
                return tmp.des.effect.bonusMods.div(65).add(1)
            },
            effectDisplay() { return "×" + format(upgradeEffect(this.layer, this.id)) },
            cost() {
                return EN.pow(1.8, player.des.branchOrders["pow2"] || player.des.powBranchs).mul(250)
            },
            unlocked() { return hasUpgrade("des", 103) },
            req: [252],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.powTokens.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.powTokens = player.des.powTokens.sub(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        263: {
            title: "Just Multiplier",
            description: "Boosts mergent gain based on your amount of <b>Literally Gachapon</b> upgrade.",
            currencyDisplayName: "power tokens",
            effect() {
                return player.des.buyables[201].div(2).add(1)
            },
            effectDisplay() { return "×" + format(upgradeEffect(this.layer, this.id)) },
            cost() {
                return EN.pow(1.8, player.des.branchOrders["pow3"] || player.des.powBranchs).mul(250)
            },
            unlocked() { return hasUpgrade("des", 103) },
            req: [253],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.powTokens.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.powTokens = player.des.powTokens.sub(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        264: {
            title: "Quantity of Life",
            description: "Boosts golden mergent gain based on your mergent upgrades count.",
            currencyDisplayName: "life tokens",
            effect() {
                let x = EN(0)
                for(let a = 200; a <= 205; a++) x = x.add(player.des.buyables[a])
                return x.div(25).add(1).pow(0.15)
            },
            effectDisplay() { return "×" + format(upgradeEffect(this.layer, this.id)) },
            cost() {
                return EN.pow(1.8, player.des.branchOrders["life1"] || player.des.lifeBranchs).mul(250)
            },
            unlocked() { return hasUpgrade("des", 103) },
            req: [254],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.lifeTokens.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.lifeTokens = player.des.lifeTokens.sub(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        265: {
            title: "Long Live the Life",
            description: "Boosts golden mergent gain based on your bonus despacit mods.",
            currencyDisplayName: "life tokens",
            effect() {
                return tmp.des.effect.bonusMods.div(320).add(1).pow(0.15)
            },
            effectDisplay() { return "×" + format(upgradeEffect(this.layer, this.id)) },
            cost() {
                return EN.pow(1.8, player.des.branchOrders["life2"] || player.des.lifeBranchs).mul(250)
            },
            unlocked() { return hasUpgrade("des", 103) },
            req: [255],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.lifeTokens.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.lifeTokens = player.des.lifeTokens.sub(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        266: {
            title: "Multply yes More",
            description: "Boosts golden mergent gain based on your bonus despacit mods.",
            currencyDisplayName: "life tokens",
            effect() {
                return player.des.buyables[201].div(10).add(1).pow(0.15)
            },
            effectDisplay() { return "×" + format(upgradeEffect(this.layer, this.id)) },
            cost() {
                return EN.pow(1.8, player.des.branchOrders["life3"] || player.des.lifeBranchs).mul(250)
            },
            unlocked() { return hasUpgrade("des", 103) },
            req: [256],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.lifeTokens.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.lifeTokens = player.des.lifeTokens.sub(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        267: {
            title: "Batteries",
            description: "Unlocks the <b>Battery</b> special mergable, which is based on your power tokens.",
            currencyDisplayName: "golden mergents",
            cost: EN(1200000),
            unlocked() { return hasUpgrade("des", 103) },
            req: [257, 253],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
                player.des.mergePool.push("power")
                player.des.gachaDraws["power"] = 1
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        268: {
            title: "Synthesizer",
            description: "Unlocks the <b>Synthesis</b> special mergable, which is based on your life tokens.",
            currencyDisplayName: "golden mergents",
            cost: EN(1200000),
            unlocked() { return hasUpgrade("des", 103) },
            req: [257, 254],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
                player.des.mergePool.push("life")
                player.des.gachaDraws["life"] = 1
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        271: {
            title: "Mergent Factories",
            description: "Boosts mergent gain based on your power tokens.",
            currencyDisplayName: "power tokens",
            effect() {
                return player.des.powTokens.add(1).pow(0.55)
            },
            effectDisplay() { return "×" + format(upgradeEffect(this.layer, this.id)) },
            cost() {
                return EN.pow(1.6, player.des.branchOrders["pow1"] || player.des.powBranchs).mul(1000)
            },
            unlocked() { return hasUpgrade("des", 103) },
            req: [261],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.powTokens.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.powTokens = player.des.powTokens.sub(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        272: {
            title: "Mergent Garden",
            description: "Boosts mergent gain based on your life tokens.",
            currencyDisplayName: "power tokens",
            effect() {
                return player.des.lifeTokens.add(1).pow(0.5)
            },
            effectDisplay() { return "×" + format(upgradeEffect(this.layer, this.id)) },
            cost() {
                return EN.pow(1.6, player.des.branchOrders["pow2"] || player.des.powBranchs).mul(1000)
            },
            unlocked() { return hasUpgrade("des", 103) },
            req: [262],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.powTokens.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.powTokens = player.des.powTokens.sub(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        273: {
            title: "Mergent Synergy",
            description: "Boosts mergent gain based on your power tokens and life tokens.",
            currencyDisplayName: "power tokens",
            effect() {
                return player.des.lifeTokens.add(player.des.powTokens).div(2).add(1).pow(0.525)
            },
            effectDisplay() { return "×" + format(upgradeEffect(this.layer, this.id)) },
            cost() {
                return EN.pow(1.6, player.des.branchOrders["pow3"] || player.des.powBranchs).mul(1000)
            },
            unlocked() { return hasUpgrade("des", 103) },
            req: [263],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.powTokens.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.powTokens = player.des.powTokens.sub(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        274: {
            title: "Fast Mergeyard",
            description: "Pressing on Mergeyard will now spent the most amount of mergents until the next upgrade.",
            currencyDisplayName: "life tokens",
            cost() {
                return EN.pow(1.6, player.des.branchOrders["life1"] || player.des.lifeBranchs).mul(1000)
            },
            unlocked() { return hasUpgrade("des", 103) },
            req: [264],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.lifeTokens.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.lifeTokens = player.des.lifeTokens.sub(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        275: {
            title: "Faster Auto-Merge",
            description: "Each Auto-Merge upgrade speed itself more.",
            currencyDisplayName: "life tokens",
            cost() {
                return EN.pow(1.6, player.des.branchOrders["life2"] || player.des.lifeBranchs).mul(1000)
            },
            unlocked() { return hasUpgrade("des", 103) },
            req: [265],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.lifeTokens.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.lifeTokens = player.des.lifeTokens.sub(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        276: {
            title: "Auto Mergeyard",
            description: "Automates Mergeyard.",
            currencyDisplayName: "life tokens",
            cost() {
                return EN.pow(1.6, player.des.branchOrders["life3"] || player.des.lifeBranchs).mul(1000)
            },
            unlocked() { return hasUpgrade("des", 103) },
            req: [266],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.lifeTokens.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.lifeTokens = player.des.lifeTokens.sub(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        277: {
            title: "Poweryard",
            description: "Unlocks Power Mergeyard.",
            currencyDisplayName: "golden mergents",
            cost: EN(6000000),
            unlocked() { return hasUpgrade("des", 103) },
            req: [267],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.sub(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        278: {
            title: "Graveyard",
            description: "Unlocks Life Mergeyard.",
            currencyDisplayName: "golden mergents",
            cost: EN(6000000),
            unlocked() { return hasUpgrade("des", 103) },
            req: [268],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        281: {
            title: "A Deck of Cards",
            description: "Unlocks new special mergable types.",
            currencyDisplayName: "golden mergents",
            cost: EN(12000000),
            unlocked() { return hasUpgrade("des", 103) },
            req: [277, 278],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
                player.des.mergePool.push("life2", "power2", "luxury", "axisX", "axisY", "gacha")
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        282: {
            title: "Bonus Draws",
            description: "10% chance for a normal merge to spawn as a special mergable instead. Limited to 20 times per prestige.",
            currencyDisplayName: "golden mergents",
            cost: EN(24000000),
            unlocked() { return hasUpgrade("des", 281) },
            req: [281],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "50px 10px 10px 10px" }
        },
        283: {
            title: "IH777",
            description: "Increases the bonus mergable cap by 40.",
            currencyDisplayName: "golden mergents",
            cost: EN(24000000),
            unlocked() { return hasUpgrade("des", 281) },
            req: [282],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        284: {
            title: "Merge Mastery",
            description: "Unlocks merge mastery. Drawing a special mergable will increase its bonus tier. Bonus specials are worth more.",
            currencyDisplayName: "golden mergents",
            cost: EN(36000000),
            unlocked() { return hasUpgrade("des", 281) },
            req: [282],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px 195px 10px 195px" }
        },
        285: {
            title: "888888",
            description: "Increases the bonus mergable cap by 50.",
            currencyDisplayName: "golden mergents",
            cost: EN(30000000),
            unlocked() { return hasUpgrade("des", 281) },
            req: [282],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        291: {
            title: "Golden Eagle",
            description: "Increases the bonus mergable cap based on golden mergents.",
            currencyDisplayName: "golden mergents",
            effect() {
                return player.des.goldenMergents.add(1).log().mul(1.5).floor().toNumber()
            },
            effectDisplay() { return "+" + format(upgradeEffect(this.layer, this.id), 0) },
            cost: EN(60000000),
            unlocked() { return hasUpgrade("des", 281) },
            req: [283],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        292: {
            title: "Power Player",
            description: "Increases the bonus mergable cap based on power tokens.",
            currencyDisplayName: "golden mergents",
            effect() {
                return player.des.powTokens.add(1).log().mul(2).floor().toNumber()
            },
            effectDisplay() { return "+" + format(upgradeEffect(this.layer, this.id), 0) },
            cost: EN(60000000),
            unlocked() { return hasUpgrade("des", 281) },
            req: [283],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        293: {
            title: "Life, GET!!",
            description: "Increases the bonus mergable cap based on life tokens.",
            currencyDisplayName: "golden mergents",
            effect() {
                return player.des.lifeTokens.add(1).log().mul(2).floor().toNumber()
            },
            effectDisplay() { return "+" + format(upgradeEffect(this.layer, this.id), 0) },
            cost: EN(60000000),
            unlocked() { return hasUpgrade("des", 281) },
            req: [285],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        294: {
            title: "Draw 11 Times",
            description: "Increases the bonus mergable cap based on mergents.",
            currencyDisplayName: "golden mergents",
            effect() {
                return player.des.mergents.add(1).log10().sqrt().mul(2).floor().toNumber()
            },
            effectDisplay() { return "+" + format(upgradeEffect(this.layer, this.id), 0) },
            cost: EN(60000000),
            unlocked() { return hasUpgrade("des", 281) },
            req: [285],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        295: {
            title: "Gold Factory",
            description: "Increases golden mergent gain based on power tokens.",
            currencyDisplayName: "golden mergents",
            effect() {
                return player.des.powTokens.add(1).pow(0.025)
            },
            effectDisplay() { return "×" + format(upgradeEffect(this.layer, this.id)) },
            cost: EN(60000000),
            unlocked() { return hasUpgrade("des", 281) },
            req: [284],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        296: {
            title: "Uber Rare",
            description: "Increases golden mergent gain based on bonus special mergent count.",
            currencyDisplayName: "golden mergents",
            effect() {
                return EN.pow(1.1, player.des.bonusMerges ** 0.25)
            },
            effectDisplay() { return "×" + format(upgradeEffect(this.layer, this.id)) },
            cost: EN(60000000),
            unlocked() { return hasUpgrade("des", 281) },
            req: [284],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        297: {
            title: "Super Rare",
            description: "Increases golden mergent gain based on non-bonus special mergent count.",
            currencyDisplayName: "golden mergents",
            effect() {
                return EN.pow(1.1, player.des.buyables[201].sub(player.des.bonusMerges) ** 0.2)
            },
            effectDisplay() { return "×" + format(upgradeEffect(this.layer, this.id)) },
            cost: EN(60000000),
            unlocked() { return hasUpgrade("des", 281) },
            req: [284],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        298: {
            title: "Life of a Golden Farmer",
            description: "Increases golden mergent gain based on life tokens.",
            currencyDisplayName: "golden mergents",
            effect() {
                return player.des.lifeTokens.add(1).pow(0.025)
            },
            effectDisplay() { return "×" + format(upgradeEffect(this.layer, this.id)) },
            cost: EN(60000000),
            unlocked() { return hasUpgrade("des", 281) },
            req: [284],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        301: {
            title: "Demand",
            description: "Increases bonus special spawn chance based on remaining bonus specials.",
            currencyDisplayName: "golden mergents",
            effect() {
                return (tmp.des.effect.maxBonusMerges - player.des.bonusMerges) * 0.00035
            },
            effectDisplay() { return "+" + format(upgradeEffect(this.layer, this.id) * 100) + "%" },
            cost: EN(400000000),
            unlocked() { return hasUpgrade("des", 281) },
            req: [291, 292],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px 80px 10px 10px" }
        },
        302: {
            title: "Mergables",
            description: "<b>Better Margables</b> adds to bonus despacit mods.",
            currencyDisplayName: "golden mergents",
            effect() {
                return player.des.buyables[202].mul(5)
            },
            effectDisplay() { return "+" + format(upgradeEffect(this.layer, this.id), 0) },
            cost: EN(400000000),
            unlocked() { return hasUpgrade("des", 281) },
            req: [295],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        303: {
            title: "Unfinished Mods",
            description: "<b>Mergeyard</b> adds to bonus despacit mods.",
            currencyDisplayName: "golden mergents",
            effect() {
                return player.des.buyables[301].mul(0.6)
            },
            effectDisplay() { return "+" + format(upgradeEffect(this.layer, this.id), 0) },
            cost: EN(400000000),
            unlocked() { return hasUpgrade("des", 281) },
            req: [296],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        304: {
            title: "~ Power Life ~",
            description: "<b>Power</b> and <b>Life Mergeyard</b> adds to bonus despacit mods.",
            currencyDisplayName: "golden mergents",
            effect() {
                return player.des.buyables[302].add(player.des.buyables[303]).mul(1.2)
            },
            effectDisplay() { return "+" + format(upgradeEffect(this.layer, this.id), 0) },
            cost: EN(400000000),
            unlocked() { return hasUpgrade("des", 281) },
            req: [297],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        305: {
            title: "RNG Haven",
            description: "<b>Literally Gachapon</b> adds to bonus despacit mods.",
            currencyDisplayName: "golden mergents",
            effect() {
                return player.des.buyables[201].mul(3)
            },
            effectDisplay() { return "+" + format(upgradeEffect(this.layer, this.id), 0) },
            cost: EN(400000000),
            unlocked() { return hasUpgrade("des", 281) },
            req: [298],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        306: {
            title: "Supply",
            description: "Increases bonus special spawn chance by 5%.",
            currencyDisplayName: "golden mergents",
            cost: EN(400000000),
            unlocked() { return hasUpgrade("des", 281) },
            req: [293, 294],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px 10px 10px 80px" }
        },
        311: {
            title: "More",
            description: "Increases <b>Faster Mergables</b> cap by 5.",
            currencyDisplayName: "golden mergents",
            cost: EN(2e9),
            unlocked() { return hasUpgrade("des", 281) },
            req: [301],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px 80px 10px 10px" }
        },
        312: {
            title: "of",
            description: "Increases <b>Faster Mergables</b> cap by 5.",
            currencyDisplayName: "golden mergents",
            cost: EN(6e9),
            unlocked() { return hasUpgrade("des", 281) },
            req: [302, 303],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px 80px 10px 80px" }
        },
        313: {
            title: "the",
            description: "Increases <b>Faster Mergables</b> cap by 5.",
            currencyDisplayName: "golden mergents",
            cost: EN(18e9),
            unlocked() { return hasUpgrade("des", 281) },
            req: [304, 305],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px 80px 10px 80px" }
        },
        314: {
            title: "same",
            description: "Increases <b>Faster Mergables</b> cap by 5.",
            currencyDisplayName: "golden mergents",
            cost: EN(54e9),
            unlocked() { return hasUpgrade("des", 281) },
            req: [306],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px 10px 10px 80px" }
        },
        321: {
            title: "HE777",
            description: "Increases the bonus mergable cap by 30, grows to 100 over this golden reset.",
            currencyDisplayName: "golden mergents",
            effect() {
                return Math.floor(Math.min(30 + player.des.goldResetTime / 5, 100))
            },
            effectDisplay() { return "+" + format(upgradeEffect(this.layer, this.id), 0) },
            cost: EN(4e9),
            unlocked() { return hasUpgrade("des", 281) },
            req: [311],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        322: {
            title: "Blessing from the Mergent II",
            description: "<b>Blessing from the Mergent</b> upgrades affect despacit effect.",
            currencyDisplayName: "golden mergents",
            cost: EN(4e9),
            unlocked() { return hasUpgrade("des", 281) },
            req: [311],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        323: {
            title: "Growth Package",
            description: "Increases the bonus mergable cap by 20 per 5 merge levels, up to 120.",
            currencyDisplayName: "golden mergents",
            effect() {
                return Math.min(Math.floor(player.des.mergeLevel / 5) * 20, 120)
            },
            effectDisplay() { return "+" + format(upgradeEffect(this.layer, this.id), 0) },
            cost: EN(12e9),
            unlocked() { return hasUpgrade("des", 281) },
            req: [312],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        324: {
            title: "Uber Gold",
            description: "<b>Gold Factory</b> and <b>Uber Rare</b> affects despacit effect.",
            currencyDisplayName: "golden mergents",
            cost: EN(12e9),
            unlocked() { return hasUpgrade("des", 281) },
            req: [312],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        325: {
            title: "Gacha is Trash",
            description: "Unlocks Gacha Mergeyard.",
            currencyDisplayName: "golden mergents",
            cost: EN(36e9),
            unlocked() { return hasUpgrade("des", 281) },
            req: [313],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        326: {
            title: "Super Life",
            description: "<b>Super Rare</b> and <b>Life of a Golden Farmer</b> affects despacit effect.",
            currencyDisplayName: "golden mergents",
            cost: EN(36e9),
            unlocked() { return hasUpgrade("des", 281) },
            req: [313],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        327: {
            title: "Meta-Mastery",
            description: "The sum of all gacha masteries adds to the bonus special cap.",
            effect() {
                let bonus = 0
                for (let mas in player.des.gachaMastery) bonus += player.des.gachaMastery[mas]
                return Math.floor(bonus)
            },
            effectDisplay() { return "+" + format(upgradeEffect(this.layer, this.id), 0) },
            currencyDisplayName: "golden mergents",
            cost: EN(108e9),
            unlocked() { return hasUpgrade("des", 281) },
            req: [314],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        328: {
            title: "Literal 42",
            description: "Upgrades from <b>Quantity of Life</b> and <b>Multply yes More</b> affects despacit effect.",
            currencyDisplayName: "golden mergents",
            cost: EN(108e9),
            unlocked() { return hasUpgrade("des", 281) },
            req: [314],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("des", a)) return false
                return player.des.goldenMergents.gte(tmp.des.upgrades[this.id].cost) 
            },
            pay() { 
                let cost = tmp.des.upgrades[this.id].cost
                player.des.goldenMergents = player.des.goldenMergents.sub(cost) 
                player.des.goldenMergentsSpent = player.des.goldenMergentsSpent.add(cost) 
            },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
    },

    clickables: {
        101: {
            display() {
                return tmp.des.effect.goldenGain.gt(0) ? `Reset mergents for ${format(tmp.des.effect.goldenGain, 0)} golden mergents` :
                    "Requires 1.000e20 mergents"
            },
            unlocked: true,
            canClick() {
                return tmp.des.effect.goldenGain.gt(0)
            },
            onClick() {
                player.des.mergents = EN(0)
                player.des.accelerons = EN(0)
                player.des.mergeTime = 0
                player.des.autoTime = 0
                player.des.mergeLevel = 1
                player.des.mergeExp = 0
                player.des.magnets = EN(0)
                player.des.selectedMerge = ""
                player.des.mergeColors = {}
                player.des.bonusMerges = 0
                player.des.goldResetTime = 0
                for (let key in player.des.grid) {
                    player.des.grid[key] = { type: "", tier: 0 }
                }
                for (let a = 200; a <= 208; a++)
                    player.des.buyables[a] = EN(0)

                player.des.goldenMergents = player.des.goldenMergents.add(tmp.des.effect.goldenGain)
            },
            onHold() {
            },
            style: { ...smallClickable }
        },
    },

    buyables: {
        showRespec() {
            return true
        },
        respec() {
            layers.des.clickables[101].onClick()
            player.des.upgrades = player.des.upgrades.filter(x => +x < 200)
            player.des.goldenMergents = player.des.goldenMergents.add(player.des.goldenMergentsSpent)
            player.des.goldenMergentsSpent = EN(0)

            player.des.mergePool = ["multi", "accel", "sine", "desp", "spawn", "golden"]
            player.des.branchOrders = {}
            player.des.firstBranchs = 1
            player.des.powBranchs = 1
            player.des.lifeBranchs = 1
        },
        respecText() { return "Respec upgrade tree" },
        respecMessage() { 
            let msg = "Are you sure to respec the upgrade tree? This will do a golden mergent reset as well!" 
            if (hasUpgrade("des", 242) || hasUpgrade("des", 243)) msg += " You will not get your tokens back!"
            return msg
        },

        101: {
            ...despacitBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>DespATPT</h3>${data.purchaseLimit > 1 ? `\n(${format(x, 0)} / ${format(data.purchaseLimit, 0)})` : ""}
                    Gives 1 despacit mod everytime you buy a despacit upgrade, including this one.

                    Cost: ${format(data.cost, 0)} despacit points`
            },
            purchaseLimit() {
                let lim = getBuyableAmount("des", 112).gte(1) ? 4 : 1
                lim += 3 * getBuyableAmount("des", 123).toNumber()
                lim += getBuyableAmount("des", 134).toNumber()
                if (hasUpgrade("des", 235)) lim += 2
                return lim
            },
            unlocked() {
                return tmp.des.layerShown
            },
            effect() {
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                if (tmp[this.layer].buyables[this.id].purchaseLimit <= 1) x = EN(0)
                return x.mul(2).pow(x.mul(13).add(1)).div(EN.pow(data.purchaseLimit, getBuyableAmount("des", 104))).div(buyableEffect("des", 115))
            },
        },
        102: {
            ...despacitBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>TPT: Alternate</h3>${data.purchaseLimit > 1 ? `\n(${format(x, 0)} / ${format(data.purchaseLimit, 0)})` : ""}
                    This is an useless upgrade, you only need the despacit mod.

                    Cost: ${format(data.cost, 0)} despacit points`
            },
            purchaseLimit() {
                let lim = getBuyableAmount("des", 112).gte(1) ? 4 : 1
                lim += 3 * getBuyableAmount("des", 123).toNumber()
                lim += getBuyableAmount("des", 134).toNumber()
                if (hasUpgrade("des", 235)) lim += 2
                return lim
            },
            unlocked() {
                return getBuyableAmount("des", 101).gte(1)
            },
            effect() {
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                if (tmp[this.layer].buyables[this.id].purchaseLimit <= 1) x = EN(0)
                return EN.pow(32768, x).mul(16).div(EN.pow(data.purchaseLimit, getBuyableAmount("des", 104))).div(buyableEffect("des", 115))
            },
        },
        103: {
            ...despacitBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>Despacit Tree</h3>${data.purchaseLimit > 1 ? `\n(${format(x, 0)} / ${format(data.purchaseLimit, 0)})` : ""}
                    Boost to despacit points based on <b>DespATPT</b> and <b>TPT: Alternate</b> count.
                    Currently: ×${format(data.effect)}

                    Cost: ${format(data.cost, 0)} despacit points`
            },
            purchaseLimit() {
                let lim = 1
                lim += 3 * getBuyableAmount("des", 123).toNumber()
                lim += getBuyableAmount("des", 134).toNumber()
                if (hasUpgrade("des", 235)) lim += 2
                return lim
            },
            unlocked() {
                return getBuyableAmount("des", 112).gte(1)
            },
            effect() {
                let x = getBuyableAmount("des", 101).add(getBuyableAmount("des", 102))
                let eff = x.add(1).pow(0.4)
                if (getBuyableAmount("des", 113).gte(1)) eff = eff.pow(eff)
                if (getBuyableAmount("des", 133).gte(1)) eff = eff.pow(2)
                return eff
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                if (tmp[this.layer].buyables[this.id].purchaseLimit <= 1) x = EN(0)
                return EN.pow(1e9, x).mul(100000).div(EN.pow(data.purchaseLimit, getBuyableAmount("des", 104))).div(buyableEffect("des", 115))
            },
        },
        104: {
            ...despacitBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>Collab Tree (?)</h3>${data.purchaseLimit > 1 ? `\n(${format(x, 0)} / ${format(data.purchaseLimit, 0)})` : ""}
                    Divide the first 3×3 grid of upgrades' cost by their cap. Actually stacks with amount bought.

                    Cost: ${format(data.cost, 0)} despacit points`
            },
            purchaseLimit() {
                let lim = 4
                lim += getBuyableAmount("des", 134).toNumber()
                if (hasUpgrade("des", 235)) lim += 2
                return lim
            },
            unlocked() {
                return getBuyableAmount("des", 123).gte(1)
            },
            effect() {
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                if (tmp[this.layer].buyables[this.id].purchaseLimit <= 1) x = EN(0)
                return EN.pow(2e6, x).mul(2e11).div(buyableEffect("des", 115))
            },
        },
        105: {
            ...despacitBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>The Slow Tree</h3>${data.purchaseLimit > 1 ? `\n(${format(x, 0)} / ${format(data.purchaseLimit, 0)})` : ""}
                    Slowly gives despacit point gain bonus. Stacks.
                    Currently: ×${format(data.effect)}

                    Cost: ${format(data.cost, 0)} despacit points`
            },
            purchaseLimit() {
                let lim = 5
                if (hasUpgrade("des", 235)) lim += 2
                return lim
            },
            unlocked() {
                return getBuyableAmount("des", 134).gte(1)
            },
            effect() {
                return player.des.upg105Time.div(60).add(1).pow(softcap(player.des.upg105Time.add(1).log10().pow(2), EN(8), 0.4)).mul(buyableEffect("des", 125))
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                if (tmp[this.layer].buyables[this.id].purchaseLimit <= 1) x = EN(0)
                return EN.pow(2.222e22, x).mul(5.555e55)
            },
        },
        111: {
            ...despacitBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>tct-stresstest</h3>${data.purchaseLimit > 1 ? `\n(${format(x, 0)} / ${format(data.purchaseLimit, 0)})` : ""}
                    This is an useless upgrade, you only need the despacit mod.

                    Cost: ${format(data.cost, 0)} despacit points`
            },
            purchaseLimit() {
                let lim = getBuyableAmount("des", 112).gte(1) ? 4 : 1
                lim += 3 * getBuyableAmount("des", 123).toNumber()
                lim += getBuyableAmount("des", 134).toNumber()
                if (hasUpgrade("des", 235)) lim += 2
                return lim
            },
            unlocked() {
                return getBuyableAmount("des", 101).gte(1)
            },
            effect() {
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                if (tmp[this.layer].buyables[this.id].purchaseLimit <= 1) x = EN(0)
                return EN.pow(1048576, x).mul(256).div(EN.pow(data.purchaseLimit, getBuyableAmount("des", 104))).div(buyableEffect("des", 115))
            },
        },
        112: {
            ...despacitBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>tpt-plus</h3>${data.purchaseLimit > 1 ? `\n(${format(x, 0)} / ${format(data.purchaseLimit, 0)})` : ""}
                    You can rebuy previous upgrades 3 more times. Rebought upgrades do not affect effects.

                    Cost: ${format(data.cost, 0)} despacit points`
            },
            purchaseLimit() {
                let lim = 1
                lim += 3 * getBuyableAmount("des", 123).toNumber()
                lim += getBuyableAmount("des", 134).toNumber()
                if (hasUpgrade("des", 235)) lim += 2
                return lim
            },
            unlocked() {
                return getBuyableAmount("des", 101).gte(1)
            },
            effect() {
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                if (tmp[this.layer].buyables[this.id].purchaseLimit <= 1) x = EN(0)
                return EN.pow(500000000, x).mul(2500).div(EN.pow(data.purchaseLimit, getBuyableAmount("des", 104))).div(buyableEffect("des", 115))
            },
        },
        113: {
            ...despacitBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>Despacit Tree Δ</h3>${data.purchaseLimit > 1 ? `\n(${format(x, 0)} / ${format(data.purchaseLimit, 0)})` : ""}
                    Raises <b>Despacit Tree</b> effect by itself.

                    Cost: ${format(data.cost, 0)} despacit points`
            },
            purchaseLimit() {
                let lim = 1
                lim += 3 * getBuyableAmount("des", 123).toNumber()
                lim += getBuyableAmount("des", 134).toNumber()
                if (hasUpgrade("des", 235)) lim += 2
                return lim
            },
            unlocked() {
                return getBuyableAmount("des", 112).gte(1)
            },
            effect() {
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                if (tmp[this.layer].buyables[this.id].purchaseLimit <= 1) x = EN(0)
                return EN.pow(1e15, x).mul(35000000).div(EN.pow(data.purchaseLimit, getBuyableAmount("des", 104))).div(buyableEffect("des", 115))
            },
        },
        114: {
            ...despacitBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>The RPG Tree</h3>${data.purchaseLimit > 1 ? `\n(${format(x, 0)} / ${format(data.purchaseLimit, 0)})` : ""}
                    Despacit mods multiplies despacit point effect.

                    Cost: ${format(data.cost, 0)} despacit points`
            },
            purchaseLimit() {
                let lim = 1
                lim += getBuyableAmount("des", 134).toNumber()
                if (hasUpgrade("des", 235)) lim += 2
                return lim
            },
            unlocked() {
                return getBuyableAmount("des", 123).gte(1)
            },
            effect() {
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                if (tmp[this.layer].buyables[this.id].purchaseLimit <= 1) x = EN(0)
                return EN.pow(1.6e10, x).mul(3.2e16).div(buyableEffect("des", 115))
            },
        },
        115: {
            ...despacitBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>The Baba is you Tree</h3>${data.purchaseLimit > 1 ? `\n(${format(x, 0)} / ${format(data.purchaseLimit, 0)})` : ""}
                    Slowly reduces previous upgrades' cost. Stacks.
                    Currently: ÷${format(data.effect)}

                    Cost: ${format(data.cost, 0)} despacit points`
            },
            purchaseLimit() {
                let lim = 5
                if (hasUpgrade("des", 235)) lim += 2
                return lim
            },
            unlocked() {
                return getBuyableAmount("des", 134).gte(1)
            },
            effect() {
                return player.des.upg115Time.div(60).add(1).pow(softcap(player.des.upg115Time.add(1).log10().sqrt(), EN(3), 0.3)).mul(buyableEffect("des", 125))
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                if (tmp[this.layer].buyables[this.id].purchaseLimit <= 1) x = EN(0)
                return EN.pow(1e35, x).mul(1e87)
            },
        },
        121: {
            ...despacitBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>The Content Tree</h3>${data.purchaseLimit > 1 ? `\n(${format(x, 0)} / ${format(data.purchaseLimit, 0)})` : ""}
                    Boost to despacit points based on <b>DespATPT</b> and <b>tpt-stresstest</b> count.
                    Currently: ×${format(data.effect)}

                    Cost: ${format(data.cost, 0)} despacit points`
            },
            purchaseLimit() {
                let lim = 1
                lim += 3 * getBuyableAmount("des", 123).toNumber()
                lim += getBuyableAmount("des", 134).toNumber()
                if (hasUpgrade("des", 235)) lim += 2
                return lim
            },
            unlocked() {
                return getBuyableAmount("des", 112).gte(1)
            },
            effect() {
                let x = getBuyableAmount("des", 101).add(getBuyableAmount("des", 111))
                let eff = x.add(1).pow(0.4)
                if (getBuyableAmount("des", 122).gte(1)) eff = eff.pow(eff)
                if (getBuyableAmount("des", 133).gte(1)) eff = eff.pow(2)
                return eff
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                if (tmp[this.layer].buyables[this.id].purchaseLimit <= 1) x = EN(0)
                return EN.pow(2e12, x).mul(5000000).div(EN.pow(data.purchaseLimit, getBuyableAmount("des", 104))).div(buyableEffect("des", 115))
            },
        },
        122: {
            ...despacitBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>The Content^2 Tree</h3>${data.purchaseLimit > 1 ? `\n(${format(x, 0)} / ${format(data.purchaseLimit, 0)})` : ""}
                    Raises <b>The Content Tree</b> effect by itself.

                    Cost: ${format(data.cost, 0)} despacit points`
            },
            purchaseLimit() {
                let lim = 1
                lim += 3 * getBuyableAmount("des", 123).toNumber()
                lim += getBuyableAmount("des", 134).toNumber()
                if (hasUpgrade("des", 235)) lim += 2
                return lim
            },
            unlocked() {
                return getBuyableAmount("des", 112).gte(1)
            },
            effect() {
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                if (tmp[this.layer].buyables[this.id].purchaseLimit <= 1) x = EN(0)
                return EN.pow(1e18, x).mul(200000000).div(EN.pow(data.purchaseLimit, getBuyableAmount("des", 104))).div(buyableEffect("des", 115))
            },
        },
        123: {
            ...despacitBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>The Minecraft Tree</h3>${data.purchaseLimit > 1 ? `\n(${format(x, 0)} / ${format(data.purchaseLimit, 0)})` : ""}
                    Adds 3 to previous upgrades' cap. Despacit point effect boosts production.

                    Cost: ${format(data.cost, 0)} despacit points`
            },
            purchaseLimit() {
                let lim = 1 + getBuyableAmount("des", 124).toNumber() * 2 + getBuyableAmount("des", 134).toNumber()
                if (hasUpgrade("des", 235)) lim += 2
                return lim
            },
            unlocked() {
                return getBuyableAmount("des", 112).gte(1)
            },
            effect() {
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                if (tmp[this.layer].buyables[this.id].purchaseLimit <= 1) x = EN(0)
                return EN.pow(1e28, x).mul(5e9).div(EN.pow(data.purchaseLimit, getBuyableAmount("des", 104))).div(buyableEffect("des", 115))
            },
        },
        124: {
            ...despacitBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>This Will Not Be Referenced</h3>${data.purchaseLimit > 1 ? `\n(${format(x, 0)} / ${format(data.purchaseLimit, 0)})` : ""}
                    Adds 2 to <b>The Minecraft Tree</b>'s cap and make the effect stack.

                    Cost: ${format(data.cost, 0)} despacit points`
            },
            purchaseLimit() {
                let lim = 1 + getBuyableAmount("des", 134).toNumber()
                if (hasUpgrade("des", 235)) lim += 2
                return lim
            },
            unlocked() {
                return getBuyableAmount("des", 123).gte(1)
            },
            effect() {
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                if (tmp[this.layer].buyables[this.id].purchaseLimit <= 1) x = EN(0)
                return EN.pow(2.4e54, x).mul(1.28e36).div(buyableEffect("des", 115))
            },
        },
        125: {
            ...despacitBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>The ??? Tree</h3>${data.purchaseLimit > 1 ? `\n(${format(x, 0)} / ${format(data.purchaseLimit, 0)})` : ""}
                    Slowly increases the effect of the upper two upgrades. Stacks.
                    Currently: ×${format(data.effect)}

                    Cost: ${format(data.cost, 0)} despacit points`
            },
            purchaseLimit() {
                let lim = 5
                if (hasUpgrade("des", 235)) lim += 2
                return lim
            },
            unlocked() {
                return getBuyableAmount("des", 134).gte(1)
            },
            effect() {
                return player.des.upg125Time.div(60).add(1).pow(softcap(player.des.upg125Time.add(1).log10(), EN(3), 0.3))
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                if (tmp[this.layer].buyables[this.id].purchaseLimit <= 1) x = EN(0)
                return EN.pow(1e50, x).mul(1e100)
            },
        },
        131: {
            ...despacitBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>iik25wqIuFo</h3>${data.purchaseLimit > 1 ? `\n(${format(x, 0)} / ${format(data.purchaseLimit, 0)})` : ""}
                    Despacit mods multiplies production. Actually stacks with amount bought.

                    Cost: ${format(data.cost, 0)} despacit points`
            },
            purchaseLimit() {
                let lim = 4
                lim += getBuyableAmount("des", 134).toNumber()
                if (hasUpgrade("des", 235)) lim += 2
                return lim
            },
            unlocked() {
                return getBuyableAmount("des", 123).gte(1)
            },
            effect() {
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                if (tmp[this.layer].buyables[this.id].purchaseLimit <= 1) x = EN(0)
                return EN.pow(2e8, x).mul(2e12).div(buyableEffect("des", 115))
            },
        },
        132: {
            ...despacitBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>DespATPT^2</h3>${data.purchaseLimit > 1 ? `\n(${format(x, 0)} / ${format(data.purchaseLimit, 0)})` : ""}
                    Awards bonus despacit mods based on despacit effect. Stacks.
                    Currently: +${format(data.effect)}

                    Cost: ${format(data.cost, 0)} despacit points`
            },
            purchaseLimit() {
                let lim = 4
                lim += getBuyableAmount("des", 134).toNumber()
                if (hasUpgrade("des", 235)) lim += 2
                return lim
            },
            unlocked() {
                return getBuyableAmount("des", 123).gte(1)
            },
            effect() {
                return getBuyableAmount("des", this.id).mul(tmp.des.effect.compBonus.log())
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                if (tmp[this.layer].buyables[this.id].purchaseLimit <= 1) x = EN(0)
                return EN.pow(6.125e12, x).mul(1.25e25).div(buyableEffect("des", 115))
            },
        },
        133: {
            ...despacitBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>Treesury</h3>${data.purchaseLimit > 1 ? `\n(${format(x, 0)} / ${format(data.purchaseLimit, 0)})` : ""}
                    ^2 <b>Despacit Tree</b> and <b>The Content Tree</b> effect.

                    Cost: ${format(data.cost, 0)} despacit points`
            },
            purchaseLimit() {
                let lim = 1
                lim += getBuyableAmount("des", 134).toNumber()
                if (hasUpgrade("des", 235)) lim += 2
                return lim
            },
            unlocked() {
                return getBuyableAmount("des", 123).gte(1)
            },
            effect() {
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                if (tmp[this.layer].buyables[this.id].purchaseLimit <= 1) x = EN(0)
                return EN.pow(4.8e16, x).mul(2.4e32).div(buyableEffect("des", 115))
            },
        },
        134: {
            ...despacitBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>solar-recruitment</h3>${data.purchaseLimit > 1 ? `\n(${format(x, 0)} / ${format(data.purchaseLimit, 0)})` : ""}
                    Adds 1 to all previous upgrades' cap. Stacks

                    Cost: ${format(data.cost, 0)} despacit points`
            },
            purchaseLimit() {
                let lim = 5
                if (hasUpgrade("des", 235)) lim += 2
                return lim
            },
            unlocked() {
                return getBuyableAmount("des", 123).gte(1)
            },
            effect() {
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                if (tmp[this.layer].buyables[this.id].purchaseLimit <= 1) x = EN(0)
                return EN.pow(8e32, x).mul(6e48).div(buyableEffect("des", 115))
            },
        },
        135: {
            ...despacitBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>Producer Tree</h3>${data.purchaseLimit > 1 ? `\n(${format(x, 0)} / ${format(data.purchaseLimit, 0)})` : ""}
                    Slowly increases the time of the upper three upgrades. Stacks.
                    Currently: ×${format(data.effect)}

                    Cost: ${format(data.cost, 0)} despacit points`
            },
            purchaseLimit() {
                let lim = 5
                if (hasUpgrade("des", 235)) lim += 2
                return lim
            },
            unlocked() {
                return getBuyableAmount("des", 134).gte(1)
            },
            effect() {
                return player.des.upg135Time.add(Math.E).log()
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                if (tmp[this.layer].buyables[this.id].purchaseLimit <= 1) x = EN(0)
                return EN.pow(1e53, x).mul(1e106)
            },
        },
        200: {
            ...despacitBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>Faster Mergables</h3><br/>(${format(x, 0)} / ${data.purchaseLimit})
                    Make mergables spawn 1.1× faster.

                    Cost: ${format(data.cost, 0)} mergents`
            },
            purchaseLimit() {
                let lim = 20
                if (hasUpgrade("des", 251)) lim += 5
                for (let a = 311; a <= 314; a++) if (hasUpgrade("des", a)) lim += 5
                return lim
            },
            unlocked() {
                return true
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(x.sub(10).div(2).max(0).add(3), x).mul(1000)
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.des.mergents.gte(data.cost)
            }, 
            buy() { 
                if (!this.canAfford()) return
                let data = tmp[this.layer].buyables[this.id]
                player.des.mergents = player.des.mergents.sub(data.cost)
                player.des.buyables[this.id] = player.des.buyables[this.id].add(1)
            },
        },
        201: {
            ...despacitBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>Literally Gachapon</h3><br/>(${format(x, 0)})
                    Buy a random special mergable.

                    Cost: ${format(data.cost, 0)} mergents`
            },
            tooltip() {
                let pools = player.des.mergePool
                let pool = Math.max(Math.min(pools.length, player.des.buyables[this.id].toNumber() ** 0.5), 1)
                let str = ""
                let index = 0
                for (let item of pools) {
                    if (index >= pool) return "<h5>" + str
                    str += (str ? "<br/>" : "") + (player.des.gachaDraws[item] ? typeNames[item] : "?????") + ": " + format(Math.min(pool - index, 1) / pool * 100) + "%"
                    index += 1;
                }
                return "<h5>" + str
            },
            unlocked() {
                return true
            },
            cost() {
                let x = player[this.layer].buyables[this.id].sub(player.des.bonusMerges)
                return EN.pow(x.sub(250).max(0).mul(0.05).add(4), x).mul(2500)
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.des.mergents.gte(data.cost)
            }, 
            buy() { 
                if (!this.canAfford()) return
                let grid = player.des.grid
                let slots = Object.keys(grid).filter(x => !grid[x].type && layers[layer].grid.getUnlocked(x))
                if (slots.length) {
                    let slot = slots[Math.floor(Math.random() * slots.length)]
                    let pool = player.des.mergePool
                    let tier = 1
                    if (hasUpgrade("des", 238)) tier += Math.random() < .2 ? 1 : 0
                    let type = pool[Math.floor(Math.random() * Math.min(pool.length, player.des.buyables[this.id].toNumber() ** 0.5))]
                    player.des.grid[slot] = { type: type, tier: tier }
                    player.des.gachaDraws[type] = (player.des.gachaDraws[type] || 0) + 1
                    if (hasUpgrade("des", 284)) {
                        let mastery = (player.des.gachaMastery[type] || 0)
                        player.des.gachaMastery[type] = mastery + 0.001 / (1.25 ** mastery)
                    }
                    
                    let data = tmp[this.layer].buyables[this.id]
                    player.des.mergents = player.des.mergents.sub(data.cost)
                    player.des.buyables[this.id] = player.des.buyables[this.id].add(1)
                }
            },
        },
        202: {
            ...despacitBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>Better Mergables</h3><br/>(${format(x, 0)})
                    Increase the spawning tier of normal mergables by 1.

                    Cost: ${format(data.cost, 0)} mergents`
            },
            unlocked() {
                return true
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(x.sub(30).max(0).mul(0.1).add(5), x).mul(250000)
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.des.mergents.gte(data.cost)
            }, 
            buy() { 
                if (!this.canAfford()) return
                let data = tmp[this.layer].buyables[this.id]
                player.des.mergents = player.des.mergents.sub(data.cost)
                player.des.buyables[this.id] = player.des.buyables[this.id].add(1)

                for (let a in player.des.grid) if (player.des.grid[a].type == "normal") {
                    player.des.grid[a].tier = Math.max(player.des.grid[a].tier, player.des.buyables[this.id].toNumber() + 1)
                }
            },
        },
        203: {
            ...despacitBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>Scrapyard Expansion X</h3><br/>(${format(x, 0)} / 6)
                    Adds 1 more column to the merge field.

                    Cost: ${format(data.cost, 0)} mergents`
            },
            purchaseLimit: 6,
            unlocked() {
                return true
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(1e6, x.pow(2)).mul(1e9)
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.des.mergents.gte(data.cost)
            }, 
            buy() { 
                if (!this.canAfford()) return
                let data = tmp[this.layer].buyables[this.id]
                player.des.mergents = player.des.mergents.sub(data.cost)
                player.des.buyables[this.id] = player.des.buyables[this.id].add(1)
            },
        },
        204: {
            ...despacitBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>Scrapyard Expansion Y</h3><br/>(${format(x, 0)} / 6)
                    Adds 1 more row to the merge field.

                    Cost: ${format(data.cost, 0)} mergents`
            },
            purchaseLimit: 6,
            unlocked() {
                return true
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(1e9, x.pow(2)).mul(1e15)
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.des.mergents.gte(data.cost)
            }, 
            buy() { 
                if (!this.canAfford()) return
                let data = tmp[this.layer].buyables[this.id]
                player.des.mergents = player.des.mergents.sub(data.cost)
                player.des.buyables[this.id] = player.des.buyables[this.id].add(1)
            },
        },
        205: {
            ...despacitBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>Auto-Merge</h3><br/>(${format(x, 0)} / 30)
                    Unlocks auto-merge. Each level makes mergables auto-merge ${hasUpgrade("des", 275) ? "1.12" : "1.1"}× faster.

                    Cost: ${format(data.cost, 0)} mergents`
            },
            purchaseLimit: 30,
            unlocked() {
                return true
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(10, x.pow(hasUpgrade("des", 254) ? 1.5 : 1)).mul(1e6)
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.des.mergents.gte(data.cost)
            }, 
            buy() { 
                if (!this.canAfford()) return
                let data = tmp[this.layer].buyables[this.id]
                player.des.mergents = player.des.mergents.sub(data.cost)
                player.des.buyables[this.id] = player.des.buyables[this.id].add(1)
            },
        },
        206: {
            ...despacitBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>More Valuable Mergables</h3><br/>(${format(x, 0)})
                    Multiplies mergent gain by 1.2×.
                    Currently: ×${format(data.effect)}

                    Cost: ${format(data.cost, 0)} magnets`
            },
            unlocked() {
                return hasUpgrade("des", 212)
            },
            effect() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(1.2, x)
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                return x.add(1)
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.des.magnets.gte(data.cost)
            }, 
            buy() { 
                if (!this.canAfford()) return
                let data = tmp[this.layer].buyables[this.id]
                player.des.magnets = player.des.magnets.sub(data.cost)
                player.des.buyables[this.id] = player.des.buyables[this.id].add(1)
            },
        },
        207: {
            ...despacitBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>More Magnets</h3><br/>(${format(x, 0)} / 65)
                    Increases the chance of getting a magnet by 1%.
                    Currently: ${format(data.effect * 100, 0)}%

                    Cost: ${format(data.cost, 0)} mergents`
            },
            purchaseLimit: 65,
            unlocked() {
                return hasUpgrade("des", 212)
            },
            effect() {
                let x = player[this.layer].buyables[this.id]
                return x.toNumber() * 0.01 + 0.1
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(x.add(9), x).mul(100000)
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.des.mergents.gte(data.cost)
            }, 
            buy() { 
                if (!this.canAfford()) return
                let data = tmp[this.layer].buyables[this.id]
                player.des.mergents = player.des.mergents.sub(data.cost)
                player.des.buyables[this.id] = player.des.buyables[this.id].add(1)
            },
        },
        208: {
            ...despacitBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>More Magnets II</h3><br/>(${format(x, 0)} / 50)
                    Increases the chance of getting 2 magnets at once instead of 1.
                    Currently: ${format(data.effect * 100, 0)}%

                    Cost: ${format(data.cost, 0)} magnets`
            },
            purchaseLimit: 50,
            unlocked() {
                return hasUpgrade("des", 212)
            },
            effect() {
                let x = player[this.layer].buyables[this.id]
                return x.toNumber() * 0.01
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                return x.pow(2).add(x.mul(2)).add(10)
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.des.magnets.gte(data.cost)
            }, 
            buy() { 
                if (!this.canAfford()) return
                let data = tmp[this.layer].buyables[this.id]
                player.des.magnets = player.des.magnets.sub(data.cost)
                player.des.buyables[this.id] = player.des.buyables[this.id].add(1)
            },
        },
        300: {
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h2>${x.gte(10) ? "Upgrade Stars" : "Get a Star"}</h2><br/>(${format(x.min(10), 0)} / 10)
                    Each star gives a ${format(x.max(10), 0)}× boost to mergent gain!
                    Currently: ×${format(data.effect, 0)}

                    Cost: ${format(data.cost, 0)} golden mergents
                    Note: This is not refundable!`
            },
            unlocked() {
                return hasUpgrade("des", 103)
            },
            effect() {
                let x = player[this.layer].buyables[this.id]
                return x.max(10).pow(x.min(10))
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(3, x.min(10)).mul(EN.pow(1.2, x.sub(10).max(0))).mul(1000).div(buyableEffect("des", 301))
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.des.goldenMergents.gte(data.cost)
            }, 
            buy() { 
                if (!this.canAfford()) return
                let data = tmp[this.layer].buyables[this.id]
                player.des.goldenMergents = player.des.goldenMergents.sub(data.cost)
                player.des.buyables[this.id] = player.des.buyables[this.id].add(1)
            },
        },
        301: {
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h2>Mergeyard</h2><br/>(${format(x.div(10).floor(), 0)})
                    Spend mergents to reduce to star requirements!
                    Currently: ×${format(data.effect)}

                    Cost: ${format(data.cost)} mergents
                    Press ${format(x.mod(10).sub(10).neg(), 0)} more times to upgrade!`
            },
            unlocked() {
                return hasUpgrade("des", 241)
            },
            effect() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(1.1, x.div(10).floor().pow(0.9))
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(10, x.div(10).floor()).mul(1e50)
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.des.mergents.gte(data.cost)
            }, 
            buy() { 
                if (!this.canAfford()) return
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                let mul = hasUpgrade("des", 274) ? player.des.mergents.div(data.cost).floor().min(x.mod(10).sub(10).neg()) : 1
                player.des.mergents = player.des.mergents.sub(data.cost.mul(mul))
                player.des.buyables[this.id] = player.des.buyables[this.id].add(mul)
            },
        },
        302: {
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h2>Power Mergeyard</h2><br/>(${format(x.div(10).floor(), 0)})
                    Spend mergents to increase power token gain!
                    Currently: ×${format(data.effect)}

                    Cost: ${format(data.cost)} mergents
                    Press ${format(x.mod(10).sub(10).neg(), 0)} more times to upgrade!`
            },
            unlocked() {
                return hasUpgrade("des", 277)
            },
            effect() {
                let x = player[this.layer].buyables[this.id]
                return x.div(10).floor().mul(0.01).add(1)
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(100, x.div(10).floor()).mul(1e100)
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.des.mergents.gte(data.cost)
            }, 
            buy() { 
                if (!this.canAfford()) return
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                let mul = hasUpgrade("des", 274) ? player.des.mergents.div(data.cost).floor().min(x.mod(10).sub(10).neg()) : 1
                player.des.mergents = player.des.mergents.sub(data.cost.mul(mul))
                player.des.buyables[this.id] = player.des.buyables[this.id].add(mul)
            },
        },
        303: {
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h2>Life Mergeyard</h2><br/>(${format(x.div(10).floor(), 0)})
                    Spend mergents to increase power token gain!
                    Currently: ×${format(data.effect)}

                    Cost: ${format(data.cost)} mergents
                    Press ${format(x.mod(10).sub(10).neg(), 0)} more times to upgrade!`
            },
            unlocked() {
                return hasUpgrade("des", 278)
            },
            effect() {
                let x = player[this.layer].buyables[this.id]
                return x.div(10).floor().mul(0.01).add(1)
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(100, x.div(10).floor()).mul(1e100)
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.des.mergents.gte(data.cost)
            }, 
            buy() { 
                if (!this.canAfford()) return
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                let mul = hasUpgrade("des", 274) ? player.des.mergents.div(data.cost).floor().min(x.mod(10).sub(10).neg()) : 1
                player.des.mergents = player.des.mergents.sub(data.cost.mul(mul))
                player.des.buyables[this.id] = player.des.buyables[this.id].add(mul)
            },
        },
        304: {
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h2>Gacha Mergeyard</h2><br/>(${format(x.div(10).floor(), 0)})
                    Spend mergents to increase the bonus special mergable cap!
                    Currently: +${format(data.effect)}

                    Cost: ${format(data.cost)} mergents
                    Press ${format(x.mod(10).sub(10).neg(), 0)} more times to upgrade!`
            },
            unlocked() {
                return hasUpgrade("des", 325)
            },
            effect() {
                let x = player[this.layer].buyables[this.id]
                return x.div(10).floor().mul(4).toNumber()
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(10000, x.div(10).floor()).mul(1e180)
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.des.mergents.gte(data.cost)
            }, 
            buy() { 
                if (!this.canAfford()) return
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                let mul = hasUpgrade("des", 274) ? player.des.mergents.div(data.cost).floor().min(x.mod(10).sub(10).neg()) : 1
                player.des.mergents = player.des.mergents.sub(data.cost.mul(mul))
                player.des.buyables[this.id] = player.des.buyables[this.id].add(mul)
            },
        },
    },

    grid: {
        rows: 10,
        cols: 10,
        getStartData(id) {
            return { type: "", tier: 0 }
        },
        getUnlocked(id) { // Default
            let col = id % 100
            let row = Math.floor(id / 100)
            return row <= 4 + player.des.buyables[204].toNumber() && col <= 4 + player.des.buyables[203].toNumber()
        },
        getCanClick(data, id) {
            return true
        },
        onClick(data, id) { 
            if (!player.des.selectedMerge && data.type) player.des.selectedMerge = id
            else if (player.des.selectedMerge == id) player.des.selectedMerge = ""
            else if (data.tier == getGridData("des", player.des.selectedMerge).tier 
                && data.type == getGridData("des", player.des.selectedMerge).type) {
                setGridData("des", id, { type: data.type, tier: +data.tier + 1 })
                setGridData("des", player.des.selectedMerge, { type: "", tier: 0 })
                if (hasUpgrade("des", 211))
                    player.des.mergeExp += (hasUpgrade("des", 222) && Math.random() < 0.1 ? 2 : 1)
                        * (hasUpgrade("des", 232) && data.type !== "normal" ? 2 : 1)
                if (hasUpgrade("des", 212) && Math.random() <= buyableEffect("des", 207)) 
                    player.des.magnets = player.des.magnets.add((Math.random() <= buyableEffect("des", 208) ? 2 : 1)
                        * (hasUpgrade("des", 234) && data.type !== "normal" ? 3 : 1))
                player.des.selectedMerge = ""
            } else {
                setGridData("des", id, getGridData("des", player.des.selectedMerge))
                setGridData("des", player.des.selectedMerge, data)
                player.des.selectedMerge = ""
            }
        },
        getDisplay(data, id) {
            if (!data.type) return ""
            const effects = {
                normal: "+{} mergents per second",
                multi: "+{} mergent multiplier",
                accel: "+{} accelerons per second",
                sine: "+{} mergent multiplier",
                desp: "+{} mergent multi based on despacit mods",
                spawn: "+{} mergent multi based on your spawning tier",
                golden: "+{} golden mergent multiplier",
                rank: "+{} mergent multi based on merge level",
                metal: "+{} mergent multi based on your magnet upgrade",
                flame: "+{} mergent multi based on despacit effect",
                recur: "+{} mergent multi based on mergents",
                power: "+{} mergent multi based on power tokens",
                life: "+{} mergent multi based on life tokens",
                power2: "+{} bonus power token per second",
                life2: "+{} bonus life token per second",
                axisX: "+{} mergent multi based on merge field columns",
                axisY: "+{} mergent multi based on merge field row",
                luxury: "+{} mergent multi based on golden mergents",
                gacha: "+{} mergent multi based on gacha count",
            }

            return `<h3>${typeNames[data.type]}<br/>Tier ${formatRoman(data.tier)}</h3>
                ${effects[data.type].replace("{}", format(this.getEffect(data, id)))}
            `
        },
        getEffect(data, id) {
            if (!id) return 
            let power = EN.pow(3.2, data.tier + (player.des.gachaMastery[data.type] || 0) - 1)
            switch (data.type) {
                case "normal": return power
                case "multi": return power.mul(0.475)
                case "accel": return power
                case "sine": return power.mul(sin(player.timePlayed * 20) + Math.cos(player.timePlayed / 20) + 2).mul(0.25)
                case "desp": return power.mul(player.des.mods.add(hasUpgrade("des", 252) && tmp.des.effect.bonusMods ? tmp.des.effect.bonusMods.div(10) : 0)).div(400)
                case "spawn": return power.mul(getBuyableAmount("des", 202).add(1)).div(20)
                case "golden": return power.mul(0.05)
                case "rank": return power.mul(player.des.mergeLevel).mul(0.07)
                case "metal": return power.mul(getBuyableAmount("des", 206)).mul(0.05)
                case "flame": return power.mul(tmp.des.effect.compBonus ? tmp.des.effect.compBonus.log() : 1).mul(0.1)
                case "recur": return power.mul(player.des.mergents.add(1).log10().sqrt()).mul(0.18)
                case "power": return power.mul(player.des.powTokens.sqrt()).div(100)
                case "life": return power.mul(player.des.lifeTokens.sqrt()).div(100)
                case "power2": return power.mul(0.01)
                case "life2": return power.mul(0.01)
                case "axisX": return power.mul(player.des.buyables[204].add(4)).mul(0.01)
                case "axisY": return power.mul(player.des.buyables[205].add(4)).mul(0.01)
                case "luxury": return power.mul(player.des.goldenMergents.add(1).log10()).mul(0.15)
                case "gacha": return power.mul(player.des.buyables[201]).mul(0.02)
                default: return EN(0)
            }
        },
        getStyle(data, id) {
            if (!data.type) return {
                background: "#ffffff11",
                cursor: "default",
                transform: "none",
                "box-shadow": "none",
                "border-color": "#00000017",
                width: "100px", height: "100px",
            }
            
            if (player.des.selectedMerge == id) return {
                background: (data.type == "normal" ? "" : `url(resources/mergeIcons/${data.type}.png) border-box, `) + "#ffffff",
                transform: "translate(-3px, -3px)",
                "box-shadow": "3px 3px 5px black",
                "border-style": data.type == "normal" ? "" : "outset",
                "border-color": data.type == "normal" ? "#0000003f" : "#ffffff7f",
                width: "100px", height: "100px",
            }
            
            if (!player.des.mergeColors[data.type]) player.des.mergeColors[data.type] = Math.floor(Math.random() * 16777216)
            
            return {
                background: (data.type == "normal" ? "" : `url(resources/mergeIcons/${data.type}.png) border-box, `)
                    + getMergeColor(player.des.mergeColors[data.type], data.tier),
                transform: "none",
                "box-shadow": "none",
                "border-style": data.type == "normal" ? "" : "outset",
                "border-color": data.type == "normal" ? "#0000003f" : "#ffffff7f",
                width: "100px", height: "100px",
            }
        },
    },

    bars: {
        mergeBar: {
            direction: RIGHT,
            width: 400,
            height: 14,
            progress() { return player.des.mergeTime },
            display() { return player.des.mergeTime > 1 ? "+" + format(player.des.mergeTime - 1) : "" },
            textStyle: { color: "black", "font-size": "12px" },
        },
        autoBar: {
            direction: RIGHT,
            width: 400,
            height: 14,
            progress() { return player.des.autoTime },
            display() { return player.des.autoTime > 1 ? "+" + format(player.des.autoTime - 1) : "" },
            unlocked() { return getBuyableAmount("des", 205).gt(0) },
            borderStyle: { "margin-top": "10px" },
            textStyle: { color: "black", "font-size": "12px" },
        },
        levelBar: {
            direction: RIGHT,
            width: 400,
            height: 18,
            progress() { return player.des.mergeExp / (player.des.mergeLevel * 10) },
            display() { return format(player.des.mergeExp, 0) + " / " + format(player.des.mergeLevel * 10, 0) + " merges" },
            unlocked() { return hasUpgrade("des", 211) },
            borderStyle: { "margin-top": "2px" },
            fillStyle: { "background": "#59bd77" },
            baseStyle: { "background": "#3a704b" },
            textStyle: { color: "#1a3d25", "mix-blend-mode": "difference", "font-size": "14px" },
        },
        dispBar: {
            direction: DOWN,
            width: 32,
            height: () => 43 * player.des.mergePool.length,
            progress() { return getBuyableAmount("des", 201).sqrt().div(player.des.mergePool.length).toNumber() },
            borderStyle: { "margin-top": "2px" },
            fillStyle() { 
                return {
                    "background-image": "linear-gradient(#bdbd77, #bdbd77), linear-gradient(#59bd77, #59bd77)", 
                    "background-repeat": "no-repeat",
                    "background-size": "100% " + (Math.sqrt(player.des.bonusMerges) / player.des.mergePool.length * 100) + "%, 100% 100%",
                    "transition": "all 0.5s !important",
                }
            },
            baseStyle: { "background": "#3a704b" },
            borderStyle: { "margin-top": "-2px" },
            textStyle: { color: "#1a3d25", "mix-blend-mode": "difference", "font-size": "14px" },
        },
    },

    update(delta) {
        addPoints("des", tmp.des.effect.pointGain.mul(delta))
        player.des.upg105Time = player.des.upg105Time.add(getBuyableAmount("des", 105).mul(buyableEffect("des", 135)).mul(delta))
        player.des.upg115Time = player.des.upg115Time.add(getBuyableAmount("des", 115).mul(buyableEffect("des", 135)).mul(delta))
        player.des.upg125Time = player.des.upg125Time.add(getBuyableAmount("des", 125).mul(buyableEffect("des", 135)).mul(delta))
        player.des.upg135Time = player.des.upg135Time.add(getBuyableAmount("des", 135).mul(delta))

        if (hasUpgrade("des", 101)) {
            player.des.mergents = player.des.mergents.add(tmp.des.effect.mergentPerSec.mul(delta))
            player.des.accelerons = player.des.accelerons.add(tmp.des.effect.acceleronPerSec.mul(delta))

            player.des.goldResetTime += delta

            player.des.mergeTime += delta / 10 * Math.pow(1.1, getBuyableAmount("des", 200).toNumber())

            if (getBuyableAmount("des", 205).gte(1)) player.des.autoTime += delta / 15 * Math.pow(hasUpgrade("des", 275) ? 1.12 : 1.1, getBuyableAmount("des", 205).toNumber())
            if (player.des.mergeTime >= 1) {
                let grid = player.des.grid
                let slots = Object.keys(grid).filter(x => !grid[x].type && layers[layer].grid.getUnlocked(x))
                let bonus = 0
                if (hasUpgrade("des", 201)) bonus += Math.round(Math.random())
                if (hasUpgrade("des", 238)) bonus += Math.random() < .2 ? 1 : 0
                if (slots.length) {
                    while (slots.length && player.des.mergeTime > 1) {
                        let slot = slots[Math.floor(Math.random() * slots.length)]
                        if (hasUpgrade("des", 282) && player.des.bonusMerges < tmp.des.effect.maxBonusMerges && Math.random() < tmp.des.effect.bonusMergesChance) {
                            let pool = player.des.mergePool
                            let type = pool[Math.floor(Math.random() * Math.min(pool.length, player.des.buyables[201].toNumber() ** 0.5))]
                            player.des.grid[slot] = { type: type, tier: bonus + 1 }
                            player.des.gachaDraws[type] = (player.des.gachaDraws[type] || 0) + 1
                            if (hasUpgrade("des", 284)) {
                                let mastery = (player.des.gachaMastery[type] || 0)
                                player.des.gachaMastery[type] = mastery + 0.025 / (1.25 ** mastery)
                            }
                            player.des.bonusMerges++
                            player.des.buyables[201] = player.des.buyables[201].add(1)
                        } else player.des.grid[slot] = 
                            { type: "normal", tier: player.des.buyables[202].toNumber() + 1 + bonus }
                        slots.pop(slot)
                        player.des.mergeTime -= 1
                    }
                } else {
                    player.des.mergeTime = 1
                }
            }
            if (player.des.autoTime >= 1) {
                let map = {}
                let merged = false
                for (let a in player.des.grid) {
                    if (!player.des.grid[a].type) continue
                    let key = player.des.grid[a].type + player.des.grid[a].tier
                    if (map[key]) {
                        let data = player.des.grid[a]
                        setGridData("des", map[key], { type: data.type, tier: +data.tier + 1 })
                        setGridData("des", a, { type: "", tier: 0 })
                        if (hasUpgrade("des", 211)) 
                            player.des.mergeExp += (hasUpgrade("des", 222) && Math.random() < 0.1 ? 2 : 1)
                                * (hasUpgrade("des", 232) && data.type !== "normal" ? 2 : 1)
                        if (hasUpgrade("des", 212) && Math.random() <= buyableEffect("des", 207)) 
                            player.des.magnets = player.des.magnets.add((Math.random() <= buyableEffect("des", 208) ? 2 : 1) 
                                * (hasUpgrade("des", 234) && data.type !== "normal" ? 3 : 1))
                        merged = true
                        if (hasUpgrade("des", 254)) delete map[key]
                        else break;
                    } else {
                        map[key] = a
                    }
                }
                if (merged) player.des.autoTime -= 1
                else player.des.autoTime = 1
            }

            if (hasUpgrade("des", 211) && player.des.mergeExp >= player.des.mergeLevel * 10) {
                player.des.mergeExp -= player.des.mergeLevel * 10
                player.des.mergeLevel += 1
            }

            if (hasUpgrade("des", 242)) player.des.powTokens = player.des.powTokens.add(upgradeEffect("des", 242).mul(delta))
            if (hasUpgrade("des", 243)) player.des.lifeTokens = player.des.lifeTokens.add(upgradeEffect("des", 243).mul(delta))
        }

        if (hasUpgrade("des", 255)) {
            for (let a = 0; a <= 3; a++) for (let b = 1; b <= 5; b++) {
                buyBuyable("des", 100 + a * 10 + b)
            }
        }
        if (hasUpgrade("des", 256)) {
            for (let a = 200; a <= 208; a++) {
                buyBuyable("des", a)
            }
        }
        if (hasUpgrade("des", 276)) buyBuyable("des", 301)
    },

    microtabs: {
        main: {
            "main": {
                title: "Main",
                content: [
                    ["blank", "10px"],
                    ["column", createBuyableTable(1, 5, 5)],
                    ["blank", "10px"],
                    ["row", [["upgrade", 101], ["upgrade", 102], ["upgrade", 103]]],
                ],
            },
            "merge": {
                unlocked() { return hasUpgrade("des", 101) },
                title: "Mergents",
                content: [
                    ["blank", "10px"],
                    ["raw-html", () => `You have <h3>${format(player.des.mergents, 0)}</h3> (+${format(tmp.des.effect.mergentPerSec)}/s) mergents, which are giving ${format(tmp.des.effect.mergentBonus)} bonus despacit mods.`],
                    ["raw-html", () => tmp.des.effect.mergentMulti.gt(1) ? `Your current mergent multiplier is ×${format(tmp.des.effect.mergentMulti)}.` : ""],
                    ["raw-html", () => Object.keys(tmp.des.effect.mergentMultis).length > 1 ? `(${Object.keys(tmp.des.effect.mergentMultis).sort().map(x => format(tmp.des.effect.mergentMultis[x])).join("×")})` : ""],
                    ["raw-html", () => player.des.accelerons.gt(0) ? `You have ${format(player.des.accelerons, 0)} (+${format(tmp.des.effect.acceleronPerSec)}/s) accelerons, which are multiplying mergent gain by ×${format(tmp.des.effect.acceleronBonus)}.` : ""],
                    ["blank", "10px"],
                    ["raw-html", () => hasUpgrade("des", 211) ? `Your merge level is <h3>${format(player.des.mergeLevel, 0)}</h3>, which are giving you a ×${format(tmp.des.effect.levelBonus)} boost to mergent gain.` : ""],
                    ["bar", "levelBar"],
                    ["raw-html", () => hasUpgrade("des", 212) ? `You have <h3>${format(player.des.magnets, 0)}</h3> magnets.` : ""],
                    ["blank", "10px"],
                    ["raw-html", () => hasUpgrade("des", 282) ? `You have <h3>${format(player.des.bonusMerges, 0)} / ${format(tmp.des.effect.maxBonusMerges, 0)}</h3> bonus special mergables.` : ""],
                    ["raw-html", () => tmp.des.effect.bonusMergesChance > .1 ? `Your bonus special chance is ${format(tmp.des.effect.bonusMergesChance * 100)}%.` : ""],
                    ["blank", "10px"],
                    ["microtabs", "merge"]
                ],
            },
        },
        merge: {
            "main": {
                title: "Main",
                content: [
                    ["blank", "10px"],
                    ["bar", "mergeBar"],
                    ["bar", "autoBar"],
                    ["blank", "10px"],
                    "grid",
                    ["row", [["buyable", 200], ["buyable", 201], ["buyable", 202]]],
                    ["row", [["buyable", 203], ["buyable", 204], ["buyable", 205]]],
                    ["row", [["buyable", 206], ["buyable", 207], ["buyable", 208]]],
                ],
            },
            "golden": {
                unlocked() { return hasUpgrade("des", 102) },
                title: "Golden",
                content: [
                    ["blank", "10px"],
                    ["raw-html", () => `You have <h3>${format(player.des.goldenMergents, 0)}</h3> golden mergents, which are giving a ×${format(tmp.des.effect.goldenBonus)} bonus to mergent gain.`],
                    ["blank", "10px"],
                    ["clickable", "101"],
                    ["blank", "10px"],
                    "respec-button",
                    ["blank", "10px"],
                    ["column", [
                        ["row", [["upgrade", 201]]],
                        ["raw-html", `<div style="min-width:max-content">
                            <div style='display:inline-block;width:272.5px;margin-top:20px'>Leveling</div>
                            <div style='display:inline-block;width:272.5px;margin-top:20px'>Magnets</div>
                            <div style='display:inline-block;width:272.5px;margin-top:20px'>Pre-merge</div>
                            <div style='display:inline-block;width:272.5px;margin-top:20px'>Post-merge
                        `],
                        ["row", [["upgrade", 211], ["upgrade", 212], ["upgrade", 213], ["upgrade", 214]]],
                        ["row", [["upgrade", 221], ["upgrade", 222], ["upgrade", 223], ["upgrade", 224], ["upgrade", 225], ["upgrade", 226], ["upgrade", 227], ["upgrade", 228]]],
                        ["row", [["upgrade", 231], ["upgrade", 232], ["upgrade", 233], ["upgrade", 234], ["upgrade", 235], ["upgrade", 236], ["upgrade", 237], ["upgrade", 238]]],
                        ["row", [["upgrade", 244], ["upgrade", 245], ["upgrade", 241], ["upgrade", 246], ["upgrade", 247]]],
                        ["raw-html", () => hasUpgrade("des", 103) ? `<div style="min-width:max-content">
                            <div style='display:inline-block;width:407.5px;margin-top:20px'><h3>${format(player.des.powTokens, 0)}</h3> power tokens</div>
                            <div style='display:inline-block;width:407.5px;margin-top:20px'><h3>${format(player.des.lifeTokens, 0)}</h3> life tokens</div>
                        ` : ""],
                        ["row", [["upgrade", 242], ["upgrade", 243]]],
                        ["row", [["upgrade", 251], ["upgrade", 252], ["upgrade", 253], ["upgrade", 257], ["upgrade", 254], ["upgrade", 255], ["upgrade", 256]]],
                        ["row", [["upgrade", 261], ["upgrade", 262], ["upgrade", 263], ["upgrade", 267], ["upgrade", 268], ["upgrade", 264], ["upgrade", 265], ["upgrade", 266]]],
                        ["row", [["upgrade", 271], ["upgrade", 272], ["upgrade", 273], ["upgrade", 277], ["upgrade", 278], ["upgrade", 274], ["upgrade", 275], ["upgrade", 276]]],
                        ["row", [["upgrade", 281]]],
                        ["row", [["upgrade", 282]]],
                        ["row", [["upgrade", 283], ["upgrade", 284], ["upgrade", 285]]],
                        ["row", [["upgrade", 291], ["upgrade", 292], ["upgrade", 295], ["upgrade", 296], ["upgrade", 297], ["upgrade", 298], ["upgrade", 293], ["upgrade", 294]]],
                        ["row", [["upgrade", 301], ["upgrade", 302], ["upgrade", 303], ["upgrade", 304], ["upgrade", 305], ["upgrade", 306]]],
                        ["row", [["upgrade", 311], ["upgrade", 312], ["upgrade", 313], ["upgrade", 314]]],
                        ["row", [["upgrade", 321], ["upgrade", 322], ["upgrade", 323], ["upgrade", 324], ["upgrade", 325], ["upgrade", 326], ["upgrade", 327], ["upgrade", 328]]],
                    ], {width: "max-content"}],
                ],
            },
            "star": {
                unlocked() { return hasUpgrade("des", 103) },
                title: "Stars",
                content: [
                    ["blank", "10px"],
                    ["raw-html", () => `You have <h3>${format(player.des.goldenMergents, 0)}</h3> golden mergents, which are giving a ×${format(tmp.des.effect.goldenBonus)} bonus to mergent gain.`],
                    ["blank", "10px"],
                    ["buyable", 300],
                    ["row", [["buyable", 301], ["buyable", 302], ["buyable", 303], ["buyable", 304]]],
                ],
            },
            "gacha": {
                unlocked() { return player.des.mergePool.length > 6 },
                title: "Gachapon",
                content: [
                    ["blank", "10px"],
                    ["raw-html", () => `
                        <h5>This is your current gacha pool, which determines what will be pulled when you buy the <b>Literally Gachapon</b> upgrade.<br/>
                        The more you draw, the more frequently the lowest item will be in the next draw, but so will make others less likely to be drawn again.</h5>
                    `],
                    ["blank", "10px"],
                    ["row", [["gacha-items", () => player.des.mergePool], ["bar", "dispBar"]]],
                ],
            },
        },
    },

    tabFormat: [
        "main-display",
        "prestige-button",
        ["blank", "10px"],
        ["raw-html", () => `You have <h3>${format(player.des.mods, 0)}</h3> ${(tmp.des.effect.bonusMods.gt(0) ? ` (+${format(tmp.des.effect.bonusMods)})` : "")} despacit mods, which are producing ${format(tmp.des.effect.pointGain)} despacit points.`],
        ["blank", "10px"],
        ["microtabs", "main"],
        ["blank", "20px"],
    ],

})