	/***
	 * APP公共函数
	 * 添加方法请注释函数说明、作者、日期、参数说明（取值范围为有限序列需一一列举）
	 * @author qin
	 * @date 2017-05-28
	 * @ref app-url.js,app-constant.js
	 */
	
	
	/**       
	 * 对Date的扩展，将 Date 转化为指定格式的String       
	 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符       
	 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)       
	 * eg:       
	 * (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423       
	 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04       
	 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04       
	 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04       
	 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18       
	 */          
	Date.prototype.pattern=function(fmt) {           
	    var o = {           
	    "M+" : this.getMonth()+1, //月份           
	    "d+" : this.getDate(), //日           
	    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时           
	    "H+" : this.getHours(), //小时           
	    "m+" : this.getMinutes(), //分           
	    "s+" : this.getSeconds(), //秒           
	    "q+" : Math.floor((this.getMonth()+3)/3), //季度           
	    "S" : this.getMilliseconds() //毫秒           
	    };           
	    var week = {           
	    "0" : "/u65e5",
	    "1" : "/u4e00",
	    "2" : "/u4e8c",
	    "3" : "/u4e09",
	    "4" : "/u56db",
	    "5" : "/u4e94",
	    "6" : "/u516d"
	    };           
	    if(/(y+)/.test(fmt)){           
	        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));           
	    }           
	    if(/(E+)/.test(fmt)){           
	        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);           
	    }           
	    for(var k in o){           
	        if(new RegExp("("+ k +")").test(fmt)){           
	            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));           
	        }           
	    }           
	    return fmt;           
	}
	
	
	/***
	 * 获取格式化后的日期时间
	 */
	function getFmtDateTime(dateTime) {
		
		if (!dateTime) return "";
		if (dateTime.length == 16 || dateTime.length == 10) {
			return dateTime; // 已格式化的日期或日期时间
		}
		
		var retDateTime = "";
		
		// 格式化日期
		try { 
			retDateTime = dateTime.pattern("yyyy-MM-dd HH:mm");
			return retDateTime;
		} catch(e) {
			if (dateTime.length > 16) {
				try { retDateTime = dateTime.substring(0,16); } 
				catch(e) { retDateTime = dateTime; }
			} else {
				retDateTime = dateTime;
			}
		}
		
		return retDateTime;
	}
	
	
	/**
	 * 发送请求
	 * @param {String} bottomUrl 接口地址(必须填)
	 * @param {Object} args 请求参数
	 * @param {Function} success 成功回调函数(必须填)
	 * @param {Function} errorCallback 请求失败回调
	 * @param {Long} timeout 超时时间(毫秒)
	 * @param {String} requestType 请求类型
	 * @param {String} dataType 数据类型
	 */
	
	var token = (()=>{
		return plus.storage.getItem("token");
	})();
	
	function sendRequest(bottomUrl, args, success, errorCallback, timeout, requestType, dataType) {
		
		// 2.设置请求访问的链接
		args.token = token;
		var url = topUrl + bottomUrl;
		error = function(xhr,type,errorThrown){ // 设置请求错误操作
			
			// 异常处理；
			console.log("--------------------------------------");
			console.log("报错Url : " + bottomUrl);
			
			try{
				closeWaiting();
			}catch(e){}
			
			switch(type){
				case "timeout": 
					mui.toast("请求超时, 请检查网络设置或重新登录");
					break;
				case "abort" : 
					mui.toast("无法连接服务器, 请检查网络设置");
					break;
				default : 
					//mui.toast("请求出错, 请尝试重新登录");
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
		
		mui.ajax( url,{
			data : args,
			dataType : dataType,//服务器返回json格式数据
			type : requestType,//HTTP请求类型
			timeout : timeout,
			traditional : true, // 处理数组
			// headers : {'Content-Type':'application/json'}, // 加了头部后可能数据出现错误, 这里屏蔽
			success : success,
			error : error
		});
	}
	
	
	/**
	 * 默认方法打开新界面
	 * @param {Object} openUrl 目标路径
	 * @param {Object} openId 新窗口id
	 * @param {Object} openArg 需要传到下个页面的参数, 对象
	 */
	function openNewPage(openUrl,openId,openArg) {
		mui.openWindow({
			url:openUrl,
		    id:openId,
		    styles:{
				bounce: 'vertical'
		    },
		    extras: openArg,
		    show : {
				aniShow:"pop-in" //页面显示动画，默认为”slide-in-right“；
		    },
			waiting:{
				autoShow:false
			}
		});
	}	
	
	
	/**
	 * 通过定位模块获取位置信息
	 * @param {Object} success 获取数据成功的回调方法, 方法参数为position
	 */
	function getLocation(success){
		plus.geolocation.getCurrentPosition(success, function (e) {
			try {
				closeWaiting();
			} catch(e){}
			mui.toast( "获取位置信息失败："+e.message );
		}, { geocode:true,provider:'amap'});
	}
	

	/**
	 * 显示等待框
	 * @param {Object} waitingText 等待时提示的文字
	 */
	function showWaiting ( waitingText ) {
		
		// 设置等待框的属性
		var waitingStyle = {
			loading : { display:"inline" },// 进度圈与文字同行
		}
		plus.nativeUI.showWaiting( waitingText , waitingStyle);
		
	}
	
	
	/***
	 * 关闭等待框
	 */
	function closeWaiting () {
		try {
			plus.nativeUI.closeWaiting();
		} catch(e) {
			//TODO handle the exception
		}
	}
	
	
	/***
	 * 获取“我管理的项目”列表，项目状态为运营中和预结项
	 * @flag 1: 我管理的项目（运营中和预结项）；
	 *       2：我参与的项目（运营中）；
	 *       3：我参与的项目（运营中、预结项）；
	 *       4：我管理的项目（运营中和预结项，不含‘全部项目’）
	 * @isPop 是否是弹出窗口
	 */
	function getProjectList(flag, success, isPop) {
		
		var cmd = "";
		switch (flag) {
			case CONST_PRJ_TYPE_MGR:
				cmd = CONST_PRJ_TYPE_MGR_CMD;
				break;
			case CONST_PRJ_TYPE_MGR_MIN:
				cmd = CONST_PRJ_TYPE_MGR_MIN_CMD;
				break;				
			case CONST_PRJ_TYPE_ATTEND:
				cmd = CONST_PRJ_TYPE_ATTEND_CMD;
				break;
			case CONST_PRJ_TYPE_ATTEND_EXT:
				cmd = CONST_PRJ_TYPE_ATTEND_EXT_CMD;
				break;
		}
		if (cmd == "") return;
		var _url = topUrl + "ProjectApi!listProject.action?cmd=" + cmd;
		
		var successCallBack = function(data) {
			
			var pickerData = _convertProjectData(data);
			if (isPop) {
				_getPopProject(pickerData, success);
			} else {
				success(pickerData);
			}
			
		}
		
		sendRequest(_url, {}, successCallBack);
	}	
	
	
	var projectPicker;
	/***
	 * 
	 * @param {Object} callbackPickerProject
	 */
	function _getPopProject(data, success) {
		
		if(!projectPicker) {
			projectPicker = new mui.PopPicker();
		}

		// var pickerData = _convertProjectData(data);
		
		projectPicker.setData(data);
		projectPicker.show(function(items) {
			try {
				
				var project = items[0];
				// project.pmNo = items[0].value;
				// project.pmName = items[0].text;
				
				var datas = [];
				datas[0] = project;
			    success(datas);
			    
			} catch(e) {
				
			}
	   });
		
	}	
	
	
	/**
	 * 回调项目后转换值格式
	 * @param {Object} data
	 */
	function _convertProjectData(data) {
		var pickerData = [];
		try {
		    var pickerData = [];
			$.each(data, function(index, _data) {
				    var userIds = "";
				    var userNames = "";
				    var fwtUserIds = "";
				    var fwtUserNames = "";
				    try{
				    	if(_data.pmExt){
					    	userIds=_data.pmExt.userIds;
					    	userNames=_data.pmExt.userNames;
					    	if(_data.pmExt.fwtUserIds){
					    		fwtUserIds=_data.pmExt.fwtUserIds;
					    		fwtUserNames=_data.pmExt.fwtUserNames;
					    	}
					    }
				    } catch(e) {}
					pickerData.push({
						value: _data.pmNo,
						text: _data.pmName, 
						pmNo: _data.pmNo, 
						pmName: _data.pmName, 
						userIds: userIds, 
						userNames: userNames, 
						fwtUserIds: fwtUserIds, 
						fwtUserNames: fwtUserNames
					});
			});
		} catch(e) {}
		
		return pickerData;
	};	
	
	
	/**
	 * 获取项目参与者
	 * @param {Object} pmNo 项目编号
	 * @param {fieldUserId} 接收参与者ID页面对象ID
	 * @param {fieldUserName} 接收参与者姓名页面对象ID
	 */
	function getProjectMember(pmNo, fieldUserId, fieldUserName) {
		var userUrl = "ProjectApi!list.action?cmd=201&pmNo=" + pmNo;
		var tempUrl = topUrl + userUrl;
		mui.ajax({
			url: tempUrl,
			dataType: 'json',
			async: true,
			type: 'post',
			success: function(data) {
				try {
					var picker = new mui.PopPicker();
					var pickerData = [];
					$.each(data.rows, function(index, _data) {
						pickerData.push({
							value: _data.userid,
							text: _data.username
						});
					});
					picker.setData(pickerData);
					picker.show(function(items) {
						chgInputValue(fieldUserId, items[0].value);
						chgInputValue(fieldUserName, items[0].text);
					});
				} catch(e) {
	
				}
			}
		});
	};	
	

	/***
	 * 下拉选择
	 * @param {Object} fieldName
	 * @param {Object} dataArr
	 */
	function pickerPopPicker(fieldName,dataArr) {
		 var picker = new mui.PopPicker();
		 if(!dataArr){
		 	dataArr=[];
		 }
		 picker.setData(dataArr);
		 picker.show(function (selectItems) {
		 	chgInputValue(fieldName,selectItems[0].text);
		 })
	};
	
	
	/**
	 * 时间选择
	 * @param {Object} fieldName
	 * @ref 
	 */
	function pickerDtPicker(fieldName) {
		
		 var dtPicker = new mui.DtPicker({"type": "datetime"}); 
	     dtPicker.show(function (selectItems) {
	     	var dt = "";
	     	dt +=       selectItems.y.text;
	     	dt += "-" + selectItems.m.text;
	     	dt += "-" + selectItems.d.text;
	     	dt += " " + selectItems.h.text;
	     	dt += ":" + selectItems.i.text;
	     	chgInputValue(fieldName,dt);
	    })
	     
	};
	
	
	/**
	 * 自动赋值
	 * @param {Object} fieldName
	 * @param {Object} fieldValue
	 */
	function chgInputValue(fieldName, fieldValue) {
		try {
			var tagName = $('#' + fieldName).get(0).tagName.toUpperCase();
			if (tagName == "SELECT") {
				$('#' + fieldName).val(fieldValue);
			} else if (tagName == "INPUT") {
				$('#' + fieldName).val(fieldValue);
			} else {
				$('#' + fieldName).get(0).innerHTML = fieldValue;
			}
		} catch(e) {}
	}
	
	
	/***
	 * 表单提交
	 * @param {Object} cmd
	 * @param {Object} params
	 * @param {Object} successCallBack
	 */
	function postForm(cmd,params,successCallBack) {
		var url=topUrl+projectApi+cmd;
		var dataType = "json";
		if(!successCallBack){
			successCallBack = function(rtnData){}
		}
		mui.post(url, params, successCallBack, dataType);
	}
	
	
	/**
	 * 下载并打开相应附件
	 * @param {String} id <p附件id
	 * @param {String} path 下载路径与文件名称
	 */
	function downloadAccess(id,path){
		// 设置下载文件名称
		var optionData = {
			filename:path
		};
		// 创建下载任务
		var dtask = plus.downloader.createDownload(
			topUrl+downloadAccessory+id,optionData,function(d,status){
			// 检测状态码, 200表示成功, 成功后打开附件
			if ( status == 200 ) {
				plus.runtime.openFile(path);
			} else {
				mui.toast( "Download failed: " + status ); 
			}  
		});
		dtask.start(); 
	}
	
	
	/**
	 * 下载附件带成功操作型
	 * @param {String} id <p附件id
	 * @param {String} path 下载路径与文件名称
	 * @param {Function} successFun <p下载成功后的操作, 参数为d
	 */
	function downloadAccessOther(id,path,successFun) {
		
		// 设置下载文件名称
		var optionData = {
			filename:path
		};
		
		// 创建下载任务
		var dtask = plus.downloader.createDownload(
			topUrl+downloadAccessory+id,optionData,function(d,status){
			// 检测状态码, 200表示成功, 成功后打开附件
			if ( status == 200 ) {
				successFun(d);
			} else {
				mui.toast( "Download failed: " + status ); 
			}  
		});
		
		//dtask.addEventListener( "statechanged", onStateChanged, false );
		dtask.start(); 
	}
	
	
	/**
	 * 获取附件的文件类型
	 * @param {Object} id 附件id
	 * @param {Object} listData 附件列表数据
	 */
	function getAccessoryType(id,listData){
		var num;
		for(num in listData){
			if(id == listData[num].id){
				var index = listData[num].fileName.lastIndexOf(".");
				return listData[num].fileName.substring(index);
			}
		}
		return null;
	}
	
	
	/**
	 * 获取当前页面参数
	 * */
	function getWebviewItem(keyName) {
		return plus.webview.currentWebview()[keyName];
	}
	
	
	/***
	 * 设置程序图标右上角显示的提示数字，0表示清除
	 */
	function setBadge(number) {
		plus.runtime.setBadgeNumber(number);
		console.log( "设置程序图标右上角显示的提示数字为" + number);
		if (plus.os.name=="iOS") {
			console.log( '*如果无法设置提示数字，请到"设置"->"通知"中配置应用在通知中心显示!' );
		} else {
			console.log( "注：仅支持小米(MIUI v5)，其它设备暂不支持此功能!" );
		}
	}
	
	
	/***
	 * 从服务器端获取当天日期、时间
	 * @param {Object} success 获取日期时间后返回值
	 */
	function getServerDateTime(success){
		var _url = "attendanceDate/curDate";
		var params = {};
		sendRequest(_url, params, success);	
	}
	
	
	/***
	 * 截取字符串 包含中文处理 (串,长度,增加...,长度不够补空) 
	 * 2007-11-28 XuJian
	 * @ref http://www.jb51.net/article/14210.htm
	 */
	function subString(str, len, hasDot, attachEmpty) 
	{
		if (!str) return '';
	    var newLength = 0; 
	    var newStr = ""; 
	    var chineseRegex = /[^\x00-\xff]/g; 
	    var singleChar = ""; 
	    var strLength = str.replace(chineseRegex,"**").length; 
	    for(var i = 0;i < strLength;i++) 
	    { 
	        singleChar = str.charAt(i).toString(); 
	        if(singleChar.match(chineseRegex) != null) 
	        { 
	            newLength += 2; 
	        }     
	        else 
	        { 
	            newLength++; 
	        } 
	        if(newLength > len) 
	        { 
	            break; 
	        } 
	        newStr += singleChar; 
	    } 
	    
	    // 超过长度在字符串后增加“...”
	    if(hasDot && strLength > len) 
	    { 
	        newStr += "..."; 
	    } 
	    
	    // 用“ ”补齐字符串长度
	    if (attachEmpty && strLength < len) {
	    	for (var i = strLength; i < len; i++) {
	    		newStr += "  ";
	    	}
	    }
	    
	    return newStr; 
	}
	
