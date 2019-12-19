var pageCount = 0; // 记录请求分页的页数
var itemCount = 0; // 记录当前条目的条数
var maxCount = 0;  // 最大条目数

var noticeListData = []; // 待办工单列表数据
var table = document.getElementById("noticeList"); // 外勤记录列表
var noneDataUl = document.getElementById("noneDataUl");
var token = plus.storage.getItem("token");
mui.init({

	pullRefresh: {
	    container: '#pullrefresh',
	    up: {//上拉加载
	        auto:false,// 可选,默认false.自动上拉加载一次
	        contentrefresh: '正在加载...',
	        contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
	        callback: pullupRefresh
	    }
	}
		
});


/**
 * 上拉加载更多数据
 */
function pullupRefresh() {
	
	//参数为true代表没有更多数据了。
	if(itemCount < maxCount) {
		getList(pageCount+1);
	} else {
		mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
	}
	
}

//mui.ready(function () {
//	
//	// 绑定事件
//	bindTap();
//	
//});


/***
 * 绑定事件
 */
//function bindTap(){
//	
//	// 列表点击事件
//	/*
//	mui('#noticeList').on('tap','li',function(){
//		var args = {
//			itemData : this.itemData
//		};
//		openNewPage('notice-view.html', 'notice-view', args);
//	});	
//	*/
//	
//	mui('#noticeList').on('tap','li',function(){
//		
//		var state = this.itemData.state;
//		var id = this.itemData.id;
//		// 置公告为已读状态
//		if (state == 0) {
//			confirmRead(id);
//		}
//		
//		openPage(topUrl + URL_NOTICE_VIEW + this.itemData.noticeInfoId,"公告详情");
//		
//	});	
//	
//}


/***
 * 置公告为已读状态
 * @param {Object} readId
 */
function confirmRead(readId) {
	var _url = URL_NOTICE_READED;
    var args = {id: readId,token:token};
    //args.id = readId;
	sendRequest(_url, args, function(rtnData) {
		console.log("阅读公告: " + JSON.stringify(rtnData));
		getList(pageCount);
	});
}


var userId;
mui.plusReady(function() {
	userId = plus.storage.getItem("uid");
	getList(1);
});

//重构换取颜色方法
function refactorChangeColor(i){
		var cssColorArr = ['notice-color-doblue','notice-color-blue','notice-color-orager',
			'notice-color-salmon','notice-color-darkcyan','notice-color-gray'];	
			return cssColorArr[i];
}


/***
 * 获取列表数据
 * @param {Object} pageNum
 */
 function getList(pageNum) {
 	var noticeId = document.getElementById("searchKey").value;
 	var userId = plus.storage.getItem("sysUsersId");
 	var url = topUrl + 'noticeInfo/pageListForDepUser.action?token=' + token;
 	var listHtml = '';
 	mui.ajax(url, {
 		data: {
 			noticeId: noticeId,
 		},
 		success: function(data) {
			
 			var noticeList = document.getElementById("noticeList");
 			var rows = data.rows;
 			for(var i = 0; i < rows.length; i++) {
 				if(rows[i].creator.length > 2) {
 					rows[i].creator = rows[i].creator.substr(1, 2);
 				}
 				var noticeLisrColor = refactorChangeColor(i);
 				var html = '<li showType=' + rows[i].type + ' id=' + rows[i].id + ' class="mui-table-view-cell">'
 				html += '<a href="javascript:;">';
 				html += '  <span class="mui-media-object mui-pull-left xingm ' + noticeLisrColor + '" style="padding:0px 0px 0px 5px">' + rows[i].creator + '</span>';
 				html += '  <div class="mui-media-body">' + rows[i].title;
 				html += '  </div>';
 				html += '  <div class="mui-media-body">';
 				html += '    <span class="mui-h6">' + rows[i].createTime.substring(0, 16); //htmlPure;
 				html += '      <span class="mui-pull-right mui-h6"></span>';
 				html += '    </span>';
 				html += '  </div>';
 				html += '</a></li>';
 				listHtml = listHtml + html;
 			}
 			noticeList.innerHTML = listHtml;
 		},
 	});
 }

mui("#noticeList").on('tap', '.mui-table-view-cell', function() {
		var showType = this.getAttribute("showType");
		var id = this.getAttribute("id");
		var url = '../page-notice/notice-content.html';
		if(showType == 1) {
			url = '../page-notice/main-carouselDetail.html'
		}
		openNewPage(url, id);
})



/***
 * 通过状态值获取状态显示
 * @param {Object} state
 */
function getSource(_source) {
	if (_source.length <= 2) {
		return _source;
	} else {
		return _source.substr(1,2);
	}
}


/***
 * 动态生成TABLE ROW
 */
function createList() {
	
	var length = noticeListData.length;
	if (length > 0){
		
		for (var i=0; i<length; i++) {
			
			itemCount += 1;
			
			var li = document.createElement("li");
			var itemData = noticeListData[i];
				
			//var source = itemData.source;
			var userName = itemData.userName;
			var title = itemData.title;
			var createTime = itemData.createTime;
			var htmlPure = '';//itemData.htmlPure;
			//var bulletinReadId = itemData.bulletinReadId;
			var bulletinReadStatus = itemData.state; // bulletinReadStatus;
			var bulletinId = itemData.noticeInfoId; // bulletinId;
			
			li.itemData = itemData;
			li.id = bulletinId;
			li.className = "mui-table-view-cell mui-media";
			
			var html = '';
			html += '<a href="javascript:;">';
			html += '  <span class="mui-media-object mui-pull-left xingm badgeSpan" style="padding:0px 0px 0px 5px">' + getSource(userName) + '</span>';
			html += '  <div class="mui-media-body">' + title;
			//html += '    <span class="mui-pull-right mui-h6">' + createTime.substring(0,16) + '</span>';
			if (bulletinReadStatus == 0) html += '    <span class="mui-badge spanone"></span>';
			html += '  </div>';
			html += '  <div class="mui-media-body">';
			html += '    <span class="mui-h6">' + createTime.substring(0,16); //htmlPure;
			html += '      <span class="mui-pull-right mui-h6"></span>';
			html += '    </span>';
			html += '  </div>';
			html += '</a>';
			
			li.innerHTML = html;
			table.appendChild(li);
		}
		
		mui('#pullrefresh').pullRefresh().endPullupToRefresh(itemCount == maxCount);
		
		// 改变图标颜色
		mui.later(changeColor,50);
		mui.later(bindTap,50);			
		
		noneDataUl.style.display = "none";
		table.style.display = ""; // 显示有数据的控件
	} else {
		//mui('#pullrefresh').pullRefresh().endPullupToRefresh(itemCount == maxCount);
		noneDataUl.style.display = "";
		table.style.display = "none"; // 显示有数据的控件
	}
}

/**
 * 改变头像颜色
 */
function changeColor() {
	// 图标颜色值
	var cssColorArr = ['notice-color-doblue','notice-color-blue','notice-color-orager',
			'notice-color-salmon','notice-color-darkcyan','notice-color-gray'];	
	
	mui(".badgeSpan").each(function(_index,_e){
		var num = _index%6;
		var color = cssColorArr[num];
		$(this).addClass(color);
	})
	
}

/**
 * 关键字搜索
 */
window.addEventListener('doSearchList',function(event){
	  //获得事件参数
	  try {
	  	  var jsonStr = event.detail.targetJSON;
	  	  var jsonRet = JSON.parse(jsonStr);
	  	  document.getElementById("searchKey").value = jsonRet.keyword;
	  	  getList(1);
	  }catch(e){
	  	mui.toast(e.message);
	  	//TODO handle the exception
	  }
});
