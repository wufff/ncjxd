require(["layui", "path","page","upLoad"], function(layui, path,pages,upLoad) {
    var layer = layui.layer;
    var form = layui.form;
    var $ = jQuery = layui.jquery; 
    var page;
    var editeId;
    var Upvalue = [];
    console.log("已进入");
    var upLoad = upLoad.imgMost('upbtn');
    // initPage (1);
    
    






   $("#add").click(function() {
      upLoad.splice(0,99);
      $("#imglist").html(" ");
      document.getElementById('img_file_path').value = "";
      layer.open({
        type: 1,
        title:"上传新图片",
        content: $('#controlImg'),
        area:["650px","500px"],
        btn:["确认","取消"],
        yes: function(index, layero){
          var value = $("#img_file_path").val();
          var arry = value.split(',');
          console.log(arry.length);
          if(arry.length > 8){
            var getData = [];
            for(var i = 0;i<8;i++){
              var temp = {
                  r_cover_img:arry[i]
              }
              getData.push(temp);
            }
            console.log(getData);
          }
          if(arry.length == 1){
               alert("没传东西");
          } 
          if( arry.length < 9){
          var getData = [];
            for(var i = 0;i<arry.length-1;i++){
              var temp = {
                  r_cover_img:arry[i]
              }
              getData.push(temp);
            }
           console.log(getData);
          }
        }
      });
    })
    



  $("body").on("click",".del",function(){
     var id = $(this).attr("id");
     layer.confirm('确定删除此条推荐吗?', {icon: 3, title:'提示'}, 
        function(index){
         var url = path.api+'/api/delManageRecommendData';
         var obj = {};
         obj.id = id;
         obj.type = 2;
         $.get(url,obj,function(res){
             if(res.data.code == 1000) {
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
    if (current) {
      initPage(current);
    } else {
      initPage(1);
    }
  }




 initPage (1);


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
        html +=  '<img src="'+ data[i].img +'">'
        html +=     '</div>'
        html +=   '<p class="title_main">上传时间：'+data[i].time  
        html +=   '</p>'
        html +=   '<a class="del" id="'+ data[i].encrypt_id +'">删除照片</a>'
        html +=   '</div>'
      }
      $(".tableLoading").html('');
      $(".layui-row").html(html);
 
    }
    if(list.type == "error") {
        var mun = goPage - 1;
        pages.gotopage.call(page,mun,false);
    }
  }
 }

    





})




