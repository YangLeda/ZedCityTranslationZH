// ==UserScript==
// @name         Zed City 汉化
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  网页游戏 Zed City 的汉化插件。Chinese translation for the web game Zed City.
// @author       bot740
// @match        https://www.zed.city/*
// @icon         https://www.zed.city/favicon.ico
// @grant        unsafeWindow
// ==/UserScript==

(() => {
    const logConfig_printUnmatchedTextToConsole = false;
    const unmatchedTexts = [];
    const logConfig_saveUnmatchedTextToArray = true;
    const logConfig_printUnmatchedTextArray = true;

    const excludes = ["K", "M", "B", "D", "H", "S", "Lv", "MAX", "wiki", "discord", "XP", "N/A", "x"];

    const excludeRegs = [
        // 一个字母都不包含
        /^[^a-zA-Z]*$/,
        // 版本号
        /^v\d+\.\d+\.\d+$/,
        /^Alpha V\d+\.\d+\.\d+$/,
        // 含中文
        /[\u4e00-\u9fff]/,
    ];

    // 词典：已人工审核过。建议先用ChatGPT翻译，然后人工审核。必须经过人工审核再加入此列表。
    const dictCommon = {
        purge: "大清洗",
        stronghold: "据点",
        "Unlock at level": "解锁等级",
        Version: "版本",
        City: "城市",
        Inventory: "背包",
        Quests: "任务",
        Hunting: "狩猎",
        Scavenge: "拾荒",
        Explore: "探索",
        Skills: "技能",
        Help: "帮助",
        "Release Notes": "更新日志",
        Forums: "论坛",
        "Report Bug": "报告错误",
        Faction: "帮派",
        "Medical Bay": "医疗间",
        "Crafting Bench": "制作台",
        Furnace: "熔炉",
        Kitchen: "厨房",
        "Radio Tower": "广播塔",
        "Weapon Bench": "武器台",
        "Ammo Bench": "弹药台",
        "Armour Bench": "盔甲台",
        Garage: "车库",
        Camp: "营地",
        Storage: "仓库",
        Farm: "农场",
        Distillery: "酒厂",
        Refinery: "精炼厂",
        Base: "基地",
        "Upcoming Server Reset and Open Release": "即将到来的服务器重置与公开发布",
        "load more": "加载更多",
        "Final Reset": "最终重置",
        gym: "健身房",
        "Train your stats to become more effective in combat": "训练你的属性，以在战斗中更有效",
        train: "训练",
        "The damage you make on impact": "你命中时造成的伤害",
        "Your ability to resist damage": "你抵抗伤害的能力",
        "The chance of hitting your target": "击中目标的概率",
        Raids: "突袭",
        Activity: "活动",
        Rank: "排名",
        Members: "成员",
        Respect: "声望",
        Trading: "交易",
        "Donator House": "捐赠者之家",
        Market: "市场",
        Info: "信息",
        "Hall Of Fame": "名人堂",
        "City Stats": "城市统计",
        Survivors: "幸存者",
        Retail: "零售",
        Glockbuster: "Glock杀手",
        "Junk Store": "垃圾店",
        "Zed Mart": "僵尸商场",
        "Donator Store": "捐赠商店",
        Factions: "帮派",
        Incinerator: "焚烧炉",
        "No Items": "没有物品",
        "Energy Vial": "能量瓶",
        Buy: "购买",
        "Health Vial": "生命瓶",
        "Morale Vial": "士气瓶",
        "Radiation Vial": "辐射瓶",
        "Detox Vial": "解毒瓶",
        Sell: "出售",
        "Booster (Medical)": "增强剂（医疗）",
        "Booster (Energy Drink)": "增强剂（能量饮料）",
        "A massive incinerator stands in the middle of the city, billowing out smoke as the fire within burns hot enough to turn anything into ash":
            "一个巨大的焚烧炉屹立在城市的中央，浓烟四起，炉内的火焰足以将任何物品烧成灰烬",
        Weight: "重量",
        kg: "千克",
        "Booster (Food)": "增强剂（食物）",
        "Booster (Alcohol)": "增强剂（酒精）",
        "Effect: Increases energy by": "效果：增加能量",
        "Effect: Reduce recovery time by 10 minutes and increases life by": "效果：减少恢复时间10分钟并增加生命值",
        "Effect: Increases morale by": "效果：增加士气",
        "Effect: Increases rad immunity by": "效果：增加辐射免疫力",
        "Effect: Resets cooldown booster by 12 hours": "效果：重置冷却时间增强剂12小时",
        Vehicle: "车辆",
        "No Vehicle": "没有车辆",
        Weapons: "武器",
        Armour: "护甲",
        Resources: "资源",
        Ammo: "弹药",
        Medical: "医疗",
        Boosters: "增强剂",
        Equipment: "装备",
        Misc: "杂项",
        Trophy: "奖杯",
        "Select a quest to continue": "选择一个任务继续",
        "Welcome to the End": "欢迎来到末日",
        "Getting started at the end of the world": "在世界末日时开始你的冒险",
        "A stranger appears": "一个陌生人出现",
        "Who is this dark figure, quiet and still, under the moonlight": "月光下，这个安静的黑暗身影是谁？",
        "The Purge is Upon Us": "大清洗即将来临",
        "As Ash blankets the city, a raspy chuckle attracts your notice": "当灰烬覆盖城市时，一阵沙哑的笑声引起了你的注意",
        "Select a location to continue": "选择一个地点继续",
        Arcade: "游戏厅",
        Cinema: "电影院",
        "Shopping Mall": "购物中心",
        Warehouse: "仓库",
        Restaurant: "餐馆",
        Wasteland: "荒原",
        Forest: "森林",
        "Coal Mine": "煤矿",
        Scrapyard: "废品场",
        "Min Level": "最低等级",
        Lake: "湖泊",
        "You need a vehicle to explore": "你需要一辆车来探索",
        "Fuel Depot": "燃料库",
        "Reclaim Zone": "回收区",
        "The Reserve": "保护区",
        "Military Base": "军事基地",
        "Demolition Site": "拆除现场",
        "Construction Yard": "建筑工地",
        Stats: "统计",
        Forging: "锻造",
        Farming: "耕作",
        Distilling: "蒸馏",
        Scavenging: "拾荒",
        Crafting: "制作",
        Fishing: "钓鱼",
        Refining: "精炼",
        "Active Perks": "生效技能",
        Perks: "技能",
        "Skill Points": "技能点",
        Immunity: "免疫",
        "Increase Max Rad Immunity by": "增加最大辐射免疫力",
        "Skill Point": "技能点",
        Morale: "士气",
        "Increase Max Morale by": "增加最大士气",
        Life: "生命",
        "Increase Max Life by": "增加最大生命值",
        Luck: "幸运",
        "Increase chance of finding better items": "增加找到更好物品的机会",
        Strength: "力量",
        "Increase strength by": "增加力量",
        Defense: "防御",
        "Increase defense by": "增加防御",
        Speed: "速度",
        "Increase speed by": "增加速度",
        Agility: "敏捷",
        "Increase agility by": "增加敏捷",
        Guide: "指南",
        FAQ: "常见问题",
        Forum: "论坛",
        "Welcome to Zed City, a thrilling zombie apocalypse survival game. Navigate through the city to gather resources, fend off zombies, and fortify your stronghold. Your initial goal is to enhance your character and strengthen your base":
            "欢迎来到Zed City，一款刺激的末日求生游戏。穿越城市，收集资源，抵御僵尸，并加固你的据点。你的初步目标是提升角色并强化基地",
        "Scavenging and hunting will be the best way for you to thrive in the wasteland, gathering all the scraps and valuables you can lay your hands on. With some work you can turn them into valuable resources and epic weapons to take down even the biggest of zeds":
            "拾荒和狩猎将是你在荒原中生存下去的最佳方法，收集所有你能找到的垃圾和宝贵物品。通过一些努力，你可以将这些转化为宝贵的资源和史诗级武器，打倒最大的僵尸",
        "Start your journey by diving into the": "开始你的旅程，进入",
        quest: "任务",
        "For a more detailed guide, check out the wiki": "欲了解更详细的指南，请查看wiki",
        "Visit Wiki": "访问wiki",
        Support: "支持",
        "For more help, reach out to the community in discord": "如需更多帮助，请加入Discord社区",
        "Join Discord": "加入Discord",
        "How do i heal": "我如何恢复生命值",
        "Life points are regenerated over time, you can see the statistics in your Medical Bay. You can use medical items to heal instantly":
            "生命点数会随着时间恢复，你可以在医疗间查看统计数据。你可以使用医疗物品进行即时治疗",
        "How do I earn money": "我如何赚取金钱",
        "Scavenging or hunting for items to sell to the stores is the main way to earn money early in the game. After some time you will discover other ways to transform items into more valuable ones":
            "拾荒或狩猎物品并卖给商店是游戏初期赚取金钱的主要方式。过一段时间，你将发现其他方法将物品转化为更有价值的物品",
        "How do i gain Experience": "我如何获得经验",
        "Experience is gained through commiting scavenge actions, completing quest objectives & winning battles. The more Experience gained you will level up":
            "通过执行拾荒行动、完成任务目标和赢得战斗来获得经验。获得的经验越多，你的等级就越高",
        "How can i fulfill Energy & Rad Immunity  bars": "我如何填充能量和辐射免疫条",
        "Energy regenerates +5 every 15 minutes, Rad Immunity regenerates +1 every 5 minutes. You can take consumables found in-game that will help regain these besides waiting on timers":
            "能量每15分钟恢复+5，辐射免疫力每5分钟恢复+1。你可以使用游戏中找到的消耗品来帮助恢复这些，而不仅仅是等待时间",
        "What happens if i lose fight": "如果我输掉战斗会怎样",
        "You dont die. You become temporarily injured for a moment then your health will restart from low":
            "你不会死。你会暂时受伤片刻，然后你的健康值会从低值恢复",
        "How do i get stronger in fights": "我如何在战斗中变得更强",
        "Using energy to train in the gym is the best way to be more effective in combat and making sure you have the best weapon available. Some mutations and consumables are available which may temporily boost your gym stats":
            "使用能量在健身房训练是提高战斗效率的最佳方法，确保你拥有最好的武器。一些突变和消耗品可以临时提升你的健身数据",
        General: "综合",
        "A place for general discussions": "一个进行综合讨论的地方",
        Ideas: "创意",
        "Ideas & Suggestions for alpha": "Alpha测试的创意与建议",
        "Items Crafted": "制作的物品",
        "Items Forged": "锻造的物品",
        "Hunting Attempts": "狩猎尝试",
        "Scavenge Attempts": "拾荒尝试",
        "Fight Stats": "战斗统计",
        "Go Back": "返回",
        ATTEMPTS: "尝试",
        SUCCESS: "成功",
        FAILS: "失败",
        "Loot Discovered": "发现战利品",
        Logs: "日志",
        Resource: "资源",
        Scrap: "废品",
        Nails: "钉子",
        "Iron Bar": "铁条",
        "Advanced Tools": "高级工具",
        Take: "拿取",
        "AK-74u": "AK-74u",
        "Weapon (Ranged)": "武器（远程）",
        Durability: "耐久度",
        Medium: "中等",
        Condition: "状况",
        Attack: "攻击",
        Accuracy: "精度",
        Type: "类型",
        Rifle: "步枪",
        "Fire Rate": "射速",
        "Ammo Type": "弹药类型",
        "Rifle Ammo": "步枪弹药",
        Angelfish: "天使鱼",
        "Raw Fish": "生鱼",
        "Animal Meat": "动物肉",
        "Effect: Increases morale by 50 and booster cooldown by 30 minutes": "效果：增加士气50，增强剂冷却时间30分钟",
        Ash: "灰烬",
        Barley: "大麦",
        "Baseball Bat": "棒球棒",
        Weapon: "武器",
        Blunt: "钝器",
        Beer: "啤酒",
        "Effect: Increases rad immunity by 1 and booster cooldown by 1 hour": "效果：增加辐射免疫力1，增强剂冷却时间1小时",
        Bow: "弓",
        Piercing: "穿刺",
        Arrows: "箭",
        "Add Items": "添加物品",
        "Heal to attack more crawlers": "治疗以攻击更多爬行者",
        Upgrade: "升级",
        Regen: "回复",
        "Per 15 Min": "每15分钟",
        Recovery: "恢复",
        "Create Bandage": "制作绷带",
        LVL: "等级",
        Menu: "菜单",
        Submit: "提交",
        energy: "能量",
        "Rad Immunity": "辐射免疫力",
        "Membership Expires": "会员到期",
        Notifications: "通知",
        "No activity found": "无活动",
        am: "上午",
        "View Profile": "查看个人资料",
        Settings: "设置",
        Logout: "登出",
        Online: "在线",
        Level: "等级",
        "Days Survived": "生存天数",
        Location: "位置",
        "Update Avatar": "更新头像",
        Update: "更新",
        "Update Email": "更新电子邮件",
        Email: "电子邮件",
        "Update Password": "更新密码",
        "Current Password": "当前密码",
        "New Password": "新密码",
        "Repeat Password": "重复密码",
        Quantity: "数量",
        Cancel: "取消",
        "Your ability to dodge an attack": "你的闪避能力",
        "Gym upgrade": "健身房升级",
        Bandage: "绷带",
        "Medical Bay Level": "医疗间等级",
        "Weapon (Ranged": "武器（远程）",
        "Cloth Pants": "布裤",
        "Armour (Legs": "护甲（腿部）",
        "Hockey Mask": "冰球面罩",
        "Armour (Head": "护甲（头部）",
        Brick: "砖块",
        Cement: "水泥",
        "A bag of Cement mix": "一袋水泥混合料",
        Cloth: "布料",
        Coal: "煤炭",
        "Dirty Water": "脏水",
        Flux: "助焊剂",
        "Desert Eagle": "沙漠之鹰",
        Pistol: "手枪",
        "Pistol Ammo": "手枪子弹",
        Handmade: "手工制作",
        "Simple Ammo": "简单弹药",
        "Canned Food": "罐装食物",
        "Cooked Fish": "熟鱼",
        "Dino Egg": "恐龙蛋",
        "e-Cola": "原子可乐",
        "Booster (Easter": "增强剂（复活节）",
        Chocolate: "巧克力",
        Eyebellini: "眼球贝利尼鸡尾酒",
        "Mixed Vegetables": "混合蔬菜",
        Pickaxe: "镐",
        "Wooden Fishing Rod": "木质钓鱼竿",
        Low: "低",
        "Buddys Pass": "伙伴通行证",
        Miscellaneous: "杂项",
        "Generals RFID": "将军的射频识别卡",
        "Security Card": "安保卡",
        "Silver key": "银钥匙",
        "Take Item": "拿取物品",
        "A patch of slightly fertile soil": "一块稍微肥沃的土壤",
        Farmers: "农民",
        "Team Efficiency": "团队效率",
        "Farming Barley": "种植大麦",
        "Total Time Left": "剩余总时间",
        "Barley Seeds": "大麦种子",
        Build: "建造",
        "Hot enough to melt things": "热度足以融化物品",
        "Complete building to access furnace": "完成建筑以访问炉子",
        "Forge Nails": "锻造钉子",
        "Smelt Scrap": "熔炼废品",
        "Smelt Iron Ore": "熔炼铁矿",
        "Purify Water": "净化水",
        "Forge Lockpicks": "锻造撬锁工具",
        Discoverable: "可发现物品",
        "Hot enough to cook things": "热度足以烹饪食物",
        "Complete building to access kitchen": "完成建筑以访问厨房",
        "Cooked Angelfish": "熟天使鱼",
        "Cooked Barnaclefish": "熟藤壶鱼",
        "Cooked Carp": "熟鲤鱼",
        "Cooked Perch": "熟鲈鱼",
        "Cooked Sandfish": "熟沙鱼",
        "Cooked Meat": "熟肉",
        "Fish Kebab": "鱼肉串",
        Sandwich: "三明治",
        "Complete building to access radio tower": "完成建筑以访问广播塔",
        "Fabricate firearms": "制造枪械",
        "Complete building to access weapon bench": "完成建筑以访问武器台",
        Handgun: "手枪",
        MP: "MP",
        Shotgun: "霰弹枪",
        AK: "AK",
        "For packin heat": "装填火药",
        "Complete building to access ammo bench": "完成建筑以访问弹药台",
        "Gun Powder": "火药",
        "Designer and craft designer outfits": "设计并制作设计师服装",
        "Complete building to access armour bench": "完成建筑以访问护甲台",
        "Craft Cloth Pants": "制作布裤",
        "Craft Cloth Jacket": "制作布夹克",
        "Complete building to access garage": "完成建筑以访问车库",
        Stinger: "毒刺",
        Efficiency: "效率",
        Capacity: "容量",
        "Active Raids": "活跃袭击",
        "Raid a Store": "袭击商店",
        "Awaiting Team": "等待团队",
        View: "查看",
        Raid: "袭击",
        "Team Size": "团队大小",
        "Raid a Farm": "袭击农场",
        Setup: "设置",
        "Raid a Hospital": "袭击医院",
        "Manage Roles": "管理角色",
        Status: "状态",
        Role: "角色",
        Leader: "领导者",
        Manage: "管理",
        "Distilling Beer": "蒸馏啤酒",
        Distillers: "蒸馏器",
        pm: "下午",
        "Set up Raid on Farm": "设置袭击农场",
        "Are you sure you want to set up raid on farm?": "你确定要设置袭击农场吗",
        Team: "团队",
        Empty: "空",
        Join: "加入",
        "Cancel Raid": "取消袭击",
        Membership: "会员",
        "Membership lasts 31 days and is free during alpha": "会员将持续31天，并且在Alpha测试中是免费的",
        "Max Energy": "最大能量",
        "Energy Regeneration Rate": "能量恢复速度",
        "Receive Special Items Monthly": "每月获取特殊物品",
        "Support Us": "支持我们",
        "Everything is free during alpha": "在Alpha测试中，一切都是免费的",
        "If you'd like to support us and help with server and development costs, you can use the button below":
            "如果您愿意支持我们，帮助支付一些托管和开发费用，您可以使用下面的按钮",
        Deals: "优惠",
        Fuel: "燃料",
        Gears: "齿轮",
        Plastic: "塑料",
        Rope: "绳子",
        Steel: "钢铁",
        Oilcloth: "油布",
        Back: "返回",
        "Market Deals": "市场优惠",
        Gameplay: "游戏玩法",
        "Total Factions": "全部帮派",
        "Farm Items": "耕作物品",
        "Distill Items": "蒸馏物品",
        "Complete Raid": "完成袭击",
        "st January 2025 6PM": "2025年1月1日 6PM",
        "Hello to all the Survivors of Zed City! Be it those who have been with us for years, or those who have joined just recently, we would like to thank every single one of you for participating in the closed alpha stage of Zed City. Despite the frankly inconvenient method of registration, so many have joined us over the years and helped bring the game to the state it is now":
            "致所有Zed City的幸存者们！无论是那些陪伴我们多年的玩家，还是最近加入的玩家，我们都要感谢你们每一位，感谢你们参与Zed City的封闭Alpha测试阶段。尽管注册方式确实不太方便，然而，依然有许多人加入我们，帮助游戏发展至今天的模样。",
        "Thanks to all of you, we can now move on to the open release stage of the game": "感谢你们，我们现在可以进入游戏的公开发布阶段。",
        "This means the server will be reset, and everything will be turned back to zero": "这意味着服务器将会重置，所有数据将被清空。",
        "Not to worry though, everything you have in the trophy section will be kept, including a little extra you will find post-reset as thanks for being with us in the alpha":
            "不过不必担心，奖杯部分的所有内容将被保留，并且作为对你们在Alpha阶段陪伴我们的感谢，重置后你们还会发现一些额外的奖励。",
        "With that said, enjoy the Purge for all it's worth, as the server will be closed and reset directly after the event is finished":
            "话虽如此，尽情享受这次大清洗活动吧，因为活动结束后，服务器将会关闭并重置。",
        "Once again, thank you all for being with us, and see you on the other side": "再次感谢你们的陪伴，期待在另一端再见。",
        "Seemingly out of nowhere, ash plumes cover the sky as a constant ashfall covers the surroundings in a bleak gray color":
            "似乎是突然之间，灰烬云覆盖了天空，持续的灰尘落下，把周围的环境染成了一片灰色。",
        "Fires in the wilderness spread as the few remaining signs of life in the world are snuffed out":
            "荒野中的火灾蔓延，世界上为数不多的生命迹象被扑灭。",
        "The Purge is upon you Survivor; do all you can because there is not much time left":
            "大清洗行动即将到来，幸存者们；尽你所能，因为时间所剩无几。",
        "You will find Gray Gary in the alleyways, or rather, he will find you. He will be your quest giver this event, leading you to discover all the unique items introduced for this event only, culminating in the special trophy for this event":
            "你将会在小巷里找到灰发Gary，或者说，他会找到你。他将是这次活动的任务发布者，带领你发现本次活动专属的独特物品，最终将带来这次活动的特别奖杯。",
        "Event Time (UTC) : 20th December 2024 18:00:00 - 1st January": "活动时间（UTC）：2024年12月20日18:00:00 - 2025年1月1日",
        "Weapons and armour will be destroyed when it reaches 0% condition": "当武器和护甲的耐久度降至0%时，它们将被销毁。",
        "Trophy items have been made not tradable": "奖杯物品已被设置为不可交易。",
        "Messages icon has been removed from top menu until the feature is added": "顶部菜单中的消息图标已移除，直到该功能加入。",
        "Changes have been made to balance your fight stats growth, they will now improve more slowly at first but will accelerate as time goes on":
            "已对战斗数据增长做出平衡性调整，现在初期的战斗数据提升会较慢，但随着时间的推移将加速增长。",
        "The building level will now have less immediate impact but will offer more significant benefits in the long run":
            "建筑等级的影响现在不会那么直接，但长期来看将带来更为显著的益处。",
        "Requirements for each level upgrade have been adjusted": "每个等级升级的要求已做出调整。",
        "NPC Balancing": "NPC平衡性调整",
        "We have adjusted the stats of each zed to match the changes made to the fight stats growth":
            "我们已调整每个僵尸的属性，以适应战斗数据增长的变化。",
        "Difficulty Rating": "难度等级",
        "Each NPC will now have a difficulty rating so you can make a better decision on your ability to defeat them":
            "每个NPC现在都有一个难度等级，帮助你更好地评估自己是否能够击败它们。",
        Weakness: "弱点",
        "Choose your weapon wisely, zeds will now have a weakness to specific types of weapons":
            "选择武器时要谨慎，僵尸现在会对特定类型的武器有弱点。",
        "A detailed list of all the items in the game can be found in the wiki": "游戏中所有物品的详细列表可以在wiki中找到。",
        "Crafting will show a total time if you are crafting more than 1x": "如果你制作多个物品，制作时间将会显示总时长。",
        "Explore list has been ordered by travel time & difficulty rating": "探索列表将按照旅行时间和难度等级排序。",
        "The help page has been updated to include links to wiki + discord": "帮助页面已更新，包含了指向wiki和Discord的链接。",
        "XP Balancing": "XP平衡性调整",
        "Balancing changes have been made to xp payouts, gym training has been reduced slightly and more xp is given for hunting. Winning fights will give extra xp. Every quest objective will give at least 25xp":
            "XP奖励的平衡性调整已经做出，健身训练的XP稍微减少，而狩猎获得的XP更多。赢得战斗会额外获得XP。每个任务目标至少会奖励25XP。",
        'Tutorial Quest "Welcome to the end" has been re-written': "教程任务《欢迎来到末日》已重新编写。",
        "Difficulty has been reduced for new players in the Forest & Lake": "森林和湖泊地区的难度已减少，以帮助新玩家。",
        "Changed order of stronghold buildings (will only apply to new players": "强盗据点建筑的顺序已更改（仅对新玩家有效）。",
        "Adjusted the unlock level of Kitchen, Ammo Bench & Armour Bench": "厨房、弹药台和护甲台的解锁等级已调整。",
        "Fixed a bug where the explore landing page would show in the city": "修复了探索登陆页面在城市中显示的问题。",
        "Fixed a display bug on the locked message when you dont have a vehicle (inventory": "修复了当你没有车辆时，锁定信息显示的错误。",
        "Added tooltip on locked blueprints to make it more obvious that you need to upgrade the building":
            "为锁定的蓝图添加了提示，以更明显地提醒你需要升级建筑。",
        "Fuel Depot (Explore Location": "燃料站（探索地点）",
        "Discover a new area packed with massive, abandoned fuel tankers, offering a prime opportunity to replenish your fuel reserves":
            "发现一个全新的区域，里面堆满了废弃的巨大油罐车，为补充你的燃料储备提供了绝佳的机会。",
        "Fuel weight has been reduced to 0.75kg": "燃料重量已减少至0.75kg。",
        "Bug causing tools to be taken with 1 use has been fixed": "修复了工具只可使用一次的问题。",
        "Foundation Pit will now cost rad immunity": "基础坑现在需要辐射免疫力。",
        Mission: "任务",
        "Welcome to the end, survivor. If you're still breathing, then you've got a chance—slim as it may be. But out here, everyone starts somewhere. Your first task? Head down to the old arcade. The place is crawling with zeds, mostly slow-moving crawlers, but don't get too comfortable. Even the weakest can tear you apart if you’re not careful":
            "欢迎来到末日，幸存者。如果你还活着，那么你还有机会——尽管微乎其微。但在这里，每个人都有一个起点。你的第一个任务？去旧的街机厅。那地方挤满了僵尸，大部分是缓慢爬行的怪物，但别太放松。即便是最弱的僵尸，如果你不小心，也能将你撕裂。",
        "Consider this your initiation. Clear out a few of those walkers, get a feel for how things are now. Survive this, and we’ll see if you’ve got what it takes to go further. Good luck—you’re gonna need it":
            "把这当作你的入门任务。清理掉一些那些行尸走肉，感受一下现在的局势。坚持下来，我们再看看你是否有能力走得更远。祝你好运——你会需要它的。",
        "Objective: Hunt a zed in the Arcade (Darkened Restrooms": "目标：在街机厅（昏暗的洗手间）狩猎一只僵尸",
        Progress: "进度",
        Myena: "迈耶娜",
        "You walk into a dark alley surrounded by street lamps on either side, hanging down from the street lamps is a spaghetti mess of entangled wires attached to powered bug zappers providing little light to the alley along with the faint buzzing noise of the power circulating around. The intrigue of other humans possibly surviving here draws you in, until you notice the hidden shadow of a slender woman sat against the walls of the alleyway. The shadowy figure begins to become clear as she lifts to her to look you up and down":
            "你走进一条黑暗的巷子，街灯两旁被杂乱的电线缠绕着，电击器发出的微弱光线照亮着巷道，同时伴随着电力流动时的嗡嗡声。你开始对这里可能还有其他幸存者产生兴趣，直到你注意到巷子墙角隐藏的身影，一位瘦削的女人坐在那里。她抬头看你，逐渐显现出她的模样。",
        "Another survivor eh? … It’s been a while since I’ve seen someone new around here. You must have got into the city just recently, I’m Myena - a ‘nightwalker’ of sorts, trading in information, scouting different locations and just generally surviving this forsaken wasteland":
            "另一个幸存者，嗯？……我很久没见到新面孔了。你应该是最近才进城的，我是迈耶娜——某种意义上的‘夜行者’，交易信息、侦察不同的地点，反正就是在这个被遗弃的废土上生存。",
        "You stare for a moment waiting to see if you can offer anything in exchange for something of value":
            "你凝视着她，等待着看看自己是否能用什么交换一些有价值的东西。",
        "So, wanna make yourself useful? I need some fuel to help start fixing up my bike. Just a little will do. If you can go find some for me, I'll let you in on some valuable information. So what'ya say":
            "那么，想让自己变得有用吗？我需要一些燃料来修理我的摩托车，稍微一点就行。如果你能帮我找到一些，我就会告诉你一些有价值的信息。怎么样？",
        "Objective: Find fuel at Scrapyard": "目标：在废品堆场找到燃料",
        "Making your way through the city, a stray shadow catches your eye": "你穿行在城市中，一道漂浮的阴影吸引了你的注意。",
        "There, in an alley, stands a very tall man. Clad in all gray, from toe to wide-brimmed hat, he looks very at home in the ash-covered surroundings. Even the sunglasses he's wearing are a slate gray that show no hint of the eyes behind them":
            "在那里，在一条巷子里，站着一个非常高大的男人。全身灰色打扮，从脚到宽边帽，看起来非常适应这片灰烬覆盖的环境。即便是他戴的太阳镜也是石板灰色，完全遮掩了眼睛。",
        "A raspy chuckle escapes him as he notices your attention, followed by the worst smoker's voice you have ever heard":
            "他注意到你的目光，发出沙哑的笑声，接着是你听过的最糟糕的烟民声音。",
        "Nice weather we're having, eh": "我们现在的天气真不错，嗯？",
        "The stranger puts a cigarette in his mouth and shields it as he goes to light it, taking a long drag from it right after":
            "那陌生人把烟塞进嘴里，遮住它点燃，随即深吸了一口。",
        "You know what, I like you, I can tell there is a strong fire burning inside you, or at least a stronger one than most of the yellowbellies around here... Call me Gray, Gray Gary. I think we will be good friends":
            "你知道吗，我喜欢你，我能看出你内心有着强烈的火焰，或者至少比这里大多数胆小鬼要强烈……叫我灰色Gary吧。我觉得我们会是好朋友。",
        "A shiver runs down your spine but Gray continues right away": "一阵寒意袭过你的脊背，但Gray立刻继续说道。",
        "I have a special little reward that I think you will like. Bring me some Ash and I'll tell you more about it, hmm":
            "我有一个特别的奖励，我想你会喜欢。带些灰烬给我，我会告诉你更多，嗯。",
        "You look around you at all the ash falling from the sky and raise an eyebrow at him": "你四下环顾，看到满天的灰烬落下，不禁扬起一眉。",
        "Gray gives out another raspy chuckle and then speaks": "Gray再次发出沙哑的笑声，然后说道。",
        "Not this regular, useless stuff, no. I need something a bit more special, fresh, in a sense. You'll know it when you see it, I assure you":
            "不是这种普通、没用的东西，不。我要的是一些更特别、更新鲜的东西。你看到时会知道的，我敢保证。",
        "Gray takes another long drag of his cigarette, nearly done with it already, and nods his head towards a direction behind you":
            "Gray再次深吸了一口烟，几乎快抽完了，他朝你身后点了点头。",
        "In fact, there is a nice new place in the city that should help you out": "实际上，城市里有个新地方，应该能帮到你。",
        "You instinctively glance behind you in the direction he nodded, and when you glance back he's already gone":
            "你本能地回头看向他点头的方向，转身时发现他已经不见了。",
        "Objective: Find enough ash to satisfy Gray Gary": "目标：找到足够的灰烬满足Gray Gary",
        "Membership will last 31 days and is": "会员有效期为31天，并且是",
        "FREE in Alpha": "在Alpha阶段免费",
        "Energy Regeneration Speed": "能量恢复速度",
        "Recieve a special items every month": "每月接收一个特殊物品",
        "During alpha everything will be": "在Alpha阶段，一切都将是",
        FREE: "免费",
        "If you wish to support us by helping to cover some hosting & development costs, you can use the button below":
            "如果你希望通过帮助覆盖一些主机和开发费用来支持我们，可以使用下面的按钮。",
        Baton: "警棍",
        Bladed: "带刃",
        Switchblade: "弹簧刀",
        "Army Helmet": "军用头盔",
        Wrench: "扳手",
        "Loading Bay": "装载区",
        Hunt: "狩猎",
        "Storage Area": "储藏区",
        "Chemical Storage": "化学品储存",
        "Boiler Room": "锅炉房",
        "Refill Energy": "补充能量",
        "Refill Rad Immunity": "补充辐射免疫力",
        "Rusty machine that smells of fish oil and burnt plastic": "一台生锈的机器，散发着鱼油和烧焦塑料的味道",
        refiners: "精炼器",
        "Complete upgrade to access workers": "完成升级以解锁工人",
        "Extract Materials": "提取材料",
        Craft: "制作",
        "Extract Oils": "提取油料",
        "Refine Plastic": "精炼塑料",
        "Maintenance Room": "维修室",
        "Projection Room": "放映室",
        "Ticket Booths": "售票亭",
        "Main Theater Room": "主剧院室",
        "Toxic Dump Site": "有毒垃圾场",
        "Sewage Plant": "污水处理厂",
        Overpass: "天桥",
        "Sector-Z": "Z区",
        "Dining Area": "餐饮区",
        Restrooms: "洗手间",
        "Wine Cellar": "酒窖",
        "Kitchen Area": "厨房区",
        "Darkened Restrooms": "昏暗洗手间",
        "Concession Stand": "小吃摊",
        "Arcade Office": "街机办公室",
        "Hall of Mirrors": "镜厅",
        "Parking Lot": "停车场",
        "Central Atrium": "中央中庭",
        "Food Court": "美食广场",
        "Sports Store": "体育用品店",
        Refill: "补充",
        Name: "名字",
    };

    // 词典：待优化
    const dictPending = {
        Seach: "搜索", // 游戏内错别字
        "gained every": "每",
        minutes: "分钟获得",
        "Booster (Energy Drink": "增强剂（能量饮料）",
        "Booster (Medical": "增强剂（医疗）",
        "Booster (Food": "增强剂（食物）",
        "Booster (Alcohol": "增强剂（酒精）",
        "Your application for World Of Warcraft has been accepted": "您的《魔兽世界》申请已被接受",
        "Active 38 minutes ago": "38分钟前活跃",
        "Effect: Increases morale by 20 and booster cooldown by 30 minutes": "效果：增加士气20，增强剂冷却时间30分钟",
        "Effect: Increases morale by 100 and booster cooldown by 30 minutes": "效果：增加士气100，增强剂冷却时间30分钟",
        "Effect: Increases morale by 65 and booster cooldown by 30 minutes": "效果：增加士气65，增强剂冷却时间30分钟",
        "Effect: Increases morale by 10 and booster cooldown by 30 minutes": "效果：增加士气10，增强剂冷却时间30分钟",
        "Effect: Increases morale by 100, rad immunity by 10 and booster cooldown by 30 minutes":
            "效果：增加士气100，辐射免疫力10，增强剂冷却时间30分钟",
        "Effect: Increases energy by 25 and booster cooldown by 2 hours": "效果：增加能量25，增强剂冷却时间2小时",
        "Scuff Shotgun": "钝口霰弹枪",
        Sawnoff: "锯口霰弹枪",
        "angela deposited 9x Ash": "angela存入9个灰烬",
        "Your membership will expire in": "您的会员将在",
        "a month": "一个月后到期",
    };

    // 词典：ChatGPT生成，未经过人工审核。
    const dictGpt = {};

    const dictAll = { ...dictCommon, ...dictGpt, ...dictPending };
    const dictAllLowerCase = {};
    for (const key in dictAll) {
        dictAllLowerCase[key.toLowerCase()] = dictAll[key];
    }

    startTranslatePage();

    function startTranslatePage() {
        translateNode(document.body);

        const observerConfig = {
            attributes: false,
            characterData: true,
            childList: true,
            subtree: true,
        };

        const observer = new MutationObserver(function (e) {
            observer.disconnect();
            for (const mutation of e) {
                if (mutation.type === "childList") {
                    for (const node of mutation.addedNodes) {
                        translateNode(node);
                    }
                } else {
                    if (mutation.target) {
                        translateNode(mutation.target);
                    }
                }
            }
            observer.observe(document.body, observerConfig);
        });

        observer.observe(document.body, observerConfig);
    }

    function translateNode(node) {
        if (node.nodeName === "SCRIPT" && node.nodeName === "STYLE" && node.nodeName === "TEXTAREA") {
            return;
        }

        if (node.placeholder) {
            translatePlaceholder(node);
        }

        if ((!node.childNodes || node.childNodes.length === 0) && node.textContent) {
            translateTextNode(node);
        }

        if (node.childNodes) {
            for (const subnode of node.childNodes) {
                translateNode(subnode);
            }
        }
    }

    function translatePlaceholder(node) {
        node.placeholder = dict(node.placeholder);
    }

    function translateTextNode(node) {
        const dictResult = dict(node.textContent);
        if (dictResult !== node.textContent) {
            node.parentNode.setAttribute("script_translated_from", node.textContent);
            node.textContent = dictResult;
        }
    }

    function dict(oriText) {
        let text = oriText;

        // 含emoji的文本
        if (text === "🏆Purge Event") {
            return "🏆清洗活动";
        }

        // 排除规则
        for (const exclude of excludes) {
            if (exclude.toLowerCase() === text.toLocaleLowerCase()) {
                return text;
            }
        }
        for (const excludeReg of excludeRegs) {
            if (excludeReg.test(text)) {
                return text;
            }
        }

        // 消除后面空格
        if (/^(.+?)(\s+)$/.test(text)) {
            let res = /^(.+?)(\s+)$/.exec(text);
            return dict(res[1]) + res[2];
        }

        // 消除前面空格
        if (/^(\s+)(.+)$/.test(text)) {
            let res = /^(\s+)(.+)$/.exec(text);
            return res[1] + dict(res[2]);
        }

        // 消除后面的非字母
        if (/^(.+?)([^a-zA-Z]+)$/.test(text)) {
            let res = /^(.+?)([^a-zA-Z]+)$/.exec(text);
            return dict(res[1]) + res[2];
        }

        // 消除前面的非字母
        if (/^([^a-zA-Z]+)(.+)$/.test(text)) {
            let res = /^([^a-zA-Z]+)(.+)$/.exec(text);
            return res[1] + dict(res[2]);
        }

        // 结尾复数
        if (text.toLowerCase().endsWith("es") && dict[text.toLowerCase().slice(0, -2)]) {
            return dict[text.toLowerCase().slice(0, -2)];
        }
        if (text.toLowerCase().endsWith("s") && dict[text.toLowerCase().slice(0, -1)]) {
            return dict[text.toLowerCase().slice(0, -1)];
        }

        if (dictAllLowerCase[text.toLowerCase()]) {
            return dictAllLowerCase[text.toLowerCase()];
        } else {
            if (logConfig_printUnmatchedTextToConsole) {
                console.log(text);
            }
            if (logConfig_saveUnmatchedTextToArray) {
                if (!unmatchedTexts.includes(text)) {
                    unmatchedTexts.push(text);
                }
            }
            if (logConfig_printUnmatchedTextArray) {
                console.log(unmatchedTexts);
            }
            return oriText;
        }
    }
})();
