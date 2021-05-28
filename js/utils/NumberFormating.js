
function exponentialFormat(num, precision, mantissa = true) {
  
    return num.toStringWithDecimalPlaces(precision)
}

function commaFormat(num, precision) {
    if (num === null || num === undefined) return "NaN"
    if (num.array[0] < 0.001) return (0).toFixed(precision)
    let init = num.toString()
    let portions = init.split(".")
    portions[0] = portions[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
    return portions[0]

    
}

function formatSmall(x, precision=2) { 
    return format(x, precision, true)    
}

function regularFormat(num, precision) {
    if (isNaN(num)) return "NaN"
    if (num.array[0] < 0.001) return (0).toFixed(precision)
    return num.toString(Math.max(precision,2))
}

function fixValue(x, y = 0) {
    return x || new ExpantaNum(y)
}

function sumValues(x) {
    x = Object.values(x)
    if (!x[0]) return new ExpantaNum(0)
    return x.reduce((a, b) => ExpantaNum.add(a, b))
}

function format(decimal, precision = 2, small=false) {
    small = small || modInfo.allowSmall
    decimal = new ExpantaNum(decimal)
    let fmt = decimal.toString()
    if(decimal.eq(0))return "0"
    if(decimal.lt("0.0001")){return format(decimal.rec(), precision) + "⁻¹"}
  else if(decimal.lt(1)){
    if(small)precision+=2
    if(fmt.length<precision+2){fmt+="0".repeat(precision-fmt.length+2)}
    else{fmt = fmt.substring(0,precision+2)}
    }
  else if(decimal.lt(1000)){
    let f=fmt.split(".")
    if(precision==0){
      if(!f.includes("."))return fmt
      return fmt[0]}
    if(f.length==1){
      return fmt+".00"
    }
    else if(f[1].length<precision){
      return fmt+"0".repeat(precision-f[1].length)
    }
    else{
      return f[0]+"."+f[1].substring(0,precision)
    }
  }else if(decimal.lt(1e9)){
    return commaFormat(decimal,precision)
  }else if(decimal.lt("e10000")){
    let mantissa = EN(10).pow(decimal.log10().sub(decimal.log10().floor()))
    let exp = decimal.log10().floor()
    let m = mantissa.toString().split(".")
    if(m.length==1)mantissa = m[0]+".00"
    else if(m[1].length<precision){
      mantissa = m[0]+"."+m[1]+"0".repeat(precision-m[1].length)
    }
    else if(precision==0){mantissa = m[0]+"."+m[1].substring(0,2)}
    else mantissa = m[0]+"."+m[1].substring(0,precision)
    return mantissa+"e"+exp.toString()
  }
  else if(decimal.lt("10^^5")){
    return "e"+format(decimal.log10())
  }
  else if(decimal.lt("10^^^5")){
    return "F"+format(decimal.slog())
  }
  else {
    if(decimal.lt("10^^^^5")){
      //return "10{3}"+format(decimal.hyperlog(3))
    }
    let e= decimal.toHyperE()
    let sp = e.split("#")
    sp[0]="E10"
    return sp.join("#")
       }
  return fmt
}

function formatWhole(decimal) {
    return format(decimal,0)
}

function formatTime(s) {
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
