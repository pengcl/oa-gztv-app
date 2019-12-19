var homePage;
// mui初始化
mui.init({
});
var token;
//创建子页面，首个选项卡页面显示，其它均隐藏；
mui.plusReady(function() {
	console.log('content');
	token = plus.storage.getItem("token");
	mainCourse();
	//获取轮播图片公告
	//获取评论内容
//	getNoticeComment();

});

function mainCourse(){
	console.log('dto');
	var url = topUrl + 'noticeInfo/dto';
	var id = plus.webview.currentWebview().id;
	var mainCarousel=document.getElementById("mainCarousel");
	mui.ajax(url, {
		data: {
			token:token,
			id: id,
		},
		success: function(data) {
			var rsc = data.noticePictureVoList;
			var imgBaseUrl = topUrl + 'SysAttachment!download.action?fileNo=';
			var firstImgUrl = topUrl + 'SysAttachment!download.action?fileNo=' + rsc[0].attachId;
			var recLength=rsc.length-1;
			var laseImgUrl = topUrl + 'SysAttachment!download.action?fileNo=' + rsc[recLength].attachId;
			var html = '<div class="mui-slider-item mui-slider-item-duplicate">';
			html += '<a href="#"><img style="height:13rem;" src="' + laseImgUrl + '" /></a><p class="carousePClass">'+rsc[recLength].pictureWord+'</p></div>';
			for(var i=0;i<rsc.length;i++){
				var imgUrl = imgBaseUrl + rsc[i].attachId;
			    var activeHtml='<div class="mui-slider-item"><a href="#"><img style="height:13rem;" src="'+imgUrl+'"/></a><p class="carousePClass">'+rsc[i].pictureWord+'</p></div>';
			    html+=activeHtml;
			}
			html+='<div class="mui-slider-item mui-slider-item-duplicate"><a href="#"><img style="height:13rem;" src="'+firstImgUrl+'" /></a><p class="carousePClass">'+rsc[0].pictureWord+'</p></div>';
			mainCarousel.innerHTML=html;
			var gallery = mui('.mui-slider');
			gallery.slider({
				interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
			});
			//获取点赞信息
			noticePraise(id);
		},
	});
}


//获取点赞信息
var isNoticePraise = false;
function noticePraise(noticeInfoId) {
	var url = topUrl + 'noticePraise/noticePraise'
	var noticePraise = document.getElementById("noticePraise");
	var userId = plus.storage.getItem("sysUsersId");
	var praise = document.getElementById("praise");
	var noticeId = plus.webview.currentWebview().id;
	mui.ajax(url, {
		data: {
			token:token,
			noticeInfoId: noticeInfoId,
		},
		dataType: 'json', //服务器返回json格式数据
		async: true,
		success: function(data) {
			console.log(JSON.stringify(data));
			for(var i = 0; i < data.length; i++) {
				if(userId == data[i].userId) {
					praise.innerHTML = '<p noticeId="'+noticeId+'" id="noticePraise" style="color:red" class="praiseClass">点赞<span id="partakeQuantity">' + data.length + '</span></p>'
					isNoticePraise = true;
					return false;
				}
			}
			praise.innerHTML = '<p noticeId="'+noticeId+'" id="noticePraise" style="color:"#06c"" class="praiseClass">点赞<span id="partakeQuantity">' + data.length + '</span></p>'
			isNoticePraise = false;
		},
	});
}



function getNoticeTest(){
	var noticeInfoId = plus.webview.currentWebview().id;
	var noticeInfo = document.getElementById("noticeInfo");
    var url = topUrl + 'noticeInfo/get';
    var path = topUrl+'SysAttachment!download.action?fileNo=';
    mui.ajax(url, {
		dataType: 'json', //服务器返回json格式数据
		data: {
			token:token,
			id: noticeInfoId,
		},
		success: function(data) {
			var html = '<div style="text-align: center;">'+data.text+'</div>';
			html+='<p noticeId='+noticeInfoId+' id="noticePraise"  class="noticePraise" style="text-align: center;font-size:1.4em;margin-top: 20px;margin-bottom:10px">点赞</p>';
			html+='<p><span style="text-align: left;margin-left: 0.4em;">评论</span>';
			html+='<span style="float: right;margin-right: 0.4em;">'+data.commentQuantity+'条评论/'+data.partakeQuantity+'人参与</span></p>';
			noticeInfo.innerHTML=html;
			noticePraise(noticeInfoId);
		},
	});
}


// 标题栏返回键监听
var back = document.getElementById("toBack");
back.addEventListener('tap', function(event){
	mui.back();
});
var noticeInfo = document.getElementById("noticeInfo");
//点赞
mui("#praise").on('tap', '.praiseClass', function() {
	var partakeQuantity = document.getElementById("partakeQuantity");
	var partakeQuantityeLength=partakeQuantity.innerText;
	var noticeId = plus.webview.currentWebview().id;
	var userId = plus.storage.getItem("sysUsersId");
	var noticeInfoId = this.getAttribute("noticeId");
	var url = topUrl + 'noticePraise/favor'
	var dataTitle = "点赞成功";
	if(isNoticePraise) {
		url = topUrl + 'noticePraise/unFavor';
		dataTitle = "取消点赞成功";
	}
	var noticePraise = document.getElementById("noticePraise");
	mui.ajax(url, {
		data: {
			token:token,
				noticeInfoId:noticeInfoId,
			},
			type: 'post', //HTTP请求类型
		success: function(_rst) {
				alert(dataTitle);
				var url = topUrl + 'noticePraise/noticePraise'
				var noticePraise = document.getElementById("noticePraise");
				mui.ajax(url, {
					data: {
						noticeInfoId: noticeInfoId,
					},
					dataType: 'json', //服务器返回json格式数据
					async: true,
					success: function(data) {
						for(var i = 0; i < data.length; i++) {
							if(userId == data[i].userId) {
								noticePraise.style.color = "red";
								partakeQuantity.innerHTML=parseInt(partakeQuantityeLength)+1;
								isNoticePraise = true;
								return false;
							}
						}
						noticePraise.style.color = "darkblue";
						partakeQuantity.innerHTML = parseInt(partakeQuantityeLength)-1;
						isNoticePraise = false;
					},
				});
		}
	});
})

var saveFun = document.getElementById("saveFun");
saveFun.addEventListener("tap", function() {
	var noticeInfoId = plus.webview.currentWebview().id;
	var content = document.getElementById("content").value;
	var url = topUrl + 'noticeComment/create'
	mui.ajax(url, {
		data: {
			token:token,
				noticeInfoId: noticeInfoId,
				content:content,
			},
			type: 'post', //HTTP请求类型
		success: function(data) {
			if(data.success){
				alert("回复成功");
				getNoticeComment();
			}else{
				alert(data.errorMsg);
			}
		},
	});
});

function getNoticeComment(){
	var url = topUrl + 'noticeComment/byNoticeInfoId';
	var noticeInfoId = plus.webview.currentWebview().id;
	mui.ajax(url, {
		data: {
			token:token,
			noticeInfoId: noticeInfoId,
		},
		success: function(data) {
			htmlNoticeComment(data);
			////查询我的点赞内容
			myFavorNoticeComment();
		},
	});
}

function htmlNoticeComment(data) {
	var contentList = document.getElementById('contentList');
	var dataHtml='';
	for(var i = 0; i < data.length; i++) {
		if(data[i].pid == -1) {
			var html = '<div class="noticeComment" id="'+data[i].id+'"><p style="margin-left: 5px;color:"black">'+data[i].userName+ '</p>';
			html += '<p style="margin-left: 5px;">'+data[i].content+'</p>';
			html += '<p style="margin-left: 5px;"><div><span>'+data[i].commentTime+'</span>';
			html += '<span id="'+data[i].id+'" class="noticeUpCell">点赞'+data[i].upQuantity+'</span>';
			html += '<span id="'+data[i].id+'" class="replyCell" style="float: right;color: #06c;">回复/</span>';
			html += '<div id="'+data[i].id+'" class="replyClass"><textarea id="'+data[i].id+'" class="replyTextarea"></textarea>';
			html += '<div style="border: 1px solid #c4c4c4;">';
			html += '<button id="'+data[i].id+'" type="button"  style="float: right;" class="mui-btn mui-btn-danger replyChildren">发表评论</button>';
			html += '<div style="clear: both;"></div></div></div></div></div>';
			dataHtml=dataHtml+html;
		}
		contentList.innerHTML=dataHtml;
	}
	//查看子回复
	getNoticeCommentChild(data);
}

//查看子回复
function getNoticeCommentChild(data){
	for(var i=0;i<data.length;i++){
		$('.noticeComment').each(function() {
			var id = $(this).attr('id');
			if(id == data[i].pid) {
				console.log($(this).attr('id'));
				var self = $(this);
				var html='<div style="margin-left: 1.3rem;color:"black""><p>'+data[i].userName+'</p>';
					html+='<p style="margin-left: 5px;">'+data[i].content+'</p>';
					html+='<p>'+data[i].commentTime+'</p></div>';
				self.append(html);
			}
		})
	}
}

//点击通知公告详情页面
mui("#contentList").on('tap', '.noticeUpCell', function() {
	var commentId = this.getAttribute("id");
	var noticeClassName;
	$(".noticeUpCell").each(function() {
		if(commentId == $(this).attr("id")) {
			noticeClassName = $(this).attr('class');
		}
	});
	if("noticeUpCell active" == noticeClassName) {
		var url = topUrl + 'noticeUp/unFavor';
			mui.ajax(url, {
				data: {
					token:token,
					commentId: commentId,
				},
				type:'post',
				success: function(data) {
					if(data.success) {
						alert("取消点赞成功");
						getNoticeComment();
					}
				},
			});
	}else{
		var url = topUrl + 'noticeUp/favor';
		mui.ajax(url, {
			data: {
				token:token,
				commentId: commentId,
			},
			type: 'post',
			success: function(data) {
				if(data.success) {
					alert("点赞成功");
					getNoticeComment();
				}
			},
		});
	}
})

////查询我的点赞内容
function myFavorNoticeComment(){
	var noticeInfoId = plus.webview.currentWebview().id;
	var url = topUrl + 'noticeUp/myFavorNoticeComment'
	mui.ajax(url, {
		data: {
			token:token,
			noticeInfoId: noticeInfoId,
		},
		success: function(data) {
			for(var i = 0; i < data.length; i++) {
				$(".noticeUpCell").each(function() {
					var id = $(this).attr("id");
					if(id == data[i].commentId) {
                        $(this).addClass("active");
					}
				});
			}
		},
	});
};
	
//子回复
mui("#contentList").on('tap', '.replyCell', function() {
	var commentId = this.getAttribute("id");
	var noticeInfoId = plus.webview.currentWebview().id;
	$(".replyClass").each(function() {
		if(commentId == $(this).attr("id")) {
			$(this).toggle();
		}
	});
})

//子回复回复
mui("#contentList").on('tap', '.replyChildren', function() {
	var pid = this.getAttribute("id");
	var noticeInfoId = plus.webview.currentWebview().id;
	var content;
	$(".replyTextarea").each(function() {
		if(pid == $(this).attr("id")) {
			content=$(this).val()
		}
	});
	var url = topUrl + 'noticeComment/create'
	mui.ajax(url, {
		data: {
			token:token,
			pid: pid,
			noticeInfoId:noticeInfoId,
			content:content
		},
		type:'post',
		success: function(data) {
			if(data.success){
				alert('回复成功');
				getNoticeComment();
			}else{
				alert(data.errorMsg);
			}
		},
	});
})

