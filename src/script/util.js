//字符数统计
exports.stringLength = (str) => {
    let result = {
        chinese: 0,
        english: 0,
        number: 0,
        other: 0
    }
    for (let i=0; i<str.length; i++) {
        let c = str.charCodeAt(i);
        //单字节加1
        if (c>=0x4e00&&c<=0x9fa5){
            result.chinese++
        } else if (c>=0x61 && c<=0x7a || c>=0x41 && c<=0x5a){
            result.english++
        }else if (c>=0x30&&c<=0x39){
            result.number++
        }else {
            result.other++
        }
    }
    return result;
}

//用word方式计算正文字数
exports.findStringWords = (str) => {
    let sLen = 0;
    try{
        //先将回车换行符做特殊处理
        str = str.replace(/(\r\n+|\s+|　+)/g,"龘");
        //处理英文字符数字，连续字母、数字、英文符号视为一个单词
        str = str.replace(/[\x00-\xff]/g,"m");
        //合并字符m，连续字母、数字、英文符号视为一个单词
        str = str.replace(/m+/g,"*");
        //去掉回车换行符
        str = str.replace(/龘+/g,"");
        //返回字数
        sLen = str.length;
    }catch(e){

    }
    return sLen;
}
//只保留汉字+英文+数字
exports.stringDeal = (str) => {
    let result = ''
    for (let i=0; i<str.length; i++) {
        let c = str.charCodeAt(i);
        if (c>=0x4e00&&c<=0x9fa5){ //汉字
            result+= str.charAt(i)
        } else if (c>=0x61 && c<=0x7a || c>=0x41 && c<=0x5a){ //字母
            result+=str.charAt(i)
        }else if (c>=0x30&&c<=0x39){ //数字
            result+=str.charAt(i)
        }
    }
    return result
}

//读取每一个已插入的图片链接
exports.readImgLink = (text, callback)=> {
    let objReadline = text.split('\n')
    for (let i = 0; i < objReadline.length; i++) {
        let line = objReadline[i] + ''
        const split = line.indexOf('!') !== -1 ? line.split('!') : []
        for (let i = 0; i < split.length; i++) {
            let block = split[i]
            if (block.length > 4 && block.indexOf('[') !== -1 && block.indexOf(']') !== -1
                && block.indexOf('(') !== -1 && block.indexOf(')') !== -1) {
                const start = block.lastIndexOf('(')
                const end = block.lastIndexOf(')')
                const src = block.substring(start + 1, end) //图片地址
                callback(src)
            }
        }
    }
}
//是否是网络图片
exports.isWebPicture = (src)=> {
    return src.startsWith('http') && (src.endsWith('png') || src.endsWith('jpg')
                                      || src.endsWith('png') || src.endsWith('jpeg')
                                      || src.endsWith('gif') || src.endsWith('bmp'))
}

//是否是本地图片
exports.isLocalPicture = (src)=> {
    return !src.startsWith('http') && (src.endsWith('png') || src.endsWith('jpg')
                                       || src.endsWith('png') || src.endsWith('jpeg')
                                       || src.endsWith('gif') || src.endsWith('bmp'))
}

//创建表格md代码
exports.createTableMD = (row,col)=> {
    let table = ''
    for (let i = 0; i < row; i++) {
        table+='|'
        for (let j = 0; j < col; j++) {
            table+='     |'
        }
        table+='\n'
        if (i===0){
            table+='|'
            for (let j = 0; j < col; j++) {
                table+=' --- |'
            }
            table+='\n'
        }
    }
    return table
}