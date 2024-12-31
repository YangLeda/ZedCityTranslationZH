// ==UserScript==
// @name         Zed City 汉化
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  网页游戏 Zed City 的汉化插件。Chinese translation for the web game Zed City.
// @author       bot740
// @match        https://www.zed.city/*
// @icon         https://www.zed.city/favicon.ico
// @grant        unsafeWindow
// ==/UserScript==

(() => {
    const open_prototype = XMLHttpRequest.prototype.open;
    unsafeWindow.XMLHttpRequest.prototype.open = function () {
        this.addEventListener("readystatechange", function (event) {
            if (this.readyState === 4) {
                let modifiedResponse = this.response;
                if (this.responseURL.includes("api.zed.city/getNews")) {
                    modifiedResponse = getModifiedResponseOfGetNewsXML(this);
                }
                Object.defineProperty(this, "response", { writable: true });
                Object.defineProperty(this, "responseText", { writable: true });
                this.response = modifiedResponse;
                this.responseText = modifiedResponse;
            }
        });
        return open_prototype.apply(this, arguments);
    };

    function getModifiedResponseOfGetNewsXML(xml) {
        let response = JSON.parse(xml.response);
        if (response.posts) {
            for (const post of response.posts) {
                if (XMLDictGetNews[post.text]) {
                    post.text = XMLDictGetNews[post.text];
                } else {
                    console.log(post);
                }
            }
        }
        return JSON.stringify(response);
    }

    // XML词典：更新日志中的正文
    const XMLDictGetNews = {
        "<div>- Weapons and armour will be destroyed when it reaches 0% condition<br />- Trophy items have been made not tradable<br />- Messages icon has been removed from top menu until the feature is added</div>":
            "<div>- 武器和盔甲在耐久度降至 0% 时将被摧毁<br />- 奖杯物品已设置为不可交易<br />- 顶部菜单中的消息图标已被移除，直至该功能添加完成</div>",
    };

    startTranslatePage();

    const excludes = ["K", "M", "B", "D", "H", "S", "Lv", "MAX", "wiki", "discord", "XP", "N/A"];

    const excludeRegs = [
        // 一个字母都不包含
        /^[^a-zA-Z]*$/,
    ];

    // 词典：通用
    const dictCommon = {
        purge: "清洗",
    };

    // 词典：更新日志
    const dictReleaseNotes = {
        "Upcoming Server Reset and Open Release": "即将到来的服务器重置和公开发布",
        "🏆Purge Event": "🏆清洗活动",
    };

    // 词典：Stronghold
    const dictStronghold = {
        gym: "健身房",
        "Train your stats to become more effective in combat": "锻炼属性在战斗中变得更强",
        train: "锻炼",
        "The damage you make on impact": "命中时造成的伤害",
        "Your ability to resist damage": "抵抗伤害的能力",
        "The chance of hitting your target": "命中敌人的几率",
    };

    const dictAll = { ...dictCommon, ...dictStronghold, ...dictReleaseNotes };
    const dictAllLowerCase = {};
    for (const key in dictAll) {
        dictAllLowerCase[key.toLowerCase()] = dictAll[key];
    }

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
                if (mutation.target) {
                    translateNode(mutation.target);
                }
                for (const node of mutation.addedNodes) {
                    translateNode(node);
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
            // console.error(text);
            return oriText;
        }
    }
})();
