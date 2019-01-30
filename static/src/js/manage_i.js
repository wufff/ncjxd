require(["layui","path","page","upLoad","api","viewPhoto","boot-dropdown"], function(layui, path,pages,upLoad,api,view) {
    var layer = layui.layer;
    var form = layui.form;
    var $ = jQuery = layui.jquery; 
    var page;
    var editeId;
    var Upvalue = [];
    var loading;
    initPage (1);
    var upLoad = upLoad.imgMost('upbtn',8);
    view.viewimg("#body");
    
    






   $("#add").click(function() {
      initContorl (null);
      layer.open({
        type: 1,
        title:"上传新图片",
        content: $('#controlImg'),
        area:["650px","550px"],
        btn:["确认","取消"],
        yes: function(index, layero){
          if( $(".img_path").length < 1) {
              layer.close(index);
              return;
          }
           loading = layer.load(5);
           var valueArry = [];
           $(".img_path").each(function(index, el) {
                valueArry.push($(el).val());
           });
          
          var obj = {cover_img:valueArry.join(","),title:"",type:2}
          var url = path.api + "/api/addManageRecommend";
          api.ajaxGet(url,obj,function(res){
                if(res.type == "success"){
                    layer.msg("添加成功",{time:800});
                    layer.close(index);
                    layer.close(loading);
                    initPage (1);
                }
          })
        }
      });
    })
    



 $("#imglist").on("click",".del_upImg",function(){
      var id = $(this).parents(".img_item").attr("id");
      var file  =  upLoad.getFile(id);
      upLoad.removeFile(file)
     $(this).parents(".img_item").remove();
 })









  $("body").on("click",".del",function(){
     var id = $(this).attr("id");
     layer.confirm('确定删除此图片吗?', {icon: 3, title:'提示'}, 
        function(index){
         var url = path.api+'/api/delManageRecommendData';
         var obj = {};
         obj.id = id;
         obj.type = 2;
         api.ajaxGet(url,obj,function(res){
             if(res.type == "success") {
                 layer.msg("删除成功！",{time:1200});
                 layer.close(index);
                 refrechData();
             }
            
         })
      });
   })
    








  




  function initContorl (data){
    if(data){
    form.val("control",data)
    }else {
      upLoad.splice(0,99);
      $("#imglist").html(" ");
      form.val("control", 
      {
        "title": "" 
        ,"url": ""
        ,"sort": ""
        ,"cover_img":""
      })
    }
  }


  function refrechData() {
    var current = $("#pageNum").find(".current").text();
    if (current && current > 1) {
      initPage(current);
    } else {
      initPage(1);
    }
  }







 function initPage (goPage){
      var url = path.api+"/api/getManageRecommendList";
      var getData = "type=2&page=1&page_count=8&v="+ new Date().getTime() ;
      pages.getAjax(url,getData,function(data){
         if( data.type == "success"){
             var total = data.data.data.total;
             page =  new pages.jsPage(total, "pageNum","8",url,getData,buildTable,goPage,null);
             pages.pageMethod.call(page); 
           }else{
            $("#tbody").html('<tr><td colspan="7">暂无数据~！</td></td>');
            $(".tableLoading").html('');
             return
         }
      })
     

    function buildTable(list) {
    if (list.type == "success") {
      var data = list.data.data.list.map(function(item) {
        return {
          img:item.r_cover_img,
          url: item.r_goto_url,
          time: item.r_createtime,
          encrypt_id: item.r_encrypt_id
        }
      })
     
  
      var html = '';
      for (var i = 0; i < data.length; i++) {
        html +=  '<div class="layui-col-md3">'
        html +=  '<div class="inner">'
        html +=  '<a href="'+ data[i].img +'"><img src="'+ data[i].img +'"></a>'
        html +=     '</div>'
        html +=   '<p class="title_main">上传时间：'+data[i].time  
        html +=   '</p>'
        html +=   '<a class="del" id="'+ data[i].encrypt_id +'">删除照片</a>'
        html +=   '</div>'
      }
      $(".tableLoading").html('');
      $(".layui-row").html(html);
 
    }
    if(list.type == "error" ) {
        var mun = goPage - 1;
        pages.gotopage.call(page,mun,false);
    }
  }
 }
})




