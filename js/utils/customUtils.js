function createUpgradeTable(index, height, width) {
    var table = []
    for (var x = 0; x < height; x++) {
        var row = ["row", []]
        for (var y = 1; y <= width; y++) {
            var upg = ["upgrade", index * 100 + x * 10 + y]
            row[1].push(upg)
        }
        table.push(row)
    }
    return table
}

function createBuyableTable(index, height, width) {
    var table = []
    for (var x = 0; x < height; x++) {
        var row = ["row", []]
        for (var y = 1; y <= width; y++) {
            var upg = ["buyable", index * 100 + x * 10 + y]
            row[1].push(upg)
        }
        table.push(row)
    }
    return table
}

function createClickableTable(index, height, width) {
    var table = []
    for (var x = 0; x < height; x++) {
        var row = ["row", []]
        for (var y = 1; y <= width; y++) {
            var upg = ["clickable", index * 100 + x * 10 + y]
            row[1].push(upg)
        }
        table.push(row)
    }
    return table
}

function resetBuyableRow(layer, row) {
    for (var a = row * 10; a < (row + 1) * 10; a++) {
        if (player[layer].buyables[a]) player[layer].buyables[a] = ExpantaNumZero
    }
}

function logLerp(start, end, mul) {
    var lStart = EN(start).log10()
    var lEnd = EN(end).log10()
    return EN.pow(10, lStart.add(lEnd.sub(lStart).mul(mul)))
}

window.onerror = function(message, source, lineno, colno, error) {
    document.body.innerHTML = "Error: " + message
}