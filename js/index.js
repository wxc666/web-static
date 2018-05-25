

/**  
 * @author {CaoGuangHui}  
 */  
$.extend($.fn.tabs.methods, {   
    /**
     * 加载iframe内容  
     * @param  {jq Object} jq     [description]  
     * @param  {Object} params    params.which:tab的标题或者index;params.iframe:iframe的相关参数  
     * @return {jq Object}        [description]  
     */  
    loadTabIframe:function(jq,params){   
        return jq.each(function(){   
            var $tab = $(this).tabs('getTab',params.which);   
            if($tab==null) return;   
  
            var $tabBody = $tab.panel('body');   
  
            //销毁已有的iframe   
            var $frame=$('iframe', $tabBody);   
            if($frame.length>0){   
                try{//跨域会拒绝访问，这里处理掉该异常   
                    $frame[0].contentWindow.document.write('');   
                    $frame[0].contentWindow.close();   
                }catch(e){   
                    //Do nothing   
                }   
                $frame.remove();   
                if($.browser.msie){   
                    CollectGarbage();   
                }   
            }   
            $tabBody.html('');
            params.iframe.message = "加载中请稍候...";
            $tabBody.css({'overflow':'hidden','position':'relative'});   
            var $mask = $('<div style="position:absolute;z-index:2;width:100%;height:100%;background:#ccc;z-index:1000;opacity:0.3;filter:alpha(opacity=30);"><div>').appendTo($tabBody);   
            var $maskMessage = $('<div class="mask-message" style="z-index:3;width:auto;height:16px;line-height:16px;position:absolute;top:50%;left:50%;margin-top:-20px;margin-left:-92px;border:2px solid #d4d4d4;color:black;padding: 12px 5px 10px 30px;background: #ffffff url(\'/easyui/themes/default/images/loading.gif\') no-repeat scroll 5px center;">' + (params.iframe.message || 'Processing, please wait ...') + '</div>').appendTo($tabBody);
            var $containterMask = $('<div style="position:absolute;width:100%;height:100%;z-index:1;background:#fff;"></div>').appendTo($tabBody);   
            var $containter = $('<div style="position:absolute;width:100%;height:100%;z-index:0;"></div>').appendTo($tabBody);   
  
            var iframe = document.createElement("iframe");   
            iframe.src = params.iframe.src;   
            iframe.frameBorder = params.iframe.frameBorder || 0;   
            iframe.height = params.iframe.height || '100%';   
            iframe.width = params.iframe.width || '100%';   
            if (iframe.attachEvent){   
                iframe.attachEvent("onload", function(){   
                    $([$mask[0],$maskMessage[0]]).fadeOut(params.iframe.delay || 'slow',function(){   
                        $(this).remove();   
                        if($(this).hasClass('mask-message')){   
                            $containterMask.fadeOut(params.iframe.delay || 'slow',function(){   
                                $(this).remove();   
                            });   
                        }   
                    });
                    $(iframe).contents().find('#swicth-style').attr('href', $('#swicth-style').attr('href'));
                });   
            } else {   
                iframe.onload = function(){   
                    $([$mask[0],$maskMessage[0]]).fadeOut(params.iframe.delay || 'slow',function(){   
                        $(this).remove();   
                        if($(this).hasClass('mask-message')){   
                            $containterMask.fadeOut(params.iframe.delay || 'slow',function(){   
                                $(this).remove();   
                            });   
                        }   
                    });

                    $(iframe).contents().find('#swicth-style').attr('href', $('#swicth-style').attr('href'));
                };   
            }   
            $containter[0].appendChild(iframe);

           //$(iframe).contents().find('#swicth-style').attr('href', "/"+$('#swicth-style').attr('href'));
        });   
    },   
    /**
     * 增加iframe模式的标签页  
     * @param {[type]} jq     [description]  
     * @param {[type]} params [description]  
     */  
    addIframeTab:function(jq,params){   
        return jq.each(function(){   
            if(params.tab.href){   
                delete params.tab.href;   
            }   
            $(this).tabs('add',params.tab);   
            $(this).tabs('loadTabIframe',{'which':params.tab.title,'iframe':params.iframe});   
        });   
    },   
    /**
     * 更新tab的iframe内容  
     * @param  {jq Object} jq     [description]  
     * @param  {Object} params [description]  
     * @return {jq Object}        [description]  
     */  
    updateIframeTab:function(jq,params){   
        return jq.each(function(){   
            params.iframe = params.iframe || {};   
            if(!params.iframe.src){   
                var $tab = $(this).tabs('getTab',params.which);   
                if($tab==null) return;   
                var $tabBody = $tab.panel('body');   
                var $iframe = $tabBody.find('iframe');   
                if($iframe.length===0) return;   
                $.extend(params.iframe,{'src':$iframe.attr('src')});   
            }   
            $(this).tabs('loadTabIframe',params);   
        });   
    }   
});



function addTab(title, url){
	if ($('#tabs').tabs('exists', title)){
		$('#tabs').tabs('select', title);//选中并刷新

		var currTab = $('#tabs').tabs('getSelected');
		//var url = $(currTab.panel('options').content).attr('src');
		//if(url != undefined && currTab.panel('options').title != 'Home') {
			//alert(123);
			//$('#tabs').tabs('update',{
			//	tab:currTab,
			//	options:{
			//		content:createFrame(url)
			//	}
			//})
			if(currTab.title != 'Home'){
				$('#tabs').tabs('loadTabIframe',{      
					'which': title,      
					'iframe':{'src':url}      
				});
			}

		//}
	} else {

		$('#tabs').tabs('addIframeTab',{      
			tab:{title:title,closable:true},      
			iframe:{src:url}      
		});

		//var content = createFrame(url);
		//$('#tabs').tabs('add',{
		//	title:title,
		//	content:content,
		//	closable:true
		//});
	}
	tabClose();
}
function createFrame(url) {
	var s = '<iframe scrolling="auto" frameborder="0"  src="'+url+'" style="width:100%;height:100%;"></iframe>';
	return s;
}
		
function tabClose() {
	/*双击关闭TAB选项卡*/
	$(".tabs-inner").dblclick(function(){
		var subtitle = $(this).children(".tabs-closable").text();
		$('#tabs').tabs('close',subtitle);
	})
	/*为选项卡绑定右键*/
	$(".tabs-inner").bind('contextmenu',function(e){
		$('#mm').menu('show', {
			left: e.pageX,
			top: e.pageY
		});

		var subtitle =$(this).children(".tabs-closable").text();

		$('#mm').data("currtab",subtitle);
		$('#tabs').tabs('select',subtitle);
		return false;
	});
}		
//绑定右键菜单事件
function tabCloseEven() {
	//刷新
	$('#mm-tabupdate').click(function(){
		var currTab = $('#tabs').tabs('getSelected');
		var tabTitle = currTab.panel('options').title;

		if(tabTitle != 'Home'){
			$('#tabs').tabs('loadTabIframe',{      
				'which': tabTitle,      
				'iframe':{'src':currTab.panel('body').find('iframe').attr('src')}      
			});
		}



		/*
		var url = $(currTab.panel('options').content).attr('src');
		if(url != undefined && currTab.panel('options').title != 'Home') {
			$('#tabs').tabs('update',{
				tab:currTab,
				options:{
					content:createFrame(url)
				}
			})
		}
		*/
       // alert(currTab.title);

		                //var $tab = $(this).tabs('getTab',params.which);  
						
						                //if($tab==null) return;   
                //var $tabBody = $('#tabs').tabs('getSelected').panel('body').find('iframe').attr('src');   
                //var $iframe = $tabBody.find('iframe');   



	})
	//关闭当前
	$('#mm-tabclose').click(function(){
		var currtab_title = $('#mm').data("currtab");
		$('#tabs').tabs('close',currtab_title);
	})
	//全部关闭
	$('#mm-tabcloseall').click(function(){
		$('.tabs-inner span').each(function(i,n){
			var t = $(n).text();
			if(t != 'Home') {
				$('#tabs').tabs('close',t);
			}
		});
	});
	//关闭除当前之外的TAB
	$('#mm-tabcloseother').click(function(){
		var prevall = $('.tabs-selected').prevAll();
		var nextall = $('.tabs-selected').nextAll();		
		if(prevall.length>0){
			prevall.each(function(i,n){
				var t=$('a:eq(0) span',$(n)).text();
				if(t != 'Home') {
					$('#tabs').tabs('close',t);
				}
			});
		}
		if(nextall.length>0) {
			nextall.each(function(i,n){
				var t=$('a:eq(0) span',$(n)).text();
				if(t != 'Home') {
					$('#tabs').tabs('close',t);
				}
			});
		}
		return false;
	});
	//关闭当前右侧的TAB
	$('#mm-tabcloseright').click(function(){
		var nextall = $('.tabs-selected').nextAll();
		if(nextall.length==0){
			//msgShow('系统提示','后边没有啦~~','error');
			alert('后边没有啦~~');
			return false;
		}
		nextall.each(function(i,n){
			var t=$('a:eq(0) span',$(n)).text();
			$('#tabs').tabs('close',t);
		});
		return false;
	});
	//关闭当前左侧的TAB
	$('#mm-tabcloseleft').click(function(){
		var prevall = $('.tabs-selected').prevAll();
		if(prevall.length==0){
			alert('到头了，前边没有啦~~');
			return false;
		}
		prevall.each(function(i,n){
			var t=$('a:eq(0) span',$(n)).text();
			$('#tabs').tabs('close',t);
		});
		return false;
	});

	//退出
	$("#mm-exit").click(function(){
		$('#mm').menu('hide');
	})
}

var themes = {
	'gray' : '/easyui/themes/gray/easyui.css',
	'black' : '/easyui/themes/black/easyui.css',
	'bootstrap' : '/easyui/themes/bootstrap/easyui.css',
	'default' : '/easyui/themes/default/easyui.css',
	'material': '/easyui/themes/material/easyui.css',
	'metro' : '/easyui/themes/metro/easyui.css'
/*	'ui-cupertino' : '/easyui/themes/ui-cupertino/easyui.css',
	'ui-dark-hive' : '/easyui/themes/ui-dark-hive/easyui.css',
	'ui-pepper-grinder' : '/easyui/themes/ui-pepper-grinder/easyui.css',
	'ui-sunny' : '/easyui/themes/ui-sunny/easyui.css',
	'metro-blue' : '/easyui/themes/metro-blue/easyui.css',
	'metro-gray' : '/easyui/themes/metro-gray/easyui.css',
	'metro-green' : '/easyui/themes/metro-green/easyui.css',
	'metro-orange' : '/easyui/themes/metro-orange/easyui.css',
	'metro-red' : '/easyui/themes/metro-red/easyui.css'*/
};
$(function() {

	//getMenu();
	tabCloseEven();
	$('.cs-navi-tab').click(function() {
		var $this = $(this);
		var href = $this.attr('src');
		var title = $this.text();
        $('.cs-navi-tab').css("background-color","");
        $('.cs-navi-tab').removeClass("cs-navi-tab-selected");
        $this.css("background-color",$(".accordion-header-selected").css("background-color"));
        $this.addClass("cs-navi-tab-selected");
		
		if($('#tabs').tabs('exists', title)){
		 $('#tabs').tabs('select', title);  
		}else{
			addTab(title, href);
		}
	});

/*	var themes = {
		'gray' : default_domain+'/easyui/themes/gray/easyui.css',
		'black' : default_domain+'/easyui/themes/black/easyui.css',
		'bootstrap' : default_domain+'/easyui/themes/bootstrap/easyui.css',
		'default' : default_domain+'/easyui/themes/default/easyui.css',
		'material': default_domain+'/easyui/themes/material/easyui.css',
		'metro' : default_domain+'/easyui/themes/metro/easyui.css'
	};*/



/*	var skins = $('.li-skinitem span').click(function() {
		var $this = $(this);
		if($this.hasClass('cs-skin-on')) return;
		skins.removeClass('cs-skin-on');
		$this.addClass('cs-skin-on');
		var skin = $this.attr('rel');
		$('#swicth-style').attr('href', themes[skin]);
		//alert(themes[skin]);
        setSubWindowThemes(themes[skin]);
        $('.cs-navi-tab-selected').css("background-color",$(".accordion-header-selected").css("background-color"));
		setCookie('cs-skin', skin);
		skin == 'dark-hive' ? $('.cs-north-logo').css('color', '#FFFFFF') : $('.cs-north-logo').css('color', '#000000');
	});*/

	if($.cookie('cs-skin')) {
		var skin = $.cookie('cs-skin');
		$('#swicth-style').attr('href', themes[skin]);
		$this = $('.li-skinitem span[rel='+skin+']');
		$this.addClass('cs-skin-on');
		$('#skin-nav').combobox('setValue',skin);
	}else{
		changeSkin();
	}

    $.extend($.fn.validatebox.defaults.rules, {
        confirmPass: {
            validator: function(value, param){
                var pass = $(param[0]).passwordbox('getValue');
                return value == pass;
            },
            message: '新密码确认不一致'
        },
        notEq: {
            validator: function(value, param){
                var pass = $(param[0]).passwordbox('getValue');
                return value != pass;
            },
            message: '新密码与旧密码不能一样'
        },
		maxLength: {     
			validator: function(value, param){     
				return param[0] >= value.length;     
			},     
			message: '输入长度超过{0}位字符'    
		}    
    })



});
//设置主题颜色
function changeSkin(){
	var skin = $('#skin-nav').combobox('getValue');
	$('#swicth-style').attr('href', themes[skin]);
	//alert(themes[skin]);
    setSubWindowThemes(themes[skin]);
    $('.cs-navi-tab-selected').css("background-color",$(".accordion-header-selected").css("background-color"));
	$.cookie('cs-skin',skin,{expires:30, path:'/'})
}

//设置子iframe窗体颜色
function setSubWindowThemes(href){
    var $iframe = $('iframe');
    if($iframe.length > 0) {
        for(var i = 0; i < $iframe.length; i++) {
            var ifr = $iframe[i];
            $(ifr).contents().find('#swicth-style').attr('href', href);
        }
    }
}
function getMenu(){
  	   $.ajax({ 
		  //headers:headers,
          type:"GET", 
          async: false,
          url:"menuList.json", 
          contentType:"application/json;charset=utf-8",          
          //data:JSON.stringify(param),
          dataType:'json', 
          //dataType:'jsonp', 
          success:function(data){ 
          	//alert(data);
			//alert(data.menuList.length);
			initMenus(data.menuList);
          },
          error:function(data) { 
            alert(data.menuList);
          } 
      }); 

  	   //				<div title="Base">
		//			<a href="javascript:void(0);" src="demo/easyloader/basic.html" class="cs-navi-tab">easyloader</a></p>
}
function initMenus(menuList){
	if(menuList != undefined && menuList!=null && menuList.length >0){
           $.each(menuList, function (n, menu) {
			    var _div = "<div title='"+menu.name+"'>";
			    if(menu.nodes != null){
			    	$.each(menu.nodes, function (n2, subMenu) {
						_div += "<p><a href='javascript:void(0);' src='"+subMenu.url+"' class='cs-navi-tab'>"+subMenu.name+"</a></p>";
			    	})
			    }
			    _div += "</div>";
			    $(".easyui-accordion").append(_div);
           });
	}
}

function logout(){
	$.messager.confirm({
	    width: 200, 
	    title: '提示',
	    msg: '确认退出吗?',
	    ok: "是",
	    cancel: "否",
	    fn: function (r) {
			if (r){
				$.ajax({
	                type:'get',
	               // contentType: "application/json; charset=utf-8",  //直接发送json对象
	                url:"/user/logout",
	                dataType:'json',
	                success:function(data){
	                    if(data.code!=0){
	                        $.messager.alert('提示', data.msg, 'error');
	                    }
	                },
	                error:function(e) {
	                    $.messager.alert('提示', '更新数据异常', 'error');

	                },
	                complete:function () {
	                    $.messager.progress('close');
	                    $.cookie("token",null,{expires:-1,path:'/'})
						window.location.href = "/login";
	                }
	            });
			}
	    }
	});
}

function changePwd(){
	if($('#changePwdForm').form('validate')){
		var param = {
	        "oldPwd":$("#oldPwd").passwordbox("getValue"),
	        "newPwd":$("#newPwd").passwordbox("getValue")
    	};

		var encryptParam = {
	        "param":AESEncrypt(param)
    	};

		//alert(JSON.stringify(encryptParam));
		//alert(AESEncrypt(JSON.stringify(param)));

		//alert(AESDecrypt(AESEncrypt(JSON.stringify(param))));
		
            $.messager.progress();
            $.ajax({
                type:'POST',
               // contentType: "application/json; charset=utf-8",  //直接发送json对象
                url:"/user/change_pwd",
                data:encryptParam,
                cache:false,
                dataType:'json',
                success:function(data){
                    if(data.code!=0){
                        $.messager.alert('提示', data.msg, 'error');
                    }else{
				    	$.cookie("token",null,{expires:-1,path:'/'})
						window.location.href = "/login";
                    }
                },
                error:function(e) {
                    $.messager.alert('提示', '保存失败', 'error');

                },
                complete:function () {
                    $.messager.progress('close');
                }
            });
	}
}
