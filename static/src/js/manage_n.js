require(["layui", "path","tools","page"], function(layui, path,tools,pages) {
		    var layer = layui.layer;
		    var element = layui.element;
		    var $ = jQuery = layui.jquery; 
            var page_1;
            var page_2;
            var page_3;
            
        
        initPage (1,1);
        setTimeout(function(){
        	initPage (2,1);
        },200)  
        setTimeout(function(){
        	initPage (3,1);
        },400) 


		$("body").on("click",".del",function(){
		   	    var _this = this;
		        layer.confirm('确定删除此条公告吗?', {icon: 3, title:'提示'}, function(index){
		        var type =  $(_this).parents("tr").data("tpye");
		        var notice_id = $(_this).parents("tr").data("id");
		        var url = path.api + '/api/delManageNoticeData';
                var current = $("#pageNum_"+type).find(".current").text();
                // console.log(current);
		        $.get(url,{notice_id:notice_id},function(res){
		        	if(res.data.code == 1000){
		        		initPage (type,current);
		        	}
		        })
		        layer.close(index);
		      });

		  })








       
     

     





 function initPage (tpye,goPage){
      var url = path.api + '/api/getManageNoticeList';
      var getData = "type="+tpye+"&page=1&page_count=3";
      pages.getAjax(url,getData,function(data){
      	 if( data.data.code == 1000){
           	 var total = data.data.data.total;
           	 switch(tpye)
				{
				case 1:
				  page_1 =  new pages.jsPage(total, "pageNum_"+tpye,"3",url,getData,buildTable,goPage,null);
                   pages.pageMethod.call(page_1); 
				  break;
				case 2:
				  page_2 =  new pages.jsPage(total, "pageNum_"+tpye,"3",url,getData,buildTable,goPage,null);
                   pages.pageMethod.call(page_2); 
				  break;
				 case 3:
				  page_3 =  new pages.jsPage(total, "pageNum_"+tpye,"3",url,getData,buildTable,goPage,null);
                   pages.pageMethod.call(page_3); 
				  break;
				default:
				  return
			  }   
           }else{
           	 $("#Tab_"+tpye).html('<tr><td colspan="4">暂无数据~！</td></td>');
         }
      })
     
    function buildTable(list) {
		if (list.data.code == 1000) {
			var data = list.data.data.list.map(function(item) {
				return {
					title: item.n_title,
					id: item.n_id,
					time: tools.fomartTime(item.n_datetime),
					type: tpye,
					encrypt_id: item.n_encrypt_id
				}
			})
			var html = '';
			for (var i = 0; i < data.length; i++) {
				html += '<tr data-tpye="' + data[i].type + '" data-id="' + data[i].encrypt_id + '">'
				html += '<td>' + data[i].id + '</td>'
				html += '<td>' + data[i].title + '</td>'
				html += '<td>' + data[i].time + '</td>'
				html += '<td><a class="change">修改</a><a class="del">删除</a></td>'
				html += ' </tr>'

			}

			$("#Tab_"+tpye).html(html);

		}
		if(list.data.code == 1003) {
			 var mun = goPage - 1;
			switch(tpye)
				{
				case 1:
				   pages.gotopage.call(page_1,mun,false);
				  break;
				case 2:
				 pages.gotopage.call(page_2,mun,false);
				  break;
				 case 3:
				   pages.gotopage.call(page_3,mun,false);
				  break;
				default:
				  return
		     }
		}

	}


 }



    



                
  
      


   
	// function buildTable(list) {
	// 	if (list.data.code == 1000) {
	// 		var data = list.data.data.list.map(function(item) {
	// 			return {
	// 				title: item.n_title,
	// 				id: item.n_id,
	// 				time: tools.fomartTime(item.n_datetime),
	// 				type: 1,
	// 				encrypt_id: item.n_encrypt_id
	// 			}
	// 		})
	// 		var html = '';
	// 		for (var i = 0; i < data.length; i++) {
	// 			html += '<tr data-tpye="' + data[i].type + '" data-id="' + data[i].encrypt_id + '">'
	// 			html += '<td>' + data[i].id + '</td>'
	// 			html += '<td>' + data[i].title + '</td>'
	// 			html += '<td>' + data[i].time + '</td>'
	// 			html += '<td><a class="change">修改</a><a class="del">删除</a></td>'
	// 			html += ' </tr>'

	// 		}

	// 		$("#Tab_1").html(html);

	// 	}
	// 	if(list.data.code == 1003) {
	// 		pages.gotopage.call(TabPage_1,4,false)
	// 	}

	// }
})