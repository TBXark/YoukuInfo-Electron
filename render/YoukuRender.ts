/// <reference path="../node_modules/.1.4.32@@types/electron/index.d.ts" />

const ipcRenderer = require('electron').ipcRenderer
const {webContents} = require('electron')
const contentBody = document.body as HTMLBodyElement
const clipboard = require('electron').clipboard

import { Crawler, YoukuRender, YoukuResult } from '../script/Crawler'



ipcRenderer.once('urls', (event: any, ...args: any[]) => {
    if (args.length > 0){
        const crawler = new Crawler()
        crawler.start(args[0],(result) => {
            const render = new YoukuRender()
            console.log(result);
            const html = render.buildHTMLByArray(result)
            document.body.innerHTML = html
            bindClick()
        })
    }
});


function bindClick() {
    const copyBtns = document.getElementsByClassName('copyBtn')            
    for(let i = 0; i < copyBtns.length; i ++ ) {
        const btn: HTMLButtonElement = copyBtns[i] as HTMLButtonElement
        btn.title = 'Copy'
        btn.addEventListener('click', function(event) {
            btn.innerHTML = '已复制'
            const targetId = this.getAttribute('data-clipboard-target')
            if (targetId == null ) { return }
            const input = document.getElementById(targetId) as HTMLInputElement
            if (input == null) { return }
            console.log(input.value)
            clipboard.write({text: input.value})
        })
    }
}
