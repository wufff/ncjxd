require(["layui","path","page","api","boot-dropdown"], function(layui,path,pages,api) {
    var layer = layui.layer;
    var $ = jQuery = layui.jquery; 
    var form = layui.form;
    var uid;
    var dialog;
    var page;
    var city_id = $(".table_b").attr("city_id");
    var loading;
    initPage (1,city_id);

 $("body").on("click",".edit",function(){
      var tr = $(this).parents("tr");
      uid = tr.attr("data-id");
      var data = {
          user_name:tr.find('.user_name').text(),
          user_realname:tr.find('.user_realname').text(),
          user_email:tr.attr("data-email"),
          user_mobile:tr.attr("data-mobile"),
          user_status:tr.find('.user_status').attr("user_status")
      }
     initContorl (data);
     console.log(data);
    dialog = layer.open({
        type: 1,
        title:"编辑",
        content: $('#controlLowerEdit'),
        area:["500px","500px"],
        btn: ['确定', '取消'],
        yes: function(index, layero){
          $("#submitControlBt").click();
        }
      });
  })


  form.on('select(city)', function(data){
     var postData = {
      city_id:data.value
     }
    if($("#city").find("option").length == 1) {
       return;
     }
     var url = "/SchoolManage/ajaxCountyListByCityId";
     if(data.value != 0){
      api.ajaxPost(url,postData,function(res){
        if(res.type == "success") {
          var list = res.message;
          var html = '<option value="">全部</option>';
          for(var i=0;i<list.length;i++){
             html += '<option value="'+ list[i].town_id +'">'+ list[i].town_name+'</option>'
          }
           
         $("select[name=area]").html(html);
         $("select[name=area]").val("");
          form.render('select');
       }
     })
     }else{
       $("select[name=area]").html('<option value="">请先选择州县</option>');
          form.render('select');
     }
});



// 查询
$("#searchBt").click(function(){
   var cityId = $("#city").val();
   var county_id = $("#area").val();
   if (cityId){
       // console.log(cityId);
      loading = layer.load(5);
      initPage (1,city_id,county_id);
   }
  
})


 function initContorl (data){
    form.val("control",data);
    $("#user_name").attr("disabled",true)
    var status = data.user_status;
    $('input[value='+ status +']').prop("checked",true);
}


  form.on('submit(control)', function(data){
            var getData = data.field;
            getData.uid = uid;
            console.log(getData)
            var url = '/UserManage/ajaxEditManageUser';
            api.ajaxPost(url,getData,function(res){
                if(res.type == "success"){
                   layer.msg("修改成功",{time:800})
                   layer.close(dialog);
                   var cityId = $("#city").val();
                   var county_id = $("#area").val();
                   initPage (1,city_id,county_id);
                }else{
                   layer.msg(res.message,{time:800})
                }
            })
      return false; 
  });


   function initPage (goPage,city_id,county_id){
      var url = $("#seciton").attr("url");
      var getData = "city_id="+ city_id +"&page=1&v="+ new Date().getTime() ;
      if(county_id && county_id != 0){
        getData += "&county_id="+county_id;
      }
      pages.getAjax(url,getData,function(res){
          // console.log(res);
          if(res.data.data.length == 0){
                  $("#tbody").html('<tr><td colspan="7" class="noneDataTd">暂无数据~！</td></td>');
                  $(".tableLoading").html('');
                   layer.close(loading);
                   return;
             }
             var length = res.data.data.length;
             var total = res.data.count;
             page =  new pages.jsPage(total, "pageNum",length,url,getData,buildTable,goPage,null);
             pages.pageMethod.call(page); 
      })
     
    function buildTable(res) {
    if (res.type == "success") {
      var data = res.data.data;
      // console.log(data);
      if(res.data.count == 0){
          ("#tbody").html('<tr><td colspan="8"  class="noneDataTd">暂无数据~！</td></td>');
          $(".tableLoading").html('');
          return;
      }
      var html = '';
      for (var i = 0; i < data.length; i++) {
         html += '<tr data-id="'+ data[i].uid +'" data-mobile="'+ data[i].user_mobile +'" data-email="'+data[i].user_email +'">'
        html += '<td class="sn">' + data[i].sel + '</td>'
        if(data[i].county_url){
             html += '<td class="city_name"><a href="'+ data[i].county_url +'">' +data[i].county_name + '</a></td>'
        }else {
             html += '<td class="city_name">' +data[i].county_name + '</td>'
        }
        html += '<td class="school_count">' + data[i].school_count + '</td>'
        html += '<td class="teacher_count">' + data[i].teacher_count + '</td>'
        html += '<td class="user_name" user_type="'+ data[i].user_type+'">' + data[i].user_name + '</td>'
        html += '<td class="user_realname">' + data[i].user_realname + '</td>'
        html += '<td class="user_status user_status_'+ data[i].user_status+ '" user_status="'+data[i].user_status +'">' + data[i].user_status_descript + '</td>'
        html += '<td><a class="edit">编辑</a></td>'
        html += ' </tr>'
      }
      $(".tableLoading").html(' ');
      $("#tbody").html(html);
      
    }
    layer.close(loading);
  }
 }







})




