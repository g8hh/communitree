function exponentialFormat(num, precision, mantissa = true) {
  
    return num.toStringWithDecimalPlaces(precision)
}

function commaFormat(num, precision) {
    if (num === null || num === undefined) return "NaN"
    let zeroCheck = num.array == undefined ? num : num.array[0]
    if (zeroCheck < 0.001) return (0).toFixed(precision)
    let init = num.toFixed(precision)
    let portions = init.split(".")
    portions[0] = portions[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
    return portions.join(".")
}

function formatSmall(x, precision=2) { 
    return format(x, precision, true)    
}

function formatArrow(x) { 
    if (x < 4) return "^".repeat(x);
    return `{${x}}`
}

function regularFormat(num, precision) {
    if (isNaN(num)) return "NaN"
    let zeroCheck = num.array == undefined ? num : num.array[0]
    if (zeroCheck < 0.001) return (0).toFixed(precision)
    return num.toFixed(precision)
}

function fixValue(x, y = 0) {
    return x || new ExpantaNum(y)
}

function sumValues(x) {
    x = Object.values(x)
    if (!x[0]) return new ExpantaNum(0)
    return x.reduce((a, b) => ExpantaNum.add(a, b))
}

// https://gist.github.com/cloudytheconqueror/10dc9c5698de3a630a01e53bb968a63e
function polarize(array, smallTop = false) {
    if (array[0] == Number.POSITIVE_INFINITY) return [array[0], array[array.length-1], array.length-1]
    do {
        while (array[0] >= 10) {
            array[0] = Math.log10(array[0])
            array[1] = (array[1]||0) + 1
        }
        let l = array.length
        for (i=1;i<l-1;++i) {
            if (array[i] == 0) continue
            array[0] = Math.log10(array[0])+array[i]
            array[i] = 0
            array[i+1] += 1
            if (array[0] >= 10) break
        }
        if (array[0] < 10 && array[l-1] >= 10 && smallTop) {
            array[0] = Math.log10(array[0])+array[l-1]
            array[l-1] = 0
            array[l] = 1
        }
    } while (array[0] >= 10)
    return [array[0], array[array.length-1], array.length-1]
}

function format(decimal, precision = 2, small = false, verbose = false) {
    if (EN.isNaN(decimal)) return "NaN"
    if (decimal == "Infinity") return "∞"
    if (decimal == "-Infinity") return "-∞"
    small = small || modInfo.allowSmall
    let precision2 = Math.max(3, precision)
    decimal = new ExpantaNum(decimal)
    let array = decimal.array
    let fmt = decimal.toString()
    if (decimal.abs().lt(1e-308)) return (0).toFixed(precision)
    if (decimal.sign < 0) return "-" + format(decimal.neg(), precision)
    if (decimal.lt("0.0001")) { return format(decimal.rec(), precision) + "⁻¹" }
    if (decimal.lt(1)) return regularFormat(decimal, precision + (small ? 2 : 0))
    if (decimal.lt(1000)) return regularFormat(decimal, precision)
    if (decimal.lt(1e9)) return commaFormat(decimal, 0)

    if (options.notationLow == "standard" && decimal.lt("eeee45")) {
        let tiers = [
            (tier, inh) => {
                let ones = ["K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No"]
                let tens = ["", "Dc", "Vg", "Tg", "Qr", "Qq", "Sg", "St", "Og", "Ng"]
                let hundreds = ["", "Ce", "Dn", "Tc", "Qe", "Qu", "Sc", "Se", "Oe", "Ne"]

                if (inh) ones = ["", "", "D", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No"]
                if (inh == 2) ones = ["", "U", "D", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No"]

                const o = tier % 10; t = Math.floor(tier / 10) % 10; h = Math.floor(tier / 100) % 10

                if (t == 0 && h == 0) {
                    return ones[o]
                }

                ones = ["", "U", "D", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No"]

                return ones[o] + tens[t] + hundreds[h]
            }, 
            (tier, inh) => {
                let ones = ["", "Mi", "Mc", "Na", "Pc", "Fe", "At", "Ze", "Yc", "Xn"]
                let tens = ["", "C", "Ic", "Tic", "Trc", "Ptc", "Hxc", "Hpc", "Otc", "Enc"]
                let hundreds = ["", "H", "Dh", "Tih", "Trh", "Pth", "Hxh", "Hph", "Oth", "Enh"]

                const o = tier % 10; t = Math.floor(tier / 10) % 10; h = Math.floor(tier / 100) % 10

                if (t == 0 && h == 0) {
                    return ones[o]
                }

                ones = ["", "Me", "De", "Ti", "Tr", "Pt", "Hx", "Hp", "Ot", "En"]

                if (t == 1) ones[0] = "V"

                return ones[o] + tens[t] + hundreds[h]
            }, 
            (tier, inh) => {
                let ones = ["", "Ki", "Me", "Gi", "Te", "Pe", "Ex", "Zt", "Yt", "Xe"]
                let tens = ["", "Dk", "Ik", "Trk", "Tk", "Pk", "Ek", "Zk", "Yk", "Nk"]
                let hundreds = ["", "Ht", "Bt", "Trt", "Tt", "Pot", "Et", "Zet", "Yot", "Nt"]

                const o = tier % 10; t = Math.floor(tier / 10) % 10; h = Math.floor(tier / 100) % 10

                if (t == 0 && h == 0) {
                    return ones[o]
                }

                if (t == 1) ones = ["", "He", "Do", "Ta", "Te", "Pe", "Ex", "Ze", "Yo", "Ne"]
                else ones = ["", "En", "Da", "Ta", "Te", "Pe", "Ec", "Ze", "Yo", "Xe"]

                return ones[o] + tens[t] + hundreds[h]
            },
            (tier, inh) => {
                return ["Al", "Ej", "Ij", "St", "Un", "Em", "Ov", "Ol", "Et", "Loc", "Ax", "Up", "Ers", "Ult"][tier]
            },, 
        ]

        let prefix = decimal.log10().div(3).sub(1).floor()
        let tier = 0

        while (prefix.gt("e90")) {
            prefix = prefix.log10().floor()
            tier++
        }
        
        let prefix2 = prefix.log10().div(3).floor()

        if (verbose) console.log(prefix, tier)

        let str = (tier == 0 && prefix < 1e6 ? commaFormat(decimal.div(EN.pow(1000, prefix.add(1))), precision) : "1") 
            + " " + tiers[tier](prefix.div(EN.pow(1000, prefix2)).floor() % 1000, prefix2 >= 1) + tiers[tier+1](prefix2)

        while (prefix.gt(0) && prefix2.gt(0) && str.length < 8) {
            prefix = EN(prefix % EN.pow(1000, prefix2))
            prefix2 = prefix2.sub(1)
            if (verbose) console.log(prefix.toString(), prefix2.toString())
            if (prefix.gte(1)) str += "-" + tiers[tier](prefix.div(EN.pow(1000, prefix2)).floor() % 1000, 2) + tiers[tier+1](prefix2)
        }

        return str
    }

    if (decimal.lt("10^^6")) {
        let rep = (array[1]||0)-1
        if (array[0] >= 1000000000) {
            array[0] = Math.log10(array[0])
            rep += 1
        }
        let m = 10**(array[0]-Math.floor(array[0]))
        let e = Math.floor(array[0])
        let p = array[0] < 1000 ? precision2 : 0
        return "e".repeat(rep) + regularFormat(m, p) + "e" + commaFormat(e)
    }

    let layers = "FGH"
    let pol = polarize(array)

    if (typeof options == "undefined" || options.notation == "hypere") {
        let e = EN(fmt).toHyperE()
        let sp = e.split("#")
        sp[0] = "E" + format(sp[0].substring(1), precision2)
        return sp.join("#")
    } else if (options.notation == "default") {
        for (let a = 0; a < layers.length; a++) {
            if (decimal.lt(EN.arrow(10, a + 2, 1000000))) {
                let p = pol[1] < 1000 ? precision2 : 0
                return regularFormat(pol[0], p) + layers[a] + commaFormat(pol[1])
            }
            if (decimal.lt(EN.arrow(10, a + 3, 6))) {
                if ((array[a + 2] || 0) >= 1){
                    let rep = array[a + 2]
                    array[a + 2] = 0
                    return layers[a].repeat(rep) + format(array, precision2)
                }
                let n = array[a + 1] + 1
                if (decimal.gte(EN.arrow(10, a + 2, (n + 1)))) n += 1
                return layers[a] + format(n, precision2)
            }
        }
        return regularFormat(Math.log10(pol[0]) + pol[1], precision2) + "J" + commaFormat(pol[2])
    } else if (options.notation == "chained") {
        return `(10→${commaFormat(pol[0], precision2)}→${pol[2]})→${regularFormat(pol[1])}→${pol[2]+1}`
    }

    return `(10${formatArrow(pol[2])}${commaFormat(pol[0], precision2)})${formatArrow(pol[2]+1)}${regularFormat(pol[1])}`
} // w- what 

function formatWhole(decimal) {
    return format(decimal,0)
}

function formatTime(s) {
    if (EN(s).gte(31536000000)) return format(EN(s).div(31536000)) + " years"
    if (s < 60) return format(s) + "s"
    else if (s < 3600) return formatWhole(Math.floor(s / 60)) + "m " + format(s % 60) + "s"
    else if (s < 86400) return formatWhole(Math.floor(s / 3600)) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
    else if (s < 31536000) return formatWhole(Math.floor(s / 86400) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
    else return formatWhole(Math.floor(s / 31536000)) + "y " + formatWhole(Math.floor(s / 86400) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
}

function toPlaces(x, precision, maxAccepted) {
    x = new ExpantaNum(x)
    let result = x.toString(precision)
    if (new ExpantaNum(result).gte(maxAccepted)) {
        result = new ExpantaNum(maxAccepted - Math.pow(0.1, precision)).toString(precision)
    }
    return result
}