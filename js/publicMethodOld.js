
// 记录列表中item的个数
var itemCount = 0;
// 记录未开会议的个数
var notStartMeetNum;
// 意见填写临时存储
var newApproveValue;

try{
	// 存储可编辑的字段name
	var editableItemIdMap = new Map();
	// 所有字段的name
	var allItemNameMap = new Map();
	// 所有字段的值
	var fieldNameValueMap = new Map();
	
	// 字段属性
	var pub_fieldPropsJson = "";
	
	// 存储未开始议题的标题与id
	var notStartIssueMap = new Map();
	
}catch(e){}

// 创建会议列表item
function createMeetItem(listData){
	var num;
	var table = document.body.querySelector('#meetList');
	var cells = document.body.querySelectorAll('.mui-table-view-cell');
	notStartMeetNum = 0;
	
	for(num in listData){
		// 获取item的各个元素
		var meetTop = listData[num].topic;
		var meetTime = listData[num].startTime.substring(0,16);
		var meetAddr = listData[num].addr;
		var meetStatus = listData[num].status;
		var statusText;
		var icon = "icon2-huiyi_icon";
		var iconColor = "gray";
		var li = document.createElement('li');
		
		switch(meetStatus){
			case "1": statusText = "待上会"; iconColor = "red";notStartMeetNum += 1;break;
			case "2": statusText = "开会中"; iconColor = "green";break;
			case "3": statusText = "已上会"; iconColor = "gray";break;
			case "9": statusText = "已暂停"; iconColor = "green";break;
		}
		
		// 条目总数加1
		itemCount = itemCount + 1;
		li.className = 'mui-table-view-cell';
		// 为每个item配置对应的id
		li.id = listData[num].id;
		// 拼接成一个item
		li.innerHTML = buildPublicItem(meetTop,meetAddr,meetTime,icon,iconColor,statusText);
		
		// 新纪录插到最后面；
//		table.insertBefore(li, table.endChild);
		table.appendChild(li);
	}
	
	try{
		// 初始化未开会议的个数
		initMeetNum();
	}catch(e){}
	
	// 若没有数据, 则取无数据条目
	if (table.children.length == 0 ) {
		table.appendChild(notDataItem('li'));
	}

}

// 创建公告列表
function createNoticeItem(listData){
	var num;
	var table = document.body.querySelector('#noticeList');
	var cells = document.body.querySelectorAll('.mui-table-view-cell');
					
	for(num in listData){
		// 获取item的各个元素
		var noticeTop = listData[num].subject;
		var createTime = listData[num].createTime.time;
		var createDateObj = new Date(createTime);
		var noticeTime = createDateObj.pattern("yyyy-MM-dd HH:mm");
		var li = document.createElement('li');
		
		// 条目总数加1
		itemCount = itemCount + 1;
		li.className = 'mui-table-view-cell';
		// 为每个item配置对应的id
		li.id = listData[num].id;
		// 拼接成一个item
		li.innerHTML = '<div class="autoHiddenText">'+noticeTop+'</div>'+
		'<div class="autoHiddenText"><p>发布时间:&nbsp;'+noticeTime+'</p></div>';
		
		// 新纪录插到最后面；
//		table.insertBefore(li, table.endChild);
		table.appendChild(li);
	}
	if (table.children.length == 0 ) {
		table.appendChild(notDataItem('li'));
	}
}

// 创建议题列表item
function createIssueItem(issueData){
	var num;
	var table = document.body.querySelector('#issueList');
	var cells = document.body.querySelectorAll('.mui-table-view-cell');
	
	itemCount = 0; // 清空条目记录
	notStartIssueMap.clear(); // 清除所有未开的议题
					
	for(num in issueData){
		// 获取item的各个元素
		var issueTop = issueData[num].subTopic; // 获取议题标题
		var hostName = issueData[num].subHostNames; // 获取回报人
		var partNames = issueData[num].subPartNames; // 获取列席
		var idNum = issueData[num].subOrd;// 获取议题的序列号
		var subId = issueData[num].subId; // 获取议题id
		var notify = issueData[num].notify // 获取议题是否已发过通知
		var chineseNum = getChineseNumber(idNum);
		var tempTitle; // 制作通知议题用的议题标题
		var issueTitle; // 议题列表展示用的议题标题
		if (notify == "1") { // 若该议题已发过通知, 则改变该议题的标题
			tempTitle = chineseNum+'、【已通知】'+issueTop;
		} else { // 否则使用原有的标题
			tempTitle = chineseNum+'、'+issueTop;
		}
		
		var timeStr = "";
		var status = issueData[num].subStatus;
		var statusText;
		var statusColor; // 状态颜色
		var timeColor; // 时间颜色
		var chineseNumColor; // 中文字背景颜色
		switch(status){
			case "1":
			case "2": 
				statusText = "未开始";
				statusColor = "red";
				timeColor = "red";
				chineseNumColor = ""; // 默认就是红色, 所以设置为空
				var subStartTime = issueData[num].subStartTime.substring(0,16); 
				timeStr = '预计开始时间:&nbsp;' + subStartTime;
				notStartIssueMap.put(subId,tempTitle); // 添加议题未开始的议题至map中说
				
				break;
			case "3": 
				statusText = "开会中";
				statusColor = "green";
				timeColor = "green";
				chineseNumColor = "greenbg"; // 设置中文数字背景颜色为绿色
				var subStartTime = issueData[num].subStartTime.substring(0,16); 
				timeStr = '开始时间:&nbsp;' + subStartTime;
				break;
			case "9": 
				statusText = "已暂停"; 
				statusColor = "green";
				timeColor = "green";
				chineseNumColor = "greenbg"; // 设置中文数字背景颜色为绿色
				var subStartTime = issueData[num].subStartTime.substring(0,16); 
				timeStr = '开始时间:&nbsp;' + subStartTime;
				break;
			case "4": 
			default : 
				statusText = "已结束";
				statusColor = "gray";
				timeColor = "gray";
				chineseNumColor = "graybg"; // 设置中文数字背景颜色为灰色
				var subEndTime = issueData[num].subEndTime.substring(0,16); 
				timeStr = '结束时间:&nbsp;' + subEndTime;
		}
		
		// 拼装议题列表用的议题标题
		issueTitle = '<span class="yiti_listNum '+ chineseNumColor + '">' + 
			chineseNum  + '</span>' + issueTop;
		
		// item总数加1
		itemCount = itemCount + 1;
		
		var li = document.createElement('li');
		li.className = 'mui-table-view-cell';
		// 为每个item配置对应的id
		li.id = subId;
		// 拼接成一个item
		li.innerHTML = '<div class="statusText"><p class="'+statusColor+'">'+statusText+'</p></div>'+
		'<div class="autoHiddenText">'+issueTitle+'</div>'+
		'<div><p class="autoHiddenText">汇报人:&nbsp;'+hostName+'　　列席:&nbsp;'+partNames+'</p></div>'+
		'<div><p class="'+timeColor+'">'+timeStr+'</p></div>';
		
		// 新纪录插到最后面；
//		table.insertBefore(li, table.endChild);
		table.appendChild(li);
	}
}

/**
 * 创建附件列表item
 * @param {Object} accData 列表数据
 * @param {Object} ulId 列表id
 */
function createAccessoriesItem(accData,ulId){
	var num;
	var listId;
	if(ulId == null)listId = '#accessoryList';
	else listId = '#'+ ulId;
	// 若为相关公文, 则使用相关公文的item
	if(listId == '#relatedMissive' || listId == '#reRelatedMissive'){
		// 创建相关公文列表
		createRelatedMissiveList(accData,listId);
		return;
	}
	var table = document.body.querySelector(listId);
	var cells = document.body.querySelectorAll('.mui-table-view-cell');
	for(num in accData){
		// 获取item的各个元素
		var fileName = accData[num].fileName;
		var uploadUser = accData[num].uploadUser;
		var uploadTime = accData[num].uploadDate.time;
		var uploadDateObj = new Date(uploadTime);
		var uploadDate = uploadDateObj.pattern("yyyy-MM-dd");
		
		var li = document.createElement('li');
		li.className = 'mui-table-view-cell';
		// 为每个item配置对应的id
		li.id = accData[num].id;
		// 拼接成一个item
		li.innerHTML = '<table border="0"><tr><td rowspan="2" width="35">'+
		'<span class="mui-icon iconfont icon2-fujian"></span></td>'+
		'<td colspan="2" class="meetListTitle autoHiddenText">'+fileName+'</td>'+
		'</tr><tr><td><p class="autoHiddenText" style="padding-left: 10px;">上传者:&nbsp;'+
		uploadUser+'</p></td><td class="accessTimeStyle"><p>上传时间:&nbsp;'+
		uploadDate+'</p></td></tr></table>';
		
		// 新纪录插到最后面；
//		table.insertBefore(li, table.endChild);
		table.appendChild(li);
	}

	if (table.children.length == 0 ) {
		table.appendChild(notDataItem('li'));
	}
}

/**
 * 创建正文附件列表(有附件分类)
 * @param {Object} accData 网络获取的正文附件数据
 */
function createAllAccessoriesList(accData){
	var num;
	var name = ['missive','access','leader','src','related',
		'missiveText','missiveAccessory','instruction','resource','relatedMissive'];
	
	for(num in accData){
		// 获取分类的附件信息
		var listTitle = accData[num].title;
		var uploadType = accData[num].uploadType;
		var listData = accData[num].datalist;
		if(listData.length < 1)continue;
		
		// 显示容器
		var moduleIdId,listId;
		switch(parseInt(uploadType)){
			case 0: moduleId = name[0]; listId = name[5];break;
			case 1: moduleId = name[1]; listId = name[6];break;
			case 2: moduleId = name[2]; listId = name[7];break;
			case 3: moduleId = name[3]; listId = name[8];break;
			case 4: moduleId = name[4]; listId = name[9];break;
		}
		var tempModuleObj = document.getElementById(moduleId);
		tempModuleObj.hidden = false;
		// 创建附件列表
		createAccessoriesItem(listData,listId);
	}
	
}

// 创建相关公文列表
function createRelatedMissiveList(data,listId){
	
	var table = document.body.querySelector(listId);
	var cells = document.body.querySelectorAll('.mui-table-view-cell');
	
	for(num in data){
		// 获取item的各个元素
		var mtitle = data[num].mtitle;

		var li = document.createElement('li');
		
		li.id = data[num].mid;
		if(listId == "#relatedMissiveList")
			li.id = data[num].missiveId;
			
		li.className = 'missiveList mui-table-view-cell';
		// 拼接成一个item
		li.innerHTML = '<div class="floatR pad_t25" style="margin-top: 5px;">'+					
		'<span id="missiveForm" class="iconfont icon2-kongbiaodan "></span>'+'&nbsp;&nbsp;&nbsp;'+
		'<span id="missiveAccessory" class="iconfont icon2-fujian_con "></span>'+
		'</div><div class="floatL pad_t25" style="margin-top: 5px;margin-right: 5px;">'+
		'<span class="icon iconfont icon2-gongwenbao"></span></div>'+
		'<div class="autoHiddenText font_20 pad_t25" style="margin-top: 2px;margin-right: 5px;">'+
		mtitle+'</div>';
		
		// 新纪录插到最后面:
//		table.insertBefore(li, table.endChild);
		table.appendChild(li);
	}
	
	if (table.children.length == 0 ) {
		table.appendChild(notDataItem('li'));
	}
}

// 创建待办,待阅,已办列表item
function createItemList(beDoneData, pageId){
	var num;
	var table = document.body.querySelector('#itemList');
	var cells = document.body.querySelectorAll('.mui-table-view-cell');
					
	for(num in beDoneData){
		
		// 获取item的各个元素
		var li = document.createElement('li');
		var mtTitle = beDoneData[num].mtTitle;
		
		var meetTitle = '<span class="green_se">【'+mtTitle+'】</span>'+beDoneData[num].mtitle;
				
		/*var meetTitle = "【" + mtTitle + "】" + beDoneData[num].mtitle;*/
		var createUserName = beDoneData[num].createUserName;
		var time;
		var icon = "icon2-shuruxinxi";
		var iconColor = "blue";
		
		if(pageId == 'main-beDone'){
			var uploadTime = beDoneData[num].createDate.time;
			var uploadDateObj = new Date(uploadTime);
			time = uploadDateObj.pattern("yyyy-MM-dd");
			icon = "icon2-yibanyewu";
			iconColor = "green";
		}else if(pageId == 'main-toRead'){
			time = beDoneData[num].sendTime.substring(0,10);
			createUserName = beDoneData[num].senderName;
			icon = "icon2-dai";
		}else{
			time = beDoneData[num].receiveTime.substring(0,10);
		}
		
		// item总数加1
		itemCount = itemCount + 1;
		
		li.className = 'mui-table-view-cell';
		// 为每个item配置对应的id
		
		if(pageId == "main-beDone")
			li.id = beDoneData[num].officeMissiveId;
		else li.id = beDoneData[num].mfMissiveId;
		
		// 拼接成一个item
		li.innerHTML = buildPublicItem(meetTitle,'&nbsp;创建人:&nbsp;'+createUserName,time,icon,iconColor,"");
		li.innerHTML = buildPublicItem(meetTitle,'&nbsp;创建人:&nbsp;'+createUserName,time,icon,iconColor,"");
		
		// 新纪录插到最后面；
//		table.insertBefore(li, table.endChild);
		table.appendChild(li);
	}
	
	// 若没有数据, 则取无数据条目
	if (table.children.length == 0 ) {
		table.appendChild(notDataItem('li'));
	}
}

/**
 * 获取一个无数据条目
 */
function notDataItem (tabName) {
	
	var li = document.createElement(tabName);
	li.id = 0;
	li.className = 'mui-table-view-cell pad_L20';
	// 拼接成一个item
	li.innerHTML = '<table border="0" style="margin:10px 20px"><tr>'+
	'<td class="autoHiddenText">无</td></tr></table>';
	
	return li;
}

// 创建公文正文字段
/*function createFormFields(fieldsData){
	var num;
	var table = document.body.querySelector('#listContent');
	
	for(num in fieldsData){
		
		// 若该字段为隐藏字段, 则跳过显示该字段
//		if(fieldsData[num].hidden=="true")continue;
		
		// 获取item的各个元素
		var caption = fieldsData[num].caption;
		var value = fieldsData[num].value;
		var name = fieldsData[num].name;;
		var isEditable = fieldsData[num].editable;
		var editItemType = "";
		
		// 若当前字段为紧急程度, 则采取紧急程度的处理
		if(name == "fileGrade"){
			var levelSelect;
			if(isEditable == "true"){
				levelSelect = document.getElementById("levelSelect");
				switch(value){
					case "平件": levelSelect.children[0].selected = true;break;
					case "急件": levelSelect.children[1].selected = true;break;
					case "特急": levelSelect.children[2].selected = true;break;
				}
			}else{
				levelSelect = document.getElementById("level");
				levelSelect.innerHTML = value;
			}
			levelSelect.hidden = false;
			continue;
		}
		
		// 替换字符串&@&为换行
//		value = value.replace(/&@&/g,'<br>');
		
		var li = document.createElement('div');
		li.className = 'divList';
		
		// 将所有字段id存进数据, 方便获取界面上的字段
		allItemNameMap.put(name,value);

		// 设置是否可编辑, 将可编辑字段id存进数据
		if(isEditable == "true"){
			editableItemIdMap.put(name,value);
			
			// 若为可编辑字段, 则添加可编辑字段特有的布局
			li.className = 'divListEdit';
			li.classList.add('mui-table-view-cell');
			editItemType = ' mui-navigate-right';
		}
		// 拼接成一个item
		li.innerHTML = '<div class="display floatL colorL">'+caption+'</div>'+
			'<div id="'+name+'" class="textAreat floatR colorR'+editItemType+'">'+value+'</div>';
		
		// 新纪录插到最后面；
		table.appendChild(li);
	}
}*/

// 加载表单
function createFormByTemplet(rtnData){
	var temp = document.getElementsByTagName('body')[0];
	temp.innerHTML = rtnData.html;
}

// 初始化表单字段
function initFormField(rtnData) {
	pub_fieldPropsJson = rtnData.fieldPropsJson;
	var i;
	for(i in pub_fieldPropsJson){
		var fieldObj = pub_fieldPropsJson[i];
		var fieldName = fieldObj.name;
		var fieldValue = fieldObj.value;
		var fieldEditable = fieldObj.editable;
		
		// 获取模板中对应字段内容的容器
		var tempItem = document.getElementById(fieldName);
		
		fieldNameValueMap.put(fieldName, fieldValue); // 把所有字段值放进map中
		var isapproval = false;
		
		// 获取当前字段的文本类型, 单行1, 多行文本2
		var approvaltype = $('#'+fieldName).attr("data-isapproval");
			
		// 添加样式和判断是否是签名框
		if (fieldEditable == "true") { // 可编辑的操作
			var fileItem = $('#'+fieldName).get(0);
			editableItemIdMap.put(fieldName,fieldValue); // 把可编辑字段存储起来

			if(fileItem!=undefined){
				var tagName = $('#'+fieldName).get(0).tagName;
				if(tagName=="div"||tagName=="DIV"){
					// 判断字段是否为签名框
					if(typeof(approvaltype)!="undefined" && approvaltype != "undefined" && approvaltype != ""){
						isapproval = true;
					}
					
					// 添加可编辑样式
					$('#'+fieldName).parent().attr("class",'divListEdit mui-table-view-cell');
					$('#'+fieldName).addClass('mui-navigate-right');
				}
			}
		}else{  // 不可编辑的操作
			var fileItem = $('#'+fieldName).get(0);
			if(fileItem!=undefined){
				var tagName = $('#'+fieldName).get(0).tagName;
				if(tagName=="SELECT"){ // 设置选择框不可编辑
					$('#'+fieldName).attr("disabled","disabled");
				}
			}
		}
		
		if(tempItem == null)continue;
		
		// 各字段赋值
		if(approvaltype=="1" || approvaltype=="3"){ // 单条签名框			
			// 签名框标题处理
			tempItem.classList.add('signTitle');
			tempItem.classList.add('bg_qj'); 
			tempItem.classList.add('bg_title');
			fieldValue = ""
			var tempFieldValue = fieldNameValueMap.get(fieldName);
			if (tempFieldValue && tempFieldValue != '') { // 数据存在且不为空
				var valArr = tempFieldValue.split("&@&");
				
				if (valArr && valArr.length > 0) {
					approveValue = valArr[0];
					approveUser = valArr[1];
					var parentNode = tempItem.parentNode;
					
					var tempDiv = document.createElement('div');
					tempDiv.className = 'textAreat colorR pad_t5 font_18';
					tempDiv.innerHTML = approveValue;
					parentNode.appendChild(tempDiv);
					
					tempDiv = document.createElement('div');
					tempDiv.className = 'colorR textFloatR boot_15 pad_t25 pad_r20 font_18';
					tempDiv.innerHTML = approveUser;
					parentNode.appendChild(tempDiv);
				}
			}
			
			var parentNode = tempItem.parentNode; // 获取标题控件的父控件
			if (parentNode.children.length < 2) { // 若只有一条标题, 则显示无
				var tempDiv = document.createElement('div');
				
				tempDiv.className = 'textAreat colorR pad_t5 font_18';
				tempDiv.innerHTML = "无";
				parentNode.appendChild(tempDiv);
			}
			
		} else if(approvaltype=="2" || approvaltype=="4"){ // 多条签名框
			
			// 签名框标题处理
			tempItem.classList.add('signTitle');
			tempItem.classList.add('bg_qj'); 
			tempItem.classList.add('bg_title');
			
			fieldValue = "";
			var tempFieldValue = fieldNameValueMap.get(fieldName);
			if (tempFieldValue && tempFieldValue != '') { // 若数据不为空, 则分割意见条数
				var valArr = tempFieldValue.split("&,&");
				if (valArr && valArr.length > 0) { // 若已经条数不为0, 则继续分割意见与签名
					for (var j = 0; j < valArr.length; j++) {// 添加所有签名
						var itemValue = valArr[j];
						if (itemValue != '') { // 若内容不为空, 则分割数据
							var itemArr = itemValue.split("&@&");
							if (itemArr && itemArr.length > 0) { // 若分割出的数组长度不为0, 则开始显示数据
								approveValue = itemArr[0];
								approveUser = itemArr[1];
								
								var parentNode = tempItem.parentNode;
								var tempDiv = document.createElement('div');
								
								// 若该签名不是第一个签名, 则画一条虚线
								if(j != 0){
									tempDiv.className = 'colorR moreSignLine';
									parentNode.appendChild(tempDiv);
									tempDiv = document.createElement('div');
								}
								
								tempDiv.className = 'textAreat colorR pad_t25 font_18';
								tempDiv.innerHTML = approveValue;
								parentNode.appendChild(tempDiv);
								
								tempDiv = document.createElement('div');
								tempDiv.className = 'colorR textFloatR boot_15 pad_r20 pad_t25 font_18';
								tempDiv.innerHTML = approveUser;
								parentNode.appendChild(tempDiv);
							}
						}
					}
				}
			}
			
			var parentNode = tempItem.parentNode; // 获取标题控件的父控件
			if (parentNode.children.length < 2) { // 若只有一条标题, 则显示无
				var tempDiv = document.createElement('div');
				
				tempDiv.className = 'textAreat colorR pad_t5 font_18';
				tempDiv.innerHTML = "无";
				parentNode.appendChild(tempDiv);
			}
			
		} else { // 非签名框
			var fileItem = $('#'+fieldName).get(0);

			if(fileItem!=undefined){
				var tagName = $('#'+fieldName).get(0).tagName;
				if(tagName=="SELECT"){
					$('#'+fieldName).val(fieldValue);
				}else{
					if (fieldValue == "") { // 若内容为空, 则显示无
						fieldValue = "无";
					}
					tempItem.innerHTML = fieldValue;
				}
			}
		}
	}
}

function initSysData(rtnData){
	var sysData = {};
	sysData.templateId = rtnData.templateId;
	sysData.missiveId = rtnData.missiveId;
	sysData.m_title = rtnData.m_title;
	sysData.mtTitleField = rtnData.mtTitleField;
	sysData.gradeField = rtnData.gradeField;
	sysData.flowId = rtnData.flowId;
	sysData.flowGoId = rtnData.flowGoId;
	sysData.sourceFlag = rtnData.sourceFlag;
	sysData.nextFlowsJson = rtnData.nextFlowsJson;
	sysData.tbStartFlowId = rtnData.tbStartFlowId;
	sysData.tbForeFlow = rtnData.tbForeFlow;
	sysData.mfPvFlow = rtnData.mfPvFlow;
	sysData.mfScript = rtnData.mfScript;
	sysData.sonTemplateId = rtnData.sonTemplateId;
	sysData.sonTemplateName = rtnData.sonTemplateName;
	sysData.op = rtnData.op;
	sysData.parentMissiveId = rtnData.parentMissiveId;
	sysData.sonMisFlag = rtnData.sonMisFlag;
	sysData.date = rtnData.date;
	sysData.nowdate = rtnData.nowdate;
	sysData.userName = rtnData.userName;
	sysData.uname = rtnData.uname;
	sysData.umobile = rtnData.umobile;
	sysData.userId = rtnData.userId;
	sysData.sysParams = rtnData.sysParams;
	sysData.missive_attach_type = rtnData.missive_attach_type;
	sysData.missive_grade_order = rtnData.missive_grade_order;
	sysData.send_message_grade = rtnData.send_message_grade;
	
	return sysData;
}

// 创建流转记录
function createRecord(RecordData,listId){
	var num;
	var table = document.body.querySelector('#listContent');
	
	for(num in RecordData){
		
		// 获取item的各个元素
		var flowTitle = RecordData[num].flowTitle;
		var deptName = RecordData[num].deptName;
		var operatorName = RecordData[num].operatorName;
		var mfrOperateMsg = RecordData[num].mfrOperateMsg;
		var operateTime = RecordData[num].operateTime;
		var operate = RecordData[num].operate;
		
		var li = document.createElement('div');
		
		var countNum = parseInt(num) + 1;
		
		// 拼接成一个item
		li.innerHTML = '<div class="itemTitle borderItem">步骤&nbsp;'+countNum+
		'&nbsp;:</div><div class="divList borderItem">'+
		'<div class="display floatL colorL">环节名称</div>'+
		'<div class="textAreat floatR colorR">'+flowTitle+'</div></div>'+
//		'<div class="divList"><div class="display floatL colorL">处理部门</div>'+
//		'<div class="textAreat floatR colorR">'+deptName+'</div></div>'+
		'<div class="divList"><div class="display floatL colorL">处理人　</div>'+
		'<div class="textAreat floatR colorR">'+operatorName+'</div></div>'+
//		'<div class="divList"><div class="display floatL colorL">处理意见</div>'+
//		'<div class="textAreat floatR colorR">'+mfrOperateMsg+'</div></div>'+
		'<div class="divList"><div class="display floatL colorL">处理时间</div>'+
		'<div class="textAreat floatR colorR">'+operateTime+'</div></div>'+
		'<div class="divList"><div class="display floatL colorL">操作　　</div>'+
		'<div class="textAreat floatR colorR">'+operate+'</div></div>';
		
		// 新纪录插到最前面；
		table.insertBefore(li, table.firstChild);
	}
}

/**
 * 创建人员信息列表
 * @param {Object} listData
 */
function createPersonListData(listData){
	var i;
	var table = document.body.querySelector('#listContent');
	
	for(i in listData){
		itemCount += 1;
		var username = listData[i].username;
		var deptName = listData[i].deptName;
		var userid = listData[i].userid;
		var li = document.createElement('div');
		li.className = 'divList';
		li.innerHTML = '<div class="mui-checkbox"><span>'+username+'　　'+deptName+
		'</span><input id="'+userid+'" name="'+userid+'" value="'+userid +","+ username+
		'" type="checkbox" class="cboxInput floatR"></div>';
			
		table.appendChild(li);
	}
}

/**
 * 创建一个公用的item条目, 使用界面: 会议,待办,待阅,已办
 * @param {Object} top 条目头部
 * @param {Object} content 条目内容
 * @param {Object} time 条目时间, 年月日
 */
function buildPublicItem(top,content,time,icon,iconColor,statusText){
	var newItem = '<table border="0"><tr><td rowspan="2" width="35">'+
		'<span class="mui-icon iconfont '+icon+' '+iconColor+'"></span></td>'+
		'<td><div class="statusText"><p class="'+iconColor+'">'+statusText+'</p></div>'+
		'<div class="listTitle autoHiddenText">'+top+'</div></td></tr><tr><td>'+
		'<div class="timeStyle"><div class="timeTextStyle" >'+time+
		'</div></div><p class="autoHiddenText" style="padding-left: 10px;">'+
		content+'</p></td></tr></table>';
	return newItem;
}
