/*

 @name    : 锅巴汉化 - Web汉化插件
 @author  : 麦子、JAR、小蓝、好阳光的小锅巴
 @version : V0.6.1 - 2019-07-09
 @website : http://www.g8hh.com

*/

//1.汉化杂项
var cnItems = {
    _OTHER_: [],

    //未分类：
    'Save': '保存',
    'Export': '导出',
    'Import': '导入',
    'Settings': '设置',
    'Achievements': '成就',
    'Statistics': '统计',
    'Changelog': '更新日志',
    'Hotkeys': '快捷键',
    'ALL': '全部',
    'Default': '默认',
    'AUTO': '自动',
    'Got it!': '知道了！',
    'points': '点数',
    'Jacorb points': 'Jacorb点',
    'Main': '首页',
    'Reset for +': '重置获得 +',
    'Start.': '开始.',
    'Currently': '当前',
    'Initialize.': '初始化。',
    'Point gain is boosted by your Jacorb points.': '您的Jacorb点数会提高点数增益。',
    'Coding.': '编码。',
    'Point gain is boosted by your points.': '您的点数会增加点数收益。',
    'Release.': '发布。',
    'Let there be an Universe!': '要有一个宇宙！',
    'Self-Prestige': '自我声望',
    'Unlocks 3 new Prestige Tree layers.': '解锁3个新声望树层',
    'Gain 1% of your prestige points gain on reset every second.': '每秒重置时获得声望点数的 1%。',
    'Increase Self-Conversion and Self-Prestige speed by ten-fold.': '将自我转化和自我声望速度提高10倍。',
    'Self-Accelerator': '自我加速器',
    'Acceleron Generators': '加速器发生器',
    'Increase Generator speed by five-fold.': '将发生器速度提高五倍。',
    'Currently on a quest...': '目前正在任务中…',
    'Dekeract Candies': 'Dekeract 糖果',
    'Determination': '决心',
    'Difficulty 999,999,999,999': '难度 999,999,999,999',
    'Discover the magic of lollipops.': '发现棒棒糖的魔力。',
    'Divides enemies\' health by your POW per quest tick.': '每个任务周期将敌人的生命值除以你的力量。',
    'Double candy gain.': '双倍糖果收益。',
    'Drop candies boost your candies.': '掉落糖果提升你的糖果。',
    'Drop candies boosts': '掉落糖果提升',
    'Drop candies boosts farm candies.': '掉落糖果会提升农场糖果。',
    'Drop candies boosts your lollipops.': '掉落糖果可以提升你的棒棒糖。',
    'Eat all the candies!': '吃掉所有糖果！',
    'Enhance': '强化',
    'You drank the Candy Tab': '你喝了糖果标签',
    'You decided to drink it.': '你决定喝了它。',
    'You teleports to the next enemy or quest automatically.': '你会自动传送到下一个敌人或任务。',
    'You\'re feeling a lot stronger now, but you have a strange feeling that something else has happened.': '你现在感觉更强壮了，但你有一种奇怪的感觉，好像发生了其他事情。',
    'Your candies boost your candies.': '你的糖果提升你的糖果。',
    'Your lollipops boost your candies.': '你的棒棒糖提升你的糖果。',
    'Your candies boost your lollipops.': '你的糖果提升你的棒棒糖。',
    'Your lollipops boost your lollipops.': '你的棒棒糖提升你的棒棒糖。',
    'Your POW is boosted by candies eaten.': '你的力量通过吃掉的糖果获得提升。',
    'Your POW is boosted by you farm candies.': '你的力量通过种植的糖果获得提升。',
    'Farm candies boost your candies.': '农场糖果提升你的糖果。',
    'Corpses as Fertilizer': '尸体作为肥料',
    'Farming': '农场',
    'Farm Lollipops': '农场棒棒糖',
    'Farmed Lollipops': '种植的棒棒糖',
    'grows by 3 seconds when you kill an enemy.': '当你杀死一个敌人时，它会生长 3 秒。',
    'grows by 30 seconds when you complete a quest.': '但你完成一个任务时，它会生长 30 秒。',
    'Improved Fertilizer': '改良肥料',
    'Learn to Control Your Magic': '学会控制你的魔法',
    'Lollidrops': '棒棒糖',
    'Lollipops boosts farm candy gain.': '棒棒糖增加了农场糖果的收益。',
    'Loyal Customer': '忠诚客户',
    'Magic Lollipops': '魔法棒棒糖',
    'Magic Candies, for real': '魔法糖果，真的',
    'Magical Farm Candies': '魔法农场糖果',
    'More Space to Farm': '更多的耕作空间',
    'Non-stop Knight': '永不停止的骑士',
    'Not Just About Planting': '不仅仅是种植',
    'Questing': '任务',
    'Quest Lollipops': '任务棒棒糖',
    'Quest Reward': '任务奖励',
    'real': '真实',
    'Time Ring': '时间戒指',
    'Teleportation Ring': '传送戒指',
    'Unlock Farming.': '解锁农场。',
    'Unlock Enhancement.': '解锁强化。',
    'A Key to the Farm': '农场的钥匙',
    'Acamaeda points': 'Acamaeda点数',
    'Ask the dev to add upgrades.': '要求开发人员添加升级。',
    'Automagically start quests right after you finish them.': '完成任务后立即自动开始任务。',
    'Berserk Mode and Sword of Midas are boosted based on their time remaining.': '狂暴模式和迈达斯之剑根据剩余时间进行提升。',
    'Berserk Mode, Sword of Midas and Spell Bonanza are boosted by your candies.': '狂暴模式、迈达斯之剑和法术富矿都因你的糖果而增强。',
    'Candies are Good for Your Health': '糖果对您的健康有益',
    'Candy is Magic': '糖果是魔法',
    'Farm candies boosts your lollipops.': '农场糖果可以提升你的棒棒糖。',
    'Candybound': '糖果界',
    'Magical Drop Candies': '神奇的掉落糖果',
    'No. \\O_O/': '不. \\O_O/',
    'Obesity': '肥胖',
    'Quest Difficulty boosts farm candy gain.': '任务难度提高农场糖果收益。',
    'Quest Reward Reward': '任务奖励奖励',
    "Wannabe": "崇拜者",
    'Self-Replicating Candies': '自我复制糖果',
    'Spell Bonanza gets stronger based on time remaining.': '法术富矿根据剩余时间变得更强。',
    'Spell of Spells': '魔咒中的魔咒',
    'Study the Magic of the Candies': '学习糖果的魔力',
    'The Candy Merchant': '糖果商人',
    'The Candy Tab': '糖果标签',
    'This isn\'t in the original game?': '这不是在原版游戏中吗?',
    'Throw 10 candies on the ground': '扔10颗糖果在地上',
    'Time for a Quest!': '是时候进行任务了！',
    'Unlock Questing.': '解锁任务。',
    'Unlocks more farm buidings.': '解锁更多农场建筑。',
    'Unlocks spells in questing, which you can cast with the cost of your HP.': '在任务中解锁法术，你可以用你的生命值来施放。',
    'Unlocks the Candy Tab, like, the': '解锁糖果标签，例如',
    'Vegetable-Flavored Candies': '蔬菜味糖果',
    'When you use the Time Speed-up spell, all candy productions are boosted by 10×.': '当您使用时间加速法术时，所有糖果产量都会提高 10 倍。',
    'Windmills and Lolligators boost farm candy gain.': '风车和游荡者提升农场糖果的收益。',
    'You can make your base magic cost higher to increase your spells\' time.': '你可以提高你的基础魔法成本来增加你的法术时间。',
    'You can now heal yourself, even in quests.': '你现在可以治愈自己，即使是在任务中。',
    'You unlock Phantom Souls immediately, but you lose the ability to unlock other previous layers besides \n                Phantom Souls and Prestige Points and most of the upgrades after': '你立即解锁幻魂，但你将无法解锁除\n 幻魂和声望点之外的其他先前层以及之后的大部分升级',
    'windmills\n                \n                which are giving you 10↑↑10↑31.84× more candies, based on lollipops.\n                \n                Costs 4.909×10↑15 farm candies': '风车\n \n 给你 10↑↑10↑31.84× 个更多糖果，基于棒棒糖。\n \n 成本 4.909×10↑15 个农场糖果',
    'Unlocks The Candy Tab.': '解锁糖果标签。',
    'Simplify Things a Bit': '稍微简化一下',
    'Aarex points': 'Aarex点数',
    'Berserk Mode\'s duration multiplies': '狂暴模式的持续时间成倍增加',
    ' GOAL': ' 目标',
    ' EFFECT': ' 效果',
    ' CURRENTLY': ' 当前',
    'Requires maxing the current one': '需要最大化当前的',
    'Squares Windmills and Lolligator\'s effect and multiplies them by farm candies.': '广场风车和Lolligator的效果和农场糖果它们相乘。',
    'Time Reversal is always active.': '时间反转始终处于活动状态。',
    'Time Reversal scales better.': '时间倒转效果更好。',
    'Spell Allocation': '法术分配',
    '[ > ENEMY < ]': '[ > 敌人 < ]',
    '[\\o/ <-- You]': '[\\o/ <-- 你]',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    'NO ENEMY': '没有敌人',
    '\'s effect.': '的效果。',
    '\'s effect is boosted by your lollipops.': '的效果提升通过你的棒棒糖。',
    '\'s effect is boosted by your candies eaten.': '的效果提升通过你吃掉的糖果。',
    '\'s base effect is raised by ^10.': '的基础效果提高了 ^10。',
    '\'s base effect is boosted by time since this upgrade was bought.': '基础效果会随着时间而增强，自从购买此升级后。',
    'Quest Rune': '任务符文',
    'Quest Difficulty scales faster.': '任务难度增加得更快。',
    'Quest Difficulty multiplies Time Reversal\'s effect.': '任务难度乘以时间逆转的效果。',
    'Max out lolligators.': '超出最大lolligators',
    'Make Spell Bonanza lasts at least a millennium.': '使法术富矿持续至少一千年。',
    'Make Berserk Mode lasts at least a millennium.': '使狂暴模式持续至少一千年。',
    'Make Berserk Mode lasts 1.000e25 years.': '使狂暴模式持续 1.000e25 年。',
    'Farm candies multiplies drop candies.': '农场糖果乘以掉落糖果。',
    'Farm candies are boosted by itself.': '农场糖果提升了自身。',
    'Drop Candies multiplies you candy and lollipop production.': '掉落糖果使您的糖果和棒棒糖产量成倍增加。',
    'Boost to drop candy gain, based on time since you have this achievement.': '根据您获得此成就后的时间，提升以减少糖果收益。',
    'phantom souls\n\n                    Currency.\n\n                    Reset previous progress for +': '幻魂\n\n 货币。\n\n 重置之前的进度 + ',
    '10× point gain per second. You gain points regardless of the first upgrade.': '每秒 10 倍点数增益。 无论第一次升级如何，您都会获得点数。',
    '. In exchange,\n                your point production is MASSIVELY boosted based on Jacorb reset time, Aarex reset time and Aarex \n                balancing. You also now gain Phantom Souls based on Prestige Points instead of Quirk effect.': '. 作为交换，\n 你的点数产量会根据 Jacorb 重置时间、Aarex 重置时间和 Aarex \n 平衡而大幅提升。 你现在也可以根据声望点获得幻影之魂而不是怪癖效果。',
    'Unlocks a new tab.': '解锁一个新标签页',
    'Unlocks 2 new Prestige Tree layers.': '解锁2个新的声望树层',
    'The Prestige Tree': '声望树',
    'Self-Conversion': '自我转化',
    'Layer Unlock': '层解锁',
    'Gain 1% of your Jacorb points gain on reset every second.': '每秒重置时获得 1% 的 Jacorb 点数增益。',
    'Jacorb point gain is boosted by your points.': '您的点数会增加Jacorb点数。',
    'You start getting 1 (all-purpose) point every second.': '您开始每秒获得 1 个（通用）点数。',
    '\t\t(the gear icon in the top-left corner': '\t\t(在左上角的齿轮图标',
    '\t\tTo prevent this, turn on \"Anti-Epilepsy Mode\" in the settings tab.': '\t\t为了防止这种情况，在设置选项卡中打开\“抗癫痫模式”。',
    '\t\tImportant notice: Some parts of the game may contain flashing lights.': '\t\t重要提示:游戏的某些部分可能包含闪烁的灯光。',

    //树游戏
    'Loading...': '加载中...',
    'ALWAYS': '一直',
    'HARD RESET': '硬重置',
    'Export to clipboard': '导出到剪切板',
    'INCOMPLETE': '不完整',
    'HIDDEN': '隐藏',
    'AUTOMATION': '自动',
    'NEVER': '从不',
    'ON': '打开',
    'OFF': '关闭',
    'SHOWN': '显示',
    'Play Again': '再次游戏',
    'Keep Going': '继续',
    'The Modding Tree Discord': '模型树Discord',
    'You have': '你有',
    'It took you {{formatTime(player.timePlayed)}} to beat the game.': '花费了 {{formatTime(player.timePlayed)}} 时间去通关游戏.',
    'Congratulations! You have reached the end and beaten this game, but for now...': '恭喜你！ 您已经结束并通关了本游戏，但就目前而言...',
    'Main Prestige Tree server': '主声望树服务器',
    'Reach {{formatWhole(ENDGAME)}} to beat the game!': '达到 {{formatWhole(ENDGAME)}} 去通关游戏!',
    'Please check the Discord to see if there are new content updates!': '请检查 Discord 以查看是否有新的内容更新！',
    'Main\n\t\t\t\tPrestige Tree server': '原始\n\t\t\t\t声望树服务器',
    'The Modding Tree\n\t\t\t\t\t\t\tDiscord': '模型树\n\t\t\t\t\t\t\tDiscord',
    '': '',
    '': '',
    '': '',
    '': '',

}


//需处理的前缀
var cnPrefix = {
    "(-": "(-",
    "(+": "(+",
    "(": "(",
    "-": "-",
    "+": "+",
    " ": " ",
    ": ": "： ",
    "\n": "",
    "                   ": "",
    "                  ": "",
    "                 ": "",
    "                ": "",
    "               ": "",
    "              ": "",
    "             ": "",
    "            ": "",
    "           ": "",
    "          ": "",
    "         ": "",
    "        ": "",
    "       ": "",
    "      ": "",
    "     ": "",
    "    ": "",
    "   ": "",
    "  ": "",
    " ": "",
    //树游戏
    "Show Milestones: ": "显示里程碑：",
    "Autosave: ": "自动保存: ",
    "Offline Prod: ": "离线生产: ",
    "Completed Challenges: ": "完成的挑战: ",
    "High-Quality Tree: ": "高质量树贴图: ",
    "Offline Time: ": "离线时间: ",
    "Theme: ": "主题: ",
    "Anti-Epilepsy Mode: ": "抗癫痫模式：",
    "In-line Exponent: ": "直列指数：",
    "Single-Tab Mode: ": "单标签模式：",
    "Loading... (If this takes too long it means there was a serious error!)": "正在加载...（如果这花费的时间太长，则意味着存在严重错误！）",
    "prestige points": "声望点",
    "Enhance weapon (": "强化武器 (",
    "Candy Tab": "糖果标签",
    "Quest Rune ": "任务符文",
    "Start... again": "重新... 开始",
    "Spell Rune": "法术符文",
    "Aarex balancing": "Aarex平衡",
    "The Communitree!": "社区树！",
    "Farm Rune": "农场符文",
    "Reach Quest Difficulty ": "达到任务难度 ",
    "Trade your weapon for a better one (": "用你的武器换一个更好的（",
    'Base HP': '基础生命值',
    "POW ": "力量 ",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
}

//需处理的后缀
var cnPostfix = {
    ":": "：",
    "：": "：",
    ": ": "： ",
    "： ": "： ",
    "/s)": "/s)",
    "/s": "/s",
    ")": ")",
    "%": "%",
    "                   ": "",
    "                  ": "",
    "                 ": "",
    "                ": "",
    "               ": "",
    "              ": "",
    "             ": "",
    "            ": "",
    "           ": "",
    "          ": "",
    "         ": "",
    "        ": "",
    "       ": "",
    "      ": "",
    "     ": "",
    "    ": "",
    "   ": "",
    "  ": "",
    " ": " ",
    "\n": "",
    " Jacorb points": "Jacorb点",
    " years": " 年",
    " Acamaeda points": " Acamaeda点",
    " Aarex points": " Aarex点",
    "(you can\'t reach any higher than this).": "（你不能达到比这更高的水平）。",
    'Max HP': '生命值上限',
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
}

//需排除的，正则匹配
var cnExcludeWhole = [
    /^(\d+)$/,
    /^([\d\.]+)e(\d+)$/,
    /^([\d\.]+)$/,
    /^([\d\.]+)×(\d+)↑(\d+)$/,
    /^×([\d\.]+)×(\d+)↑(\d+)$/,
    /^×([\d\.]+)$/,
    /^\^([\d\.,]+)$/,
    /^\^([\d\.]+)e([\d\.,]+)$/,
    /^([\d\.]+)m ([\d\.]+)s$/,
    /^([\d\.]+)s$/,
    /^([\d\.,]+)$/,
    /^×([\d\.,]+)$/,
    /^\\o\/(.+)$/,
];
var cnExcludePostfix = [
]

//正则替换，带数字的固定格式句子
//纯数字：(\d+)
//逗号：([\d\.,]+)
//小数点：([\d\.]+)
//原样输出的字段：(.+)
//换行加空格：\n(.+)
var cnRegReplace = new Map([
	[/^Cost: (.+) candies\n\t\t\t$/, '成本: $1 糖果\n\t\t\t'],
	[/^Cost: (.+) lollipops\n\t\t\t$/, '成本: $1 棒棒糖\n\t\t\t'],
	[/^Cost: (.+) drop candies\n\t\t\t$/, '成本: $1 掉落糖果\n\t\t\t'],
	[/^Cost: (.+) Aarex balancing\n\t\t\t$/, '成本: $1 Aarex平衡\n\t\t\t'],
	[/^Cost: (.+) Aarex points\n\t\t\t$/, '成本: $1 Aarex点数\n\t\t\t'],
	[/^phantom souls\n(.+)Next at ×(.+) prestige points$/, '幻魂\n 下一个在 ×$2 声望点'],
	[/^(.+) lollipops \+ (.+) drop candies$/, '$1 棒棒糖 \+ $2 掉落糖果'],
	[/^Reach (.+) farm candies.$/, '达到 $1 农场糖果。'],
	[/^windmills\n(.+)\n(.+)which are giving you (.+)× more candies, based on lollipops.\n(.+)\n(.+)Costs (.+) farm candies$/, '风车\n \n 给你 $3× 更多糖果，基于棒棒糖。\n \n 花费 $6 农场糖果'],
	[/^You have (.+) candies$/, '你有 $1 糖果'],
	[/^You have (.+) lollipops$/, '你有 $1 棒棒糖'],
	[/^Trade all your candies for (.+) lollipops$/, '用你所有的糖果换 $1 棒棒糖'],
	[/^([\d\.]+)\/sec$/, '$1\/秒'],
    [/^requires ([\d\.]+) more research points$/, '需要$1个研究点'],
    [/^Current endgame: (.+) points$/, '当前结局：$1 点数'],
    [/^prestige points\n\n(.+)which are giving a ×(.+) boost to point gain.\n\n(.+)Reset Jacorb points for \+$/, '声望点\n\n 给予点数增益 ×$2。\n\n 重置Jacorb点数为 \+'],
    [/^farm candy farms\n(.+)\n(.+)which are giving (.+) farm candies per hour.\n(.+)\n(.+)Costs (.+) farm candies$/, '农场糖果农场\n \n 每小时提供 $3 个农场糖果。\n \n 花费 $6 个农场糖果'],
    [/^Berserk Mode\n(.+)\n(.+)Infect yourself with dark magic to become a berserker, which makes yourself (.+)× stronger.\n(.+)\n(.+)Costs (.+) \+ (.+)\% of your max HP\n(.+)\((.+)$/, '狂暴模式\n \n 用黑暗魔法感染自己成为狂暴者，这使你自己变得更强 $3×。\n \n 消耗 $6 \+ $7\% 最大生命值\n \($9'],
    [/^Healing Candy\n(.+)\n(.+)Enchant one of your candy with healing properties, and heal yourself (.+)× faster. There is a 60 second cooldown between uses.\n(.+)\n(.+)Costs (.+) \+ (.+)\% of your max HP\n(.+)\((.+)$/, '治疗糖果\n \n 为你的一颗糖果附魔，使其具有治疗效果，治疗速度提高 $3 倍。 两次使用之间有 60 秒的冷却时间。\n \n 消耗 $6 \+ 最大生命值的 $7\%\n \($9'],
    [/^Spell Bonanza\n(.+)\n(.+)Cast a spell that would make other spells stronger, making Beserk Mode and Sword of Midas (.+)× stronger. There is a 60 second cooldown between uses.\n(.+)\n(.+)Costs (.+) \+ (.+)\% of your max HP\n(.+)\((.+)$/, '法术富矿\n \n 施放一个可以使其他法术更强大的法术，使狂暴模式和迈达斯之剑 $3× 更强。 两次使用之间有 60 秒的冷却时间。\n \n 消耗 $6 \+ 最大生命值的 $7\%\n \($9'],
    [/^Sword of Midas\n(.+)\n(.+)Turns all the drop candies dropped by an enemy into gold, therefore making them worth (.+)× more.\n(.+)\n(.+)Costs (.+) \+ (.+)\% of your max HP\n(.+)\((.+)$/, '迈达斯之剑\n \n 将敌人掉落的所有掉落糖果变成金币，从而使它们的价值增加 $3×。\n \n 消耗 $6 \+ 最大生命值的 $7\%\n \($9'],
    [/^lolligators\n(.+)\n(.+)which are giving you (.+)× more lollipops, based on candies.\n(.+)\n(.+)Costs (.+) farm candies$/, '棒棒糖\n \n 基于糖果，它们会为您提供 $3 倍以上的棒棒糖。\n \n 花费 $6 个农场糖果'],
    [/^lollipop farms\n(.+)\n(.+)which are giving 100\% of your lollipops gained on trade each second, plus a extra (.+) farm candies per hour.\n(.+)\n(.+)Costs (.+) farm candies$/, '棒棒糖农场\n \n 每秒提供 100\% 通过交易获得的棒棒糖，以及每小时额外 $3 个农场糖果。\n \n 花费 $6 个农场糖果'],
    [/^([\d\.,]+)\/sec$/, '$1\/秒'],
    [/^([\d\.]+)×(\d+)↑(\d+)\/sec$/, '$1×$2↑$3\/sec秒'],
    [/^Cost: (.+) prestige points\n\t\t\t$/, '成本: $1 声望点\n\t\t\t'],
    [/^([\d\.]+)h ([\d\.]+)m ([\d\.]+)s$/, '$1小时 $2分 $3秒'],
    [/^Next at (.+) points$/, '下一个在 $1 点数'],
    [/^Time Reversal\n(.+)\n(.+)Reverse the time and therefore your magic consumption, making all spell remaining times increase at (.+)× the speed instead of decrease, except this spell. There is a 90 second cooldown between uses.\n(.+)\n(.+)Costs (.+)\% of your max HP\n(.+)\((.+)$/, '时间逆转\n \n 逆转时间，从而逆转你的魔法消耗，使所有法术剩余时间增加 $3× 速度而不是减少，除了这个法术。 两次使用之间有 90 秒的冷却时间。\n \n 消耗 $6\% 的最大生命值\n \($8'],
    [/^Time Speed-up\n(.+)\n(.+)Disturb the flow of time to make it flow faster, which makes actions in quests 2× faster.\n(.+)\n(.+)Costs (.+) \+ (.+)\% of your max HP\n(.+)\((.+)$/, '时间加速\n \n 扰乱时间的流动，使其流动得更快，这使任务中的行动速度提高 2 倍。\n \n 消耗 $5 \+ $6\% 最大生命值\n \($8'],
    [/^generators\n\n(.+)which are giving a ×(.+) boost to prestige point gain, slowly increases over this Jacorb reset.\n\n(.+)Reset prestige points for \+$/, '生成器\n\n 为声望点增益提供 ×$2 提升，在此 Jacorb 重置后缓慢增加。\n\n 重置声望点数为 \+'],
    [/^prestige points\n(.+)Next at (.+)$/, '声望点\n下一个在 $2'],
    [/^boosters\n\n(.+)which are giving a ×(.+) boost to prestige point gain. \n\n(.+)Reset prestige points for \+$/, '助推器\n\n 为声望点增益提供 ×$2 提升。 \n\n 重置声望点获得 \+'],
    [/^boosters\n(.+)Next at (.+) prestige points$/, '助推器\n 下一个在 $1 声望点'],
    [/^Cost: (.+) Jacorb points\n\t\t\t$/, '成本: $1 Jacorb点\n\t\t\t'],
    [/^\n\n(.+)which are giving a ×(.+) boost to point gain.\n\n(.+)Reset Jacorb points for \+$/, '\n\n 增加了 ×$2 点增益。\n\n 重置 Jacorb 点数为 \+'],
    [/^\n(.+)Next at (.+)$/, '\n下一个在 $2'],
    [/^(\d+) Royal points$/, '$1 皇家点数'],
    [/^Cost: (\d+) RP$/, '成本：$1 皇家点数'],
    [/^Usages: (\d+)\/$/, '用途：$1\/'],
    [/^workers: (\d+)\/$/, '工人：$1\/'],

]);