
function exponentialFormat(num, precision, mantissa = true) {
    var exp = num.log10().floor()
    var man = num.div(EN.pow(10, exp))
    return man.toFixed(precision) + "×10↑" + commaFormat(exp)
}

function commaFormat(num, precision) {
    if (num === null || num === undefined) return "NaN"
    if (num.array && num.array[0] < 0.001) return (0).toFixed(precision)
    return num.toFixed(precision).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
}

function formatTower(tower, times) {

    if (tower == 0) return format(times)
    if (times == 0) return ""

    var str = ""
    if (tower <= 4) str = "10".padEnd(tower + 2, "↑")
    else str = "10↑" + superscript(tower.toString())

    if (times <= 1) str = str.repeat(times)
    else str = "(" + str + ")" + superscript(commaFormat(times))

    return str
}

function formatSmall(x, precision=2) { 
    return format(x, precision, true)    
}

function regularFormat(num, precision) {
    if (isNaN(num)) return "NaN"
    if (num.array[0][1] < 0.001) return (0).toFixed(precision)
    return num.toString(Math.max(precision,2))
}

function fixValue(x, y = 0) {
    return x || EN(y)
}

function sumValues(x) {
    x = Object.values(x)
    if (!x[0]) return EN(0)
    return x.reduce((a, b) => ExpantaNum.add(a, b))
}

function format(decimal, precision = 2, small=false) {
    small = small || modInfo.allowSmall
    decimal = new ExpantaNum(decimal)
    if (decimal.array[0] === null || !decimal.isFinite()) return decimal.toString()

    if (decimal.lte(0.001) && small && decimal.gt(0)) {
        decimal = decimal.pow(-1)
        let val = ""
        if (decimal.lt("1e1000")){
            val = exponentialFormat(decimal, precision)
            return val.replace(/([^(?:e|F)]*)$/, '-$1')
        }
        else return format(decimal, precision) + "⁻¹"
    } else if (decimal.lt(1000)) {
        return commaFormat(decimal, precision)
    } else if (decimal.lt(1e9)) {
        return commaFormat(decimal, 0)
    } else if (decimal.lt("e1000")) {
        return exponentialFormat(decimal, 3)
    } else if (decimal.lt("e1000000")) {
        return exponentialFormat(decimal, 0)
    } else if (decimal.lt("eee1000000")) {
        var tower = ""
        while (decimal.gte("e1000000")) {
            tower += "10↑"
            decimal = decimal.log10()
        }
        var frm = format(decimal, 0)
        if (decimal.gte(1000000000)) frm = "(" + frm + ")"
        return tower + frm
    } else {
        var array = decimal.array
        for (let a in array) if (array[a] >= 1e9) {
            array[+a + 1] = (+array[+a + 1] || 0) + 1
            array[a] = Math.log10(array[a])
        }
        var str = ""
        while (array.length > 0) {
            str += (player.inlineExp && str != "" && !str.endsWith("↑") ? " " : "") + formatTower(array.length - 1, array[array.length - 1])
            array.pop()
        }
        return str + (array.length > 0 ? "…" : "")
    }
    return "too large to format"
}

function superscript(value) {
    if (player.inlineExp) return "^" + value
    return swapChars(value, "0123456789,", "⁰¹²³⁴⁵⁶⁷⁸⁹’")
}

function swapChars(value, start, end) {
    for (var a = 0; a < start.length; a++)
        value = value.replaceAll(start[a], end[a])
    return value
}

function formatWhole(decimal) {
    return format(decimal,0)
}

function formatTime(s) {
    if (s > 31536000000 || (s.gt && s.gt(31536000000))) return format(EN(s).div(31536000)) + " years"
    if (s < 60) return format(s) + "s"
    else if (s < 3600) return formatWhole(Math.floor(s / 60)) + "m " + format(s % 60) + "s"
    else if (s < 84600) return formatWhole(Math.floor(s / 3600)) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
    else if (s < 31536000) return formatWhole(Math.floor(s / 84600) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
    else return formatWhole(Math.floor(s / 31536000)) + "y " + formatWhole(Math.floor(s / 84600) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
}

function toPlaces(x, precision, maxAccepted) {
    x = EN(x)
    let result = x.toString(precision)
    if (EN(result).gte(maxAccepted)) {
        result = EN(maxAccepted - Math.pow(0.1, precision)).toString(precision)
    }
    return result
}
