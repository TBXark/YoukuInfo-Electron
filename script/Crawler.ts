// const cheerio = require('cheerio')

export class YoukuResult {
    id: string
    url: string
    title: string = ''
    keywords: string[] = []
    auth: {id: string, name: string} = {id: '', name: ''}
    video: string = ''
    image: string = ''
    constructor(){}
}

export class Crawler {
  httpRequest(aURL: string, cb: (res: string) => void) {
    const req = new XMLHttpRequest()
    req.onreadystatechange = function(this: XMLHttpRequest, ev: Event) {
        if (this.readyState == 4 ) {
            if (this.status == 200) {
                cb(this.responseText)
            } else{
                cb(null)
            }``
        }
    }
    req.open("GET",aURL,true);
    req.send(null)
    }

    start(urls: string[], finish: (result: YoukuResult[]) => void) {
        const res: Map<Number, YoukuResult> = new Map<Number, YoukuResult>()
        const total =  urls.length
        let count =  total
        
        for(let i in urls) {
            this.request(urls[i], (info: YoukuResult) => {
                if (info != null) {
                    res[i] = info
                }
                count = count - 1
                console.log(info.id);
                if(count == 0) {                    
                    let array = new Array<YoukuResult>()
                    for(let j = 0; j < total; j ++) {
                        const temp  = res[j]
                        if(temp != null) {
                            array.push(temp)
                        } 
                    }
                    finish(array)
                }
            })
        }
    }

    request(url: string, callback: (info: YoukuResult) => void) {
        // console.log(url);
        this.httpRequest(url, (htmlStr) => {
            const numIdRegx = new RegExp('videoId:\"[a-zA-Z0-9=]*');
            const regxRes = numIdRegx.exec(htmlStr);                                 
            if (regxRes != null && regxRes.length > 0) {
                const id = regxRes[0].replace('videoId:\"', '')
                const jsonURL = `http://play.youku.com/play/get.json?vid=${id}&ct=12`                    
                this.httpRequest(jsonURL, (jsonStr) => {
                    // console.log(jsonStr);
                    
                    if(jsonStr != null) {
                        const infoJson = JSON.parse(jsonStr)                            
                        const info = new YoukuResult()
                        info.id = id
                        info.url = url
                        try {
                            info.video = `<iframe height=498 width=510 src='${'http://player.youku.com/embed/' + infoJson.data.video.encodeid}' frameborder=0 'allowfullscreen'></iframe>`
                            info.title = infoJson.data.video.title
                            info.keywords = infoJson.data.video.tags
                            const youkuUserId = infoJson.data.video.userid;
                            let auth =  {id: '', name: ''}
                            if ( youkuUserId == '4252709') {
                                auth = {id:'5743fa2c1700003d00e61f87', name: '谢双超'}
                            } else if (youkuUserId  == '87726096') {
                                auth = {id:'56c04b8518000021009d3766', name: '刘哥'}
                            } else if ( youkuUserId == '985159227') {
                                auth = {id:'582052a11d00000f00d6ec17', name: '虾米大模王'}
                            }
                            info.auth = auth
                            info.image = infoJson.data.video.logo.replace('r1', 'r3')
                        } catch(e) {
                            console.log(e);
                        }
                        callback(info)
                    } else {
                        callback(null)
                    }
                })
            } else {
                callback(null)
                // if (htmlStr != null) {
                //     const data = this.parse(htmlStr)
                //     if (data != null){
                //         data.url = url
                //     }
                //     callback(data)
                // } else {
                //     callback(null)
                // }
            }
        })
    }



    // parse(html: string): YoukuResult {
    //     const info = new YoukuResult()
    //     try {
    //         const $ = cheerio.load(html)
    //         const titleRegx = new RegExp('<title>[^<]+</title>')
    //         const rs1 = titleRegx.exec(html)
    //         const videoIdRegx = new RegExp('(videoId2|videoIdEn)= \"[a-zA-Z0-9=]*')
    //         const rs2 = videoIdRegx.exec(html)
    //         const videoId = rs2[0].replace('(videoId2|videoIdEn)= \'', '')
    //         const videoCode = `<iframe height=498 width=510 src=\'${'http://player.youku.com/embed/' + videoId}\' frameborder=0 'allowfullscreen'></iframe>`;

    //         let videoTitle = '';
    //         if (rs1 != null && rs1.length > 0) {
    //             videoTitle = rs1[0].replace('<title>', '').replace('</title>', '').split('在线播放')[0]
    //         } else {
    //             let titleRegx2 = new RegExp('showTitle =[^;]+;')
    //             let rs1s =  titleRegx2.exec(html)
    //             if (rs1s != null && rs1s.length > 0) {
    //                 videoTitle = rs1s[0].replace('showTitle =', '')
    //             }
    //         }
            

    //         let image = '';
    //         if ($('#s_qq_haoyou1').attr('href') != null) {
    //             let data = $('#s_qq_haoyou1').attr('href').split('imageUrl=');
    //             if (data != null && data.length > 0 ){
    //             image = $('#s_qq_haoyou1').attr('href').split('imageUrl=')[1].split('&')[0].replace('05420', '05410').replace('r1', 'r4');
    //             }
    //         } else if ($('#share-qq').attr('href') != null) {
    //             let data = $('#share-qq').attr('href').split('pics=');
    //             if (data != null && data.length > 0 ){
    //             image = data[1].split('&')[0].replace('05420', '05410').replace('r1', 'r4');
    //             }
    //         }

    //         const realUrl = 'http://v.youku.com/v_show/id_' + videoId + '.html';
    //         let auth =  {id: '', name: ''}
    //         if (videoTitle.indexOf("刘哥") > 0) {
    //             auth = {id:'56c04b8518000021009d3766', name: '刘哥'};
    //         } else if (videoTitle.indexOf("评头论足") > 0) {
    //             auth = {id:'5743fa2c1700003d00e61f87', name: '谢双超'}
    //         } else if (videoTitle.indexOf("虾米") > 0 ) {
    //             auth = {id:'582052a11d00000f00d6ec17', name: '虾米大模王'}
    //         } 
    //         info.id = videoId
    //         info.title = videoTitle
    //         info.video = videoCode
    //         info.auth = auth
    //         info.image = image
    //         info.keywords = []
    //         return info
    //     } catch(e) {
    //        return null
    //     }
    // } 
}



export class YoukuRender {
    
    buildRow(key: string, value: string): string {
        return `
        <tr>
        <td width='100px'>
            <div class='data'>${key}</div>
        </td>
        <td>
            <div class='data'>${value}</div>
        </td>
        </tr>`
    }
     buildHTMLByJson(info: YoukuResult): string   {
        if(info != null) {
            const id = info.id
            const openJs = `window.open('${info.url}')`;
            const title = `
                <input id='${'title' + id}' class='sinput' value='${info.title}'</input>
                <span >&nbsp; &nbsp; &nbsp;</span>
                <button onclick='"+ openJs + "'> 跳转网页 </button>
                <button class='copyBtn' data-clipboard-target='#${'title' + id}'>复制</button>
            `

            const keywords = `
                <input   id='${'keywords' + id}' class='liput' value='${info.keywords}'</input>
                <span >&nbsp; &nbsp; &nbsp;</span>
                <button class='copyBtn' data-clipboard-target='#${'keywords' + id}'>复制</button>
            `


           
            const videoId = "videoCode" + id;
            const video = "<input id='" + videoId + "' class='liput' value=\"" +  info.video + "\"</input>" + "<span >&nbsp; &nbsp; &nbsp;</span><button class='btn' data-clipboard-target='#" + videoId + "'>复制</button>";



            const auth = `
                <input id='${"authId" + id}' class='liput' value='${info.auth.id}'</input>
                <span >&nbsp; &nbsp; &nbsp;</span>
                <button class='copyBtn' data-clipboard-target='#${"authId" + id}'>复制</button>
            `

            // const saveJs = `window.downloadFile(${info.image})`;
            // const closeJs = `document.getElementById(${'table' + id}).hidden = true;`;
            // <span >&nbsp; &nbsp; &nbsp;</span>
            //     <button onclick='${saveJs}'> 下载</button>
            //     <span >&nbsp; &nbsp; &nbsp;</span>
            //     <button onclick='${closeJs}'> 关闭</button>
            const image =  `
                <img src='${info.image}' />
            `;


            const tableContent =  `
                <table class='table' id='${'table' + id}'>
                ${this.buildRow("标题", title)}
                ${this.buildRow("关键词", keywords)}
                ${this.buildRow("通用代码", video)}
                ${this.buildRow(info.auth.name, auth)}
                ${this.buildRow("缩略图", image)}
                </table>
                <br><br>
            `;
            return tableContent
        } else {
            return `
            <table class='table'>
            ${this.buildRow("失败", info.url || 'url is error')}
            /table>
            <br><br>
            `
        }
    }

    buildHTMLByArray(array: YoukuResult[]) : string {
        let content = ''
        for(let info of array) {
            content += this.buildHTMLByJson(info)
        }
        return content
    }
}