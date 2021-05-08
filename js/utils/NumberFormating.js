
function exponentialFormat(num, precision, mantissa = true) {
    return num.toString(precision)
}

function commaFormat(num, precision) {
    if (num === null || num === undefined) return "NaN"
    if (num.array[0][1] < 0.001) return (0).toFixed(precision)
    return num.toStringWithDecimalPlaces(Math.max(precision,2)).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
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
    let fmt = decimal.toString(precision)
    if(decimal.gte(1000)&&decimal.lt("10^^5")){
      let powers = fmt.split("e")
      for (let i in powers){
        let x=Number(powers[i])
        if(Number.isNaN(x)||x==Infinity){}
        else if(Number(powers[i])>(1000)){
          let st = powers[i]
          let s=st.length
          if(s==4){st=st[0]+","+st.substr(1,3)}
          if(s==5){st=st.substr(0,2)+","+st.substr(2,3)}
          if(s==6){st=st.substr(0,3)+","+st.substr(3,3)}
          if(s==7){st=st.substr(0,1)+","+st.substr(1,3)+","+st.substr(4,3)}
          if(s==8){st=st.substr(0,2)+","+st.substr(2,3)+","+st.substr(5,3)}
          if(s==9){st=st.substr(0,3)+","+st.substr(3,3)+","+st.substr(6,3)}
          powers[i]=st
        }
      }
      fmt=powers.join("e")
      return fmt}
    else if(precision>0){
      if(fmt.split(".").length==1){fmt=fmt+".00"}
      else if(fmt.split(".")[1].length==1){fmt=fmt+"0"}
    }
    else if(decimal.lte(0.001) &&small&&decimal.gt(0)){
        decimal = decimal.pow(-1)
        let val = ""
    if (decimal.lt("1e1000")){
        val = exponentialFormat(decimal, precision)
        return val.replace(/([^(?:e|F)]*)$/, '-$1')
    }
    else   
        return format(decimal, precision) + "⁻¹"
    }
  return fmt
}

function formatWhole(decimal) {
    return format(decimal,0)
}

function formatTime(s) {
    if (s < 60) return format(s) + "s"
    else if (s < 3600) return formatWhole(Math.floor(s / 60)) + "m " + format(s % 60) + "s"
    else if (s < 84600) return formatWhole(Math.floor(s / 3600)) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
    else if (s < 31536000) return formatWhole(Math.floor(s / 84600) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
    else return formatWhole(Math.floor(s / 31536000)) + "y " + formatWhole(Math.floor(s / 84600) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
}

function toPlaces(x, precision, maxAccepted) {
    x = new ExpantaNum(x)
    let result = x.toString(precision)
    if (new ExpantaNum(result).gte(maxAccepted)) {
        result = new ExpantaNum(maxAccepted - Math.pow(0.1, precision)).toString(precision)
    }
    return result
}
