// 存储列表数据
var meetListData = null;
// 记录所有条目的数量
var maxCount = 0;
// 记录当前请求的页码
var pageCount = 0;
// 搜索的关键字
var searchValue = "";

var notStartMeetType = "n"; // 未开始的会议
var runningMeetType = "p"; // 开会中会议
var finishMeetType = "f"; // 已结束会议
var notAndRunningMeet = "np"; // 未开始与进行中的会议
var meetType = notStartMeetType; // 默认获取未开始会议

var isMeetingAdmin = "n";

// 获得数据列表的实例
var table = document.body.querySelector('#meetList');
/**
 * 获取会议列表数据
 * @param {Number} pageNum 请求的页码, 第几页
 * @param {Number} type 请求的类型, 重新加载0, 追加数据1
 * @param {Boolean} isHome 是否是首页发起的请求
 */
function getMeetListData(pageNum, type, isHome) {
	var pageSize = "15";
	if (isHome) { // 若是home页面的会议, 则显示未开始与进行中
		meetType = notAndRunningMeet;
		pageSize = "5"; // home页面只拿五条数据
	}

	// 获取是否是会议管理员
	isMeetingAdmin = plus.storage.getItem("meetingAdmin");
	// 记录当前请求的页数
	pageCount = pageNum;
	var args = {
		token: plus.storage.getItem('token'),
		page: pageNum,
		pageSize: pageSize,
		flag: isMeetingAdmin,
		type: meetType, // 获取类型, 未开始, 进行中, 已结束
		topic: searchValue // 设置搜索的关键字
	};
	var success = function(rtnData) {
		if (type == 0) {
			meetListData = null; // 只清空数据, 暂不清除界面
		}

		// 合并数据数组
		if (meetListData == null) { // 为空的话就是获取新数据
			maxCount = rtnData.total; // 记录所有条目的总数
			var tempMeetListData = rtnData.rows; // 用于临时存放新的列表数据
			var dataFlag = "";
			switch (meetType) {
				case notStartMeetType:
					dataFlag = NOT_START_MEET_DATA;
					break;
				case runningMeetType:
					dataFlag = RUNNING_MEET_DATA;
					break;
				case finishMeetType:
					dataFlag = FINISH_MEET_DATA;
					break;
				case notAndRunningMeet:
					dataFlag = NOT_START_AND_RUNNING;
					break;
			}
			var sqlArgs = {
				dataFlag: dataFlag,
				dataContent: tempMeetListData
			}
			cleanDataList();
			meetListData = tempMeetListData;
			createMeetItem(meetListData);
			/* insterCacheData(sqlArgs, function() { // 往数据库插入新数据
				cleanDataList();
				meetListData = tempMeetListData;
				createMeetItem(meetListData);
			}); */
		} else { // 加载分页数据, 直接显示, 不进数据库
			meetListData = meetListData.concat(rtnData.rows);
			// 直接创建会议列表数据
			createMeetItem(meetListData);
		}
	}
	sendRequest(meetListUrl, args, success);
}

/**
 * 创建缓存会议列表
 * @param {String} cacheFlag 需要显示的缓存数据类型
 */
function createCacheData(cacheFlag) {
console.log(cacheFlag);
	var conditionArgs = {};
	conditionArgs[DATA_FLAG] = cacheFlag;

	selectCacheData(conditionArgs, function(rows) { // 获取缓存数据
		/*
		 * 说明: 为了节省空间与内存消耗, 这里简写了获取数据的过程, 原过程如下
		 * 1. var tempObj = rows.item(0);
		 * 2. var dataContent = tempObj[DATA_CONTENT];
		 * 3. var jsonDataContent = JSON.parse(dataContent);
		 * 
		 * 	meetListData == jsonDataContent;
		 */
		cleanDataList(); // 清空列表
		if (rows.length != 0) {
			meetListData = JSON.parse(rows.item(0)[DATA_CONTENT]);
			createMeetItem(meetListData);
		}
	});

}

/**
 * 定时刷新会议列表
 */
function realTimeRefresh() {
	if (OPEN_REFRESH) {
		setInterval("refreshData()", REFRESH_TIME);
	}
}

/**
 * 刷新内容
 */
function refreshData(isHome) {

	// 重新获得数据
	getMeetListData(1, 0, isHome);
	try {
		getToDoNum(); // 获取待办个数
	} catch (e) {}
}

/**
 * 清空数据列表
 */
function cleanDataList() {
	// 清空列表内容
	try {
		table.innerHTML = "";
	} catch (e) {}
	// 清空当前条目数量
	itemCount = 0;
	// 清空数据数组
	meetListData = null;
	// 重置上拉加载
	try {
		mui('#pullrefresh').pullRefresh().refresh(true);
	} catch (e) {}
}
