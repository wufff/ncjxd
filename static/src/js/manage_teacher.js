require(["layui", "path","page","tools","api","num","boot-dropdown"], function(layui, path,pages,tools,api,num) {
    var layer = layui.layer;
    var upload = layui.upload;
    var $ = jQuery = layui.jquery; //用他的jquey否则弹窗会有问题
    var form = layui.form;
    var page;
    var loading;
    var dialog;
    initPage (1);
    // getUserListBySchoolId();
    controlGetSubject();


//年级出学科
form.on('select(grade)', function(data){
   // console.log(data.value);
   var url = path.api + "/api/getSubjectCodeList";
   var getData = {};
   getData.grade_id = data.value;
   if(data.value){
       api.ajaxGet(url,getData,function(data){
        // console.log(data);
       if(data.type == "success") {
          var list = data.data.data.list;
          var html = '<option value="">选择学科</option>';
          for(var i=0;i<list.length;i++){
             html += '<option value="'+ list[i].ss_id +'">'+ list[i].ss_name+'</option>'
          }
         $("select[name=subject]").html(html);
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
      $("#controlTpye").val(0);
        initContorl(null)
        dialog = layer.open({
        type: 1,
        title:"添加教师",
        content: $('#controlAddteacher'),
        area:["600px","600px"],
        btn: ['确定', '取消'],
        yes: function(index, layero){
          $("#submitControlBt").click();
        }
      });
    })

//删除
// 删除老师http://wangyong.ncjxd.dev.dodoedu.com/api/delSchoolTeacher
// user_id
  $("body").on("click",".del",function(){
        var _this = this;
        layer.confirm('确定删除该老师吗?', {icon: 3, title:'提示'}, function(index){
          var tr = $(_this).parents("tr");
          var uid = tr.attr("data-user");
          var url = path.api + "/api/delSchoolTeacher";
          api.ajaxGet(url,{user_id:uid},function(res){
              if(res.type == "success"){
                  layer.msg('删除成功');
                  layer.close(index);
                  refrechData();
              }else{
                 layer.msg(res.message,{icon:5});
              } 
          })
      });
  })


 $("#searchBt").click(function(){
     loading = layer.load(3);
     initPage (1);
 })


 $("body").on("click",".change",function(){
        $("#controlTpye").val(1);
        initContorl (null);
        var tr = $(this).parents("tr");
        var moblie = tr.find(".moblie").text();
        var useId = tr.attr("data-user");
        var gardeArr = tr.attr("data-grade");
        var subject = tr.attr("data-subject");
        var username = tr.find(".username").text();
        var st_dodo_uid = tr.find(".id").attr("st_dodo_uid");
        var name = tr.find(".name").text();
        $("#dodo_user_name").val(username);
        $("#dodo_user_realname").val(name);
        $("#dodo_user_id").val(st_dodo_uid);

        var subjectBbj = JSON.parse(subject);
        var gardeBbj = JSON.parse(gardeArr);
        var is_within = tr.find(".within").attr("within");
        var intdata = {
            teacher_id:useId,
            mobile:moblie,
            pbtext:username,
            is_within:is_within
        }
       //多选赋值年级
        $(gardeBbj).each(function(index, el) {
           intdata["grade["+el.st_grade+"]"] = true; 
        });   

       //多选赋值学科
        $(subjectBbj).each(function(index, el) {
           intdata["subject["+el.st_grade+"]"] = true; 
        }); 
        
        initContorl (intdata);
        dialog = layer.open({
        type: 1,
        title:"修改教师",
        content: $('#controlAddteacher'),
        area:["600px","580px"],
        btn: ['确定', '取消'],
        yes: function(index, layero){
          $("#submitControlBt").click();
        }
      });
  })


//匹配按钮
 $("#pbbt").click(function(){
     var works = $("#pbtext").val();
     if (works && works != 0){
        var url = path.api+"/api/getUserInfoByDodoId"
        api.ajaxGet(url,{user_name:works},function(res){
           if(res.type == "success"){
             // console.log(res);
             var data = res.data.data;
             $(".text").html("匹配成功,教师名为: <span class='red'>"+res.data.data.dodo_user_realname+"</span>");
             $("#dodo_user_id").val(data.dodo_user_id)
             $("#dodo_user_name").val(data.dodo_user_name)
             $("#dodo_user_realname").val(data.dodo_user_realname);
           }else {
             $(".text").html("匹配失败,请重新输入");
             $("#dodo_user_id").val("");
           }
        })
     }
     return false;
 })




//此页面添加和修改是同一个接口
  form.on('submit(control)', function(data){
       var controlTpye = $("#controlTpye").val();
       var fieldData = data.field;
       var getData = {};
       getData.dodo_user_id = fieldData.dodo_user_id;
       getData.dodo_user_name =fieldData.dodo_user_name;
       getData.dodo_user_realname =fieldData.dodo_user_realname;
       getData.subject = fieldData.subject;
       getData.grade = fieldData.grade;
       getData.is_within = fieldData.is_within;
       // getData.school_id = fieldData.school_id; 
       getData.mobile = fieldData.mobile;

        if(!getData.dodo_user_id){
          layer.msg("未匹配成功,请先匹配",{icon:5})
          return false;
        }
       var gradeArr = new Array();
        $("input:checkbox[name^='grade']:checked").each(function(i){
              gradeArr[i] = $(this).val();
        });
       if(gradeArr.length > 0){
         var gradeValue = gradeArr.join("|");
         getData.grade = gradeValue;
       }else{
          layer.msg("请至少选中一个年级",{icon:5})
          return false;
       }
       
      var subjectArry = new Array();
       $("input:checkbox[name^='subject']:checked").each(function(i){
              subjectArry[i] = $(this).val();
        });

       if(subjectArry.length > 0){
         var subjectValue = subjectArry.join("|");
         getData.subject = subjectValue;
       }else{
         layer.msg("请至少选中一个学科",{icon:5})
         return false;
       }
      console.log(getData);
       if(controlTpye == 0) {
           var url = path.api+"/api/addSchoolTeacher";
           var loading = layer.load(3);
           api.ajaxGet(url,getData,function(res){
              console.log(res);
              if(res.type == "success") {
                layer.msg("添加成功！",{time:1200});
                refrechData();
                layer.close(loading)
                layer.close(dialog);
              }else{
                 layer.msg(res.message,{icon:5});
                  layer.close(loading)
              }
          });
         return false; 
       }

       if(controlTpye == 1){
           var url = path.api+"/api/addSchoolTeacher";
           var loading = layer.load(3);
           api.ajaxGet(url,getData,function(res){
              // console.log(res);
              if(res.type == "success") {
                layer.msg("修改成功！",{time:1200});
                refrechData();
                layer.close(loading);
                layer.close(dialog);
              }else{
                 layer.msg(res.message,{icon:5});
                  layer.close(loading)
              }
          });
         return false; 
       }
      return false; 
  });

function refrechData() {
    var current = $("#pageNum").find(".current").text();
    if (current) {
      initPage(current);
    } else {
      initPage(1);
    }
  }

  function initContorl (data){
    if(data){
    form.val("control",data)
     $("input:checkbox[value=GS001]").attr("checked",true);
      $(".controlText").text("匹配成功");
    }else {
      $(".controlText").text("点击匹配,匹配已有教师");
      $("input:checkbox").attr("checked",false);
      form.val("control", 
      {
        "teacher_id": ""
        ,"mobile": ""
        ,"pbtext":""
      })
    }
  }

// 弹窗里面东西
  // function getUserListBySchoolId (){
  //   var url = path.api+'/api/getUserListBySchoolId';
  //   api.ajaxGet(url,{},function(data){
  //      // console.log(data);
  //     if(data.type == 'success'){
  //         var list = data.data.data;
  //         var html = "";
  //         for(var i=0;i<list.length;i++){
  //            html += '<option value="'+ list[i].user_encrypt_id +'">'+ list[i].user_realname+'</option>'
  //         }
  //        $("select[name=teacher_id]").append(html);
  //        form.render('select','control');
  //     }
  //   }) 
  // }


    function  controlGetSubject(){
          loading = layer.load(3);
          var url = path.api+'/api/getSubjectCodeList';
          var getData = {};
          getData.grade_id = 1;
          api.ajaxGet(url,getData,function(data){
             // console.log(data);
             if(data.type == "success"){
                var list = data.data.data.list;
                var html = "";
                for(var i=0;i<list.length;i++){
                   html += '<input type="checkbox" name="subject['+ list[i].ss_id +']" value="'+ list[i].ss_id +'" title="'+ list[i].ss_name +'">'
                }
               $("#subjectWrap").append(html);
               layer.close(loading);
               form.render('checkbox','control');
             }
          }) 
    }




   function initPage (goPage){
      var url = path.api+"/api/getManageTeacherListByParam";
      var baseData = "&page=1&page_count=5&v="+ new Date().getTime();
      var grade = $("select[name=grade]").val();
      var subject = $("select[name=subject]").val();
      var name = $("input[name=name]").val();
      // console.log(grade);
      // console.log(subject);
      // console.log(name);
      var getData = "grade="+ grade + "&subject=" + subject + "&name="+ name + baseData;
      // console.log(getData);
      pages.getAjax(url,getData,function(data){
         console.log(data);
         if( data.type == "success"){
             var total = data.data.data.total;
             page =  new pages.jsPage(total, "pageNum","5",url,getData,buildTable,goPage,null);
             pages.pageMethod.call(page); 
             layer.close(loading);
           }else{
             $("#tbody").html('<tr><td colspan="9" class="noneDataTd">暂无数据~！</td></td>');
            $(".tableLoading").html('');
            $("#pageNum").html('');
              layer.close(loading);
             return;
         }
      })
     
    function buildTable(list) {
    if (list.type == "success") {
       // console.log(list);
      var data = list.data.data.list.map(function(item) {
        return {
          id:item.st_id,
          username:item.st_username,
          user:item.st_uid,
          name:item.st_realname,
          grade:item.st_grade_str,
          gradeValue:item.st_grade_list,
          title: item.r_title,
          subject:item.st_subject_str,
          subjectValue:item.st_subject_list,
          moblie:item.st_mobile,
          time:item.st_createtime,
          encrypt_id: item.st_encrypt_id,
          st_is_within:item.st_is_within,
          st_dodo_uid:item.st_dodo_uid
        }
      })
     
      var html = '';
      for (var i = 0; i < data.length; i++) {
        html += '<tr data-id="' + data[i].encrypt_id + '" data-grade=' + JSON.stringify(data[i].gradeValue) + ' data-subject=' + JSON.stringify(data[i].subjectValue) + ' data-user="' + data[i].user + '">'
        html += '<td class="id" st_dodo_uid="'+ data[i].st_dodo_uid+'">' + data[i].id + '</td>'
        html += '<td class="username">' + data[i].username + '</td>'
        html += '<td class="name">' + data[i].name + '</td>'
        html += '<td class="grade">' + data[i].grade + '</td>'
        html += '<td class="subject">' + data[i].subject + '</td>'
        html += '<td class="moblie">' + tools.fomartNone(data[i].moblie) + '</td>'
        html += '<td class="within" within="'+data[i].st_is_within+'">' + num.teacherStatus(data[i].st_is_within) + '</td>'
        html += '<td class="timel">' + tools.fomartTime(data[i].time) + '</td>'
        html += '<td><a class="change">修改</a><a class="del">删除</a></td>'
        html += ' </tr>'
      }
      $(".tableLoading").html(' ');
      $("#tbody").html(html);
     
    }
    if(list.type == "error" && goPage != 1) {
        var mun = goPage - 1;
        pages.gotopage.call(page,mun,false);
    }
  }
 }
})



