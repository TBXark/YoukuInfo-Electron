/// <reference path="../node_modules/.1.4.32@@types/electron/index.d.ts" />
"use strict";
const ipcRenderer = require('electron').ipcRenderer;
const { webContents } = require('electron');
const contentBody = document.body;
const clipboard = require('electron').clipboard;
const Crawler_1 = require("../script/Crawler");
ipcRenderer.once('urls', (event, ...args) => {
    if (args.length > 0) {
        const crawler = new Crawler_1.Crawler();
        crawler.start(args[0], (result) => {
            const render = new Crawler_1.YoukuRender();
            console.log(result);
            const html = render.buildHTMLByArray(result);
            document.body.innerHTML = html;
            bindClick();
        });
    }
});
function bindClick() {
    const copyBtns = document.getElementsByClassName('copyBtn');
    for (let i = 0; i < copyBtns.length; i++) {
        const btn = copyBtns[i];
        btn.title = 'Copy';
        btn.addEventListener('click', function (event) {
            btn.innerHTML = '已复制';
            const targetId = this.getAttribute('data-clipboard-target');
            if (targetId == null) {
                return;
            }
            const input = document.getElementById(targetId);
            if (input == null) {
                return;
            }
            console.log(input.value);
            clipboard.write({ text: input.value });
        });
    }
}
