//时间戳转时间类型
export const formatdate = function (timeStamp) {
    if (timeStamp > 0) {
        var date = new Date();
        date.setTime(timeStamp * 1000);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
    } else {
        return "";
    }

    //return new Date(parseInt(time_stamp) * 1000).toLocaleString().replace(/年|月/g, "/").replace(/日/g, " ");
}
export const formatDateTime = function (inputTime) {
    var date = new Date(inputTime);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
};
export const randomsort = function (a, b) {
    return Math.random() > .5 ? -1 : 1;
    //用Math.random()函数生成0~1之间的随机数与0.5比较，返回-1或1
}

//日期转时间戳
export const dateTimeStamp = function (data) {
    let date = new Date(data);
    let timestamp = date.getTime()
    return timestamp
}

//获取html字符串中图片src
//第一张图片src

export const getFirstPic = (str) => {
    let data = ''
    str.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/, function (match, capture) {
        data = capture
    })
    return data
}
//所有图片的src

export const getimgsrc = (htmlstr) => {
    var reg = /<img.+?src=('|")?([^'"]+)('|")?(?:\s+|>)/gim
    var arr = []
    var tem = null
    while (tem = reg.exec(htmlstr)) {
        arr.push(tem[2])
    }
    return arr
}

// export const getVideoImg = (url) => {
//     let $video =
//         '<div><video controls src="' +
//         url +
//         '"></video></div><div> </div>';
//     let box = document.getElementById("box_video");
//     box.innerHTML = $video;
//     console.log(box);
//     let videoElement = document.getElementById("video");
//     videoElement.addEventListener("canplay", function (_event) {
//         let canvas = document.createElement("canvas");
//         canvas.width = videoElement.videoWidth;
//         canvas.height = videoElement.videoHeight;
//         canvas
//             .getContext("2d")
//             .drawImage(videoElement, 0, 0, canvas.width, canvas.height);
//         console.log(canvas.toDataURL("image/png")); //第一帧图片url
//         return canvas.toDataURL('image/png')
//     });
// }