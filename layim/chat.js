// 全局变量
var conn;
//var $;
var _token;
var _user;
var username;
var password;

function onload(){
//	initConn()
}
mui.plusReady(function() {
	var id = plus.webview.currentWebview().id;
	username = id.substr(1,id.length);
	password = plus.storage.getItem("pwd");
	initConn(username,password)
});
function isStatusbarHeight(){
//	alert(1);
	//判断是否支持沉浸式
	var isImmersedStatusbar = plus.navigator.isImmersedStatusbar();
	console.log(isImmersedStatusbar);
	//获取系统状态栏高度
	var StatusbarHeight = plus.navigator.getStatusbarHeight();
	if(isImmersedStatusbar){
		$('.layui-layim').css("top", (50 + StatusbarHeight) + 'px');
		$('.layim-title').css("height", (50 + StatusbarHeight) + 'px');
		$('.layim-title p').css("padding-top", StatusbarHeight + 'px');
		$('.layim-chat-main, .layim-content').css("top", 50+StatusbarHeight + 'px');
	}
}

function initConn(username,password) {
    conn = new WebIM.connection({
        isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
        https: typeof WebIM.config.https === 'boolean' ? WebIM.config.https : location.protocol === 'https:',
        url: WebIM.config.xmppURL,
        heartBeatWait: WebIM.config.heartBeatWait,
        autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
        autoReconnectInterval: WebIM.config.autoReconnectInterval,
        apiUrl: WebIM.config.apiURL,
        isAutoLogin: true
    });
    conn.listen({
        //连接成功回调
        onOpened: function (message) {
            // 如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
            // 手动上线指的是调用conn.setPresence(); 如果conn初始化时已将isAutoLogin设置为true
            // 则无需调用conn.setPresence();
        },
        //连接关闭回调
        onClosed: function (message) {
            console.log("onClosed");
            console.log(message);
            // window.location.reload();
        },
        //收到文本消息
        onTextMessage: onTextMessageInvoke,
        //收到表情消息
        onEmojiMessage: function (message) {
            console.log("onEmojiMessage");
        },
        //收到图片消息
        onPictureMessage: function (message) {
            console.log("onPictureMessage");
        },
        //收到命令消息
        onCmdMessage: function (message) {
            console.log("onCmdMessage");
        },
        //收到音频消息
        onAudioMessage: function (message) {
            console.log("onAudioMessage");
        },
        //收到位置消息
        onLocationMessage: function (message) {
            console.log("onLocationMessage");
        },
        //收到文件消息
        onFileMessage: function (message) {
            console.log("onFileMessage");
        },
        //收到视频消息
        onVideoMessage: function (message) {
            console.log("onVideoMessage");
            var node = document.getElementById('privateVideo');
            var option = {
                url: message.url,
                headers: {
                    'Accept': 'audio/mp4'
                },
                onFileDownloadComplete: function (response) {
                    var objectURL = WebIM.utils.parseDownloadResponse.call(conn, response);
                    node.src = objectURL;
                },
                onFileDownloadError: function () {
                    console.log('File down load error.')
                }
            };
            WebIM.utils.download.call(conn, option);
        },
        //处理“广播”或“发布-订阅”消息，如联系人订阅请求、处理群组、聊天室被踢解散等消息
        onPresence: function (message) {
            console.log("onPresence");
        },
        //处理好友申请
        onRoster: function (message) {
            console.log("onRoster");
        },
        //处理群组邀请
        onInviteMessage: function (message) {
            console.log("onInviteMessage");
        },
        //本机网络连接成功
        onOnline: function () {
            console.log("onOnline");
        },
        //本机网络掉线
        onOffline: function () {
            console.log("onOffline");
        },
        //失败回调
        onError: onErrorInvoke,
        //黑名单变动
        onBlacklistUpdate: function (list) {
            console.log("onBlacklistUpdate");
            // 查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
            console.log(list);
        },
        //收到消息送达服务器回执
        onReceivedMessage: function (message) {
            console.log("onReceivedMessage");
            console.log(message);
        },
        //收到消息送达客户端回执
        onDeliveredMessage: function (message) {
            console.log("onDeliveredMessage");
        },
        //收到消息已读回执
        onReadMessage: function (message) {
            console.log("onReadMessage");
        },
        //创建群组成功回执（需调用createGroupNew）
        onCreateGroup: function (message) {
            console.log("onCreateGroup");
        },
        //如果用户在A群组被禁言，在A群发消息会走这个回调并且消息不会传递给群其它成员
        onMutedMessage: function (message) {
            console.log("onMutedMessage");
        }
    });
    setTimeout(loginRequest(username,password),1000);
    setTimeout(onFriendWatch, 1000);
}

function loginRequest(username,password){
	loginAsImAccount(username,password);
//	loginAsImAccount("928192249437618176", "JQz4tRx3Pz+NyLS+hnqaAg==");
}

/**
 * 以Im账户登录
 */
function loginAsImAccount(username, password) {
    var options = {
        apiUrl: WebIM.config.apiURL,
        user: username,
        pwd: password,
        appKey: WebIM.config.appkey,
        success: function success(token) {
			console.log(token);
           	// console.log(token);
	        _token = token;
	        _user = token.user;
	        // 获取登录账号信息并初始化LayIM
	        getUserInfoAndInitLayIM()
//			initLayIm()
        },
        error: function error() {
        	alert("账号或密码不正确！")
        }
    };
    try {
        conn.open(options);
    } catch (e) {
        console.log(e);
    }
}

function getUserInfoAndInitLayIM(){
    var user = _token.user;
    console.log(user.uuid);
    var firsturl = JpImConstant.baseUrl + "layim/userAndFriendInfo";
    var url = JpImConstant.baseUrl + "layim/friendGroupByAlphabet";
    var _param = {uuid: user.uuid};
    var _userInfo4IM;
    $.ajax({
        url: firsturl,
        async:false,
        type: 'GET',
        data: _param,
        dataType: 'json',
        success: function (rst) {
            _userInfo4IM = rst.userInfo;
        }
    });
var _friends4IM=[];
    $.ajax({
        url: url,
        type: 'GET',
        async:false,
        data: _param,
        dataType: 'json',
        success: function (rst) {
        	console.log(rst.length);
        	for(var i in rst) {
        		var data = {};
        		data.groupname=i;
        		data.list=rst[i];
        		_friends4IM.push(data);
        	}
        	console.log(_userInfo4IM);
        	console.log(_friends4IM);
            initLayIm(_userInfo4IM, _friends4IM)
        }
    });	
//  console.log(_friends4IM);
}

/**
 * 收到文本消息
 * @param message
 */
function onTextMessageInvoke(message) {
	console.log("onTextMessageInvoke");
    var type = message.type;
    var ext = message.ext;
    var data = message.data;
    var type = message.type;
    var ext = message.ext;
    if("chat" == type){
        var obj = {
            username: ext.chineseName,
            avatar: ext.avatar,
            id: message.from,
            type: "friend",
            fromid: message.from,
            content: message.data
        };
        _layIm.getMessage(obj);
    }else if("groupchat" == type){
        var from = message.from;
        var uuid = _user.uuid;
        if(from != uuid){ // 不是自己发的才处理
            var obj = {
                username: ext.chineseName,
                avatar: ext.avatar,
                id: message.to,
                type: "group",
                content: message.data
            };
            _layIm.getMessage(obj);
        }
    }
}

/**
 * 异常回调
 * PS：目前在官方文档暂时没找到对于message数据的详细说明，
 *     只能发现一种支持一种，有待找到对于回调入参message的详细说明优化
 * @param message
 */
function onErrorInvoke(message) {
    console.log("onErrorInvoke");
    console.log(message);
}

var friendWatch;
//好友消息查看
function onFriendWatch(){
	var url = JpImConstant.baseUrl + "messageBox/waitFriendList?userId="+username;
	$.ajax({
		url: url,
		type: 'GET',
		async:false,
		success: function(rst) {
			friendWatch=rst.model;
			if(friendWatch.length>0){
				var waitFriendHtml = '<span class="laymi-define-radius">'+friendWatch.length+'</span>';
				$('.layim-list-top:eq(0) li:eq(0)').append(waitFriendHtml);
				$('.layui-layim-tab li:eq(1) i').css("display", "block");
			}
		}
	});
}