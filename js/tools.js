
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
 * 生成一个唯一表示
 */
function getOnlyOneId() {
	function S4() {
    	return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	}
  return (S4()+S4()+S4()+S4());
}
var token = plus.storage.getItem('token');
/**
 * 下载并打开相应附件
 * @param {附件id} id 附件id
 * @param {下载路径与文件名称} path 下载路径与文件名称
 */
function downloadAccess(id,path){
	// 设置下载文件名称
	var optionData = {
		token:token,
		filename:path
	};
	// 创建下载任务
	var dtask = plus.downloader.createDownload(
		topUrl+downloadAccessory+id + '&token=' + token,optionData,function(d,status){
		// 检测状态码, 200表示成功, 成功后打开附件
		if ( status == 200 ) {
			plus.runtime.openFile(path);
		} else {
			mui.toast( "Download failed: " + status ); 
		}  
	});
	//dtask.addEventListener( "statechanged", onStateChanged, false );
	dtask.start(); 
}

// 获取中文数字
function getChineseNumber(number){
	var num = number.toString();
	var chineseNum = ["一","二","三","四","五","六","七","八","九","十"];
	var chineseNumber = null;
	
	if(num.length==1){
		return chineseNum[parseInt(num)-1];
	}else if(num.length==2){
		if(parseInt(num[0])==1){
			chineseNumber = "十";
		}else{
			chineseNumber = chineseNum[parseInt(num[0]-1)]+"十";
		}
		if(parseInt(num[1])!=0)
			chineseNumber += chineseNum[parseInt(num[1]-1)];
		return chineseNumber;
	}
}

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