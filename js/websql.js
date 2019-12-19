
/* 数据库表名称 */

var DB_TABLE_CACHE = "cacheTable";						// 缓存用数据库名称

/* 表字段名称 */

var DATA_FLAG = "dataFlag";								// 数据标识(如会议详情数据)
var DATA_ID = "dataId";									// 数据自己的id
var RELATE_MEET_ID = "relateMeetId";					// 数据所关联的会议id, 用于方便数据删除
var RELATE_NODE_ID = "relateNodeId";					// 数据上一级关联的节点id(节点包括会议, 议题等)
var DATA_CONTENT = "dataContent";						// 数据内容本体(json数据)
var DATA_TIMESTAMP = "dataTimestamp";					// 数据时间戳标记(记录缓存会议的活跃度)

/* 数据标识类型 */

var NOT_START_AND_RUNNING = "notStartAndRunning";		// 未开始与正在进行的会议列表数据
var NOT_START_MEET_DATA = "notStartMeetData";			// 未开始会议列表数据
var RUNNING_MEET_DATA = "runningMeetData";				// 进行中会议列表数据
var FINISH_MEET_DATA = "finishMeetData";				// 已结束会议列表数据
var MEET_DETAIL_DATA = "meetDetailData";				// 会议详情数据
var ISSUE_LIST_DATA = "issueListData";					// 议题列表数据
var ISSUE_DETAIL_DATA = "issueDetailData";				// 议题详情数据
var ISSUE_MISSIVE_LIST_DATA = "issueMissiveListData";	// 议题相关公文数据
var ACCESSORIES_DATA = "accessoriesData";				// 附件数据


/**
 * 数据库操作辅助类,定义对象、数据操作方法都在这里定义
 */
var dbname='ecroeDB';			/*数据库名*/
var version = '1.0'; 			/*数据库版本*/
var dbdesc = '移动端数据库'; 	/*数据库描述*/
var dbsize = 10*1024*1024; 		/*数据库大小*/
var dataBase = null; 			/*暂存数据库对象*/

/**
 * 打开数据库. 
 * ps: 安装应用第一次打开时, 系统会报错, 无法显示数据, 暂未修复, 关闭应用后重启即可
 * @returns  dataBase:打开成功   null:打开失败
 */
function openDB(){
    /*数据库有就打开 没有就创建*/
    dataBase = window.openDatabase(dbname, version, dbdesc, dbsize,function() {});
    return dataBase;
}

/**
 * 若表名不存在, 则创建对应的数据表
 */
function createCacheTable(){
	
	// 顺序依次为数据标识, 数据id, 关联id, 数据本体, 同类数据顺序标记
    var sql = 'CREATE TABLE IF NOT EXISTS '+DB_TABLE_CACHE+' ('+DATA_FLAG+' VARCHAR, '+DATA_ID+' VARCHAR, '+RELATE_MEET_ID+' VARCHAR, '+RELATE_NODE_ID+' VARCHAR, '+DATA_CONTENT+' TEXT, '+DATA_TIMESTAMP+' INT)';
    dataBase.transaction(function (ctx,result) {
        ctx.executeSql(sql,[],function(ctx,result){
            console.log("表创建/打开成功 " + DB_TABLE_CACHE);
            closeWaiting();
        },function(tx, error){ 
            console.log('创建表失败: ' + DB_TABLE_CACHE +", "+ error.message);
            closeWaiting();
        });
    });
}

/**
 * 往表单里面插入数据(判断部分)
 * @param args.dataFlag 数据类型标识
 * @param args.dataId <p 数据id
 * @param args.relateMeetId <p 关联的会议id
 * @param args.relateNodeId <p 关联上一节点id(会议, 议题id等)
 * @param args.dataContent 数据内容
 */
function insterCacheData(args,successFun){
	
	var dataFlag = args.dataFlag; 	// 获取插入数据类型
	var dataId = ""; 				// 数据id
	var relateMeetId = ""; 			// 数据关联的会议id
	var relateNodeId = ""; 			// 数据上一节点关联的id
	var dataContent = ""; 			// 数据内容
	var insterNewTimestamp = ""; 	// 新时间戳标识
	var updateArgs = {};			// 需要更新数的内容
	var conditionArgs = {};			// 需要更新数据的条件数据
	conditionArgs[DATA_FLAG] = dataFlag;
	dataContent = JSON.stringify(args.dataContent); 		// 获取数据内容, 存储前将对象转换为字符串
	updateArgs[DATA_CONTENT] = dataContent;
	
	switch (dataFlag) {
		
		case ISSUE_DETAIL_DATA : 							// 议题详情数据需要记录数据id与关联id
			dataId = args.dataId; 							// 获取数据id
			relateMeetId = args.relateMeetId; 				// 获取关联的会议id
			relateNodeId = args.relateNodeId; 				// 获取关联id
			conditionArgs[DATA_ID] = dataId;				// 获取数据的同时将数据填入更新对象参数中
			conditionArgs[RELATE_NODE_ID] = relateNodeId;
			break;
		case ISSUE_LIST_DATA : 								// 议题列表与附件列表仅需要关联id
		case ISSUE_MISSIVE_LIST_DATA : 						// 议题相关公文列表数据
		case ACCESSORIES_DATA : 
			relateMeetId = args.relateMeetId;
			relateNodeId = args.relateNodeId;
			conditionArgs[RELATE_NODE_ID] = relateNodeId;
			break;
		case MEET_DETAIL_DATA : 							// 会议数据需要查询当前缓存的数量, 然后根据队列原理, 存储指定量的会议详情缓存
			dataId = args.dataId; 							// 获取数据id
			relateMeetId = args.relateMeetId;
			conditionArgs[DATA_ID] = dataId;				// 将数据id存至查询条件对象中
			break;
	}
	
	// 查询当前数据库中是否有相同参数的数据, 有则覆盖该参数的数据
	selectCacheData(conditionArgs,function (rows) {
		
		if (rows.length > 0) { // 当数据库中有该数据时, 更新该数据
			
			updateCacheData(updateArgs,conditionArgs,function () {
				successFun();
			});
			
		} else { // 没有该数据则插入该条数据
			
			if (dataFlag == MEET_DETAIL_DATA) {	// 当插入的数据为会议详情数据时, 获取新数据的顺序标识后, 再插入新数据
				
				getNewCacheTimestamp(dataFlag,function(newTimestamp){
					insterNewTimestamp = newTimestamp;
					insterCacheDataOnly(dataFlag,dataId,relateMeetId,relateNodeId,dataContent,insterNewTimestamp,successFun);
				});
				
			} else { // 不需要获取新位置的数据则直接加入数据库
				
				insterCacheDataOnly(dataFlag,dataId,relateMeetId,relateNodeId,dataContent,insterNewTimestamp,successFun);
				
			}
		}
	});
}

// 往表单里面插入数据(数据插入部分)
function insterCacheDataOnly(dataFlag,dataId,relateMeetId,relateNodeId,dataContent,insterNewTimestamp,successFun) {
	
	var sql = 'INSERT INTO '+DB_TABLE_CACHE+' ('+DATA_FLAG+','+DATA_ID+','+RELATE_MEET_ID+','+RELATE_NODE_ID+','+DATA_CONTENT+','+DATA_TIMESTAMP+') VALUES (?,?,?,?,?,?)';
	dataBase.transaction(function (ctx) {
		ctx.executeSql(sql,[dataFlag,dataId,relateMeetId,relateNodeId,dataContent,insterNewTimestamp],function (ctx,result){
			console.log("插入数据成功");
			successFun();
		    closeWaiting();
		},
		function (tx, error) {
			console.log('插入数据失败: ' + error.message);
		    closeWaiting();
		});
	});
}

/**
 * 查询单条数据方法
 * @param {Object} conditionArgs 查询条件参数
 * @param {Function} successFun 查询成功的回调
 */
function selectCacheData(conditionArgs,successFun) {
	
	var sql = 'SELECT * FROM '+DB_TABLE_CACHE+' WHERE ';
	var argsArr = []; 								// 用于存储需要修改的数据数组
	var isArgsArrFrist = true;
	for (var i in conditionArgs) { 					// 遍历更新数据对象
		if (isArgsArrFrist) {
			sql += i+' = ? '; 						// 拼接修改内容sql
			isArgsArrFrist = false;
		} else {
			sql += 'and '+i+' = ? ';
		}
		argsArr[argsArr.length] = conditionArgs[i];
	}

    dataBase.transaction(function (ctx) {
        ctx.executeSql(sql,argsArr,function (ctx,result){
        	
        	console.log("获取到的数据总数 : " + result.rows.length);
        	
        	successFun(result.rows);
        	
        },
        function (tx, error) {
			console.log('查询失败: ' + error.message);
			closeWaiting();
        });
	});
}

/**
 * 获取某个类型数据的新缓存的位置标识(主要为会议详情)
 * @param {Object} dataFlag 数据类型标识
 * @param {Function} successFun 获取成功的回调
 */
function getNewCacheTimestamp(dataFlag, successFun) {
	
	var sql = 'SELECT * FROM '+DB_TABLE_CACHE+' WHERE '+DATA_FLAG+' = ?';
	
    dataBase.transaction(function (ctx) {
        ctx.executeSql(sql,[dataFlag],function (ctx,result){
        	
        	console.log("获取到的数据 : " + JSON.stringify(result.rows));
        	var rows = result.rows;
        	var length = rows.length;
            
            if (length >= MEET_MAX_CACHE_COUNT) { 		// 缓存总数达到指定缓存量时, 删除最旧的数据(时间戳最小表示最久的)
            	var tempData;
            	var minTimestamp; // 记录最小的时间戳
            	var deleteMeetId; // 记录最小时间戳对应的需要删除的会议id
            	for (var i=0; i<length; i++) {
            		tempData = rows.item(i);
            		if (i == 0) {
            			// 获取时间戳和关联的会议id
            			minTimestamp = tempData[DATA_TIMESTAMP];
            			deleteMeetId = tempData[RELATE_MEET_ID];
            		} else { // 找出活跃度最低的数据
            			if (minTimestamp > tempData[DATA_TIMESTAMP]){
            				minTimestamp = tempData[DATA_TIMESTAMP];
            				deleteMeetId = tempData[RELATE_MEET_ID];
            			}
            		}
            	}
            	// 删除活跃度最低的数据
            	deleteMeetDetailData(deleteMeetId);
            }
            successFun(new Date().getTime());			// 回调, 返回新增数据的时间戳
            
			closeWaiting();
        },
        function (tx, error) {
			console.log('查询失败: ' + error.message);
			closeWaiting();
        });
    });
}

/**
 * 根据数据类型标识与数据id修改数据内容
 * @param {Object} updateArgs 需要更新的字段对象
 * @param {Object} conditionArgs 需要更新的数据条件对象
 * @param {Function} successFun 更新成功的回调
 */
function updateCacheData(updateArgs, conditionArgs, successFun){
	
	var sql = 'UPDATE '+DB_TABLE_CACHE+' SET '; 	// 头部sql
	var argsArr = []; 								// 用于存储需要修改的数据数组
	for (var i in updateArgs) { 					// 遍历并拼接更新数据对象
		sql += i+' = ? ';
		argsArr[argsArr.length] = updateArgs[i];	// 将需要传值sql语句中的参数按顺序存储起来
	}
	
	var isConditionArgsFirst = true;				// 记录条件参数是否是第一个
	for (var i in conditionArgs) {
		if (isConditionArgsFirst) {					// 若是第一个, 则拼接where条件字眼
			sql += 'WHERE '+i+' = ? ';
			isConditionArgsFirst = false;
		} else {									// 其他拼接and条件字眼
			sql += 'and '+i+' = ? ';
		}
		argsArr[argsArr.length] = conditionArgs[i];
	}
	
    dataBase.transaction(function (ctx,result) {
        ctx.executeSql(sql, argsArr, function(ctx,result){
            console.log("更新成功");
            closeWaiting();
            successFun();
        },function(tx, error){ 
			console.log('更新失败: '+ error.message);
            closeWaiting();
        });
    });
}

/**
 * 获取数据库一个表单里面的所有数据
 * @param {Object} dataFlag 数据类型, 没有时返回全部数据
 * @param {Object} successFun 获取成功的回调
 */
function getCacheData(dataFlag,successFun){
	
	var sql = 'SELECT * FROM ' + DB_TABLE_CACHE;
	if (dataFlag != undefined && dataFlag != "") {
		sql += ' WHERE '+DATA_FLAG+' = "'+dataFlag+'"';
	}
	dataBase.transaction(function (ctx) {
		ctx.executeSql(sql,[],function (ctx,result){
			console.log("获取到的数据总数 : " + result.rows.length);
			closeWaiting();
			successFun(result.rows);
        },
		function (tx, error) {
			console.log('查询失败: ' + error.message);
			closeWaiting();
		});
	});
}

/**
 * 根据会议id删除会议缓存数据(同时删除议题,附件列表缓存)
 * @param {Object} meetId <p需要删除的会议id
 */
function deleteMeetDetailData(meetId){
	
    var sql = 'DELETE FROM '+DB_TABLE_CACHE+' WHERE '+RELATE_MEET_ID+' = ?';
    dataBase.transaction(function (ctx,result) {
        ctx.executeSql(sql,[meetId],function(ctx,result){
        	console.log("删除成功");
            closeWaiting();
        },function(tx, error){ 
			console.log('删除失败: '+ error.message);
            closeWaiting();
        });
    });
}

/**
 * 清空缓存内容
 */
function clearCacheData(successFun) {
	
	var sql = 'DELETE FROM ' + DB_TABLE_CACHE;
	dataBase.transaction(function (ctx) {
		ctx.executeSql(sql,[],function (ctx,result){
			closeWaiting();
			successFun();	// 执行删除成功的操作
        },
		function (tx, error) {
			console.log('删除失败: ' + error.message);
			closeWaiting();
		});
	});
}

/**
 * 删除缓存表
 * @param {Function} successFun 删除成功后执行的操作
 */
function dropCacheTable(successFun) {
	
	var sql = 'DROP TABLE ' + DB_TABLE_CACHE;
	dataBase.transaction(function (ctx) {
		ctx.executeSql(sql,[],function (ctx,result){
			console.log('删除缓存表成功');
			successFun();
			closeWaiting();
        },
		function (tx, error) {
			console.log('删除失败: ' + error.message);
			closeWaiting();
		});
	});
}
