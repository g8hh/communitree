'use strict';

addLayer("jac", {
    name: "Jacorb",
    symbol: "J",

    row: 0,
    position: 0,

    startData() { return {
        unlocked: true,
		points: EN(0),
    }},
    color: "#8a32da",
    requires: EN(10),
    resource: "Jacorb points",
    baseResource: "points",
    baseAmount() {return player.points},
    type: "normal",
    exponent: 0.5,
    canBuyMax: () => true,
    gainMult() {
        let mult = EN(1)
        if (hasUpgrade("jac", 104)) mult = mult.mul(upgradeEffect("jac", 104))
        if (hasUpgrade("aar", 104)) mult = mult.mul(player.aar.bal.add(1))
        return mult
    },
    gainExp() {
        return EN(1)
    },
    hotkeys: [
        {
            key: "j", 
            description: "J: Reset for Jacorb points", 
            unlocked() {return tmp[this.layer].layerShown },
            onPress(){ if (canReset(this.layer)) doReset(this.layer) }
        },
    ],

    autoUpgrade() {
        return hasUpgrade("aar", 212) || hasMilestone("aca", 1)
    },

    upgrades: {
        101: {
            title: "Start.",
            description: "You start getting 1 (all-purpose) point every second.",
            cost: EN(1),
            unlocked() { return true },
        },
        102: {
            title: "Initialize.",
            description: "Point gain is boosted by your Jacorb points.",
            cost: EN(1),
            effect() {
                let eff = softcap(player.jac.points.div(2).add(2).pow(0.5), EN(1e9), hasUpgrade("aar", 121) ? 1 : .01)
                if (hasUpgrade("jac", 251)) eff = eff.mul(buyableEffect("jac", 111).mul(buyableEffect("jac", 112)).pow(0.02))
                if (hasUpgrade("jac", 252)) eff = eff.mul(buyableEffect("jac", 131).pow(10))
                if (hasUpgrade("jac", 253)) eff = eff.mul(buyableEffect("jac", 101).pow(0.02))
                if (hasUpgrade("jac", 254)) eff = eff.mul(buyableEffect("jac", 122).pp ? buyableEffect("jac", 122).pp.pow(0.1) : 1)
                return softcap(eff, EN("e40000"), hasUpgrade("aar", 121) ? 1 : 0.1).min("e1000000")
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("jac", 101) },
        },
        103: {
            title: "Coding.",
            description: "Point gain is boosted by your points.",
            cost: EN(3),
            effect() {
                let eff = softcap(player.points.div(5).add(2).pow(0.4), EN(1e9), hasUpgrade("aar", 122) ? 1 : .01)
                if (hasUpgrade("jac", 251)) eff = eff.mul(buyableEffect("jac", 111).mul(buyableEffect("jac", 112)).pow(0.02))
                if (hasUpgrade("jac", 252)) eff = eff.mul(buyableEffect("jac", 131).pow(10))
                if (hasUpgrade("jac", 253)) eff = eff.mul(buyableEffect("jac", 101).pow(0.02))
                if (hasUpgrade("jac", 254)) eff = eff.mul(buyableEffect("jac", 122).pp ? buyableEffect("jac", 122).pp.pow(0.1) : 1)
                return softcap(eff, EN("e40000"), hasUpgrade("aar", 122) ? 1 : 0.1).min("e1000000")
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("jac", 102) },
        },
        104: {
            title: "Release.",
            description: "Jacorb point gain is boosted by your points.",
            cost: EN(10),
            effect() {
                let eff = softcap(player.points.div(10).add(1).pow(0.25), EN(1e9), hasUpgrade("aar", 123) ? 1 : .01)
                if (hasUpgrade("jac", 251)) eff = eff.mul(buyableEffect("jac", 111).mul(buyableEffect("jac", 112)).pow(0.02))
                if (hasUpgrade("jac", 252)) eff = eff.mul(buyableEffect("jac", 131).pow(10))
                if (hasUpgrade("jac", 253)) eff = eff.mul(buyableEffect("jac", 101).pow(0.02))
                if (hasUpgrade("jac", 254)) eff = eff.mul(buyableEffect("jac", 122).pp ? buyableEffect("jac", 122).pp.pow(0.1) : 1)
                return softcap(eff, EN("e40000"), hasUpgrade("aar", 123) ? 1 : 0.1).min("e1000000")
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("jac", 103) },
        },
        201: {
            title: "The Prestige Tree",
            description: "Unlocks a new tab.",
            cost: EN(25),
            unlocked() { return hasUpgrade("jac", 104) },
        },
        202: {
            title: "Layer Unlock",
            description: "Unlocks 2 new Prestige Tree layers.",
            cost: EN(2500),
            unlocked() { return hasUpgrade("jac", 201) && !hasUpgrade("aar", 201) },
        },
        203: {
            title: "Let there be an Universe!",
            description: "Unlocks 3 new Prestige Tree layers.",
            cost: EN(1e65),
            currencyLocation() {return player[this.layer].buyables}, 
            currencyDisplayName: "prestige points",
            currencyInternalName: 101,
            unlocked() { return hasUpgrade("jac", 202) },
        },
        204: {
            title: "Let there be Life!",
            description: "Unlocks 2 new Prestige Tree layers.",
            cost: EN("e365000"),
            currencyLocation() {return player}, 
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("jac", 203) },
        },
        205: {
            title: "...",
            description: "Unlocks 3 new Prestige Tree layers. You should enable force single tab mode by now, this upgrade grid is getting big.",
            cost: EN("e3200"),
            currencyLocation() {return player[this.layer].buyables}, 
            currencyDisplayName: "quirks",
            currencyInternalName: 131,
            unlocked() { return hasUpgrade("jac", 204) },
        },
        206: {
            title: "Not Layer Unlock",
            description: "Subspace Energy are auto-buy-maxed. Balance Energy requirements are reduced.",
            cost: EN("1000000"),
            currencyLocation() {return player[this.layer].buyables}, 
            currencyDisplayName: "magic",
            currencyInternalName: 141,
            unlocked() { return hasUpgrade("jac", 205) },
        },
        211: {
            title: "Self-Conversion",
            description: "Gain 1% of your Jacorb points gain on reset every second.",
            cost: EN(15000),
            unlocked() { return hasUpgrade("jac", 201) },
        },
        212: {
            title: "Self-Accelerator",
            description: "Increase Self-Conversion and Self-Prestige speed by ten-fold.",
            cost: EN(1e21),
            unlocked() { return hasUpgrade("jac", 221) && !hasUpgrade("aar", 201) },
        },
        213: {
            title: "It Gets Better",
            description: "You can buy max Boosters and Generators.",
            cost: EN(1e30),
            unlocked() { return hasUpgrade("jac", 222) },
        },
        214: {
            title: "Lossless Conversion",
            description: "Booster and Generator resets no longer reset.",
            cost: EN(1e150),
            unlocked() { return hasUpgrade("jac", 203) },
        },
        215: {
            title: "Row 4 Synergy",
            description: "Quirk and Hindrance Spirits boosts each other's gain.",
            cost: EN(200),
            currencyLocation() {return player[this.layer].buyables}, 
            currencyDisplayName: "quirks",
            currencyInternalName: 131,
            effect() {
                let eff = {
                    q: player[this.layer].buyables[132].add(1).log().add(1).pow(2.1),
                    h: player[this.layer].buyables[131].add(1).log().add(1).pow(2),
                }
                if (hasUpgrade("jac", 226)) {
                    let p = upgradeEffect("jac", 216).m ? upgradeEffect("jac", 216).m.mul(upgradeEffect("jac", 216).ba).pow(5) : 1
                    eff.q = eff.q.mul(p)
                    eff.h = eff.h.mul(p)
                }
                return eff
            },
            effectDisplay() {
                let eff = this.effect()
                return "Q: ×" + format(eff.q) + ", H: ×" + format(eff.h)
            },
            unlocked() { return hasUpgrade("jac", 204) },
        },
        216: {
            title: "Row 5 Synergy",
            description: "Magic and Balance Energy boosts each other's gain.",
            cost: EN(1e4),
            currencyLocation() {return player[this.layer].buyables}, 
            currencyDisplayName: "balance energy",
            currencyInternalName: 142,
            effect() {
                return {
                    m: player[this.layer].buyables[142].mul(2).add(1).pow(0.21),
                    ba: player[this.layer].buyables[141].mul(2).add(1).pow(0.24),
                }
            },
            effectDisplay() {
                let eff = this.effect()
                return "M: ×" + format(eff.m) + ", BA: ×" + format(eff.ba)
            },
            unlocked() { return hasUpgrade("jac", 205) },
        },
        221: {
            title: "Self-Prestige",
            description: "Gain 1% of your prestige points gain on reset every second.",
            cost: EN(100000000),
            unlocked() { return hasUpgrade("jac", 202) || (hasUpgrade("aar", 201) && hasUpgrade("jac", 201)) },
        },
        222: {
            title: "Acceleron Generators",
            description: "Increase Generator speed by five-fold.",
            cost: EN(1e28),
            unlocked() { return hasUpgrade("jac", 212) },
        },
        223: {
            title: "True Prestige Tree",
            description: "Makes Boosters and Generators boost points.",
            cost: EN(1e35),
            unlocked() { return hasUpgrade("jac", 222) },
        },
        224: {
            title: "Quick Cash",
            description: "Boosters and Generators are claimed automatically.",
            cost: EN("e1000"),
            currencyLocation() {return player}, 
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("jac", 203) },
        },
        225: {
            title: "Well That Was Quick",
            description: "Super-Generators no longer resets and are auto-buy^2-max^2-able.",
            cost: EN(1000000),
            currencyLocation() {return player[this.layer].buyables}, 
            currencyDisplayName: "quirks",
            currencyInternalName: 131,
            unlocked() { return hasUpgrade("jac", 204) },
        },
        226: {
            title: "Row 4 Row 5",
            description: "^5 of the product of the <b>Row 5 Synergy</b> effects multiplies each of the <b>Row 4 Synergy</b> effects.",
            cost: EN(1e12),
            currencyLocation() {return player[this.layer].buyables}, 
            currencyDisplayName: "magic",
            currencyInternalName: 141,
            unlocked() { return hasUpgrade("jac", 205) },
        },
        231: {
            title: "Booster Generators",
            description: "Generators increase the multiplier per each booster by +.8% each, up to +3.",
            cost: EN(2),
            currencyLocation() {return player[this.layer].buyables}, 
            currencyDisplayName: "time capsules",
            currencyInternalName: 121,
            effect() {
                return player.jac.buyables[112].mul(0.008).min(3)
            },
            effectDisplay() { return "+" + format(this.effect()) },
            unlocked() { return hasUpgrade("jac", 203) },
        },
        232: {
            title: "Real Prestige Tree",
            description: "Points decrease the cost of Boosters and Generators.",
            cost: EN(5000),
            currencyLocation() {return player[this.layer].buyables}, 
            currencyDisplayName: "enhance points",
            currencyInternalName: 122,
            effect() {
                return player.points.add(1).pow(0.0875)
            },
            effectDisplay() { return "÷" + format(this.effect()) },
            unlocked() { return hasUpgrade("jac", 203) },
        },
        233: {
            title: "Generator Boosters",
            description: "Boosters increase the speed of Generators by +2.5% each, up to +25×.",
            cost: EN(2),
            currencyLocation() {return player[this.layer].buyables}, 
            currencyDisplayName: "space energy",
            currencyInternalName: 123,
            effect() {
                return player.jac.buyables[111].mul(0.025).add(1).min(25)
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("jac", 203) },
        },
        234: {
            title: "Supercharge",
            description: "Unlocks 2 new Prestige Tree layers.",
            cost: EN("e150"),
            currencyLocation() {return player[this.layer].buyables}, 
            currencyDisplayName: "enhance points",
            currencyInternalName: 122,
            unlocked() { return hasUpgrade("jac", 203) },
        },
        235: {
            title: "Unfail Advantage",
            description: "Super-Booster effect multiplies Hindrance Spirit gain.",
            cost: EN(1000000),
            currencyLocation() {return player[this.layer].buyables}, 
            currencyDisplayName: "hindrance spirits",
            currencyInternalName: 132,
            unlocked() { return hasUpgrade("jac", 204) },
        },
        236: {
            title: "Prestige Tree: Classic",
            description: "Unlocks 1 new Prestige Tree layer.",
            cost: EN(1e15),
            currencyLocation() {return player[this.layer].buyables}, 
            currencyDisplayName: "balance points",
            currencyInternalName: 142,
            unlocked() { return hasUpgrade("jac", 205) },
        },
        241: {
            title: "The Ultimate Quality of Life",
            description: "Time Capsules and Space Energy no longer resets, gets auto-claimed and you can buy max them.",
            cost: EN("e500"),
            currencyLocation() {return player[this.layer].buyables}, 
            currencyDisplayName: "enhance points",
            currencyInternalName: 122,
            unlocked() { return hasUpgrade("jac", 242) },
        },
        242: {
            title: "Quality Enhancement",
            description: "Gain 5% of your enhance points gain on reset every second.",
            cost: EN("e250"),
            currencyLocation() {return player[this.layer].buyables}, 
            currencyDisplayName: "enhance points",
            currencyInternalName: 122,
            unlocked() { return hasUpgrade("jac", 234) },
        },
        243: {
            title: "Exotic Acceleron Generators",
            description: "100× generator speed.",
            cost: EN("e2500"),
            currencyLocation() {return player[this.layer].buyables}, 
            currencyDisplayName: "enhance points",
            currencyInternalName: 122,
            unlocked() { return hasUpgrade("jac", 242) },
        },
        244: {
            title: "Boosting in Bulk",
            description: "Super-Boosters no longer resets, gets auto-claimed and you can buy max them.",
            cost: EN("e8000"),
            currencyLocation() {return player[this.layer].buyables}, 
            currencyDisplayName: "enhance points",
            currencyInternalName: 122,
            unlocked() { return hasUpgrade("jac", 242) },
        },
        245: {
            title: "Quirkier",
            description: "The quirks in the quirk formula increases from ^0.6 to ^1 in 120 seconds in this Jacorb reset.",
            cost: EN(1e13),
            currencyLocation() {return player[this.layer].buyables}, 
            currencyDisplayName: "hindrance spirits",
            currencyInternalName: 132,
            unlocked() { return hasUpgrade("jac", 204) },
        },
        246: {
            title: "How Much?",
            description: "Hyper Boosters are auto-buy-maxed and no longer resets.",
            cost: EN(40),
            currencyLocation() {return player[this.layer].buyables}, 
            currencyDisplayName: "hyper boosters",
            currencyInternalName: 135,
            unlocked() { return hasUpgrade("jac", 236) },
        },
        251: {
            title: "Time for a Boost",
            description: "^0.02 of your Generator and Booster effect multiplies the first four upgrades' effects.",
            cost: EN("e9600"),
            currencyLocation() {return player[this.layer].buyables}, 
            currencyDisplayName: "enhance points",
            currencyInternalName: 122,
            unlocked() { return hasUpgrade("jac", 244) },
        },
        252: {
            title: "Time for a Boost II",
            description: "^10 of your Quirk effect multiplies the first four upgrades' effects.",
            cost: EN("e12000"),
            currencyLocation() {return player[this.layer].buyables}, 
            currencyDisplayName: "enhance points",
            currencyInternalName: 122,
            unlocked() { return hasUpgrade("jac", 244) },
        },
        253: {
            title: "Time for a Boost III",
            description: "^0.02 of your Prestige Point effect multiplies the first four upgrades' effects.",
            cost: EN("e14000"),
            currencyLocation() {return player[this.layer].buyables}, 
            currencyDisplayName: "enhance points",
            currencyInternalName: 122,
            unlocked() { return hasUpgrade("jac", 244) },
        },
        254: {
            title: "Time for a Boost IV",
            description: "^0.1 of your Enhance Point effect multiplies the first four upgrades' effects.",
            cost: EN("e16000"),
            currencyLocation() {return player[this.layer].buyables}, 
            currencyDisplayName: "enhance points",
            currencyInternalName: 122,
            unlocked() { return hasUpgrade("jac", 244) },
        },
        255: {
            title: "Let there be Light!",
            description: "Unlock 2 new Prestige Tree layers.",
            cost: EN(1e64),
            currencyLocation() {return player[this.layer].buyables}, 
            currencyDisplayName: "quirks",
            currencyInternalName: 131,
            unlocked() { return hasUpgrade("jac", 204) },
        },
        256: {
            title: "D-Did the Game just Inflated?",
            description: "You gain your Magic and Balance Energy gain on reset.",
            cost: EN("ee42"),
            currencyLocation() {return player[this.layer].buyables}, 
            currencyDisplayName: "quirks",
            currencyInternalName: 131,
            unlocked() { return hasUpgrade("jac", 246) },
        },
        261: {
            title: "Solar Solution",
            description: "You gain 10% of your Solarity gain on reset each second.",
            cost: EN(1e12),
            currencyLocation() {return player[this.layer].buyables}, 
            currencyDisplayName: "solarity",
            currencyInternalName: 133,
            unlocked() { return hasUpgrade("jac", 255) },
        },
        262: {
            title: "Lifelight",
            description: "Solarity gain on reset multiplies Hindrance Spirit gain.",
            cost: EN(1e18),
            currencyLocation() {return player[this.layer].buyables}, 
            currencyDisplayName: "solarity",
            currencyInternalName: 133,
            unlocked() { return hasUpgrade("jac", 255) },
        },
        263: {
            title: "Hindrance Quirks",
            description: "You gain 10% of your Hindrance Spirit and Quirk gain on reset each second.",
            cost: EN(1e100),
            currencyLocation() {return player[this.layer].buyables}, 
            currencyDisplayName: "quirks",
            currencyInternalName: 131,
            unlocked() { return hasUpgrade("jac", 255) },
        },
        264: {
            title: "Quirk Accelerator",
            description: "All Row 4 and higher layers that is based on Jacorb reset time are boosted by 100×.",
            cost: EN(1e60),
            currencyLocation() {return player[this.layer].buyables}, 
            currencyDisplayName: "hindrance spirits",
            currencyInternalName: 132,
            unlocked() { return hasUpgrade("jac", 255) },
        },
        265: {
            title: "Quirk Accelerator... again",
            description: "Apply previous upgrade once again, but this time it's only 10×.",
            cost: EN(10),
            currencyLocation() {return player[this.layer].buyables}, 
            currencyDisplayName: "subspace energy",
            currencyInternalName: 134,
            unlocked() { return hasUpgrade("jac", 264) },
        },
        266: {
            title: () => hasUpgrade("jac", 266) ? "████ ██ ████████" : "It's at 10↑10↑50",
            description: () => hasUpgrade("jac", 266) ? "██████ ███████████ ███ ███ ██████ █ ████████" : "Resets EVERYTHING, but you unlock a new creator.",
            cost: EN(1),
            currencyLocation() {return player[this.layer].buyables}, 
            currencyDisplayName: "phantom soul",
            currencyInternalName: 143,
            onPurchase() {
                layerDataReset("jac")
                player.points = EN(0)
                player.jac.upgrades = ["266"]
                addPoints("aar", 1)
            },
            unlocked() { return hasUpgrade("jac", 256) },
        },
    },
    buyables: {
        101: {
            title() { return format(player[this.layer].buyables[this.id], 0)},
            prestigeMul () {
                let mul = EN(1)
                mul = mul.mul(tmp[this.layer].buyables[111].effect)
                mul = mul.mul(tmp[this.layer].buyables[112].effect)
                mul = mul.mul(tmp[this.layer].buyables[121].effect)
                mul = mul.mul(tmp[this.layer].buyables[122].effect.pp)
                mul = mul.mul(tmp[this.layer].buyables[123].effect.ppp)
                if (EN.isFinite(mul)) return mul
                return EN(1)
            },
            prestigeGain () {
                let data = tmp[this.layer].buyables[this.id]
                return player[this.layer].points.max(0).div(data.cost).pow(0.5).mul(data.prestigeMul).floor()
            },
            prestigeNext () {
                let data = tmp[this.layer].buyables[this.id]
                return data.prestigeGain.add(1).div(data.prestigeMul).root(0.5).mul(data.cost)
            },
            cost(x=player[this.layer].buyables[this.id]) {
                return EN(20)
            },
            effect(x=player[this.layer].buyables[this.id]) {
                let eff = x.max(0).add(1).pow(hasUpgrade("aar", 102) ? 1 : 0.75);
                return eff
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return `prestige points

                    which are giving a ×${format(data.effect)} boost to point gain.

                    Reset Jacorb points for +<h3>${format(data.prestigeGain, 0)}</h3> prestige points
                    ${data.prestigeGain.lt(100) ? "Next at " + format(data.prestigeNext, 0) + " Jacorb points" : ""}
                `
            },
            unlocked() { return hasUpgrade("jac", 201) }, 
            canAfford() {
                return tmp[this.layer].buyables[this.id].prestigeGain.gte(1)},
            buy() { 
                let data = tmp[this.layer].buyables[this.id]
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(data.prestigeGain)

                doReset(this.layer, true)
                player[this.layer].points = EN(0)

            },
            style() {
                if (tmp[this.layer].buyables[this.id].canAfford) return {
                    "background-color": "#31aeb0"
                }
            },
        },
        111: {
            title() { return format(player[this.layer].buyables[this.id], 0)},
            prestigeGain () {
                let data = tmp[this.layer].buyables[this.id]
                if (hasUpgrade("jac", 213)) return player[this.layer].buyables[101].max(0).div(data.cost).log().div(Math.log(3)).root(1.25).sub(player[this.layer].buyables[this.id]).add(1).max(0).floor()
                return EN(data.prestigeNext.lte(player[this.layer].buyables[101]) ? 1 : 0)
            },
            prestigeNext () {
                let data = tmp[this.layer].buyables[this.id]
                if (hasUpgrade("jac", 213)) return data.cost.mul(EN.pow(3, player[this.layer].buyables[this.id].add(data.prestigeGain).pow(1.25)))
                return data.cost.mul(EN.pow(3, player[this.layer].buyables[this.id].pow(1.25)))
            },
            cost(x=player[this.layer].buyables[this.id]) {
                let cost = EN(20)
                if (hasUpgrade("jac", 232)) cost = cost.div(upgradeEffect("jac", 232))
                return cost.max("1e-308")
            },
            effect(x=player[this.layer].buyables[this.id]) {
                x = softcap(x, EN(200), hasUpgrade("aar", 124) ? 1 : .75)
                let bonus = buyableEffect("jac", 122).bg
                let mul = EN(2)
                if (hasUpgrade("jac", 231)) mul = mul.add(upgradeEffect("jac", 231))
                mul = mul.mul(buyableEffect("jac", 124))
                let eff = EN.pow(mul, x.add(bonus));
                if (EN.isFinite(eff)) return softcap(eff, EN("e1000000"), 0.1)
                return EN(1)
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return `boosters

                    which are giving a ×${format(data.effect)} boost to prestige point gain. ${
                        !hasUpgrade("aar", 131) && data.cost.lte(1e-308) ? "\n(Note: Base costs are hardcapped at 1e-308.)" : ""
                    }

                    Reset prestige points for +<h3>${format(data.prestigeGain, 0)}</h3> boosters
                    ${data.prestigeGain.lt(100) ? "Next at " + format(data.prestigeNext, 0) + " prestige points" : ""}
                `
            },
            unlocked() { return hasUpgrade("jac", 202) }, 
            canAfford() {
                return tmp[this.layer].buyables[this.id].prestigeGain.gte(1)},
            buy() { 
                let data = tmp[this.layer].buyables[this.id]
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(data.prestigeGain)

                if (!hasUpgrade("jac", 214)) {
                    doReset(this.layer, true)
                    player[this.layer].points = EN(0)
                    resetBuyableRow("jac", 10)
                }

            },
            style() {
                if (tmp[this.layer].buyables[this.id].canAfford) return {
                    "background-color": "#6e64c4"
                }
            },
        },
        112: {
            title() { return format(player[this.layer].buyables[this.id], 0)},
            prestigeGain () {
                let data = tmp[this.layer].buyables[this.id]
                if (hasUpgrade("jac", 213)) return player[this.layer].buyables[101].max(0).div(data.cost).log().div(Math.log(3)).root(1.25).sub(player[this.layer].buyables[this.id]).add(1).max(0).floor()
                return EN(data.prestigeNext.lte(player[this.layer].buyables[101]) ? 1 : 0)
            },
            prestigeNext () {
                let data = tmp[this.layer].buyables[this.id]
                if (hasUpgrade("jac", 213)) return data.cost.mul(EN.pow(3, player[this.layer].buyables[this.id].add(data.prestigeGain).pow(1.25)))
                return data.cost.mul(EN.pow(3, player[this.layer].buyables[this.id].pow(1.25)))
            },
            cost(x=player[this.layer].buyables[this.id]) {
                let cost = EN(20)
                if (hasUpgrade("jac", 232)) cost = cost.div(upgradeEffect("jac", 232))
                return cost.max("1e-308")
            },
            effect(x=player[this.layer].buyables[this.id]) {
                x = softcap(x, EN(200), hasUpgrade("aar", 124) ? 1 : .75)
                let time = EN(player[this.layer].resetTime)
                let bonus = buyableEffect("jac", 122).bg
                let mul = EN(2)
                mul = mul.mul(buyableEffect("jac", 125))
                if (hasUpgrade("jac", 222)) time = time.mul(5)
                if (hasUpgrade("jac", 233)) time = time.mul(upgradeEffect("jac", 233))
                if (hasUpgrade("jac", 243)) time = time.mul(100)
                time = softcap(time, EN(36000), .5)
                if (hasUpgrade("jac", 264)) time = time.mul(100); if (hasUpgrade("jac", 265)) time = time.mul(100)
                let eff = EN.pow(mul, x.add(bonus)).pow(time.div(x.add(6).mul(5)).add(1).log()).max(1);
                eff = eff.mul(buyableEffect("jac", 131));
                return softcap(eff, EN("e1000000"), 0.1)
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return `generators

                    which are giving a ×${format(data.effect)} boost to prestige point gain, slowly increases over this Jacorb reset.

                    Reset prestige points for +<h3>${format(data.prestigeGain, 0)}</h3> boosters
                    ${data.prestigeGain.lt(100) ? "Next at " + format(data.prestigeNext, 0) + " prestige points" : ""}
                `
            },
            unlocked() { return hasUpgrade("jac", 202) }, 
            canAfford() {
                return tmp[this.layer].buyables[this.id].prestigeGain.gte(1)},
            buy() { 
                let data = tmp[this.layer].buyables[this.id]
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(data.prestigeGain)

                if (!hasUpgrade("jac", 214)) {
                    doReset(this.layer, true)
                    player[this.layer].points = EN(0)
                resetBuyableRow("jac", 10)
                }

            },
            style() {
                if (tmp[this.layer].buyables[this.id].canAfford) return {
                    "background-color": "#a3d9a5"
                }
            },
        },
        121: {
            title() { return format(player[this.layer].buyables[this.id], 0)},
            prestigeGain () {
                let data = tmp[this.layer].buyables[this.id]
                if (hasUpgrade("jac", 241)) return player[this.layer].buyables[101].max(0).div(data.cost).log().div(Math.log(1e25)).root(1.35).sub(player[this.layer].buyables[this.id]).add(1).max(0).floor()
                return EN(data.prestigeNext.lte(player.jac.points) ? 1 : 0)
            },
            prestigeNext () {
                let data = tmp[this.layer].buyables[this.id]
                if (hasUpgrade("jac", 241)) return data.cost.mul(EN.pow(1e25, player[this.layer].buyables[this.id].add(data.prestigeGain).pow(1.35)))
                return data.cost.mul(EN.pow(1e25, player[this.layer].buyables[this.id].pow(1.35)))
            },
            cost(x=player[this.layer].buyables[this.id]) {
                return EN(1e65)
            },
            effect(x=player[this.layer].buyables[this.id]) {
                x = softcap(x.mul(buyableEffect("jac", 142).ng || 1), EN(200), .75)
                let time = EN(player[this.layer].resetTime)
                if (hasUpgrade("jac", 264)) time = time.mul(100); if (hasUpgrade("jac", 265)) time = time.mul(100)
                let eff = EN.pow(1e9, x).pow(EN.sub(1, time.div(10).add(1).pow(-1))).max(1);
                return eff.mul(buyableEffect("jac", 132)).mul(buyableEffect("jac", 133).tc || 1);
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return `time capsules

                    which are giving a ×${format(data.effect)} boost to point and prestige point gain, which increases at a diminishing rate over this Jacorb reset.

                    Reset previous progress for +<h3>${format(data.prestigeGain, 0)}</h3> time capsules
                    ${data.prestigeGain.lt(100) ? "Next at " + format(data.prestigeNext, 0) + " Jacorb points" : ""}
                `
            },
            unlocked() { return hasUpgrade("jac", 203) }, 
            canAfford() {
                return tmp[this.layer].buyables[this.id].prestigeGain.gte(1)},
            buy() { 
                let data = tmp[this.layer].buyables[this.id]
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(data.prestigeGain)

                if (!hasUpgrade("jac", 241)) {
                    doReset(this.layer, true)
                    player[this.layer].points = EN(0)
                resetBuyableRow("jac", 10)
                    resetBuyableRow("jac", 11)
                }
            },
            style() {
                if (tmp[this.layer].buyables[this.id].canAfford) return {
                    "background-color": "#006609"
                }
            },
        },
        122: {
            title() { return format(player[this.layer].buyables[this.id], 0)},
            prestigeMul () {
                let mul = EN(1)
                return mul
            },
            prestigeGain () {
                let data = tmp[this.layer].buyables[this.id]
                return player[this.layer].points.max(0).div(data.cost).pow(0.12).mul(data.prestigeMul).floor()
            },
            prestigeNext () {
                let data = tmp[this.layer].buyables[this.id]
                return data.prestigeGain.add(1).div(data.prestigeMul).root(0.12).mul(data.cost)
            },
            cost(x=player[this.layer].buyables[this.id]) {
                return EN(1e85)
            },
            effect(x=player[this.layer].buyables[this.id]) {
                let eff = {
                    pp: x.add(1).pow(2.5),
                    bg: x.add(1).log().pow(0.8)
                }
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return `enhance points

                    which are giving a ×${format(data.effect.pp)} boost to prestige point gain and an additional +${format(data.effect.bg)} bonus Boosters/Generators.

                    Reset previous progress for +<h3>${format(data.prestigeGain, 0)}</h3> enhance points
                    ${data.prestigeGain.lt(100) ? "Next at " + format(data.prestigeNext, 0) + " Jacorb points" : ""}
                `
            },
            unlocked() { return hasUpgrade("jac", 203) }, 
            canAfford() {
                return tmp[this.layer].buyables[this.id].prestigeGain.gte(1)},
            buy() { 
                let data = tmp[this.layer].buyables[this.id]
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(data.prestigeGain)

                doReset(this.layer, true)
                player[this.layer].points = EN(0)
                resetBuyableRow("jac", 10)
                resetBuyableRow("jac", 11)

            },
            style() {
                if (tmp[this.layer].buyables[this.id].canAfford) return {
                    "background-color": "#b82fbd"
                }
            },
        },
        123: {
            title() { return format(player[this.layer].buyables[this.id], 0)},
            prestigeGain () {
                let data = tmp[this.layer].buyables[this.id]
                if (hasUpgrade("jac", 241)) return player[this.layer].buyables[101].max(0).div(data.cost).log().div(Math.log(1e25)).root(1.35).sub(player[this.layer].buyables[this.id]).add(1).max(0).floor()
                return EN(data.prestigeNext.lte(player.jac.points) ? 1 : 0)
            },
            prestigeNext () {
                let data = tmp[this.layer].buyables[this.id]
                if (hasUpgrade("jac", 241)) return data.cost.mul(EN.pow(1e25, player[this.layer].buyables[this.id].add(data.prestigeGain).pow(1.35)))
                return data.cost.mul(EN.pow(1e25, player[this.layer].buyables[this.id].pow(1.35)))
            },
            cost(x=player[this.layer].buyables[this.id]) {
                return EN(1e65)
            },
            effect(x=player[this.layer].buyables[this.id]) {
                x = softcap(x, EN(200), .75)
                let gf = buyableEffect("jac", 112)
                let eff = {
                    ppp: EN.pow(gf.root(gf.add(1).log().div(20).add(0.2)), x)
                }
                eff.ppp = eff.ppp.mul(buyableEffect("jac", 134))
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return `space energy

                    which are giving a ×${format(data.effect.ppp)} bonus to point and prestige point gain, based on Generators' effect

                    Reset previous progress for +<h3>${format(data.prestigeGain, 0)}</h3> space energy
                    ${data.prestigeGain.lt(100) ? "Next at " + format(data.prestigeNext, 0) + " Jacorb points" : ""}
                `
            },
            unlocked() { return hasUpgrade("jac", 203) }, 
            canAfford() {
                return tmp[this.layer].buyables[this.id].prestigeGain.gte(1)},
            buy() { 
                let data = tmp[this.layer].buyables[this.id]
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(data.prestigeGain)

                if (!hasUpgrade("jac", 241)) {
                    doReset(this.layer, true)
                    player[this.layer].points = EN(0)
                resetBuyableRow("jac", 10)
                    resetBuyableRow("jac", 11)
                }

            },
            style() {
                if (tmp[this.layer].buyables[this.id].canAfford) return {
                    "background-color": "#dfdfdf"
                }
            },
        },
        124: {
            title() { return format(player[this.layer].buyables[this.id], 0)},
            prestigeGain () {
                let data = tmp[this.layer].buyables[this.id]
                if (hasUpgrade("jac", 244)) return player[this.layer].buyables[111].max(0).div(data.cost).log().div(Math.log(1.05)).root(1.05).sub(player[this.layer].buyables[this.id]).add(1).max(0).floor()
                return EN(data.prestigeNext.lte(player.jac.buyables[111]) ? 1 : 0)
            },
            prestigeNext () {
                let data = tmp[this.layer].buyables[this.id]
                if (hasUpgrade("jac", 244)) return data.cost.mul(EN.pow(1.05, player[this.layer].buyables[this.id].add(data.prestigeGain).pow(1.05)))
                return data.cost.mul(EN.pow(1.05, player[this.layer].buyables[this.id].pow(1.05)))
            },
            cost(x=player[this.layer].buyables[this.id]) {
                return EN(800)
            },
            effect(x=player[this.layer].buyables[this.id]) {
                x = softcap(x, EN(100), 9)
                let mul = EN(1.2)
                mul = mul.mul(buyableEffect("jac", 135))
                let eff = EN.pow(mul, x)
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return `super boosters

                    which are giving a ×${format(data.effect)} bonus to base Booster effect.

                    Reset previous progress for +<h3>${format(data.prestigeGain, 0)}</h3> super boosters
                    ${data.prestigeGain.lt(100) ? "Next at " + format(data.prestigeNext, 0) + " boosters" : ""}
                `
            },
            unlocked() { return hasUpgrade("jac", 234) }, 
            canAfford() {
                return tmp[this.layer].buyables[this.id].prestigeGain.gte(1)},
            buy() { 
                let data = tmp[this.layer].buyables[this.id]
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(data.prestigeGain)

                if (!hasUpgrade("jac", 244)) {
                    doReset(this.layer, true)
                    player[this.layer].points = EN(0)
                resetBuyableRow("jac", 10)
                    resetBuyableRow("jac", 11)
                }

            },
            style() {
                if (tmp[this.layer].buyables[this.id].canAfford) return {
                    "background-color": "#504899"
                }
            },
        },
        125: {
            title() { return format(player[this.layer].buyables[this.id], 0)},
            prestigeGain () {
                let data = tmp[this.layer].buyables[this.id]
                if (hasUpgrade("jac", 225)) return player[this.layer].buyables[111].max(0).div(data.cost).log().div(Math.log(1.05)).root(1.05).sub(player[this.layer].buyables[this.id]).add(1).max(0).floor()
                return EN(data.prestigeNext.lte(player.jac.buyables[112]) ? 1 : 0)
            },
            prestigeNext () {
                let data = tmp[this.layer].buyables[this.id]
                if (hasUpgrade("jac", 225)) return data.cost.mul(EN.pow(1.05, player[this.layer].buyables[this.id].add(data.prestigeGain).pow(1.05)))
                return data.cost.mul(EN.pow(1.05, player[this.layer].buyables[this.id].pow(1.05)))
            },
            cost(x=player[this.layer].buyables[this.id]) {
                return EN(39900)
            },
            effect(x=player[this.layer].buyables[this.id]) {
                x = softcap(x, EN(100), 9)
                let time = EN(player[this.layer].resetTime)
                if (hasUpgrade("jac", 264)) time = time.mul(100); if (hasUpgrade("jac", 265)) time = time.mul(100)
                let eff = EN.pow(1.2, x).pow(time.div(x.add(6).mul(5)).add(1).log(2)).add(time.div(100).mul(x).add(1).log(1e10))
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return `super generators

                    which are giving a ×${format(data.effect)} bonus to base Generator effect, slowly increases over this Jacorb reset.

                    Reset previous progress for +<h3>${format(data.prestigeGain, 0)}</h3> super generators
                    ${data.prestigeGain.lt(100) ? "Next at " + format(data.prestigeNext, 0) + " generators" : ""}
                `
            },
            unlocked() { return hasUpgrade("jac", 204) }, 
            canAfford() {
                return tmp[this.layer].buyables[this.id].prestigeGain.gte(1)},
            buy() { 
                let data = tmp[this.layer].buyables[this.id]
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(data.prestigeGain)

                if (!hasUpgrade("jac", 225)) {
                    doReset(this.layer, true)
                    player[this.layer].points = EN(0)
                resetBuyableRow("jac", 10)
                    resetBuyableRow("jac", 11)
                }

            },
            style() {
                if (tmp[this.layer].buyables[this.id].canAfford) return {
                    "background-color": "#248239"
                }
            },
        },
        131: {
            title() { return format(player[this.layer].buyables[this.id], 0)},
            prestigeMul () {
                let mul = EN(1)
                if (hasUpgrade("jac", 215)) mul = mul.mul(upgradeEffect("jac", 215).q)
                mul = mul.mul(buyableEffect("jac", 141))
                return mul
            },
            prestigeGain () {
                let data = tmp[this.layer].buyables[this.id]
                return buyableEffect("jac", 112).max(0).div(data.cost).pow(0.01).pow(0.02).mul(data.prestigeMul).floor()
            },
            prestigeNext () {
                let data = tmp[this.layer].buyables[this.id]
                if (data.prestigeGain.lte(0)) return data.cost
                return data.prestigeGain.add(1).div(data.prestigeMul).root(0.01).root(0.02).mul(data.cost)
            },
            cost(x=player[this.layer].buyables[this.id]) {
                return EN("1e2100")
            },
            effect(x=player[this.layer].buyables[this.id]) {
                let time = EN(player[this.layer].resetTime)
                if (hasUpgrade("jac", 264)) time = time.mul(100); if (hasUpgrade("jac", 265)) time = time.mul(100)
                let eff = EN.pow(time.add(1), softcap(x.add(1).log(1e10).pow(time.div(120 / 0.4).min(hasUpgrade("jac", 245) ? 0.4 : 0).add(0.6)), EN(10), 0.5).mul(50))
                return eff.mul(buyableEffect("jac", 142).ps || 1);
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return `quirks

                    which are giving a ×${format(data.effect)} boost to point gain and Generator effect, which increases at an increasing rate over this Jacorb reset.

                    Reset previous progress for +<h3>${format(data.prestigeGain, 0)}</h3> quirks
                    ${data.prestigeGain.lt(100) ? "Next at ×" + format(data.prestigeNext, 0) + " generator effect" : ""}
                `
            },
            unlocked() { return hasUpgrade("jac", 234) }, 
            canAfford() {
                return tmp[this.layer].buyables[this.id].prestigeGain.gte(1)},
            buy() { 
                let data = tmp[this.layer].buyables[this.id]
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(data.prestigeGain)

                doReset(this.layer, true)
                player[this.layer].points = EN(0)
                resetBuyableRow("jac", 10)
                resetBuyableRow("jac", 11)
                resetBuyableRow("jac", 12)

            },
            style() {
                if (tmp[this.layer].buyables[this.id].canAfford) return {
                    "background-color": "#c20282"
                }
            },
        },
        132: {
            title() { return format(player[this.layer].buyables[this.id], 0)},
            prestigeMul () {
                let mul = EN(1)
                if (hasUpgrade("jac", 215)) mul = mul.mul(upgradeEffect("jac", 215).h)
                if (hasUpgrade("jac", 235)) mul = mul.mul(buyableEffect("jac", 124))
                if (hasUpgrade("jac", 262)) mul = mul.mul(tmp.jac.buyables[133].prestigeGain || 1)
                mul = mul.mul(buyableEffect("jac", 141))
                return mul
            },
            prestigeGain () {
                let data = tmp[this.layer].buyables[this.id]
                return buyableEffect("jac", 121).max(0).div(data.cost).pow(0.01).pow(0.03).mul(data.prestigeMul).floor()
            },
            prestigeNext () {
                let data = tmp[this.layer].buyables[this.id]
                if (data.prestigeGain.lte(0)) return data.cost
                return data.prestigeGain.add(1).div(data.prestigeMul).root(0.01).root(0.03).mul(data.cost)
            },
            cost(x=player[this.layer].buyables[this.id]) {
                return EN("1e4100")
            },
            effect(x=player[this.layer].buyables[this.id]) {
                let time = EN(player[this.layer].resetTime)
                if (hasUpgrade("jac", 264)) time = time.mul(100); if (hasUpgrade("jac", 265)) time = time.mul(100)
                let eff = x.add(1).pow(20).pow(player.jac.points.max(0).add(1).log().add(1).log())
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return `hindrance spirits

                    which are giving a ×${format(data.effect)} boost to point gain and Time Capsules effect, which increases based on your Jacorb points.

                    Reset previous progress for +<h3>${format(data.prestigeGain, 0)}</h3> hindrance spirits
                    ${data.prestigeGain.lt(100) ? "Next at ×" + format(data.prestigeNext, 0) + " time capsules effect" : ""}
                `
            },
            unlocked() { return hasUpgrade("jac", 204) }, 
            canAfford() {
                return tmp[this.layer].buyables[this.id].prestigeGain.gte(1)},
            buy() { 
                let data = tmp[this.layer].buyables[this.id]
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(data.prestigeGain)

                doReset(this.layer, true)
                player[this.layer].points = EN(0)
                resetBuyableRow("jac", 10)
                resetBuyableRow("jac", 11)
                resetBuyableRow("jac", 12)

            },
            style() {
                if (tmp[this.layer].buyables[this.id].canAfford) return {
                    "background-color": "#a14040"
                }
            },
        },
        133: {
            title() { return format(player[this.layer].buyables[this.id], 0)},
            prestigeMul () {
                let mul = EN(1)
                mul = mul.mul(buyableEffect("jac", 133).so || 1)
                return mul
            },
            prestigeGain () {
                let data = tmp[this.layer].buyables[this.id]
                return player[this.layer].buyables[124].max(0).div(data.cost).pow(1.5).mul(data.prestigeMul).floor()
            },
            prestigeNext () {
                let data = tmp[this.layer].buyables[this.id]
                return data.prestigeGain.add(1).div(data.prestigeMul).root(1.5).mul(data.cost).ceil()
            },
            cost(x=player[this.layer].buyables[this.id]) {
                return EN(75)
            },
            effect(x=player[this.layer].buyables[this.id]) {
                let time = EN(player[this.layer].resetTime)
                if (hasUpgrade("jac", 264)) time = time.mul(100); if (hasUpgrade("jac", 265)) time = time.mul(100)
                let eff = {
                    so: softcap(x.add(10).log10().pow(time.add(1).log().pow(1.5)), EN(1e15), .5),
                    tc: x.add(1).pow(50).pow(time.add(1).log().pow(2)).mul(buyableEffect("jac", 141)),
                }
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return `solarity

                    which are giving a ×${format(data.effect.so)} boost to Solarity gain and a ×${format(data.effect.tc)} bonus to Time Capsule effect, slowly increses over this Jacorb reset.

                    Reset previous progress for +<h3>${format(data.prestigeGain, 0)}</h3> solarity
                    ${data.prestigeGain.lt(100) ? "Next at " + format(data.prestigeNext, 0) + " super-boosters" : ""}
                `
            },
            unlocked() { return hasUpgrade("jac", 255) }, 
            canAfford() {
                return tmp[this.layer].buyables[this.id].prestigeGain.gte(1)},
            buy() { 
                let data = tmp[this.layer].buyables[this.id]
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(data.prestigeGain)

                doReset(this.layer, true)
                player[this.layer].points = EN(0)
                resetBuyableRow("jac", 10)
                resetBuyableRow("jac", 11)
                resetBuyableRow("jac", 12)

            },
            style() {
                if (tmp[this.layer].buyables[this.id].canAfford) return {
                    "background": "radial-gradient(#ffcd00, #ff4300)"
                }
            },
        },
        134: {
            title() { return format(player[this.layer].buyables[this.id], 0)},
            prestigeGain () {
                let data = tmp[this.layer].buyables[this.id]
                if (hasUpgrade("jac", 206)) return player[this.layer].buyables[123].max(0).div(data.cost).log().div(Math.log(1.2)).root(1.05).sub(player[this.layer].buyables[this.id]).add(1).max(0).floor()
                return EN(data.prestigeNext.lte(player.jac.buyables[123]) ? 1 : 0)
            },
            prestigeNext () {
                let data = tmp[this.layer].buyables[this.id]
                if (hasUpgrade("jac", 206)) return data.cost.mul(EN.pow(1.2, player[this.layer].buyables[this.id].add(data.prestigeGain).pow(1.05)))
                return data.cost.mul(EN.pow(1.2, player[this.layer].buyables[this.id].pow(1.05)))
            },
            cost(x=player[this.layer].buyables[this.id]) {
                return EN(1800)
            },
            effect(x=player[this.layer].buyables[this.id]) {
                x = softcap(x.mul(buyableEffect("jac", 142).ng || 1), EN(50), .5)
                let time = EN(player[this.layer].resetTime)
                if (hasUpgrade("jac", 264)) time = time.mul(100); if (hasUpgrade("jac", 265)) time = time.mul(100)
                let eff = time.add(1).pow(10).pow(time.add(1).log().pow(1.5)).pow(x).mul(buyableEffect("jac", 141))
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return `subspace energy

                    which are giving a ×${format(data.effect)} bonus to Space Energy effect, slowly increases over this Jacorb reset.

                    Reset previous progress for +<h3>${format(data.prestigeGain, 0)}</h3> subspace energy
                    ${data.prestigeGain.lt(100) ? "Next at " + format(data.prestigeNext, 0) + " space energy" : ""}
                `
            },
            unlocked() { return hasUpgrade("jac", 255) }, 
            canAfford() {
                return tmp[this.layer].buyables[this.id].prestigeGain.gte(1)},
            buy() { 
                let data = tmp[this.layer].buyables[this.id]
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(data.prestigeGain)

                if (!hasUpgrade("jac", 206)) {
                    doReset(this.layer, true)
                    player[this.layer].points = EN(0)
                    resetBuyableRow("jac", 10)
                    resetBuyableRow("jac", 11)
                    resetBuyableRow("jac", 12)
                }

            },
            style() {
                if (tmp[this.layer].buyables[this.id].canAfford) return {
                    "background-color": "#e8ffff"
                }
            },
        },
        135: {
            title() { return format(player[this.layer].buyables[this.id], 0)},
            prestigeGain () {
                let data = tmp[this.layer].buyables[this.id]
                if (hasUpgrade("jac", 246)) return player[this.layer].buyables[124].max(0).div(data.cost).log().div(Math.log(1.05)).root(1.05).sub(player[this.layer].buyables[this.id]).add(1).max(0).floor()
                return EN(data.prestigeNext.lte(player.jac.buyables[124]) ? 1 : 0)
            },
            prestigeNext () {
                let data = tmp[this.layer].buyables[this.id]
                if (hasUpgrade("jac", 246)) return data.cost.mul(EN.pow(1.05, player[this.layer].buyables[this.id].add(data.prestigeGain).pow(1.05)))
                return data.cost.mul(EN.pow(1.05, player[this.layer].buyables[this.id].pow(1.05)))
            },
            cost(x=player[this.layer].buyables[this.id]) {
                return EN(120)
            },
            effect(x=player[this.layer].buyables[this.id]) {
                x = softcap(x, EN(50), .5)
                let eff = EN.pow(1.05, x).mul(x.mul(0.12).add(1))
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return `hyper boosters

                    which are giving a ×${format(data.effect)} bonus to base Super Booster effect.

                    Reset previous progress for +<h3>${format(data.prestigeGain, 0)}</h3> hyper boosters
                    ${data.prestigeGain.lt(100) ? "Next at " + format(data.prestigeNext, 0) + " super boosters" : ""}
                `
            },
            unlocked() { return hasUpgrade("jac", 236) }, 
            canAfford() {
                return tmp[this.layer].buyables[this.id].prestigeGain.gte(1)},
            buy() { 
                let data = tmp[this.layer].buyables[this.id]
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(data.prestigeGain)

                if (!hasUpgrade("jac", 246)) {
                    doReset(this.layer, true)
                    player[this.layer].points = EN(0)
                    resetBuyableRow("jac", 10)
                    resetBuyableRow("jac", 11)
                    resetBuyableRow("jac", 12)
                }

            },
            style() {
                if (tmp[this.layer].buyables[this.id].canAfford) return {
                    "background-color": "#513d94"
                }
            },
        },
        141: {
            title() { return format(player[this.layer].buyables[this.id], 0)},
            prestigeMul () {
                let mul = EN(1)
                if (hasUpgrade("jac", 216)) mul = mul.mul(upgradeEffect("jac", 216).m)
                return mul
            },
            prestigeGain () {
                let data = tmp[this.layer].buyables[this.id]
                return player[this.layer].buyables[132].max(0).div(data.cost).pow(.008).mul(data.prestigeMul).floor()
            },
            prestigeNext () {
                let data = tmp[this.layer].buyables[this.id]
                return data.prestigeGain.add(1).div(data.prestigeMul).root(.008).mul(data.cost).ceil()
            },
            cost(x=player[this.layer].buyables[this.id]) {
                return EN("e420")
            },
            effect(x=player[this.layer].buyables[this.id]) {
                x = softcap(x, EN(100000), .2)
                let eff = x.times(6).add(1).pow(150)
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return `magic

                    which are giving a ×${format(data.effect)} bonus to Hindrance Spirit gain, Quirk gain, Solarity's Time Capsule effect and Subspace Energy effect.

                    Reset previous progress for +<h3>${format(data.prestigeGain, 0)}</h3> magic
                    ${data.prestigeGain.lt(100) ? "Next at " + format(data.prestigeNext, 0) + " hindrance spirit" : ""}
                `
            },
            unlocked() { return hasUpgrade("jac", 205) }, 
            canAfford() {
                return tmp[this.layer].buyables[this.id].prestigeGain.gte(1)},
            buy() { 
                let data = tmp[this.layer].buyables[this.id]
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(data.prestigeGain)

                doReset(this.layer, true)
                player[this.layer].points = EN(0)
                resetBuyableRow("jac", 10)
                resetBuyableRow("jac", 11)
                resetBuyableRow("jac", 12)
                resetBuyableRow("jac", 13)

            },
            style() {
                if (tmp[this.layer].buyables[this.id].canAfford) return {
                    "background-color": "#eb34c0"
                }
            },
        },
        142: {
            title() { return format(player[this.layer].buyables[this.id], 0)},
            prestigeMul () {
                let mul = EN(1)
                if (hasUpgrade("jac", 216)) mul = mul.mul(upgradeEffect("jac", 216).ba)
                return mul
            },
            prestigeGain () {
                let data = tmp[this.layer].buyables[this.id]
                return player[this.layer].buyables[131].max(0).div(data.cost).pow(.003).mul(data.prestigeMul).floor()
            },
            prestigeNext () {
                let data = tmp[this.layer].buyables[this.id]
                return data.prestigeGain.add(1).div(data.prestigeMul).root(.003).mul(data.cost).ceil()
            },
            cost(x=player[this.layer].buyables[this.id]) {
                return hasUpgrade("jac", 206) ? EN("e1200") : EN("e3600")
            },
            effect(x=player[this.layer].buyables[this.id]) {
                x = softcap(x, EN(100000), .2)
                let time = EN(player[this.layer].resetTime)
                let eff = {
                    ps: x.add(1).pow(time.add(1).log().pow(2)).pow(100),
                    ng: x.add(1).log().mul(time.add(1).log().pow(2)).div(10).add(1).sqrt()
                }
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return `balance energy

                    which are giving a ×${format(data.effect.ps)} bonus to Quirk effect and are multiplying Subspace Energy and Time Capsules in their effects by ${format(data.effect.ng)}×, slowly increases over this Jacorb reset.

                    Reset previous progress for +<h3>${format(data.prestigeGain, 0)}</h3> balance energy
                    ${data.prestigeGain.lt(100) ? "Next at " + format(data.prestigeNext, 0) + " quirks" : ""}
                `
            },
            unlocked() { return hasUpgrade("jac", 205) }, 
            canAfford() {
                return tmp[this.layer].buyables[this.id].prestigeGain.gte(1)},
            buy() { 
                let data = tmp[this.layer].buyables[this.id]
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(data.prestigeGain)

                doReset(this.layer, true)
                player[this.layer].points = EN(0)
                resetBuyableRow("jac", 10)
                resetBuyableRow("jac", 11)
                resetBuyableRow("jac", 12)
                resetBuyableRow("jac", 13)

            },
            style() {
                if (tmp[this.layer].buyables[this.id].canAfford) return {
                    "background-color": "#fced9f"
                }
            },
        },
        143: {
            title() { return format(player[this.layer].buyables[this.id], 0)},
            prestigeMul () {
                let mul = EN(1)
                return mul
            },
            prestigeGain () {
                let data = tmp[this.layer].buyables[this.id]
                return (hasUpgrade("aar", 201) ? player.jac.buyables[101] : buyableEffect("jac", 131)).add(1).log10().max(0).div(data.cost).pow(.01).mul(data.prestigeMul).sub(player[this.layer].buyables[this.id]).max(0).floor()
            },
            prestigeNext () {
                let data = tmp[this.layer].buyables[this.id]
                return EN.pow(10, data.prestigeGain.add(1).add(player[this.layer].buyables[this.id]).div(data.prestigeMul).root(.01).mul(data.cost)).sub(1).ceil()
            },
            cost(x=player[this.layer].buyables[this.id]) {
                return buyableEffect("jac", 131).log10().mul(1.01).max(1000000).min("e50")
            },
            effect(x=player[this.layer].buyables[this.id]) {
                x = softcap(x, EN(100000), .2)
                let time = EN(player[this.layer].resetTime)
                let eff = {
                    ps: x.add(1).pow(time.add(1).log().pow(2)).pow(100),
                    ng: x.add(1).log().mul(time.add(1).log().pow(2)).div(10).add(1).sqrt()
                }
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return `phantom souls

                    Currency.

                    Reset previous progress for +<h3>${format(data.prestigeGain, 0)}</h3> phantom souls
                    ${data.prestigeGain.lt(100) ? "Next at ×" + format(data.prestigeNext, 0) + (hasUpgrade("aar", 201) ? " prestige points" : " quirk effect") : ""}
                `
            },
            unlocked() { return hasUpgrade("jac", 205) || hasUpgrade("aar", 201) }, 
            canAfford() {
                return tmp[this.layer].buyables[this.id].prestigeGain.gte(1)},
            buy() { 
                let data = tmp[this.layer].buyables[this.id]
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(data.prestigeGain)

                doReset(this.layer, true)
                player[this.layer].points = EN(0)
                resetBuyableRow("jac", 10)
                resetBuyableRow("jac", 11)
                resetBuyableRow("jac", 12)
                resetBuyableRow("jac", 13)

            },
            style() {
                if (tmp[this.layer].buyables[this.id].canAfford) return {
                    "background-color": "#b38fbf"
                }
            },
        },
    },
    microtabs: {
        main: {
            "main": {
                title: "Main",
                content: [
                        ["blank", "10px"],
                        ["row", [["upgrade", 101], ["upgrade", 102], ["upgrade", 103], ["upgrade", 104]]],
                        ["blank", "10px"],
                        ["column", createUpgradeTable(2, 7, 7)],
                ],
            },
            "tpt": {
                unlocked() { return hasUpgrade("jac", 201) },
                title: "The Prestige Tree",
                content: [
                    ["blank", "10px"],
                    ["row", [["buyable", 101]]],
                    ["blank", "5px"],
                    ["row", [["buyable", 111], ["buyable", 112]]],
                    ["blank", "5px"],
                    ["row", [["buyable", 124], ["buyable", 121], ["buyable", 122], ["buyable", 123], ["buyable", 125]]],
                    ["blank", "5px"],
                    ["row", [["buyable", 135], ["buyable", 133], ["buyable", 132], ["buyable", 131], ["buyable", 134]]],
                    ["blank", "5px"],
                    ["row", [["buyable", 141], ["buyable", 143], ["buyable", 142]]],
                ]
            },
        },
    },
    update(delta) {
        if (hasUpgrade("jac", 211)) player[this.layer].points = player[this.layer].points.add(tmp[this.layer].resetGain.mul(hasUpgrade("jac", 212) ? 0.1 : 0.01).mul(delta))
        if (hasUpgrade("jac", 221)) player[this.layer].buyables[101] = player[this.layer].buyables[101].add(tmp[this.layer].buyables[101].prestigeGain.mul(hasUpgrade("jac", 212) ? 0.1 : 0.01).mul(delta))
        if (hasUpgrade("jac", 242)) player[this.layer].buyables[122] = player[this.layer].buyables[122].add(tmp[this.layer].buyables[122].prestigeGain.mul(hasUpgrade("jac", 212) ? 0.1 : 0.01).mul(delta))
        if (hasUpgrade("jac", 261)) player[this.layer].buyables[133] = player[this.layer].buyables[133].add(tmp[this.layer].buyables[133].prestigeGain.mul(0.1).mul(delta))
        if (hasUpgrade("jac", 263)) {
            player[this.layer].buyables[131] = player[this.layer].buyables[131].add(tmp[this.layer].buyables[131].prestigeGain.mul(0.1).mul(delta))
            player[this.layer].buyables[132] = player[this.layer].buyables[132].add(tmp[this.layer].buyables[132].prestigeGain.mul(0.1).mul(delta))
        }
        if (hasUpgrade("jac", 256)) {
            player[this.layer].buyables[141] = player[this.layer].buyables[141].max(tmp[this.layer].buyables[141].prestigeGain)
            player[this.layer].buyables[142] = player[this.layer].buyables[142].max(tmp[this.layer].buyables[142].prestigeGain)
        }
        if (hasUpgrade("jac", 224)) {
            buyBuyable("jac", 111), buyBuyable("jac", 112)
        }
        if (hasUpgrade("jac", 241)) {
            buyBuyable("jac", 121), buyBuyable("jac", 123)
        }
        if (hasUpgrade("jac", 244)) {
            buyBuyable("jac", 124)
        }
        if (hasUpgrade("jac", 225)) {
            buyBuyable("jac", 125)
        }
        if (hasUpgrade("jac", 206)) {
            buyBuyable("jac", 134)
        }
        if (hasUpgrade("jac", 246)) {
            buyBuyable("jac", 135)
        }
        if (hasUpgrade("aar", 213)) {
            player[this.layer].buyables[143] = player[this.layer].buyables[143].max(tmp[this.layer].buyables[143].prestigeGain)
        }
    },
    tabFormat: [
        "main-display",
        "prestige-button",
        ["blank", "10px"],
        ["microtabs", "main"],
        ["blank", "20px"],
    ],
    layerShown(){return true}
})
