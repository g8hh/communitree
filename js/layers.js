addLayer("jac", {
    name: "Jacorb",
    symbol: "J",
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
    gainMult() {
        mult = EN(1)
        if (hasUpgrade("jac", 104)) mult = mult.mul(upgradeEffect("jac", 104))
        return mult
    },
    gainExp() {
        return EN(1)
    },
    row: 0,
    hotkeys: [
        {key: "j", description: "J: Reset for Jacorb points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
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
                let eff = softcap(player.jac.points.div(2).add(2).pow(0.5), EN(1e9), 0.01)
                if (hasUpgrade("jac", 251)) eff = eff.mul(buyableEffect("jac", 111).mul(buyableEffect("jac", 112)).pow(0.02))
                if (hasUpgrade("jac", 252)) eff = eff.mul(buyableEffect("jac", 131).pow(10))
                if (hasUpgrade("jac", 253)) eff = eff.mul(buyableEffect("jac", 101).pow(0.02))
                if (hasUpgrade("jac", 254)) eff = eff.mul(buyableEffect("jac", 122).pp ? buyableEffect("jac", 122).pp.pow(0.1) : 1)
                return eff
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("jac", 101) },
        },
        103: {
            title: "Coding.",
            description: "Point gain is boosted by your points.",
            cost: EN(3),
            effect() {
                let eff = softcap(player.points.div(5).add(2).pow(0.4), EN(1e9), 0.01)
                if (hasUpgrade("jac", 251)) eff = eff.mul(buyableEffect("jac", 111).mul(buyableEffect("jac", 112)).pow(0.02))
                if (hasUpgrade("jac", 252)) eff = eff.mul(buyableEffect("jac", 131).pow(10))
                if (hasUpgrade("jac", 253)) eff = eff.mul(buyableEffect("jac", 101).pow(0.02))
                if (hasUpgrade("jac", 254)) eff = eff.mul(buyableEffect("jac", 122).pp ? buyableEffect("jac", 122).pp.pow(0.1) : 1)
                return eff
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("jac", 102) },
        },
        104: {
            title: "Release.",
            description: "Jacorb point gain is boosted by your points.",
            cost: EN(10),
            effect() {
                let eff = softcap(player.points.div(10).add(1).pow(0.25), EN(1e9), 0.01)
                if (hasUpgrade("jac", 251)) eff = eff.mul(buyableEffect("jac", 111).mul(buyableEffect("jac", 112)).pow(0.02))
                if (hasUpgrade("jac", 252)) eff = eff.mul(buyableEffect("jac", 131).pow(10))
                if (hasUpgrade("jac", 253)) eff = eff.mul(buyableEffect("jac", 101).pow(0.02))
                if (hasUpgrade("jac", 254)) eff = eff.mul(buyableEffect("jac", 122).pp ? buyableEffect("jac", 122).pp.pow(0.1) : 1)
                return eff
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
            unlocked() { return hasUpgrade("jac", 201) },
        },
        203: {
            title: "Let there be Light!",
            description: "Unlocks 3 new Prestige Tree layers.",
            cost: EN(1e65),
            currencyLocation() {return player[this.layer].buyables}, 
            currencyDisplayName: "prestige points",
            currencyInternalName: 101,
            unlocked() { return hasUpgrade("jac", 202) },
        },
        204: {
            title: "Let there be Light!",
            description: "Unlocks 3 new Prestige Tree layers.",
            cost: EN("e365000"),
            currencyLocation() {return player}, 
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("jac", 203) },
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
            unlocked() { return hasUpgrade("jac", 221) },
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
        221: {
            title: "Self-Prestige",
            description: "Gain 1% of your prestige points gain on reset every second.",
            cost: EN(100000000),
            unlocked() { return hasUpgrade("jac", 202) },
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
                return player[this.layer].points.div(data.cost).pow(0.5).mul(data.prestigeMul).floor()
            },
            prestigeNext () {
                let data = tmp[this.layer].buyables[this.id]
                return data.prestigeGain.add(1).div(data.prestigeMul).root(0.5).mul(data.cost)
            },
            cost(x=player[this.layer].buyables[this.id]) {
                return EN(20)
            },
            effect(x=player[this.layer].buyables[this.id]) {
                let eff = x.add(1).pow(0.75);
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
                if (hasUpgrade("jac", 213)) return player[this.layer].buyables[101].div(data.cost).log().div(Math.log(3)).root(1.25).sub(player[this.layer].buyables[this.id]).max(0).floor()
                return EN(data.prestigeNext.lt(player[this.layer].buyables[101]) ? 1 : 0)
            },
            prestigeNext () {
                let data = tmp[this.layer].buyables[this.id]
                if (hasUpgrade("jac", 213)) return data.cost.mul(EN.pow(3, player[this.layer].buyables[this.id].add(data.prestigeGain).add(1).pow(1.25)))
                return data.cost.mul(EN.pow(3, player[this.layer].buyables[this.id].pow(1.25)))
            },
            cost(x=player[this.layer].buyables[this.id]) {
                var cost = EN(20)
                if (hasUpgrade("jac", 232)) cost = cost.div(upgradeEffect("jac", 232))
                return cost.max("1e-308")
            },
            effect(x=player[this.layer].buyables[this.id]) {
                x = softcap(x, EN(200), 0.75)
                let bonus = buyableEffect("jac", 122).bg
                let mul = EN(2)
                if (hasUpgrade("jac", 231)) mul = mul.add(upgradeEffect("jac", 231))
                mul = mul.mul(buyableEffect("jac", 124))
                let eff = EN.pow(mul, x.add(bonus));
                if (EN.isFinite(eff)) return eff
                return EN(1)
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return `boosters

                    which are giving a ×${format(data.effect)} boost to prestige point gain. ${
                        data.cost.lte(1e-308) ? "\n(Note: Base costs are hardcapped at 1e-308 due to technical problems.)" : ""
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
                    player[this.layer].points = player[this.layer].buyables[101] = EN(0)
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
                if (hasUpgrade("jac", 213)) return player[this.layer].buyables[101].div(data.cost).log().div(Math.log(3)).root(1.25).sub(player[this.layer].buyables[this.id]).max(0).floor()
                return EN(data.prestigeNext.lt(player[this.layer].buyables[101]) ? 1 : 0)
            },
            prestigeNext () {
                let data = tmp[this.layer].buyables[this.id]
                if (hasUpgrade("jac", 213)) return data.cost.mul(EN.pow(3, player[this.layer].buyables[this.id].add(data.prestigeGain).add(1).pow(1.25)))
                return data.cost.mul(EN.pow(3, player[this.layer].buyables[this.id].pow(1.25)))
            },
            cost(x=player[this.layer].buyables[this.id]) {
                var cost = EN(20)
                if (hasUpgrade("jac", 232)) cost = cost.div(upgradeEffect("jac", 232))
                return cost.max("1e-308")
                return cost
            },
            effect(x=player[this.layer].buyables[this.id]) {
                x = softcap(x, EN(200), 0.75)
                let time = EN(player[this.layer].resetTime)
                let bonus = buyableEffect("jac", 122).bg
                if (hasUpgrade("jac", 222)) time = time.mul(5)
                if (hasUpgrade("jac", 233)) time = time.mul(upgradeEffect("jac", 233))
                if (hasUpgrade("jac", 243)) time = time.mul(100)
                time = softcap(time, EN(36000), .5)
                let eff = EN.pow(2, x.add(bonus)).pow(time.div(x.add(6).mul(5)).add(1).log(10)).max(1);
                return eff.mul(buyableEffect("jac", 131));
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
                    player[this.layer].points = player[this.layer].buyables[101] = EN(0)
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
                if (hasUpgrade("jac", 241)) return player[this.layer].buyables[101].div(data.cost).log().div(Math.log(1e25)).root(1.35).sub(player[this.layer].buyables[this.id]).max(0).floor()
                return EN(data.prestigeNext.lt(player.jac.points) ? 1 : 0)
            },
            prestigeNext () {
                let data = tmp[this.layer].buyables[this.id]
                if (hasUpgrade("jac", 241)) return data.cost.mul(EN.pow(1e25, player[this.layer].buyables[this.id].add(data.prestigeGain).add(1).pow(1.35)))
                return data.cost.mul(EN.pow(1e25, player[this.layer].buyables[this.id].pow(1.35)))
            },
            cost(x=player[this.layer].buyables[this.id]) {
                return EN(1e65)
            },
            effect(x=player[this.layer].buyables[this.id]) {
                x = softcap(x, EN(200), .75)
                let time = EN(player[this.layer].resetTime)
                let eff = EN.pow(1e9, x).pow(EN.sub(1, time.div(10).add(1).pow(-1))).max(1);
                return eff;
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
                    player[this.layer].points = player[this.layer].buyables[101] = 
                    player[this.layer].buyables[111] = player[this.layer].buyables[112] = EN(0)
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
                return player[this.layer].points.div(data.cost).pow(0.12).mul(data.prestigeMul).floor()
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
                    bg: x.add(1).log(10).pow(0.8)
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
                player[this.layer].points = player[this.layer].buyables[101] = 
                player[this.layer].buyables[111] = player[this.layer].buyables[112] = EN(0)

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
                if (hasUpgrade("jac", 241)) return player[this.layer].buyables[101].div(data.cost).log().div(Math.log(1e25)).root(1.35).sub(player[this.layer].buyables[this.id]).max(0).floor()
                return EN(data.prestigeNext.lt(player.jac.points) ? 1 : 0)
            },
            prestigeNext () {
                let data = tmp[this.layer].buyables[this.id]
                if (hasUpgrade("jac", 241)) return data.cost.mul(EN.pow(1e25, player[this.layer].buyables[this.id].add(data.prestigeGain).add(1).pow(1.35)))
                return data.cost.mul(EN.pow(1e25, player[this.layer].buyables[this.id].pow(1.35)))
            },
            cost(x=player[this.layer].buyables[this.id]) {
                return EN(1e65)
            },
            effect(x=player[this.layer].buyables[this.id]) {
                x = softcap(x, EN(200), .75)
                var gf = buyableEffect("jac", 112)
                let eff = {
                    ppp: EN.pow(gf.root(gf.add(1).log().div(20).add(0.2)), x)
                }
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
                    player[this.layer].points = player[this.layer].buyables[101] = 
                    player[this.layer].buyables[111] = player[this.layer].buyables[112] = EN(0)
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
                if (hasUpgrade("jac", 244)) return player[this.layer].buyables[111].div(data.cost).log().div(Math.log(1.05)).root(1.05).sub(player[this.layer].buyables[this.id]).max(0).floor()
                return EN(data.prestigeNext.lt(player.jac.buyables[111]) ? 1 : 0)
            },
            prestigeNext () {
                let data = tmp[this.layer].buyables[this.id]
                if (hasUpgrade("jac", 244)) return data.cost.mul(EN.pow(1.05, player[this.layer].buyables[this.id].add(data.prestigeGain).add(1).pow(1.05)))
                return data.cost.mul(EN.pow(1.05, player[this.layer].buyables[this.id].pow(1.05)))
            },
            cost(x=player[this.layer].buyables[this.id]) {
                return EN(800)
            },
            effect(x=player[this.layer].buyables[this.id]) {
                x = softcap(x, EN(100), 9)
                let eff = EN.pow(1.2, x)
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
                    player[this.layer].points = player[this.layer].buyables[101] = 
                    player[this.layer].buyables[111] = player[this.layer].buyables[112] = EN(0)
                }

            },
            style() {
                if (tmp[this.layer].buyables[this.id].canAfford) return {
                    "background-color": "#504899"
                }
            },
        },
        131: {
            title() { return format(player[this.layer].buyables[this.id], 0)},
            prestigeGain () {
                let data = tmp[this.layer].buyables[this.id]
                //if (hasUpgrade("jac", 213)) return player[this.layer].buyables[101].div(data.cost).log().div(ExpantaNum.log("1e2500")).root(1.25).sub(player[this.layer].buyables[this.id]).max(0).floor()
                return EN(data.prestigeNext.lt(buyableEffect("jac", 112)) ? 1 : 0)
            },
            prestigeNext () {
                let data = tmp[this.layer].buyables[this.id]
                //if (hasUpgrade("jac", 213)) return data.cost.mul(EN.pow("1e2500", player[this.layer].buyables[this.id].add(data.prestigeGain).add(1).pow(1.25)))
                return data.cost.mul(EN.pow("1e2500", player[this.layer].buyables[this.id].pow(1.25)))
            },
            cost(x=player[this.layer].buyables[this.id]) {
                return EN("1e720")
            },
            effect(x=player[this.layer].buyables[this.id]) {
                let time = EN(player[this.layer].resetTime)
                let eff = EN.pow(time.add(1), x.mul(x.mul(5).add(5)))
                return eff;
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
                player[this.layer].points = player[this.layer].buyables[101] = 
                player[this.layer].buyables[111] = player[this.layer].buyables[112] = 
                player[this.layer].buyables[121] = player[this.layer].buyables[122] = 
                player[this.layer].buyables[123] = player[this.layer].buyables[124] = EN(0)

            },
            style() {
                if (tmp[this.layer].buyables[this.id].canAfford) return {
                    "background-color": "#c20282"
                }
            },
        },
    },
    microtabs: {
        main: {
            "Main": {
                content: [
                    ["blank", "10px"],
                    ["row", [["upgrade", 101], ["upgrade", 102], ["upgrade", 103], ["upgrade", 104]]],
                    ["blank", "10px"],
                    ["row", [["upgrade", 201], ["upgrade", 202], ["upgrade", 203], ["upgrade", 204]]],
                    ["row", [["upgrade", 211], ["upgrade", 212], ["upgrade", 213], ["upgrade", 214]]],
                    ["row", [["upgrade", 221], ["upgrade", 222], ["upgrade", 223], ["upgrade", 224]]],
                    ["row", [["upgrade", 231], ["upgrade", 232], ["upgrade", 233], ["upgrade", 234]]],
                    ["row", [["upgrade", 241], ["upgrade", 242], ["upgrade", 243], ["upgrade", 244]]],
                    ["row", [["upgrade", 251], ["upgrade", 252], ["upgrade", 253], ["upgrade", 254]]],
                ]
            },
            "Prestige Tree": {
                unlocked() { return hasUpgrade("jac", 201) },
                content: [
                    ["blank", "10px"],
                    ["row", [["buyable", 101]]],
                    ["row", [["buyable", 111], ["buyable", 112]]],
                    ["row", [["buyable", 124], ["buyable", 121], ["buyable", 122], ["buyable", 123]]],
                    ["row", [["buyable", 131]]],
                ]
            },
        },
    },
    update(delta) {
        if (hasUpgrade("jac", 211)) player[this.layer].points = player[this.layer].points.add(tmp[this.layer].resetGain.mul(hasUpgrade("jac", 212) ? 0.1 : 0.01).mul(delta))
        if (hasUpgrade("jac", 221)) player[this.layer].buyables[101] = player[this.layer].buyables[101].add(tmp[this.layer].buyables[101].prestigeGain.mul(hasUpgrade("jac", 212) ? 0.1 : 0.01).mul(delta))
        if (hasUpgrade("jac", 242)) player[this.layer].buyables[122] = player[this.layer].buyables[122].add(tmp[this.layer].buyables[122].prestigeGain.mul(hasUpgrade("jac", 212) ? 0.1 : 0.01).mul(delta))
        if (hasUpgrade("jac", 224)) {
            buyBuyable("jac", 111), buyBuyable("jac", 112)
        }
        if (hasUpgrade("jac", 241)) {
            buyBuyable("jac", 121), buyBuyable("jac", 123)
        }
        if (hasUpgrade("jac", 244)) {
            buyBuyable("jac", 124)
        }
    },
    tabFormat: [
        "main-display",
        "prestige-button",
        ["blank", "10px"],
        ["microtabs", "main"],
    ],
    layerShown(){return true}
})
