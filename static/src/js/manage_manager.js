require(["layui", "path","page","api"], function(layui, path,pages,api) {
    var layer = layui.layer;
    var $ = jQuery = layui.jquery; //用他的jquey否则弹窗会有问题
    var form = layui.form;
    var type = 0;
    var dialog
    initPage (1)


    
   $("body").on("click",".change",function(){
         var tr = $(this).parents("tr");
         var obj = {
            uid:tr.attr("data-uid"),
            user_realname:tr.find(".user_realname").text(),
            user_pwd:tr.find(".user_pwd").text(),
            user_mobile:tr.find(".user_mobile").text(),
            user_status:tr.find(".user_status").attr("user_status"),
            user_name:tr.find(".user_status").attr("user_name"),
         };
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







    $(".del").click(function(){
         layer.confirm('确定删除此条推荐吗?', {icon: 3, title:'提示'}, function(index){
          layer.close(index);
        });
    })



  
  form.on('submit(control)', function(data){
       var getData = data.field;
       console.log(getData);
       if(type == 0) {
            var url = '/userManage/ajaxAddUser';
            api.ajaxPost(url,getData,function(res){
                if(res.type == "success"){
                   layer.msg(res.message,{time:800})
                   layer.close(dialog);
                   initPage (1);
                }else{
                   layer.msg(res.message,{time:800})
                }
            })
       }

       if(type == 1){
          
       }
      return false; 
  });











  
// user_name user_realname user_pwd user_position user_mobile user_type user_status

  function initContorl (data){
    if(data){
    form.val("control",data)
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
      
    }
  }



  function initPage (goPage){
      var url = "/UserManage/ajaxManageList/";
      var getData = "&page=1&page_count=15&v="+ new Date().getTime() ;
      pages.getAjax(url,getData,function(data){
        // console.log(data);
         if( data.type == "success"){
             var total = data.data.count;
             page =  new pages.jsPage(total, "pageNum","15",url,getData,buildTable,goPage,null);
             pages.pageMethod.call(page); 
           }else{
             $("#tbody").html('<tr><td colspan="7">暂无数据~！</td></td>');
            $(".tableLoading").html('');
             return;
         }
      })
     
    function buildTable(list) {
    if (list.type == "success") {
      var data = list.data.data.map(function(item) {
        return {
          uid:item.uid,
          name: item.user_name,
          realname:item.user_realname,
          url: item.r_goto_url,
          operate: item.user_operate,
          status:item.user_status,
          status_descript:item.user_status_descript,
          time: item.addtime
        }
      })
     
      var html = '';
      for (var i = 0; i < data.length; i++) {
        html += '<tr data-uid="' + data[i].uid + '">'
        html += '<td class="sn">' + (i+1) + '</td>'
        html += '<td class="user_name">' + data[i].name + '</td>'
        html += '<td class="user_realname">' + data[i].realname + '</td>'
        html += '<td class="user_operate">' + data[i].operate + '</td>'
        html += '<td class="user_status" user_status="'+ data[i].status+'">' + data[i].status_descript + '</td>'
        html += '<td>' + data[i].time + '</td>'
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