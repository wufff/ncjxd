require(["layui","path","tools","num","api","cTable","checkTab","boot-dropdown"],function(layui,path,tools,num,api,cTable){
      var layer = layui.layer;
      var form = layui.form;
      var element = layui.element;
      var $ = jquery = layui.jquery;
      var loading;
      // 课表渲染
      cTable.school_id = tools.queryString("school_id");
      cTable.room_id = tools.queryString("room_id");
      cTable.term_id = tools.queryString("term_id");
      cTable.week = tools.queryString("week");
      cTable.weekData = tools.queryString("weekData");
      cTable.room_name = tools.request("room_name");
      cTable.school_name = tools.request("school_name");
      cTable.tpye_class = tools.request("type");
      cTable.usrsfor = 1
  
  
      var city_id = tools.queryString("city_id");
      var area_id = tools.queryString("area_id");

      var is_kd_school = $("#is_kd_school").val();                 //判断是否登录
      var is_kd_html = "请前往 <a href='http://user.needu.cn/bench/index.html' style='color:orange'>http://user.needu.cn/bench/index.html</a> 编辑“互动课堂”课程表，课表将同步至本平台"
     
      if(is_kd_school == 1){
          layer.alert(is_kd_html,{icon: 7,title:"提示",anim:-1});
      }

      // console.log(school_name);
      $(".schoolName").html(cTable.school_name);
      $(".roomName").html(cTable.room_name);
      cTable.studyTime(cTable.school_id,cTable.weekData);

   
    //切换周
$("body").on("click",".Add",function(){
      var currtWeek = $("#week").text();
      if(currtWeek == cTable.totWeek){
         return;
      }
      cTable.weekData = tools.nextWeek(cTable.weekData);
      cTable.studyTime (cTable.school_id,cTable.weekData);
})
  
$("body").on("click",".sub",function(){
      var currtWeek = $("#week").text();
      if(currtWeek == 1){
         return;
      }
      cTable.weekData = tools.prevWeek(cTable.weekData);
      cTable.studyTime (cTable.school_id,cTable.weekData);
})


$("#goToConfirm").click(function() {
    var url = "/course/confirm?school_id=" + cTable.school_id + "&room_id=" + cTable.room_id + "&weekData=" + cTable.weekData + "&term_id=" + cTable.term_id + "&week=" + cTable.week + "&room_name=" + cTable.room_name + "&school_name=" + cTable.school_name + "&type=" + cTable.tpye_class
    url += "&city_id=" + city_id;
    url += "&area_id=" + area_id;
    window.location.href = url;
  })



$("#classTagBt").click(function() {
      //外面没选中的就清空弹窗
       var tags =  $("#classTag").find(".tag-selected");
       if(tags.length == 0){
          $(".tagTabContentWrap").each(function(index, item) {
              if (index > 0 ){
                element.tabDelete('classTagTab',index)
               }
          });
          $("#teachersTag").html("");   
          $("#classTagControl .tag").removeClass('active');
       }
      layer.open({
        type: 1,
        title:"设置课程",
        content: $('#classTagControl'),
        area:["800px","500px"],
        btn: ['确定', '取消'],
        yes: function(index, layero){
          var html = $("#teachersTag").html();
          $("#classTag").html(html);
          verify();
          layer.close(index); 
        }
      });
    })


//删除课程Tag
$("#classTag").on("click",".del",function(){
    $(this).parent().remove();
    //清空弹窗
    $(".tagTabContentWrap").each(function(index, item) {
        if (index > 0 ){
          element.tabDelete('classTagTab',index)
         }
    });
    $("#teachersTag").html("");   
    $("#classTagControl .tag").removeClass('active');
    verify();
})

//里面的
$("#teachersTag").on("click",".del",function(){
    $(this).parent().remove();
    //清空弹窗
    $(".tagTeacher").removeClass('active');
    cTable.verify();
})


//老师关联选择
  $("body").on("click","#classTagControl .tag",
    function(){
       if ($(this).hasClass('active')){
         return;
       }
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        var oder = $(this).parent().data("oder");
        if( oder == 0 ){
              var id = $(this).attr("data-id");
              api.ajaxGet("/api/getSubjectCodeList", {
                grade_id: id
              }, function(res) {
                if (res.type == "success") {
                  $(".tagTabContentWrap").each(function(index, item) {
                    if (index > 0) {
                      element.tabDelete('classTagTab',index)
                    }
                  }) 
                  var list = res.data.data.list;
                  var html = '';
                  for (var i = 0; i < list.length; i++) {
                      html += '<span class="tag" data-subject="' + list[i].ss_id + '" data-grade="' + id + '">' + list[i].ss_name + '</span>'
                  }
                  element.tabAdd('classTagTab', {
                    title: '学科',
                    content: '<div data-oder="1" class="tagTabContentWrap">'+html+'</div>',
                    id: 1
                  })
                  element.tabChange('classTagTab', 1);
                } else {
                  layer.msg("此年级下无学科",{icon:5})
                }
              })
           }
       if (oder == 1)   {
           var id = $(this).attr("data-id");
           var grade = $(this).attr("data-grade");
           var subject = $(this).attr("data-subject");
           var zh = $(this).text();
           var url = path.api + "/api/getSchoolTeacherList";
           api.ajaxGet(url,{school_id:cTable.school_id,grade:grade,subject:subject},function(res){
                 // console.log(res);
                if(res.type == "success"){
                    $(".tagTabContentWrap").each(function(index, item) {

                    if (index > 1) {
                      element.tabDelete('classTagTab',index)
                     }
                   }) 
                    var list = res.data.data.list;
                    var html = "";
                    for (var i = 0; i < list.length; i++) {
                      html += '<span class="tag tagTeacher" data-zh="' + zh + '" data-subject="' + subject + '" data-grade="' + grade + '" data-tecacher="' + list[i].st_encrypt_uid + '">' 
                      html += list[i].st_realname + '</span>'
                  }
                   element.tabAdd('classTagTab', {
                    title: '老师',
                    content: '<div data-oder="2" class="tagTabContentWrap">'+html+'</div>',
                    id: 2
                  })
                   element.tabChange('classTagTab', 2);
                }else{
                   layer.msg("此科目下无老师",{icon:5,time:500})
                }
           })
       } 
       if (oder == 2)   {
           var id = $(this).attr("data-tecacher");
           var grade = $(this).attr("data-grade");
           var subject = $(this).attr("data-subject");
           var zh = $(this).attr("data-zh");
           var text = $(this).text();
           var html = '<span class="tag-selected" data-teacher="' + id + '" data-grade="' + grade + '" data-subject="' + subject + '">'
               html +=   '<span class="inner">'+ num.Hanzi(grade) +'年级-'+zh +'-'+ '<span class="teacher_name">'+text+'</span>'+'</span>'     
               html +=       '<span class="del">×</span>'
               html +=   '</span>'
           $("#teachersTag").html(html);
       } 
   })

// ==========================教室弹窗===========================
$("#roomTagBt").click(function() {
     //外面没选中的就清空弹窗
       var tags =  $("#roomTag").find(".tag-selected");
       // console.log(tags.length)
       if(tags.length == 0){
          $(".tagTabContentWrap_room").each(function(index, item) {
              if (index > 0 ){
                element.tabDelete('classRoomTagTab',index)
               }
          });
          $("#roomsTag").html("");   
          $("#classRoomTagControl .tag").removeClass('active');

          //去掉不能选的城市
          var city_id = tools.queryString("city_id");
          $("#classRoomTagControl .tag").each(function(index, el) {
               if($(el).attr("data-id") == city_id){

               }else {
                 $(el).hide();
               }
          });
       }

      layer.open({
        type: 1,
        title:"接受教室",
        content: $('#classRoomTagControl'),
        area:["800px","500px"],
        btn: ['确定', '取消'],
        yes: function(index, layero){
          var html = $("#roomsTag").html();
          $("#roomTag").html(html);
          verify();
          layer.close(index); 
          
        }
      });
    })

//教室关联选择
  $("body").on("click","#classRoomTagControl .tag",
    function(){
       var school_id = tools.queryString("school_id");
       var area_id =  tools.queryString("area_id");
       var _this = this;
       $("#classRoomTagControl .tag")
       if ($(this).hasClass('active')){
         return;
       }
        var oder = $(this).parent().data("oder");
        if( oder == 0 ){
              var id = $(this).attr("data-id");
              // console.log(id);
              api.ajaxGet("/api/getAreaList", {
                area_id:id,
                type:3,
                node_id:area_id
              }, function(res) {
               // console.log(res);
                if (res.type == "success") {
                    $(_this).siblings().removeClass('active');
                    $(_this).addClass('active');
                  $(".tagTabContentWrap_room").each(function(index, item) {
                    if (index > 0) {
                      element.tabDelete('classRoomTagTab',index)
                    }
                  }) 
                  var list = res.data.data.list;
                  var html = '';
                  // console.log(list);
                  for (var i = 0; i < list.length; i++) {
                      html += '<span class="tag" data-area="' + id + '" data-area2="' + list[i].node_encrypt_id + '">' + list[i].node_name + '</span>'
                  }
                  element.tabAdd('classRoomTagTab', {
                    title: '县区',
                    content: '<div data-oder="1" class="tagTabContentWrap_room">'+html+'</div>',
                    id: 1
                  })
                  element.tabChange('classRoomTagTab', 1);
                } else {
                  layer.msg("此地区下无数据",{icon:5});
                }
              })
           }
       if (oder == 1)   {
           var area2 = $(this).attr("data-area2");
           // var area = $(this).attr("data-grade");
           var url = path.api+"/api/getSchoolListByAreaId";
           console.log(school_id)
           api.ajaxGet(url,{area_id:area2,school_id:school_id,is_all:1},function(res){
                 console.log(res);
                if(res.type == "success"){
                    $(_this).siblings().removeClass('active');
                    $(_this).addClass('active');
                    $(".tagTabContentWrap_room").each(function(index, item) {
                    if (index > 1) {
                      element.tabDelete('classRoomTagTab',index)
                     }
                   }) 
                    var list = res.data.data.list;
                    var html = "";
                    // console.log(list);

                    for (var i = 0; i < list.length; i++) {
                      if(list[i].school_encrypt_id == tools.queryString("school_id")){
                       
                      }else{
                          html += '<span class="tag" data-school="' + list[i].school_encrypt_id + '">' 
                          html += list[i].school_name + '</span>'
                      }
                  }
                   element.tabAdd('classRoomTagTab', {
                    title: '学校',
                    content: '<div data-oder="2" class="tagTabContentWrap_room">'+html+'</div>',
                    id: 2
                  })
                   element.tabChange('classRoomTagTab', 2);
                }else{
                   layer.msg("此地区下无学校",{icon:5,time:500})

                }
           })
       } 
      if (oder == 2)   {
           var school_id = $(this).attr("data-school");
           var school_name = $(this).text();
           var url = "/api/getRoomListBySchoolId";
          api.ajaxGet(url,{school_id:school_id,date:cTable.weekData},function(res){
                 // console.log(res);
                if(res.type == "success"){
                    $(_this).siblings().removeClass('active');
                    $(_this).addClass('active');
                    $(".tagTabContentWrap_room").each(function(index, item) {
                    if (index > 2) {
                      element.tabDelete('classRoomTagTab',index)
                     }
                   }) 
                    var list = res.data.data.list;
                    var html = "";
                    // console.log(list);
                    for (var i = 0; i < list.length; i++) {
                      html += '<span class="tag" data-class="' + list[i].sr_encrypt_id + '" data-school="' + school_id + '" data-schoolZb="' + school_name + '">' 
                      html += list[i].sr_name + '</span>'
                  }
                   element.tabAdd('classRoomTagTab', {
                    title: '教室',
                    content: '<div data-oder="3" class="tagTabContentWrap_room">'+html+'</div>',
                    id: 3
                  })
                   element.tabChange('classRoomTagTab', 3);
                }else{
                   layer.msg("此学校下无教室",{icon:5,time:500})
                }
           })
       } 

       if (oder == 3)   {
         var school_id = $(this).attr("data-school");
         var school_name = $(this).attr("data-schoolZb");
         var class_id = $(this).attr("data-class");
         var class_name = $(this).text();

          var url = "/api/getSchoolTeacherList";
          api.ajaxGet(url,{school_id:school_id},function(res){
                 // console.log(res);
                if(res.type == "success"){
                    $(_this).siblings().removeClass('active');
                    $(_this).addClass('active');
                    $(".tagTabContentWrap_room").each(function(index, item) {
                    if (index > 3) {
                      element.tabDelete('classRoomTagTab',index)
                     }
                   }) 
                    var list = res.data.data.list;
                    var html = "";
                    // console.log(list);
                  for (var i = 0; i < list.length; i++) {
                       var roomsTags =$("#roomsTag").find(".del");
                       if(roomsTags.length > 0){
                         roomsTags.each(function(index, el) {
                           var teacherid =  $(el).attr("data-teacher");
                           if( teacherid && teacherid == list[i].st_encrypt_uid){
                           }else {
                               html += '<span class="tag lastRoomTag"  data-class="'+ class_id +'" data-zn="' + list[i].st_realname + '"  data-teacher="'+ list[i].st_encrypt_uid+'" data-school="' + school_id + '"  data-schoolzh="'+ school_name +'" data-classZb="' + class_name + '">' 
                               html += list[i].st_realname + '</span>'
                           }
                        });
                       }else{
                           html += '<span class="tag lastRoomTag" data-class="'+ class_id +'"  data-zn="' + list[i].st_realname + '"   data-teacher="'+ list[i].st_encrypt_uid+'" data-school="' + school_id + '"   data-schoolzh="'+ school_name +'" data-classZb="' + class_name + '">' 
                           html += list[i].st_realname + '</span>'
                       }
                  }
                   element.tabAdd('classRoomTagTab', {
                    title: '老师',
                    content: '<div data-oder="4" class="tagTabContentWrap_room">'+html+'</div>',
                    id: 4
                  })
                   element.tabChange('classRoomTagTab',4);
                }else{
                   layer.msg("该学校无老师信息",{icon:5,time:500})
                }
           })
       } 
       if (oder == 4)   {
          if($(_this).hasClass('active')){
            return;
          }
          var length = $(_this).siblings('.active').length;
          if( length > 0 ) {
             layer.msg("此教室已有老师，请选择别的教室",{icon:5});
             return;
          }
         
          $(_this).addClass('active');
          var teacher = $(this).text();
          var school_id = $(this).attr('data-school');
          var teacher_id = $(this).attr("data-teacher");
          var schoolname = $(this).attr('data-schoolzh');
          var roomId = $(this).attr('data-class');
          var room = $(this).attr('data-classzb');
          var class_id = $(this).attr('data-class');
          var html = '<span class="tag-selected">'
              html +=        '<span class="inner">'+schoolname+'-'+room +'-'+ teacher +'</span>'
              html +=            '<span class="del" data-class="'+ roomId +'" data-teacher="'+teacher_id+'" data-school="'+ school_id +'">×</span>'
              html +=      '</span>'
          // console.log(html)    
         var selected = $("#roomsTag").find('.tag-selected');
         //最多选中3个;
         if(selected.length<3){
           $("#roomsTag").append(html); 
         }else{
            layer.msg("最多选择3个",{icon:5})
         }
       } 
   })

//里面的tag
$("#roomsTag").on("click",".del",function(){
    $(this).parent().remove();
    var thisTeacherId = $(this).attr("data-teacher");
    console.log(thisTeacherId);
    //去掉弹窗里面active
    $(".lastRoomTag").each(function(index, el) {
       if($(el).attr("data-teacher") == thisTeacherId){
         $(el).removeClass('active');
       }
    });
    verify();
})


//外面的tag
$("#roomTag").on("click",".del",function(){
    var tags = $("#roomTag").find(".del");
    var tagsIncontrol = $("#roomsTag").find(".tag-selected");
    var index = tags.index($(this));
    tagsIncontrol.eq(index).remove();
    $(this).parent().remove();
     console.log(tags.length)
    if(tags.length == 1){
        $(".tagTabContentWrap_room").each(function(index, item) {
            if (index > 0 ){
              element.tabDelete('classRoomTagTab',index)
             }
        });
        $("#roomsTag").html("");   
        $("#classRoomTagControl .tag").removeClass('active');
    }
   verify();
})




// ==========================自定义周===========================

//周选择自定义
  form.on('radio(week)', function(data){
      if(data.value == "cum"){
         $(".controlWeek").show();
         $("#weekTagbox").show();
      }else{
         $(".controlWeek").hide();
         $("#weekTagbox").hide();
         $("#weekTagbox").html("");
         //弹窗内的
         $("#tagWeekWrap .tag").removeClass('active');
      }
      verify();
    });  



 $("#weekTagBt").click(function(){
     layer.open({
        type: 1,
        title:"设置周",
        content: $('#classWeekTagControl'),
        area:["550px","500px"],
        btn: ['确定', '取消'],
        yes: function(index, layero){
          var actives = $("#tagWeekWrap").find(".active");
          if(actives.length > 0 ){
              var html = "";
              actives.each(function(index, el) {
                  var weekid =  $(el).attr("data-id");
                  html += '<span class="tag-selected">'
                  html +=       '<span class="inner" >第'+ num.Hanzi(weekid) +'周</span>'
                  html +=           '<span class="del" data-id="'+ weekid +'">×</span>'
                  html +=  '</span>'
              });
              $("#weekTagbox").html(html);
              layer.close(index); 
              verify();
          }else{
             layer.close(index); 
             verify();
          } 
        }
      });
 })


// 周tag删除
  $("#weekTagbox").on("click",".del",function(){
       $(this).parent().remove();
       var id = $(this).attr("data-id");
       $("#tagWeekWrap .tag").each(function(index, el) {
           var tagId = $(el).attr("data-id");
           // console.log(tagId);
           // console.log(id);
           if(id ==  tagId){
              $(el).removeClass('active');
           }
       });
       verify();
  })


//清空
 $("#clearConfigBt").click(function(){
     clearTag1();
     clearTag2();
     clearTag3();
    
 })




//验证是否可以点击添加
 function verify () {
    var tags1 = $("#classTag").find(".tag-selected").length;
    var tags2 = $("#roomTag").find(".tag-selected").length;
    if(tags1 && tags2) {
       var Weekradio = $('input[name="week"]:checked').val();
       if (Weekradio == "week" ||  Weekradio == "all"){
           cTable.verify_on  = true;
           cTable.readyAddui(true);
       }else if ( Weekradio == "cum"){
           var tags3 = $("#weekTagbox").find(".del");
              if(tags3.length == 0){
                 verify_on = false;
                 cTable.readyAddui(false); 
              }else {
                  verify_on  = true;
                  cTable.readyAddui(true); 
             }
       }
    }else{
          cTable.verify_on = false;
          cTable.readyAddui(false); 
    }
    return  cTable.verify_on;
  }



//清空3个tag
   function clearTag1() {
         $(".tagTabContentWrap").each(function(index, item) {
              if (index > 0 ){
                element.tabDelete('classTagTab',index)
               }
          });
          $("#teachersTag").html("");   
          $("#classTag").html("");
          $("#classTagControl .tag").removeClass('active');
          verify();
   }

    function clearTag2() {
         $(".tagTabContentWrap_room").each(function(index, item) {
              if (index > 0 ){
                element.tabDelete('classRoomTagTab',index)
               }
          });
          $("#roomsTag").html("");   
          $("#roomTag").html("");
          $("#classRoomTagControl .tag").removeClass('active');
          verify();
   }

  function clearTag3() {
         $("#tagWeekWrap .tag").removeClass('active');
         $("#weekTagbox").html("");
         $("input[value=all]").prop("checked",true);
         form.render("radio"); 
         $(".controlWeek").hide();
         verify();
   }

 
//z周选择样式
 function TagWeekUi(boolean){
   if(boolean){
     
   }else {
     $("#tagWeekWrap .tag").removeClass('active');
    }
 }

  $("body").on("click","#tagWeekWrap .tag",function(){
           if(!$(this).hasClass('active')){
             $(this).addClass('active');
           }else{
              $(this).removeClass('active');
           }
           
 });
})
