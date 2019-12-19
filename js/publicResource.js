
/* 屏幕方向锁死 */

var LOCK_SCREEN = false; 			// 是否锁死屏幕方向为竖屏
var CHANGE_SCREEN_REFRESH = false;	// 是否启用屏幕旋转刷新(临时处理)

/* 请求设置 */

var SHOW_REQUEST_WAITING = "y";		// 若显示请求等待框为"y", 则只显示加载圈(暂未启用)

/* 定时刷新 */

var OPEN_REFRESH = true;			// 控制是否定时刷新
var REFRESH_TIME = 3000;			// 设置定时刷新的时间间隔

/* 会议状态 */

var WAIT_MEET = "1"; 				// 待上会
var RUNING_MEET = "2"; 				// 开会中
var END_MEET = "3"; 				// 会议已结束
var PAUSE_MEET = "9"; 				// 会议暂停中

/* 议题状态 */

var DRAFT_ISSUE = "1"; 				// 议题草稿
var WAIT_ISSUE = "2"; 				// 议题未开始
var RUNING_ISSUE = "3"; 			// 议题进行中
var END_ISSUE = "4"; 				// 议题已结束
var PAUSE_ISSUE = "9"; 				// 议题暂停中


/* 杂项 */

var LOADING_TEXT = "读取中...";		// 通用读取数据时显示的文字

var MEET_MAX_CACHE_COUNT = 15;		// 会议详情最大缓存数
