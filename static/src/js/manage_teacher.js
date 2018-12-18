require(["layui", "path","page","tools"], function(layui, path,pages,tools) {
    var layer = layui.layer;
    var upload = layui.upload;
    var $ = jQuery = layui.jquery; //用他的jquey否则弹窗会有问题
    var form = layui.form;
    var page;

  



initPage (1);
getUserListBySchoolId();
controlGetSubject();




form.on('select(grade)', function(data){
  // console.log(data.elem); //得到select原始DOM对象
   // console.log(data.othis); //得到美化后的DOM对象
   console.log(data.value); //得到被选中的值
   var url = path.api + "/api/getSubjectCodeList";
   var getData = {};
   getData.grade_id = data.value;
   if(data.value){
       $.get(url,getData,function(data){
        console.log(data);
       if(data.type == "success") {
          var list = data.data.data.list;
          var html = "";
          for(var i=0;i<list.length;i++){
             html += '<option value="'+ list[i].ss_id +'">'+ list[i].ss_name+'</option>'
          }
         $("select[name=subject]").append(html);
         $("select[name=subject]").val(" ");
         form.render('select','subject');
       }
   })
   }else{
     $("select[name=subject]").html('<option value="">选择学科</option>');
     form.render('select','subject');
   }
  
 
});      






    $("#addTeacherBtn").click(function() {
      layer.open({
        type: 1,
        title:"添加教师",
        content: $('#controlAddteacher'),
        area:["600px","540px"],
        btn: ['确定', '取消'],
        yes: function(index, layero){
          $("#submitControlBt").click();
        }
      });
    })



  form.on('submit(control)', function(data){
       var controlTpye = $("#controlTpye").val();
       var getData = data.field;
       getData.type = 3;
       console.log(getData);
       console.log(controlTpye);
       if(controlTpye == 0) {
           var url = path.api+"/api/addManageRecommend";
           var loading = layer.load(3);
          //  $.get(url,getData,function(res){
          //     console.log(res);
          //     if(res.type == "success") {
          //       layer.msg("添加成功！",{time:1200});
          //       refrechData();
          //       layer.close(loading);
          //       layer.close(dialog);
          //     }else{
          //        alert(res.type);
          //     }
          // });
          alert(0);
           return false; 
       }

       if(controlTpye == 1){
          var url = path.api+"/api/modifyManageRecommendData";
          var loading = layer.load(3);
          // getData.id = editeId;
          // console.log(getData);
          //  $.get(url,getData,function(res){
          //     if(res.data.code == 1000) {
          //       layer.msg("修改成功！",{time:1200});
          //       refrechData();
          //       layer.close(loading);
          //       layer.close(dialog);
          //     } 
          // });
          alert(1);
       }
      return false; 
  });










  
  

  $("body").on("click",".del",function(){
        layer.confirm('确定删除此条推荐吗?', {icon: 3, title:'提示'}, function(index){
        layer.close(index);
      });

  })

    

// 弹窗里面东西
  function getUserListBySchoolId (){
    var url = path.api+'/api/getUserListBySchoolId';
    $.get(url,function(data){
      if(data.type == 'success'){
          var list = data.data.data;
          var html = "";
          for(var i=0;i<list.length;i++){
             html += '<option value="'+ list[i].school_encrypt_id +'">'+ list[i].user_realname+'</option>'
          }
         $("select[name=schoolname]").append(html);
         $("select[name=schoolname]").val(" ");
         form.render('select','control');
      }
    })
    
  }

    function  controlGetSubject(){
          var url = path.api+'/api/getSubjectCodeList';
          var getData = {};
          getData.grade_id = 1;
          $.get(url,getData,function(data){
             console.log(data);
             if(data.type == "success"){
                var list = data.data.data.list;
                var html = "";
                for(var i=0;i<list.length;i++){
                   html += '<input type="checkbox" name="subject" value="'+ list[i].ss_id +'" title="'+ list[i].ss_name +'">'
                }
               $("#subjectWrap").append(html);
               form.render('checkbox','control');
             }
          }) 
    }





   function initPage (goPage){
      var url = path.api+"/api/getManageTeacherListByParam";
      var baseData = "&page=1&page_count=8&v="+ new Date().getTime();
      var grade = $("select[name=grade]").val();
      var subject = $("select[name=subject]").val();
      var name = $("input[name=name]").val();
      // console.log(grade);
      // console.log(subject);
      // console.log(name);
      var getData = "grade="+ grade + "&subject=" + subject + "&name="+ name + baseData;
      // console.log(getData);
      pages.getAjax(url,getData,function(data){
         if( data.type == "success"){
             var total = data.data.data.total;
             page =  new pages.jsPage(total, "pageNum","5",url,getData,buildTable,goPage,null);
             pages.pageMethod.call(page); 
           }else{
             $("#tbody").html('<tr><td colspan="7">暂无数据~！</td></td>');
            $(".tableLoading").html('');
             return;
         }
      })
     
    function buildTable(list) {
    if (list.type == "success") {
      var data = list.data.data.list.map(function(item) {
        return {
          id:item.st_id,
          username:item.st_username,
          name:item.st_realname,
          grade:item.st_grade_str,
          title: item.r_title,
          subject:item.st_subject_str,
          moblie:item.st_mobile,
          time:item.st_createtime,
          encrypt_id: item.st_encrypt_id
        }
      })
     
      var html = '';
      for (var i = 0; i < data.length; i++) {
        html += '<tr data-id="' + data[i].encrypt_id + '">'
        html += '<td class="id">' + data[i].id + '</td>'
        html += '<td class="username">' + data[i].username + '</td>'
        html += '<td class="name">' + data[i].name + '</td>'
        html += '<td class="grade">' + data[i].grade + '</td>'
        html += '<td class="subject">' + data[i].subject + '</td>'
        html += '<td class="moblie">' + data[i].moblie + '</td>'
        html += '<td class="timel">' + tools.fomartTime(data[i].time) + '</td>'
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



