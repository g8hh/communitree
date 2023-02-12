"use strict";

function calculateDerivative(array, time) {
    let facts = [EN(1)]
    let ans = [...array]
    time = EN(time)
    for (let a = 1; a < array.length; a++) {
        let aPos = array.length - 1 - a
        for (let b = 1; b <= a; b++) {
            let bPos = aPos + b
            ans[aPos] = EN.add(ans[aPos], time.pow(b).div(facts[a - b]).mul(array[bPos]))
        }
        facts.unshift(facts[0].mul(a + 1))
    }
    return ans
}

addLayer("tfu", {
    name: "thefinaluptake",
    symbol: "α",

    row: 4,
    displayRow: 1,
    position: 0,
    branches: ["aca"],
    layerShown() { return player.aca.modActive && player.aca.modLevel == 0 },
    deactivated() { return !this.layerShown() },

    startData() {
        return {
            points: EN(0),
            ashes: EN(0),
            flames: EN(1),

            elec: EN(0),
            totalElec: EN(0),
            elecDist: 0,
            coal: EN(0),
            totalCoal: EN(0),
            coalTime: EN(0),

            autoUpgrades: false,
            autoReplenish: false,
            autoDistribute: false,
            autoCoalUpgrades: false,
        }
    },

    resource: "thefinaluptake (α) points",
    color: "#c5cdef",
    nodeStyle: {
        background: "linear-gradient(-30deg, #ffffff, #c5cdef)",
        "background-origin": "border-box !important",
    },
    type: "none",

    effect() {
        if (tmp[this.layer].deactivated) return {
            compBonus: EN(1),
            maxFlames: EN(0),
            decaySpeed: EN(0),
            coalBonus: EN(0),
        }
        let eff = {
            compBonus: player.tfu.best.div(10).max(1).mul(player.tfu.best.max(10).log10()).pow(2),
            maxFlames: buyableEffect("tfu", 101).mul(buyableEffect("tfu", 102)),
            decaySpeed: buyableEffect("tfu", 101).mul(.05),
            coalBonus: EN(0),
        }
        for (let a = 121; a <= 125; a++) eff.coalBonus = eff.coalBonus.add(buyableEffect("tfu", a))
        return eff
    },
    effectDescription() {
        return `which are making ${format(tmp.tfu.effect.compBonus)}× more component points, based on your highest amount.`
    },
    clickables: {
        100: {
            display() {
                return "Reset flames and ashes"
            },
            unlocked() {
                return true
            },
            canClick() {
                return true
            },
            onClick() {
                if (!hasMilestone("tfu", 10)) player.tfu.ashes = EN(0)
                player.tfu.flames = tmp.tfu.effect.maxFlames
            },
            onHold() {
            },
            style: { ...smallClickable }
        },
        101: {
            display() {
                let data = tmp[this.layer].clickables[this.id]
                return `Reset previous progress for ${formatWhole(data.resetGain)} electricity
                    Next at ${format(data.nextAt)} thefinaluptake points`
            },
            unlocked() {
                return player.tfu.best.gte(1e20)
            },
            resetGain() {
                return player.tfu.points.max(0).div(1e24).pow(0.2).floor()
            },
            nextAt() {
                let gain = tmp[this.layer].clickables[this.id].resetGain
                return gain.add(1).root(0.2).mul(1e24)
            },
            canClick() {
                return tmp[this.layer].clickables[this.id].resetGain.gte(1)
            },
            onClick() {
                let gain = tmp[this.layer].clickables[this.id].resetGain
                for (let a = 101; a <= 105; a++) player.tfu.buyables[a] = EN(0)
                player.tfu.points = EN(0)
                player.tfu.ashes = EN(0)
                player.tfu.flames = EN(1)
                if (hasMilestone("tfu", 1) && player.tfu.autoDistribute) {
                    for (let a = 111; a <= 115; a++) player.tfu.buyables[a] = player.tfu.buyables[a].add(gain.div(5))
                    if (hasMilestone("tfu", 5)) player.tfu.elec = player.tfu.elec.add(gain)
                } else player.tfu.elec = player.tfu.elec.add(gain)
                player.tfu.totalElec = player.tfu.totalElec.add(gain)
            },
            onHold() {
            },
            style: { ...smallClickable }
        },
        102: {
            display() {
                let data = tmp[this.layer].clickables[this.id]
                return `Reset previous progress for ${formatWhole(data.resetGain)} coal
                    Next at ${format(data.nextAt)} thefinaluptake points`
            },
            unlocked() {
                return player.tfu.best.gte(1e92)
            },
            resetGain() {
                let data = tmp[this.layer].clickables[this.id]
                if (hasMilestone("tfu", 8)) return player.tfu.points.max(0).div(data.cost).log().div(Math.log(1e25)).root(1.45).sub(player.tfu.totalCoal).add(1).max(0).floor()
                return EN(data.nextAt.lte(player.tfu.points) ? 1 : 0)
            },
            nextAt() {
                let data = tmp[this.layer].clickables[this.id]
                if (hasMilestone("tfu", 8)) return data.cost.mul(EN.pow(1e25, player.tfu.totalCoal.add(data.resetGain).pow(1.45)))
                return data.cost.mul(EN.pow(1e25, player.tfu.totalCoal.pow(1.45)))
            },
            cost: EN(1e92),
            canClick() {
                return tmp[this.layer].clickables[this.id].resetGain.gte(1)
            },
            onClick() {
                let gain = tmp[this.layer].clickables[this.id].resetGain
                for (let a = 101; a <= 105; a++) player.tfu.buyables[a] = EN(0)
                for (let a = 101; a <= 115; a++) player.tfu.buyables[a] = EN(0)
                player.tfu.points = player.tfu.ashes = player.tfu.coalTime = EN(0)
                player.tfu.elec = hasMilestone("tfu", 6) ? player.tfu.totalCoal : EN(0)
                player.tfu.flames = EN(1)
                player.tfu.coal = player.tfu.coal.add(gain)
                if (hasMilestone("tfu", 11)) {
                    for (let a = 121; a <= 125; a++) player.tfu.buyables[a] = player.tfu.buyables[a].max(gain.add(1).log().div(Math.log(2)).sub(1))
                }
                player.tfu.totalCoal = player.tfu.totalCoal.add(gain)
            },
            onHold() {
            },
            style: { ...smallClickable }
        },
    },
    buyables: {
        showRespec() {
            return player.tfu.totalElec.gte(1)
        },
        respec() {
            if (player.tfu.totalCoal.gte(1)) {
                layers.tfu.clickables[102].onClick()
                for (let a = 121; a <= 125; a++) player.tfu.buyables[a] = EN(0)
                player.tfu.coal = player.tfu.totalCoal
            } else {
                layers.tfu.clickables[101].onClick()
                for (let a = 111; a <= 115; a++) player.tfu.buyables[a] = EN(0)
                player.tfu.elec = player.tfu.totalElec
            }
        },
        respecText() { return player.tfu.totalCoal.gte(1) ? "Respec coal upgrades" : "Respec bonus levels" },
        respecMessage() {
            return player.tfu.totalCoal.gte(1) ?
                "Are you sure to respec coal upgrades? This will force a coal reset as well!" :
                "Are you sure to respec bonus levels? This will force an electricity reset as well!"
        },

        101: {
            title() {
                return ""
            },
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `${formatWhole(x)}\n<h3>Hotter Flames</h3>
                    You now start with 2× flames on reset, but so is the loss.
                    Currently: ×${format(data.effect)}

                    Cost: ${format(data.cost)} α points
                `
            },
            unlocked() {
                return tmp.tfu.layerShown
            },
            effect() {
                let x = player[this.layer].buyables[this.id].add(buyableEffect("tfu", 105)).add(buyableEffect(this.layer, +this.id + 10)).add(tmp.tfu.effect.coalBonus)
                let eff = EN.pow(2, x)
                return eff
            },
            cost() {
                let x = softcap(player[this.layer].buyables[this.id], EN(15), 2)
                return EN.pow(3, x).mul(250)
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.tfu.points.gte(data.cost)
            },
            buy() {
                player.tfu.points = player.tfu.points.sub(this.cost())
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(hasMilestone("tfu", 7) ? player.tfu.totalCoal : 1)
            },
            style: { ...tmtBuyable, "border-radius": "" }
        },
        102: {
            title() {
                return ""
            },
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `${formatWhole(x)}\n<h3>More Flames</h3>
                    You now start with 1.5× flames on reset.
                    Currently: ×${format(data.effect)}

                    Cost: ${format(data.cost)} α points
                `
            },
            unlocked() {
                return tmp.tfu.layerShown
            },
            effect() {
                let x = player[this.layer].buyables[this.id].add(buyableEffect("tfu", 105)).add(buyableEffect(this.layer, +this.id + 10)).add(tmp.tfu.effect.coalBonus)
                let eff = EN.pow(1.5, x)
                return eff
            },
            cost() {
                let x = softcap(player[this.layer].buyables[this.id], EN(15), 2)
                return EN.pow(5, x).mul(1250)
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.tfu.points.gte(data.cost)
            },
            buy() {
                player.tfu.points = player.tfu.points.sub(this.cost())
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(hasMilestone("tfu", 7) ? player.tfu.totalCoal : 1)
            },
            style: { ...tmtBuyable, "border-radius": "" }
        },
        103: {
            title() {
                return ""
            },
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `${formatWhole(x)}\n<h3>Faster Flames</h3>
                    Flame burns 1.5× faster.
                    Currently: ×${format(data.effect)}

                    Cost: ${format(data.cost)} α points
                `
            },
            unlocked() {
                return tmp.tfu.layerShown
            },
            effect() {
                let x = player[this.layer].buyables[this.id].add(buyableEffect("tfu", 105)).add(buyableEffect(this.layer, +this.id + 10)).add(tmp.tfu.effect.coalBonus)
                let eff = EN.pow(1.5, x)
                return eff
            },
            cost() {
                let x = softcap(player[this.layer].buyables[this.id], EN(15), 2)
                return EN.pow(8, x).mul(2500000)
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.tfu.points.gte(data.cost)
            },
            buy() {
                player.tfu.points = player.tfu.points.sub(this.cost())
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(hasMilestone("tfu", 7) ? player.tfu.totalCoal : 1)
            },
            style: { ...tmtBuyable, "border-radius": "" }
        },
        104: {
            title() {
                return ""
            },
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `${formatWhole(x)}\n<h3>Deadlier Flames</h3>
                    Ashes generate 2× more α points.
                    Currently: ×${format(data.effect)}

                    Cost: ${format(data.cost)} α points
                `
            },
            unlocked() {
                return tmp.tfu.layerShown
            },
            effect() {
                let x = player[this.layer].buyables[this.id].add(buyableEffect("tfu", 105)).add(buyableEffect(this.layer, +this.id + 10)).add(tmp.tfu.effect.coalBonus)
                let eff = EN.pow(2, x)
                return eff
            },
            cost() {
                let x = softcap(player[this.layer].buyables[this.id], EN(15), 2)
                return EN.pow(25, x).mul(1e12)
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.tfu.points.gte(data.cost)
            },
            buy() {
                player.tfu.points = player.tfu.points.sub(this.cost())
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(hasMilestone("tfu", 7) ? player.tfu.totalCoal : 1)
            },
            style: { ...tmtBuyable, "border-radius": "" }
        },
        105: {
            title() {
                return ""
            },
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `${formatWhole(x)}\n<h3>Better Flames</h3>
                    Gives +1 more level to all previous upgrades.
                    Currently: +${format(data.effect)}

                    Cost: ${format(data.cost)} α points
                `
            },
            unlocked() {
                return tmp.tfu.layerShown
            },
            effect() {
                let x = player[this.layer].buyables[this.id].add(buyableEffect(this.layer, +this.id + 10)).add(tmp.tfu.effect.coalBonus)
                let eff = x
                return eff
            },
            cost() {
                let x = softcap(player[this.layer].buyables[this.id], EN(15), 2)
                return EN.pow(1250, x).mul(1e15)
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.tfu.points.gte(data.cost)
            },
            buy() {
                player.tfu.points = player.tfu.points.sub(this.cost())
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(hasMilestone("tfu", 7) ? player.tfu.totalCoal : 1)
            },
            style: { ...tmtBuyable, "border-radius": "" }
        },
        111: {
            title() {
                return ""
            },
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `Electricity allocated:
                    ${formatWhole(x)}

                    Translated to an additional
                    +${format(data.effect)} 
                    bonus levels
                `
            },
            unlocked() {
                return player.tfu.totalElec.gte(1)
            },
            effect() {
                let x = player[this.layer].buyables[this.id]
                let eff = x.pow(0.5).mul(9).add(1).max(1).log10().mul(4)
                return eff
            },
            canAfford() {
                return player.tfu.elec.gte(1)
            },
            buy() {
                let alloc = player.tfu.elec.pow(player.tfu.elecDist)
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(alloc)
                player.tfu.elec = player.tfu.elec.sub(alloc)
            },
            style: { ...tmtBuyable, "border-radius": "" }
        },
        112: {
            title() {
                return ""
            },
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `Electricity allocated:
                    ${formatWhole(x)}

                    Translated to an additional
                    +${format(data.effect)} 
                    bonus levels
                `
            },
            unlocked() {
                return player.tfu.totalElec.gte(1)
            },
            effect() {
                let x = player[this.layer].buyables[this.id]
                let eff = x.pow(0.5).mul(9).add(1).max(1).log10().mul(3.2)
                return eff
            },
            canAfford() {
                return player.tfu.elec.gte(1)
            },
            buy() {
                let alloc = player.tfu.elec.pow(player.tfu.elecDist)
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(alloc)
                player.tfu.elec = player.tfu.elec.sub(alloc)
            },
            style: { ...tmtBuyable, "border-radius": "" }
        },
        113: {
            title() {
                return ""
            },
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `Electricity allocated:
                    ${formatWhole(x)}

                    Translated to an additional
                    +${format(data.effect)} 
                    bonus levels
                `
            },
            unlocked() {
                return player.tfu.totalElec.gte(1)
            },
            effect() {
                let x = player[this.layer].buyables[this.id]
                let eff = x.pow(0.5).mul(9).add(1).max(1).log10().mul(3.2)
                return eff
            },
            canAfford() {
                return player.tfu.elec.gte(1)
            },
            buy() {
                let alloc = player.tfu.elec.pow(player.tfu.elecDist)
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(alloc)
                player.tfu.elec = player.tfu.elec.sub(alloc)
            },
            style: { ...tmtBuyable, "border-radius": "" }
        },
        114: {
            title() {
                return ""
            },
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `Electricity allocated:
                    ${formatWhole(x)}

                    Translated to an additional
                    +${format(data.effect)} 
                    bonus levels
                `
            },
            unlocked() {
                return player.tfu.totalElec.gte(1)
            },
            effect() {
                let x = player[this.layer].buyables[this.id]
                let eff = x.pow(0.5).mul(9).add(1).max(1).log10().mul(2.4)
                return eff
            },
            canAfford() {
                return player.tfu.elec.gte(1)
            },
            buy() {
                let alloc = player.tfu.elec.pow(player.tfu.elecDist)
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(alloc)
                player.tfu.elec = player.tfu.elec.sub(alloc)
            },
            style: { ...tmtBuyable, "border-radius": "" }
        },
        115: {
            title() {
                return ""
            },
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `Electricity allocated:
                    ${formatWhole(x)}

                    Translated to an additional
                    +${format(data.effect)} 
                    bonus levels
                `
            },
            unlocked() {
                return player.tfu.totalElec.gte(1)
            },
            effect() {
                let x = player[this.layer].buyables[this.id]
                let eff = x.pow(0.5).mul(9).add(1).max(1).log10().mul(1)
                return eff
            },
            canAfford() {
                return player.tfu.elec.gte(1)
            },
            buy() {
                let alloc = player.tfu.elec.pow(player.tfu.elecDist)
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(alloc)
                player.tfu.elec = player.tfu.elec.sub(alloc)
            },
            style: { ...tmtBuyable, "border-radius": "" }
        },
        121: {
            title() {
                return ""
            },
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `${formatWhole(x)}\n<h3>Burning Ashes</h3>
                    Gives bonus levels to all flames upgrades based on ashes.
                    Currently: +${format(data.effect)}

                    Cost: ${format(data.cost)} coal
                `
            },
            unlocked() {
                return player.tfu.totalCoal.gte(1)
            },
            effect() {
                let x = player[this.layer].buyables[this.id]
                let eff = x.mul(player.tfu.ashes.max(10).log10().div(10).pow(.75))
                return eff
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(2, x)
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.tfu.coal.gte(data.cost)
            },
            buy() {
                player.tfu.coal = player.tfu.coal.sub(this.cost())
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            style: { ...tmtBuyable, "border-radius": "" }
        },
        122: {
            title() {
                return ""
            },
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `${formatWhole(x)}\n<h3>Burning Flames... wait</h3>
                    Gives bonus levels to all flames upgrades based on flames.
                    Currently: +${format(data.effect)}

                    Cost: ${format(data.cost)} coal
                `
            },
            unlocked() {
                return player.tfu.totalCoal.gte(1)
            },
            effect() {
                let x = player[this.layer].buyables[this.id]
                let eff = x.mul(player.tfu.flames.max(10).log10().div(10).pow(.85))
                return eff
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(2, x)
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.tfu.coal.gte(data.cost)
            },
            buy() {
                player.tfu.coal = player.tfu.coal.sub(this.cost())
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            style: { ...tmtBuyable, "border-radius": "" }
        },
        123: {
            title() {
                return ""
            },
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `${formatWhole(x)}\n<h3>Burning Electricity</h3>
                    Gives bonus levels to all flames upgrades based on current electricity.
                    Currently: +${format(data.effect)}

                    Cost: ${format(data.cost)} coal
                `
            },
            unlocked() {
                return player.tfu.totalCoal.gte(1)
            },
            effect() {
                let x = player[this.layer].buyables[this.id]
                let eff = x.mul(player.tfu.elec.max(10).log10().div(5))
                return eff
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(2, x)
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.tfu.coal.gte(data.cost)
            },
            buy() {
                player.tfu.coal = player.tfu.coal.sub(this.cost())
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            style: { ...tmtBuyable, "border-radius": "" }
        },
        124: {
            title() {
                return ""
            },
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `${formatWhole(x)}\n<h3>Burning Time</h3>
                    Gives bonus levels to all flames upgrades based on current coal time.
                    Currently: +${format(data.effect)}

                    Cost: ${format(data.cost)} coal
                `
            },
            unlocked() {
                return player.tfu.totalCoal.gte(1)
            },
            effect() {
                let x = player[this.layer].buyables[this.id]
                let eff = x.mul(player.tfu.coalTime.max(1).log10().pow(2).add(1))
                if (hasMilestone("tfu", 6)) eff = eff.mul(player.tfu.totalCoal.div(4).add(1))
                return eff
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(2, x)
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.tfu.coal.gte(data.cost)
            },
            buy() {
                player.tfu.coal = player.tfu.coal.sub(this.cost())
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            style: { ...tmtBuyable, "border-radius": "" }
        },
        125: {
            title() {
                return ""
            },
            display() {
                let x = player[this.layer].buyables[this.id]
                let data = tmp[this.layer].buyables[this.id]
                return `${formatWhole(x)}\n<h3>Burning Coal</h3>
                    Gives bonus levels to all flames upgrades based on your total coal.
                    Currently: +${format(data.effect)}

                    Cost: ${format(data.cost)} coal
                `
            },
            unlocked() {
                return player.tfu.totalCoal.gte(1)
            },
            effect() {
                let x = player[this.layer].buyables[this.id]
                let eff = x.mul(player.tfu.totalCoal.mul(2).pow(0.9))
                return eff
            },
            cost() {
                let x = player[this.layer].buyables[this.id]
                return EN.pow(2, x)
            },
            canAfford() {
                let data = tmp[this.layer].buyables[this.id]
                return player.tfu.coal.gte(data.cost)
            },
            buy() {
                player.tfu.coal = player.tfu.coal.sub(this.cost())
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            style: { ...tmtBuyable, "border-radius": "" }
        },
    },

    milestones: {
        0: {
            requirementDescription: "50 Total Electricity",
            effectDescription: "Automatically buys Flame Upgrades, once of each upgrades per tick.",
            done() { return player.tfu.totalElec.gte(50) },
            unlocked() { return true },
            toggles: [["tfu", "autoUpgrades"]],
        },
        1: {
            requirementDescription: "1,000,000 Total Electricity",
            effectDescription: "Automatically replenish flames, if it reaches 0.",
            done() { return player.tfu.totalElec.gte(1e6) },
            unlocked() { return true },
            toggles: [["tfu", "autoReplenish"]],
        },
        2: {
            requirementDescription: "1.000e12 Total Electricity",
            effectDescription: "Automatically distributes electricity you get on electricity reset.",
            done() { return player.tfu.totalElec.gte(1e12) },
            unlocked() { return true },
            toggles: [["tfu", "autoDistribute"]],
        },
        3: {
            requirementDescription: "1.000e13 Total Electricity",
            effectDescription: "You passively gain ln((current electricity)+1) % of your electricity gain on reset each second.",
            done() { return player.tfu.totalElec.gte(1e13) },
            unlocked() { return true },
        },
        4: {
            requirementDescription: "1.000e15 Total Electricity",
            effectDescription: "Unlocks coal.",
            done() { return player.tfu.totalElec.gte(1e15) },
            unlocked() { return true },
        },
        5: {
            requirementDescription: "3 Total Coal",
            effectDescription: "The <b>1.000e12 Total Electricity</b> milestone also gives unallocated electricity.",
            done() { return player.tfu.totalCoal.gte(3) },
            unlocked() { return player.tfu.totalCoal.gte(1) },
        },
        6: {
            requirementDescription: "6 Total Coal",
            effectDescription: "You start with your amount of coal as electricity on coal reset.<br/>Also the <b>Burning Time</b> upgrade's effect is multiplied by (total coal) / 4 + 1",
            done() { return player.tfu.totalCoal.gte(6) },
            unlocked() { return player.tfu.totalCoal.gte(1) },
        },
        7: {
            requirementDescription: "15 Total Coal",
            effectDescription: "Flame upgrades are now being bought in bulk of your total coal.",
            done() { return player.tfu.totalCoal.gte(15) },
            unlocked() { return player.tfu.totalCoal.gte(1) },
        },
        8: {
            requirementDescription: "32 Total Coal",
            effectDescription: "You can now reset for coal in bulk.",
            done() { return player.tfu.totalCoal.gte(32) },
            unlocked() { return player.tfu.totalCoal.gte(1) },
        },
        9: {
            requirementDescription: "1.000e12 Total Coal",
            effectDescription: "Automatically buys coal upgrades.",
            done() { return player.tfu.totalCoal.gte(1e12) },
            unlocked() { return hasMilestone("tfu", 8) },
            toggles: [["tfu", "autoCoalUpgrades"]],
        },
        10: {
            requirementDescription: "1.000e24 Total Coal",
            effectDescription: "The Reset ashes and flames now only reset flames.",
            done() { return player.tfu.totalCoal.gte(1e24) },
            unlocked() { return hasMilestone("tfu", 8) },
        },
        11: {
            requirementDescription: "1.000e360 Total Coal",
            effectDescription: "Buys max coal upgrades on coal reset. Well, sort of.",
            done() { return player.tfu.totalCoal.gte("e360") },
            unlocked() { return hasMilestone("tfu", 8) },
        },
    },

    update(delta) {
        if (tmp[this.layer].deactivated) return

        if (tmp[this.layer].layerShown) {
            let data = calculateDerivative([0, player.tfu.flames, EN.neg(tmp.tfu.effect.decaySpeed)],
                player.tfu.flames.div(tmp.tfu.effect.decaySpeed).max(Number.MIN_VALUE).min(buyableEffect("tfu", 103).mul(delta))
            );
            player.tfu.ashes = player.tfu.ashes.add(data[0]).abs()
            player.tfu.flames = data[1].max(0)
            addPoints("tfu", player.tfu.ashes.mul(delta).mul(buyableEffect("tfu", 104)))

            if (hasMilestone("tfu", 0) && player.tfu.autoUpgrades) for (let a = 101; a <= 105; a++) buyBuyable("tfu", a)
            if (hasMilestone("tfu", 1) && player.tfu.autoReplenish && player.tfu.flames.lte(0)) clickClickable("tfu", 100)
            if (hasMilestone("tfu", 3)) {
                let gain = tmp.tfu.clickables[101].resetGain.mul(delta).mul(player.tfu.elec.add(1).max(1).log()).div(100)
                if (hasMilestone("tfu", 1) && player.tfu.autoDistribute) {
                    for (let a = 111; a <= 115; a++) player.tfu.buyables[a] = player.tfu.buyables[a].add(gain.div(5))
                    if (hasMilestone("tfu", 5)) player.tfu.elec = player.tfu.elec.add(gain)
                } else player.tfu.elec = player.tfu.elec.add(gain)
                player.tfu.totalElec = player.tfu.totalElec.add(gain)
            }
            if (hasMilestone("tfu", 9) && player.tfu.autoCoalUpgrades) for (let a = 121; a <= 125; a++) buyBuyable("tfu", a)
            player.tfu.coalTime = player.tfu.coalTime.add(delta)
        }
    },


    microtabs: {
        main: {
            "flames": {
                title: "The Burning Tree",
                content: [
                    ["blank", "10px"],
                    ["raw-html", () => `You have <h3>${format(player.tfu.ashes)}</h3> ashes, which produce thefinaluptake points.`],
                    ["raw-html", () => `You have <h3>${format(player.tfu.flames)} / ${format(tmp.tfu.effect.maxFlames)}</h3> flames, which produce ashes.`],
                    ["blank", "10px"],
                    ["raw-html", () => `You lose ${format(tmp.tfu.effect.decaySpeed)} flames per second.`],
                    ["blank", "10px"],
                    ["microtabs", "flames"]
                ],
            },
        },
        flames: {
            "main": {
                title: "Main",
                content: [
                    ["blank", "10px"],
                    ["clickable", 100],
                    ["row", [["buyable", 101], ["buyable", 102], ["buyable", 103], ["buyable", 104], ["buyable", 105]]],
                    ["blank", "10px"],
                    ["raw-html", () => player.tfu.totalElec.gte(1) ? `You have <h3>${formatWhole(player.tfu.elec)}</h3> electricity${hasMilestone("tfu", 3) ? `, which are giving ${format(player.tfu.elec.add(1).max(1).log())}% of your electricity gain on reset each second` : ""
                        }.` : ``],
                    ["blank", "10px"],
                    ["slider", ["elecDist", 0, 1, 0.01, (() => player.tfu.elec.gte(2)), (() => `Bulk electricity distribution:<br/>${formatWhole(player.tfu.elec.pow(player.tfu.elecDist).round())}`)]],
                    ["row", [["buyable", 111], ["buyable", 112], ["buyable", 113], ["buyable", 114], ["buyable", 115]]],
                    ["clickable", 101],
                    ["blank", "10px"],
                    ["raw-html", () => player.tfu.totalCoal.gte(1) ? `You have <h3>${formatWhole(player.tfu.coal)}</h3> coal.` : ``],
                    ["row", [["buyable", 121], ["buyable", 122], ["buyable", 123], ["buyable", 124], ["buyable", 125]]],
                    ["clickable", 102],
                    ["blank", "10px"],
                    "respec-button",
                ],
            },
            "miles": {
                title: "Milestones",
                unlocked: () => player.tfu.totalElec.gte(1),
                content: [
                    ["blank", "10px"],
                    ["raw-html", () => `You have <h3>${formatWhole(player.tfu.totalElec)}</h3> total electricity.`],
                    ["raw-html", () => player.tfu.totalCoal.gte(1) ? `You have <h3>${formatWhole(player.tfu.totalCoal)}</h3> total coal.` : ``],
                    ["blank", "10px"],
                    "milestones"
                ],
            }
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