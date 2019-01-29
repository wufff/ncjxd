require(["layui", "path","page","api","boot-dropdown"], function(layui, path,pages,api) {
    var layer = layui.layer;
    var $ = jQuery = layui.jquery; //用他的jquey否则弹窗会有问题
    var form = layui.form;
    var type = 0;
    var dialog;
    var search_type = 1;
    initPage (1)
   $("body").on("click",".change",function(){
         var tr = $(this).parents("tr");
         var uid = tr.attr("data-uid");
         $("#uid").val(uid)
         var obj = {
            uid:tr.attr("data-uid"),
            user_name:tr.find(".user_name").text(),
            user_realname:tr.find(".user_realname").text(),
            user_pwd:tr.find(".user_pwd").text(),
            user_mobile:tr.attr("user_mobile"),
            user_position:tr.attr("user_position"),
            user_status:tr.find(".user_status").attr("user_status"),
            user_type:tr.find(".user_operate").attr("user_type")
         };
        
         // console.log(obj);
         initContorl(obj);
         type = 1; 
        dialog = layer.open({
              type: 1,
              title:"修改管理员信息",
              content: $('#controlManageEdit'),
              area:["500px","570px"],
              btn: ['确定', '取消'],
              yes: function(index, layero){
                 $("#submitControlBt").click();
              }
            });
   })



   
    $("#addMange").click(function() {
      type = 0;
      initContorl();
     dialog = layer.open({
        type: 1,
        title:"添加管理员",
        content: $('#controlManageEdit'),
        area:["500px","570px"],
        btn: ['确定', '取消'],
        yes: function(index, layero){
           $("#submitControlBt").click();
        }
      });
    })



form.on('select(search_type)', function(data){
   // console.log(data.value);
   var url = path.api + "/api/getSubjectCodeList";
   var getData = {};
   search_type = data.value;
});  



$("#searchBt").click(function(){
   initPage (1);
})



$("body").on("click",".del",function(){
    var _this = this;
    layer.confirm('确定删除此管理员信息吗?', {icon: 3, title:'提示'}, function(index){
         var tr = $(_this).parents("tr");
         var uid = tr.attr("data-uid");
         var postData = {
             uid:uid
         }
        var url = "/userManage/ajaxDelUser";
        api.ajaxPost(url,postData,function(res){
                console.log(res);
                if(res.type == "success"){
                   layer.close(index);
                   layer.msg(res.message,{time:800})
                   $("#search_name").val("");
                   initPage (1);
                }else{
                   layer.msg(res.message,{time:800})
            }
        })
    });
})



  
  form.on('submit(control)', function(data){
       var getData = data.field;
       if(type == 0) {
            if(getData.user_pwd == ""){
                layer.msg("密码未设置,请设置",{icon:5})  
                return false;
            }
            var url = '/userManage/ajaxAddUser';
            api.ajaxPost(url,getData,function(res){
                if(res.type == "success"){
                   layer.msg(res.message,{time:800})
                   layer.close(dialog);
                   $("#search_name").val("");
                   initPage (1);
                }else{
                   layer.msg(res.message,{time:800})
                }
            })
            

       }
       if(type == 1){
           var url = '/userManage/ajaxEditUser';
            getData.uid = $("#uid").val();
            console.log(getData);
            api.ajaxPost(url,getData,function(res){
                // console.log(res);
                if(res.type == "success"){
                   layer.msg("编辑成功",{time:800})
                   layer.close(dialog);
                   initPage (1);
                }else{
                   layer.msg(res.message,{time:800})
                }
            })
       }
      return false; 
  });





// user_name user_realname user_pwd user_position user_mobile user_type user_status

  function initContorl (data){
    if(data){
    form.val("control",data);
    $("#user_name").attr("disabled",true)
    var status = data.user_status;
    var type = data.user_type;
    $('input[value='+ status +']').prop("checked",true);
    $('input[value='+ type +']').prop("checked",true);
    }else {
      form.val("control", 
      {
        "user_name": "" ,
        "user_realname":"",
        "user_pwd":"",
        "user_position":"",
        "user_mobile":"",
        "user_type":7,
        "user_status":0
      })
      $("#user_name").attr("disabled",false);
      $("input[name='user_status']").eq(1).prop("checked",true);
      $("input[name='user_type']").eq(0).prop("checked",true);
    }
  }


  function initPage (goPage){
      var url = "/UserManage/ajaxManageList/";
      var getData = "page=1&page_count=15&search_type="+ search_type + "&search_name="+ $("#search_name").val() + "&v="+ new Date().getTime() ;
     /* console.log(getData);*/
      pages.getAjax(url,getData,function(data){
        console.log(data);
         if( data.type == "success"){
             if(data.data.data.length == 0){
                  $("#tbody").html('<tr><td colspan="7" class="noneDataTd">暂无数据~！</td></td>');
                  $(".tableLoading").html('');
                   return;
             }
             var length = data.data.data.length;
             var total = data.data.count;
             page =  new pages.jsPage(total, "pageNum",length,url,getData,buildTable,goPage,null);
             pages.pageMethod.call(page); 
           }
      })
     
    function buildTable(list) {
    if (list.type == "success") {
      var data = list.data.data.map(function(item) {
        return {
          uid:item.uid,
          username: item.user_name,
          realname:item.user_realname,
          url: item.r_goto_url,
          operate: item.user_operate,
          type:item.user_type,
          status:item.user_status,
          status_descript:item.user_status_descript,
          time: item.addtime,
          mobile:item.user_mobile,
          position:item.user_position,
          sn:item.sel
        }
      })
      // console.log(data);
      var html = '';
      for (var i = 0; i < data.length; i++) {
        html += '<tr data-uid="' + data[i].uid + '" user_mobile="' + data[i].mobile + '"  user_position="' + data[i].position + '">'
        html += '<td class="sn">' + data[i].sn + '</td>'
        html += '<td class="user_name">' + data[i].username + '</td>'
        html += '<td class="user_realname">' + data[i].realname + '</td>'
        html += '<td class="user_operate" user_type="'+ data[i].type+'">' + data[i].operate + '</td>'
        html += '<td class="user_status user_status_'+ data[i].status +'" user_status="'+ data[i].status+'">' + data[i].status_descript + '</td>'
        html += '<td>' + data[i].time + '</td>'
        html += '<td><a class="change">编辑</a><a class="del">删除</a></td>'
        html += ' </tr>'
      }
      $(".tableLoading").html(' ');
      $("#tbody").html(html);
    }else  if(list.type == "login") {
       window.location.href = res.msg;
    }
  }
 }
})