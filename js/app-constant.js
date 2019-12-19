
// 项目管理相关常量开始####################################################
var CONST_PRJ_TYPE_MGR = "1";            // 我管理的项目（运营中和预结项）
var CONST_PRJ_TYPE_MGR_MIN = "4";        // 我管理的项目（运营中和预结项，不含‘全部项目’）
var CONST_PRJ_TYPE_ATTEND = "2";         // 我参与的项目（运营中）
var CONST_PRJ_TYPE_ATTEND_EXT = "3";     // 我参与的项目（运营中和预结项）
var CONST_PRJ_TYPE_MGR_CMD = "101";      // 我管理的项目（运营中和预结项）-接口标识码
var CONST_PRJ_TYPE_MGR_MIN_CMD = "107";  // 我管理的项目（运营中和预结项，不含‘全部项目’）-接口标识码
var CONST_PRJ_TYPE_ATTEND_CMD = "202";   // 我参与的项目（运营中）-接口标识码
var CONST_PRJ_TYPE_ATTEND_EXT_CMD = "3"; // 我参与的项目（运营中和预结项）-接口标识码
// 项目管理相关常量结束####################################################


// 单选操作类型标识常量开始#################################################
// 单选交通工具
var RADIO_TRANSPORT = "transport";
/** 单选项目 */
var RADIO_PROJECT = "project";
/** 单项照相或图片 */
var RADIO_CAMERA = "camera";
// 单选操作类型标识常量结束#################################################


// 外勤管理相关常量开始####################################################
// 外勤开始状态
var START_WAIQIN_STATE = "0";
var START_WAIQIN_STATE_TXT = "出发";
// 到达状态
var ARRIVED_WAIQIN_STATE = "1";
var ARRIVED_WAIQIN_STATE_TXT = "到达";
// 完成
var FINISH_WAIQIN_STATE = "2";
var FINISH_WAIQIN_STATE_TXT = "完成";
// 返程
var RETURN_WAIQIN_STATE = "3";
var RETURN_WAIQIN_STATE_TXT = "返程";
// 关闭
var CLOSE_WAIQIN_STATE = "4";
var CLOSE_WAIQIN_STATE_TXT = "关闭";

// 外出工单类型
var HANDLE_FORM_FLAG = "0"; 			  // 处理工单标记
var HANDLE_FORM_FLAG_TXT = "处理工单"; 	  // 处理工单标记
var VISIT_CUSTOMER_FLAG = "1"; 			  // 拜访客户标记
var VISIT_CUSTOMER_FLAG_TXT = "拜访客户";    // 拜访客户标记

// 照相机路径
var CAMERA_PATH = "_doc/camera/"; 		  // 照相机路径

// 外勤签到
var CONST_ATTEND_SIGNIN_TITLE = "签到成功！";
var CONST_ATTEND_SIGNOUT_TITLE = "签退成功！";
var CONST_ATTEND_SIGNIN_MSG = "开心工作，从此刻开启";
var CONST_ATTEND_SIGNOUT_MSG = "今天您辛苦了，感谢您的努力和付出！";
// 外勤管理相关常量结束####################################################