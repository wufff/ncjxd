
require(["layui", "path","page","upLoad"], function(layui, path,pages,upLoad) {
    var layer = layui.layer;
    var form = layui.form;
    var $ = jQuery = layui.jquery; 
    var url = path.api+"/api/getManageRecommendList";
    var page;
    var dialog;
    initPage (1);
    upLoad.img('upImg','previewImage');
  

    $("#add").click(function() {
      $("#controlTpye").val(0);
      initContorl (null);
      $("#previewImage").attr("src","");
      dialog = layer.open({
        type: 1,
        title:"添加推荐",
        content: $('#control'),
        area:["500px","530px"],
        btn: ['确定', '取消'],
        yes: function(index, layero){
          $("#submitControlBt").click();
        }
      });
    })




   $("body").on("click",".change",function(){
        $("#controlTpye").val(1);
        var tr = $(this).parents("tr");
        var id = $(this).data("id");
        var obj = {};
        obj.sort = tr.find(".sort").text();
        obj.title = tr.find(".title").text();
        obj.goto_url = tr.find(".goto_url").text();
        obj.img = tr.find(".img").attr("src");
        $("#previewImage").attr("src",obj.img);
        initContorl (obj);
        layer.open({
                type: 1,
                title:"修改推荐",
                content: $('#control'),
                area:["500px","530px"],
                btn: ['确定', '取消'],
                yes: function(index, layero){
                    $("#submitControlBt").click();
                }
        });
   })



    

    

  form.on('submit(control)', function(data){
       var controlTpye = $("#controlTpye").val();
       var url = path.api + '/api/addManageRecommend';
       var getData = data.field;
       if(controlTpye == 0) {

          alert(0);
       }
       if(controlTpye == 1){
          alert(1);
       }
       return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
  });



    $(".del").click(function(){
         layer.confirm('确定删除此条推荐吗?', {icon: 3, title:'提示'}, function(index){
          layer.close(index);
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
      })
    }
  }










 function initPage (goPage){
      var url = path.api+"/api/getManageRecommendList";
      var getData = "type=1&page=1&page_count=3";
      pages.getAjax(url,getData,function(data){
         if( data.data.code == 1000){
             var total = data.data.data.total;
             page =  new pages.jsPage(total, "pageNum","3",url,getData,buildTable,goPage,null);
             pages.pageMethod.call(page); 
           }else{
             $("#tbody").html('<tr><td colspan="4">暂无数据~！</td></td>');
             return;
         }
      })
     
    function buildTable(list) {
    if (list.data.code == 1000) {
      var data = list.data.data.list.map(function(item) {
        return {
          sn:item.r_sn,
          title: item.r_title,
          sort: item.r_sort,
          img:item.r_cover_img,
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
        html += '<td class="sort">' + data[i].sort + '</td>'
        html += '<td ><a href="'+ data[i].img +'"><img  class="img" src="' + data[i].img + '"></a></td>'
        html += '<td class="goto_url">' + data[i].url + '</td>'
        html += '<td>' + data[i].time + '</td>'
        html += '<td><a class="change">修改</a><a class="del">删除</a></td>'
        html += ' </tr>'

      }

      $("#tbody").html(html);

    }
    if(list.data.code == 1003) {
       var mun = goPage - 1;
        pages.gotopage.call(page_1,mun,false);
    }
  }
 }

    





})



