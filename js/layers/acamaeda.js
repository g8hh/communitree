"use strict";

let smallClickable = {
    width: 'fit-content', 
    'min-height': 'fit-content', 
    'font-size': '14px',
    'border-radius': '5px',
}

let tmtBuyable = {
    width: '120px',
    height: '120px',
    'min-height': '120px',
    'font-size': '10px',
    'margin': '10px',
    'border-radius': '0px'
}

addLayer("aca", {
    name: "Acamaeda",
    symbol: "AC",

    row: 4,
    displayRow: 2,
    position: 0,
    branches: ["jac", "aar"],
    layerShown() { return player.aar.points.gte([250, 6]) || player.aca.best.gte(1) },

    startData() { return {
        points: EN(0),

        candies: EN(0),
        candiesTotal: EN(0),
        candiesEaten: EN(0),

        lollipops: EN(0),

        dropCandies: EN(0),
        farmCandies: EN(0),
        
        questLevel: 0,
        inQuest: false,
        enemies: {},
        playerPos: 0,
        actionTime: 0,
        health: EN(0),

        wpnLevel: EN(1),
        wpnTier: EN(0),

        spellInvest: 0,

        ach43Time: 0,
        upg256Time: 0,
        
        compPoints: EN(0),
        devTarget: "",
        devProgress: EN(0),

        modLevel: 0,
        modActive: false,
        modTimes: [],
    }},
    color: () => "#8fa140",
    nodeStyle: () => { return {
        background: options.antiEpilepsy ? 
            "linear-gradient(75deg, #ff6f34, #1ed34c)" : 
            (frame % 2 == 1 ? "#ff6f34" : "#1ed34c"),
        transition: ".5s, background 0s",
        "background-origin": "border-box !important",
    }},
    resource: "Acamaeda points",
    baseResource: "points",
    baseAmount: () => player.points,
    requires: EN([250, 7]),
    getResetGain() {
        return player.points.add(1).slog(10).sub(8.3798383).sqrt().mul(10).add(1).max(0).floor()
    },
    getNextAt() {
        let gain = this.getResetGain()
        return EN.tetr(10, gain.div(10).pow(2).add(8.3798383)).sub(1)
    },
    canReset() { return tmp.aca.getResetGain.gte(1) },
    type: "custom",
    prestigeDisplayType: "normal",
    onPrestige(gain) {
        player.subtabs.jac.main = "main"
        player.subtabs.aar.main = "main"
    },
    
    hotkeys: [
        {
            key: "c", 
            description: "C: Reset for Acamaeda points", 
            unlocked() {return tmp[this.layer].layerShown },
            onPress(){ if (canReset(this.layer)) doReset(this.layer) }
        },
    ],


    effect() {
        let eff = {
            candyGain: EN(1),
            genMult: EN.pow(2, player.aca.candies.mul(player.aca.candiesEaten).pow(0.8)),
            pointMult: EN.pent(10, player.aca.compPoints.add(1).log(10).pow(.4)),
            maxHealth: player.aca.candiesEaten.div(10).pow(0.5).add(100).floor(),
            atkPow: player.aca.wpnLevel.add(player.aca.wpnTier.mul(5)).pow(1.5).mul(EN.pow(1.1, player.aca.wpnLevel.add(player.aca.wpnTier.mul(80)))).floor(),
            devSpeed: player.aca.compPoints.add(10).log10().pow(buyableEffect("aca", 205).add(2)).mul(buyableEffect("aca", 202)),
            modMultis: []
        }

        if (hasUpgrade("aca", 123)) eff.genMult = EN.tetr(10, player.aca.farmCandies.div(2500).max(0).mul(hasUpgrade("aca", 124) ? player.aca.dropCandies.add(10).log10() : 1), eff.genMult)

        if (hasUpgrade("aca", 201)) eff.candyGain = eff.candyGain.mul(2)
        if (hasUpgrade("aca", 203)) eff.candyGain = eff.candyGain.mul(upgradeEffect("aca", 203))
        if (hasUpgrade("aca", 204)) eff.candyGain = eff.candyGain.mul(upgradeEffect("aca", 204))
        if (hasUpgrade("aca", 214)) eff.candyGain = eff.candyGain.mul(upgradeEffect("aca", 214))
        if (hasUpgrade("aca", 221)) eff.candyGain = eff.candyGain.mul(upgradeEffect("aca", 221))
        if (hasAchievement("aca", 11)) eff.candyGain = eff.candyGain.mul(player.aca.dropCandies.add(1))
        eff.candyGain = eff.candyGain.mul(buyableEffect("aca", 103))

        if (hasUpgrade("aca", 222)) eff.atkPow = eff.atkPow.mul(upgradeEffect("aca", 222))
        if (hasUpgrade("aca", 223)) eff.atkPow = eff.atkPow.mul(upgradeEffect("aca", 223))
        if (getBuyableAmount("aca", 111).gt(0)) eff.atkPow = eff.atkPow.mul(buyableEffect("aca", 111))

        if (player.aca.clickables[130] == "drank") {
            eff.atkPow = eff.atkPow.pow(1.2)
            eff.candyGain = eff.candyGain.pow(1.2)
            eff.maxHealth = eff.maxHealth.pow(1.2)
            eff.genMult = eff.genMult.tetr(eff.candyGain.add(10).log10())
        }

        if (hasUpgrade("aca", 331)) eff.devSpeed = eff.devSpeed.mul(upgradeEffect("aca", 331))
        if (hasUpgrade("aca", 333)) eff.devSpeed = eff.devSpeed.mul(upgradeEffect("aca", 333))
        eff.devSpeed = eff.devSpeed.mul(buyableEffect("aca", 207))
        
        if (player.aca.modTimes.length) {
            let formulae = [
                (x) => EN.pow(10, EN.pow(10, x.add(1).log().mul(200).add(x.mul(25))))
            ]
            for (let i = player.aca.modTimes.length - 1; i >= 0; i--) eff.modMultis.unshift(formulae[i](player.aca.modTimes[i]))
            eff.devSpeed = eff.devSpeed.mul(eff.modMultis[0])
        }
        if (player.aca.modActive) switch (player.aca.modLevel) {
            case 0: eff.devSpeed = eff.devSpeed.mul(tmp.tfu.effect.devBonus); break;
        }
        
        if (hasUpgrade("aca", 231) && getBuyableAmount("aca", 113).gt(0)) {
            eff.candyGain = eff.candyGain.mul(10)
        }

        return eff
    },

    upgrades: {
        101: {
            title: "Start... again?",
            description: "Boost to point gain based on Acamaeda reset time.",
            cost: EN(1),
            effect() {
                let time = EN(player.aca.resetTime)
                if (hasMilestone("aca", 0)) time = time.mul(player.jac.buyables[143].add(1).slog(10).div(10).add(1))
                if (hasMilestone("aca", 2)) time = time.mul(player.aar.points.add(1).slog(10).div(10).add(1))
                if (hasUpgrade("aca", 102)) time = time.mul(upgradeEffect("aca", 102))
                if (hasUpgrade("aca", 111)) time = time.mul(upgradeEffect("aca", 111))
                if (hasUpgrade("aca", 121)) time = time.pow(upgradeEffect("aca", 121))
                return EN.tetr(10, time.add(1).pow(0.4), time)
            },
            effectDisplay() { return "^" + format(this.effect()) },
            unlocked() { return player.aca.best.gte(1) },
        },
        102: {
            title: "New Beginning",
            description: "Boost to <b>Start... again?</b>'s time based on Acamaeda reset time.",
            cost: EN(32),
            effect() {
                let time = EN(player.aca.resetTime)
                if (hasUpgrade("aca", 103)) time = time.mul(upgradeEffect("aca", 103))
                if (hasUpgrade("aca", 111)) time = time.mul(upgradeEffect("aca", 111))
                if (hasUpgrade("aca", 121)) time = time.pow(upgradeEffect("aca", 121))
                return time.pow(0.5).mul(0.5).add(1)
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("aca", 101) },
        },
        103: {
            title: "Another Generation",
            description: "Boost to <b>New Beginning</b>'s time based on Acamaeda points.",
            cost: EN(64),
            effect() {
                let points = player.aca.points
                if (hasUpgrade("aca", 104)) points = points.mul(upgradeEffect("aca", 104))
                if (hasUpgrade("aca", 111)) points = points.mul(upgradeEffect("aca", 111))
                if (hasUpgrade("aca", 121)) points = points.pow(upgradeEffect("aca", 121))
                return points.pow(0.9).add(2)
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("aca", 102) },
        },
        104: {
            title: "Expected Synergy",
            description: "Boost to <b>Another Generation</b>'s points based on total Acamaeda points.",
            cost: EN(160),
            effect() {
                let points = player.aca.total
                if (hasUpgrade("aca", 105)) points = points.mul(upgradeEffect("aca", 105))
                if (hasUpgrade("aca", 111)) points = points.mul(upgradeEffect("aca", 111))
                if (hasUpgrade("aca", 121)) points = points.pow(upgradeEffect("aca", 121))
                return points.pow(0.9).add(1.5)
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("aca", 103) },
        },
        105: {
            title: "The Last One",
            description: "Boost to <b>Expected Synergy</b>'s points based on best Acamaeda points.",
            cost: EN(640),
            effect() {
                let points = player.aca.best
                if (hasUpgrade("aca", 111)) points = points.mul(upgradeEffect("aca", 111))
                if (hasUpgrade("aca", 121)) points = points.pow(upgradeEffect("aca", 121))
                return points.pow(0.9).add(1)
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("aca", 104) },
        },
        111: {
            title: "Row 1 Boost",
            description: "Boost to all previous boosts based on Acamaeda reset time.",
            cost: EN(1e100),
            effect() {
                let time = EN(player.aca.resetTime)
                if (hasUpgrade("aca", 112)) time = time.pow(upgradeEffect("aca", 112))
                if (hasUpgrade("aca", 121)) time = time.pow(upgradeEffect("aca", 121))
                return time.add(1).log().add(1)
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("aca", 105) },
        },
        112: {
            title: "Row 1^2 Boost",
            description: "Boost to <b>Row 1 Boost</b>'s time based on time since played.",
            cost: EN(1e308),
            effect() {
                let time = EN(player.timePlayed)
                if (hasUpgrade("aca", 113)) time = time.pow(upgradeEffect("aca", 113))
                if (hasUpgrade("aca", 121)) time = time.pow(upgradeEffect("aca", 121))
                return time.pow(2).add(1)
            },
            effectDisplay() { return "^" + format(this.effect()) },
            unlocked() { return hasUpgrade("aca", 111) },
        },
        113: {
            title: "Row 1^3 Boost",
            description: "Boost to <b>Row 1^2 Boost</b>'s time based on Acamaeda reset time.",
            cost: EN("e4800"),
            effect() {
                let time = EN(player.aca.resetTime)
                if (hasUpgrade("aca", 114)) time = time.pow(upgradeEffect("aca", 114))
                if (hasUpgrade("aca", 121)) time = time.pow(upgradeEffect("aca", 121))
                return time.add(1).log().div(Math.log(2)).add(1).pow(2)
            },
            effectDisplay() { return "^" + format(this.effect()) },
            unlocked() { return hasUpgrade("aca", 112) },
        },
        114: {
            title: "Row 1^4 Boost",
            description: "Boost to <b>Row 1^3 Boost</b>'s time based on Acamaeda points.",
            cost: EN("e32000"),
            effect() {
                let points = player.aca.points
                let eff = points.add(1).log().add(1).log().pow(0.25).add(1)
                if (hasUpgrade("aca", 115)) eff = eff.pow(upgradeEffect("aca", 115))
                if (hasUpgrade("aca", 121)) eff = eff.pow(upgradeEffect("aca", 121))
                return eff
            },
            effectDisplay() { return "^" + format(this.effect()) },
            unlocked() { return hasUpgrade("aca", 113) },
        },
        115: {
            title: "Row 1^5 Boost",
            description: "Boost to <b>Row 1^4 Boost</b>'s effect based on Acamaeda points.",
            cost: EN("ee6"),
            effect() {
                let points = player.aca.best
                let eff = points.add(1).log().add(1).log().pow(0.3).add(1)
                if (hasUpgrade("aca", 121)) eff = eff.pow(upgradeEffect("aca", 121))
                return eff
            },
            effectDisplay() { return "^" + format(this.effect()) },
            unlocked() { return hasUpgrade("aca", 114) },
        },
        121: {
            title: "Row 2 Boost",
            description: "Boost to all previous boosts based on Acamaeda reset time.",
            cost: EN("e2.5e7"),
            effect() {
                let time = EN(player.aca.resetTime)
                return time.add(1).log().pow(0.05).mul(0.5).add(1)
            },
            effectDisplay() { return "^" + format(this.effect()) },
            unlocked() { return hasUpgrade("aca", 115) },
        },
        122: {
            title: "Automagically",
            description: "gain Acamaeda points, as if you do a reset each second.",
            cost: EN("ee32"),
            unlocked() { return hasUpgrade("aca", 115) },
        },
        123: {
            title: "Are We Forgetting the Main Game?",
            description: "Farm candies boosts <b>Automagically</b>'s power.",
            cost: EN("eee200"),
            unlocked() { return hasUpgrade("aca", 115) && player.aca.best.gte("ee180") },
        },
        124: {
            title: "No Longer Useless",
            description: "Drop candies boosts <b>Automagically</b>'s power.",
            cost: EN("10^^10000001"),
            unlocked() { return hasUpgrade("aca", 115) && player.aca.best.gte("10^^8000001") },
        },
        125: {
            title: "The Modding Tree",
            description: "Unlocks the “The Modding Tree” tab.",
            cost: EN([9, 3, 1]),
            unlocked() { return hasUpgrade("aca", 115) && player.aca.best.gte([6, 3, 1]) },
        },
        200: {
            title: "The Most Ambitious Cross-over in the History of Incremental Games,<br/>forever and ever and Ever and <i><b>EVER<b></i>.",
            description: "Unlocks The Candy Tab.",
            cost: EN("ee100"),
            unlocked() { return hasUpgrade("aca", 122) },
            style: { width: "600px" }
        },
        201: {
            title: "Ask the dev to add upgrades.",
            description: "Double candy gain.",
            cost: EN(10),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "candies",
            currencyInternalName: "candies",
            unlocked() { return player.aca.candiesEaten.gte(15) },
        },
        202: {
            title: "The Candy Merchant",
            description: "Discover the magic of lollipops.",
            cost: EN(10),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "candies",
            currencyInternalName: "candies",
            unlocked() { return hasUpgrade("aca", 201) },
        },
        203: {
            title: "Magic Lollipops",
            description: "Your lollipops boost your candies.",
            cost: EN(2),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "lollipops",
            currencyInternalName: "lollipops",
            effect() {
                return player.aca.lollipops.sqrt().add(2)
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("aca", 202) },
        },
        204: {
            title: "Self-Replicating Candies",
            description: "Your candies boost your candies.",
            cost: EN(5),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "lollipops",
            currencyInternalName: "lollipops",
            effect() {
                return player.aca.candies.pow(.25).add(2)
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("aca", 203) },
        },
        205: {
            title: "Loyal Customer",
            description: "Your lollipops boost your lollipops.",
            cost: EN(1000),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "candies",
            currencyInternalName: "candies",
            effect() {
                return player.aca.lollipops.pow(.2).add(1)
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("aca", 204) },
        },
        206: {
            title: "Quest Reward",
            description: "<b>Quest Rune VI</b> grows by 3 seconds when you kill an enemy.",
            cost: EN("ee300"),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "candies",
            currencyInternalName: "candies",
            unlocked() { return hasAchievement("aca", 43) },
        },
        211: {
            title: "Candy is Magic",
            description: "Your candies boost your lollipops.",
            cost: EN(150),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "lollipops",
            currencyInternalName: "lollipops",
            effect() {
                return player.aca.candies.pow(.1).add(1)
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("aca", 205) },
        },
        212: {
            title: "Time for a Quest!",
            description: "Unlock Questing.",
            cost: EN(1000),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "lollipops",
            currencyInternalName: "lollipops",
            unlocked() { return hasUpgrade("aca", 205) },
            onPurchase() {
                player.aca.health = tmp.aca.effect.maxHealth
            }
        },
        213: {
            title: "This isn't in the original game?",
            description: "Unlock Enhancement.",
            cost: EN(25),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "drop candies",
            currencyInternalName: "dropCandies",
            unlocked() { return hasUpgrade("aca", 212) },
        },
        214: {
            title: "Magical Drop Candies",
            description: "Drop candies boost your candies.",
            cost: EN(250),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "drop candies",
            currencyInternalName: "dropCandies",
            effect() {
                return player.aca.dropCandies.pow(.5).add(1)
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("aca", 212) },
        },
        215: {
            title: "A Key to the Farm",
            description: "Unlock Farming.",
            cost: EN(10000000),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "lollipops",
            currencyInternalName: "lollipops",
            unlocked() { return hasUpgrade("aca", 212) },
        },
        216: {
            title: "Quest Reward Reward",
            description: "<b>Quest Rune VI</b> grows by 30 seconds when you complete a quest.",
            cost: EN("ee600"),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "candies",
            currencyInternalName: "candies",
            unlocked() { return hasAchievement("aca", 43) },
        },
        221: {
            title: "Magical Farm Candies",
            description: "Farm candies boost your candies.",
            cost: EN(100000),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "drop candies",
            currencyInternalName: "dropCandies",
            effect() {
                return player.aca.farmCandies.add(1).pow(5)
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("aca", 215) },
        },
        222: {
            title: "Candies are Good for Your Health",
            description: "Your POW is boosted by candies eaten.",
            cost: EN(1e16),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "candies",
            currencyInternalName: "candies",
            effect() {
                return player.aca.candiesEaten.add(1).pow(0.035)
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("aca", 215) },
        },
        223: {
            title: "Vegetable-Flavored Candies",
            description: "Your POW is boosted by you farm candies.",
            cost: EN(50000000),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "drop candies",
            currencyInternalName: "dropCandies",
            effect() {
                return player.aca.farmCandies.add(1)
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("aca", 215) },
        },
        224: {
            title: "Study the Magic of the Candies",
            description: "Unlocks spells in questing, which you can cast with the cost of your HP.",
            cost: EN(1e24),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "candies",
            currencyInternalName: "candies",
            unlocked() { return hasUpgrade("aca", 215) },
        },
        225: {
            title: "Determination",
            description: "You can now heal yourself, even in quests.",
            cost: EN(1e20),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "lollipops",
            currencyInternalName: "lollipops",
            unlocked() { return hasUpgrade("aca", 215) },
        },
        226: {
            title: "Obesity",
            description: "<b>Quest Rune VI</b>'s effect is boosted by your candies eaten.",
            cost: EN("ee1500"),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "candies",
            currencyInternalName: "candies",
            effect() {
                return player.aca.candiesEaten.add(1).log().add(10).log().pow(1.2)
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasAchievement("aca", 43) },
        },
        231: {
            title: "Time Ring",
            description: "When you use the Time Speed-up spell, all candy productions are boosted by 10×.",
            cost: EN(1e42),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "candies",
            currencyInternalName: "candies",
            unlocked() { return hasUpgrade("aca", 225) },
        },
        232: {
            title: "Learn to Control Your Magic",
            description: "You can make your base magic cost higher to increase your spells' time.",
            cost: EN(1e36),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "lollipops",
            currencyInternalName: "lollipops",
            unlocked() { return hasUpgrade("aca", 225) },
        },
        233: {
            title: "Candybound",
            description: "Berserk Mode and Sword of Midas are boosted based on their time remaining.",
            cost: EN(6.666e66),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "candies",
            currencyInternalName: "candies",
            unlocked() { return hasUpgrade("aca", 225) },
        },
        234: {
            title: "Spell of Spells",
            description: "Spell Bonanza gets stronger based on time remaining.",
            cost: EN(1e80),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "candies",
            currencyInternalName: "candies",
            unlocked() { return hasUpgrade("aca", 225) },
        },
        235: {
            title: "Lollidrops",
            description: "Drop candies boosts your lollipops.",
            cost: EN(1e30),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "drop candies",
            currencyInternalName: "dropCandies",
            effect() {
                return player.aca.dropCandies.add(1).pow(0.2)
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("aca", 225) },
        },
        236: {
            title: "Quest Lollipops",
            description: "<b>Quest Rune VI</b>'s effect is boosted by your lollipops.",
            cost: EN("ee2500"),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "candies",
            currencyInternalName: "candies",
            effect() {
                return player.aca.candiesEaten.add(1).log().add(10).log().pow(5)
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasAchievement("aca", 43) },
        },
        241: {
            title: "Farmed Lollipops",
            description: "Farm candies boosts your lollipops.",
            cost: EN(1.111e111),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "candies",
            currencyInternalName: "candies",
            effect() {
                return player.aca.farmCandies.add(1).pow(3)
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("aca", 235) },
        },
        242: {
            title: "Magic Candies, for real",
            description: "Berserk Mode, Sword of Midas and Spell Bonanza are boosted by your candies.",
            cost: EN(1e132),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "candies",
            currencyInternalName: "candies",
            effect() {
                let eff = player.aca.candies.pow(0.02).add(1)
                if (hasAchievement("aca", 12)) eff = eff.mul(player.aca.buyables[111].max(1))
                return eff
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("aca", 235) },
        },
        243: {
            title: "More Space to Farm",
            description: "Quest Difficulty boosts farm candy gain.",
            cost: EN(1e50),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "drop candies",
            currencyInternalName: "dropCandies",
            effect() {
                return player.aca.questLevel * .1
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("aca", 235) },
        },
        244: {
            title: "Farm Lollipops",
            description: "Lollipops boosts farm candy gain.",
            cost: EN(1e182),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "lollipops",
            currencyInternalName: "lollipops",
            effect() {
                return player.aca.lollipops.max(1).log10().div(2)
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("aca", 235) },
        },
        245: {
            title: "Not Just About Planting",
            description: "Unlocks more farm buidings.",
            cost: EN(10000000),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "farm candies",
            currencyInternalName: "farmCandies",
            unlocked() { return hasUpgrade("aca", 235) },
        },
        246: {
            title: "Dekeract Candies",
            description: "<b>Quest Rune VI</b>'s base effect is raised by ^10.",
            cost: EN("ee7500"),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "candies",
            currencyInternalName: "candies",
            unlocked() { return hasAchievement("aca", 43) },
        },
        251: {
            title: "Non-stop Knight",
            description: "Automagically start quests right after you finish them.",
            cost: EN(1e255),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "candies",
            currencyInternalName: "candies",
            unlocked() { return hasUpgrade("aca", 245) },
        },
        252: {
            title: "Improved Fertilizer",
            description: "Windmills and Lolligators boost farm candy gain.",
            cost: EN(1e300),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "candies",
            currencyInternalName: "candies",
            effect() {
                let eff = player.aca.buyables[103].add(1).mul(player.aca.buyables[104].add(1))
                if (hasUpgrade("aca", 254)) eff = eff.pow(upgradeEffect("aca", 254))
                return eff
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("aca", 245) },
        },
        253: {
            title: "Teleportation Ring",
            description: "You teleports to the next enemy or quest automatically.",
            cost: EN(1e92),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "drop candies",
            currencyInternalName: "dropCandies",
            unlocked() { return hasUpgrade("aca", 245) },
        },
        254: {
            title: "Corpses as Fertilizer",
            description: "Drop candies boosts <b>Improved Fertilizer</b>'s effect.",
            cost: EN("7.777e777"),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "lollipops",
            currencyInternalName: "lollipops",
            effect() {
                let eff = player.aca.dropCandies.add(1).log().sub(99).max(1).log().div(5).add(1)
                return eff
            },
            effectDisplay() { return "^" + format(this.effect()) },
            unlocked() { return hasUpgrade("aca", 245) },
        },
        255: {
            title: "Candy Tab",
            description: "Unlocks the Candy Tab, like, the <i>real</i> Candy Tab.",
            cost: EN("e1500"),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "candies",
            currencyInternalName: "candies",
            unlocked() { return hasUpgrade("aca", 245) },
        },
        256: {
            title: "Quest Rune Wannabe",
            description: "<b>Quest Rune VI</b>'s base effect is boosted by time since this upgrade was bought.",
            cost: EN("ee25000"),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "candies",
            currencyInternalName: "candies",
            effect() {
                let eff = EN.pow(10, (player.aca.upg256Time / 15) ** .75)
                return eff
            },
            effectDisplay() { return "^" + format(this.effect()) },
            unlocked() { return hasAchievement("aca", 43) },
        },
        301: {
            title: "Tree of Content",
            description: "Multiplies first three components' effect based on component points' effect.",
            cost: EN("4.2e86"),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "component points",
            currencyInternalName: "compPoints",
            effect() {
                let eff = player.aca.compPoints.add(1).log(10).pow(.4).sub(1).max(1)
                return eff
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasAchievement("aca", 43) },
            style: { margin: "10px" }
        },
        311: {
            title: "Easier Challenges",
            description: "<b>Challenges</b> are easier based on its amount.",
            cost() {
                let cost = EN("1e145")
                let ugs = EN("e70")
                for (let a = 311; a <= 312; a++) if (hasUpgrade("aca", a)) {
                    cost = cost.mul(ugs)
                    ugs = ugs.mul("e10")
                }
                return cost
            },
            req: [301],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("aca", a)) return false
                return player.aca.compPoints.gte(tmp.aca.upgrades[this.id].cost) 
            },
            pay() { player.aca.compPoints = player.aca.compPoints.sub(tmp.aca.upgrades[this.id].cost) },
            effect() {
                let x = player.aca.buyables[203]
                let eff = x.add(1).pow(x.div(3).add(1))
                return eff
            },
            effectDisplay() { return "∕" + format(this.effect()) },
            unlocked() { return hasAchievement("aca", 43) },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        312: {
            title: "Challenge Buyables",
            description: "<b>Challenges</b> are easier based on <b>Buyables</b>' amount.",
            cost() {
                let cost = EN("1e145")
                let ugs = EN("e70")
                for (let a = 311; a <= 312; a++) if (hasUpgrade("aca", a)) {
                    cost = cost.mul(ugs)
                    ugs = ugs.mul("e10")
                }
                return cost
            },
            req: [301],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("aca", a)) return false
                return player.aca.compPoints.gte(tmp.aca.upgrades[this.id].cost) 
            },
            pay() { player.aca.compPoints = player.aca.compPoints.sub(tmp.aca.upgrades[this.id].cost) },
            effect() {
                let x = player.aca.buyables[204]
                let eff = x.mul(1.8).add(1).pow(x.div(2).add(1))
                return eff
            },
            effectDisplay() { return "∕" + format(this.effect()) },
            unlocked() { return hasAchievement("aca", 43) },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        321: {
            title: "Challenge Upgrades",
            description: "<b>Easier Challenges</b>' effect boosts <b>Upgrades</b>' effect.",
            cost() {
                let cost = EN("1e219")
                let ugs = EN("e171")
                for (let a = 321; a <= 324; a++) if (hasUpgrade("aca", a)) {
                    cost = cost.mul(ugs)
                    ugs = ugs.mul("e12")
                }
                return cost
            },
            req: [311],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("aca", a)) return false
                return player.aca.compPoints.gte(tmp.aca.upgrades[this.id].cost) 
            },
            pay() { player.aca.compPoints = player.aca.compPoints.sub(tmp.aca.upgrades[this.id].cost) },
            effect() {
                let eff = upgradeEffect("aca", 311).pow(3)
                return eff
            },
            effectDisplay() { return "×" + format(this.effect()) },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        322: {
            title: "Buyable Challenges?",
            description: "The previous two upgrades above boosts <b>Buyables</b>' effect.",
            cost() {
                let cost = EN("1e219")
                let ugs = EN("e171")
                for (let a = 321; a <= 324; a++) if (hasUpgrade("aca", a)) {
                    cost = cost.mul(ugs)
                    ugs = ugs.mul("e12")
                }
                return cost
            },
            req: [311, 312],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("aca", a)) return false
                return player.aca.compPoints.gte(tmp.aca.upgrades[this.id].cost) 
            },
            pay() { player.aca.compPoints = player.aca.compPoints.sub(tmp.aca.upgrades[this.id].cost) },
            effect() {
                let eff = upgradeEffect("aca", 311).mul(upgradeEffect("aca", 312)).log().sqrt().div(50).add(1)
                return eff
            },
            effectDisplay() { return "×" + format(this.effect()) },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        323: {
            title: "Upgrade Upgrades",
            description: "The previous two upgrades above boosts <b>Upgrades</b>' effect.",
            cost() {
                let cost = EN("1e219")
                let ugs = EN("e171")
                for (let a = 321; a <= 324; a++) if (hasUpgrade("aca", a)) {
                    cost = cost.mul(ugs)
                    ugs = ugs.mul("e12")
                }
                return cost
            },
            req: [311, 312],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("aca", a)) return false
                return player.aca.compPoints.gte(tmp.aca.upgrades[this.id].cost) 
            },
            pay() { player.aca.compPoints = player.aca.compPoints.sub(tmp.aca.upgrades[this.id].cost) },
            effect() {
                let eff = upgradeEffect("aca", 311).mul(upgradeEffect("aca", 312)).pow(1.8).add(1)
                return eff
            },
            effectDisplay() { return "×" + format(this.effect()) },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        324: {
            title: "Challenge Milestones",
            description: "<b>Challenge Buyables</b>' effect boosts <b>Milestones</b>' effect.",
            cost() {
                let cost = EN("1e219")
                let ugs = EN("e171")
                for (let a = 321; a <= 324; a++) if (hasUpgrade("aca", a)) {
                    cost = cost.mul(ugs)
                    ugs = ugs.mul("e12")
                }
                return cost
            },
            req: [312],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("aca", a)) return false
                return player.aca.compPoints.gte(tmp.aca.upgrades[this.id].cost) 
            },
            pay() { player.aca.compPoints = player.aca.compPoints.sub(tmp.aca.upgrades[this.id].cost) },
            effect() {
                let eff = upgradeEffect("aca", 312).pow(.5)
                return eff
            },
            effectDisplay() { return "×" + format(this.effect()) },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        331: {
            title: "Upgrade Buyables",
            description: "Boost to dev speed based on connected upgrades.",
            cost() {
                let cost = EN("1e1192")
                let ugs = EN("e500")
                for (let a = 331; a <= 333; a++) if (hasUpgrade("aca", a)) {
                    cost = cost.mul(ugs)
                    ugs = ugs.mul("e500")
                }
                return cost
            },
            req: [321, 322],
            effect() {
                let eff = upgradeEffect("aca", 321).pow(upgradeEffect("aca", 322).sub(1))
                return eff
            },
            effectDisplay() { return "×" + format(this.effect()) },
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("aca", a)) return false
                return player.aca.compPoints.gte(tmp.aca.upgrades[this.id].cost) 
            },
            pay() { player.aca.compPoints = player.aca.compPoints.sub(tmp.aca.upgrades[this.id].cost) },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        332: {
            title: "Just an Upgrade",
            description: "Development speed multiplies component points, thrice.",
            cost() {
                let cost = EN("1e1192")
                let ugs = EN("e500")
                for (let a = 331; a <= 333; a++) if (hasUpgrade("aca", a)) {
                    cost = cost.mul(ugs)
                    ugs = ugs.mul("e500")
                }
                return cost
            },
            req: [322, 323],
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("aca", a)) return false
                return player.aca.compPoints.gte(tmp.aca.upgrades[this.id].cost) 
            },
            pay() { player.aca.compPoints = player.aca.compPoints.sub(tmp.aca.upgrades[this.id].cost) },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
        333: {
            title: "Upgrade Milestones",
            description: "Boost to dev speed based on connected upgrades.",
            cost() {
                let cost = EN("1e1192")
                let ugs = EN("e500")
                for (let a = 331; a <= 333; a++) if (hasUpgrade("aca", a)) {
                    cost = cost.mul(ugs)
                    ugs = ugs.mul("e500")
                }
                return cost
            },
            req: [323, 324],
            effect() {
                let eff = upgradeEffect("aca", 323).pow(upgradeEffect("aca", 324).max(1).log().div(70))
                return eff
            },
            effectDisplay() { return "×" + format(this.effect()) },
            canAfford() {
                for (let a of this.req) if (!hasUpgrade("aca", a)) return false
                return player.aca.compPoints.gte(tmp.aca.upgrades[this.id].cost) 
            },
            pay() { player.aca.compPoints = player.aca.compPoints.sub(tmp.aca.upgrades[this.id].cost) },
            branches() { 
                let col = hasUpgrade(this.layer, this.id) ? "#77df5f" : "#9c7575"
                return this.req.map(x => [x, col]) 
            },
            style: { margin: "10px" }
        },
    },

    milestones: {
        0: {
            requirementDescription: "10 Acamaeda points",
            effectDescription: "Automatically gains Phantom Souls. Phantom Souls boost <b>Start... again?</b>'s effect",
            done() { return player.aca.points.gte(10) },
            unlocked() { return player.aca.best.gte(1) },
        },
        1: {
            requirementDescription: "100 Acamaeda points",
            effectDescription: "Gain your amount of Jacorb points equal to your Acamaeda points on Acamaeda resets. Jacorb upgrades are bought automagically.",
            done() { return player.aca.points.gte(100) },
            unlocked() { return player.aca.best.gte(1) },
        },
        2: {
            requirementDescription: "1,000 Acamaeda points",
            effectDescription: "Automatically gains Aarex points. Aarex points boost <b>Start... again?</b>'s effect",
            done() { return player.aca.points.gte(1000) },
            unlocked() { return player.aca.best.gte(1) },
        },
    },

    buyables: {
        101: {
            title() {
                return formatWhole(player[this.layer].buyables[this.id]) + " / 100"
            }, 
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `lollipop farms
                
                which are giving ${formatWhole(data.effect)}% of your lollipops gained on trade each second, plus a extra ${formatWhole(x.mul(10))} farm candies per hour.
                
                Costs ${formatWhole(data.cost)}</h3> farm candies`
            },
            unlocked() {
                return hasUpgrade("aca", 215)
            },
            effect() {
                return player[this.layer].buyables[this.id]
            },
            cost() {
                return player[this.layer].buyables[this.id].pow(2)
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.aca.farmCandies.gte(data.cost) && player[this.layer].buyables[this.id].lt(100)
            },
            buy() { 
                let data = tmp[this.layer].buyables[this.id]
                player.aca.farmCandies = player.aca.farmCandies.sub(data.cost)
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            }
        },
        102: {
            title() {
                return formatWhole(player[this.layer].buyables[this.id]) + " / 100"
            }, 
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `farm candy farms
                
                which are giving ${formatWhole(x.mul(35))} farm candies per hour.
                
                Costs ${formatWhole(data.cost)}</h3> farm candies`
            },
            unlocked() {
                return hasUpgrade("aca", 215)
            },
            effect() {
                return player[this.layer].buyables[this.id]
            },
            cost() {
                return player[this.layer].buyables[this.id].add(1).mul(5)
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.aca.farmCandies.gte(data.cost) && player[this.layer].buyables[this.id].lt(100)
            },
            buy() { 
                let data = tmp[this.layer].buyables[this.id]
                player.aca.farmCandies = player.aca.farmCandies.sub(data.cost)
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            }
        },
        103: {
            title() {
                return formatWhole(player[this.layer].buyables[this.id]) + " / 100"
            }, 
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `windmills
                
                which are giving you ${formatWhole(data.effect)}× more candies, based on lollipops.
                
                Costs ${formatWhole(data.cost)}</h3> farm candies`
            },
            unlocked() {
                return hasUpgrade("aca", 245)
            },
            effect() {
                let eff = (player.aca.lollipops.add(1).log().add(1)).add(1).pow(player[this.layer].buyables[this.id].pow(0.9))
                if (hasAchievement("aca", 33)) eff = eff.pow(2).mul(player.aca.farmCandies.add(1))
                return eff
            },
            cost() {
                return EN.pow(1.25, player[this.layer].buyables[this.id]).mul(1000000)
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.aca.farmCandies.gte(data.cost) && player[this.layer].buyables[this.id].lt(100)
            },
            buy() { 
                let data = tmp[this.layer].buyables[this.id]
                player.aca.farmCandies = player.aca.farmCandies.sub(data.cost)
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            }
        },
        104: {
            title() {
                return formatWhole(player[this.layer].buyables[this.id]) + " / 100"
            }, 
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `lolligators
                
                which are giving you ${formatWhole(data.effect)}× more lollipops, based on candies.
                
                Costs ${formatWhole(data.cost)}</h3> farm candies`
            },
            unlocked() {
                return hasUpgrade("aca", 245)
            },
            effect() {
                let eff = (player.aca.candies.add(1).log().add(1)).add(1).pow(player[this.layer].buyables[this.id].pow(0.9))
                if (hasAchievement("aca", 33)) eff = eff.pow(2).mul(player.aca.farmCandies.add(1))
                return eff
            },
            cost() {
                return EN.pow(1.3, player[this.layer].buyables[this.id]).mul(3000000)
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.aca.farmCandies.gte(data.cost) && player[this.layer].buyables[this.id].lt(100)
            },
            buy() { 
                let data = tmp[this.layer].buyables[this.id]
                player.aca.farmCandies = player.aca.farmCandies.sub(data.cost)
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            }
        },
        111: {
            title() {
                return formatTime(player[this.layer].buyables[this.id].max(0))
            }, 
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `Berserk Mode
                
                Infect yourself with dark magic to become a berserker, which makes yourself ${formatWhole(data.effect)}× stronger.
                
                Costs ${format(data.costBase)} + ${formatWhole(data.costPercent * 100)}% of your max HP
                (${formatWhole(data.cost)})`
            },
            unlocked() {
                return hasUpgrade("aca", 224)
            },
            effect() {
                let eff = EN(10)
                if (getBuyableAmount("aca", 115).gt(0)) eff = eff.mul(buyableEffect("aca", 115))
                if (hasUpgrade("aca", 233)) eff = eff.mul(player[this.layer].buyables[this.id].max(0).add(1).sqrt())
                if (hasUpgrade("aca", 242)) eff = eff.mul(upgradeEffect("aca", 242))
                return eff
            },
            costPercent: 0.05,
            costBase() {
                let cost = 1e9
                return logLerp(cost, tmp.aca.effect.maxHealth.mul(1 - this.costPercent), player.aca.spellInvest).max(cost)
            },
            cost() {
                let data = tmp[this.layer].buyables[this.id]
                return tmp.aca.effect.maxHealth.mul(this.costPercent).add(data.costBase)
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.aca.health.gte(data.cost)
            },
            buy() { 
                let data = tmp[this.layer].buyables[this.id]
                player.aca.health = player.aca.health.sub(data.cost)
                let timeMul = data.costBase.div(1e9).log(10).add(1)
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].max(timeMul.mul(30))
            }
        },
        112: {
            title() {
                return formatTime(player[this.layer].buyables[this.id].max(0))
            }, 
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `Sword of Midas
                
                Turns all the drop candies dropped by an enemy into gold, therefore making them worth ${formatWhole(data.effect)}× more.
                
                Costs ${format(data.costBase)} + ${formatWhole(data.costPercent * 100)}% of your max HP
                (${formatWhole(data.cost)})`
            },
            unlocked() {
                return hasUpgrade("aca", 224) && tmp.aca.effect.maxHealth.gte(1e12)
            },
            effect() {
                let eff = EN(5)
                if (getBuyableAmount("aca", 115).gt(0)) eff = eff.mul(buyableEffect("aca", 115))
                if (hasUpgrade("aca", 233)) eff = eff.mul(player[this.layer].buyables[this.id].max(0).add(1).sqrt())
                if (hasUpgrade("aca", 242)) eff = eff.mul(upgradeEffect("aca", 242))
                return eff
            },
            costPercent: 0.1,
            costBase() {
                let cost = 1e12
                return logLerp(cost, tmp.aca.effect.maxHealth.mul(1 - this.costPercent), player.aca.spellInvest).max(cost)
            },
            cost() {
                let data = tmp[this.layer].buyables[this.id]
                return tmp.aca.effect.maxHealth.mul(this.costPercent).add(data.costBase)
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.aca.health.gte(data.cost)
            },
            buy() { 
                let data = tmp[this.layer].buyables[this.id]
                player.aca.health = player.aca.health.sub(data.cost)
                let timeMul = data.costBase.div(1e12).log(10).add(1)
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].max(timeMul.mul(30))
            }
        },
        113: {
            title() {
                return formatTime(player[this.layer].buyables[this.id].max(0))
            }, 
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `Time Speed-up
                
                Disturb the flow of time to make it flow faster, which makes actions in quests ${formatWhole(data.effect)}× faster.
                
                Costs ${format(data.costBase)} + ${formatWhole(data.costPercent * 100)}% of your max HP
                (${formatWhole(data.cost)})`
            },
            unlocked() {
                return hasUpgrade("aca", 224) && tmp.aca.effect.maxHealth.gte(1e16)
            },
            effect() {
                return 2
            },
            costPercent: 0.12,
            costBase() {
                let cost = 1e16
                return logLerp(cost, tmp.aca.effect.maxHealth.mul(1 - this.costPercent), player.aca.spellInvest).max(cost)
            },
            cost() {
                let data = tmp[this.layer].buyables[this.id]
                return tmp.aca.effect.maxHealth.mul(this.costPercent).add(data.costBase)
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.aca.health.gte(data.cost)
            },
            buy() { 
                let data = tmp[this.layer].buyables[this.id]
                player.aca.health = player.aca.health.sub(data.cost)
                let timeMul = data.costBase.div(1e16).log(10).add(1)
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].max(timeMul.mul(30))
            }
        },
        114: {
            title() {
                let x = player[this.layer].buyables[this.id]
                return x.lte(0) ? "(" + formatTime(EN(60).add(x).max(0)) + ")" : formatTime(x)
            }, 
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `Healing Candy
                
                Enchant one of your candy with healing properties, and heal yourself ${format(data.effect)}× faster. There is a 60 second cooldown between uses.
                
                Costs ${format(data.costBase)} + ${formatWhole(data.costPercent * 100)}% of your max HP
                (${formatWhole(data.cost)})`
            },
            unlocked() {
                return hasUpgrade("aca", 224) && tmp.aca.effect.maxHealth.gte(1e21)
            },
            effect() {
                let maxhp = tmp.aca.effect.maxHealth
                let eff = maxhp.add(100).log10().mul(10).min(100).div(5)
                return eff
            },
            costPercent: 0.4,
            costBase() {
                let cost = 1e21
                return logLerp(cost, tmp.aca.effect.maxHealth.mul(1 - this.costPercent), player.aca.spellInvest).max(cost)
            },
            cost() {
                let data = tmp[this.layer].buyables[this.id]
                return tmp.aca.effect.maxHealth.mul(this.costPercent).add(data.costBase)
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.aca.health.gte(data.cost) && player[this.layer].buyables[this.id].lte(-60)
            },
            buy() { 
                let data = tmp[this.layer].buyables[this.id]
                player.aca.health = player.aca.health.sub(data.cost)
                let timeMul = data.costBase.div(1e21).log(10).add(1)
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].max(timeMul.mul(15))
            }
        },
        115: {
            title() {
                let x = player[this.layer].buyables[this.id]
                return x.lte(0) ? "(" + formatTime(EN(60).add(x).max(0)) + ")" : formatTime(x)
            }, 
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `Spell Bonanza
                
                Cast a spell that would make other spells stronger, making Beserk Mode and Sword of Midas ${format(data.effect)}× stronger. There is a 60 second cooldown between uses.
                
                Costs ${format(data.costBase)} + ${formatWhole(data.costPercent * 100)}% of your max HP
                (${formatWhole(data.cost)})`
            },
            unlocked() {
                return hasUpgrade("aca", 224) && tmp.aca.effect.maxHealth.gte(1e30)
            },
            effect() {
                let eff = EN(2)
                if (hasUpgrade("aca", 234)) eff = eff.mul(player[this.layer].buyables[this.id].max(0).add(1).log().add(1).pow(2))
                if (hasUpgrade("aca", 242)) eff = eff.mul(upgradeEffect("aca", 242))
                return eff
            },
            costPercent: 0.4,
            costBase() {
                let cost = 1e30
                return logLerp(cost, tmp.aca.effect.maxHealth.mul(1 - this.costPercent), player.aca.spellInvest).max(cost)
            },
            cost() {
                let data = tmp[this.layer].buyables[this.id]
                return tmp.aca.effect.maxHealth.mul(this.costPercent).add(data.costBase)
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.aca.health.gte(data.cost) && player[this.layer].buyables[this.id].lte(-60)
            },
            buy() { 
                let data = tmp[this.layer].buyables[this.id]
                player.aca.health = player.aca.health.sub(data.cost)
                let timeMul = data.costBase.div(1e21).log(10).add(1)
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].max(timeMul.mul(15))
            }
        },
        116: {
            title() {
                let x = player[this.layer].buyables[this.id]
                return x.lte(0) ? "(" + formatTime(EN(90).add(x).max(0)) + ")" : formatTime(x)
            }, 
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `Time Reversal
                
                Reverse the time and therefore your magic consumption, making all spell remaining times increase at ${formatWhole(data.effect)}× the speed instead of decrease, except this spell. There is a 90 second cooldown between uses.
                
                Costs ${formatWhole(data.costPercent * 100)}% of your max HP
                (${formatWhole(data.cost)})`
            },
            unlocked() {
                return hasUpgrade("aca", 224) && tmp.aca.effect.maxHealth.gte(1e60)
            },
            effect() {
                let eff = EN(2)
                if (hasAchievement("aca", 31)) eff = eff.mul(player.aca.questLevel + 1)
                if (hasAchievement("aca", 42)) eff = eff.mul(EN.pow(1.001, player.aca.questLevel))
                return eff
            },
            costPercent: 1,
            costBase() {
                let cost = 0
                return logLerp(cost, tmp.aca.effect.maxHealth.mul(1 - this.costPercent), player.aca.spellInvest).max(cost)
            },
            cost() {
                let data = tmp[this.layer].buyables[this.id]
                return tmp.aca.effect.maxHealth.mul(this.costPercent).add(data.costBase)
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.aca.health.gte(data.cost) && player[this.layer].buyables[this.id].lte(-90)
            },
            buy() { 
                let data = tmp[this.layer].buyables[this.id]
                player.aca.health = player.aca.health.sub(data.cost)
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].max(30)
            }
        },
        200: {
            title() {
                return ""
            }, 
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>The Modding Tree</h3>\n(${data.version})
                    ${data.effect}
                ` + (player.aca.devTarget != this.id ? `
                    ${data.cost.eq(0) ? "" : `Diff: ${format(data.cost)}`}
                ` : `
                    Developing...\n${format(player.aca.devProgress)} / ${format(data.cost)}
                `)
            },
            unlocked() {
                return hasUpgrade("aca", 125)
            },
            version() {
                let x = player[this.layer].buyables[this.id]
                return [
                    "v1.0",
                    "v1.1",
                    "v1.2",
                    "v1.2.3",
                    "v1.3",
                ][x.array[0]]
            },
            effect() {
                let x = player[this.layer].buyables[this.id]
                return [
                    "The next update unlocks a new feature.",
                    "The next update unlocks a new tab.",
                    "The next update unlocks 2 new features and more upgrades.",
                    "The next update unlocks 2 new features and a new tab.",
                    "Max level reached",
                ][x.array[0]]
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN([
                    1000000,
                    1e16,
                    2.5e58,
                    1e100,
                    "0",
                ][x.array[0]])
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return data.cost.gt(0) && ["", this.id].includes(player.aca.devTarget)
            }, 
            buy() { 
                player.aca.devProgress = ExpantaNumZero
                player.aca.devTarget = player.aca.devTarget == this.id ? "" : this.id
            },
            done() {
                console.log("done")
                player.aca.devProgress = ExpantaNumZero
                player.aca.devTarget = ""
            },
            style() { 
                let active = player.aca.devTarget == this.id
                let data = tmp[this.layer].buyables[this.id]
                if (active) {
                    let prog = player.aca.devProgress.div(data.cost)
                    return { ...tmtBuyable, 
                        "background": tmp.jac.color,
                        "box-shadow": `0 0 10px var(--points), inset 0 -${prog.mul(120).toString()}px #ffffff3f`,
                    }
                } else return { ...tmtBuyable,  background: !data.canAfford ? "#3f3f3f" : tmp.jac.color}
            }
        },
        201: {
            title() {
                return ""
            }, 
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>Upgrades</h3>\n(${formatWhole(x)} / ${formatWhole(data.max)})
                    Generates ${format(data.effect)} component points per second.
                ` + (player.aca.devTarget != this.id ? `
                    Diff: ${format(data.cost)}
                ` : `
                    Developing...\n${format(player.aca.devProgress)} / ${format(data.cost)}
                `)
            },
            unlocked() {
                return hasUpgrade("aca", 125)
            },
            effect() {
                let x = player[this.layer].buyables[this.id].mul(buyableEffect("aca", 204))
                let eff = EN.pow(2, x.pow(1.2)).sub(1)
                if (hasUpgrade("aca", 301)) eff = eff.mul(upgradeEffect("aca", 301))
                if (hasUpgrade("aca", 321)) eff = eff.mul(upgradeEffect("aca", 321))
                if (hasUpgrade("aca", 323)) eff = eff.mul(upgradeEffect("aca", 323))
                if (hasUpgrade("aca", 332)) eff = eff.mul(tmp.aca.effect.devSpeed.max(1).pow(3))
                return eff
            },
            max: EN(80),
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(10, x.div(8).add(1).pow(2)).div(buyableEffect("aca", 203))
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.aca.buyables[this.id].lt(data.max) && ["", this.id].includes(player.aca.devTarget)
            }, 
            buy() { 
                player.aca.devProgress = ExpantaNumZero
                player.aca.devTarget = player.aca.devTarget == this.id ? "" : this.id
            },
            style() { 
                let active = player.aca.devTarget == this.id
                let data = tmp[this.layer].buyables[this.id]
                if (active) {
                    let prog = player.aca.devProgress.div(data.cost)
                    return { ...tmtBuyable, 
                        "background": tmp.aca.color,
                        "box-shadow": `0 0 10px var(--points), inset 0 -${prog.mul(120).toString()}px #ffffff3f`,
                    }
                } else return { ...tmtBuyable,  background: !data.canAfford ? "#3f3f3f" : tmp.aca.color}
            }
        },
        202: {
            title() {
                return ""
            }, 
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>Milestones</h3>\n(${formatWhole(x)} / ${formatWhole(data.max)})
                    Makes dev speed ${format(data.effect)}× faster.
                ` + (player.aca.devTarget != this.id ? `
                    Diff: ${format(data.cost)}
                ` : `
                    Developing...\n${format(player.aca.devProgress)} / ${format(data.cost)}
                `)
            },
            unlocked() {
                return hasUpgrade("aca", 125)
            },
            effect() {
                let x = player[this.layer].buyables[this.id].mul(buyableEffect("aca", 204))
                let eff = EN.pow(3, x.pow(0.75))
                if (hasUpgrade("aca", 301)) eff = eff.mul(upgradeEffect("aca", 301))
                if (hasUpgrade("aca", 324)) eff = eff.mul(upgradeEffect("aca", 324))
                return eff
            },
            max: EN(40),
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(100, x.div(8).add(1).pow(2)).div(buyableEffect("aca", 203))
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.aca.buyables[this.id].lt(data.max) && ["", this.id].includes(player.aca.devTarget)
            }, 
            buy() { 
                player.aca.devProgress = ExpantaNumZero
                player.aca.devTarget = player.aca.devTarget == this.id ? "" : this.id
            },
            style() { 
                let active = player.aca.devTarget == this.id
                let data = tmp[this.layer].buyables[this.id]
                if (active) {
                    let prog = player.aca.devProgress.div(data.cost)
                    return { ...tmtBuyable, 
                        "background": tmp.aca.color,
                        "box-shadow": `0 0 10px var(--points), inset 0 -${prog.mul(120).toString()}px #ffffff3f`,
                    }
                } else return { ...tmtBuyable,  background: !data.canAfford ? "#3f3f3f" : tmp.aca.color}
            }
        },
        203: {
            title() {
                return ""
            }, 
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>Challenges</h3>\n(${formatWhole(x)} / ${formatWhole(data.max)})
                    Makes <b>Upgrades</b> and <b>Milestones</b> ${format(data.effect)}× easier.
                ` + (player.aca.devTarget != this.id ? `
                    Diff: ${format(data.cost)}
                ` : `
                    Developing...\n${format(player.aca.devProgress)} / ${format(data.cost)}
                `)
            },
            unlocked() {
                return hasUpgrade("aca", 125)
            },
            effect() {
                let x = player[this.layer].buyables[this.id].mul(buyableEffect("aca", 204))
                let eff = EN.pow(2, x.pow(0.75))
                if (hasUpgrade("aca", 301)) eff = eff.mul(upgradeEffect("aca", 301))
                return eff
            },
            max: EN(25),
            cost() {
                let x = player[this.layer].buyables[this.id]
                let cost = EN.pow(250000, x.div(8).add(1).pow(2))
                if (hasUpgrade("aca", 311)) cost = cost.div(upgradeEffect("aca", 311))
                if (hasUpgrade("aca", 312)) cost = cost.div(upgradeEffect("aca", 312))
                return cost
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.aca.buyables[this.id].lt(data.max) && ["", this.id].includes(player.aca.devTarget)
            }, 
            buy() { 
                player.aca.devProgress = ExpantaNumZero
                player.aca.devTarget = player.aca.devTarget == this.id ? "" : this.id
            },
            style() { 
                let active = player.aca.devTarget == this.id
                let data = tmp[this.layer].buyables[this.id]
                if (active) {
                    let prog = player.aca.devProgress.div(data.cost)
                    return { ...tmtBuyable, 
                        "background": tmp.aca.color,
                        "box-shadow": `0 0 10px var(--points), inset 0 -${prog.mul(120).toString()}px #ffffff3f`,
                    }
                } else return { ...tmtBuyable,  background: !data.canAfford ? "#3f3f3f" : tmp.aca.color}
            }
        },
        204: {
            title() {
                return ""
            }, 
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>Buyables</h3>\n(${formatWhole(x)} / ${formatWhole(data.max)})
                    Multiplies the first three components' amount in their effect by ${format(data.effect)}×.
                ` + (player.aca.devTarget != this.id ? `
                    Diff: ${format(data.cost)}
                ` : `
                    Developing...\n${format(player.aca.devProgress)} / ${format(data.cost)}
                `)
            },
            unlocked() {
                return getBuyableAmount("aca", 200).gte(1)
            },
            effect() {
                let x = player[this.layer].buyables[this.id]
                let eff = EN.pow(1.5, x.pow(0.75))
                if (hasUpgrade("aca", 322)) eff = eff.mul(upgradeEffect("aca", 322))
                return eff
            },
            max: EN(15),
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(500000, x.div(8).add(1).pow(EN.pow(2.1, x.mul(.05).add(.95))))
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.aca.buyables[this.id].lt(data.max) && ["", this.id].includes(player.aca.devTarget)
            }, 
            buy() { 
                player.aca.devProgress = ExpantaNumZero
                player.aca.devTarget = player.aca.devTarget == this.id ? "" : this.id
            },
            style() { 
                let active = player.aca.devTarget == this.id
                let data = tmp[this.layer].buyables[this.id]
                if (active) {
                    let prog = player.aca.devProgress.div(data.cost)
                    return { ...tmtBuyable, 
                        "background": tmp.aca.color,
                        "box-shadow": `0 0 10px var(--points), inset 0 -${prog.mul(120).toString()}px #ffffff3f`,
                    }
                } else return { ...tmtBuyable,  background: !data.canAfford ? "#3f3f3f" : tmp.aca.color}
            }
        },
        205: {
            title() {
                return ""
            }, 
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>Rows</h3>\n(${formatWhole(x)} / ${formatWhole(data.max)})
                    Increases comp. points to dev speed efficiency by +${format(data.effect)}.
                ` + (player.aca.devTarget != this.id ? `
                    Diff: ${format(data.cost)}
                ` : `
                    Developing...\n${format(player.aca.devProgress)} / ${format(data.cost)}
                `)
            },
            unlocked() {
                return getBuyableAmount("aca", 200).gte(3)
            },
            effect() {
                let x = player[this.layer].buyables[this.id]
                let eff = x.mul(buyableEffect("aca", 206))
                return eff
            },
            max: EN(45),
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow("e59", x.div(12).add(1).pow(EN.pow(2, x.mul(.05).add(.75).max(1))))
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.aca.buyables[this.id].lt(data.max) && ["", this.id].includes(player.aca.devTarget)
            }, 
            buy() { 
                player.aca.devProgress = ExpantaNumZero
                player.aca.devTarget = player.aca.devTarget == this.id ? "" : this.id
            },
            style() { 
                let active = player.aca.devTarget == this.id
                let data = tmp[this.layer].buyables[this.id]
                if (active) {
                    let prog = player.aca.devProgress.div(data.cost)
                    return { ...tmtBuyable, 
                        "background": tmp.aca.color,
                        "box-shadow": `0 0 10px var(--points), inset 0 -${prog.mul(120).toString()}px #ffffff3f`,
                    }
                } else return { ...tmtBuyable,  background: !data.canAfford ? "#3f3f3f" : tmp.aca.color}
            }
        },
        206: {
            title() {
                return ""
            }, 
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>Columns</h3>\n(${formatWhole(x)} / ${formatWhole(data.max)})
                    Increases <b>Rows</b>' effect by ${format(data.effect)}×.
                ` + (player.aca.devTarget != this.id ? `
                    Diff: ${format(data.cost)}
                ` : `
                    Developing...\n${format(player.aca.devProgress)} / ${format(data.cost)}
                `)
            },
            unlocked() {
                return getBuyableAmount("aca", 200).gte(3)
            },
            effect() {
                let x = player[this.layer].buyables[this.id]
                let eff = x.mul(.25).add(1)
                return eff
            },
            max: EN(45),
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow("e75", x.div(12).add(1).pow(EN.pow(2, x.mul(.05).add(.75).max(1))))
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.aca.buyables[this.id].lt(data.max) && ["", this.id].includes(player.aca.devTarget)
            }, 
            buy() { 
                player.aca.devProgress = ExpantaNumZero
                player.aca.devTarget = player.aca.devTarget == this.id ? "" : this.id
            },
            style() { 
                let active = player.aca.devTarget == this.id
                let data = tmp[this.layer].buyables[this.id]
                if (active) {
                    let prog = player.aca.devProgress.div(data.cost)
                    return { ...tmtBuyable, 
                        "background": tmp.aca.color,
                        "box-shadow": `0 0 10px var(--points), inset 0 -${prog.mul(120).toString()}px #ffffff3f`,
                    }
                } else return { ...tmtBuyable,  background: !data.canAfford ? "#3f3f3f" : tmp.aca.color}
            }
        },
        207: {
            title() {
                return ""
            }, 
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>Subtabs</h3>\n(${formatWhole(x)} / ${formatWhole(data.max)})
                    Multiplies dev speed by ${format(data.effect)}×, based on component points.
                ` + (player.aca.devTarget != this.id ? `
                    Diff: ${format(data.cost)}
                ` : `
                    Developing...\n${format(player.aca.devProgress)} / ${format(data.cost)}
                `)
            },
            unlocked() {
                return getBuyableAmount("aca", 200).gte(4)
            },
            effect() {
                let x = player[this.layer].buyables[this.id].mul(buyableEffect("aca", 208))
                let eff = EN.pow(2, player.aca.compPoints.add(1).log10().pow(0.3)).pow(x.pow(0.3))
                return eff
            },
            max: EN(35),
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow("e100", x.div(10).add(1).pow(EN.pow(2, x.mul(.05).add(.75).max(1))))
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.aca.buyables[this.id].lt(data.max) && ["", this.id].includes(player.aca.devTarget)
            }, 
            buy() { 
                player.aca.devProgress = ExpantaNumZero
                player.aca.devTarget = player.aca.devTarget == this.id ? "" : this.id
            },
            style() { 
                let active = player.aca.devTarget == this.id
                let data = tmp[this.layer].buyables[this.id]
                if (active) {
                    let prog = player.aca.devProgress.div(data.cost)
                    return { ...tmtBuyable, 
                        "background": tmp.aca.color,
                        "box-shadow": `0 0 10px var(--points), inset 0 -${prog.mul(120).toString()}px #ffffff3f`,
                    }
                } else return { ...tmtBuyable,  background: !data.canAfford ? "#3f3f3f" : tmp.aca.color}
            }
        },
        208: {
            title() {
                return ""
            }, 
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `<h3>Microtabs</h3>\n(${formatWhole(x)} / ${formatWhole(data.max)})
                    Multiplies <b>Subtabs</b>' amount in their effect by ${format(data.effect)}×.
                ` + (player.aca.devTarget != this.id ? `
                    Diff: ${format(data.cost)}
                ` : `
                    Developing...\n${format(player.aca.devProgress)} / ${format(data.cost)}
                `)
            },
            unlocked() {
                return getBuyableAmount("aca", 200).gte(4)
            },
            effect() {
                let x = player[this.layer].buyables[this.id]
                let eff = x.mul(0.1).add(1)
                return eff
            },
            max: EN(35),
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow("e175", x.div(5).add(1).pow(EN.pow(2, x.mul(.05).add(.75).max(1))))
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.aca.buyables[this.id].lt(data.max) && ["", this.id].includes(player.aca.devTarget)
            }, 
            buy() { 
                player.aca.devProgress = ExpantaNumZero
                player.aca.devTarget = player.aca.devTarget == this.id ? "" : this.id
            },
            style() { 
                let active = player.aca.devTarget == this.id
                let data = tmp[this.layer].buyables[this.id]
                if (active) {
                    let prog = player.aca.devProgress.div(data.cost)
                    return { ...tmtBuyable, 
                        "background": tmp.aca.color,
                        "box-shadow": `0 0 10px var(--points), inset 0 -${prog.mul(120).toString()}px #ffffff3f`,
                    }
                } else return { ...tmtBuyable,  background: !data.canAfford ? "#3f3f3f" : tmp.aca.color}
            }
        },
    },

    clickables: {
        101: {
            display() {
                return "Eat all the candies!"
            },
            unlocked() {
                return player.aca.candiesTotal.gte(1)
            },
            canClick() {
                return true
            },
            onClick() {
                player.aca.candiesEaten = player.aca.candiesEaten.add(player.aca.candies)
                player.aca.candies = ExpantaNumZero
            },
            onHold() {
            },
            style: { ...smallClickable }
        },
        102: {
            display() {
                return "Throw 10 candies on the ground"
            },
            unlocked() {
                return player.aca.candiesTotal.gte(10)
            },
            canClick() {
                return player.aca.candies.gte(10) && !player[this.layer].clickables[this.id]
            },
            onClick() {
                player[this.layer].clickables[this.id] = "no"
            },
            onHold() {
            },
            style: { ...smallClickable }
        },
        103: {
            display() {
                return `Trade all your candies for ${formatWhole(this.prestigeGain())} lollipops`
            },
            unlocked() {
                return hasUpgrade("aca", 202)
            },
            canClick() {
                return player.aca.candies.gte(10)
            },
            prestigeGain() {
                let mul = EN(1)
                if (hasUpgrade("aca", 205)) mul = mul.mul(upgradeEffect("aca", 205))
                if (hasUpgrade("aca", 211)) mul = mul.mul(upgradeEffect("aca", 211))
                if (hasUpgrade("aca", 235)) mul = mul.mul(upgradeEffect("aca", 235))
                if (hasUpgrade("aca", 241)) mul = mul.mul(upgradeEffect("aca", 241))
                if (hasAchievement("aca", 11)) mul = mul.mul(player.aca.dropCandies.add(1))
                mul = mul.mul(buyableEffect("aca", 104))
                return player.aca.candies.div(10).sqrt().mul(mul).floor()
            },
            onClick() {
                player.aca.lollipops = player.aca.lollipops.add(this.prestigeGain())
                player.aca.candies = ExpantaNumZero
            },
            onHold() {
            },
            style: { ...smallClickable }
        },
        110: {
            display() {
                return player.aca.inQuest ? "Currently on a quest..." : "Embark on an epic quest!"
            },
            unlocked() {
                return true
            },
            canClick() {
                return !player.aca.inQuest
            },
            onClick() {
                startQuest()
            },
            style: { ...smallClickable }
        },
        120: {
            display() {
                let cost = this.cost()
                return `Enhance weapon (+${formatWhole(player.aca.wpnLevel)}/50)<br/>${formatWhole(cost.llp)} lollipops + ${formatWhole(cost.dcd)} drop candies`
            },
            unlocked() {
                return true
            },
            canClick() {
                let cost = this.cost()
                return player.aca.lollipops.gte(cost.llp) && player.aca.dropCandies.gte(cost.dcd) && player.aca.wpnLevel.lt(50)
            },
            cost() {
                return {
                    llp: EN.pow(1.2, player.aca.wpnLevel.add(player.aca.wpnTier.mul(55)).sub(1).pow(1.1)).mul(100),
                    dcd: EN.pow(1.1, player.aca.wpnLevel.add(player.aca.wpnTier.mul(55)).sub(1).pow(1.05)).mul(20),
                }
            },
            onClick() {
                let cost = this.cost()
                player.aca.lollipops = player.aca.lollipops.sub(cost.llp) 
                player.aca.dropCandies = player.aca.dropCandies.sub(cost.dcd)
                player.aca.wpnLevel = player.aca.wpnLevel.add(1)
            },
            onHold() {
                this.onClick()
            },
            style: { ...smallClickable }
        },
        121: {
            display() {
                let cost = this.cost()
                return `Trade your weapon for a better one (+${formatWhole(player.aca.wpnTier)}/32)<br/>Requires maxing the current one`
            },
            unlocked() {
                return player.aca.wpnLevel.gte(50) || player.aca.wpnTier.gte(1)
            },
            canClick() {
                return player.aca.wpnLevel.gte(50) && player.aca.wpnTier.lt(32)
            },
            cost() {
                return EN(50)
            },
            onClick() {
                player.aca.wpnLevel = EN(1)
                player.aca.wpnTier = player.aca.wpnTier.add(1)
            },
            style: { ...smallClickable }
        },
        130: {
            display() {
                return player[this.layer].clickables[this.id] === "drank" ? "You drank the Candy Tab" : "Drink the Candy Tab"
            },
            unlocked() {
                return hasUpgrade("aca", 255)
            },
            canClick() {
                return hasUpgrade("aca", 255) && player[this.layer].clickables[this.id] !== "drank"
            },
            onClick() {
                function choose(p) {
                    switch (p) {
                        default: return "1"
                        case "1": return "2"
                        case "2": return "3"
                        case "3": return "4"
                        case "4": return "drank"
                    }
                }
                player[this.layer].clickables[this.id] = choose(player[this.layer].clickables[this.id])
            },
            onHold() {
            },
            style: { ...smallClickable }
        },
        201: {
            display() {
                return "Respec upgrades, but reset your component points"
            },
            unlocked() {
                return getBuyableAmount("aca", 200).gte(2)
            },
            canClick() {
                return hasUpgrade("aca", 301)
            },
            onClick() {
                player.aca.compPoints = ExpantaNumZero
                for(let i = 0; i < player.aca.upgrades.length; i++) { 
                    if (+player.aca.upgrades[i] > 300) { 
                        player.aca.upgrades.splice(i, 1); 
                        i--; 
                    }
                }
            },
            onHold() {
            },
            style: { ...smallClickable }
        },
        202: {
            display() {
                return player.aca.modActive ? 
                    "<h3>Complete this Section</h3><br/>Requires " + this.endReqs[player.aca.modLevel][1] : 
                    "<h3>Unlock a Modder!</h3><br/>Requires " + format(this.startReqs[player.aca.modLevel]) + " Acamaeda points"
            },
            unlocked() {
                return getBuyableAmount("aca", 200).gte(4)
            },
            startReqs: [
                [1000000, 5, 35],
                [1, 1, 1, 1, 1],
            ],
            endReqs: [
                [() => player.tfu.points.gte("ee1250"), "ee1,250 thefinaluptake points"],
                [() => false, ""],
            ],
            layers: ["tfu"],
            canClick() {
                return player.aca.modActive ? this.endReqs[player.aca.modLevel][0]() : player.aca.points.gte(this.startReqs[player.aca.modLevel])
            },
            onClick() {
                if (player.aca.modActive) {
                    let layer = this.layers[player.aca.modLevel]
                    layerDataReset(layer)
                    player.aca.modTimes.push(EN(0))
                    player.aca.modLevel += 1
                }
                player.aca.modActive = !player.aca.modActive;
            },
            style: { 
                width: "400px",
                "min-height": "80px",
                "font-size": "14px",
            }
        },
    },

    update(delta) {
        if (player.aca.best.gte(1) && !player.aar.upgrades.length) {
            player.aar.upgrades = [101, 201]
            player.aar.best = EN(1)
            if (hasMilestone("aca", 1)) addPoints("jac", player.aca.points)
        }

        if (hasUpgrade("aca", 122)) {
            if (tmp.aca.effect.genMult.gte("ee8"))
                player.aca.points = player.aca.points.max(EN.pow(10, tmp.aca.effect.genMult.mul(tmp.aca.effect.pointMult)))
            else {
                let end = tmp.aca.resetGain
                let nEnd = end.log(10)
                let start = player.aca.points
                let nStart = start.log(10)
                if (start.lt(end) && nStart.isFinite() && nEnd.isFinite()) {
                    let nDelta = nEnd.sub(nStart)
                    player.aca.points = EN.pow(10, nStart.add(nDelta.mul(tmp.aca.effect.genMult).mul(delta)))
                }
            }
        }

        if (hasUpgrade("aca", 212) && !hasUpgrade("aca", 125)) {
            if (!player.aca.inQuest || hasUpgrade("aca", 225)) {
                let maxhp = tmp.aca.effect.maxHealth
                player.aca.health = player.aca.health.add(maxhp.div(getBuyableAmount("aca", 114).gt(0) ? 20 : maxhp.add(100).log10().mul(10).min(100)).mul(delta)).min(maxhp)
            }
            if (player.aca.inQuest) {
                player.aca.actionTime += +delta * 4 * (getBuyableAmount("aca", 113).gt(0) ? buyableEffect("aca", 113) : 1)
                if (player.aca.actionTime >= 1) {
                    let pos = player.aca.playerPos
                    if (player.aca.enemies[pos + 1]) {
                        player.aca.health = player.aca.health.sub(player.aca.enemies[pos + 1].attack)
                        if (player.aca.clickables[130] === "drank") player.aca.enemies[pos + 1].health = EN(player.aca.enemies[pos + 1].health).div(player.aca.questLevel + 1)
                        if (hasAchievement("aca", 32)) player.aca.enemies[pos + 1].health = EN(player.aca.enemies[pos + 1].health).div(tmp.aca.effect.atkPow)
                        player.aca.enemies[pos + 1].health = EN(player.aca.enemies[pos + 1].health).sub(tmp.aca.effect.atkPow)
                        if (player.aca.health.lte(0)) {
                            player.aca.health = EN(0)
                            endQuest()
                        } else if (player.aca.enemies[pos + 1].health.lte(0)) {
                            let drop = EN(player.aca.enemies[pos + 1].drop)
                            if (getBuyableAmount("aca", 112).gt(0)) drop = drop.mul(buyableEffect("aca", 112))
                            if (hasUpgrade("aca", 231) && getBuyableAmount("aca", 113).gt(0)) drop = drop.mul(10)
                            if (hasAchievement("aca", 21)) drop = drop.mul(player.aca.farmCandies.add(1))
                            if (hasAchievement("aca", 43)) drop = drop.pow(achievementEffect("aca", 43))
                            player.aca.dropCandies = player.aca.dropCandies.add(drop)
                            delete player.aca.enemies[pos + 1]
                            if (hasUpgrade("aca", 206)) player.aca.ach43Time += 3
                        }
                    } else {
                        player.aca.playerPos += 1

                        if (hasUpgrade("aca", 253)) 
                            while (!player.aca.enemies[player.aca.playerPos + 1] && player.aca.playerPos < 25)
                                player.aca.playerPos += 1

                        if (player.aca.playerPos >= 25) {
                            endQuest()
                            player.aca.questLevel += player.aca.clickables[130] === "drank" ? 10 + Math.floor(player.aca.questLevel / 25) : 1
                            if (hasAchievement("aca", 41)) player.aca.questLevel = Math.floor(player.aca.questLevel * 1.25)
                            player.aca.questLevel = Math.min(player.aca.questLevel, 999999999999)
                            if (hasUpgrade("aca", 251)) startQuest()
                            if (hasUpgrade("aca", 216)) player.aca.ach43Time += 30
                        }
                    }
                    player.aca.actionTime -= 1
                }
            }
            player.aca.best = player.aca.best.max(player.aca.points)
        }

        if (hasUpgrade("aca", 200) && !hasUpgrade("aca", 125)) {
            player.aca.candies = player.aca.candies.add(tmp.aca.effect.candyGain.mul(delta))
            player.aca.candiesTotal = player.aca.candiesTotal.add(tmp.aca.effect.candyGain.mul(delta))
        }

        if (hasUpgrade("aca", 215) && !hasUpgrade("aca", 125)) {
            let fcph = player.aca.buyables[101].mul(10).add(player.aca.buyables[102].mul(35))
            if (hasUpgrade("aca", 231) && getBuyableAmount("aca", 113).gt(0)) fcph = fcph.mul(10)
            if (hasUpgrade("aca", 243)) fcph = fcph.mul(upgradeEffect("aca", 243))
            if (hasUpgrade("aca", 244)) fcph = fcph.mul(upgradeEffect("aca", 244))
            if (hasUpgrade("aca", 252)) fcph = fcph.mul(upgradeEffect("aca", 252))
            if (hasAchievement("aca", 13)) fcph = fcph.mul(player.aca.farmCandies.add(1).pow(.1))
            if (hasAchievement("aca", 23)) fcph = fcph.mul(player.aca.dropCandies.add(1).pow(.0025))
            player.aca.farmCandies = player.aca.farmCandies.add(fcph.div(3600).mul(delta))
            player.aca.lollipops = player.aca.lollipops.add(tmp.aca.clickables[103].prestigeGain.mul(player.aca.buyables[101]).div(100).mul(delta))
        }

        if (hasUpgrade("aca", 224) && !hasUpgrade("aca", 125)) {
            for (let a = 111; a <= 115; a++) {
                if (player.aca.buyables[116].gt(0) && player.aca.clickables[130] === "drank" && player.aca.buyables[a].gt(0))
                    player.aca.buyables[a] = player.aca.buyables[a].mul(EN.pow(buyableEffect("aca", 116), delta * 0.26303))
                else if ((player.aca.buyables[116].gt(0) || player.aca.clickables[130] === "drank") && player.aca.buyables[a].gt(0))
                    player.aca.buyables[a] = player.aca.buyables[a].add(buyableEffect("aca", 116).mul(delta))
                else player.aca.buyables[a] = player.aca.buyables[a].sub(delta)
            }
            player.aca.buyables[116] = hasAchievement("aca", 22) ? EN(30) : player.aca.buyables[116].sub(delta)
        }

        if (hasMilestone("aca", 0)) player.jac.buyables[143] = player.jac.buyables[143].max(tmp.jac.buyables[143].prestigeGain)
        if (hasMilestone("aca", 2)) player.aar.points = player.aar.points.max(tmp.aar.resetGain)

        if (hasAchievement("aca", 43)) player.aca.ach43Time += delta
        if (hasUpgrade("aca", 256)) player.aca.upg256Time += delta
        
        if (hasUpgrade("aca", 125)) player.aca.compPoints = player.aca.compPoints.add(buyableEffect("aca", 201).mul(delta))

        if (player.aca.devTarget) {
            let target = player.aca.devTarget
            player.aca.devProgress = player.aca.devProgress.add(tmp.aca.effect.devSpeed.mul(delta))
            if (player.aca.devProgress.gte(tmp.aca.buyables[target].cost)) {
                player.aca.devProgress = player.aca.devProgress.sub(tmp.aca.buyables[target].cost)
                player.aca.buyables[target] = player.aca.buyables[target].add(1)
                if (layers.aca.buyables[target].done) layers.aca.buyables[target].done()
                if (player.aca.buyables[target].gte(tmp.aca.buyables[target].max)) 
                    player.aca.devTarget = ""
            }
        }
        if (player.aca.modTimes.length) {
            for (let i = player.aca.modTimes.length - 1; i >= 0; i--) {
                player.aca.modTimes[i] = player.aca.modTimes[i].add(EN.add(player.aca.modTimes[i+1] || 0, 1).mul(delta))
            }
        }
    },

    achievements: {
        11: {
            name: "Quest Rune",
            unlocked: () => player.aca.clickables[130] == "drank",
            done() {
                return player.aca.questLevel >= 2000
            },
            tooltip() {
                return `
                    GOAL: <span>Reach Quest Difficulty 2,000.</span><br/>
                    EFFECT: <span>Drop Candies multiplies you candy and lollipop production.</span>
                `
            }
        },
        12: {
            name: "Spell Rune",
            unlocked: () => player.aca.clickables[130] == "drank",
            done() {
                return player.aca.buyables[111].gte(31536000000)
            },
            tooltip() {
                return `
                    GOAL: <span>Make Berserk Mode lasts at least a millennium.</span><br/>
                    EFFECT: <span>Berserk Mode's duration multiplies <b>Magic Candies, for real</b>'s effect.</span>
                `
            }
        },
        13: {
            name: "Farm Rune",
            unlocked: () => player.aca.clickables[130] == "drank",
            done() {
                return player.aca.buyables[104].gte(100)
            },
            tooltip() {
                return `
                    GOAL: <span>Max out lolligators.</span><br/>
                    EFFECT: <span>Farm candies are boosted by itself.</span>
                `
            }
        },
        21: {
            name: "Quest Rune II",
            unlocked: () => player.aca.clickables[130] == "drank",
            done() {
                return player.aca.questLevel >= 5000
            },
            tooltip() {
                return `
                    GOAL: <span>Reach Quest Difficulty 5,000.</span><br/>
                    EFFECT: <span>Farm candies multiplies drop candies.</span>
                `
            }
        },
        22: {
            name: "Spell Rune II",
            unlocked: () => player.aca.clickables[130] == "drank",
            done() {
                return player.aca.buyables[115].gte(31536000000)
            },
            tooltip() {
                return `
                    GOAL: <span>Make Spell Bonanza lasts at least a millennium.</span><br/>
                    EFFECT: <span>Time Reversal is always active.</span>
                `
            }
        },
        23: {
            name: "Farm Rune II",
            unlocked: () => player.aca.clickables[130] == "drank",
            done() {
                return player.aca.farmCandies.gte(2.3e23)
            },
            tooltip() {
                return `
                    GOAL: <span>Reach ${format(2.3e23)} farm candies.</span><br/>
                    EFFECT: <span>Drop candies boosts farm candies.</span>
                `
            }
        },
        31: {
            name: "Quest Rune III",
            unlocked: () => player.aca.clickables[130] == "drank",
            done() {
                return player.aca.questLevel >= 25000
            },
            tooltip() {
                return `
                    GOAL: <span>Reach Quest Difficulty 25,000.</span><br/>
                    EFFECT: <span>Quest Difficulty multiplies Time Reversal's effect.</span>
                `
            }
        },
        32: {
            name: "Spell Rune III",
            unlocked: () => player.aca.clickables[130] == "drank",
            done() {
                return player.aca.buyables[111].gte(31536000e25)
            },
            tooltip() {
                return `
                    GOAL: <span>Make Berserk Mode lasts ${format(1e25)} years.</span><br/>
                    EFFECT: <span>Divides enemies' health by your POW per quest tick.</span>
                `
            }
        },
        33: {
            name: "Farm Rune III",
            unlocked: () => player.aca.clickables[130] == "drank",
            done() {
                return player.aca.farmCandies.gte(1e32)
            },
            tooltip() {
                return `
                    GOAL: <span>Reach ${format(1e32)} farm candies.</span><br/>
                    EFFECT: <span>Squares Windmills and Lolligator's effect and multiplies them by farm candies.</span>
                `
            }
        },
        41: {
            name: "Quest Rune IV",
            unlocked: () => player.aca.clickables[130] == "drank",
            done() {
                return player.aca.questLevel >= 1e6
            },
            tooltip() {
                return `
                    GOAL: <span>Reach Quest Difficulty 1,000,000.</span><br/>
                    EFFECT: <span>Quest Difficulty scales faster.</span>
                `
            }
        },
        42: {
            name: "Quest Rune V",
            unlocked: () => player.aca.clickables[130] == "drank",
            done() {
                return player.aca.questLevel >= 1e9
            },
            tooltip() {
                return `
                    GOAL: <span>Reach Quest Difficulty 1,000,000,000.</span><br/>
                    EFFECT: <span>Time Reversal scales better.</span>
                `
            }
        },
        43: {
            name: "Quest Rune VI",
            unlocked: () => player.aca.clickables[130] == "drank",
            done() {
                return player.aca.questLevel >= 999999999999
            },
            effect() {
                let eff = EN.pow(player.aca.ach43Time / 100 + 1, 2)
                if (hasUpgrade("aca", 246)) eff = eff.pow(10)
                if (hasUpgrade("aca", 226)) eff = eff.mul(upgradeEffect("aca", 226))
                if (hasUpgrade("aca", 236)) eff = eff.mul(upgradeEffect("aca", 236))
                if (hasUpgrade("aca", 256)) eff = eff.pow(upgradeEffect("aca", 256))
                return eff
            },
            tooltip() {
                return `
                    GOAL: <span>Reach Quest Difficulty 999,999,999,999 (you can't reach any higher than this).</span><br/>
                    EFFECT: <span>Boost to drop candy gain, based on time since you have this achievement.</span>
                    CURRENTLY: <span>^${format(this.effect())}</span>
                `
            }
        },
    },

    microtabs: {
        main: {
            "main": {
                title: "Main",
                content: [
                    ["blank", "10px"],
                    "milestones",
                    ["blank", "10px"],
                    ["column", createUpgradeTable(1, 3, 5)],
                    ["blank", "10px"],
                    ["upgrade", 200], 
                ],
            },
            "candy": {
                title: "The Candy Tab",
                unlocked: () => hasUpgrade("aca", 200) && !hasUpgrade("aca", 125),
                content: [
                    ["blank", "10px"],
                    ["microtabs", "candy"],
                ],
            },
            "tmt": {
                title: "The Modding Tree",
                unlocked: () => hasUpgrade("aca", 125),
                content: [
                    ["blank", "10px"],
                    ["raw-html", () => `You have <h2 style"color:8fa140">${formatWhole(player.aca.compPoints)}</h2> component points, which are multipling point gain by ${formatWhole(tmp.aca.effect.pointMult)}`],
                    ["raw-html", () => `(Your development speed is <h3>${format(tmp.aca.effect.devSpeed)}</h3>/s)`],
                    ["blank", "10px"],
                    ["microtabs", "tmt"],
                ],
            },
        },
        candy: {
            "box": {
                title: "Candy Tab",
                content: [
                    ["blank", "10px"],
                    ["raw-html", () => `You have ${formatWhole(player.aca.candies)} candies${player.aca.candies.round().eq(42) ? " \\o/" : ""}`],
                    ["raw-html", () => hasUpgrade("aca", 202) ? `You have ${formatWhole(player.aca.lollipops)} lollipops` : ""],
                    ["blank", "20px"],
                    ["clickable", 101],
                    ["raw-html", () => player.aca.candiesEaten.gte(1) ? `You have eaten ${formatWhole(player.aca.candiesEaten)} candies` : ""],
                    ["blank", "10px"],
                    ["clickable", 102],
                    ["raw-html", () => player.aca.clickables[102] == "no" ? `No. \\O_O/` : ``],
                    ["blank", "10px"],
                    ["clickable", 103],
                    ["blank", "20px"],
                    ["column", createUpgradeTable(2, 6, 6)],
                    ["blank", "20px"],
                    ["raw-html", () => hasUpgrade("aca", 255) && player.aca.clickables[130] !== "drank" ? candyTab : ``],
                    ["raw-html", () => hasUpgrade("aca", 255) ? {
                        "": "You unlocked THE CANDY TAB!<br/><br/>...To be honest, you're expecting someting different.",
                        "1": "You honestly don't really want to drink it.<br/><br/>You have a feeling that drinking it is not a good idea.",
                        "2": "Like, no seriously, you don't want to drink it.<br/><br/>This thing feels dangerous! It just came out from nowhere!",
                        "3": "But the can... It's aura...<br/><br/>It feels like the can wants you to drink it...",
                        "4": "You suddenly have the urge to drink it...<br/><br/>but at the same time, you have a bad feeling about this...",
                        "drank": "You decided to drink it.<br/><br/>You're feeling a lot stronger now, but you have a strange feeling that something else has happened.",
                    }[player.aca.clickables[130]] + "<br/><br/>" : ``],
                    ["clickable", 130],
                ],
            },
            "enc": {
                title: "Enhance",
                unlocked: () => hasUpgrade("aca", 213),
                content: [
                    ["blank", "10px"],
                    ["raw-html", () => hasUpgrade("aca", 202) ? `You have ${formatWhole(player.aca.lollipops)} lollipops` : ""],
                    ["raw-html", () => `You have ${formatWhole(player.aca.dropCandies)} drop candies`],
                    ["blank", "10px"],
                    ["clickable", 120],
                    ["blank", "10px"],
                    ["clickable", 121],
                    ["blank", "10px"],
                    "achievements",
                ],
            },
            "quest": {
                title: "Questing",
                unlocked: () => hasUpgrade("aca", 212),
                content: [
                    ["blank", "10px"],
                    ["raw-html", () => `You have ${formatWhole(player.aca.dropCandies)} drop candies`],
                    ["blank", "10px"],
                    ["clickable", 110],
                    ["blank", "20px"],
                    ["raw-html", () => {
                        let str = `<b style='font-size: 12px'>Difficulty ${player.aca.questLevel.toLocaleString("en-US")}<br/>`
                        if (!player.aca.inQuest) return str + "…__\\o/__…"
                        for (let a = 0; a < 25; a++) {
                            if (player.aca.playerPos == a) str += "\\o/"
                            else if (player.aca.enemies[a]) str += player.aca.enemies[a].name
                            else str += "___"
                        }
                        return str
                    }],
                    ["blank", "20px"],
                    ["row", [
                        ["raw-html", () => `<div style="width:240px">
                            [\\o/ <-- You]<br/>
                            HP ${formatWhole(player.aca.health)} / ${formatWhole(tmp.aca.effect.maxHealth)}<br/>
                            POW ${formatWhole(tmp.aca.effect.atkPow)}
                        </div>`],
                        ["raw-html", () => player.aca.enemies[player.aca.playerPos + 1] ? `<div style="width:240px">
                            [ > ENEMY < ]<br/>
                            HP ${formatWhole(player.aca.enemies[player.aca.playerPos + 1].health)}<br/>
                            POW ${formatWhole(player.aca.enemies[player.aca.playerPos + 1].attack)}
                        </div>` : `<div style="width:240px">NO ENEMY`],
                    ]],
                    ["blank", "10px"],
                    ["row", [["buyable", 111], ["buyable", 112], ["buyable", 113]]],
                    ["row", [["buyable", 114], ["buyable", 115], ["buyable", 116]]],
                    ["blank", "10px"],
                    ["raw-html", () => hasUpgrade("aca", 232) ? `Spell Allocation:<h5 style="font-size:5px"><br/>` : ""],
                    ["row", [
                        ["raw-html", () => hasUpgrade("aca", 232) ? `<h5>Base HP&nbsp;` : ""],
                        ["slider", ["spellInvest", 0, 1, 0.01, (() => hasUpgrade("aca", 232)), (() => `Base + ${formatWhole(player.aca.spellInvest * 100)}% of Max`)]],
                        ["raw-html", () => hasUpgrade("aca", 232) ? `<h5>&nbsp;Max HP` : ""],
                    ]],
                ],
            },
            "farm": {
                title: "Farming",
                unlocked: () => hasUpgrade("aca", 215),
                content: [
                    ["blank", "10px"],
                    ["raw-html", () => `You have ${format(player.aca.farmCandies)} farm candies`],
                    ["blank", "10px"],
                    ["row", [["buyable", 101], ["buyable", 102]]],
                    ["row", [["buyable", 103], ["buyable", 104]]],
                ],
            },
        },
        tmt: {
            "comp": {
                title: "Components",
                unlocked: () => hasUpgrade("aca", 125),
                content: [
                    ["blank", "10px"],
                    ["row", [["buyable", 200]]],
                    ["blank", "10px"],
                    ["row", [["buyable", 201], ["buyable", 202], ["buyable", 203], ["buyable", 204]]],
                    ["row", [["buyable", 205], ["buyable", 206], ["buyable", 207], ["buyable", 208]]],
                ],
            },
            "upgTree": {
                title: "Upgrade Tree",
                unlocked: () => getBuyableAmount("aca", 200).gte(2),
                content: [
                    ["blank", "10px"],
                    ["raw-html", () => `<h5 style="opacity:.5">Note: Buying an upgrade increases the cost of all upgrades in the same row!</h5>`],
                    ["blank", "10px"],
                    ["clickable", 201],
                    ["blank", "10px"],
                    ["row", [["upgrade", 301]]],
                    ["row", [["upgrade", 311], ["upgrade", 312]]],
                    ["row", [["upgrade", 321], ["upgrade", 322], ["upgrade", 323], ["upgrade", 324]]],
                    ["row", [["upgrade", 331], ["upgrade", 332], ["upgrade", 333]]],
                ],
            },
            "modders": {
                title: "Modders",
                unlocked: () => getBuyableAmount("aca", 200).gte(4),
                content: [
                    ["blank", "10px"],
                    ["clickable", 202],
                    ["blank", "10px"],
                    ["raw-html", () => player.aca.modTimes[0] ? modderDisp("thefinaluptake", 0) : ""],
                ],
            },
        }
    },
    tabFormat: [
        "main-display",
        "prestige-button",
        ["blank", "10px"],
        ["microtabs", "main"],
        ["blank", "20px"],
    ],
})

function startQuest() {
    player.aca.inQuest = true
    player.aca.enemies = {}
    player.aca.playerPos = 0
    for (let a = 5; a < 25; a++) if (Math.random() < .4) {
        let enm = {}
        enm.health = EN.pow(1.2, EN.pow(player.aca.questLevel, 1.2)).mul(5).mul(Math.random() + .5).floor()
        enm.attack = EN.pow(1.1, EN.pow(player.aca.questLevel, 1.1)).mul(Math.random() + .5).floor()
        enm.drop = EN.pow(1.2, EN.pow(player.aca.questLevel, 1.1)).mul(Math.random() + .5).floor()
        enm.name = "ENM"

        player.aca.enemies[a] = enm
    }
    player.aca.actionTime = false
}

function endQuest() {
    player.aca.inQuest = false
    player.aca.enemies = {}
}

function modderDisp(name, id) {
    return `<div style="display:inline-block;width:120px;font-size:12px;text-align:left">Modder #${id+1}<br>${name}</div>` + 
    `<div style="display:inline-block;width:200px;text-align:right"><b>${formatTime(player.aca.modTimes[id])}</div> → ` + 
    `<div style="display:inline-block;width:200px;text-align:left"><b>×${format(tmp.aca.effect.modMultis[id])}</div>` 
}

let candyTab = `<b style="font-size:12px">
    ______________________
   (,____________________,)
   |......................|
   |......................|
   |......................|
   |..CANDY_____..____....|
   |.|_. .______|| ._ \\...|
   |...| |.|___ \\| |/ /...|
   |...| |/ ._| || |_. \\..|
   |...| || |_| || |_| |..|
   |...|_|\\_____||_____/..|
   |......................|
   |...CANDY.DIET.SODA....|
   |.(WITH REAL CANDIES!).|
   |......................|
   |......................|
   \`,___________________,'

`.replaceAll("\n", "<br/>")