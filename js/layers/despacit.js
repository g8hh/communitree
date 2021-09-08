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
let giftBuyable = {
    title() {
        return ""
    }, 
    canAfford() {
        let data = tmp[this.layer].buyables[this.id]
        return player.des.giftPoints.gte(data.cost)
    }, 
    buy() { 
        let data = tmp[this.layer].buyables[this.id]
        if (player.des.giftPoints.lt(data.cost)) return;
        player.des.giftPoints = player.des.giftPoints.sub(data.cost)
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

function clickGachaMerge(type) {
    let sel = player.des.selectedGachaMerge
    if (!sel) player.des.selectedGachaMerge = type
    else if (sel == type) player.des.selectedGachaMerge = ""
    else if (player.des.gachaMerges[sel] == player.des.gachaMerges[type]) {
        player.des.gachaMerges[type]++
        delete player.des.gachaMerges[sel]
        player.des.selectedGachaMerge = ""
    } else {
        let data = player.des.gachaMerges[type]
        player.des.gachaMerges[type] = player.des.gachaMerges[sel]
        player.des.gachaMerges[sel] = data
        player.des.selectedGachaMerge = ""
    }
}

function getMergeGachaStyle(id) {
    let data = player.des.gachaMerges[id]
    if (!data) return {
        background: "#ffffff11",
        cursor: "default",
        transform: "none",
        "box-shadow": "none",
        "border-color": "#00000017",
    }
    
    if (player.des.selectedGachaMerge == id) return {
        background: "#ffffff",
        transform: "translate(-3px, -3px)",
        "box-shadow": "3px 3px 5px black",
        "border-style": "outset",
        "border-color": "#ffffff7f",
    }
    
    return {
        background: getMergeColor(133742069, data),
        transform: "none",
        "box-shadow": "none",
        "border-style": "outset",
        "border-color": "#ffffff7f",
    }
}

Math.randomFloor = (max) => Math.floor(Math.random() * max)

function generateCode() {
    let seed = Math.floor(Math.random() * 3)
    let words = [
        "gacha", "merge", "life", "power", "summer", "winter", "cm", "tree", "prestige", "despacit",
        "number", "idle", "comm", "mod", "communitree", "large", "christmas", "easter", "father", "mother",
        "patrick", "luck", "code", "game", "incremental", "newyear", "community", "lgbt", "pride", "candy",
        "lollipop", "dimension", "prestige", "something"
    ]
    let chars = "abcdefghijklmnopqrstuvwxyz0123456789"
    let num = Math.random() > .5 ? Math.randomFloor(10000) : (Math.randomFloor(4) + 6).toString().repeat(Math.floor(Math.random() * 3 + 2))
    let len = Math.randomFloor(4) + 6
    let str = ""
    switch (seed) {
        case 0:
            return words[Math.randomFloor(words.length)] + num
        case 1: 
            while (str.length < len) str += chars[Math.randomFloor(chars.length)]
            return str
        case 2:
            chars = Math.random() > .5 ? "abcdefghijklmnopqrstuvwxyz" : "aeiou"
            str += chars[Math.randomFloor(chars.length)]
            chars = Math.random() > .5 ? "abcdefghijklmnopqrstuvwxyz" : "aeiou"
            str += chars[Math.randomFloor(chars.length)]
            return str + num
    }
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
        gachaMerges: {},
        selectedGachaMerge: "",
        gachaMergeTime: 0,
        gachaAutoTime: 0,
        gachaCycleTime: 0,

        giftPoints: EN(0),
        currentCode: generateCode(),
        giftcodeInput: "",
        consoleLines: ["", "", "", "", "", "", "",
            "-------- Welcome to Giftcode Generator --------", 
            "Please input giftcodes shown below into the box",
            "then press [ENTER] for some rewards"
        ],
        giftHunterEnabled: false,
        giftHunterState: 0,
        giftHunterInventory: {
            doubler: 1,
        },
        giftHunterStates: {},
        giftHunterMulti: EN(1),
        giftHunterGameData: {},
    }},

    resource: "despacit points",
    color: "#6eff55",
    type: "none",
    
    effect() {
        if (tmp[this.layer].deactivated) return {}

        let bonus = buyableEffect("des", 132).add(buyableEffect("des", 431))
        for (let a = 302; a <= 305; a++) if (hasUpgrade("des", a)) bonus = bonus.add(upgradeEffect("des", a))
        let mb = player.des.mergents.add(1).log().pow(1.5)
        bonus = bonus.add(mb)
        let mods = player.des.mods.add(bonus)

        let eff = {
            bonusMods: bonus,
            compBonus: EN.pow(2, player.des.points.add(1).log10().pow(0.2)).mul(buyableEffect("des", 421)),
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
            giftMulti: buyableEffect("des", 413).mul(buyableEffect("des", 422)).mul(buyableEffect("des", 423)).mul(buyableEffect("des", 424)).mul(buyableEffect("des", 433))
                .mul(buyableEffect("des", 434)).mul(player.des.giftHunterMulti),
        }

        eff.compBonus = eff.compBonus.mul(buyableEffect("des", 441))
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
        if (hasUpgrade("des", 331)) eff.maxBonusMerges += 30
        if (hasUpgrade("des", 332)) eff.maxBonusMerges += 30
        if (hasUpgrade("des", 333)) eff.maxBonusMerges += 100
        if (hasUpgrade("des", 334)) eff.maxBonusMerges += 100
        if (hasUpgrade("des", 335)) eff.maxBonusMerges += 200

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
        104: {
            title: "Gacha Mergables",
            description: "Unlocks Gacha Mergables.",
            cost: EN("1e1550"),
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
                if (tmp[this.layer].deactivated) return EN(1)
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
                if (tmp[this.layer].deactivated) return EN(1)
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
                if (tmp[this.layer].deactivated) return EN(1)
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
                if (tmp[this.layer].deactivated) return EN(1)
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
                if (tmp[this.layer].deactivated) return EN(1)
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
                if (tmp[this.layer].deactivated) return EN(1)
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
                if (tmp[this.layer].deactivated) return EN(1)
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
            description: "Pressing on Mergeyard will now spend the most amount of mergents until the next upgrade.",
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
        331: {
            title: "uf4shqjngq",
            description: "Increases the bonus mergable cap by 30.",
            currencyDisplayName: "golden mergents",
            cost: () => EN(hasUpgrade("des", 332) ? 3e13 : 1e13),
            unlocked() { return hasUpgrade("des", 281) },
            req: [321, 322],
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
        332: {
            title: "dqy4aq3pym",
            description: "Increases the bonus mergable cap by 30.",
            currencyDisplayName: "golden mergents",
            cost: () => EN(hasUpgrade("des", 331) ? 3e13 : 1e13),
            unlocked() { return hasUpgrade("des", 281) },
            req: [327, 328],
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
        333: {
            title: "summer777",
            description: "Increases the bonus mergable cap by 100.",
            currencyDisplayName: "golden mergents",
            cost: () => EN(hasUpgrade("des", 334) ? 5e14 : 1e14),
            unlocked() { return hasUpgrade("des", 281) },
            req: [323, 324],
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
        334: {
            title: "WE-[redacted]",
            description: "Increases the bonus mergable cap by 100.",
            currencyDisplayName: "golden mergents",
            cost: () => EN(hasUpgrade("des", 333) ? 5e14 : 1e14),
            unlocked() { return hasUpgrade("des", 281) },
            req: [325, 326],
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
        335: {
            title: "YH8888",
            description: "Increases the bonus mergable cap by 200.",
            currencyDisplayName: "golden mergents",
            cost: EN(5e15),
            unlocked() { return hasUpgrade("des", 281) },
            req: [324, 325],
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
        336: {
            title: "Giftcode Generator",
            description: "Unlocks the Giftcode Generator, which is the next tab of the layer.",
            currencyDisplayName: "golden mergents",
            cost: EN(1e18),
            unlocked() { return hasUpgrade("des", 281) },
            req: [331, 332, 333, 334, 335],
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
        401: {
            title: "Giftcode Hunter",
            description: "Unlocks the Giftcode Hunter minigame. Type \"run giftcode hunter\" to start.",
            cost: EN(1e188),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "gift points",
            currencyInternalName: "giftPoints",
        },
        402: {
            title: "Automator",
            description: "Automates <b>Loyal Player</b>.",
            unlocked() { return player.des.giftHunterStates.game3 },
            cost: EN(1e210),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "gift points",
            currencyInternalName: "giftPoints",
        },
        403: {
            title: "Automator II",
            description: "Automates <b>gift1337</b>.",
            unlocked() { return player.des.giftHunterStates.game3 },
            cost: EN(1e250),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "gift points",
            currencyInternalName: "giftPoints",
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
                if (tmp[this.layer].deactivated) return false
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
            player.des.upgrades = player.des.upgrades.filter(x => +x < 200 || +x > 400)
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
                if (tmp[this.layer].deactivated) return EN(0)
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
        411: {
            ...giftBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>Auto-Gacha-Merge</h3>\n(${format(x, 0)} / ${format(data.purchaseLimit, 0)})
                Unlocks auto-merge for gacha mergents. Each level makes it 1.05× faster.

                Cost: ${format(data.cost, 0)} gift points`
            },
            purchaseLimit: 50,
            effect() {
                let x = player[this.layer].buyables[this.id]
                return 1.05 ** x.toNumber()
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(1.4, x).mul(100)
            },
        },
        412: {
            ...giftBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>Giftcode Macros</h3>\n(${format(x, 0)} / ${format(data.purchaseLimit, 0)})
                Generates 1 gift points per second.

                Cost: ${format(data.cost, 0)} gift points`
            },
            purchaseLimit: 100,
            effect() {
                let x = player[this.layer].buyables[this.id]
                return 1.05 ** x.toNumber()
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(2, x).mul(100)
            },
        },
        413: {
            ...giftBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>Loyal Player</h3>\n(${format(x, 0)})
                Add a 40% bonus to all gift point gain, compounding.
                Currently: ×${format(data.effect)}

                Cost: ${format(data.cost, 0)} gift points`
            },
            effect() {
                let x = softcap(player[this.layer].buyables[this.id], EN(250), .8)
                return EN(1.4).pow(x)
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(2, x).mul(250)
            },
        },
        414: {
            ...giftBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>Keep Grinding</h3>\n(${format(x, 0)} / ${format(data.purchaseLimit, 0)})
                Add a 50% bonus to gift points gained from entering codes, additively.
                Currently: ×${format(data.effect)}

                Cost: ${format(data.cost, 0)} gift points`
            },
            purchaseLimit: 25,
            effect() {
                let x = player[this.layer].buyables[this.id]
                return x.mul(0.5).add(1)
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(2, x).mul(1000)
            },
        },
        421: {
            ...giftBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>gift1337</h3>\n(${format(x, 0)})
                Boosts despacit effect based on gift points.
                Currently: ×${format(data.effect)}

                Cost: ${format(data.cost, 0)} gift points`
            },
            effect() {
                let x = player[this.layer].buyables[this.id]
                return player.des.giftPoints.pow(0.1).add(10).log(10).pow(x)
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(x.add(9), x).mul(1e20)
            },
        },
        422: {
            ...giftBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>mod9999</h3>\n(${format(x, 0)} / ${format(data.purchaseLimit, 0)})
                Boosts gift points based on bonus despacit mods.
                Currently: ×${format(data.effect)}

                Cost: ${format(data.cost, 0)} gift points`
            },
            purchaseLimit: 80,
            effect() {
                if (tmp[this.layer].deactivated) return EN(1)
                let x = player[this.layer].buyables[this.id]
                return tmp.des.effect.bonusMods.div(100).add(1).pow(0.1).pow(x)
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(x.add(4), x).mul(10000)
            },
        },
        423: {
            ...giftBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>flame777</h3>\n(${format(x, 0)} / ${format(data.purchaseLimit, 0)})
                Boosts gift points based on despacit effect.
                Currently: ×${format(data.effect)}

                Cost: ${format(data.cost, 0)} gift points`
            },
            purchaseLimit: 80,
            effect() {
                if (tmp[this.layer].deactivated) return EN(1)
                let x = player[this.layer].buyables[this.id]
                return tmp.des.effect.compBonus.add(2).log().div(Math.LOG2E).pow(0.2).pow(x)
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(x.add(3), x).mul(20000)
            },
        },
        424: {
            ...giftBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>despacit88</h3>\n(${format(x, 0)} / ${format(data.purchaseLimit, 0)})
                Boosts gift points based on despacit points.
                Currently: ×${format(data.effect)}

                Cost: ${format(data.cost, 0)} gift points`
            },
            purchaseLimit: 80,
            effect() {
                let x = player[this.layer].buyables[this.id]
                return player.des.points.add(10).log10().pow(0.05).pow(x)
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(x.add(2), x).mul(50000)
            },
        },
        431: {
            ...giftBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>The Present Tree</h3>\n(${format(x, 0)})
                Gives bonus despacit mods based on gift points.
                Currently: +${format(data.effect, 0)}

                Cost: ${format(data.cost, 0)} gift points`
            },
            effect() {
                let x = player[this.layer].buyables[this.id]
                return player.des.giftPoints.add(1).log10().pow(2).floor().mul(x)
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(x.add(9).pow(2), x).mul(1e40)
            },
        },
        432: {
            ...giftBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>Conveyor Belts</h3>\n(${format(x, 0)} / ${format(data.purchaseLimit, 0)})
                Make the gacha mergables cycle. Each level makes it 1.05× faster.

                Cost: ${format(data.cost, 0)} gift points`
            },
            purchaseLimit: 25,
            unlocked() {
                return getBuyableAmount("des", 123).gte(1)
            },
            effect() {
                let x = softcap(player[this.layer].buyables[this.id], EN(10), .5)
                return 1.05 ** x.toNumber()
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(x.add(19).pow(2), x).mul(1e60)
            },
        },
        433: {
            ...giftBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>APTMAM: Rewritten</h3>\n(${format(x, 0)})
                Boosts gift points based on mergents.
                Currently: ×${format(data.effect)}

                Cost: ${format(data.cost, 0)} gift points`
            },
            effect() {
                let x = player[this.layer].buyables[this.id]
                return player.des.mergents.add(10).log10().pow(0.1).pow(x)
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(x.add(9).pow(2), x).pow(1.2).mul(1e100)
            },
        },
        434: {
            ...giftBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>Mods, for real</h3>\n(${format(x, 0)})
                Boosts gift points based on non-bonus despacit mods.
                Currently: ×${format(data.effect)}

                Cost: ${format(data.cost, 0)} gift points`
            },
            effect() {
                let x = player[this.layer].buyables[this.id]
                return player.des.mods.add(1).pow(0.2).pow(x)
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(x.add(4), x).mul(1e160)
            },
        },
        441: {
            ...giftBuyable,
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>Flame Master</h3>\n(${format(x, 0)})
                Giftcode Hunter multiplier multiplies despacit effect.
                Currently: ×${format(data.effect)}

                Cost: ${format(data.cost, 0)} gift points`
            },
            unlocked() {
                return player.des.giftHunterStates.game3
            },
            effect() {
                let x = player[this.layer].buyables[this.id]
                return player.des.giftHunterMulti.pow(x)
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(EN.pow(10, x).mul(1e8), x).mul(1e225)
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
            let tier = data.tier + (player.des.gachaMastery[data.type] || 0) - 1
            if (player.des.gachaMerges[data.type]) tier = EN.pow(2.4, player.des.gachaMerges[data.type]).mul(0.001).add(tier)
            let power = EN.pow(3.2, tier)
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
        gachaMergeBar: {
            direction: UP,
            width: 16,
            height: () => 43 * player.des.mergePool.length,
            progress() { return player.des.gachaMergeTime },
            display() { return player.des.gachaMergeTime > 1 ? "+" + format(player.des.gachaMergeTime - 1) : "" },
            borderStyle: { transform: "translateY(-2px)" },
            unlocked() { return hasUpgrade("des", 104) },
        },
        gachaAutoBar: {
            direction: UP,
            width: 8,
            height: () => 43 * player.des.mergePool.length,
            progress() { return player.des.gachaAutoTime },
            display() { return player.des.gachaAutoTime > 1 ? "+" + format(player.des.gachaAutoTime - 1) : "" },
            borderStyle: { transform: "translateY(-2px)", "margin-right": "4px" },
            unlocked() { return getBuyableAmount("des", 411).gt(0) },
        },
        gachaCycleBar: {
            direction: DOWN,
            width: 8,
            height: () => 43 * player.des.mergePool.length,
            progress() { return player.des.gachaCycleTime },
            display() { return player.des.gachaCycleTime > 1 ? "+" + format(player.des.gachaCycleTime - 1) : "" },
            borderStyle: { transform: "translateY(-2px)", "margin-right": "4px" },
            unlocked() { return getBuyableAmount("des", 411).gt(0) },
        },
    },

    update(delta) {
        if (tmp[this.layer].deactivated) return

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
                        if (hasUpgrade("des", 282) && player.des.bonusMerges < tmp.des.effect.maxBonusMerges && tmp.des.effect.mergentPerSec.gt(0) && Math.random() < tmp.des.effect.bonusMergesChance) {
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

        if (hasUpgrade("des", 104)) {
            player.des.gachaMergeTime += delta / 5
            if (player.des.buyables[411].gt(0)) player.des.gachaAutoTime += delta / 15 * buyableEffect("des", 411)
            if (player.des.buyables[432].gt(0)) player.des.gachaCycleTime += delta / 15 * buyableEffect("des", 432)

            if (player.des.gachaMergeTime >= 1) {
                let grid = player.des.mergePool
                let slots = grid.filter(x => !player.des.gachaMerges[x])
                let bonus = 0
                if (slots.length) {
                    while (slots.length && player.des.gachaMergeTime > 1) {
                        let slot = slots[Math.floor(Math.random() * slots.length)]
                        player.des.gachaMerges[slot] = 1
                        slots.pop(slot)
                        player.des.gachaMergeTime -= 1
                    }
                } else {
                    player.des.gachaMergeTime = 1
                }
            }
            if (player.des.gachaAutoTime >= 1) {
                let map = {}
                let merged = false
                for (let a in player.des.gachaMerges) {
                    if (!player.des.gachaMerges[a]) continue
                    let key = player.des.gachaMerges[a]
                    if (map[key]) {
                        let data = player.des.gachaMerges[a]
                        player.des.gachaMerges[map[key]] = data + 1
                        delete player.des.gachaMerges[a]
                        merged = true
                        break;
                    } else {
                        map[key] = a
                    }
                }
                if (merged) player.des.gachaAutoTime -= 1
                else player.des.gachaAutoTime = 1
            }
            if (player.des.gachaCycleTime >= 1) {
                let array = player.des.gachaMerges
                let keys = [...player.des.mergePool]
                let newArray = {}
                let newKeys = [...keys]
                keys.push(keys.shift())
                for (let a = 0; a < keys.length; a++) if (array[keys[a]]) {
                    newArray[newKeys[a]] = array[keys[a]]
                }
                player.des.gachaMerges = newArray;
                player.des.gachaCycleTime = 0;
            }

            player.des.giftPoints = player.des.giftPoints.add(getBuyableAmount("des", 412).mul(tmp.des.effect.giftMulti).mul(delta))
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
        if (hasUpgrade("des", 402)) buyBuyable("des", 413)
        if (hasUpgrade("des", 403)) buyBuyable("des", 421)

        if (player.des.giftHunterEnabled) {
            if (player.des.giftcodeInput == "exit") {
                player.des.consoleLines = ["", "", "", "", "", "", "",
                    "-------- Welcome to Giftcode Generator --------", 
                    "Please input giftcodes shown below into the box",
                    "then press [ENTER] for some rewards"
                ]

                if (player.des.giftHunterStates.msg1 && !player.des.giftHunterStates.msg1Reddemed)
                    consolePrint(`Try the gift code "v903.1624update"`)
                else if (player.des.giftHunterStates.msg2 && !player.des.giftHunterStates.msg2Reddemed)
                    consolePrint(`Try the gift code "wearesorry"`)
                else if (player.des.giftHunterStates.msg3 && !player.des.giftHunterStates.msg3Reddemed)
                    consolePrint(`Try the gift code "newupdate"`)
                else if (player.des.giftHunterStates.msg4 && !player.des.giftHunterStates.msg4Reddemed)
                    consolePrint(`Try the gift code "yadmir2164"`)
                else if (player.des.giftHunterStates.chat1 && !player.des.giftHunterStates.chat1Reddemed)
                    consolePrint(`Try the gift code "christmas_event_perm"`)

                player.des.giftHunterEnabled = false
                player.des.giftcodeInput = ""
            }
            if (player.des.giftHunterGameData.id) {
                let state = player.des.giftHunterState
                if (player.des.giftcodeInput == "up" || player.des.giftcodeInput == "w") {
                    giftHunterGameMoveRelative([1, 0])
                    player.des.consoleLines = getGiftHunterGameDisplay();
                    player.des.giftcodeInput = ""
                } else if (player.des.giftcodeInput == "down" || player.des.giftcodeInput == "s") {
                    giftHunterGameMoveRelative([-1, 0])
                    player.des.consoleLines = getGiftHunterGameDisplay();
                    player.des.giftcodeInput = ""
                } else if (player.des.giftcodeInput == "left" || player.des.giftcodeInput == "a") {
                    giftHunterGameMoveRelative([0, -1])
                    player.des.consoleLines = getGiftHunterGameDisplay();
                    player.des.giftcodeInput = ""
                } else if (player.des.giftcodeInput == "right" || player.des.giftcodeInput == "d") {
                    giftHunterGameMoveRelative([0, 1])
                    player.des.consoleLines = getGiftHunterGameDisplay();
                    player.des.giftcodeInput = ""
                } else if (player.des.giftcodeInput == "restart") {
                    startGiftHunterGame(player.des.giftHunterGameData.id)
                    player.des.consoleLines = getGiftHunterGameDisplay();
                    player.des.giftcodeInput = ""
                }
                if (player.des.giftHunterState != state) {
                    for (let msg of giftHunter[player.des.giftHunterState].message) consolePrint(msg)
                }
            } else if (player.des.giftcodeInput == "clear") {
                player.des.consoleLines = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
                for (let msg of giftHunter[player.des.giftHunterState].message) consolePrint(msg)
                consolePrint(" ")
                player.des.giftcodeInput = ""
            } else if (player.des.giftcodeInput) {
                consolePrint("> " + player.des.giftcodeInput)
                let input = player.des.giftcodeInput.split(" ")
                player.des.giftcodeInput = ""
                
                if (input[0] == "") {
                    consolePrint("I beg your pardon?")
                } else if (input[0] == "help") {
                    consolePrint("Command list (beside those that are listed at the bottom of the game):")
                    consolePrint("| clear    | exit     | help     | multi    |          |          |")
                } else if (input[0] == "multi") {
                    consolePrint(`Your current Giftcode Hunter multiplier is ×${format(player.des.giftHunterMulti)}.`)
                    consolePrint(`This mutliplier boosts your gift point gain.`)
                } else if (giftHunter[player.des.giftHunterState].commands.includes(input[0])) {
                    let state = player.des.giftHunterState
                    giftHunter[player.des.giftHunterState].onCommand(input)
                    if (player.des.giftHunterState != state) {
                        for (let msg of giftHunter[player.des.giftHunterState].message) consolePrint(msg)
                    }
                    if (player.des.giftHunterGameData.id) {
                        player.des.consoleLines = getGiftHunterGameDisplay();
                        consolePrint(" ")
                        consolePrint("Welcome to The Towers (tm)!")
                        consolePrint("Rules: w = up, s = down, a = left, d = right")
                        consolePrint("You know what else to do ;P")
                    }
                } else {
                    consolePrint(`I dont know what "${input[0]}" means.`)
                    consolePrint(`Type "help" for a list of commands.`)
                }
                consolePrint(" ")
            }
        } else {
            if (player.des.currentCode == player.des.giftcodeInput) {
                let gain = EN(player.des.currentCode.length).mul(buyableEffect("des", 414)).mul(tmp.des.effect.giftMulti)
                player.des.giftPoints = player.des.giftPoints.add(gain)
                consolePrint("[REDEEMED] " + player.des.currentCode + " -> " + format(gain, 0) + " GP")
                player.des.currentCode = generateCode();
                player.des.giftcodeInput = "";
            } else if (hasUpgrade("des", 401) && player.des.giftcodeInput == "run giftcode hunter") {
                player.des.consoleLines = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
                for (let msg of giftHunter[player.des.giftHunterState].message) consolePrint(msg)
                consolePrint(" ")
                player.des.giftHunterEnabled = true
                player.des.giftcodeInput = ""
            } else if (player.des.giftHunterStates.msg1 && !player.des.giftHunterStates.msg1Reddemed && player.des.giftcodeInput == "v903.1624update") {
                player.des.giftHunterMulti = player.des.giftHunterMulti.mul(100)
                consolePrint(`The code multiplied your multiplier by 100!`)
                consolePrint(`It is now ×${format(player.des.giftHunterMulti)}.`)
                player.des.giftHunterStates.msg1Reddemed = true
                player.des.giftcodeInput = ""
            } else if (player.des.giftHunterStates.msg2 && !player.des.giftHunterStates.msg2Reddemed && player.des.giftcodeInput == "wearesorry") {
                player.des.giftHunterMulti = player.des.giftHunterMulti.mul(3.1415926535)
                consolePrint(`The code multiplied your multiplier by 3.1415926535!`)
                consolePrint(`It is now ×${format(player.des.giftHunterMulti)}.`)
                player.des.giftHunterStates.msg2Reddemed = true
                player.des.giftcodeInput = ""
            } else if (player.des.giftHunterStates.msg3 && !player.des.giftHunterStates.msg3Reddemed && player.des.giftcodeInput == "newupdate") {
                player.des.giftHunterMulti = player.des.giftHunterMulti.mul(13.37)
                consolePrint(`The code multiplied your multiplier by 13.37!`)
                consolePrint(`It is now ×${format(player.des.giftHunterMulti)}.`)
                player.des.giftHunterStates.msg3Reddemed = true
                player.des.giftcodeInput = ""
            } else if (player.des.giftHunterStates.msg4 && !player.des.giftHunterStates.msg4Reddemed && player.des.giftcodeInput == "yadmir2164") {
                player.des.giftHunterMulti = player.des.giftHunterMulti.mul(420.69)
                consolePrint(`The code multiplied your multiplier by 420.69!`)
                consolePrint(`It is now ×${format(player.des.giftHunterMulti)}.`)
                player.des.giftHunterStates.msg4Reddemed = true
                player.des.giftcodeInput = ""
            } else if (player.des.giftHunterStates.chat1 && !player.des.giftHunterStates.chat1Reddemed && player.des.giftcodeInput == "christmas_event_perm") {
                player.des.giftHunterMulti = player.des.giftHunterMulti.mul(25.12)
                consolePrint(`The code multiplied your multiplier by 25.12!`)
                consolePrint(`It is now ×${format(player.des.giftHunterMulti)}.`)
                player.des.giftHunterStates.chat1Reddemed = true
                player.des.giftcodeInput = ""
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
                    ["row", [["upgrade", 101], ["upgrade", 102], ["upgrade", 103], ["upgrade", 104]]],
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
            "codes": {
                unlocked() { return hasUpgrade("des", 336) },
                title: "Giftcodes",
                content: [
                    ["blank", "10px"],
                    ["raw-html", () => `You have <h3>${format(player.des.giftPoints, 0)}</h3> gift points.`],
                    ["raw-html", () => `<div style="width:${player.des.giftHunterEnabled ? 604 : 404}px;text-align:left;margin:10px;">
                        ${player.des.consoleLines.map((x, i) => `<span style="opacity:${player.des.giftHunterEnabled ? 1 : (i + 1) * .10}">${x}</span><br/>`).join("")}
                        &gt; <span style="color:black;background:var(--color)">${player.des.giftHunterEnabled ? (player.des.giftHunterGameData.id ? "up/down/left/right" : giftHunter[player.des.giftHunterState].commands.join("/")) : `Please enter code ${player.des.currentCode}.`}</span>
                    </div>`, { 
                    }],
                    ["text-input", "giftcodeInput", { 
                        color: "var(--color)", 
                        width: "400px",
                        "font-family": "Inconsolata, monospace",
                        "text-align": "left",
                        "font-size": "16px",
                        border: "2px solid #ffffff17", 
                        background: "var(--background)", 
                    }],
                    ["blank", "10px"],
                    ["column", createBuyableTable(4, 5, 5)],
                    ["blank", "10px"],
                    ["row", [["upgrade", 401], ["upgrade", 402], ["upgrade", 403], ["upgrade", 404]]],
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
                        ["row", [["upgrade", 331], ["upgrade", 333], ["upgrade", 335], ["upgrade", 334], ["upgrade", 332]]],
                        ["row", [["upgrade", 336]]],
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
                    ["row", [["bar", "gachaCycleBar"], ["bar", "gachaAutoBar"], ["bar", "gachaMergeBar"], ["gacha-items", () => player.des.mergePool], ["bar", "dispBar"]]],
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

function consolePrint(line) {
    player.des.consoleLines.push(line.replaceAll(' ', '&nbsp;'))
    player.des.consoleLines.shift()
}


let giftHunter = {
    0: {
        message: [
            "---------------------- Welcome to Giftcode Hunter ----------------------",
            "This is a text adventure game about getting gift codes. Yeah, that's",
            "pretty much it. Type commands into the box for the in-game character to",
            "act. Each situation may present you with different commands highlighted",
            "in white, or global commands that can be seen using the \"help\" command.",
            "Type \"begin\" to continue.",
        ],
        commands: ["begin"],
        onCommand(args) {
            if (args[0] == "begin") {
                player.des.giftHunterState = 1
            }
        }
    },
    1: {
        message: [
            // -----------------------------------------------------------------------
            "Ok. Let's start things straight.",
            "You are currently in your room, playing a Free-2-Play game that is very",
            "critically acclaimed by 93 streamers that you followed, maybe that isn't",
            "the right word, they all said the same thing. Anyways, you're at the",
            "point where the game gets throttled to the point where you need a lot of",
            "giftcodes to be able to continue playing the game. Grinding would take a",
            "long time and micro-transactions didn't help much. There's only one clear",
            "thing right now, and that is: you need more giftcodes. What will you do?",
        ],
        commands: ["find"],
        onCommand(args) {
            if (args[0] == "find") {
                if (args[1] == "for") {
                    args.splice(1, 1); 
                }
                if (args[1] == "some" || args[1] == "a") {
                    args.splice(1, 1); 
                }

                if (!args[1]) {
                    consolePrint("Find? Find what? Girlfriends?")
                    consolePrint("You need to type the entire thing here if you want to do something!")
                } else if (["giftcode", "giftcodes", "code", "codes"].includes(args[1])) {
                    if (!args[2]) {
                        consolePrint("You decided to find for some giftcodes, but where to start?")
                        consolePrint("(ingame, online, outside)")
                    } else if (args[2] == "ingame") {
                        player.des.giftHunterState = "1.1"
                    } else if (args[2] == "online") {
                        player.des.giftHunterState = "2.1"
                    }
                } else if (args[1] == "girlfriend" || args[1] == "girlfriends") {
                    consolePrint("Nice try, but you already have one! It isn't like you are too hooked on")
                    consolePrint("playing video game to the point that your crush left you, right? Right?")
                    consolePrint("She do regularly play games, and you're friend with her in-game anyways.")
                } else if (args[1] == "boyfriend" || args[1] == "boyfriends") {
                    consolePrint("You already have a girlfriend, so... no.")
                } else {
                    consolePrint(`You don't feel like finding ${args[1]} right now.`)
                }
            }
        }
    },
    "1.1": {
        message: [
            // -----------------------------------------------------------------------
            "You decided to find some giftcodes in-game. There's not much place to",
            "find them though, so it could be hard. But you've heard from some",
            "streamers that there are codes that are player-dependant, so you might",
            "have no choice but find them yourself.",
        ],
        commands: ["look", "find", "press", "go"],
        onCommand(args) {
            if (args[0] == "press") {
                if (args[1] == "the") {
                    args.splice(1, 1); 
                }
                if (!args[1]) {
                    consolePrint("Which button do you want to press?")
                } else if (args[1] == "inventory") {
                    player.des.giftHunterState = "1.2"
                } else if (args[1] == "friends") {
                    player.des.giftHunterState = "1.3"
                } else if (args[1] == "pause") {
                    player.des.giftHunterState = "1.4"
                } else if (args[1] == "news") {
                    player.des.giftHunterState = "1.5"
                } else {
                    consolePrint(`You don't see any ${args[1]} button in the game.`)
                }
            } else if (args[0] == "go") {
                if (args[1] == "to") {
                    args.splice(1, 1); 
                    if (args[1] == "the") {
                        args.splice(1, 1); 
                    }
                }
                if (!args[1]) {
                    consolePrint("Where do you want to go?")
                } else if (args[1] == "north" || args[1] == "village") {
                    player.des.giftHunterState = "1.6"
                } else if (args[1] == "west" || args[1] == "windmill") {
                    if (player.des.giftHunterStates.game4) player.des.giftHunterState = "1.11d"
                    player.des.giftHunterState = "1.11"
                } else {
                    consolePrint(`You don't see any ${args[1]} in the game.`)
                }
            } else if (args[0] == "look") {
                             // -----------------------------------------------------------------------
                consolePrint("There's like, not much buttons, since most of the game's interactions")
                consolePrint("are done in the game world. There's a inventory button, a friends button,")
                consolePrint("a pause button, and a button to check the game's news everywhere in the")
                consolePrint("game that you unlock quite a while ago by completing a quest given by a")
                consolePrint("town's NPC. You also see a windmill in the west of your avatar, and a")
                consolePrint("small village in the north.")
            } else if (args[0] == "find") {
                if (args[1] == "for") {
                    args.splice(1, 1); 
                }
                if (args[1] == "some" || args[1] == "a") {
                    args.splice(1, 1); 
                }

                if (!args[1]) {
                    consolePrint(`Find? Find what? There's a lot to find in this game!`)
                } else if (["giftcode", "giftcodes", "code", "codes"].includes(args[1])) {
                    if (!args[2]) {
                        consolePrint(`You don't think that you can find any gift codes in this area.`)
                        consolePrint("(ingame, online, outside)")
                    } else if (args[2] == "ingame") {
                        consolePrint(`You already trying to do that, you doofus!`)
                    } else if (args[2] == "online") {
                        player.des.giftHunterState = "2.1"
                    } else if (args[2] == "outside") {
                        player.des.giftHunterState = "3.1"
                    }
                } else {
                    consolePrint(`You don't feel like wanting to find ${args[1]} in the game right now.`)
                }
            }
        }
    },
    "1.2": {
        message: [
            // -----------------------------------------------------------------------
            "You decided to check your inventory. You are carrying a lot of things,",
            "probably some of them should give you a hint about getting a gift code,",
            "shouldn't they?",
        ],
        commands: ["back", "check", "use"],
        onCommand(args) {
            if (args[0] == "back") {
                player.des.giftHunterState = "1.1"
            }
            if (args[0] == "check") {
                consolePrint(`You have:`)
                let empty = true
                for (let thing in player.des.giftHunterInventory) if (player.des.giftHunterInventory[thing] > 0) {
                    consolePrint(`- ${player.des.giftHunterInventory[thing]} ${thing}`)
                    empty = false
                }
                if (empty) {
                    consolePrint(`- Nothing :(`)
                }
            }
            if (args[0] == "use") {
                if (!args[1]) {
                    consolePrint(`Which item do you want to use?`)
                } else if (!player.des.giftHunterInventory[args[1]]) {
                    consolePrint(`You do not have any ${args[1]} right now.`)
                } else {
                    player.des.giftHunterInventory[args[1]]--;
                    consolePrint(`You used a ${args[1]}.`)
                    if (args[1] == "smallBoost") {
                        player.des.giftHunterMulti = player.des.giftHunterMulti.mul(1.2)
                        consolePrint(`The boost multiplied your multiplier by ×1.2! It is now ×${format(player.des.giftHunterMulti)}.`)
                    } else if (args[1] == "mediumBoost") {
                        player.des.giftHunterMulti = player.des.giftHunterMulti.mul(1.5)
                        consolePrint(`The boost multiplied your multiplier by ×1.5! It is now ×${format(player.des.giftHunterMulti)}.`)
                    } else if (args[1] == "doubler") {
                        player.des.giftHunterMulti = player.des.giftHunterMulti.mul(2)
                        consolePrint(`The doubler doubled your multiplier! It is now ×${format(player.des.giftHunterMulti)}.`)
                    } else if (args[1] == "tripler") {
                        player.des.giftHunterMulti = player.des.giftHunterMulti.mul(3)
                        consolePrint(`The tripler tripled your multiplier! It is now ×${format(player.des.giftHunterMulti)}.`)
                    } else if (args[1] == "quintupler") {
                        player.des.giftHunterMulti = player.des.giftHunterMulti.mul(5)
                        consolePrint(`The quintupler quintupled your multiplier! It is now ×${format(player.des.giftHunterMulti)}.`)
                    }
                }
            }
        }
    },
    "1.3": {
        message: [
            // -----------------------------------------------------------------------
            "You decided to check your friends page. You're friends with a bunch of",
            "people in-game, but it seems like only a few of them are online though.",
            "Thers is an in-game mailbox where you and your friends can send things.",
        ],
        commands: ["back", "check", "open"],
        onCommand(args) {
            if (args[0] == "back") {
                player.des.giftHunterState = "1.1"
            }
            if (args[0] == "check") {
                let empty = true
                if (!player.des.giftHunterStates.msg1) {
                    consolePrint(`You have a mail! It's a <u>system</u> message.`)
                    empty = false
                }
                if (player.des.giftHunterStates.easter1 && !player.des.giftHunterStates.easter1Redeemed) {
                    consolePrint(`You have a mail! It's a <u>reward</u> from your easter egg.`)
                    empty = false
                }
                if (empty)
                    consolePrint(`No one had sent you anything since you last checked here.`)
            }
            if (args[0] == "open") {
                if (!args[1]) {
                    consolePrint(`Which mail do you want to open?`)
                } else if (args[1] == "system" && !player.des.giftHunterStates.msg1) {
                    consolePrint(`From: <i>The YCDAYWTD Mail Service</i> [SYSTEM]`)
                    consolePrint(`Title: <u>v903.1624.0 Content Update!</u>`)
                    consolePrint(`This is the moment we have all been waiting for... we have released the`)
                    consolePrint(`v903.1624.0 Content Update! This update includes:`)
                    consolePrint(`- <r><+ohc:i^,gFD5B!+B*Q,FCf:</r>! You can now <r>E,oN2FD5B!</r> all your <r>E,oN5BlA-8+</r>`)
                    consolePrint(`<r>E2@>B6%R)Er</r> to get powerful <r>E,Tr3Eb9H1+E2@4F*),/AKYr1Bl8$6</r> of which you`)
                    consolePrint(`can <r>@Wcr=E,Tr3Eb9H1+E2@4F*),/AKZ,7B6%EkATI!</r> This will make your gaming`)
                    consolePrint(`experience 1,000,000,000,000 times more immersive!`)
                    consolePrint(`- Miniscule new content, because <r>FD,5.DIn#7:i^,gFD5B!+B*Q,FCf:</r> is`)
                    consolePrint(`already a very large content addition!`)
                    consolePrint(`- Miscellaneous bug fixes`)
                    consolePrint(`We would also love to share al of our current active player with a 100×`)
                    consolePrint(`multiplier to everybody in the game with the code "v903.1624update"!`)
                    consolePrint(`Exit the game to enter it! Thanks for supporting us for such a long time!`)
                    player.des.giftHunterStates.msg1 = true;
                } else if (args[1] == "reward" && player.des.giftHunterStates.easter1 && !player.des.giftHunterStates.easter1Redeemed) {
                                 // -----------------------------------------------------------------------
                    consolePrint(`From: <i>The YCDAYWTD Mail Service</i> [SYSTEM]`)
                    consolePrint(`Title: <u>Easter Egg Reward</u>`)
                    consolePrint(`You got a tripler from the mail.`)
                    player.des.giftHunterInventory.tripler = (player.des.giftHunterInventory.tripler || 0) + 1
                    player.des.giftHunterStates.easter1Redeemed = true;
                } else {
                    consolePrint(`There's no such mail in the mailbox.`)
                }
            }
        }
    },
    "1.4": {
        message: [
            // -----------------------------------------------------------------------
            "You decided to click pause. Nothing particularly interesting here.",
        ],
        commands: ["back", "???"],
        onCommand(args) {
            if (args[0] == "back") {
                player.des.giftHunterState = "1.1"
            }
            if (args[0] == "???") {
                if (!player.des.giftHunterStates.easter1) {
                    consolePrint(`<u>You found an easter egg!</u>`)
                    consolePrint(`A tripler has been sent to your mailbox.`)
                    player.des.giftHunterStates.easter1 = true;
                } else {
                    consolePrint(`<u>You've already found this easter egg!</u>`)
                }
            }
        }
    },
    "1.5": {
        message: [
            // -----------------------------------------------------------------------
            "You decided to check the news. There is three section, each has their own",
            "purpose. There's one for announcements, one is the changelog, and one is",
            "literally a chat.",
        ],
        commands: ["back", "check"],
        onCommand(args) {
            if (args[0] == "back") {
                player.des.giftHunterState = "1.1"
            }
            if (args[0] == "check") {
                if (!args[1]) {
                    consolePrint(`Which mail do you want to open?`)
                } else if (args[1] == "announcements") {
                    if (!args[2]) {
                        consolePrint(`Type "check announcements [number]" to view details`)
                        consolePrint(`[1] From: <i>The YCDAYWTD Mail Service</i> [SYSTEM]`)
                        consolePrint(`Title: <u>v903.1624.0 Content Update!</u>`)
                        consolePrint(`[2] From: <i>The YCDAYWTD Mail Service</i> [SYSTEM]`)
                        consolePrint(`Title: <u><r>:N^\\#:1\\Vl6=jeDDJj0+B)</r></u>`)
                    } else if (args[2] == "1") {
                        if (!player.des.giftHunterStates.msg1) {
                            consolePrint(`From: <i>The YCDAYWTD Mail Service</i> [SYSTEM]`)
                            consolePrint(`Title: <u>v903.1624.0 Content Update!</u>`)
                            consolePrint(`This is the moment we have all been waiting for... we have released the`)
                            consolePrint(`v903.1624.0 Content Update! This update includes:`)
                            consolePrint(`- <r><+ohc:i^,gFD5B!+B*Q,FCf:</r>! You can now <r>E,oN2FD5B!</r> all your <r>E,oN5BlA-8+</r>`)
                            consolePrint(`<r>E2@>B6%R)Er</r> to get powerful <r>E,Tr3Eb9H1+E2@4F*),/AKYr1Bl8$6</r> of which you`)
                            consolePrint(`can <r>@Wcr=E,Tr3Eb9H1+E2@4F*),/AKZ,7B6%EkATI!</r> This will make your gaming`)
                            consolePrint(`experience 1,000,000,000,000 times more immersive!`)
                            consolePrint(`- Miniscule new content, because <r>FD,5.DIn#7:i^,gFD5B!+B*Q,FCf:</r> is`)
                            consolePrint(`already a very large content addition!`)
                            consolePrint(`- Miscellaneous bug fixes`)
                            consolePrint(`We would also love to share al of our current active player with a 100×`)
                            consolePrint(`multiplier to everybody in the game with the code "v903.1624update"!`)
                            consolePrint(`Exit the game to enter it! Thanks for supporting us for such a long time!`)
                            player.des.giftHunterStates.msg1 = true;
                        } else {
                            consolePrint(`From: <i>The YCDAYWTD Mail Service</i> [SYSTEM]`)
                            consolePrint(`Title: <u>v903.1624.0 Content Update!</u>`)
                            consolePrint(`<r>\<+oue+Dk\\2F(&]m+Ceht+Du+>+C\\n)Ci\<\`mARmD9<+oue+DGm>E,ol+@:F%u+C\nl@\<H</r>`)
                            consolePrint(`<r>X&+E(j7@rHC.F\`;G6A0>DkFC?;1EZfI;AKZ&*DId=!+D>2)+Co&"ATVKo+DGpM+A$/fH</r>`)
                            consolePrint(`<r>#IgJFD,B+CER_4BlbD6ATMp$B4W3"F!,"-F)Yr(H"CM/Bl5&)EcQ)=/0JnJARTXk+Cf></r>`)
                            consolePrint(`<r>-FCA[$+EV:.+CTD7BQ%o6@<<VWF"(i_6tReo.mI3:AKaPiCI\`J(?9\`1!5Wim24[Cf95q</r>`)
                            consolePrint(`<r>tbP/0I2Z@m"Kp@PBSj7:Tb'Cd;u#,&Tn;5X7q,E_%r:+E)9C80_YA2+0lR7r(D/6p,9N</r>`)
                            consolePrint(`<r>:bkF&05s<N</r>`)
                        }
                    } else if (args[2] == "2") {
                                      // -----------------------------------------------------------------------
                        consolePrint(`From: <i>The YCDAYWTD Mail Service</i> [SYSTEM]`)
                        consolePrint(`Title: <u><r>:N^\\#:1\\Vl6=jeDDJj0+B)</r></u>`)
                        consolePrint(`IMPORTANT: This message is only intended to be viewed by the YCDAYWTD`)
                        consolePrint(`staff member. If you can see this in public, please use this gift code as`)
                        consolePrint(`our letter of apology: wearesorry`)
                        consolePrint(`<r>:i'i\\+Dkm:@V0BuGp$g<F),>sF"SS.H".t,ASlT5D/18=Chdu5E,9).F(ooDAS#LhCG$\`2H"C</r>`)
                        consolePrint(`<r>e7CN^hCD'3S-G\\F1@<uE+F(6>.H#b$;ASYs%Ecc>5F)ET</r>`)
                        player.des.giftHunterStates.msg2 = true;
                    }
                } else if (args[1] == "changelog") {
                    consolePrint(`The changelog is empty. That's... weird. This shouldn't happen, especially`)
                    consolePrint(`since you remember that the game has updates virtually <i>daily, every day.</i>`)
                } else if (args[1] == "chat") {
                    consolePrint(`-- current channel: OFFLINE`)
                    consolePrint(`The chat is currently temporarily closed for maintainance. Please wait patiently`)
                    consolePrint(`and we will bring it back, soon.`)
                }
            }
        }
    },
    "1.6": {
        message: [
            // -----------------------------------------------------------------------
            "You go to the village. It's a peaceful place with a church, a bar and a",
            "park and a few houses. You have not much things to do here though, you've",
            "completed all the sidequest here a few days ago. The village seems a bit",
            "empty though, it's usually a little bit crowder than this.",
        ],
        commands: ["back", "go", "???"],
        onCommand(args) {
            if (args[0] == "back") {
                player.des.giftHunterState = "1.1"
            }
            if (args[0] == "go") {
                if (args[1] == "to") {
                    args.splice(1, 1); 
                    if (args[1] == "the") {
                        args.splice(1, 1); 
                    }
                } 
                if (!args[1]) {
                    consolePrint("Where do you want to go?")
                } else if (args[1] == "back") {
                    player.des.giftHunterState = "1.1"
                } else if (args[1] == "church") {
                    if (player.des.giftHunterStates.game1) player.des.giftHunterState = "1.7c"
                    else player.des.giftHunterState = "1.7a"
                } else if (args[1] == "bar") {
                    if (player.des.giftHunterStates.game2) player.des.giftHunterState = "1.8c"
                    else player.des.giftHunterState = "1.8a"
                } else if (args[1] == "park") {
                    player.des.giftHunterState = "1.9"
                } else {
                    consolePrint(`You don't even see a single ${args[1]} here.`)
                }
            }
            if (args[0] == "???") {
                if (!player.des.giftHunterStates.easter2) {
                    consolePrint(`You found a doubler!`)
                    consolePrint(`You put the doubler into the inventory.`)
                    player.des.giftHunterInventory.doubler = (player.des.giftHunterInventory.doubler || 0) + 1
                    player.des.giftHunterStates.easter2 = true;
                } else {
                    consolePrint(`There's nothing interesting here.`)
                }
            }
        }
    },
    "1.7a": {
        message: [
            // -----------------------------------------------------------------------
            "You go to the church. There is only one person here.",
        ],
        commands: ["back", "talk"],
        onCommand(args) {
            if (args[0] == "back") {
                player.des.giftHunterState = "1.6"
            }
            if (args[0] == "talk") {
                player.des.giftHunterState = "1.7b"
            }
        }
    },
    "1.7a2": {
        message: [
            // -----------------------------------------------------------------------
            "\"Don't fool around here, we're in a church. Come talk at me again when",
            "you want to play.\"",
        ],
        commands: ["back", "talk"],
        onCommand(args) {
            if (args[0] == "back") {
                player.des.giftHunterState = "1.6"
            }
            if (args[0] == "talk") {
                player.des.giftHunterState = "1.7b"
            }
        }
    },
    "1.7b": {
        message: [
            // -----------------------------------------------------------------------
            "\"Do you want to play a game? Don't worry, a quiet game.\"",
        ],
        commands: ["yes", "no"],
        onCommand(args) {
            if (args[0] == "no") {
                player.des.giftHunterState = "1.7a2"
            }
            if (args[0] == "yes") {
                startGiftHunterGame(1)
            }
        }
    },
    "1.7b2": {
        message: [
            // -----------------------------------------------------------------------
            "\"You have potential.\"",
            "The person hands you some multipliers and then leaves. You don't even",
            "understand what happened.",
        ],
        commands: ["back"],
        onCommand(args) {
            if (args[0] == "back") {
                player.des.giftHunterState = "1.6"
            }
        }
    },
    "1.7c": {
        message: [
            // -----------------------------------------------------------------------
            "You go to the church. No one is here.",
        ],
        commands: ["back"],
        onCommand(args) {
            if (args[0] == "back") {
                player.des.giftHunterState = "1.6"
            }
        }
    },
    "1.8a": {
        message: [
            // -----------------------------------------------------------------------
            "You go to the church. There is only the bartender here. He is calling",
            "you.",
        ],
        commands: ["back", "talk"],
        onCommand(args) {
            if (args[0] == "back") {
                player.des.giftHunterState = "1.6"
            }
            if (args[0] == "talk") {
                player.des.giftHunterState = "1.8b"
            }
        }
    },
    "1.8a2": {
        message: [
            // -----------------------------------------------------------------------
            "\"Not ready yet? Fine, that's okay. Come talk at me ready when you are.\"",
        ],
        commands: ["back", "talk"],
        onCommand(args) {
            if (args[0] == "back") {
                player.des.giftHunterState = "1.6"
            }
            if (args[0] == "talk") {
                player.des.giftHunterState = "1.8b"
            }
        }
    },
    "1.8b": {
        message: [
            // -----------------------------------------------------------------------
            "\"Hey, kid. I need you to do something for me. One of my worker dropped",
            "something into my basement and now everything turned into a maze! I don't",
            "even know how this even happen! Can you deal with all the tiles there? I",
            "will give you something if you can clear it.\"",
        ],
        commands: ["yes", "no"],
        onCommand(args) {
            if (args[0] == "no") {
                player.des.giftHunterState = "1.8a2"
            }
            if (args[0] == "yes") {
                startGiftHunterGame(2)
            }
        }
    },
    "1.8b2": {
        message: [
            // -----------------------------------------------------------------------
            "The basement turns into normal as you clear the last tile. The bartender",
            "thanks you and then gives you a quintupler as a compensation for helping",
            "him.",
        ],
        commands: ["back"],
        onCommand(args) {
            if (args[0] == "back") {
                player.des.giftHunterState = "1.6"
            }
        }
    },
    "1.8c": {
        message: [
            // -----------------------------------------------------------------------
            "You go to the bar. The only person here is the bartender, who are looking",
            "for his customers to come.",
        ],
        commands: ["back"],
        onCommand(args) {
            if (args[0] == "back") {
                player.des.giftHunterState = "1.6"
            }
        }
    },
    "1.9": {
        message: [
            // -----------------------------------------------------------------------
            "You go to the park. It's very crowded, seems like there is a festival",
            "being celebrated around here. There is a puzzle stall giving a reward to",
            "people who can solve their puzzles.",
        ],
        commands: ["back", "go"],
        onCommand(args) {
            if (args[0] == "back") {
                player.des.giftHunterState = "1.6"
            }
            if (args[0] == "go") {
                if (args[1] == "to") {
                    args.splice(1, 1); 
                    if (args[1] == "the") {
                        args.splice(1, 1); 
                    }
                } 
                if (!args[1]) {
                    consolePrint("Where do you want to go?")
                } else if (args[1] == "back") {
                    player.des.giftHunterState = "1.6"
                } else if (args[1] == "stall") {
                    if (player.des.giftHunterStates.game3) player.des.giftHunterState = "1.10c"
                    else player.des.giftHunterState = "1.10a"
                } else {
                    consolePrint(`You don't even see a single ${args[1]} here.`)
                }
            }
        }
    },
    "1.10a": {
        message: [
            // -----------------------------------------------------------------------
            "You go to the puzzle stall. There is a lot of puzzles hanging around all",
            "three walls. The puzzle seller is telling nearby people to try and solve",
            "the puzzles.",
        ],
        commands: ["back", "talk"],
        onCommand(args) {
            if (args[0] == "back") {
                player.des.giftHunterState = "1.9"
            }
            if (args[0] == "talk") {
                player.des.giftHunterState = "1.10b"
            }
        }
    },
    "1.10a2": {
        message: [
            // -----------------------------------------------------------------------
            "\"Come on, don't be that shy. Don't you like free rewards?\"",
        ],
        commands: ["back", "talk"],
        onCommand(args) {
            if (args[0] == "back") {
                player.des.giftHunterState = "1.9"
            }
            if (args[0] == "talk") {
                player.des.giftHunterState = "1.10b"
            }
        }
    },
    "1.10b": {
        message: [
            // -----------------------------------------------------------------------
            "\"Hey, are you here for the puzzles? If you try to solve only one of my",
            "puzzles, I will give you a great reward! How's that sounds?\"",
        ],
        commands: ["yes", "no"],
        onCommand(args) {
            if (args[0] == "no") {
                player.des.giftHunterState = "1.10a2"
            }
            if (args[0] == "yes") {
                startGiftHunterGame(3)
            }
        }
    },
    "1.10b2": {
        message: [
            // -----------------------------------------------------------------------
            "\"Hey, you did it! As I said, a special reward: You unlocked a few",
            "upgrades! These will help you a lot on your journey! Oh, and have some",
            "multipliers too! Very great, am I right?\"",
        ],
        commands: ["back"],
        onCommand(args) {
            if (args[0] == "back") {
                player.des.giftHunterState = "1.9"
            }
        }
    },
    "1.10c": {
        message: [
            // -----------------------------------------------------------------------
            "You go to the puzzle stall. There is a lot of puzzles hanging around all",
            "three walls. The puzzle seller is telling nearby people to try and solve",
            "the puzzles.",
        ],
        commands: ["back"],
        onCommand(args) {
            if (args[0] == "back") {
                player.des.giftHunterState = "1.9"
            }
        }
    },
    "1.11": {
        message: [
            // -----------------------------------------------------------------------
            "You go to the abandoned windmill. This place is wrecked, but it still",
            "somehow managed to stand itself up. Probably someone has built this place",
            "a very long time ago and never bothered to actually bulldoze it and now",
            "time is the person who decided its fate. You can still able to go inside",
            "it, what will it hurt?",
        ],
        commands: ["back", "go", "???"],
        onCommand(args) {
            if (args[0] == "back") {
                player.des.giftHunterState = "1.1"
            }
            if (args[0] == "go") {
                if (!args[1]) {
                    consolePrint("Where do you want to go?")
                } else if (args[1] == "back") {
                    player.des.giftHunterState = "1.1"
                } else if (args[1] == "inside") {
                    player.des.giftHunterState = "1.12"
                } else {
                    consolePrint(`You don't even see a single ${args[1]} here.`)
                }
            }
            if (args[0] == "???") {
                if (!player.des.giftHunterStates.easter3) {
                    consolePrint(`You found a doubler!`)
                    consolePrint(`You put the doubler into the inventory.`)
                    player.des.giftHunterInventory.doubler = (player.des.giftHunterInventory.doubler || 0) + 1
                    player.des.giftHunterStates.easter3 = true;
                } else {
                    consolePrint(`There's nothing interesting here.`)
                }
            }
        }
    },
    "1.11b": {
        message: [
            // -----------------------------------------------------------------------
            "You exit the abandoned windmill. A large slime suddenly approaches you.",
            "What will you do?",
        ],
        commands: ["fight", "spare"],
        onCommand(args) {
            if (args[0] == "fight") {
                startGiftHunterGame(4)
            }
            if (args[0] == "spare") {
                player.des.giftHunterState = "1.11"
            }
        }
    },
    "1.11c": {
        message: [
            // -----------------------------------------------------------------------
            "You manage to fight the slime. The slime slams into the abandon windmill,",
            "causing the entirety of it to collapses. Luckily, you dodged it. It",
            "wasn't really a special thing anyways, it fells way off where you're", 
            "standing. Anyways, since you beaten the slime, you get to loot the",
            "following:",
            "- 3 smallBoosts",
            "- 2 mediumBoosts",
            "You still don't get the reason why they group the item names into one",
            "single word but hey, multipliers!",
        ],
        commands: ["continue"],
        onCommand(args) {
            if (args[0] == "continue") {
                player.des.giftHunterState = "1.11d"
            }
        }
    },
    "1.11d": {
        message: [
            // -----------------------------------------------------------------------
            "You're standing next to the collapsed windmill. It was a place, but your",
            "recent brawl with a slime has made this place collapsed. It wasn't a big",
            "deal anyways, since people has abandoned this probably a very long time",
            "ago.",
        ],
        commands: ["back", "???"],
        onCommand(args) {
            if (args[0] == "back") {
                player.des.giftHunterState = "1.1"
            }
            if (args[0] == "???") {
                if (!player.des.giftHunterStates.easter3) {
                    consolePrint(`You found a doubler!`)
                    consolePrint(`You put the doubler into the inventory.`)
                    player.des.giftHunterInventory.doubler = (player.des.giftHunterInventory.doubler || 0) + 1
                    player.des.giftHunterStates.easter3 = true;
                } else {
                    consolePrint(`There's nothing interesting here.`)
                }
            }
        }
    },
    "1.12": {
        message: [
            // -----------------------------------------------------------------------
            "You go inside the windmill through the holes on the walls. Gosh the place",
            "could literally collapse at any moment and you wouldn't even know it.",
            "Anyways, the place seems empty. Not even a single thing is here for you",
            "to even think about looting. Or maybe you need to look really hard to",
            "find a valuable thing here, but you're not going to want to make this",
            "already not-in-a-good-condition building collapse on your head.",
        ],
        commands: ["back"],
        onCommand(args) {
            if (args[0] == "back") {
                player.des.giftHunterState = "1.11b"
            }
        }
    },
    "2.1": {
        message: [
            // -----------------------------------------------------------------------
            "You decided to find some giftcodes in-game. You open your trust-worthy",
            "Aireagle Browser(tm) and soon realized a problem. The Internet is just",
            "impossibly vast. Finding giftcodes here is like finding diamond in the",
            "middle of the ocean. Is that even possible? Where should you even start?",
        ],
        commands: ["search", "find", "open"],
        onCommand(args) {
            if (args[0] == "search") {
                if (!args[1]) {
                                 // -----------------------------------------------------------------------
                    consolePrint(`You search your browser for some clues about places to find giftcodes.`)
                    consolePrint(`There is a news article place where you can find gaming news. You also`)
                    consolePrint(`have a chat client installed, for when you want to have casual chit-chat`)
                    consolePrint(`with some of the gaming crew members. Yeah, you're all about gaming and`)
                    consolePrint(`gaming. The fact that your girlfriend also support gaming means you two`)
                    consolePrint(`goes pretty well with each other, too, and also you're even more into`)
                    consolePrint(`gaming. Maybe you should do something else for your life. I don't know,`)
                    consolePrint(`it's just a suggestion.`)
                } else {
                                 // -----------------------------------------------------------------------
                    consolePrint(`Your search engine service seems to be offline. Gosh, we do you even`)
                    consolePrint(`choose to use <i>that</i> search engine? There is no way you can switch`)
                    consolePrint(`it to something else now, because the people who made the browser think`)
                    consolePrint(`"hey, we can ship a half-done project" and everytime you try to change`)
                    consolePrint(`search engines now the browser just... crashes. Yeah, you can't do`)
                    consolePrint(`anything now, tough luck, I guess.`)
                }
            } else if (args[0] == "find") {
                if (args[1] == "for") {
                    args.splice(1, 1); 
                }
                if (args[1] == "some" || args[1] == "a") {
                    args.splice(1, 1); 
                }

                if (!args[1]) {
                    consolePrint(`Find? Find what? There's a lot to find in this game!`)
                } else if (["giftcode", "giftcodes", "code", "codes"].includes(args[1])) {
                    if (!args[2]) {
                        consolePrint(`You don't think that you can find any gift codes in this area.`)
                        consolePrint("(ingame, online, outside)")
                    } else if (args[2] == "ingame") {
                        player.des.giftHunterState = "1.1"
                    } else if (args[2] == "online") {
                        consolePrint(`You already trying to do that, you doofus!`)
                    } else if (args[2] == "outside") {
                        player.des.giftHunterState = "3.1"
                    }
                } else {
                    consolePrint(`You don't feel like wanting to find ${args[1]} in the game right now.`)
                }
            } else if (args[0] == "open") {
                if (!args[1]) {
                    consolePrint(`Which program do you want to open?`)
                } else if (["news"].includes(args[1])) {
                    player.des.giftHunterState = "2.2"
                } else if (["chat"].includes(args[1])) {
                    player.des.giftHunterState = "2.3"
                } else {
                    consolePrint(`You don't have ${args[1]} installed on your computer.`)
                }
            }
        }
    },
    "2.2": {
        message: [
            // -----------------------------------------------------------------------
            `You open the news. There are only news articles about the game you're`,
            `currently playing.`,
            ``,
            `Type "check [number]" to view details.`,
            "[1]: YCDAYWTD becomes the first video game to reach 1 billion players",
            "[2]: YCDAYWTD celebrates its new update with a gift code hunt",
            "[3]: Questions about the YCDAYWTD team",
            "[4]: All known YCDAYWTD gift codes",
        ],
        commands: ["back", "check"],
        onCommand(args) {
            if (args[0] == "back") {
                player.des.giftHunterState = "2.1"
            } else if (args[0] == "check") {
                if (!args[1]) {
                    consolePrint(`Which article do you want to check?`)
                } else if (args[1] == "1") {
                                 // -----------------------------------------------------------------------
                    consolePrint(`<u>YCDAYWTD becomes the first video game to reach 1 billion players</u>`)
                    consolePrint(`The recent hit game, YCDAYWTD, has broken two world records at once. It`)
                    consolePrint(`not only became the first video game to surpass 1 billion registered`)
                    consolePrint(`accounts, but it also did it in record time - only 3 months since it was`)
                    consolePrint(`released. The game, as in its name, allows players to do everything they`)
                    consolePrint(`can think of, including <r>CM@U$Bl7Q+E+Ns,Ch3</r>, <r>E,8s#+Cf>-F)Yi6@:O"_Er</r>,`)
                    consolePrint(`and even <r>@rH7,Ec5b:FD,5.B5_s)Ec,\`*DKG</r>. It has got an extra-`)
                    consolePrint(`ordinary rating and is the only game that has a perfect 100% rating with`)
                    consolePrint(`over 50 million reviews. Expert claims it will continue to rise in`)
                    consolePrint(`popularity, since more and more people are starting to join in this`)
                    consolePrint(`masterpiece.`)
                } else if (args[1] == "2") {
                                 // -----------------------------------------------------------------------
                    consolePrint(`<u>YCDAYWTD celebrates its new update with a gift code hunt</u>`)
                    consolePrint(`Today is the day that the recent hit video game, TCDAYWTD, releases a`)
                    consolePrint(`new update that it quotes, "changes everything that you see about video`)
                    consolePrint(`game, forever". As a way to compensate players, they also opened a new,`)
                    consolePrint(`global scale gift code hunt. Over 300,000 new gift codes has been created`)
                    consolePrint(`only for this event. The hunt happens both in-game and in real life, so`)
                    consolePrint(`players are now encouraged to go outside to get new in-game items and`)
                    consolePrint(`real life rewards. News outlets and celebrities are also given unique`)
                    consolePrint(`codes, for example, the code "newupdate" is exclusive to this news`)
                    consolePrint(`articles and will give you a solid ×13.37 multiplier to its unique`)
                    consolePrint(`multiplier ranking system.`)
                    player.des.giftHunterStates.msg3 = true;
                } else if (args[1] == "3") {
                                 // -----------------------------------------------------------------------
                    consolePrint(`<u>Questions about the YCDAYWTD team</u>`)
                    consolePrint(`<i>This article has been taken down due to very frequent unexpected</i>`)
                    consolePrint(`<i>corruption randomly happening. Sorry for the inconvenience.</i>`)
                    consolePrint(`<r>/Ke#+AKY,C6pXsW<(%j.ARTE</r>`)
                } else if (args[1] == "4") {
                                 // -----------------------------------------------------------------------
                    consolePrint(`<u>All known YCDAYWTD gift codes</u>`)
                    consolePrint(`These are all the available giftcodes that I managed to find:`)
                    consolePrint(`- <r>>B4:c@:OCjA6f</r>`)
                    consolePrint(`- <r>HXpQ,@3B-+E-6&2ARp2</r>`)
                    consolePrint(`- yadmir2164`)
                    consolePrint(`- <r>BOPR_/0JhK</r>`)
                    consolePrint(`- <r>H#IgJ@\<,p%DJsV\>F*2G@Df]K#+EVNE@V$ZqATD\></r>`)
                    consolePrint(`- <r>FE2YDAT2Hs@<5u</r> <i>(hint: .11 .3 -1^4 (.2)^2 -32 .5 ...?)</i>`)
                    player.des.giftHunterStates.msg4 = true;
                } else {
                    consolePrint(`No such article exists, sorry`)
                }
            }
        },
    },
    "2.3": {
        message: [
            // -----------------------------------------------------------------------
            `You open the chat. No one was online. You can still check the previous`,
            `chat logs though.`,
            ``,
            `Type "view [number] {page}" to view details.`,
            "[1]: lobby 2194-2-6",
            "[2]: announcement 2194-2-7",
        ],
        commands: ["back", "view"],
        onCommand(args) {
            if (args[0] == "back") {
                player.des.giftHunterState = "2.1"
            } else if (args[0] == "view") {
                if (!args[1]) {
                    consolePrint(`Which log do you want to view?`)
                } else if (args[1] == "1") {
                    if (!args[2] || args[2] == "1") {
                                    // -----------------------------------------------------------------------
                        consolePrint(`==== <u>MESSAGE LOG | 2194 02 06 | @aethercamp.dze.us : lobby</u> ==============`)
                        consolePrint(`aetrMker: hey ^FC000000`)
                        consolePrint(`aetrMker: so about the codes that you found`)
                        consolePrint(`FC000000: Oh`)
                        consolePrint(`FC000000: What happened?`)
                        consolePrint(`aetrMker: some of the codes are corrupted`)
                        consolePrint(`aetrMker: they appear as random mess of characters written in red`)
                        consolePrint(`FC000000: Not again`)
                        consolePrint(`FC000000: Things like this happen a lot recently now`)
                        consolePrint(`FC000000: It's like all of the electronics in the world are getting`)
                        consolePrint(`FC000000: simultaniously degraded at the same time`)
                        consolePrint(`aetrMker: yeah, it do be happen pretty frequently`)
                        consolePrint(`aetrMker: do you still have any leftovers`)
                        consolePrint(`==== Page 1 of 6 =[ #..... ]=============================================`)
                    } else if (args[2] == "2") {
                                    // -----------------------------------------------------------------------
                        consolePrint(`==== <u>MESSAGE LOG | 2194 02 06 | @aethercamp.dze.us : lobby</u> ==============`)
                        consolePrint(`FC000000: I do not remember all of them`)
                        consolePrint(`FC000000: Let me check`)
                        consolePrint(`[ FC000000 left chat. 1 online. ]`)
                        consolePrint(`[ FC000000 joined chat. 2 online. ]`)
                        consolePrint(`FC000000: Yeah, most of them are corrupted`)
                        consolePrint(`FC000000: I'm still able to get a few though`)
                        consolePrint(`FC000000: Like "christmas_event_perm"`)
                        consolePrint(`aetrMker: i already reddemed it though`)
                        consolePrint(`FC000000: or how about <r>4C\`29F)u&-Bk:ftBl7O$Ec#6,Bl@lQ</r>`)
                        consolePrint(`aetrMker: ooh didn't try it yet`)
                        consolePrint(`aetrMker: let's see`)
                        consolePrint(`aetrMker: oh the game says it's invalid`)
                        consolePrint(`==== Page 2 of 6 =[ =#.... ]=============================================`)
                        player.des.giftHunterStates.chat1 = true;
                    } else if (args[2] == "3") {
                                    // -----------------------------------------------------------------------
                        consolePrint(`==== <u>MESSAGE LOG | 2194 02 06 | @aethercamp.dze.us : lobby</u> ==============`)
                        consolePrint(`FC000000: Well, the code might have been temporary`)
                        consolePrint(`FC000000: They make that all the time, just to lure new people into a`)
                        consolePrint(`FC000000: game that's already succeed`)
                        consolePrint(`FC000000: People just don't get enough taste of money`)
                        consolePrint(`aetrMker: the game's not that pay2win though`)
                        consolePrint(`aetrMker: it's all about gift codes`)
                        consolePrint(`aetrMker: and a constant search of them`)
                        consolePrint(`aetrMker: even the real world is filled with codes for a single game`)
                        consolePrint(`aetrMker: i don't even think they can even do this for just under three`)
                        consolePrint(`aetrMker: month`)
                        consolePrint(`FC000000: Yeah, they did something very great`)
                        consolePrint(`aetrMker: anyways, how the search's going`)
                        consolePrint(`==== Page 3 of 6 =[ ==#... ]=============================================`)
                    } else if (args[2] == "4") {
                                    // -----------------------------------------------------------------------
                        consolePrint(`==== <u>MESSAGE LOG | 2194 02 06 | @aethercamp.dze.us : lobby</u> ==============`)
                        consolePrint(`FC000000: Not very well actually`)
                        consolePrint(`FC000000: Most of the codes I tried are just plain invalid`)
                        consolePrint(`FC000000: I can only be able to find a working one every week and a half`)
                        consolePrint(`aetrMker: well that sucks`)
                        consolePrint(`aetrMker: codes are literally everything in the game`)
                        consolePrint(`aetrMker: it used to be abundant`)
                        consolePrint(`FC000000: They just have no idea for the new codes`)
                        consolePrint(`FC000000: But they announced a feature that's will rebalance the game`)
                        consolePrint(`FC000000: And make the code finding obsolete`)
                        consolePrint(`FC000000: They said`)
                        consolePrint(`aetrMker: seems good`)
                        consolePrint(`aetrMker: no one gonna need to take half of their time finding codes`)
                        consolePrint(`==== Page 4 of 6 =[ ===#.. ]=============================================`)
                    } else if (args[2] == "5") {
                                    // -----------------------------------------------------------------------
                        consolePrint(`==== <u>MESSAGE LOG | 2194 02 06 | @aethercamp.dze.us : lobby</u> ==============`)
                        consolePrint(`aetrMker: and instead just focus on the game itself`)
                        consolePrint(`FC000000: I think code finding to be interesting though`)
                        consolePrint(`FC000000: It's when you go to a place that's you don't expect to find`)
                        consolePrint(`FC000000: game codes anywhere, and bam, game codes`)
                        consolePrint(`aetrMker: that's what i hate about it`)
                        consolePrint(`aetrMker: code finding is just way too hard for my taste`)
                        consolePrint(`aetrMker: there's literally one people found on the middle of the ocean`)
                        consolePrint(`aetrMker: like, the literal ocean`)
                        consolePrint(`aetrMker: the game would be okay if progression doesn't rely on basically`)
                        consolePrint(`aetrMker: finding a grain of rice in a dessert`)
                        consolePrint(`aetrMker: but this, i just basical`)
                        consolePrint(`[ aetrMker left chat. 1 online. ]`)
                        consolePrint(`==== Page 5 of 6 =[ ====#. ]=============================================`)
                    } else if (args[2] == "6") {
                                    // -----------------------------------------------------------------------
                        consolePrint(`==== <u>MESSAGE LOG | 2194 02 06 | @aethercamp.dze.us : lobby</u> ==============`)
                        consolePrint(`FC000000: You offline?`)
                        consolePrint(`FC000000: I guess I'll talk to you next time, I guess`)
                        consolePrint(`[ FC000000 left chat. 0 online. ]`)
                        consolePrint(`[ END OF MESSAGE LOG. ]`)
                        consolePrint(``)
                        consolePrint(``)
                        consolePrint(``)
                        consolePrint(``)
                        consolePrint(``)
                        consolePrint(``)
                        consolePrint(``)
                        consolePrint(``)
                        consolePrint(`==== Page 6 of 6 =[ =====# ]=============================================`)
                    } else {
                                    // -----------------------------------------------------------------------
                        consolePrint(`==== <u>MESSAGE LOG | 2194 02 06 | @aethercamp.dze.us : lobby</u> ==============`)
                        consolePrint(``)
                        consolePrint(`....../.  An error has occurred:`)
                        consolePrint(`.##..|..`)
                        consolePrint(`.....|..  Invalid page or page not exists`)
                        consolePrint(`.##..|..`)
                        consolePrint(`......\\.`)
                        consolePrint(``)
                        consolePrint(``)
                        consolePrint(``)
                        consolePrint(``)
                        consolePrint(``)
                        consolePrint(``)
                        consolePrint(`==== Page ??? of 6 =[ ?????? ]===========================================`)
                    }
                } else if (args[1] == "2") {
                    if (!args[2] || args[2] == "1") {
                                    // -----------------------------------------------------------------------
                        consolePrint(`==== <u>MESSAGE LOG | 2194 02 07 | @aethercamp.dze.us : announcement</u> =======`)
                        consolePrint(`[SYSTEM]: +----------------------------------------+`)
                        consolePrint(`[SYSTEM]: | == WE ARE REGRET TO INFORM YOU THAT == |`)
                        consolePrint(`[SYSTEM]: |         CAMP LEADER: ^aetrMker         |`)
                        consolePrint(`[SYSTEM]: | ========== HAS DISAPPEARED =========== |`)
                        consolePrint(`[SYSTEM]: +----------------------------------------+`)
                        consolePrint(`[SYSTEM]: The camp leader role has been temporarily transfered to`)
                        consolePrint(`[SYSTEM]: ^FC000000 until any extra information is found.`)
                        consolePrint(`[ END OF MESSAGE LOG. ]`)
                        consolePrint(``)
                        consolePrint(``)
                        consolePrint(``)
                        consolePrint(``)
                        consolePrint(`==== Page 1 of 1 =[ # ]==================================================`)
                    } else {
                                    // -----------------------------------------------------------------------
                        consolePrint(`==== <u>MESSAGE LOG | 2194 02 07 | @aethercamp.dze.us : announcement</u> =======`)
                        consolePrint(``)
                        consolePrint(`....../.  An error has occurred:`)
                        consolePrint(`.##..|..`)
                        consolePrint(`.....|..  Invalid page or page not exists`)
                        consolePrint(`.##..|..`)
                        consolePrint(`......\\.`)
                        consolePrint(``)
                        consolePrint(``)
                        consolePrint(``)
                        consolePrint(``)
                        consolePrint(``)
                        consolePrint(``)
                        consolePrint(`==== Page ??? of 1 =[ ? ]================================================`)
                    }
                } else {
                    consolePrint(`There's no such log.`)
                }
            }
        }
    },
    "3.1": {
        message: [
            // -----------------------------------------------------------------------
            "You decided to find some giftcodes outside. Well, outside your computer,",
            "at least. You start looking at your room. Since I just suck at describing",
            "things in words, here's an ASCII map representation of your room instead.",
            "",
            " +---=---+   =  door         C  computer",
            " |B..@...|   -| walls        h  bed",
            " |C.....h|   @  you",
            " +-------+   B  bookshelf",
            "",
            "Yeah, it's small and has almost nothing in it. You're planning on getting",
            "a bigger one, but you'll need to have a larger multiplier though.",
        ],
        commands: ["find", "inspect", "multi?"],
        onCommand(args) {
            if (args[0] == "find") {
                if (args[1] == "for") {
                    args.splice(1, 1); 
                }
                if (args[1] == "some" || args[1] == "a") {
                    args.splice(1, 1); 
                }

                if (!args[1]) {
                    consolePrint(`Find? Find what? There's a lot to find in this game!`)
                } else if (["giftcode", "giftcodes", "code", "codes"].includes(args[1])) {
                    if (!args[2]) {
                        consolePrint(`You don't think that you can find any gift codes in this area.`)
                        consolePrint("(ingame, online, outside)")
                    } else if (args[2] == "ingame") {
                        player.des.giftHunterState = "1.1"
                    } else if (args[2] == "online") {
                        player.des.giftHunterState = "2.1"
                    } else if (args[2] == "outside") {
                        consolePrint(`You already trying to do that, you doofus!`)
                    }
                } else {
                    consolePrint(`You don't feel like wanting to find ${args[1]} in the game right now.`)
                }
            } else if (args[0] == "inspect") {
                if (!args[1]) {
                    consolePrint(`Which item do you want to inspect?`)
                } else if (args[1] == "bookshelf") {
                                // -----------------------------------------------------------------------
                    consolePrint(` +---=---+`)
                    consolePrint(` |B@.....|`)
                    consolePrint(` |C.....h|`)
                    consolePrint(` +-------+`)
                    consolePrint(``)
                    consolePrint(`The bookshelf contains a large amount of games, most of them are role-`)
                    consolePrint(`playing ones. You have an obsession with role-playing games. The feeling`)
                    consolePrint(`of emerging yourself with another world, where you can forget about this`)
                    consolePrint(`stupid pathetic world and the awful multiplier hierarchy system. You`)
                    consolePrint(`just can't resist it. You rebought most of these though, since you have`)
                    consolePrint(`a very low multiplier, therefore you can't even afford new and modern`)
                    consolePrint(`games. The only modern game you can actually get is the only one you`)
                    consolePrint(`previously played. It's okay though, since most of the new games suck`)
                    consolePrint(`anyways.`)
                } else if (args[1] == "computer") {
                                // -----------------------------------------------------------------------
                    consolePrint(` +---=---+`)
                    consolePrint(` |B......|`)
                    consolePrint(` |C@....h|`)
                    consolePrint(` +-------+`)
                    consolePrint(``)
                    consolePrint(`You have this one old computer you got quite a few years ago. It's can`)
                    consolePrint(`still be able to do useful things though, such as browsing the internet`)
                    consolePrint(`and play low to mid end games, but you're starting to run low on physical`)
                    consolePrint(`disk space. You recently used it to play a game, of which you're needing`)
                    consolePrint(`to find gift-codes for it. It's such a good game, being able to keep you`)
                    consolePrint(`and your friend for hours and hours. But hey, you're here to find codes,`)
                    consolePrint(`that's why you stepped off your computer in the first place!`)
                } else if (args[1] == "bed") {
                                // -----------------------------------------------------------------------
                    consolePrint(` +---=---+`)
                    consolePrint(` |B......|`)
                    consolePrint(` |C....@h|`)
                    consolePrint(` +-------+`)
                    consolePrint(``)
                    consolePrint(`A bed. You sleep on this.`)
                } else if (args[1] == "door") {
                    player.des.giftHunterState = "3.1.1"
                } else {
                    consolePrint(`You don't have any ${args[1]} on your room.`)
                }
            } else if (args[0] == "multi?") {
                            // -----------------------------------------------------------------------
                consolePrint(`Oh, you're asking about the multiplier? That's basically the way you`)
                consolePrint(`people decided to rank everyone in this world now. Just like money, the`)
                consolePrint(`larger multiplier you have, the better things you can do. It's kinda`)
                consolePrint(`like an experience system, but for each meaningful things you do, it`)
                consolePrint(`multiplies instead of adds. The problem with it is they tried to apply`)
                consolePrint(`it to basically <i>everything</i> in your life, including something as basic`)
                consolePrint(`as opening doors!? Why do they even lock such thing behind a grind wall?`)
            }
        }
    },
    "3.1.1": {
        message: [
            // -----------------------------------------------------------------------
            " +---=---+",
            " |B..@...|",
            " |C.....h|",
            " +-------+",
            "",
            "The door seems to be locked by a password. It insists you on opening it.",
        ],
        commands: ["back", "enter"],
        onCommand(args) {
            if (args[0] == "back") {
                player.des.giftHunterState = "3.1"
            } else if (args[0] == "enter") {
                if (!args[1]) {
                    consolePrint(`What's the password?`)
                    consolePrint(`Hint: multiplier`)
                } else if (args[1] == format(player.des.giftHunterMulti)) {
                    if (player.des.giftHunterMulti.gte(2.595e11)) {
                        player.des.giftHunterState = "3.2"
                    } else {
                        consolePrint(`You did it right, but it's not the time yet.`)
                        consolePrint(`Try again when your multiplier is bigger.`)
                    }
                } else {
                    consolePrint(`That's not the password!`)
                    consolePrint(`Hint: multiplier`)
                }
            }
        },
    },
    "3.2": {
        message: [
            // -----------------------------------------------------------------------
            " +--- ---+",
            " |B..@...|",
            " |C.....h|",
            " +-------+",
            "",
            "The door opens. You can now step outside.",
        ],
        commands: ["go"],
        onCommand(args) {
            if (args[0] == "go") {
                player.des.giftHunterMulti = player.des.giftHunterMulti.mul(1000000)
                player.des.giftHunterState = "3.3"
            }
        }
    },
    "3.3": {
        message: [
            // -----------------------------------------------------------------------
            "ok, i'm not going to do anymore of this",
            "here's a 1,000,000 multiplier so I can end this game quick",
        ],
        commands: [],
        onCommand(args) {
        }
    },
}

function startGiftHunterGame(id) {
    player.des.giftHunterGameData.id = id
    player.des.giftHunterGameData.data = JSON.parse(JSON.stringify(giftHunterGames[id].data))
}

function getGiftHunterGameCoordinate(x, y) {
    let yData = player.des.giftHunterGameData.data[y]
    if (!yData) return null
    return yData[x] || null
}

function getGiftHunterGamePlayer() {
    let data = player.des.giftHunterGameData.data
    let y = 0
    for (let yData of data) {
        let x = 0
        for (let xData of yData) {
            if (xData && xData.find) {
                let find = xData.find(x => x[0] == "p")
                if (find) return [x, y]
            }
            x++
        }
        y++
    }
    return null
}

function isGiftHunterGameCompleted() {
    let data = player.des.giftHunterGameData.data
    for (let yData of data) {
        for (let xData of yData) {
            if (xData && xData.find) {
                let find = xData.find(x => x[0] == "e")
                if (find) return false
            }
        }
    }
    return true
}

function getGiftHunterGameDisplay() {
    if (!player.des.giftHunterGameData.data) return ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]

    let pos = getGiftHunterGamePlayer()
    if (!pos) pos = [0, 0, true]
    let data = player.des.giftHunterGameData.data
    let height = giftHunterGames[player.des.giftHunterGameData.id].height
    let lines = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]

    let yOffset = Math.max(pos[0] * height - 6, -1)
    
    for (let yData of data) {
        for (let a = 1; a <= lines.length; a++) {
            let xData = yData[Math.floor((a + yOffset - 1) / height)]
            if (xData) {
                if ((a + yOffset) % height == 0) lines[lines.length - a] += " >------< "
                else if (xData[(a + yOffset - 1) % height]) {
                    let node = xData[(a + yOffset - 1) % height]
                    let plus = Math.max(node.lastIndexOf("+"), 0)
                    let txt = node.substring(1, plus || node.length).padStart(6, " ")
                    switch (node[0]) {
                        case 'p': txt = `<span style="color:black;background:var(--color)">${txt}</span>`; break
                        case 'e': txt = "<r" + (plus ? ` style='text-shadow:0 0 10px red'` : "") + ">" + txt + "</r>"; break
                        case '+': txt = "<g>" + "+" + txt.substring(1) + "</r>"; break
                        case '*': txt = (+txt < 100 ? "<r>" : "") + "×" + txt.substring(2) + "%</r>"; break
                    }

                    lines[lines.length - a] += " |" + txt + "| "
                } else lines[lines.length - a] += " |      | ";
            } else {
                if (a + yOffset == 0) lines[lines.length - a] += "----------";
                else if (yData[Math.floor((a + yOffset - 1) / height) + 1] && (a + yOffset) % height == 0) lines[lines.length - a] += " >------< ";
                else if (yData[Math.floor((a + yOffset - 1) / height) - 1] && (a + yOffset) % height == 1) lines[lines.length - a] += " /^^^^^^\\ ";
                else lines[lines.length - a] += "          ";
            }
        }
    }
    if (pos[2]) {
        lines.shift(); lines.push(`Type "restart" to try again.`);
    }
    return lines
}

function giftHunterGameMoveRelative(dir) {
    let pos = getGiftHunterGamePlayer()
    if (!pos) return
    let target = getGiftHunterGameCoordinate(pos[0] + dir[0], pos[1] + dir[1])
    if (!target) return
    
    let pData = player.des.giftHunterGameData.data[pos[1]][pos[0]].shift()
    player.des.giftHunterGameData.data[pos[1] + dir[1]][pos[0] + dir[0]].unshift(pData)

    let data = player.des.giftHunterGameData.data[pos[1] + dir[1]][pos[0] + dir[0]]
    if (data[1]) {
        let hp0 = +data[0].substring(1, Math.max(data[0].lastIndexOf("+"), 0) || data[0].length)
        let hp1 = +data[1].substring(1, Math.max(data[1].lastIndexOf("+"), 0) || data[1].length) 
        if (data[1][0] == "e") {
            if (hp0 > hp1) {
                data.splice(1, 1)
                data[0] = "p" + (hp0 + hp1)
            } else {
                data.shift()
                data[0] = "e" + (hp0 + hp1)
            }
        } else if (data[1][0] == "*") {
            data.splice(1, 1)
            data[0] = "p" + Math.floor(hp0 / 100 * hp1)
        } else if (data[1][0] == "+") {
            data.splice(1, 1)
            data[0] = "p" + Math.floor(hp0 + hp1)
        }
    }

    if (isGiftHunterGameCompleted()) {
        giftHunterGames[player.des.giftHunterGameData.id].complete()
        player.des.giftHunterGameData = {}
    } else {
        giftHunterGameIncrement()
    }
}

function giftHunterGameIncrement() {
    let data = player.des.giftHunterGameData.data
    for (let yData of data) {
        for (let xData of yData) {
            if (!xData) continue
            let x = 0
            for (let e of xData) {
                if (!e) continue
                let plus = Math.max(e.lastIndexOf("+"), 0)
                if (plus) {
                    let hp = +e.substring(1, plus)
                    let inc = +e.substring(plus + 1)
                    xData[x] = e[0] + (hp + inc) + "+" + inc
                }
            }
            x++
        }
    }
    return null
}

let giftHunterGames = {
    "1": {
        type: "tower",
        height: 2,
        data: [
            [["p4"]],
            [["e2"], ["e1"], ["e3"], ["e9"], ["e2"]],
            [["e33"], ["e15"], ["e42"], ["e42"], ["e38"], ["e50"], ["e15"]],
            [["e48"], ["e42"], ["e60"], ["e80"], ["e60"], ["e84"], ["e42"], ["e60"], ["e35"]],
            [["e130"], ["e160"], ["e150"], ["e150"], ["e190"], ["e170"], ["e180"], ["e150"], ["e999"]],
        ],
        complete() {
            player.des.giftHunterState = "1.7b2"
            player.des.giftHunterStates.game1 = true
            player.des.giftHunterInventory.smallBoost = (player.des.giftHunterInventory.smallBoost || 0) + 2
            player.des.giftHunterInventory.mediumBoost = (player.des.giftHunterInventory.mediumBoost || 0) + 1
        }
    },
    "2": {
        type: "dungeon",
        height: 2,
        data: [
            [null,      null,      null,      ["e150"],  ["e23"],   ["e12"],   ["e24"],   null,      null,      null,       null,      null,      null,       ],
            [null,      null,      null,      ["e37"],   null,      null,      ["e32"],   null,      null,      ["e4000"],  null,      null,      ["e9999"],  ],
            [null,      null,      null,      ["e12"],   null,      null,      ["e48"],   null,      null,      ["e1500"],  null,      null,      ["e5246"],  ],
            [["p4"],    ["e3"],    ["e5"],    ["e6"],    ["e499"],  ["e999"],  ["e82"],   null,      null,      ["*10"],    null,      null,      ["e3621"],  ],
            [null,      null,      null,      ["e16"],   null,      null,      ["e64"],   null,      null,      ["e1500"],  null,      null,      ["e1742"],  ],
            [null,      null,      null,      ["e20"],   null,      null,      ["e18"],   ["e200"],  ["*50"],   ["e1000"],  null,      null,      ["e925"],   ],
            [null,      null,      null,      ["e30"],   ["e20"],   null,      null,      null,      null,      ["*50"],    ["e1500"], ["e3000"], ["e425"],   ],
        ],
        complete() {
            player.des.giftHunterState = "1.8b2"
            player.des.giftHunterStates.game2 = true
            player.des.giftHunterInventory.quintupler = (player.des.giftHunterInventory.quintupler || 0) + 1
        }
    },
    "3": {
        type: "dungeon",
        height: 3,
        data: [
            [["p20"], [], ["+5"], ],
            [null, ["e20+1"], ],
            [["e20"], ["e16"], ["e40+6"], ["e34"], ],
            [null, null, null, ["e199"] ],
            [["e20", "e40"], ["e16", "e70"], ["e16", "e125"], ["*5"], ["e110+9"], ],
            [null, null, null, ["e599"] ],
            [["e20", "e30", "e640"], ["e16", "e50", "e199"], ["e10", "e100"], ["*1"], ["e30+5"], ],
        ],
        complete() {
            player.des.giftHunterState = "1.10b2"
            player.des.giftHunterStates.game3 = true
            player.des.giftHunterInventory.quintupler = (player.des.giftHunterInventory.quintupler || 0) + 1
            player.des.giftHunterInventory.tripler = (player.des.giftHunterInventory.tripler || 0) + 1
            player.des.giftHunterInventory.doubler = (player.des.giftHunterInventory.doubler || 0) + 1
            player.des.giftHunterInventory.smallBoost = (player.des.giftHunterInventory.smallBoost || 0) + 2
            player.des.giftHunterInventory.mediumBoost = (player.des.giftHunterInventory.mediumBoost || 0) + 3
        }
    },
    "4": {
        type: "tower",
        height: 2,
        data: [
            [["p4"], null, null, null, null,                null, null, null, null, null,                      ["e84"],  ],
            [["e2"], ["e3"], ["e4"],   null, null,          ["e777"], ["e1444"], ["e2888"], ["e5895"], ["*1"], ["e116"], ["e9999"], ["e2888"], ],
            [["e6"], ["e3"], ["e16"],  null, null,          ["e64"], ["e196"], ["e376"],    null, null,        ["e264"], ["e9999"], ["e2888"], ["e29999"], ["e59999"], ],
            [["e9"], ["e32"], ["e64"], ["e112+2"], ["*10"], ["e27"], ["e32"], ["e64"],      null, null,        ["e273"], ["e999"],  ["e1987"], ],
            [null, null, null, null, null,                  null, null, null, null,                 ["e8888"], ["e256"],  ],
        ],
        complete() {
            player.des.giftHunterState = "1.11c"
            player.des.giftHunterStates.game4 = true
            player.des.giftHunterInventory.smallBoost = (player.des.giftHunterInventory.smallBoost || 0) + 3
            player.des.giftHunterInventory.mediumBoost = (player.des.giftHunterInventory.mediumBoost || 0) + 2
        }
    },
}