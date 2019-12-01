const {remote, shell} = require('electron')
const https = require('https');
const DataStore = require('../script/store')
const dataStore = new DataStore()

//上传图片到CSDN
function uploadPictureToCSDN(filePath) {
    let formData = new FormData();
    formData.append('file', fs.createReadStream(filePath))

    let headers = formData.getHeaders()
    headers.Cookie = dataStore.getCSDNCookies() //获取Cookie
    //自己的headers属性在这里追加
    return new Promise((resolve, reject) => {
        let request = https.request({
                                        host: 'mp.csdn.net',
                                        method: 'POST',
                                        path: '/UploadImage?shuiyin=2',
                                        headers: headers
                                    }, function (res) {
            let str = '';
            res.on('data', function (buffer) {
                       str += buffer;
                   }
            );
            res.on('end', () => {
                if (res.statusCode === 200) {
                    const result = JSON.parse(str);
                    //上传之后result就是返回的结果
                    console.log(result)
                    if (result.result === 1) {
                        resolve(result.url.substring(0, result.url.indexOf('?')))
                    } else {
                        reject(result.content)
                    }
                }
            });
        });
        formData.pipe(request)
    })
}

//上传文章到CSDN
function publishArticleToCSDN(title, markdowncontent, content) {
    let formData = new FormData();
    formData.append('title', title)
    formData.append('markdowncontent', markdowncontent)
    formData.append('content', content)
    formData.append('id', '')
    formData.append('readType', 'public')
    formData.append('tags', '')
    formData.append('status', 2)
    formData.append('categories', '')
    formData.append('type', '')
    formData.append('original_link', '')
    formData.append('authorized_status', 'undefined')
    formData.append('articleedittype', 1)
    formData.append('Description', '')
    formData.append('resource_url', '')
    formData.append('csrf_token', '')

    let headers = formData.getHeaders()
    headers.Cookie = dataStore.getCSDNCookies() //获取Cookie
    //自己的headers属性在这里追加
    let request = https.request({
                                    host: 'mp.csdn.net',
                                    method: 'POST',
                                    path: '/mdeditor/saveArticle',
                                    headers: headers
                                }, function (res) {
        let str = '';
        res.on('data', function (buffer) {
                   str += buffer;
               }
        );
        res.on('end', () => {
            if (res.statusCode === 200) {
                console.log(str)
                const result = JSON.parse(str);
                //上传之后result就是返回的结果
                // console.log(result)
                if (result.status) {
                    remote.dialog.showMessageBox({message: '发布成功！是否在浏览器打开？', buttons: ['取消', '打开']})
                        .then((res) => {
                            if (res.response === 1) {
                                shell.openExternal(result.data.url).then()
                            }
                        })
                } else {
                    remote.dialog.showMessageBox({message: result.content}).then()
                }
            }
        });
    });
    formData.pipe(request)

    request.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        remote.dialog.showMessageBox({message: e.message}).then()
    });
}

exports.uploadPictureToCSDN = uploadPictureToCSDN
exports.publishArticleToCSDN = publishArticleToCSDN