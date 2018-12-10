
require(["layui", "path","page","upLoad"], function(layui, path,pages,upLoad) {
    var layer = layui.layer;
    var form = layui.form;
    var $ = jQuery = layui.jquery; 
    var url = path.api+"/api/getManageRecommendList";
    var page;
    initPage (1);
    upLoad.img('upImg','previewImage');


    $("#add").click(function() {
      initContorl ();
      layer.open({
        type: 1,
        title:"添加推荐",
        content: $('#control'),
        area:["500px","530px"],
        btn: ['确定', '取消'],
        yes: function(index, layero){
          layer.close(index); 
        }
      });
    })
    



    $(".change").click(function() {
              layer.open({
                type: 1,
                title:"修改推荐",
                content: $('#control'),
                area:["500px","530px"],
                btn: ['确定', '取消'],
                yes: function(index, layero){
                  layer.close(index); 
                }
              });
            
    })



    $(".del").click(function(){
         layer.confirm('确定删除此条推荐吗?', {icon: 3, title:'提示'}, function(index){
          layer.close(index);
        });
    })




  function initContorl (){
    form.val("control", {
      "title": "贤心" 
      ,"url": "456"
      ,"sort": 3
    })
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
          encrypt_id: item.n_encrypt_id
        }
      })
      var html = '';
      for (var i = 0; i < data.length; i++) {
        html += '<tr data-id="' + data[i].encrypt_id + '">'
        html += '<td>' + data[i].sn + '</td>'
        html += '<td>' + data[i].title + '</td>'
        html += '<td>' + data[i].sort + '</td>'
        html += '<td><a href="'+ data[i].img +'"><img src="' + data[i].img + '"></a></td>'
        html += '<td>' + data[i].url + '</td>'
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



