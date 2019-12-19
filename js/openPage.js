/**
 * 用列表条目打开新界面的方法
 * (ps: 由于该方法创建时期较早, 很多东西没考虑, 建议重构列表条目结构与点击打开新页面事件)
 * @param {Object} id  点击的条目下标
 * @param {Object} listData  条目列表数据
 * @param {Object} openUrl  需要打开的界面路径
 * @param {Object} openId  新界面的id号
 * @param {Object} pageId  同一界面不同内容的标识
 */
function openItemPage(id,listData,openUrl,openId,pageId,pageFlag,itemCount){
	var num;
	var itemData;
	var top = subpageTop;
	top = 0;
	switch(openId){
		case "meeting-issue":
			for(num in listData){
				if(id == listData[num].subId){
					itemData = listData[num];
					break;
				}
			}
		break;
		
		case "meeting-detail":
			for(num in listData){
				if(id == listData[num].id){
					itemData = listData[num];
					break;
				}
			}
		break;
		
		case "beDone-main":
			for(num in listData){
				if(id == listData[num].officeMissiveId){
					itemData = listData[num];
					break;
				}
			}
		break;
		
		case "toRead-main":;
		
		case "toDo-main":
			for(num in listData){
				if(id == listData[num].mfMissiveId){
					itemData = listData[num];
					break;
				}
			}
		break;
		
		case "related-main-0":
			for(num in listData){
				if(id == listData[num].missiveId){
					itemData = listData[num];
					break;
				}
			}
		break;
		
		default:
			for(num in listData){
				if(id == listData[num].mid){
					itemData = listData[num];
					break;
				}
			}
		break;
		
	}
	
	if (!pageFlag) {
		pageFlag = "";
	}

	if (!itemCount) {
		itemCount = 0;
	}
  	mui.openWindow({
	    url:openUrl,
	    id:openId,
	    styles:{
	    	top: top+'px',
			bottom: 0,
			bounce: 'vertical'
	    },
	    extras:{
	        itemData : itemData,
	        pageId : pageId,
	        pageFlag : pageFlag,
			itemCount : itemCount	        
	    },
	    show : {
			aniShow:"pop-in" //页面显示动画，默认为”slide-in-right“；
	    },
		waiting:{
			autoShow:false
		}
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


/***
 * 获取唯一码
 */
function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}


/**
 * 默认方法打开新界面
 * @param {Object} openUrl 目标路径
 */
function openPage(openUrl, title) {
	var _url = "/page-main/main-webview.html";
	var arg = {url:openUrl, title:title};
	mui.openWindow({
		url:_url,
	    id: "window-" + guid,
	    styles:{
			bounce: 'vertical'
	    },
	    extras: arg,
	    show : {
			aniShow:"pop-in" //页面显示动画，默认为”slide-in-right“；
	    },
		waiting:{
			autoShow:false
		}
	});
}
