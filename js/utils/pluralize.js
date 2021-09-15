
function pluralize(word) {
    if (word.match(/(\w+) of (\w+)/i)) return word.replace(/(\w+) of (\w+)/i, (match, m1, m2) => pluralizeWord(m1) + " of " + m2)
    return word.replace(/(\w+)$/i, (match, m1) => pluralizeWord(m1))
} 

function pluralizeWord(word) {
    const rules = [
        // Irregular forms because English sucks
        [/child$/i, "children"],
        [/mouse$/i, "mice"],
        [/person$/i, "people"],

        // Regex transformations
        [/^(\w+[^aeiou])y$/i, "$1ies"],
        [/^(\w+[^aeou])(?:fe|f)$/i, "$1ves"],
        [/^(\w+[aeiou])([sz])$/i, "$1$2$2es"],
        [/^(\w+(?:her|at|gr))o$/i, "$1oes"],
        [/^(\w+)man$/i, "$1men"],
        [/^(\w)us$/i, "$1i"],
        [/^(\w)is$/i, "$1es"],
        [/^(\w)on$/i, "$1a"],
        [/^([^aeou])oo(se|t|th)$/i, "$1ee$2"],
        [/^(\w+(?:s|ss|sh|ch|x|z))$/i, "$1es"],
        [/^(\w+)$/i, "$1s"],
    ]

    for (rule of rules) {
        if (word.match(rule[0])) return word.replace(rule[0], rule[1])
    }

    // can we even reach here?
    return word
}