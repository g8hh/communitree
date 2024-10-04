let newsTicker = {
    current: [],
    pos: 0,
    new: true,
}

let newsEntries = [
    // Standard news
    [true, "Hi, I'm a news ticker! My job is to give news to everyone! Let's hope that nothing ever goes terribly wrong while I'm ticking!"],
    [true, "What it feels like to get the same news ticker twice<div style='display:inline-block;width:calc(100vw + 100px)'></div>What it feels like to get the same news ticker twice"],
    [true, "One does not simply escape from the news ticker... unless you turn it off, of course. But are you truely safe from it even if you do that?"],
    [true, "Wait, a news ticker? In a Prestige Tree mod? Unacceptable! How could they do this? Don't they know that news tickers are already a thing of the past? Why did they do this in $CURRENT_YEAR? That's it, I can't take it anymore, I'll turn off the news ticker myself. <i>(turns off the news ticker) (please imagine that the news ticker is turned off)</i>"],
    [true, "Quote me <i>-literally everyone</i>"],
    [true, "<a href='https://youtu.be/dQw4w9WgXcQ' target='_blank'>It is not a news ticker until one of the possible messages links to Rick Astley's <i>Never Gonna Give You Up</i></a>"],
    [true, "The Communitree - not to be confused with the numerous tree planting programs with the same name."],
    [true, "BREAKING NEWS: <r>Error: Script error.</r>"],
    [true, "Don't go to the Prestreestuck server, go the the Modding Tree server instead."],
    [true, "There are no \"challenges\" in this game. Thank me later."],
    [true, "If you see The Communitree in an update hiatus, that means the developer's computer wiped his save again and he has to replay the game all over again."],
    [true, "TMT players when I tell them that tn-shi was in the Incremental Game Jam Discord server"],
    [true, "BREAKING NEWS: Game on hiatus finally got updated after three years, resulted in so many people trying to play the game that the web portal the game was hosted on got overloaded."],
    [true, "BEWARE OF THE PIPELINE: TMT player -> The Communitree! player -> The Camellia Tree (duducat rewrite) player -> Phigros player -> Eastern rhythm game player -> Otoge music composer/VTuber"],
    [true, "Most people don't know this, but me and the Phigros' tip box are friends! <i>*wink wink*</i>"],
    [true, "I just went to this news ticker code after two years of inactivity and found out that some of the news messages I wrote no longer reflects me as a person. If you, by chance, get offended by some of the news messages let me know and I'll consider removing it."],
    [true, "Wow, some of these news messages did not age well. I guess you can say that those news messages are - get this - \"old news\" amirite <i>*ba-dum-tss*</i>"],
    [true, "Copyright Disclaimer: Copyright Disclaimer Under Section 107 of the Copyright Act 1976, allowance is made for \"fair use\" for purposes such as criticism, comment, news reporting, teaching, scholarship, and research. Fair use is a use permitted by copyright statute that might otherwise be infringing. Non-profit, educational or personal use tips the balance in favor of fair use."]

    [true, "<a onclick='newsTicker.pos=-1/0'>Click here to reroll your news ticker.</a>"],
    [true, "<a onclick='navigator.clipboard.writeText(this.innerText);doPopup(`none`, `Copied contents to clipboard.`)'>Click here to copy this news message's contents into your clipboard.</a>"],

    [true, () => {
        return options.notationLow == "standard" ? "haha standard notation user, laugh at this user" : "Play this game using the standard notation, I literally just dare you."
    }],
    [true, () => {
        let newsCount = newsEntries.length, newsAvail = newsEntries.filter(x => run(x[0])).length;
        return "If you think the news ticker is too repetitive, please note that in this current moment, there are " + format(newsAvail, 0) + " unique news messages available that you can get right now. There are multiple ways to increase this number, for example, you can continue playing the game as usual, considering most of the news messages are directly tied to your game progress. Secondly, you can suggest new news messages by joining the TMT Discord server which I put the invite link on the left side menu. And last and most importantly, there are some news messages that will only show up when a specific condition is met, such as using a certain theme or number format or just by sheer luck. Oh and by the way, if you are wondering how many unique news message entries there are in the game, the number is " + format(newsCount, 0) + ", which means " + format(newsAvail / newsCount * 100) + " percent of the news in the game are available right now. And as always, thank you for keeping the news ticker option on. We appreciate that.";
    }],
    [true, () => {
        let list = ["かめりあ", "Toby Fox"];
        return "The universe will collapse when " + list[Math.floor(Math.random() * list.length)] + " becomes a TMT mod-creator";
    }],

    // Quote machine
    [true, "Introducing: The Quote Machine™! The rules are simple: If you say something funny that is related to the game I will put your speech here. Good luck!"],

    // Conditional news
    [() => player.points.gte(Number.MAX_VALUE), "Hold on, numbers in this game can go above 1.798e308?"],
    [() => !options.forceOneTab, "This game plays best with Single-Tab Mode set to ALWAYS, I sugeest you to turn that on by clicking the gear button. The option is in the Display tab. (I mean, since you can turn this news ticker on, I sure know you can find it yourself.)"],
    [() => Math.random() < .001, "Most of the game that has a news ticker feature always have these kind of messages that's rarer to get than other ones and they are all about how lucky you are to be able to get those. So uhh, if you can see this, congrats I guess."],

    // Jacorb (always on)
    [true, "What if you want to enjoy your currently playing incremental game, but the game says (softcapped), (scaled), or any text in parentheses in general"],
    [true, "If you remember what the old Prestige Tree theme looks like, you deserve a veteran boost to your point gain."],
    [true, "If you remember this image --&gt; <img src='remove.png' width='12' height='12'>, you deserve a veteran boost to your point gain."],
    [true, "Distance Incremental - Metascore: 713/100. Critics' Review: \"Beautiful game with lots of unlockable mechanics, very large numbers and funny gags. Also (softcapped)\""],
    [true, "The Prestige Tree - Gamerscore: 350/100. Critics' Review: \"I mean, the game is so good it even has a modding community\""],
    [true, "The four High Gods of Jacorbian community: (softcapped), J, gwa, and Homestuck."],
    [true, "Calling buyables \"buyables\" assumes that one-time-purchasable upgrades aren't \"buyable\""],
    [true, "Did you know that the game <i>Derivative Clicker</i> describe its one time purchasable upgrades bought using prestige currencies as \"buyables\" and the repeatable upgrades bought using money as \"upgrades\"? Next time if you see someone refer to repeatable upgrades as \"buyables\" tell them this fact."],
    
    [true, "This news message is (hardca"],
    [true, () => {
        let str = "This news message is (softcapped).";
        let news = "";
        for (let chr = 0; chr < str.length; chr++) news += `<span style='display:inline-block;padding-left:${1.2**chr}px'>${str[chr]}</span>`;
        return news;
    }],
    [true, () => {
        let str = "This news message is (scaled).";
        let news = "";
        for (let chr = 0; chr < str.length; chr++) news += `<span style='display:inline-block;transform:scaleX(${1.2**chr/20+1});width:${1.2**chr/20+1}ch'>${str[chr]}</span>`;
        return news;
    }],
    
    // Aarex
    [() => tmp.aar.layerShown, "The Aarex Dimensions are supposed to recreate Universal Attractor, not Antimatter Dimensions, what are you talking about?"],
    [() => tmp.aar.layerShown, "Insert jokes about Aarex timewalls here- wait, he doesn't make timewalls anymore?"],
    [() => tmp.aar.layerShown, "Insert jokes about 5 hours here- wait, the Reality update is already released?"],
    [() => tmp.aar.layerShown, "Still waiting for Aarex's Upsiding by the way"],

    // Acamaeda
    [() => tmp.aca.layerShown, "Read Act Omega instead <i>-Acamaeda</i>"],
    [() => tmp.aca.layerShown, "In my news ticker, I am the star. It's me, the news message!"],
    [() => tmp.aca.layerShown, "Did you know that the person who founded the 5 hours meme is a Homestuck?"],
    
    // thefinaluptake
    [() => player.aca.modLevel + player.aca.modActive >= 1, "Local Florida man got arrested for intentionally setting an entire forest on fire, answering \"it's just an incremental game\" when asked why."],
    [() => player.aca.modLevel + player.aca.modActive >= 1, "Why are people competing to be the person who burned the most wood? Aren't people afraid of climate change or something?"],
    [() => player.aca.modLevel + player.aca.modActive >= 1, "I wonder where thefinaluptake went..."],

    // despacit
    [() => player.aca.modLevel + player.aca.modActive >= 2, "Why is this game so hard? <i>-impatient idle game player</i>"],
    [() => player.aca.modLevel + player.aca.modActive >= 2, () => "\"OMG HOW IN THE LOVE OF VIDEO GAMES DID YOU MANAGE TO GET YOUR BASE TO " + format(player.points).toUpperCase() + " POWER??!!?!?!?!?!?!!???1!???\" \"I just play the game normally lmao\""],
    [() => player.aca.modLevel + player.aca.modActive >= 2, "Enter the code \"fumolation40000\" to get your free 40000 fumos now! (legal notice: the fumos are all fictional and are just an abstract number on a screen)"],
    [() => player.aca.modLevel + player.aca.modActive >= 2, "Our news ticker guy is on vacation<div style='display:inline-block;width:20vw'></div>please still keep it on"],
    [() => player.aca.modLevel + player.aca.modActive >= 2, "| 10 &nbsp; &nbsp; | <r>42069</r>&nbsp; | &nbsp; &nbsp; &nbsp; HOW TO LOOT?&trade;"],
    [() => player.aca.modLevel + player.aca.modActive >= 2, "Those low-quality news really drive you mad huh. The news messages looks so intresting in the ad. But when you enable it, it's a totally different sets of news! That's crazy, right? But today, I finally found the news ticker hat is exactly the same as it ' s shown in the ads. It's high-quality and intresting. You don't believe me? Alright let me show you. I want that inside joke! Oh, not the right news message. Inside joke! Inside joke! Ah, it really takes some luck to pull this off. Come and read the news with me! The Communitree - let the news begin!"],
    [() => player.aca.modLevel + player.aca.modActive >= 2, "I paid brain cells to write this news message<div style='display:inline-block;width:20vw'></div>Please, try our news ticker"],

    // thepaperpilot
    [() => player.aca.modLevel + player.aca.modActive >= 3, "Help I'm trapped inside a video game's news ticker factory"],
    [() => player.aca.modLevel + player.aca.modActive >= 3, "Bonus points? What is that?"],
    [() => player.aca.modLevel + player.aca.modActive >= 3, "Made in Profectus <i>-thepaperpilot</i> <i style='display:inline-block;transform:skewX(-20deg)'>-thepaperpilot</i>"],
    [() => player.aca.modLevel + player.aca.modActive >= 3, "<a href='https://mastodon.gamedev.place/@ducdat0507'>Follow me on the Fediverse!</a>"],

];

if (((new Date()).getMonth() == 3 && (new Date()).getDay() == 1)) newsEntries =  [

    [true, '<iframe width="0" height="0" src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1" title="YouTube video player" frameborder="0" allow="autoplay;encrypted-media;" allowfullscreen></iframe>never gonna give you up never gonna let you down get rique rolled haha gottem lmao lol kekwlksfxprvbkzwqlfvkgckbtpykwvmzpbcxd what am i doing with my life'],

];

function updateNewsTicker(diff, force) {
    newsTicker.new = false;
    if (force || !newsTicker.current[1] || newsTicker.pos + 50 < -(document.getElementById("newsmessage")?.offsetWidth || 0)) {
		newsTicker.current = newsEntries[force || Math.floor(Math.random() * newsEntries.length)];
        if (!force) while (!run(newsTicker.current[0])) newsTicker.current = newsEntries[Math.floor(Math.random() * newsEntries.length)];
        newsTicker.current = run(newsTicker.current[1]);
		newsTicker.pos = window.innerWidth + 50;
        newsTicker.new = true;
    }
    newsTicker.pos -= diff * 150;
}