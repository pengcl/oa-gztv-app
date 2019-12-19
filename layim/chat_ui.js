var _layIm;

function initLayIm(_userInfo, _friends){
	layui.config({
	  version: true
	}).use('mobile', function(){
	  var mobile = layui.mobile;
	  var layim = mobile.layim;
	  _layIm = layim;
	  var layer = mobile.layer;
	  
	  //演示自动回复
	  var autoReplay = [
	    '您好，我现在有事不在，一会再和您联系。', 
	    '你没发错吧？face[微笑] ',
	    '洗澡中，请勿打扰，偷窥请购票，个体四十，团体八折，订票电话：一般人我不告诉他！face[哈哈] ',
	    '你好，我是主人的美女秘书，有什么事就跟我说吧，等他回来我会转告他的。face[心] face[心] face[心] ',
	    'face[威武] face[威武] face[威武] face[威武] ',
	    '<（@￣︶￣@）>',
	    '你要和我说话？你真的要和我说话？你确定自己想说吗？你一定非说不可吗？那你说吧，这是自动回复。',
	    'face[黑线]  你慢慢说，别急……',
	    '(*^__^*) face[嘻嘻] ，是贤心吗？'
	  ];
	  
	  layim.config({
	    
	    
	    //上传图片接口
	    uploadImage: {
	      url: JpImConstant.baseUrl+'/upload/image' //（返回的数据格式见下文）
	      ,type: '' //默认post
	    }
	    
	    //上传文件接口
	    ,uploadFile: {
	      url: JpImConstant.baseUrl+'/upload/file' //（返回的数据格式见下文）
	      ,type: '' //默认post
	    },
	    
	    //,brief: true
	    
	                //或采用以下方式初始化接口
        init: {
            "code": 0,
            "msg": "",
            mine: {
                //我的昵称
                "username": _userInfo.chineseName,
                //我的ID
                "id": _userInfo.uuid,
                //我的签名
                "sign": _userInfo.remark,
                //我的头像
                "avatar": _userInfo.avatar
            },
            friend: _friends,
            group: []
        },
	    
	    //扩展聊天面板工具栏
	    tool: [{
	      alias: 'code'
	      ,title: '代码'
	      ,iconUnicode: '&#xe64e;'
	    }]
	    
	    //扩展更多列表
	    ,moreList: [
//	    {
//	      alias: 'find'
//	      ,title: '发现'
//	      ,iconUnicode: '&#xe628;' //图标字体的unicode，可不填
//	      ,iconClass: '' //图标字体的class类名
//	    },{
//	      alias: 'share'
//	      ,title: '分享与邀请'
//	      ,iconUnicode: '&#xe641;' //图标字体的unicode，可不填
//	      ,iconClass: '' //图标字体的class类名
//	    },
	    {
	      alias: 'personalInfo'
	      ,title: '个人信息'
	      ,iconUnicode: '&#xe612;' //图标字体的unicode，可不填
	      ,iconClass: '' //图标字体的class类名
	    },
//	    {
//	      alias: 'backIm'
//	      ,title: '退出'
//	      ,iconUnicode: '&#xe603;' //图标字体的unicode，可不填
//	      ,iconClass: '' //图标字体的class类名
//	    },
//	    {
//	      alias: 'addGroup'
//	      ,title: '添加群聊'
//	      ,iconUnicode: '&#xe608;' //图标字体的unicode，可不填
//	      ,iconClass: '' //图标字体的class类名
//	    },
//	    {
//	    	alias: 'friendTap',
//	    	title: '标签',
//	    	iconUnicode: '&#xe62d;' //图标字体的unicode，可不填,
////	    	iconClass: '' //图标字体的class类名
//	    },
	    ]
	    
	    //,tabIndex: 1 //用户设定初始打开的Tab项下标
	    //,isNewFriend: false //是否开启“新的朋友”
	    ,isgroup: true //是否开启“群聊”
	    //,chatTitleColor: '#c00' //顶部Bar颜色
	    ,title: '<span id="back-home"><i style="font-size:18px" class="layui-icon">&#xe603; </i>我的信息</span>' //应用名，默认：我的IM
	  });
	  
	  //创建一个会话
//	  layim.chat({
//	    id: 111111
//	    ,name: '许闲心'
//	    ,type: 'kefu' //friend、group等字符，如果是group，则创建的是群聊
//	    ,avatar: 'http://tp1.sinaimg.cn/1571889140/180/40030060651/1'
//	  });

	  
	  //监听点击“新的朋友”
	  layim.on('newFriend', function(){
	    layim.panel({
	      title: '新的朋友' //标题
	      ,tpl: addPeopleHtml+selectPeopleHtml //模版
	      ,data: { //数据
	        test: friendWatch,
	      }
	    });
	    isStatusbarHeight();
	  });
	  
	  layim.on('chatChange', function(data) {
	  	isStatusbarHeight();
	  });
	  
	  //查看聊天信息
	  layim.on('detail', function(data){
	    //console.log(data); //获取当前会话对象
	    layim.panel({
	      title: data.name + ' 聊天信息' //标题
	      ,tpl: '<div style="padding: 10px;">自定义模版，<a href="http://www.layui.com/doc/modules/layim_mobile.html#ondetail" target="_blank">参考文档</a></div>' //模版
	      ,data: { //数据
	        test: '么么哒'
	      }
	    });
	  });
	  
	  //监听点击更多列表
	  layim.on('moreList', function(obj){
	    switch(obj.alias){
	      case 'find':
	        layer.msg('自定义发现动作');
	        
	        //模拟标记“发现新动态”为已读
	        layim.showNew('More', false);
	        layim.showNew('find', false);
	      break;
	      case 'share':
	        layim.panel({
	          title: '邀请好友' //标题
	          ,tpl: '<div style="padding: 10px;">自定义模版，{{d.data.test}}</div>' //模版
	          ,data: { //数据
	            test: '么么哒'
	          }
	        });
	      break;
	      case 'backIm':
	      var btnArray = ['取消', '确定'];
              mui.confirm('确定退出吗?', '信息提示', btnArray, function(e) {
                    if (e.index == 1) {
                    	mui.back();
                    }
                })
	      break;
	      case 'personalInfo':
	      openNewPage("../page-me/me-personalInfo-copy.html", "me-personalInfo");
	      break;
//	      case 'addGroup':
//	      var url = 'addGroup.html';
//	      openNewPage(url, username);
//	      	break;
//	      case 'friendTap':
//	      		var url = 'friendTag.html';
//	      		openNewPage(url, username);
//	      break;
	    }
	  });
	  
	  //监听返回
	  layim.on('back', function(){
	    //如果你只是弹出一个会话界面（不显示主面板），那么可通过监听返回，跳转到上一页面，如：history.back();
	  });
	  
	  //监听自定义工具栏点击，以添加代码为例
	  layim.on('tool(code)', function(insert, send){
	    insert('[pre class=layui-code]123[/pre]'); //将内容插入到编辑器
	    send();
	  });
	  
	  //监听发送消息
	  layim.on('sendMessage', sendMessageInvoke);
//	  layim.on('sendMessage', function(data){
//	    var To = data.to;
//	    //console.log(data);
//	
//	    //演示自动回复
//	    setTimeout(function(){
//	      var obj = {};
//	      if(To.type === 'group'){
//	        obj = {
//	          username: '模拟群员'+(Math.random()*100|0)
//	          ,avatar: layui.cache.dir + 'images/face/'+ (Math.random()*72|0) + '.gif'
//	          ,id: To.id
//	          ,type: 'group'
//	          ,content: autoReplay[Math.random()*9|0]
//	        }
//	      } else {
//	        obj = {
//	          username: To.name
//	          ,avatar: To.avatar
//	          ,id: To.id
//	          ,type: To.type
//	          ,content: autoReplay[Math.random()*9|0]
//	        }
//	      }
//	      layim.getMessage(obj);
//	    }, 3000);
//	  });
	  
//	  //模拟收到一条好友消息
//	  setTimeout(function(){
//	    layim.getMessage({
//	      username: "贤心"
//	      ,avatar: "http://tp1.sinaimg.cn/1571889140/180/40030060651/1"
//	      ,id: "100001"
//	      ,type: "friend"
//	      ,cid: Math.random()*100000|0 //模拟消息id，会赋值在li的data-cid上，以便完成一些消息的操作（如撤回），可不填
//	      ,content: "嗨，欢迎体验LayIM。演示标记："+ new Date().getTime()
//	    });
//	  }, 3000);
	  
	  //监听查看更多记录
	  layim.on('chatlog', function(data, ul){
	    console.log(data);
	    layim.panel({
	      title: '与 '+ data.name +' 的聊天记录' //标题
	      ,tpl: '<div style="padding: 10px;">这里是模版，{{d.data.test}}</div>' //模版
	      ,data: { //数据
	        test: 'Hello'
	      }
	    });
	  });
	  
	  //模拟"更多"有新动态
	  layim.showNew('More', true);
	  layim.showNew('find', true);
	});
	setTimeout(initGroup, 1000);
	setTimeout(addFun, 1000);
}

function initGroup(){
//	alert("initGroup");
//	_layIm.addList({
//      type: 'group',
//      avatar: "",
//      groupname: "群test",
//      id: "100090",
//      members: 0
//  });
    var user = _token.user;
    var url = JpImConstant.baseUrl + "group/listChatGroup";
//  var _param = {userId: user.username};
    var _param = {userId: username};
    $.ajax({
        url: url,
        type: 'POST',
        data: _param,
        dataType: 'json',
        success: function (rst) {
            if (rst && rst.success) {
                console.log(rst);
                var groupList = rst.model;
                for (var i = 0; i < groupList.length; i++) {
                    var group = groupList[i];
                    _layIm.addList({
                        type: 'group',
                        avatar: group.picPath,
                        groupname: group.groupName,
                        id: group.groupCode,
                        members: 0
                    });
                }


            }else{
                console.log(rst.errorMsg);
            }
        }
    });
}

function sendMessageInvoke(data) {
    console.log("sendMessageInvoke 3");
    var To = data.to;
    var Mine = data.mine;
    var type = To.type;
    var url = JpImConstant.baseUrl + "message/sendText";
    var _param = {from: Mine.id, to: To.id, type:type, text: Mine.content};
    $.ajax({
        url: url,
        type: 'POST',
        data: _param,
        dataType: 'json',
        success: function (rst) {
        	console.log(rst);
        	console.log(JSON.stringify(rst));
            // console.log(rst);
        }
    });
}

//添加功能
function addFun(){
	
	var li ='<li style="border-top:1px solid #f2f2f2" id="label" class="addFunClass"><i class="fa fa-telegram"></i>标签</li>';
//		li +='<li id="addGroup" class="addFunClass"><i class="fa fa-plus"></i>添加群聊</li>';
		li += '<li id="addressBook" class="addFunClass"><i class="fa fa-address-book"></i>通讯录</li>';
	$('.layim-list-top').eq(0).append(li);
	$('.layim-list-top:eq(0) li:eq(1)').attr("id","newGroup");
	addFunController();
	isStatusbarHeight();
}

function addFunController(){
	var backHome = document.getElementById("back-home");
	backHome.addEventListener("tap",function(){
		var btnArray = ['确定', '取消'];
		mui.confirm('确定退出吗?', '确认', btnArray, function(e) {
			if(e.index == 0) {
				mui.back();
			}
		})
	})
	var html = "<span  id='addGroup' style='float: right;'>新增</span>";
	var newGroup = document.getElementById("newGroup");
	newGroup.addEventListener("tap",function(){
		setTimeout(function() {
			isStatusbarHeight();
			$(".layui-m-layer1:eq(1) .layui-m-layermain .layim-title p").append(html);
		}, 100)
		setTimeout(function() {
			var addGroup = document.getElementById("addGroup")
			addGroup.addEventListener("tap", function() {
				var url = 'addGroup.html';
				openNewPage(url, username);
			})
		}, 200)
	})
//	$('.layim-list-top:eq(0) li:eq(1)').click(function() {
//
//	});
	
	var label = document.getElementById("label");
	label.addEventListener("tap",function(){
		var url = 'friendTag.html';
		openNewPage(url, username);
	})
	
	var addressBook = document.getElementById("addressBook");
	addressBook.addEventListener("tap",function(){
		var url = 'address-book-second.html';
		openNewPage(url, '');
	})
}