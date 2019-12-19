mui.init();

mui.ready(function () {
	
	// 同步设置当前日期
	//loadCurrentDate();
	initVueApp();
	
	// 事件绑定
	//document.querySelector('#rightMenu').addEventListener('tap', rightMenuTap);
	
});

var userId;
var curDate = "";
mui.plusReady(function() {
	userId = plus.storage.getItem("uid");
	bindTap();
});

var vm;
function initVueApp(){
	vm = new Vue({
	  	el: '#app',
	  	data: {
	  		selectPmName:'',
	  		selectPmNo:'',
	  		selectDate:'',
	  		projectList:[],
	  		signInfoList:[],
	  		showType:'all', // 显示全部 normal:正常，abnormal:异常
	  	}
	})
}


/***
 * 获取当前日期
 */
function loadCurrentDate(){
	var _url = "attendanceDate/curDate";
	var params = {};
	sendRequest(_url, params, function(rtnData) {
		var _date = rtnData.date;
		curDate = _date;
		vm.selectDate = curDate;
	});	
}


/**
 * 选择日期
 * @param {Object} dateText
 * @param {Object} ints
 */
function selectDate(dateText, ints) {
	var sltDate = new Date(Date.parse(dateText.replace(/-/g, "/")));
	var dateInfo = (sltDate).pattern("yyyy-MM-dd");
	vm.selectDate = dateInfo;
	loadSignInfoList();
}


/***
 * 初始化日历
 */
$('#calendar').datepicker({
	altField: "#alternate",
	altFormat: "yy-mm-dd",
	inline: true,
	firstDay: 7,
	showOtherMonths: false,
	dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
	//onSelect: selectDate,
	
	//maxDate: new Date(),//最大日期
	beforeShowDay: function(date) {
       	var today = new Date();
       	if (date >= today) {
       		return [true,"over-today",date];
       	} else {
       		return [true,'',''];
       	}
    },		
});

function loadSignInfoList() {
	
	console.log("loadSignInfoList");
	console.log("selectPmName:" + vm.selectPmName);
	console.log("selectPmNo:" + vm.selectPmNo);
	console.log("selectDate:" + vm.selectDate);
	
	// 判断是否有自己所管理的项目
	if (vm.projectList.length <= 0) {
		vm.signInfoList = null;
		return;
	}
	
	var _url = URL_PM_ATTEND_RECORD;
	var args = {
		pmNo: vm.selectPmNo,
		date: vm.selectDate
	};
	sendRequest(_url, args, function(rtnData) {
		console.log("--------------------------------------");
		console.log("考勤信息: " + JSON.stringify(rtnData));
		vm.signInfoList = rtnData;
		// 改变头像颜色
		mui.later(changeColor,50);
	});	
}

var cssColorArr = ['col1','col2','col3','col4','col5','col6'];

/**
 * 改变头像颜色
 */
function changeColor(){
	mui(".userHeadColor").each(function(_index,_e){
		var num = _index%7;
		var color = cssColorArr[num];
		$(this).addClass(color);
	})
}


/***
 * 绑定事件
 */
function bindTap(){
	
	/*
	// 绑定‘全部’事件
	mui(".mui-bar-tab").on('tap', '#allTab', function(){
		vm.showType = "all";
		loadSignInfoList();
	});
	
	// 绑定‘正常’事件
	mui(".mui-bar-tab").on('tap', '#normalTab', function(){
		vm.showType = "normal";
		loadSignInfoList();
	});
	
	// 绑定‘异常’事件
	mui(".mui-bar-tab").on('tap', '#abnormalTab', function(){
		vm.showType = "abnormal";
		loadSignInfoList();
	});
	*/
	
}