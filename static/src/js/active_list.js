require(["layui", "path","page","api"], function(layui, path,pages,api) {
    var layer = layui.layer;
    var $ = jQuery = layui.jquery; //用他的jquey否则弹窗会有问题
    var page;


    initPage (1);

   
    $("#searchBt").click(function(){
       initPage (1);
    })



   

  $("body").on("click",".del",function(){
     var tr = $(this).parents("tr");
     layer.confirm('确定删除此条推荐吗?', {icon: 3, title:'提示'}, 
        function(index){
         var url = path.api+'/api/delManageActivityData';
         var obj = {};
         obj.id = tr.data("id");
         api.ajaxGet(url,obj,function(res){
             if(res.type == "success") {
                 layer.msg("删除成功！",{time:1200});
                 layer.close(index);
                 refrechData();
             }else{
               alert(res.message);
             }
            
         })
      });
   })


  $("body").on("click",".change",function(){
     var tr = $(this).parents("tr");
     var id =  tr.data("id");
     window.location.href ="/manage/addactivity?id="+id;
   })

  function refrechData() {
    var current = $("#pageNum").find(".current").text();
    if (current) {
      initPage(current);
    } else {
      initPage(1);
    }
  }

 
 function initPage (goPage){
      var url = path.api+"/api/getManageActivityList";
      var keyWord = $("input[name=keyWords]").val();
      var getData = "key_word="+keyWord+"&page=1&page_count=5&v="+ new Date().getTime() ;
      pages.getAjax(url,getData,function(data){
         if( data.type == "success"){
             var total = data.data.data.total;
             page =  new pages.jsPage(total, "pageNum","5",url,getData,buildTable,goPage,null);
             pages.pageMethod.call(page); 
           }else{
             $("#tbody").html('<tr><td colspan="7" class="noneDataTd">暂无数据~！</td></td>');
            $(".tableLoading").html('');
             return;
         }
      })
     
    function buildTable(list) {
    if (list.type == "success") {
      var data = list.data.data.list.map(function(item) {
        return {
          sn:item.ai_sn,
          title: item.ai_title,
          teacher_name: item.ai_teacher_name,
          img:item.ai_cover_img,
          is_exist: item.ai_is_exist,
          time: item.ai_start_time_chs,
          encrypt_id: item.ai_encrypt_id
        }
      })
     
      var html = '';
      for (var i = 0; i < data.length; i++) {
        html += '<tr data-id="' + data[i].encrypt_id + '">'
        html += '<td class="sn">' + data[i].sn + '</td>'
        html += '<td class="title">' + data[i].title + '</td>'
        html += '<td>' + data[i].time + '</td>'
        html += '<td>' + data[i].teacher_name + '</td>'
        html += '<td><a class="inner_img" href="'+ data[i].img +'"><img  class="img" src="' + data[i].img + '"></a></td>'
        html += '<td>' + data[i].is_exist + '</td>'
        html += '<td><a class="change">修改</a><a class="del">删除</a></td>'
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