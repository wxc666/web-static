
$(function() {
	refreshCode();

    var str=$.cookie("rmbUserInfo");
    if(str!=undefined && str.length>0){
       var rmbUserInfo = JSON.parse(AESDecrypt(str));
       $("#userName").textbox("setValue",rmbUserInfo.userName);
       $("#password").passwordbox("setValue",rmbUserInfo.password);
       $("#rmbUser").attr("checked", true);
    }else{
        $("#rmbUser").attr("checked", false);  
    }

    //回车事件
	$('#checkCode').textbox('textbox').keydown(function (e) {
        if(e.keyCode == 13) {
           login();
        }
    });	
    rollingWin();
});


function refreshCode(img){
	var now = new Date().getTime();
	$("input[name='checkId']").val(now);
	$("#checkCodeImg").attr("src","/check_code?checkId="+now);
}
function login(){
	var userName = $("#userName").textbox("getValue"); //$("#login_form").find("input[name='userName']").val();
    var password = $("#password").passwordbox("getValue"); //$("#login_form").find("input[name='password']").val();
    var checkCode = $("#login_form").find("input[name='checkCode']").val();
    if(userName.length == 0){
    	$("#errMsgBar").show();
    	$("#errMsgBar").html("请输入用户名");
    	return;
    }
    if(userName.length > 30){
    	$("#errMsgBar").show();
    	$("#errMsgBar").html("用户名长度超过限制");
    	return;
    }  

    if(password.length == 0){
    	$("#errMsgBar").show();
    	$("#errMsgBar").html("请输入密码");
    	return;
    }
    if(password.length > 30){
    	$("#errMsgBar").show();
    	$("#errMsgBar").html("密码长度超过限制");
    	return;
    }  

    if(checkCode.length != 6){
    	$("#errMsgBar").show();
    	$("#errMsgBar").html("请输入6位长度验证码");
    	return;
    }    
    var param = {
        "userName":userName,
        "password":password,
		"checkCode":checkCode,
		"checkId":$("input[name='checkId']").val()
    };

	remenberMe();
    ///alert(JSON.stringify(param));

    $("#loginBtn").linkbutton('disable');
    $.ajax({
       // headers: {
        //    app: 'PLATFORM',
        //    platform: 'PC',
        //    imei: ''
       // },
        type:"post",
        url:"/user/login",
        //contentType:"application/json;charset=utf-8",
        data:{param:AESEncrypt(param)},
        dataType:'json',
        success:function(ret){
        	if(ret.code == 0){ //成功
        	   $.cookie('token',ret.data,{expires:30, path:'/'})
               window.location.href = "/main";
			}else{
              //alert(ret.msg);
                $("#errMsgBar").show();
    	  		$("#errMsgBar").html(ret.msg);
			}
        },
        error:function(ret) {
            alert(JSON.stringify(ret));
        },
        complete:function () {
            $("#loginBtn").linkbutton('enable');
        }
    });


}

function remenberMe(){
 if ($("#rmbUser").attr("checked") == "checked") {  
        var rmbUserInfo={
                userName:$("#userName").textbox("getValue"),
                password:$("#password").passwordbox("getValue")
            }
        $.cookie("rmbUserInfo", AESEncrypt(rmbUserInfo), {expires:7, path:'/'}); // 存储一个带7天期限的 cookie  
    } else {  
        $.cookie("rmbUserInfo", "", {expires:-1, path:'/'});
    } 
}

$(window).resize(function() {
    resetPanelPos();
});

function resetPanelPos(){
     var winW=$(window).width();
     var winH=$(window).height();
     var panelW=$("#loginWindow").width();
     var panelH=$("#loginWindow").height();
     var newW = winW/2-panelW/2;
     var newH = winH/2-panelH/2;
     $("#loginWindow").css("left",newW);
     $("#loginWindow").css("top",newH);
}

function rollingWin(){
     var winW=$(window).width();
     var winH=$(window).height();
     var panelW=$("#loginWindow").width();
     var panelH=$("#loginWindow").height();
     var newW = winW/2-panelW/2;
     var newH = winH/2-panelH/2;
     $("#loginWindow").css("left",newW);
     $("#loginWindow").animate({
        top:newH
      });
}