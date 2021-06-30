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
    'maxing the current one': '最大化当前的',
    'Squares Windmills and Lolligator\'s effect and multiplies them by farm candies.': '广场风车和Lolligator的效果和农场糖果它们相乘。',
    'Time Reversal is always active.': '时间反转始终处于活动状态。',
    'Time Reversal scales better.': '时间倒转效果更好。',
    'Spell Allocation': '法术分配',
    '[ > ENEMY < ]': '[ > 敌人 < ]',
    '[\\o/ <-- You]': '[\\o/ <-- 你]',
    'EVER': '曾经',
    'Expected Synergy': '预期协同作用',
    'Farm candies boosts': '农场糖果提升',
    'forever and ever and Ever and': '永远永远永远永远永远',
    'gain Acamaeda points, as if you do a reset each second.': '获得 Acamaeda点数，就像您每秒进行一次重置一样。',
    'New Beginning': '新的开始',
    'Gain your amount of Jacorb points equal to your Acamaeda points on Acamaeda resets. Jacorb upgrades are bought automagically.': '在 Acamaeda 重置时获得与 Acamaeda 点数相等的 Jacorb 点数。 Jacorb 升级是自动购买的。',
    'No Longer Useless': '不再无用',
    'The Last One': '最后一个',
    'The Modding Tree': '模型树',
    'The Most Ambitious Cross-over in the History of Incremental Games,': '增量游戏史上最雄心勃勃的跨界游戏，',
    'Unlocks the “The Modding Tree” tab.': '解锁“模型树”选项卡。',
    '\'s points based on best Acamaeda points.': '的点数基于最佳 Acamaeda 点数。',
    '\'s points based on total Acamaeda points.': '的点数基于总计 Acamaeda 点数。',
    '\'s power.': '的力量。',
    '\'s time based on Acamaeda points.': '的次数基于 Acamaeda 点数。',
    '\'s time based on Acamaeda reset time.': '的次数基于 Acamaeda 重置次数。',
    '\'s time based on time since played.': '的次数基于已玩的时间。',
    '\'s effect': '的效果',
    '\'s effect based on Acamaeda points.': '的效果基于 Acamaeda 点数。',
    'Another Generation': '另一代',
    'Are We Forgetting the Main Game?': '我们是否忘记了主游戏？',
    'Automagically': '自动地',
    'Automatically gains Aarex points. Aarex points boost': '自动获得 Aarex 点数。 Aarex 点数提升',
    'Automatically gains Phantom Souls. Phantom Souls boost': '自动获得幻魂。 幻魂提升',
    'Boost to': '提升到',
    'Boost to all previous boosts based on Acamaeda reset time.': '根据 Acamaeda 重置时间提升到所有先前的提升。',
    'Boost to point gain based on Acamaeda reset time.': '根据 Acamaeda 重置时间提升到点增益。',
    'are easier based on': '更容易基于',
    'are easier based on its amount.': '更容易基于其数量。',
    'Boost to dev speed based on connected upgrades.': '基于连接升级提高开发速度。',
    'Buyable Challenges?': '可购买的挑战？',
    'Buyables': '可购买',
    'Challenge Buyables': '挑战可购买',
    'Challenge Upgrades': '挑战升级',
    'Challenge Milestones': '挑战里程碑',
    'Challenges': '挑战',
    'Components': '组件',
    'Development speed multiplies component points, thrice.': '开发速度乘以组件点数，三倍。',
    'Easier Challenges': '更容易的挑战',
    '\' amount.': '数量。',
    '\' effect boosts': '效果提升',
    '\' effect.': '效果。',
    'Just an Upgrade': '只是一个升级',
    'Modders': '游戏模组',
    'Milestones': '里程碑',
    'Respec upgrades, but reset your component points': '重洗升级，但重置你的组件点',
    'The previous two upgrades above boosts': '以上前两次升级提升',
    'Tree of Content': '内容树',
    'Upgrade Buyables': '升级可购买',
    'Upgrade Milestones': '升级里程碑',
    'Upgrade Tree': '升级树',
    'Upgrade Upgrades': '升级升级',
    'Upgrades': '升级',
    'Your development speed is': '你的开发速度',
    'Multiplies first three components\' effect based on component points\' effect.': '根据组件点的效果将前三个组件的效果相乘。',
    'Note: Buying an upgrade increases the cost of all upgrades in the same row!': '注意:购买一个升级会增加同一行所有升级的成本!',
    'Columns': '列',
    'and': '和',
    'Microtabs': '微标签',
    'Rows': '行',
    'Subtabs': '子标签',
    'thefinaluptake': '最后的吸收',
    'Unlock a Modder!': '解锁一个模组！',
    'You can buy max Boosters and Generators.': '您可以购买最大的助推器和发生器。',
    'True Prestige Tree': '真声望树',
    'Booster and Generator resets no longer reset.': '助推器和发生器重置不再重置。',
    'Booster Generators': '助推器发生器',
    'Boosters and Generators are claimed automatically.': '助推器和发生器会自动领取。',
    'Generator Boosters': '发生器助推器',
    'It Gets Better': '变得更好了',
    'Let there be Life!': '要有生命！',
    'Lossless Conversion': '无损转换',
    'Makes Boosters and Generators boost points.': '使助推器和发生器提升点数。',
    'Points decrease the cost of Boosters and Generators.': '点数降低了助推器和发生器的成本。',
    'Quick Cash': '快速赚钱',
    'Real Prestige Tree': '真正的声望树',
    'Supercharge': '超负荷',
    'Boosters increase the speed of Generators by +2.5% each, up to +25×.': '每个助推器增加发生器的速度+2.5%，最多 +25x。',
    'Generators increase the multiplier per each booster by +.8% each, up to +3.': '发生器将每个助推器的乘数增加 +0.8%，最多 +3。',
    'quirks\n                    ': '夸克\n                    ',
    'enhance points\n                    ': '增强点\n                    ',
    'Let there be Light!': '要有光！',
    'Quality Enhancement': '品质提升',
    'Quirk and Hindrance Spirits boosts each other\'s gain.': '夸克和精神障碍会提高彼此的收益。',
    'Quirkier': '更为离奇',
    'Row 4 Synergy': '第 4 行协同作用',
    'Super-Booster effect multiplies Hindrance Spirit gain.': '超级助推器效果乘以精神障碍增益。',
    'Super-Boosters no longer resets, gets auto-claimed and you can buy max them.': '超级助推器不再重置，自动领取，您可以购买最多。',
    'Super-Generators no longer resets and are auto-buy^2-max^2-able.': '超级发生器不再重置并且可以自动购买^2-max^2-able',
    'The quirks in the quirk formula increases from ^0.6 to ^1 in 120 seconds in this Jacorb reset.': '在此 Jacorb 重置中，夸克公式中的夸克在 120 秒内从 ^0.6 增加到 ^1。',
    'The Ultimate Quality of Life': '终极生活品质',
    'Time Capsules and Space Energy no longer resets, gets auto-claimed and you can buy max them.': '时间胶囊和空间能量不再重置，得到自动认领，你可以购买最大。',
    'Unfail Advantage': '永不失败的优势',
    'Unlock 2 new Prestige Tree layers.': '解锁 2 个新的声望树层。',
    'Unlocks 3 new Prestige Tree layers. You should enable force single tab mode by now, this upgrade grid is getting big.': '解锁 3 个新的声望树层。 你现在应该启用强制单标签模式，这个升级网格越来越大。',
    'Well That Was Quick': '速度惊人',
    'Gain 5% of your enhance points gain on reset every second.': '每秒重置时获得 5% 的增强点增益。',
    'Exotic Acceleron Generators': '异国情调的加速器发生器',
    '100× generator speed.': '100×发生器速度。',
    '^0.02 of your Generator and Booster effect multiplies the first four upgrades\' effects.': '^0.02 的发生器和助推器效果乘以前四个升级的效果。',
    '^0.02 of your Prestige Point effect multiplies the first four upgrades\' effects.': '^0.02 的声望点效果乘以前四个升级的效果。',
    '^0.1 of your Enhance Point effect multiplies the first four upgrades\' effects.': '^0.1 的增强点效果乘以前四个升级的效果。',
    '^10 of your Quirk effect multiplies the first four upgrades\' effects.': '^10你的夸克效果乘以前四个升级的效果。',
    'Boosting in Bulk': '批量提升',
    'Not Layer Unlock': '不是层解锁',
    'Classic': '经典',
    'Magic and Balance Energy boosts each other\'s gain.': '魔法和平衡能量可以提升彼此的增益。',
    'Hindrance Quirks': '夸克障碍',
    'hindrance spirits\n                    ': '精神障碍\n                    ',
    'All Row 4 and higher layers that is based on Jacorb reset time are boosted by 100×.': '所有基于 Jacorb 重置时间的第 4 行和更高层都提升了 100 倍。',
    'Apply previous upgrade once again, but this time it\'s only 10×.': '再次应用之前的升级，但这次只是 10 ×。',
    'boosters\n                    ': '助推器\n                    ',
    'effects multiplies each of the': '效果乘以每一个',
    'effects.': '效果.',
    'Hindrance Quirks': '夸克障碍',
    'hindrance spirits\n                    ': '精神障碍\n                    ',
    'Lifelight': '生命之光',
    'Quirk Accelerator': '夸克加速器',
    'Quirk Accelerator... again': '夸克加速器...再次',
    'Row 4 Row 5': '第 4 行 第 5 行',
    'Row 5 Synergy': '第 5 行协同作用',
    'Solar Solution': '太阳能解决方案',
    'Solarity gain on reset multiplies Hindrance Spirit gain.': '重置时获得的阳光增益会乘以障碍精神增益。',
    'Subspace Energy are auto-buy-maxed. Balance Energy requirements are reduced.': '子空间能量是自动购买的。 平衡能量需求减少。',
    'Unlocks 1 new Prestige Tree layer.': '解锁 1 个新的声望树层。',
    'You gain 10% of your Hindrance Spirit and Quirk gain on reset each second.': '你每秒在重置时获得 10% 的精神障碍和夸克。',
    'You gain 10% of your Solarity gain on reset each second.': '每秒重置时获得 10% 的日照度增益。',
    '^5 of the product of the': '^ 5 的生产对于',
    'magic\n                    ': '魔法\n                    ',
    'solarity\n                    ': '日照\n                    ',
    'balance energy\n                    ': '平衡能量\n                    ',
    'D-Did the Game just Inflated?': 'D-游戏刚刚膨胀了吗？',
    'How Much?': '多少？',
    'Hyper Boosters are auto-buy-maxed and no longer resets.': '顶级助推器已自动购买到最大值，不再重置。',
    'You gain your Magic and Balance Energy gain on reset.': '你在重置时获得魔法和平衡能量增益。',
    ' boosts Aarex balancing gain.': '提高 Aarex 平衡增益。',
    ' plus 1 boosts Jacorb point gain.': '加 1 提升Jacorb点数增益。',
    ' plus 1 boosts point gain.': '加 1 提升点数增益。',
    '\'s softcaps.': '的软上限',
    'Coding': '编码',
    'all': '全部',
    'Initialize': '初始化',
    'Is this just a Timewall?': '这只是一个时间墙吗？',
    'Jacorb points boost Aarex balancing gain.': 'Jacorb 点提高 Aarex 平衡增益。',
    'Let\'s': '让我们',
    'Next at 1 phantom souls': '下一个在 1 幻魂',
    'Points boost Aarex balancing gain.': '点数提升 Aarex 平衡增益。',
    'Prestige points boost Aarex balancing gain.': '声望点提升 Aarex 平衡增益。',
    'Raises the Prestige Point effect / Prestige Point from ^0.75 to ^1.': '将声望点效果/声望点从 ^ 0.75 提高到 ^ 1。',
    'Release': '发布',
    'Remove': '移除',
    'Removes': '移除',
    'Removes Booster and Generator amount softcap in their effect.': '移除其效果中的 助推器 和 发生器 数量软上限。',
    'speed': '速度',
    'softcaps': '软上限',
    'these': '这些',
    'things': '东西',
    'To Grow.': '成长。',
    'up': '向上',
    'Wow this isn\'t worth it': '哇这不值得',
    'Aqua': '水色',
    'AUTOMATION, INCOMPLETE': '自动化，不完整',
    'LAST, AUTO, INCOMPLETE': '最后，自动，不完整',
    'Aarex Dimensions': 'Aarex维度',
    'NONE': '无',
    'Aarex Point Generator': 'Aarex点数发生器',
    'dimension points, which are boosting': '维度点，它们提升',
    'Max all': '全部最大',
    'one': '一个',
    'Soul-Automator': '灵魂自动化',
    'Turn Aarex time in': '打开Aarex时间',
    'Multiplies Jacorb reset time in': '乘以 Jacorb 重置时间',
    'Is this Antimatter Dimensions but with... TEN DIMENSIONS?': '这是反物质维度，但有……十维度？',
    'Balancing Power': '平衡力量',
    'Binary-doocol': '二进制文件',
    'Binary-googol': '二进制天文数字',
    'Binary-qoofol': '二进制qoofol',
    'Turn Jacorb time in': '打开Jacorb时间',
    'Large Number Convention': '大数公约',
    'Unlocks the Aarex Dimensions tab.': '解锁 Aarex维度选项卡。',
    'Raise the amount of Aarex balancing in': '提高 Aarex 平衡的数量',
    'Unlocks Aarex Dimensional Boost.': '解锁Aarex 维度提升。',
    'Unlocks Sacrifice.': '解锁牺牲。',
    'Unlocks Tickspeed.': '解锁 Tick速度。',
    'Upgrade-Automator': '自动化升级',
    'Aarex Dimensional Boost': 'Aarex 维度提升',
    'Aarex Galaxy': 'Aarex星系',
    'Aarex reset no longer resets anything.': 'Aarex 重置不再重置任何东西。',
    'Apocalyptetra': '天启',
    'Automates buying upgrades.': '自动购买升级。',
    'Automates getting Phantom Soul gain on reset.': '重置时自动获得幻魂增益。',
    'Automatically gain Aarex points, as if you do a manual reset each second.': '自动在重置时获得幻影灵魂增益。自动获得 Aarex 点数，就像你每秒进行一次手动重置一样。',
    'Mlastomillion': '百万美人鱼',
    'Why is this this far?': '为什么这么远？',
    '\'s formula by OOMs of Aarex balancing + 1.': '由 Aarex 平衡 +1 的 OOM 得出的公式。',
    '\'s formula into 1024^1024^x. Resets Aarex time.': '的公式变成 1024^1024^x。 重置 Aarex 时间。',
    '\'s formula into x^33,554,432. Resets Jacorb time.': '的公式转化为 x^33,554,432。 重置Jacorb时间。',
    '\'s formula to cost of upgrade and previous ones.': '升级成本的公式和以前的公式。',
    '\'s formula to cost of upgrade.': '升级成本的公式。',
    "Reverse Process": "逆向过程",
    'Ticksped': 'Tick速度',
    'Ok I\'m bored now': '好吧我现在很无聊',
    'No Longer a Sacrifice': '不再是牺牲',
    'increase': '增加',
    'Highest First': '最高优先',
    'Hey, who brought repetitivity?': '嘿，谁带来了重复？',
    'Buying order': '采购订单',
    'Cost of Things': '物价',
    'Boost Boost': '提升提升',
    'Boosts DP\'s effect and all dimensions by the square root of DP\'s exponent.': '通过 DP 指数的平方根提升 DP 的效果和所有维度。',
    'Automates buying max.': '自动购买最大。',
    'Almost There': '差不多好了',
    'Aarex Distant Galaxy': 'Aarex 遥远的星系',
    'Aarex Remote Galaxy': 'Aarex 远程星系',
    'Apply ^3 to DP\'s exponent in the effect formula. Aarex balancing boost all dims.': '将 ^3 应用于效果公式中的 DP 指数。 Aarex 平衡提升所有暗淡。',
    'Boosts works as if you have x^1.2 of them.': '提升 就像你有 x^1.2 个一样工作。',
    'Dimensional Boosts no longer reset.': '维度提升不再重置。',
    'Dimensions are boosted by ^0.01 of its cost.': '维度增加了 ^0.01 的成本。',
    'Each dimensional boost makes sacrifice better.': '每一个维度的提升都会让牺牲变得更好。',
    'Each tickspeed boost makes sacrifice better, up to 10 of them.': '每次滴答速度提升都会使牺牲变得更好，最多 10 个。',
    'Last Hurrah': '最后的欢呼',
    'Sacrifice Multiplier boosts all dimensions and dimension point effect\'s exponent.': '牺牲乘数提升所有维度和维度点效果的指数。',
    'The Long Awaited Upgrade': '期待已久的升级',
    'Tickspeed Boost Boost': 'Tick速度提升提升',
    'Tickspeed Boosts boost all dimensions and dimension point effect\'s exponent.': 'Tick速度提升提升所有维度和维度点效果的指数。',
    'Tickspeed Boosts no longet reset.': 'Tick速度提升不再重置。',
    'Tickspeed Boosts works as if you have 2x^1.2 of them.': 'Tick速度提升 就像你有 2x^1.2 个一样工作。',
    'Tickspeed^2': 'Tick速度^2',
    'You gain 10% of your remaining Sacrifice Multiplier per second.': '你每秒获得剩余牺牲乘数的 10%。',
    'Boosting Immensely': '大幅提升',
    'Inflation Time': '通胀时代',
    'Still Haven\'t Enough?': '还不够吗？',
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
    '\n\n                    Currency.\n\n                    Reset previous progress for +': '\n\n 货币。\n\n 重置之前的进度 + ',
    '10× point gain per second. You gain points regardless of the first upgrade.': '每秒 10 倍点数增益。 无论第一次升级如何，您都会获得点数。',
    '. In exchange,\n                your point production is MASSIVELY boosted based on Jacorb reset time, Aarex reset time and Aarex \n                balancing. You also now gain Phantom Souls based on Prestige Points instead of Quirk effect.': '. 作为交换，\n 你的点数产量会根据 Jacorb 重置时间、Aarex 重置时间和 Aarex \n 平衡而大幅提升。 你现在也可以根据声望点获得幻影之魂而不是夸克效果。',
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
    "Modder #": "模组 #",
    "Requires ": "需要",
    "phantom souls": "幻魂",
    "Time for a Boost": "是时候提升了",
    "Prestige Tree: ": "声望树: ",
    "speed by ": "速度",
    "Buy ": "购买 ",
    "Dimension ": "维度 ",
    "Unlock for ": "解锁花费",
    "Resets all progress in Aarex Dimensions, but multiplier per buy ": "重置 Aarex维度 的所有进度，但每次购买的乘数",
    "Resets dimensional boosts, but multiplier per buy ": "重置维度提升，但每次购买的乘数",
    "Resets everything in Aarex Dimensions, but multiplier per buy ": "重置 Aarex维度 中的所有内容，但每次购买的乘数",
    "Sacrifice Booster": "牺牲助推器",
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
    "OOMs/sec": "OOMs/秒",
    "": "",
    "": "",
    "": "",
    "": "",
}

//需排除的，正则匹配
var cnExcludeWhole = [
    /^×e([\d\.]+)e(\d+)$/,
    /^×([\d\.]+)e([\d\.,]+)$/,
    /^÷([\d\.]+)e([\d\.,]+)$/,
    /^÷e([\d\.]+)e(\d+)$/,
    /^([\d\.]+)e([\d\.,]+)$/,
    /^([\d\.]+)e([\d\.,]+) $/,
    /^×ee([\d\.,]+)$/,
    /^×eee([\d\.]+)$/,
    /^×([\d\.,]+)$/,
    /^ee([\d\.,]+)$/,
    /^E([\d\.,]+)\#(.+)$/,
    /^×E([\d\.,]+)\#(.+)$/,
    /^(\d+)$/,
    /^([\d\.]+)e(\d+)$/,
    /^([\d\.]+)$/,
    /^([\d\.]+)×(\d+)↑(\d+)$/,
    /^×([\d\.]+)×(\d+)↑(\d+)$/,
    /^×([\d\.]+)$/,
    /^([\d\.]+) $/,
    /^ee([\d\.]+)e([\d\.,]+)$/,
    /^\^([\d\.,]+)$/,
    /^\^([\d\.]+)e([\d\.,]+)$/,
    /^([\d\.]+)m ([\d\.]+)s$/,
    /^([\d\.]+)s$/,
    /^([\d\.,]+)$/,
    /^([\d\.,]+) $/,
    /^×([\d\.,]+)$/,
    /^\\o\/(.+)$/,
    /^[\u4E00-\u9FA5]+$/,
];
var cnExcludePostfix = [
]

//正则替换，带数字的固定格式句子
//纯数字：(\d+)
//逗号：([\d\.,]+)
//小数点：([\d\.]+)
//原样输出的字段：(.+)
//换行加空格：\n(.+)
//纯中文：/^[\u4E00-\u9FA5]+$/
var cnRegReplace = new Map([
	[/^Cost: (.+) hindrance spirits\n\t\t\t$/, '成本: $1 精神障碍\n\t\t\t'],
	[/^Cost: (.+) magic\n\t\t\t$/, '成本: $1 魔法\n\t\t\t'],
	[/^Cost: (.+) subspace energy\n\t\t\t$/, '成本: $1 子空间能量\n\t\t\t'],
	[/^Cost: (.+) balance energy\n\t\t\t$/, '成本: $1 平衡能量\n\t\t\t'],
	[/^Cost: (.+) solarity\n\t\t\t$/, '成本: $1 日照\n\t\t\t'],
	[/^Cost: (.+) quirks\n\t\t\t$/, '成本: $1 夸克\n\t\t\t'],
	[/^Cost: (.+) candies\n\t\t\t$/, '成本: $1 糖果\n\t\t\t'],
	[/^Cost: (.+) hyper boosters\n\t\t\t$/, '成本: $1 顶级助推器\n\t\t\t'],
	[/^Cost: (.+) lollipops\n\t\t\t$/, '成本: $1 棒棒糖\n\t\t\t'],
	[/^Cost: (.+) drop candies\n\t\t\t$/, '成本: $1 掉落糖果\n\t\t\t'],
	[/^Cost: (.+) Aarex balancing\n\t\t\t$/, '成本: $1 Aarex平衡\n\t\t\t'],
	[/^Cost: (.+) enhance points\n\t\t\t$/, '成本: $1 增强点数\n\t\t\t'],
	[/^Cost: (.+) time capsules\n\t\t\t$/, '成本: $1 时间胶囊\n\t\t\t'],
	[/^Cost: (.+) space energy\n\t\t\t$/, '成本: $1 空间能量\n\t\t\t'],
	[/^Cost: (.+) points\n\t\t\t$/, '成本: $1 点数\n\t\t\t'],
	[/^Cost: (.+) component points\n\t\t\t$/, '成本: $1 组件点数\n\t\t\t'],
	[/^Cost: (.+) Aarex points\n\t\t\t$/, '成本: $1 Aarex点数\n\t\t\t'],
	[/^enhance points\n(.+)Next at ee(.+)$/, '加强点\n$1下一个在ee$2'],
	[/^time capsules\n(.+)Next at ee(.+)$/, '时间胶囊\n$1下一个在ee$2'],
	[/^subspace energy\n(.+)Next at ee(.+)$/, '子空间能量\n$1下一个在ee$2'],
	[/^subspace energy\n(.+)Next at (.+) space energy$/, '子空间能量\n$1下一个在$2空间能量'],
	[/^space energy\n(.+)Next at ee(.+)$/, '空间能量\n$1下一个在ee$2'],
	[/^hyper boosters\n(.+)Next at (.+) super boosters$/, '顶级助推器\n 下一个在 $2 超级助推器'],
	[/^super generators\n(.+)Next at (.+) generators$/, '超级发生器\n 下一个在 $2 发生器'],
	[/^super boosters\n(.+)Next at (.+) boosters$/, '超级助推器\n 下一个在 $2 助推器'],
	[/^subspace energy\n(.+)Next at ×(.+) subspace energy$/, '子空间能量\n 下一个在 ×$2 子空间能量'],
	[/^(.+)× easier.\n(.+)\n(.+)Diff: (.+)$/, '$1× 更容易.\n$2\n$3差异: $4'],
	[/^\' amount in their effect by (.+)×.\n(.+)\n(.+)Diff: (.+)$/, '的数量在它们的效果 $1.\n$2\n$3差异: $4'],
	[/^\' effect by (.+)×.\n(.+)\n(.+)Diff: (.+)$/, '的效果 $1.\n$2\n$3差异: $4'],
	[/^([\d\.]+)e([\d\.,]+)\/sec$/, '$1e$2\/秒'],
	[/^Q: ×(.+), H: ×(.+)$/, 'Q: ×$1, H: ×$2'],
	[/^(.+)\n(.+)Makes$/, '$1\n$2使'],
	[/^(.+)\n(.+)Multiplies$/, '$1\n$2乘以'],
	[/^(.+)\n(.+)Increases$/, '$1\n$2增加'],
	[/^tickspeed boosts\n(.+)\n(.+)which are making time in Aarex Dimensions ×(.+) faster\n(.+)\n(.+)Requires (.+) dimension (.+)$/, 'tick速度提升\n \n 这使得 Aarex 维度 ×$3 中的时间更快\n \n 需要 $4 维 $5'],
	[/^sacrifice multiplier\n(.+)\n(.+)which are multipling dimension (.+) efficiency by the same amount.\n(.+)\n(.+)Reset all dimensions except dimension (.+)\'s amount for a$/, '牺牲乘数\n \n 将维度 $3 的效率乘以相同的数量。\n \n 重置除维度 $6 的数量之外的所有维度以获得一个'],
	[/^\(boost is divided by (.+) every further dimension, down to a minimum of (.+)×\)\n(.+)\n(.+)Requires (.+) dimension (.+)$/, '（提升 每进一步除以 $1，最小为 $2×）\n \n 需要 $5 维度 $6'],
	[/^dimensional boosts\n(.+)\n(.+)which are giving a base ×(.+) boost to dimensions and dimension point effect\'s exponent and unlocking (.+) more dimensions$/, '维度提升\n\n 为维度和维度点效果指数提供基础 ×$3 提升，并解锁 $4 以上维度'],
	[/^hyper boosters\n\n(.+)which are giving a ×(.+) bonus to base Super Booster effect.\n\n(.+)Reset previous progress for \+$/, '顶级助推器 \n\n 为基础超级助推器效果提供 ×$2 奖励。\n\n 重置之前的进度 \+'],
	[/^hindrance spirits\n(.+)Next at (.+) time capsules effect$/, '精神障碍\n$1下一个在$2时间胶囊效果'],
	[/^balance energy\n\n(.+)which are giving a ×(.+) bonus to Quirk effect and are multipling Subspace Energy and Time Capsules in their effects by (.+)×, slowly increases over this Jacorb reset.\n\n(.+)Reset previous progress for \+$/, '平衡能量 \n\n 为 夸克 效果提供 ×$2 奖励，并将其效果中的子空间能量和时间胶囊乘以 $3×，在此 Jacorb 重置后缓慢增加。\n\n 重置之前的进度 \+'],
	[/^magic\n\n(.+)which are giving a ×(.+) bonus to Hindrance Spirit gain, Quirk gain, Solarity\'s Time Capsule effect and Subspace Energy effect.\n\n(.+)Reset previous progress for \+$/, '魔法\n\n 给予了 ×$2 的障碍精神增益、夸克增益、日光的时间胶囊效果和子空间能量效果。\n\n 重置之前的进度 \+'],
	[/^solarity\n\n(.+)which are giving a ×(.+) boost to Solarity gain and a ×(.+) bonus to Time Capsule effect, slowly increses over this Jacorb reset.\n\n(.+)Reset previous progress for \+$/, '日光度 \n\n 为日光度增益提供 ×$2 提升和时间胶囊效果的 ×$3 奖励，在此 Jacorb 重置后缓慢增加。\n\n 重置之前的进度 \+'],
	[/^subspace energy\n\n(.+)which are giving a ×(.+) bonus to Space Energy effect, slowly increases over this Jacorb reset.\n\n(.+)Reset previous progress for \+$/, '子空间能量 \n\n 给予空间能量效果 × $2 加成，在Jacorb重置后缓慢增加。\n\n 重置之前的进度 \+'],
	[/^boosters\n\n(.+)which are giving a ×(.+) boost to prestige point gain. \n\(Note: Base costs are hardcapped at (.+).\)\n\n(.+)Reset prestige points for \+$/, '助推器\n\n 为声望点增益提供 ×$2 倍。 \n（注意：基本费用硬性规定为 $3。）\n\n 重置声望点数 \+'],
	[/^hindrance spirits\n\n(.+)which are giving a ×(.+) boost to point gain and Time Capsules effect, which increases based on your Jacorb points.\n\n(.+)Reset previous progress for \+$/, '精神障碍\n\n 为点数增益和时间胶囊效果提供 ×$2 提升，该效果根据您的雅各布点数而增加。\n\n 重置之前的进度 \+'],
	[/^quirks\n\n(.+)which are giving a ×(.+) boost to point gain and Generator effect, which increases at an increasing rate over this Jacorb reset.\n\n(.+)Reset previous progress for \+$/, '夸克\n\n 为点增益和发生器效果提供 ×$2 提升，在此 Jacorb 重置中以增加的速度增加。\n\n 重置之前的进度 \+'],
	[/^super generators\n\n(.+)which are giving a ×(.+) bonus to base Generator effect, slowly increases over this Jacorb reset.\n\n(.+)Reset previous progress for \+$/, '超级发生器\n\n 为基础发生器效果提供 ×$2 奖励，在此 Jacorb 重置后缓慢增加。\n\n 重置之前的进度 \+'],
	[/^super boosters\n\n(.+)which are giving a ×(.+) bonus to base Booster effect.\n\n(.+)Reset previous progress for \+$/, '超级助推器\n\n 为基础助推器效果提供 ×$2 奖励。\n\n 重置之前的进度 \+'],
	[/^enhance points\n\n(.+)which are giving a ×(.+) boost to prestige point gain and an additional \+(.+) bonus Boosters\/Generators.\n\n(.+)Reset previous progress for \+$/, '增强点数\n\n 为声望点数提供 ×$2 提升和额外的 \+$3 奖励助推器/发生器。\n\n 重置之前的进度 \+'],
	[/^space energy\n\n(.+)which are giving a ×(.+) bonus to point and prestige point gain, based on Generators' effect\n\n(.+)Reset previous progress for \+$/, '空间能量\n\n 根据发生器的效果给予 ×$2 点数和声望点增益奖励\n\n 重置之前的进度 \+'],
	[/^time capsules\n\n(.+)which are giving a ×(.+) boost to point and prestige point gain, which increases at a diminishing rate over this Jacorb reset.\n\n(.+)Reset previous progress for \+$/, '时间胶囊\n\n 为点数和声望点数提供了 ×$2 倍的提升，在此Jacorb重置后以递减的速度增加。\n\n 重置之前的进度 \+'],
	[/^(.+)\n(.+)undefined.\n(.+)\n(.+)Diff: (.+)$/, '$1\n$2未定义.\n$3\n$4差异: $5'],
	[/^(.+)\n(.+)Multiplies the first three components' amount in their effect by (.+)×.\n(.+)\n(.+)Diff: (.+)$/, '$1\n$2将效果中前三个组件的数量乘以 $3×.\n$4\n$5差异: $6'],
	[/^(.+)\n(.+)Increases comp. points to dev speed efficiency by \+(.+).\n(.+)\n(.+)Diff: (.+)$/, '$1\n$2增加组件点数指向开发速度效率 \+$3.\n$4\n$5差异: $6'],
	[/^(.+)\n(.+)Makes dev speed (.+)× faster.\n(.+)\n(.+)Diff: (.+)$/, '$1\n$2提高开发速度 $3×.\n$4\n$5差异: $6'],
	[/^(.+)\n(.+)Multiplies dev speed by (.+)×, based on component points.\n(.+)\n(.+)Diff: (.+)$/, '$1\n$2基于组件点，将开发速度乘以 $3×。.\n$4\n$5差异: $6'],
	[/^(.+)\n(.+)Generates (.+) component points per second.\n(.+)\n(.+)Diff: (.+)$/, '$1\n$2每秒生成 $3 个组成点.\n$4\n$5差异: $6'],
	[/^(.+) lollipops \+ (.+) drop candies$/, '$1 棒棒糖 \+ $2 掉落糖果'],
	[/^Reach (.+) farm candies.$/, '达到 $1 农场糖果。'],
	[/^windmills\n(.+)\n(.+)which are giving you (.+)× more candies, based on lollipops.\n(.+)\n(.+)Costs (.+) farm candies$/, '风车\n \n 给你 $3× 更多糖果，基于棒棒糖。\n \n 花费 $6 农场糖果'],
	[/^component points, which are multipling point gain by (.+)$/, '组件点，它乘以点增益 $1'],
	[/^You have (.+) candies$/, '你有 $1 糖果'],
	[/^You have (.+) lollipops$/, '你有 $1 棒棒糖'],
	[/^Trade all your candies for (.+) lollipops$/, '用你所有的糖果换 $1 棒棒糖'],
	[/^([\d\.]+)\/sec$/, '$1\/秒'],
	[/^([\d\.]+)e([\d\.]+) OOM\^([\d\.,]+)s\/sec$/, '$1e$2 OOM\^$3s\/秒'],
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
    [/^Row (.+) Boost$/, '第 $1 行提升'],
    [/^([\d\.,]+)\/sec$/, '$1\/秒'],
    [/^([\d\.]+)×(\d+)↑(\d+)\/sec$/, '$1×$2↑$3\/sec秒'],
    [/^Cost: (.+) prestige points\n\t\t\t$/, '成本: $1 声望点\n\t\t\t'],
    [/^([\d\.]+)h ([\d\.]+)m ([\d\.]+)s$/, '$1小时 $2分 $3秒'],
    [/^Next at (.+) points$/, '下一个在 $1 点数'],
    [/^Time Reversal\n(.+)\n(.+)Reverse the time and therefore your magic consumption, making all spell remaining times increase at (.+)× the speed instead of decrease, except this spell. There is a 90 second cooldown between uses.\n(.+)\n(.+)Costs (.+)\% of your max HP\n(.+)\((.+)$/, '时间逆转\n \n 逆转时间，从而逆转你的魔法消耗，使所有法术剩余时间增加 $3× 速度而不是减少，除了这个法术。 两次使用之间有 90 秒的冷却时间。\n \n 消耗 $6\% 的最大生命值\n \($8'],
    [/^Time Speed-up\n(.+)\n(.+)Disturb the flow of time to make it flow faster, which makes actions in quests 2× faster.\n(.+)\n(.+)Costs (.+) \+ (.+)\% of your max HP\n(.+)\((.+)$/, '时间加速\n \n 扰乱时间的流动，使其流动得更快，这使任务中的行动速度提高 2 倍。\n \n 消耗 $5 \+ $6\% 最大生命值\n \($8'],
    [/^generators\n\n(.+)which are giving a ×(.+) boost to prestige point gain, slowly increases over this Jacorb reset.\n\n(.+)Reset prestige points for \+$/, '发生器\n\n 为声望点增益提供 ×$2 提升，在此 Jacorb 重置后缓慢增加。\n\n 重置声望点数为 \+'],
    [/^prestige points\n(.+)Next at (.+)$/, '声望点\n下一个在 $2'],
    [/^boosters\n\n(.+)which are giving a ×(.+) boost to prestige point gain. \n\n(.+)Reset prestige points for \+$/, '助推器\n\n 为声望点增益提供 ×$2 提升。 \n\n 重置声望点获得 \+'],
    [/^boosters\n(.+)Next at (.+) prestige points$/, '助推器\n 下一个在 $2 声望点'],
    [/^Cost: (.+) Acamaeda points\n\t\t\t$/, '成本: $1 Acamaeda点\n\t\t\t'],
    [/^Cost: (.+) Jacorb points\n\t\t\t$/, '成本: $1 Jacorb点\n\t\t\t'],
    [/^\n\n(.+)which are giving a ×(.+) boost to point gain.\n\n(.+)Reset Jacorb points for \+$/, '\n\n 增加了 ×$2 点增益。\n\n 重置 Jacorb 点数为 \+'],
    [/^\n(.+)Next at (.+)$/, '\n下一个在 $2'],
    [/^(\d+) Royal points$/, '$1 皇家点数'],
    [/^Cost: (\d+) RP$/, '成本：$1 皇家点数'],
    [/^Usages: (\d+)\/$/, '用途：$1\/'],
    [/^workers: (\d+)\/$/, '工人：$1\/'],

]);