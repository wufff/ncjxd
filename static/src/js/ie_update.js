
/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-11-07 09:42:21
 * @version $Id$
 */
 // alert("10以下");
 // window.location.href ="https://www.baidu.com";



    document.body.innerHTML = "";
    var  div = document.createElement("div");
    var html = "";
	html += '<div id="header">'
	html += '<div class="container">'
	html +=  '<div class="title">'
	html +=    '<h3>湖北省农村教学点网校</h3>'
	html +=        ' <p>— 管理与服务平台 —</p>'
	html +=     '</div>'
	html += '</div>'
	html += '</div>'
    html += '<div class="container" style="padding-top:30px;">'
    html += '<p style="font-size:20px; color:#666">您的IE浏览器本版本过低 !</p>';
    html += '<p style="font-size:18px; color:#666">本站包含 视频 等多媒体内容 ! 为确保您正常观看推荐使用 <a href="http://qty83k.creatby.com/materials/origin/a5234ae3c4265f687c7fffae2760a907_origin.png"><img src="http://qty83k.creatby.com/materials/origin/a5234ae3c4265f687c7fffae2760a907_origin.png">谷歌浏览器</a> 或 <a href="http://www.firefox.com.cn/"><img src="http://www.firefox.com.cn/media/img/logos/firefox/logo-quantum.9c5e96634f92.png">火狐浏览器 </a> 。</p>';
    html += '<p  style="font-size:18px; color:#666">如要使用IE浏览器，请将IE浏览器升级到10，或10以上。</p>';
    html += '</div>'
    div.innerHTML = html;
    document.body.appendChild(div);