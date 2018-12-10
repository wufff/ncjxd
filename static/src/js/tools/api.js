define(["jquery"], function($) {
	return {
		ajaxJSONP: function(url, data, callback) {
			$.ajax({
				type: "get",
				async: false,
				url: url,
				data: data,
				dataType: "jsonp",
				jsonp: "callback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
				success: function(json) {
					callback(json);
				},
				error: function(e) {
					// promptMessageDialog({
					//     icon: "warning",
					//     content: "网络请求错误！",
					//     time: 1000
					// });
					alert("ajaxJSONP error");
				}
			});
		},

		ajaxPost(requestUrl, requestData, SuccessCallback, successPar) {
			$.ajax({
				type: "POST",
				url: requestUrl,
				data: requestData,
				contentType: "application/x-www-form-urlencoded",
				dataType: "text",
				sync: false,
				success: function(data) {
					var obj = null;
					try {
						obj = eval('(' + data + ')');
					} catch (ex) {
						obj = data;
					}
					
					// if (obj == null) {
					// 	return;
					// }
					if (obj.type == "login") {
						alert("请先登录");
						// loginDialog(); //调用登陆弹框
					} 
			
					if( successPar && successPar != 0){
						SuccessCallback(obj, successPar);
					}else {
						SuccessCallback(obj);
					}
					
				},
				error: function(err) {
					alert(err);
				},
				complete: function(XHR, TS) {
					XHR = null
				}
			});
		}
	}
})
