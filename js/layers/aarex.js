

addLayer("aar", {
    name: "Aarex",
    symbol: "A",

    row: 1,
    displayRow: 0,
    position: 1,
    branches: ["jac"],
    layerShown() { return player.aar.best.gt(0) },

    startData() { return {
        unlocked: true,
		points: EN(0),
        best: EN(0),
        bal: EN(0),

        dimPoints: EN(0),
        dims: [EN(1), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0)],
        dimMults: [EN(1), EN(1), EN(1), EN(1), EN(1), EN(1), EN(1), EN(1), EN(1), EN(1)],
    }},
    color: "#fff9ab",
    nodeStyle: {
        background: "linear-gradient(85deg, #fbef53, #ffffff, #68e8f4)",
        "background-origin": "border-box",
    },
    componentStyles: {
        "upgrade": () => this.nodeStyle,
        "buyable": () => this.nodeStyle,
        "tab-button": () => this.nodeStyle,
        "prestige-button": () => this.nodeStyle,
    },
    requires: EN(1),
    resource: "Aarex points",
    baseResource: "phantom souls",
    baseAmount() {return player.jac.buyables[143]},
    type: "normal",
    exponent: 0.4,
    roundUpCost: true,

    resetsNothing() {
        return hasUpgrade("aar", 214)
    },
    hotkeys: [
        {
            key: "a", 
            description: "A: Reset for Aarex points", 
            unlocked() {return tmp[this.layer].layerShown },
            onPress(){ if (canReset(this.layer)) doReset(this.layer) }
        },
    ],

    effect() {
        let prod = player.aar.points.gte(1) ? EN.pow(3, softcap(player.aar.points.sub(1), EN(100), 0.5)) : EN(0)
        for (let a = 111; a <= 114; a++) if (hasUpgrade("aar", a)) prod = prod.mul(upgradeEffect("aar", a))
        let eff = {
            balProd: prod,
            genMult: player.aar.dimPoints.div(1000).add(1).pow(player.aar.dimPoints.add(1).log().pow(hasUpgrade("aar", 252) ? 23 : 1).div(100).max(10)).pow(buyableEffect("aar", 111))
        }
        if (hasUpgrade("aar", 231)) eff.genMult = eff.genMult.pow(buyableEffect("aar", 112))
        if (hasUpgrade("aar", 244)) eff.genMult = eff.genMult.pow(buyableEffect("aar", 113))
        if (hasUpgrade("aar", 255)) eff.genMult = EN.pow(10, eff.genMult.add(1).log10().pow(player.aar.dimPoints.add(1).log10().add(1).pow(0.5)))
        return eff
    },
    
    upgrades: {
        101: {
            title: "Start... again.",
            description: "10× point gain per second. You gain points regardless of the first upgrade.",
            cost: EN(10),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "Aarex balancing",
            currencyInternalName: "bal",
        },
        102: {
            title: "To Grow.",
            description: "Raises the Prestige Point effect / Prestige Point from ^0.75 to ^1.",
            cost: EN(120),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "Aarex balancing",
            currencyInternalName: "bal",
            unlocked() { return player.aca.best.lte(0) }
        },
        103: {
            title: "Is this just a Timewall?",
            description: "Aarex balancing plus 1 boosts point gain.",
            cost: EN(600),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "Aarex balancing",
            currencyInternalName: "bal",
            unlocked() { return player.aca.best.lte(0) }
        },
        104: {
            title: "Wow this isn't worth it",
            description: "Aarex balancing plus 1 boosts Jacorb point gain.",
            cost: EN(1200),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "Aarex balancing",
            currencyInternalName: "bal",
            unlocked() { return player.aca.best.lte(0) }
        },
        111: {
            title: "Let's",
            description: "Points boost Aarex balancing gain.",
            cost() {
                let cost = 600
                let ugs = 3
                for (let a = 111; a <= 114; a++) if (hasUpgrade("aar", a)) {
                    cost *= ugs
                    ugs += ugs - 1
                }
                return EN(cost)
            },
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "Aarex balancing",
            currencyInternalName: "bal",
            effect() {
                let eff = player.points.add(1).log10().add(1).log10().add(1)
                return eff
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("aar", 104) },
        },
        112: {
            title: "speed",
            description: "Jacorb points boost Aarex balancing gain.",
            cost() {
                let cost = 600
                let ugs = 3
                for (let a = 111; a <= 114; a++) if (hasUpgrade("aar", a)) {
                    cost *= ugs
                    ugs += ugs - 1
                }
                return EN(cost)
            },
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "Aarex balancing",
            currencyInternalName: "bal",
            effect() {
                let eff = player.jac.points.add(1).log10().mul(2).add(1).log10().add(1)
                return eff
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("aar", 104) },
        },
        113: {
            title: "things",
            description: "Prestige points boost Aarex balancing gain.",
            cost() {
                let cost = 600
                let ugs = 3
                for (let a = 111; a <= 114; a++) if (hasUpgrade("aar", a)) {
                    cost *= ugs
                    ugs += ugs - 1
                }
                return EN(cost)
            },
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "Aarex balancing",
            currencyInternalName: "bal",
            effect() {
                let eff = player.jac.buyables[101].div(2).add(1).log10().mul(1.5).add(1).log10().add(1)
                return eff
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("aar", 104) },
        },
        114: {
            title: "up",
            description: "Aarex balancing boosts Aarex balancing gain.",
            cost() {
                let cost = 600
                let ugs = 3
                for (let a = 111; a <= 114; a++) if (hasUpgrade("aar", a)) {
                    cost *= ugs
                    ugs += ugs - 1
                }
                return EN(cost)
            },
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "Aarex balancing",
            currencyInternalName: "bal",
            effect() {
                let eff = player.aar.bal.add(1).log10().add(1)
                return eff
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("aar", 104) },
        },
        121: {
            title: "Remove",
            description: "Removes <b>Initialize</b>'s softcaps.",
            cost: EN(1000000),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "Aarex balancing",
            currencyInternalName: "bal",
            unlocked() { for (let a = 111; a <= 114; a++) if (!hasUpgrade("aar", a)) return false; return true },
        },
        122: {
            title: "all",
            description: "Removes <b>Coding</b>'s softcaps.",
            cost: EN(1000000),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "Aarex balancing",
            currencyInternalName: "bal",
            unlocked() { for (let a = 111; a <= 114; a++) if (!hasUpgrade("aar", a)) return false; return true },
        },
        123: {
            title: "these",
            description: "Removes <b>Release</b>'s softcaps.",
            cost: EN(1000000),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "Aarex balancing",
            currencyInternalName: "bal",
            unlocked() { for (let a = 111; a <= 114; a++) if (!hasUpgrade("aar", a)) return false; return true },
        },
        124: {
            title: "softcaps",
            description: "Removes Booster and Generator amount softcap in their effect.",
            cost: EN(1000000),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "Aarex balancing",
            currencyInternalName: "bal",
            unlocked() { for (let a = 111; a <= 114; a++) if (!hasUpgrade("aar", a)) return false; return true },
        },
        201: {
            title: "Simplify Things a Bit",
            description: `
                You unlock Phantom Souls immediately, but you lose the ability to unlock other previous layers besides 
                Phantom Souls and Prestige Points and most of the upgrades after <b>The Prestige Tree</b>. In exchange,
                your point production is MASSIVELY boosted based on Jacorb reset time, Aarex reset time and Aarex 
                balancing. You also now gain Phantom Souls based on Prestige Points instead of Quirk effect.<br/>
            `,
            cost: EN(3),
            onPurchase() { doReset("aar", true) },
            unlocked() { return player.aar.best.gte(2) },
            effect() {
                let time = EN(player[this.layer].resetTime)
                if (hasUpgrade("aar", 206)) time = EN.pow(1024, EN.pow(1024, time))

                let jTime = EN(player.jac.resetTime)
                if (hasUpgrade("aar", 211)) jTime = jTime.mul(player.aar.bal.add(1).log10().add(1))
                if (hasUpgrade("aar", 207)) jTime = jTime.pow(33554432)

                let eff = EN.pow(time.add(1), time.div(10)).pow(jTime.add(1).log10().pow(3)).pow(0.5)

                let bal = player.aar.bal.add(1)
                let pow = EN(1)
                if (hasUpgrade("aar", 202)) pow = pow.mul(pow).mul(tmp.aar.upgrades[202].cost)
                if (hasUpgrade("aar", 203)) pow = pow.mul(pow).mul(tmp.aar.upgrades[203].cost)
                if (hasUpgrade("aar", 204)) pow = pow.mul(pow).mul(tmp.aar.upgrades[204].cost)
                if (hasUpgrade("aar", 205)) pow = pow.mul(pow).mul(tmp.aar.upgrades[205].cost)

                return bal.pow(pow).pow(eff)
            },
            effectDisplay() { return "<h2>×" + format(this.effect()) + "</h2>" },
            style: { width: "240px", "min-height": "240px" }
        },
        202: {
            title: "Binary-googol",
            description: "Raise the amount of Aarex balancing in <b>Simplify Things a Bit</b>'s formula to cost of upgrade.",
            cost: EN.pow(2, 100),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "Aarex balancing",
            currencyInternalName: "bal",
            unlocked() { return hasUpgrade("aar", 201) && player.aca.best.lte(0) },
        },
        203: {
            title: "Apocalyptetra",
            description: "Raise the amount of Aarex balancing in <b>Simplify Things a Bit</b>'s formula to cost of upgrade and previous ones.",
            cost: EN.pow(4, 96),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "Aarex balancing",
            currencyInternalName: "bal",
            unlocked() { return hasUpgrade("aar", 201) && player.aca.best.lte(0) },
        },
        204: {
            title: "200-noogol",
            description: "Raise the amount of Aarex balancing in <b>Simplify Things a Bit</b>'s formula to cost of upgrade and previous ones.",
            cost: EN("e200"),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "Aarex balancing",
            currencyInternalName: "bal",
            unlocked() { return hasUpgrade("aar", 201) && player.aca.best.lte(0) },
        },
        205: {
            title: "Mlastomillion",
            description: "Raise the amount of Aarex balancing in <b>Simplify Things a Bit</b>'s formula to cost of upgrade and previous ones.",
            cost: EN("e3003"),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "Aarex balancing",
            currencyInternalName: "bal",
            unlocked() { return hasUpgrade("aar", 201) && player.aca.best.lte(0) },
        },
        206: {
            title: "Binary-doocol",
            description: "Turn Aarex time in <b>Simplify Things a Bit</b>'s formula into 1024^1024^x. Resets Aarex time.",
            cost: EN("eeee120"),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "Aarex balancing",
            currencyInternalName: "bal",
            onPurchase() { player.aar.resetTime = 0 },
            unlocked() { return hasUpgrade("aar", 214) },
        },
        207: {
            title: "Binary-qoofol",
            description: "Turn Jacorb time in <b>Simplify Things a Bit</b>'s formula into x^33,554,432. Resets Jacorb time.",
            cost: EN("eeee360"),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "Aarex balancing",
            currencyInternalName: "bal",
            onPurchase() { player.jac.resetTime = 0 },
            unlocked() { return hasUpgrade("aar", 214) },
        },
        211: {
            title: "Balancing Power",
            description: "Multiplies Jacorb reset time in <b>Simplify Things a Bit</b>'s formula by OOMs of Aarex balancing + 1.",
            cost: EN("e180"),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "Aarex balancing",
            currencyInternalName: "bal",
            unlocked() { return hasUpgrade("aar", 201) && player.aca.best.lte(0) },
        },
        212: {
            title: "Upgrade-Automator",
            description: "Automates buying upgrades.",
            cost: EN("e600"),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "Aarex balancing",
            currencyInternalName: "bal",
            unlocked() { return hasUpgrade("aar", 201) && player.aca.best.lte(0) },
        },
        213: {
            title: "Soul-Automator",
            description: "Automates getting Phantom Soul gain on reset.",
            cost: EN("eee3000"),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "Aarex balancing",
            currencyInternalName: "bal",
            unlocked() { return hasUpgrade("aar", 201) && player.aca.best.lte(0) },
        },
        214: {
            title: "Large Number Convention",
            description: "Aarex reset no longer resets anything.",
            cost: EN("eeee25"),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "Aarex balancing",
            currencyInternalName: "bal",
            unlocked() { return hasUpgrade("aar", 201) && player.aca.best.lte(0) },
        },
        215: {
            title: "Aarex Point Generator",
            description: "Automatically gain Aarex points, as if you do a manual reset each second.",
            cost: EN("eeee75"),
            currencyLocation() {return player[this.layer]}, 
            currencyDisplayName: "Aarex balancing",
            currencyInternalName: "bal",
            unlocked() { return hasUpgrade("aar", 214) },
        },
        221: {
            title: "Aarex Dimensions",
            description: "Unlocks the Aarex Dimensions tab.",
            cost: EN("eee1000"),
            unlocked() { return hasUpgrade("aar", 207) },
            style() { 
                return hasUpgrade("aar", 221) ? { 
                    "margin-right": "0px",
                } : {
                    width: "600px",
                    "margin-right": "-480px",
                }
            }
        },
        222: {
            title: "Aarex Dimensional Boost",
            description: "Unlocks Aarex Dimensional Boost.",
            cost: EN("eeee48"),
            unlocked() { return hasUpgrade("aar", 207) },
            style() { 
                return hasUpgrade("aar", 221) ? { 
                } : {
                    "min-height": "0px",
                    "max-height": "0px",
                    opacity: "0.00001",
                    "z-index": "-1",
                    "pointer-events": "none",
                }
            }
        },
        223: {
            title: "Is this Antimatter Dimensions but with... TEN DIMENSIONS?",
            description: "Unlocks Sacrifice.",
            cost: EN("eeee42000"),
            unlocked() { return hasUpgrade("aar", 207) },
            style() { 
                return hasUpgrade("aar", 221) ? { 
                } : {
                    "min-height": "0px",
                    "max-height": "0px",
                    opacity: "0.00001",
                    "z-index": "-1",
                    "pointer-events": "none",
                }
            }
        },
        224: {
            title: "Aarex Galaxy",
            description: "Resets all progress in Aarex Dimensions, but multiplier per buy 1.05× → 1.065×",
            cost: EN("eeee132000"),
            unlocked() { return hasUpgrade("aar", 207) },
            onPurchase() {
                player.aar.dimPoints = EN(0)
                player.aar.dims = [EN(1), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0)]
                player.aar.dimMults = [EN(1), EN(1), EN(1), EN(1), EN(1), EN(1), EN(1), EN(1), EN(1), EN(1)]
                for (let a = 100; a < 110; a++)
                    player.aar.buyables[a] = EN(0)
                player.aar.buyables[111] = player.aar.buyables[112] = ExpantaNumZero
            },
            style() { 
                return hasUpgrade("aar", 221) ? { 
                } : {
                    "min-height": "0px",
                    "max-height": "0px",
                    opacity: "0.00001",
                    "z-index": "-1",
                    "pointer-events": "none",
                }
            }
        },
        225: {
            title: "Why is this this far?",
            description: "Unlocks Tickspeed.",
            cost: EN("eeee4200000"),
            unlocked() { return hasUpgrade("aar", 207) },
            style() { 
                return hasUpgrade("aar", 221) ? { 
                } : {
                    "min-height": "0px",
                    "max-height": "0px",
                    opacity: "0.00001",
                    "z-index": "-1",
                    "pointer-events": "none",
                }
            }
        },
        231: {
            title: "Ok I'm bored now",
            description: "Sacrifice Multiplier boosts all dimensions and dimension point effect's exponent.",
            cost: EN("eeee250000000"),
            unlocked() { return hasUpgrade("aar", 225) },
        },
        232: {
            title: "Hey, who brought repetitivity?",
            description: "Automates buying max.",
            cost: EN("eeeee12"),
            unlocked() { return hasUpgrade("aar", 231) },
        },
        233: {
            title: "Sacrifice Booster",
            description: "Each tickspeed boost makes sacrifice better, up to 10 of them.",
            cost: EN("eeeee13.5"),
            unlocked() { return hasUpgrade("aar", 232) },
        },
        234: {
            title: "Sacrifice Booster II",
            description: "Each dimensional boost makes sacrifice better.",
            cost: EN("eeeee14.2"),
            unlocked() { return hasUpgrade("aar", 233) },
        },
        235: {
            title: "Aarex Distant Galaxy",
            description: "Resets dimensional boosts, but multiplier per buy 1.065× → 1.07×",
            cost: EN("eeeee16.25"),
            unlocked() { return hasUpgrade("aar", 234) },
            onPurchase() {
                player.aar.dimPoints = EN(0)
                player.aar.dims = [EN(1), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0)]
                player.aar.dimMults = [EN(1), EN(1), EN(1), EN(1), EN(1), EN(1), EN(1), EN(1), EN(1), EN(1)]
                for (let a = 100; a < 110; a++)
                    player.aar.buyables[a] = EN(0)
                player.aar.buyables[111] = player.aar.buyables[112] = ExpantaNumZero
            },
        },
        241: {
            title: "Cost of Things",
            description: "Dimensions are boosted by ^0.01 of its cost.",
            cost: EN("eeeee20"),
            unlocked() { return hasUpgrade("aar", 235) },
        },
        242: {
            title: "No Longer a Sacrifice",
            description: "You gain 10% of your remaining Sacrifice Multiplier per second.",
            cost: EN("eeeee25"),
            unlocked() { return hasUpgrade("aar", 235) },
        },
        243: {
            title: "The Long Awaited Upgrade",
            description: "Dimensional Boosts no longer reset.",
            cost: EN("eeeee30"),
            unlocked() { return hasUpgrade("aar", 235) },
        },
        244: {
            title: "Tickspeed^2",
            description: "Tickspeed Boosts boost all dimensions and dimension point effect's exponent.",
            cost: EN("eeeee35"),
            unlocked() { return hasUpgrade("aar", 235) },
        },
        245: {
            title: "Ticksped",
            description: "Tickspeed Boosts no longet reset.",
            cost: EN("eeeee50"),
            unlocked() { return hasUpgrade("aar", 235) },
        },
        251: {
            title: "Aarex Remote Galaxy",
            description: "Resets everything in Aarex Dimensions, but multiplier per buy 1.07× → 1.072×",
            cost: EN("eeeee56"),
            unlocked() { return hasUpgrade("aar", 245) },
            onPurchase() {
                player.aar.dimPoints = EN(0)
                player.aar.dims = [EN(1), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0)]
                player.aar.dimMults = [EN(1), EN(1), EN(1), EN(1), EN(1), EN(1), EN(1), EN(1), EN(1), EN(1)]
                for (let a = 100; a < 110; a++)
                    player.aar.buyables[a] = EN(0)
                player.aar.buyables[111] = player.aar.buyables[112] = player.aar.buyables[113] = ExpantaNumZero
            },
        },
        252: {
            title: "Reverse Process",
            description: "Apply ^3 to DP's exponent in the effect formula. Aarex balancing boost all dims.",
            cost: EN("eeeee68.48"),
            unlocked() { return hasUpgrade("aar", 245) },
            effect() {
                let p = player.aar.bal.add(1).slog()
                let eff = p.add(1).pow(p)
                return eff
            },
            effectDisplay() { return "×" + format(this.effect()) },
        },
        253: {
            title: "Dimension Boost Boost",
            description: "Dimension Boosts works as if you have x^1.2 of them.",
            cost: EN("eeeee168"),
            unlocked() { return hasUpgrade("aar", 245) },
        },
        254: {
            title: "Tickspeed Boost Boost",
            description: "Tickspeed Boosts works as if you have 2x^1.2 of them.",
            cost: EN("eeeee320"),
            unlocked() { return hasUpgrade("aar", 245) },
        },
        255: {
            title: "Last Hurrah",
            description: "Boosts DP's effect and all dimensions by the square root of DP's exponent.",
            cost: EN("eeeee960"),
            unlocked() { return hasUpgrade("aar", 245) },
        },
        261: {
            title: "Almost There",
            description: "Resets everything in Aarex Dimensions, but multiplier per buy 1.072× → 1.075×",
            cost: EN("eeeee346153"),
            unlocked() { return hasUpgrade("aar", 255) },
            onPurchase() {
                player.aar.dimPoints = EN(0)
                player.aar.dims = [EN(1), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0)]
                player.aar.dimMults = [EN(1), EN(1), EN(1), EN(1), EN(1), EN(1), EN(1), EN(1), EN(1), EN(1)]
                for (let a = 100; a < 110; a++)
                    player.aar.buyables[a] = EN(0)
                player.aar.buyables[111] = player.aar.buyables[112] = player.aar.buyables[113] = ExpantaNumZero
            },
        },
        262: {
            title: "Inflation Time",
            description: "Resets everything in Aarex Dimensions, but multiplier per buy 1.075× → 1.08×",
            cost: EN("eeeee1076500"),
            unlocked() { return hasUpgrade("aar", 261) },
            onPurchase() {
                player.aar.dimPoints = EN(0)
                player.aar.dims = [EN(1), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0)]
                player.aar.dimMults = [EN(1), EN(1), EN(1), EN(1), EN(1), EN(1), EN(1), EN(1), EN(1), EN(1)]
                for (let a = 100; a < 110; a++)
                    player.aar.buyables[a] = EN(0)
                player.aar.buyables[111] = player.aar.buyables[112] = player.aar.buyables[113] = ExpantaNumZero
            },
        },
        263: {
            title: "Boosting in Bulk",
            description: "You gain 1.2× of your boosts on click.",
            cost: EN("eeeee10000000"),
            unlocked() { return hasUpgrade("aar", 262) },
        },
        264: {
            title: "Still Haven't Enough?",
            description: "Resets everything in Aarex Dimensions, but multiplier per buy 1.08× → 1.1×",
            cost: EN("eeeee250000000"),
            unlocked() { return hasUpgrade("aar", 261) },
            onPurchase() {
                player.aar.dimPoints = EN(0)
                player.aar.dims = [EN(1), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0)]
                player.aar.dimMults = [EN(1), EN(1), EN(1), EN(1), EN(1), EN(1), EN(1), EN(1), EN(1), EN(1)]
                for (let a = 100; a < 110; a++)
                    player.aar.buyables[a] = EN(0)
                player.aar.buyables[111] = player.aar.buyables[112] = player.aar.buyables[113] = ExpantaNumZero
            },
        },
        265: {
            title: "Boosting Immensely",
            description: "Resets everything in Aarex Dimensions, but multiplier per buy 1.1× → 2×",
            cost: EN("eeeeee10.9"),
            unlocked() { return hasUpgrade("aar", 261) },
            onPurchase() {
                player.aar.dimPoints = EN(0)
                player.aar.dims = [EN(1), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0)]
                player.aar.dimMults = [EN(1), EN(1), EN(1), EN(1), EN(1), EN(1), EN(1), EN(1), EN(1), EN(1)]
                for (let a = 100; a < 110; a++)
                    player.aar.buyables[a] = EN(0)
                player.aar.buyables[111] = player.aar.buyables[112] = player.aar.buyables[113] = ExpantaNumZero
            },
        },
    },

    update(delta) {
        player.aar.bal = player.aar.bal.add(tmp[this.layer].effect.balProd.mul(delta))
        
        // Attempt to do linear interpolation for upgrade 215 "Aarex Point Generator"
        if (hasUpgrade("aar", 215)) {
            if (tmp[this.layer].effect.genMult.gte(1e9))
                player.aar.points = player.aar.points.max(EN.tetr(10, 3, tmp[this.layer].effect.genMult.div(5)));
            else {
                let data = tmp.jac.buyables[143]
                let end = upgradeEffect("aar", 201).add(1).log10().div(data.cost).pow(.01).mul(data.prestigeMul).pow(0.4).floor()
                let nEnd = end.iteratedlog(10, EN(3))
                let start = player.aar.points
                let nStart = start.iteratedlog(10, EN(3))
                if (start.lt(end) && nStart.isFinite() && nEnd.isFinite()) {
                    let nDelta = nEnd.sub(nStart)
                    player.aar.points = EN.tetr(10, 3, nStart.add(nDelta.mul(delta).mul(tmp.aar.effect.genMult)))
                }
            }
        }

        // Aarex Dimensions
        if (hasUpgrade("aar", 221) && player.aca.best.lte(0)) {
            player.aar.dimPoints = player.aar.dimPoints.add(buyableEffect("aar", 100).mul(player.aar.dims[0]).mul(delta))
            for (let a = 1; a < 10; a++) {
                player.aar.dims[a-1] = player.aar.dims[a-1].add(buyableEffect("aar", 100 + a).mul(buyableEffect("aar", 113)).mul(player.aar.dims[a]).mul(delta))
            }
            if (hasUpgrade("aar", 232)) clickClickable("aar", 111)
            if (hasUpgrade("aar", 242)) player.aar.buyables[112] = player.aar.buyables[112].add(tmp.aar.buyables[112].cost.sub(player.aar.buyables[112]).max(0).mul(1 - 0.9 ** delta))
        }
    },

    buyables: {
        ...(function() {
            let b = {};
            for (let a = 100; a < 110; a++) {
                b[a] = {
                    effect() {
                        let i = this.id - 100
                        let mul = 1.05
                             if (hasUpgrade("aar", 265)) mul = 2
                        else if (hasUpgrade("aar", 264)) mul = 1.1
                        else if (hasUpgrade("aar", 262)) mul = 1.08
                        else if (hasUpgrade("aar", 261)) mul = 1.075
                        else if (hasUpgrade("aar", 251)) mul = 1.072
                        else if (hasUpgrade("aar", 235)) mul = 1.07
                        else if (hasUpgrade("aar", 224)) mul = 1.065
                        let eff = EN.pow(mul, player[this.layer].buyables[this.id].sub(1).max(0)).mul(buyableEffect("aar", 111).div(EN.pow(2, i)).max(1))
                        if (i == 9 || hasUpgrade("aar", 231)) eff = eff.mul(buyableEffect("aar", 112))
                        if (hasUpgrade("aar", 241)) eff = eff.mul(tmp[this.layer].buyables[this.id].cost.pow(0.01))
                        if (hasUpgrade("aar", 244)) eff = eff.mul(buyableEffect("aar", 113))
                        if (hasUpgrade("aar", 252)) eff = eff.mul(upgradeEffect("aar", 252))
                        if (hasUpgrade("aar", 255)) eff = eff.mul(player.aar.dimPoints.add(1).log(10).add(1).pow(0.5))
                        
                        return eff
                    },
                    cost() {
                        let i = this.id - 99
                        return EN.pow(2, i * i).mul(5).mul(EN.pow(1.45 + i * i * 0.05, player[this.layer].buyables[this.id]))
                    },
                    unlocked() {
                        let i = this.id - 100
                        return player.aar.buyables[111].add(3).gte(i)
                    },
                    canAfford() {
                        return player.aar.dimPoints.gte(this.cost())
                    },
                    display() {
                        return (player.aar.buyables[this.id].gte(1) ? "Buy one<br/>" : "Unlock for ") + format(this.cost())
                    },
                    buy() {
                        let i = this.id - 100
                        player.aar.dimPoints = player.aar.dimPoints.sub(this.cost()).max(0)
                        player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                        player.aar.dims[i] = player.aar.dims[i].add(1)
                    },
                    style() { 
                        return player.aar.buyables[this.id].gte(1) ? {
                            width: '100px', 
                            height: '35px', 
                            "margin-left": '0px', 
                        } : {
                            width: '385px', 
                            height: '35px', 
                            "margin-left": '-285px', 
                        }
                    }
                }
            }
            return b
        })(),
        111: {
            title() {
                return formatWhole(player[this.layer].buyables[this.id])
            }, 
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return `dimensional boosts
                
                which are giving a base ×${format(data.effect)} boost to dimensions and dimension point effect's exponent and unlocking ${formatWhole(player[this.layer].buyables[this.id].min(6))}/6 more dimensions<br/>
                (boost is divided by 2 every further dimension, down to a minimum of 1×)
                
                Requires ${format(data.cost.amt)} dimension ${data.cost.dim + 1}`
            },
            unlocked() {
                return hasUpgrade("aar", 222)
            },
            effect() {
                var x = player[this.layer].buyables[this.id]
                if (hasUpgrade("aar", 253)) x = x.pow(1.2)
                return EN.pow(2, x)
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                return {
                    dim: +(x.add(3).min(9).floor()),
                    amt: x.sub(6).max(0).mul(x.sub(7).add(12)).add(x).add(6)
                }
            },
            canAfford() {
                let cost = this.cost()
                return player.aar.dims[cost.dim].gte(cost.amt)
            },
            buy() {
                if (!hasUpgrade("aar", 243)) {
                    player.aar.dimPoints = EN(0)
                    player.aar.dims = [EN(1), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0)]
                    player.aar.dimMults = [EN(1), EN(1), EN(1), EN(1), EN(1), EN(1), EN(1), EN(1), EN(1), EN(1)]
                    for (let a = 100; a < 110; a++)
                        player.aar.buyables[a] = EN(0)
                    player.aar.buyables[112] = ExpantaNumZero
                }

                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).mul(hasUpgrade("aar", 263) ? 1.2 : 1)
            }
        },
        112: {
            title() {
                return "×" + format(tmp[this.layer].buyables[this.id].effect)
            }, 
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return `sacrifice multiplier
                
                which are multipling dimension 10 efficiency by the same amount.
                
                Reset all dimensions except dimension 10's amount for a <h3>×${format(data.cost.div(data.effect).max(1))}</h3> increase`
            },
            unlocked() {
                return hasUpgrade("aar", 223) && tmp.aar.buyables[109].unlocked
            },
            effect() {
                return player[this.layer].buyables[this.id].add(1)
            },
            cost() {
                return player.aar.dims[0].add(1).log(10).div(EN(25).sub(hasUpgrade("aar", 233) ? player.aar.buyables[113].mul(2).min(20) : 0)).max(1).pow(2).pow(hasUpgrade("aar", 234) ? player.aar.buyables[111].div(100).add(1) : 1)
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return data.cost.gt(data.effect) && player.aar.buyables[109].gte(1)
            },
            buy() { 
                player[this.layer].buyables[this.id] = this.cost().sub(1)

                player.aar.dims = [EN(1), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0), player.aar.dims[9]]
            }
        },
        113: {
            title() {
                return formatWhole(player[this.layer].buyables[this.id])
            }, 
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return `tickspeed boosts
                
                which are making time in Aarex Dimensions ×${format(data.effect)} faster
                
                Requires ${format(data.cost)} dimension 10`
            },
            unlocked() {
                return hasUpgrade("aar", 225)
            },
            effect() {
                let x = player[this.layer].buyables[this.id]
                if (hasUpgrade("aar", 254)) x = x.pow(1.2).mul(2)
                return EN.pow(4, x).add(x)
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                return x.mul(x.mul(10).add(70)).add(100)
            },
            canAfford() {
                let cost = this.cost()
                return player.aar.dims[9].gte(cost)
            },
            buy() {
                if (!hasUpgrade("aar", 245)) {
                    player.aar.dimPoints = EN(0)
                    player.aar.dims = [EN(1), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0), EN(0)]
                    player.aar.dimMults = [EN(1), EN(1), EN(1), EN(1), EN(1), EN(1), EN(1), EN(1), EN(1), EN(1)]
                    for (let a = 100; a < 110; a++)
                        player.aar.buyables[a] = EN(0)
                    player.aar.buyables[112] = ExpantaNumZero
                }

                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).mul(hasUpgrade("aar", 263) ? 1.2 : 1)
            }
        },
    },
    clickables: {
        ...(function() {
            let b = {};
            for (let a = 100; a < 110; a++) {
                b[a] = {
                    canClick() {
                        return tmp[this.layer].clickables[this.id].maxcost.lt(player.aar.dimPoints)
                    },
                    display() {
                        return "Buy " + formatWhole(tmp[this.layer].clickables[this.id].max) + 
                            "<br/>" + format(tmp[this.layer].clickables[this.id].maxcost)
                    },
                    unlocked() {
                        let i = this.id - 100
                        return player.aar.buyables[111].add(3).gte(i)
                    },
                    max() {
                        let i = this.id - 99

                        let cur = player.aar.dimPoints
                        let haved = player[this.layer].buyables[this.id]
                        let base = EN.pow(2, i * i).mul(5)
                        let growth = EN(1.45 + i * i * 0.05)

                        let max = cur.mul(growth.sub(1)).div(base.mul(growth.pow(haved))).add(1).log().div(growth.log()).floor().max(1)
                        return max.isFinite() ? max : EN(1)
                    },
                    maxcost() {
                        let i = this.id - 99
                        let haved = player[this.layer].buyables[this.id]
                        let base = EN.pow(2, i * i).mul(5)
                        let growth = EN(1.45 + i * i * 0.05)
                        
                        return growth.pow(haved).mul(growth.pow(this.max()).sub(1)).div(growth.sub(1)).mul(base)
                    },
                    onClick() {
                        let i = this.id - 100

                        let max = this.max()
                        let cost = this.maxcost()

                        player.aar.dimPoints = player.aar.dimPoints.sub(cost).max(0)
                        player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(max)
                        player.aar.dims[i] = player.aar.dims[i].add(max)
                    },
                    style: { width: '100px', "min-height": '35px' }
                }
            }
            return b
        })(),
        111: {
            display() {
                return "Max all"
            },
            unlocked() {
                return player.aar.buyables[111].gte(1) || hasUpgrade("aar", 224)
            },
            canClick() {
                for (let a = 100; a < 110; a++) if (tmp.aar.clickables[a].canClick) return true
                return false
            },
            onClick() {
                for (let a of clickableEffect("aar", 112).order)
                    clickClickable("aar", 100 + a)
            },
            onHold() {
                for (let a of clickableEffect("aar", 112).order)
                    clickClickable("aar", 100 + a)
            },
            style: { width: '100px', "min-height": '35px' }
        },
        112: {
            display() {
                return "Buying order:<br/>" + clickableEffect(this.layer, this.id).title
            },
            effect() {
                let value = player[this.layer].clickables[this.id] 
                switch (value) {
                    case "highest": return {
                        order: [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
                        title: "Highest First"
                    }
                    case "lowest": default: return {
                        order: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                        title: "Lowest First"
                    }
                }
            },
            canClick: () => true,
            unlocked() {
                return player.aar.buyables[111].gte(9) || hasUpgrade("aar", 225)
            },
            onClick() {
                let opts = ["highest", "lowest"]
                player[this.layer].clickables[this.id] = opts[(opts.indexOf(player[this.layer].clickables[this.id]) + 1) % opts.length]
            },
            style: { width: '100px', "min-height": '35px' }
        },
    },
    microtabs: {
        main: {
            "main": {
                title: "Main",
                content: [
                    ["blank", "10px"],
                    ["column", createUpgradeTable(1, 3, 4)],
                    ["blank", "10px"],
                    ["row", [["upgrade", 201], 
                        ["column", [
                            ["row", [["upgrade", 202], ["upgrade", 204], ["upgrade", 206]]],
                            ["row", [["upgrade", 203], ["upgrade", 205], ["upgrade", 207]]],
                        ]],
                    ]],
                    ["row", [["upgrade", 211], ["upgrade", 212], ["upgrade", 213], ["upgrade", 214], ["upgrade", 215]]],
                    ["row", [["upgrade", 221], ["upgrade", 222], ["upgrade", 223], ["upgrade", 224], ["upgrade", 225]]],
                    ["row", [["upgrade", 231], ["upgrade", 232], ["upgrade", 233], ["upgrade", 234], ["upgrade", 235]]],
                    ["row", [["upgrade", 241], ["upgrade", 242], ["upgrade", 243], ["upgrade", 244], ["upgrade", 245]]],
                    ["row", [["upgrade", 251], ["upgrade", 252], ["upgrade", 253], ["upgrade", 254], ["upgrade", 255]]],
                    ["row", [["upgrade", 261], ["upgrade", 262], ["upgrade", 263], ["upgrade", 264], ["upgrade", 265]]],
                ],
            },
            "adims": {
                title: "Aarex Dimensions",
                unlocked: () => hasUpgrade("aar", 221),
                content: [
                    ["blank", "10px"],
                    ["raw-html", () => `You have <h3 style="color:#fff9ab">${format(player.aar.dimPoints)}</h3> dimension points, which are boosting <b>Aarex Point Generator</b> speed by ×${format(tmp.aar.effect.genMult)}`],
                    ["blank", "20px"],
                    ["row", [["raw-html", "<div style='width:285px'></div>"], ["clickable", 112], ["clickable", 111]]],
                    ["column", (function () {
                        let rows = []
                        for (let a = 0; a < 10; a++) {
                            function mFunc () {
                                return player.aar.buyables[111].gte(a - 3) ? `<div style="width:85px;font-size:12px;text-align:left">
                                    Dimension ${a + 1}<br/>
                                    ×${format(buyableEffect("aar", a + 100))}
                                </div>` : ''
                            }
                            function aFunc () {
                                return player.aar.buyables[111].gte(a - 3) ? `<div style="width:200px"><b>${format(player.aar.dims[a])}</b></div>` : ''
                            }
                            rows.push(["row", [
                                ["raw-html", mFunc],
                                ["raw-html", aFunc],
                                ["buyable", 100 + a],
                                ["clickable", 100 + a],
                            ]])
                        }
                        return rows
                    })()],
                    ["blank", "10px"],
                    ["row", [["buyable", 111], ["buyable", 112], ["buyable", 113]]]
                ],
            },
        },
    },
    tabFormat: [
        "main-display",
        "prestige-button",
        ["blank", "20px"],
        ["raw-html", () => `You have <h3 style="color:#fff9ab">${format(player.aar.bal)}</h3> Aarex balancing (${format(tmp.aar.effect.balProd)}/s).`],
        ["blank", "10px"],
        ["microtabs", "main"],
        ["blank", "20px"],
    ],
})