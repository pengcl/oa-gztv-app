
// 存储列表数据
var noticeListData = null;
// 记录所有条目的数量
var maxCount = 0;
// 记录当前请求的页码
var pageCount = 0;
// 搜索的关键字
var searchValue = "";

// 获得数据列表的实例
var table = document.body.querySelector('#noticeList');
			
// 获取会议列表数据
function getNoticeListData(pageNum){
	// 记录当前请求的页数
	pageCount = pageNum;
	var args = {
		page : pageNum,
		pageSize : "15"
	};
	var success = function(rtnData){
		
		console.log("--------------------------------------");
		console.log("公告列表数据: " + JSON.stringify(rtnData));
		
		if(noticeListData == null)noticeListData = rtnData.rows;
		else noticeListData = noticeListData.concat(rtnData.rows);// 合并数据数组
		//记录所有条目的总数
		maxCount = rtnData.total;
		// 创建会议列表数据
		createNoticeItem(noticeListData);
	}
	sendRequest(getNoticeListUrl,args,success);
}

/**
 * 刷新内容
 */
function refreshData(){
	// 清空列表内容
	cleanDataList();
	// 重新获得数据
	getNoticeListData(1); //getNoticeListData(1,searchValue);
}

/**
 * 清空数据列表
 */
function cleanDataList(){
	// 清空列表内容
	table.innerHTML = "";
	// 清空当前条目数量
	itemCount = 0;
	// 清空数据数组
	noticeListData = null;
}
			