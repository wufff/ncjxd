var NA = navigator.appVersion;
var NV = navigator.vendor;
        //safari浏览器
        if (!!NV.match(/Apple/)) {
            location.href = "/common/browserupdate"
        } else if (!!NA.match(/QQBrowser/) && !NA.match(/Trident/)) {
            //QQ浏览器10及以下
            if (Number(NA.split("/")[5].split(".")[0]) <= 9) {
                location.href = "/common/browserupdate";
            }
        } else if (!!NA.match(/QQBrowser/) && !!NA.match(/Trident/)) {
            alert("您当前使用的兼容模式，为了您的体验，请使用极速模式!");
        } else if (!!NA.match(/BIDUBrowser/) && !NA.match(/Trident/)) {
            //百度7.6及以下
            if (Number(NA.split("/")[3].split(" ")[0]) <= 7.6) {
                location.href = "/common/browserupdate";
            }
        } else if (!!NA.match(/BIDUBrowser/) && !!NA.match(/Trident/)) {
            alert("您当前使用的兼容模式，为了您的体验，请使用极速模式!");
        } else if (!!window.ActiveXObject || "ActiveXObject" in window) {
            //ie浏览器
            location.href = "/common/browserupdate";
        }