let newsTicker = {
    current: [],
    pos: 0,
    new: true,
}

let newsEntries = [
    // Standard news
    [true, "Hi, I'm a news ticker! My job is to give the most exotic news possible to everyone! Let's hope nothing goes terribly wrong while I'm ticking!"],
    [true, "What it feels like to get the same news ticker twice<div style='display:inline-block;width:100vw'></div>What it feels like to get the same news ticker twice"],
    [true, "One does not simply escape from the news ticker... unless you turn it off, of course. But are you truely safe from it even if you disabled it?"],
    [true, "Wait, a news ticker? In a Prestige Tree mod? Unacceptable! How could they do this? Don't they know that news tickers are already a thing of the past? Why did they do this in $CURRENT_YEAR? That's it, I can't take it anymore, I'll turn off the news ticker myself. <i>(turns off the news ticker) (imagine the news ticker is turned off)</i>"],
    [true, "Tip: The news ticker will update itself the more you play the game. If you think the news messages aren't interesting, it's just because you haven't unlocked anything interesting yet."],
    [true, () => "The current amout of news messages that can be shown is " + newsEntries.length + ". Suggest news to me to make this number bigger."],
    [true, "<a onclick='newsTicker.pos=-1/0' style='color:var(--color)'>Click here to reroll your news ticker.</a>"],
    [true, "News Ticker - the rudest machine in town. But well, no one reports positive news anyways so I can't really blame that."],
    [true, "Quote me <i>-literally everyone</i>"],

    // Conditional news
    [() => player.points.gte(Number.MAX_VALUE), "Hold on, numbers in this game can go above 1.798e308?"],
    [() => options.notationLow != "standard", "Play this game using the standard notation, I literally just dare you."],
    [() => !options.forceOneTab, "This game plays best with Single-Tab Mode set to ALWAYS, I sugeest you to turn that on by clicking the gear button. The option is in the Display tab. (I mean, you can turn this news ticker on, I sure know you can find it yourself.)"],
    [() => Math.random() < .001, "Most of the game that has a news ticker feature always have these kind of messages that's rarer to get than other ones and they are all about how lucky you are to be able to get those. So uhh, if you can see this, congrats I guess."],

    // Jacorb (always on)
    [true, "What if you want to enjoy your currently playing incremental game, but the game says (softcapped), (scaled), or any text in parentheses in general"],
    [true, "If you remember what the old Prestige Tree theme looks like, you deserve a veteran boost to your point gain."],
    [true, "I don't know if I should implement Absurd mode in this game anymore. Contact me if you think I should or shouldn't."],
    [true, "Distance Incremental - Metascore: 713/100. Critic Review: \"Beautiful game with lots of unlockable mechanics, very large numbers and funny gags. Also (softcapped)\""],
    [true, "The four High Gods of Jacorbian community: (softcapped), J, gwa, and Homestuck."],
    
    // Aarex
    [() => tmp.aar.layerShown, "The Aarex Dimensions are supposed to recreate Universal Attractor, not Antimatter Dimensions, what are you talking about?"],
    [() => tmp.aar.layerShown, "Insert jokes about Aarex timewalls here- wait, he doesn't make timewalls anymore?"],
    [() => tmp.aar.layerShown, "Insert jokes about 5 hours here- wait, the Reality update is already released?"],

    // Acamaeda
    [() => tmp.aca.layerShown, "Read Act Omega instead <i>-Acamaeda</i>"],
    [() => tmp.aca.layerShown, "In my news message, I am the star. It's me, the news message!"],
    
    // thefinaluptake
    [() => player.aca.modLevel + player.aca.modActive >= 1, "News: Local Florida man got caught for intentionally set an entire forest on fire, answering \"it's just an incremental game\" when asked why."],
    [() => player.aca.modLevel + player.aca.modActive >= 1, "Why are people competing to be the person who burned the most wood? Aren't people afraid of climate change or something?"],
    [() => player.aca.modLevel + player.aca.modActive == 1, "This will affect the climate i think"],
    [() => player.aca.modLevel + player.aca.modActive >= 1, "I wonder where thefinaluptake went..."],

    // despacit
    [() => player.aca.modLevel + player.aca.modActive >= 2, "Why is this game so hard? <i>-person playing Little Professor at level 1</i>"],
    [() => player.aca.modLevel + player.aca.modActive >= 2, () => "\"OMG HOW IN THE LOVE OF VIDEO GAMES DID YOU MANAGE TO GET YOUR BASE TO " + format(player.points).toUpperCase() + " POWER??!!?!?!?!?!?!!???1!???\" \"I just play the game normally lmao\""],
    [() => player.aca.modLevel + player.aca.modActive >= 2, "Enter the code \"fumolation40000\" to get your free 40000 fumos now! (note: the fumos are all fictional and are just an abstract number on a screen)"],
    [() => player.aca.modLevel + player.aca.modActive >= 2, "Our news ticker guy is on vacation &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; please still keep it on"],

    // thepaperpilot
    [() => player.aca.modLevel + player.aca.modActive >= 3, "Help I'm trapped inside a video game's news ticker factory"],
    [() => player.aca.modLevel + player.aca.modActive >= 3, "News: Scientists have discover how to bend time, but the process involves playing a weird and really rare version of Keisan-gotchi that no one has managed to find, even to this day."],
    [() => player.aca.modLevel + player.aca.modActive >= 3, "Made in Profectus <i>-thepaperpilot</i> <i style='transform:skewX(-40deg)'>-thepaperpilot</i>"],
];

if ((new Date()).getMonth() == 3 && (new Date()).getDay() == 1) newsEntries = [
    [true, '<iframe width="0" height="0" src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1" title="YouTube video player" frameborder="0" allow="autoplay;encrypted-media;" allowfullscreen></iframe>never gonna give you up never gonna let you down get rique rolled haha gottem lmao lol kekwlksfxprvbkzwqlfvkgckbtpykwvmzpbcxd what am i doing with my life'],
]

function updateNewsTicker(diff) {
    newsTicker.new = false;
    if (!newsTicker.current[1] || newsTicker.pos + 50 < -(document.getElementById("newsmessage")?.offsetWidth || 0)) {
		newsTicker.current = newsEntries[Math.floor(Math.random() * newsEntries.length)];
        while (!run(newsTicker.current[0])) newsTicker.current = newsEntries[Math.floor(Math.random() * newsEntries.length)];
        newsTicker.current = run(newsTicker.current[1]);
		newsTicker.pos = window.innerWidth + 50;
        newsTicker.new = true;
    }
    newsTicker.pos -= diff * 150;
}