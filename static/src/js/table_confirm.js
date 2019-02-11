require(["layui","path","tools","num","api","cTable","boot-dropdown"],function(layui,path,tools,num,api,cTable){
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
      cTable.usrsfor = 2

      
      var city_id = tools.queryString("city_id");
      var area_id = tools.queryString("area_id");
       
      var is_on = false;
  
      //is_over为0 可以设置
      //is_over为1 不可以设置
      var is_over = "";
      // console.log(school_name);
      $(".schoolName").html(cTable.school_name);
      $(".roomName").html(cTable.room_name);
      cTable.studyTime(cTable.school_id,cTable.weekData);
     
     

    //切换周
$("body").on("click",".Add",function(){
      var currtWeek = $("#week").text();
      if(currtWeek == totWeek){
         return;
      }
      loading = layer.load(3);
      weekData = tools.nextWeek(weekData);
      studyTime (school_id,weekData);
})
  
$("body").on("click",".sub",function(){
      var currtWeek = $("#week").text();
      if(currtWeek == 1){
         return;
      }
      loading = layer.load(3);
      weekData = tools.prevWeek(weekData);
      studyTime (school_id,weekData);
})

$("#goToEdite").click(function(){
    var url = "/course/?school_id=" + cTable.school_id + "&room_id=" + cTable.room_id + "&weekData=" + cTable.weekData + "&term_id=" + cTable.term_id + "&week=" + cTable.week + "&room_name=" + cTable.room_name + "&school_name=" + cTable.school_name + "&type=" + cTable.tpye_class
    url += "&city_id=" + city_id;
    url += "&area_id=" + area_id;
    window.location.href = url;
})


$("#timeforopen").click(function(){
    if($(".filter").hasClass('hidde')){
         $(".filter").removeClass('hidde');
         $("#timeforopen").text("收起 临时开课")
         is_on = true;
         $(".addTitle").show();
    }else{
        $(".filter").addClass('hidde');
        $("#timeforopen").text("添加 临时开课")
        is_on = false;   
        $(".addTitle").hide();
    }
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
})

$("#teachersTag").on("click",".del",function(){
    $(this).parent().remove();
    //清空弹窗
    $(".tagTeacher").removeClass('active');
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
           api.ajaxGet(url,{school_id:school_id,grade:grade,subject:subject},function(res){
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
       var _this = this;
       if ($(this).hasClass('active')){
         return;
       }
      
        var oder = $(this).parent().data("oder");
        if( oder == 0 ){
              var id = $(this).attr("data-id");
              // console.log(id);
              api.ajaxGet("/api/getAreaList", {
                area_id:id,
                type:3
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
           var url = "/api/getSchoolListByAreaId";
           api.ajaxGet(url,{area_id:area2},function(res){
                 // console.log(res);
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
                      html += '<span class="tag" data-school="' + list[i].school_encrypt_id + '">' 
                      html += list[i].school_name + '</span>'
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
          api.ajaxGet(url,{school_id:school_id,date:weekData},function(res){
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

//清空
 $("#clearConfigBt").click(function(){
     clearTag1();
     clearTag2();
 })





// ==================================================================================

//验证是否可以添加课程


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
   }



//表头日期
 function formHeadtime(school_id,weekData){
    var titlesUrl = path.api+"/api/getWeekHoliday";
    var getData = {
          school_id:school_id,
          date:weekData,
          v:new Date().getTime()
        }
    api.ajaxGet(titlesUrl,getData,function(res){
       // console.log(res);
       if(res.type == "success") {
         var data = res.data.data;
         // console.log(data);
         holidays = [];
         isTodayStr = "";
         if(data.length > 0) {
            var html = "<th>午别</th><th>节次</th>";
             for(var i = 0;i<data.length;i++){
                   var str = i+1
                   var className = "";
                   if(data[i].is_holiday) {
                      holidays.push(str);
                      className ="holiday";
                   }
                   var weeks =  num.Hanzi(str) == '七' ? '日' : num.Hanzi(str) 
                   html += '<th class="'+ className +'" position="0,'+(i+1)+'">星期'+weeks+'<br/>'+ '<span class="date_time">'+data[i].date_time+'</span>'+'</th>'
             }
             $("#theadtr").html(html);
             // console.log(holidays);
         }
       }
     })
 }





//渲染学期和周
   function studyTime (school_id,weekData) {
    var WeeKurl =  path.api+"/api/getSchoolCourseTimeNode";

    var getData = {
          school_id:school_id,
          date:weekData,
          v:new Date().getTime()
     }  
    api.ajaxGet(WeeKurl,getData,function(res){

       if(res.type == "success") {
         var data = res.data.data;
         term_id = data.term_id;
         week = data.term_week;
         // console.log(data.term_week);
         totWeek = data.total_week;
         //渲染弹框里面内容
         var html = ""

         for(var i = week;i<totWeek+1;i++){
             var str = i
             html += '<span class="tag" data-id="'+ str +'">第'+ num.Hanzi(str) +'周</span>'
         }

         $("#tagWeekWrap").html(html);
         
         // console.log("studyTime"+week);
         $("#schoolTerm").html(data.year);
         $("#week_time").html(data.week_time);
         $("#totalweek").html(data.total_week);
         $("#week").text(data.term_week);
         formHeadtime(school_id,weekData);
         renderClassTd(school_id,weekData);
       }
     })
   }

  



//渲染上午下午管关联渲染课程
function renderClassTd(school_id,weekData){
   var WeeKurl =  path.api+"/api/getSchoolCourseTimeNode";
    var getData = {
      school_id:school_id,
      date:weekData,
      v:new Date().getTime()
     }
  api.ajaxGet(WeeKurl,getData,function(res){
       console.log(res);
       if(res.type == "success") {
         $("#tbody").html("");
         var data = res.data.data;
         var times = res.data.data.course_time_node;
         var down = data.noon_count.down;
         var up = data.noon_count.up;
         var uphtml;
         var downHtml;
         is_over = res.data.data.is_over;
         console.log(is_over);
         // console.log(up);
         // console.log(down);
         // console.log(times);
         if(times.length == 0){
          $("#tbody").html('<tr><td colspan="9" class="noneTd">此学校暂无课表信息~！</td></td>');
          $("#table_header").hide();
          $("#table_header_none").show();
           return;
         }
         $("#schoolTerm").html(data.year);
         $("#week_time").html(data.week_time);
         $("#week").text(data.term_week);
          $("#table_header").show();
          $("#table_header_none").hide();
         
         for(var i = 0;i<up;i++){
             if(i == 0){
                uphtml += '<td rowspan="'+ up+'" class="Bold">上午</td>';     
                uphtml += '<td>'+ num.Hanzi(i+1)+'</br>'+ '<span class="start_time">'+times[i].st_start_time +'-'+times[i].st_end_time +'</span>'+'</td>';
                for(var j =1; j<8 ;j++ ){
                 uphtml += '<td positon="'+(i+1)+','+j+'"></td>'
               }
             }else{
                uphtml += '<td>'+ num.Hanzi(i+1)+'</br>'+ '<span class="start_time">'+times[i].st_start_time +'-'+times[i].st_end_time  +'</span>'+'</td>';
                for(var j =1; j<8 ;j++ ){
                 uphtml += '<td positon="'+(i+1)+','+j+'"></td>'
               }
             }
              $("#tbody").append('<tr>'+ uphtml +'</tr>');
              uphtml = "";
         }
        
        for(var i = up;i<down+up;i++){
             if(i == up){
                uphtml += '<td rowspan="'+ down+'" class="Bold">下午</td>';     
                uphtml += '<td>'+ num.Hanzi(i+1)+'</br>'+'<span class="start_time">'+times[i].st_start_time +'-'+times[i].st_end_time +'</span>'+'</td>';
                for(var j =1; j<8 ;j++ ){
                 uphtml += '<td positon="'+(i+1)+','+j+'"></td>'
               }
             }else{
                uphtml += '<td>'+ num.Hanzi(i+1)+'</br>'+ '<span class="start_time">'+ times[i].st_start_time +'-'+times[i].st_end_time +'</span>'+'</td>';
                for(var j =1; j<8 ;j++ ){
                 uphtml += '<td positon="'+(i+1)+','+j+'"></td>'
               }
             }
              $("#tbody").append('<tr>'+ uphtml +'</tr>');
              uphtml = "";
         }
          
        //渲染假期效果
          ui_holiday();  

        //添加课程
         renderClass(school_id,room_id,term_id,type,week);
       }

     })
    
}


//渲染课程
    function renderClass  (school_id,room_id,term_id,type,week){
        var classUrl = path.api +"/api/getSchoolRoomCourcePlan";
       var getClassDate = {
             school_id:school_id,
             room_id:room_id,
             term_id:term_id,
             week:week,
             type:type,
             v:new Date().getTime()
          }
         api.ajaxGet(classUrl,getClassDate,function(res){
              // console.log(res);
              if(res.type == "success"){
                if ( res.data.length == 0 ){
                   layer.close(loading);
                   return;
                }
                 var list =  res.data.data.list;
                 for(var i = 0;i<list.length;i++){
                    var tr = list[i][0];        
                    if(tr){
                      for(var k = 0;k< tr.length;k++){
                         if(JSON.stringify(tr[k]) != "{}"){
                         var grade = num.Hanzi(tr[k].cn_grade)
                         var html =  '<div class="content">'+tr[k].cn_subject_chs + '</br>'
                             html += '( '+ tr[k].cn_sponsor_teacher_name +' )'+ '</br></div>'
                             html += '<span class="makeClassStatus_'+tr[k].cn_status +'">'+ num.makeClassStatus(tr[k].cn_status) +'</span>'
                             html +='<div class="info topInfo" data-id="'+ tr[k].cp_encrypt_id+'">'
                             html += '<div class="title">'
                             html +=      grade +'年级 '+ tr[k].cn_subject_chs
                             html +=      '</div>'
                             html +=      '<h5>主讲教室</h5>'
                             html +=     '<p>'+ tr[k].cn_sponsor_school_name+'</p>'
                             html +=     '<p>'+ tr[k].cn_sponsor_room_name +'</p>'
                             html +=     '<p>'+ tr[k].cn_sponsor_teacher_name+'</p>'
                             html +=      '<h5>接收教室</h5>' 
                             html +=     '<p>'+ tr[k].cn_receive_school+'</p>'
                             html +=     '<p>'+ tr[k].cn_receive_teacher+'</p>'
                             html +=     '<p>'+ tr[k].cn_receive_room+'</p>'
                             html +=      '<h5 style="color:green">'+ num.makeClassStatus(tr[k].cn_status)+'</h5>' 
                             // 判断时间是否可以设置
                             if( is_over == 0){
                               html +=      '<div class="confirMitem" cp_encrypt_id ="'+tr[k].cp_encrypt_id +'" day ="'+ (k+1) +'"><span class="yes">确认已开 <i class="fa fa-check"></i></span><span class="no">确认未开 <i class="fa fa-times"></i></span></div>' 
                             }
                             if(is_over == 1) {
                                html +=      '<div class="confirMitem" cp_encrypt_id ="'+tr[k].cp_encrypt_id +'" day ="'+ (k+1) +'">开课确认时间未到</div>' 
                             }
                             html +=     '<i class="i"></i>'
                             html +=     '</div>'
                             $("td[positon='"+(i+1)+","+(k+1)+"']").html(html);
                             
                         }
                       }
                    }
                   
                 }
                 hoverUi();
                 confirmBtcongfig();
                 layer.close(loading);
              }
             
         })
    }



//删除按钮
  function  confirmBtcongfig(){
        if($(".yes").length > 0){
           $(".confirMitem .yes").click(function(){
             var plan_id = $(this).parents(".confirMitem").attr("cp_encrypt_id");
             var geturl = path.api + "/api/confirmCoursePlan";
             var day = $(this).parents(".confirMitem").attr("day");
             console.log(geturl);
             api.ajaxGet(geturl,{plan_id:plan_id,day:day},function(res){
                if(res.type == "success") {
                   layer.msg("操作成功",{time:600});
                   studyTime (school_id,weekData);
                   formHeadtime(school_id,weekData);
                }
             })
             return false;
           })
        }
        if($(".confirMitem .no").length > 0){
           $(".confirMitem .no").click(function(){
             var plan_id = $(this).parents(".confirMitem").attr("cp_encrypt_id");
             var day = $(this).parents(".confirMitem").attr("day");
             var geturl = path.api + "/api/cancelCoursePlan";
             api.ajaxGet(geturl,{plan_id:plan_id,day:day},function(res){
                if(res.type == "success") {
                   layer.msg("操作成功",{time:600});
                   studyTime (school_id,weekData);
                   formHeadtime(school_id,weekData);
                }
             })
             return false;
           })
        }
      };





//节假日样式
function ui_holiday(){
    console.log(holidays);
    if(holidays.length>0){
     for(var i = 0;i<holidays.length;i++){
        $("td[positon$=',"+holidays[i]+"']").removeClass().addClass("holidayTd");
     }
    }
     if(isTodayStr){
        $("td[positon$=',"+isTodayStr+"']").removeClass().addClass("todayTd");
     }
 }

//详情悬浮样式
   function hoverUi(){
      $("td").hover(function() {

         var info = $(this).find(".info");
         var positon = $(this).attr("positon");
         var _this = this
         if(positon && info.length == 1){
            var wz = positon.split(",");
            if(wz[0] > 5){
                info.addClass('bottomInfo');
                info.removeClass('topInfo');
            }else{
               info.addClass('topInfo');
               info.removeClass('bottomInfo');
            }
            $(this).find(".content").css("color","#000");
            info.show();
         }
      }, function() {
        var info = $(this).find(".info");
        var _this = this;
         if(info.length == 1) {
             setTimeout(function(){
                $(_this).find(".content").css("color","#666");
                info.hide();
             },150)
         }
      });
   }

})
