/**
 * 发送请求
 * @param {String} bottomUrl 接口地址(必须填)
 * @param {Object} args 请求参数(必须填)
 * @param {Function} success 成功回调函数(必须填)
 * @param {Function} errorCallback 请求失败回调
 * @param {Long} timeout 超时时间(毫秒)
 * @param {String} requestType 请求类型
 * @param {String} dataType 数据类型
 */
function sendRequest(bottomUrl, args, success, errorCallback, timeout, requestType, dataType) {

	// 2.设置请求访问的链接
	var url = topUrl + bottomUrl;

	error = function(xhr, type, errorThrown) { // 设置请求错误操作
		//异常处理；
		console.log("--------------------------------------");
		console.log("报错Url : " + bottomUrl);
		console.log("类型 : " + type);
		console.log("描述 : " + errorThrown);

		try {
			closeWaiting();
		} catch (e) {}

		switch (type) {
			case "timeout":
				mui.toast("请求超时, 请检查网络设置或重新登录");
				break;
			case "abort":
				mui.toast("无法连接服务器, 请检查网络设置");
				break;
			default:
				mui.toast("请求出错, 请尝试重新登录");
				break;
		}

		if (errorCallback) { // 若需要做特殊处理, 则执行特殊处理的错误回调
			errorCallback();
		}

	}
	if (!timeout) { // 设置默认的请求超时为30秒
		timeout = 30000;
	}
	if (!requestType) { // 设置默认的请求类型为post请求
		requestType = 'post';
	}
	if (!dataType) { // 设置默认的请求数据类型为json数据
		dataType = 'json';
	}
	mui.ajax(url, {
		data: args,
		dataType: dataType, //服务器返回json格式数据
		type: requestType, //HTTP请求类型
		timeout: timeout,
		crossDomain: true,
		success: success,
		error: error
	});
}

/*
 请求模板:
 
	var args = {
		
	};
	var success = function(rtnData){
		console.log("--------------------------------------");
		console.log("请求的结果: " + JSON.stringify(rtnData));
	};
	var errorCallback = function () {
					
	};
	sendRequest(Url,args,success,error,timeout,requestType,dataType);
 
 */
