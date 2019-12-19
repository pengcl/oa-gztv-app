// 服务器链接
// var topUrl = "http://120.24.70.186:8004/tv-oa/";
// var imUrl = "http://120.24.70.186:8020/im/";

// 电视台内部地址
// var topUrl = "http://10.31.4.12:8088/gztv-oa/";
// var imUrl = "http://10.31.4.12:8088/im/";

// 本地环境
 var topUrl = "http://192.168.31.93:8080/tv-oa/";
 var imUrl = "http://192.168.31.93:8080/im/";

// GZTVOA测试环境
//var topUrl = "http://10.40.20.73:8080/gztv-oa/";

// 用户登录
var loginUrl = "SysUsers!login.action";

// 问候语
var greetingUrl = "GreetingManage!getOneGreeting.action";

// 获取会议管理列表  flag控制权限
var meetListUrl = "MeetingApply!getOwnList.action";
console.log(meetListUrl);

// 获取会议详情
var meetDetailUrl = "MeetingApply!getById.action";

// 通知开会
var sendNoticeMeetSignal = "MeetingApply!notifyFun.action";

// 会议签到 id=10&userIds=1,2
var meetSignUrl = "MeetingApply!meetingSignFun.action";

// 发送会议开始信号
var sendStartMeetSignal = "MeetingApply!startFun.action";

// 发送会议暂停信号
var sendPauseMeetSignal = "MeetingApply!pauseFun.action";

// 发送会议重新开始信号
var sendRestartMeetSignal = "MeetingApply!restartFun.action";

// 发送会议结束消息
var sendEndMeetSignal = "MeetingApply!finishMeetingFun.action";

// 发送通知议题人员
var sendNoticeIssueSignal = "MeetingApplyItem!notifySubTopicFun.action";

// 获取议题列表 : 参数 id为会议的id  flag控制权限
var meetIssueList = "MeetingApplyItem!getOwnList.action";

// 议题列表顺序调整
var changeItemOrdUrl = "MeetingApplyItem!changeItemOrd.action";

var issueUpdateOrCreateUrl = "MeetingApplyItem!saveOrUpdate.action";

// 移除议题
var unbindItemUrl = "MeetingApplyItem!unbindItem.action";

// 获取议题详情
var meetIssueDetailUrl = "MeetingApplyItem!getById.action";

// 议题回避选择
var meetIssueEvadeUrl = "MeetingApplyItem!evadeFun.action";

// 获取表决不同意时的常用语
var disagreePhraseUrl = "MeetingApplyItem!getComLang.action";

// 发送议题开始信号
var sendStartIssueSignal = "MeetingApplyItem!startSubTopicFun.action";

// 发送议题结束信号
var sendEndIssueSignal = "MeetingApplyItem!finishSubTopicFun.action";

// 发送下一个议题开始信号
var sendStartNextIssueSignal = "MeetingApplyItem!startNextSubTopicFun.action";

// 获取当前会议议题进行情况
var getRunningIssue = "MeetingApply!getCurSubTopic.action";

// 获取已办列表  参数: 页码, 页面长度, 搜索关键字searchTxt, 关键字为空时, 获取所有信息
var beDoneList = "ViewOfficeMissive!queryDoneTaskJson.action";

// 获取公文字段 op = done, missiveId = 13367, op值代办不同详情页
var missiveDetail = "OfficeMissiveTemplate!initMoblie.action";

// 获取已办流转记录  参数: missiveId
var recordUrl = "OfficeMissiveTemplate!queryTransferRecord.action";

// 获取待办列表 : 参数 页码
var toDoList = "ViewOfficeMissiveFlow!queryToDoTaskJson.action";

// 获取待阅列表 : 参数 页面 关键字 mtitle
var toReadList = "OfficeMissiveTemplate!queryToReadList.action";

// 发送已阅消息
var setReadMessage = "OfficeMissiveTemplate!signRecord.action";

// 保存表单数据
var saveFormData = "OfficeMissiveTemplate!doSave.action";

// 获取附件列表 : 参数 
var meetAccessoriesList = "WfFile!mobileGetList.action";
//WfFile!getAttachList.action 旧的
//mobileGetList 新的

// 获取议题相关公文
var issueMissiveData = "MeetingApplyItem!getTopicMissiveList.action";

// 获取正文附件列表 : 参数 missiveId = 13442
var missiveAccessoriesList = "MobileComFlow!getAttachList.action";

// 下载附件：参数 id=2111
var downloadAccessory = "WfFile!downloadMissiveAttach.action?id="

// 附件存放路径:
var accessoriesPath = "_downloads/accessories/";

// 获取环节列表(路由?)  flowId=   flowGoId=
var getNextLinkListUrl = "OfficeMissiveTemplate!getNextFlow.action";

// 获取人员列表  nextFlowId=  flowGoId=
var getPersonList = "OfficeMissiveTemplate!getNextOperators.action";

// 获取全部人搜索人员列表
var getSearchPersonList = "SysOrgselect!getUserJSON.action";

// 提交环节
var submitLinkUrl = "OfficeMissiveTemplate!doSubmit.action";

// 回退
var doBackUrl = "OfficeMissiveTemplate!doBack.action";

// 办结
var doEndUrl = "OfficeMissiveTemplate!doEnd.action";

// 传阅
var doReadUrl = "OfficeMissiveTemplate!doRead.action";

// 获取公告列表  页面
var getNoticeListUrl = "bulletin/bulletinReadUserListInfo.action";

// 修改密码
var changePasswordUrl = "SysUsers!changePwd.action";

// 获取用户信息
var getUserInfoUrl = "SysUserinfo!getCurUserinfo.action";

// 修改用户信息
var upDateUserInfoUrl = "SysUserinfo!updateCurUserinfo.action";

// 议题表决
var voteIssueUrl = "MeetingApplyItem!saveFeedback.action";

// 议题发起表决, 参数: subId 议题id, flag 标记位 开始 s
var startIssueVoteUrl = "MeetingApplyItem!voteFun.action";


// 查询我的公告列表(图片型)
var URL_NOTICE_LIST_PIC = "noticeUser/listForPic.action"; // size=10
// 查询我的公告列表(文字型)
var URL_NOTICE_LIST = "noticeUser/pageForText.action"; //?page=1&size=10&keyWord=XXX
// 公告确认阅读接口
var URL_NOTICE_READED = "noticeUser/confirmRead.action"; //?id=123
// 未读公告
var URL_NOTICE_UNREAD = "noticeUser/totalUnRead.action";
// 查看公告详情
var URL_NOTICE_VIEW = "page-notice/notice.jsp?noticeInfoId="; //page-bulletin/bulletin/bulletinView.jsp?bulletinId=";
// 查看图片公告
var URL_NOTICE_PIC = "page-portal/main-carouselDetail.jsp?id="; //908975508920729600
// 下载附件地址
var URL_ATTACH_DOWNLOAD = "SysAttachment!download.action?fileNo="; //?fileNo=" + item.picturePath


// 头像存放的位置
var headPicPath = "_downloads/usersHeadPic/";
// 上传用户头像
var uploadHeadPic = "SysUsers!uploadHead.action";
// 获取用户头像
var downloadHeadPic = "SysUsers!downLoadHead.action";
// 获取用户信息
//var getUserInfoUrl = "SysUserinfo!getCurUserinfo";
// 修改用户信息
//var upDateUserInfoUrl = "SysUserinfo!updateCurUserinfo";

// 其它
var URL_CHECK_VERSION = "VersionCheck!checkVersion.action";
