mui.init();

mui.ready(function () {
	// 同步设置当前日期
	//loadCurrentDate();
//	initVueApp();
	
	// 事件绑定
	//document.querySelector('#rightMenu').addEventListener('tap', rightMenuTap);
	
});

var userId;
var curDate = "";
mui.plusReady(function() {
	console.log(plus.webview.currentWebview().id);
	userId = plus.storage.getItem("uid");
	var today = (new Date()).pattern("yyyy-MM-dd");
	loadScheduleMessage(today);
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
	loadScheduleMessage(dateInfo);
}


/***
 * 初始化日历
 */
$('#calendar').datepicker({
	altField: "#alternate",
	altFormat: "yy-mm-dd",
	onSelect: selectDate,
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


//获取点击事件的加载数据
function loadScheduleMessage(dateTime){
	var url = topUrl + 'ScheduleManage!getByDate.action';
	var kaoqinList = document.getElementById("kaoqinList");
	var html='';
	mui.ajax(url, {
		data:{token:token,dateTime:dateTime},
		success: function(data) {
			var rows = data.rows;
			if(rows.length>0){
				for(var i=0;i<rows.length;i++){
					html += '<tr class="examineById" id="'+rows[i].id+'" style="line-height: 45px; background-color: #fff;">';
					html += '<td classBak="td" width="*" style="border-bottom: 1px dashed #e3e3e3;">';
					html += '<span class="mui-h5">&nbsp;&nbsp;&nbsp;'+rows[i].endTime+'&nbsp;&nbsp;&nbsp;'+rows[i].content+'</span>';
					html += '</td></tr>';
				}
				kaoqinList.innerHTML=html;
			}else{
				html='<div style="text-align: center;font-size: 20px;margin-top: 4rem;">没有数据</div>';
				kaoqinList.innerHTML = html;
			}
		},
	});
}

//点击会议详情信息也买你
mui("#kaoqinList").on('tap', '.examineById', function() {
	var id = this.getAttribute("id");
	var url = 'schedule-detail.html';
	openNewPage(url, id);
})

function tishi(){
	alert(1);
}
