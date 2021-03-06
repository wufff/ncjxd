require(["layui", "path","page","api","boot-dropdown"], function(layui, path,pages,api) {
    var layer = layui.layer;
    var $ = jQuery = layui.jquery;
    var form =  layui.form;
    var dialog;
    $("#add").click(function() {
      initContorl(null);
      dialog = layer.open({
        type: 1,
        title:"添加资源",
        content: $('#control'),
        area:["500px","400px"],
        btn: ['确定', '取消'],
        yes: function(index, layero){
          $("#submitControlBt").click();
        }
      });
    })
    
    initPage (1);


    $("body").on("click",".del",function(){
     var id = $(this).parents("tr").data("id");
     layer.confirm('确定删除此条推荐吗?', {icon: 3, title:'提示'}, 
        function(index){
         var url = path.api+'/api/delManageRecommendData';
         var obj = {};
         obj.id = id;
         obj.type = 3;
         api.ajaxGet(url,obj,function(res){
             if(res.type == "success") {
                 layer.msg("删除成功！",{time:1200});
                 layer.close(index);
                 refrechData();
             }else{
                //console.log(res);
             }
            
         })
      });
   })



  $("#xiaoyan").click(function(){
       var id = $("input[name=res_id").val();
       var url = path.api + "/api/getResCenterResourceInfoByResId";
       var getData = {};
       getData.res_id = id;
       api.ajaxGet(url,getData,function(res){
            var data = res.data.data;
            $("#res_title").text(data.res_title);
            $("#res_type").text(data.res_ext);
            $("input[name=res_encrypt_id]").val(data.res_encrypt_id);
       }) 
       return false;
  })





   
  form.on('submit(control)', function(data){
       var controlTpye = $("#controlTpye").val();
       if(!data.field.res_encrypt_id){
          layer.msg("未校验，或者校验未通过~!",{icon:5})
          return false; 
       }
       var getData = data.field;
       getData.type = 3;
       getData.title = $("#res_title").text();
       if(controlTpye == 0) {
           var url = path.api+"/api/addManageRecommend";
           var loading = layer.load(3);
           api.ajaxGet(url,getData,function(res){
              // //console.log(res);
              if(res.type == "success") {
                layer.msg("添加成功！",{time:1200});
                refrechData();
                layer.close(loading);
                layer.close(dialog);
              }else{
                 alert(res.type);
              }
          });
           return false; 
       }

      return false; 
  });




  function initContorl (data){
    if(data){
    form.val("control",data)
    }else {
      form.val("control", 
      {
        "res_encrypt_id": "" ,
        "res_id":""
      })
       $("#res_title").text("点击校验自动获取资源标题");
       $("#res_type").text("点击校验自动获取文件类型");
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






   
 function initPage (goPage){
      var url = path.api+"/api/getManageRecommendList";
      var getData = "type=3&page=1&page_count=10&v="+ new Date().getTime() ;
      pages.getAjax(url,getData,function(data){
         if( data.type == "success"){
             var total = data.data.data.total;
             page =  new pages.jsPage(total, "pageNum","10",url,getData,buildTable,goPage,null);
             pages.pageMethod.call(page); 
           }else{
             $("#tbody").html('<tr><td colspan="5" class="noneDataTd">暂无数据~！</td></td>');
             $(".tableLoading").html('');
             return;
         }
      })
     
    function buildTable(list) {
    if (list.type == "success") {
      var data = list.data.data.list.map(function(item) {
        return {
          sn:item.r_sn,
          title: item.r_title,
          sort: item.r_sort,
          type:item.r_ext_css,
          url: item.r_goto_url,
          time: item.r_createtime,
          encrypt_id: item.r_encrypt_id
        }
      })
     
      var html = '';
      for (var i = 0; i < data.length; i++) {
        html += '<tr data-id="' + data[i].encrypt_id + '">'
        html += '<td class="sn">' + data[i].sn + '</td>'
        html += '<td class="title">' + data[i].title + '</td>'
        html += '<td class="type">' + data[i].type.slice(9); + '</td>'
        html += '<td>' + data[i].time + '</td>'
        html += '<td><a class="del">删除</a></td>'
        html += ' </tr>'
      }
      $(".tableLoading").html(' ');
      $("#tbody").html(html);

    }
    if(list.type == "error") {
        var mun = goPage - 1;
        pages.gotopage.call(page,mun,false);
    }
  }
 }





})