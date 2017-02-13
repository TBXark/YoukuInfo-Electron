/// <reference path="../node_modules/.1.4.32@@types/electron/index.d.ts" />
"use strict";
const BrowserWindow = require('electron').remote.BrowserWindow;
const path = require('path');
const url = require('url');
const showDetailBtn = document.getElementById('showdetail');
const urlTextArea = document.getElementById('urlarea');
showDetailBtn.addEventListener('click', function (event) {
    let win = new BrowserWindow({ width: 1200, height: 800 });
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'showdetail.html'),
        protocol: 'file:',
        slashes: true
    }));
    win.on('close', function () { win = null; });
    win.show();
    // win.webContents.openDevTools()
    win.webContents.on('did-finish-load', () => {
        const urls = urlTextArea.value.split('\n');
        setTimeout((arg) => {
            win.webContents.send('urls', urls);
        }, 1);
    });
});
