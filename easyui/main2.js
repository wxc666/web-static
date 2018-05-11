

$(function() {

	getMenu();


});



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