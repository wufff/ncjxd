define(["layui", "num", "path", "api","tools"], function(layui, num, path, api,tools) {
  var layer = layui.layer;
  var $ = jQuery = layui.jquery;
  var loading;
  var my = {
    school_id: "",
    room_id: "",
    term_id: "",
    room_name: "",
    week: "",
    weekData: tools.fomartTime(new Date().getTime()/1000),
    totWeek: "",
    school_name: "",
    tpye_class: 0,
    holidays: [],
    isTodayStr: "",
    usrsfor:0,   //表格用途0只读， 1编辑，2开课；
    verify_on:false, //是否可以添加课程 验证开关
    panel_on:true, //是否可以添加课程 面板开关
    is_over:0, //是否过了确认期
    totClass:0, //总课程
    renderCumWeek:true,
    schoolType:1,  //1中心校   2教学点 判断渲染教室类型 
    renderClassRoom: function(school_id, weekData, callbcak) {
      loading = layer.load(3);
      var getData = {
        school_id: school_id,
        date: weekData,
        v: new Date().getTime()
      }
      var url = path.api + "/api/getRoomListBySchoolId";
      api.ajaxGet(url, getData, function(res) {
        var obj = {
           text:"渲染教室",
           res:res
        }
        // //console.log(obj);
        if (res.type == "success") {
          var list = res.data.data.list;
          var html = "";
          for (var i = 0; i < list.length; i++) {
            if (i == 0) {
              html += '<span class="active" data-id="' + list[i].sr_encrypt_id + '">' + list[i].sr_name + '</span>'
              //存储学校教室id和 教室名字
              my.room_id = list[i].sr_encrypt_id;
              my.room_name = list[i].sr_name;
            } else {
              html += '<span  data-id="' + list[i].sr_encrypt_id + '">' + list[i].sr_name + '</span>'
            }
          }
          $(".classRoom").html(html);
          //console.log(my.schoolType);
          if(my.schoolType == 1) {
              $(".classType").html('<span class="active" data-tpye="0">发起</span><span data-tpye="1">接收</span>');
              my.tpye_class = 0;
          }else {
              $(".classType").html('<span data-tpye="1" class="active">接收</span>');
              my.tpye_class = 1;
          }
      
         
          if (callbcak) {
            callbcak();
          }
        } else {
          var html = '<label style="font-weight: normal"></label>';
          layer.close(loading);
          $(".classRoom").html(html);
          $(".classType").html(html);
          haveClass(false);
        }
      })
    },
    studyTime: function(school_id, weekData) {
      loading = layer.load(3);
      var WeeKurl = path.api + "/api/getSchoolCourseTimeNode";
      var getData = {
        school_id: school_id,
        date: weekData,
        v: new Date().getTime()
      }
      api.ajaxGet(WeeKurl, getData, function(res) {
        var obj = {
          text: "学期和周",
          content: res
        }
        //console.log(obj);
        if (res.type == "success") {
           my.formHeadtime(my.school_id, my.weekData);
          var data = res.data.data;
          my.term_id = data.term_id;
          my.week = data.term_week;
          my.totWeek = data.total_week;
          $(".schoolName").text(my.school_name);
          if(my.usrsfor == 1 && my.renderCumWeek) { //如果是编辑 渲染自定义周
              var html = ""
              for(var i =my.week;i<my.totWeek+1;i++){
                   var str = i
                   html += '<span class="tag" data-id="'+ str +'">第'+ num.Hanzi(str) +'周</span>'
              }
             $("#tagWeekWrap").html(html);
             my.renderCumWeek = false;
          }
          $("#schoolTerm").html(data.year);
          $("#week_time").html(data.week_time);
          $("#totalweek").html(data.total_week);
          $("#week").text(data.term_week);
         
          // my.renderClassTd(my.school_id, my.weekData);
          haveClass(true);

          // 渲染上下午 ===========================================；
          var times = data.course_time_node;
          var down = data.noon_count.down;
          var up = data.noon_count.up;
          my.totClass = up + down;
          var uphtml;
          var downHtml;
          my.is_over = data.is_over;
          if (times.length == 0) {
            $("#tbody").html('<tr><td colspan="9" class="noneTd">此学校暂无课表信息~！</td></td>');
            $("#table_header").hide();
            $("#table_header_none").show();
            layer.close(loading);
            return;
          }
          $("#schoolTerm").html(data.year);
          $("#week_time").html(data.week_time);
          $("#week").text(data.term_week);
          $("#table_header").show();
          $("#table_header_none").hide();
          $("#tbody").html('');
           for(var i = 0;i<up;i++){
             if(i == 0){
                uphtml += '<td rowspan="'+ up+'" class="Bold">上午</td>';     
                uphtml += '<td>'+ num.Hanzi(i+1)+'</br>'+ '<span class="start_time">'+times[i].st_start_time +'-'+times[i].st_end_time +'</span>'+'</td>';
                for(var j =1; j<8 ;j++ ){
                 uphtml += '<td positon="'+(i+1)+','+j+'"><div class="classCell"></div></td>'
               }
             }else{
                uphtml += '<td>'+ num.Hanzi(i+1)+'</br>'+ '<span class="start_time">'+times[i].st_start_time +'-'+times[i].st_end_time  +'</span>'+'</td>';
                for(var j =1; j<8 ;j++ ){
                 uphtml += '<td positon="'+(i+1)+','+j+'"><div class="classCell"></div></td>'
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
                 uphtml += '<td positon="'+(i+1)+','+j+'"><div class="classCell"></div></td>'
               }
             }else{
                uphtml += '<td>'+ num.Hanzi(i+1)+'</br>'+ '<span class="start_time">'+ times[i].st_start_time +'-'+times[i].st_end_time +'</span>'+'</td>';
                for(var j =1; j<8 ;j++ ){
                 uphtml += '<td positon="'+(i+1)+','+j+'"><div class="classCell"></div></td>'
               }
             }

              $("#tbody").append('<tr>'+ uphtml +'</tr>');
              uphtml = "";
         } 
          //渲染假期效果
          setTimeout(function() {
            ui_holiday();
          }, 100)

          //添加课程
          my.renderClass(my.school_id, my.room_id, my.term_id, my.tpye_class, my.week,my.usrsfor);  
         
        } else if (res.type == "error") {
          layer.close(loading);
          haveClass(false);
        }
      })
    },
    formHeadtime: function(school_id, weekData) {            //表头日期(星期几/几月几号)
      var titlesUrl = path.api + "/api/getWeekHoliday";
      var getData = {
        school_id: school_id,
        date: weekData,
        v: new Date().getTime()
      }
      api.ajaxGet(titlesUrl, getData, function(res) {
        var obj = {
          text: "表头日期",
          res: res
        }
        //console.log(obj);
        if (res.type == "success") {
          var data = res.data.data;
          my.holidays = [];
          my.isTodayStr = "";
          if (data.length > 0) {
            var html = "<th>午别</th><th>节次</th>";
            for (var i = 0; i < data.length; i++) {
              var str = i + 1
              var className = "";
              var isToday = "";
              if (data[i].is_holiday) {
                my.holidays.push(str);
                className = "holiday";
              }
              if (data[i].is_today) {
                isToday = "today";
                my.isTodayStr = str;
              }

              var weeks = num.Hanzi(str) == '七' ? '日' : num.Hanzi(str)
              html += '<th id="' + isToday + '" class="' + className + '" position="0,' + (i + 1) + '"><div class="classCell">星期' + weeks + '<br/><span class="date_time">' + data[i].date_time + '</span></div></th>'
            }
            $("#theadtr").html(html);
          }
        }
      })
    },
    //渲染课程
    renderClass: function(school_id, room_id, term_id, type, week,userfor) {
      var classUrl = path.api + "/api/getSchoolRoomCourcePlan";
      var getClassDate = {
        school_id: school_id,
        room_id: room_id,
        term_id: term_id,
        week: week,
        type: type
      }
      api.ajaxGet(classUrl, getClassDate, function(res) {
        // //console.log(res);
        var obj = {
          text: "渲染课程",
          res: res
        }
        // //console.log(obj);
        if (res.type == "success") {
          if (res.data.data.list.length > 0) {
            var list = res.data.data.list;
            for (var i = 0; i < list.length; i++) {
              var tr = list[i][0];
              if (tr) {
                for (var k = 0; k < tr.length; k++) {
                  if (JSON.stringify(tr[k]) != "{}") {
                    var grade = num.Hanzi(tr[k].cn_grade)
                    var html = '<div class="content">' + tr[k].cn_subject_chs + '</br>'
                    html += '( ' + tr[k].cn_sponsor_teacher_name + ' )' + '</br></div>'
                    if ( my.usrsfor == 2) {
                       html += '<span class="makeClassStatus_'+tr[k].cn_status +'">'+ num.makeClassStatus(tr[k].cn_status) +'</span>'
                    }
                    html += '<div class="info topInfo"  data-id="' + tr[k].cp_encrypt_id + '">'
                    html += '<div class="title">'
                    html += grade + '年级 ' + tr[k].cn_subject_chs
                    html += '</div>'
                    // html += '<div  class="delitem2">'+grade + '年级 ' + tr[k].cn_subject_chs +'</div>'
                    html += '<h5>主讲教室</h5>'
                    html += '<p>' + tr[k].cn_sponsor_school_name + '</p>'
                    html += '<p>' + tr[k].cn_sponsor_room_name + '</p>'
                    html += '<p>' + tr[k].cn_sponsor_teacher_name + '</p>'
                    html += '<h5>接收教室</h5>'
                    html += '<p>' + tr[k].cn_receive_school + '</p>'
                    html += '<p>' + tr[k].cn_receive_teacher + '</p>'
                    html += '<p>' + tr[k].cn_receive_room + '</p>'
                    html += '<h5 class="cn_status_' + tr[k].cn_status + '" style="line-height:20px;">' + num.makeClassStatus(tr[k].cn_status) + '</h5>'
                    if (my.usrsfor == 1) {
                      html += '<div  class="delitem" cp_encrypt_id ="' + tr[k].cp_encrypt_id + '" day ="' + (k + 1) + '">删除</div>'
                    }
                    if(my.usrsfor == 2){ //确认开课两种情况
                       if( my.is_over == 0){
                              html +=      '<div class="confirMitem" cp_encrypt_id ="'+tr[k].cp_encrypt_id +'" day ="'+ (k+1) +'"><span class="yes">确认已开 <i class="fa fa-check"></i></span><span class="no">确认未开 <i class="fa fa-times"></i></span></div>' 
                          }
                       if(my.is_over == 1) {
                             html +=      '<div class="confirMitem" cp_encrypt_id ="'+tr[k].cp_encrypt_id +'" day ="'+ (k+1) +'">开课确认时间未到</div>' 
                       }
                    }
                    html += '<i class="i"></i>'
                    html += '</div>'
                    $("td[positon='" + (i + 1) + "," + (k + 1) + "']").find(".classCell").html(html);
                  }
                }
              }

            }
          }
          
          if(my.usrsfor == 1){  //编辑页面绑删除
             delcongfig();
             verifyUi_add ();
          }
          if(my.usrsfor == 2){  //确认页面绑开课确认
            confirmBtcongfig();
            verifyUi_add ();
          }
          hoverUi();
        }
        layer.close(loading);
      })
    },
    readyAddui:function(boolean){
     if(boolean){
        $("td").each(function(index, el) {
                      $(".steptitle").addClass('isReady');
                      if($(el).attr("positon")){
                        if(!$(el).hasClass('holidayTd')){
                          $(el).addClass('curhover')
                        }
                      }
             });
     }else{
         $(".steptitle").removeClass('isReady');
         $("td").removeClass('curhover')     
     } 
    } 
  }

 





  function  confirmBtcongfig(){
        if($(".yes").length > 0){
           $(".confirMitem .yes").click(function(){
             var plan_id = $(this).parents(".confirMitem").attr("cp_encrypt_id");
             var geturl = path.api + "/api/confirmCoursePlan";
             var day = $(this).parents(".confirMitem").attr("day");
             //console.log(geturl);
             api.ajaxGet(geturl,{plan_id:plan_id,day:day},function(res){
                if(res.type == "success") {
                   layer.msg("操作成功",{time:600});
                   my.studyTime (my.school_id,my.weekData);
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
                   my.studyTime (my.school_id,my.weekData);
                }
             })
             return false;
           })
        }
    };





  //删除按钮
  function  delcongfig(){
        if($(".delitem").length > 0){
           $(".delitem").click(function(){
             var id = $(this).attr("cp_encrypt_id");
             var day = $(this).attr("day");
             var url = path.api + "/api/delCoursePlan";
             var getData = {
                 plan_id:id,
                 day:day
             }
             api.ajaxGet(url,getData,function(res){
                    // layer.msg("删除成功!",{time:800});
                    if(res.type == "success"){
                         my.studyTime (my.school_id,my.weekData);
                    }
             })
             return false;
           })
        }
  };
  //无教室的不同渲染
  function haveClass(boonlean) {
    if (boonlean) {
      $("#table_header_none").hide();
      $("#table_header").show();
      $(".noneTd2").hide();
    } else {
      $("#table_header_none").show();
      $("#table_header").hide();
      $("#tbody").html('<tr><td colspan="9" class="noneTd">暂无课表信息~！</td></td>');
       $(".noneTd2").hide();
    }
  }
 //假期ui
  function ui_holiday() {
    // //console.log(holidays);
    if (my.holidays.length > 0) {
      for (var i = 0; i < my.holidays.length; i++) {
        $("td[positon$='," + my.holidays[i] + "']").removeClass().addClass("holidayTd");
      }
    }
    if (my.isTodayStr) {
      $("td[positon$='," + my.isTodayStr + "']").removeClass().addClass("todayTd");
    }
  }
 //课程ui
  // function hoverUi(){
  //     $("td").hover(function() {
  //        var info = $(this).find(".info");
  //        var positon = $(this).attr("positon");
  //        var _this = this
  //        if(positon && info.length == 1){
  //           var wz = positon.split(",");
  //           if(wz[0] > 5){
  //               info.addClass('bottomInfo');
  //               info.removeClass('topInfo');
  //           }else{
  //              info.addClass('topInfo');
  //              info.removeClass('bottomInfo');
  //           }
  //           $(this).find(".content").css("color","#000");
  //           info.show();
  //        }
  //     }, function() {
  //       var info = $(this).find(".info");
  //       var _this = this;
  //        if(info.length == 1) {
  //            setTimeout(function(){
  //               $(_this).find(".content").css("color","#666");
  //               info.hide();
  //            },400)
  //        }
  //     });
  //  }
  function hoverUi() {
      var color;
      $("td").mouseenter(function(event) {
          var info = $(this).find(".info");
          var positon = $(this).attr("positon");
          var _this = this
         if(positon && info.length == 1){
            var wz = positon.split(",");
            var x = my.totClass - 2;
            if(wz[0] > x){
                info.addClass('bottomInfo');
                info.removeClass('topInfo');
            }else{
               info.addClass('topInfo');
               info.removeClass('bottomInfo');
            }
            if(wz[1] < 3){
                info.addClass('leftInfo');
                info.removeClass('rightInfo');
            }else{
               info.addClass('rightInfo');
               info.removeClass('leftInfo');
            }
            color = $(this).css("background");
            $(this).css("background","#fff0d7");
            // alert(info.html());
            // $(".infoTitle").css("color","#fbb432eb");
            info.show();
         }
      });
     $("td").mouseleave(function(event) {
        var info = $(this).find(".info");
        var _this = this;
         if(info.length == 1) {
            $(_this).css("background",color);
            info.hide();
         }
     }); 

     $(".info").click(function(){
        return false;
     })
  }
   //验证UI
   function verifyUi_add (){
      if (my.verify_on){
         my.readyAddui(true);
      }else{
         my.readyAddui(false);
      }
   }
  
//================================操作==================
//切换周
  $("body").on("click", ".Add", function() {
    var currtWeek = $("#week").text();
    if (currtWeek == my.totWeek) {
      return;
    }
    my.weekData = tools.nextWeek(my.weekData);
    my.studyTime(my.school_id, my.weekData);
  })


  $("body").on("click", ".sub", function() {
    var currtWeek = $("#week").text();
    if (currtWeek == 1) {
      return;
    }
    my.weekData = tools.prevWeek(my.weekData);
    my.studyTime(my.school_id, my.weekData);
  })


 



  //用户添加课程

$("body").on("click","td",function(){
        //非编辑状态点击编辑无效
        if(my.usrsfor == 0){
              return;
        }

        //拦截假期
       if($(this).hasClass('holidayTd')){
         return;
       }
      if($(this).attr("positon")){
         var _this = this;
         var  v = my.verify_on;
         var str = '确定添加课程吗?';
         if($(_this).find(".info").length > 0){
               var str = "确定替换课程吗？"
           }

         if(v){
             //在今天以前的时间拦截
            var positon = $(_this).attr("positon").split(",");
            var currtTd = $('th[position="0,'+ positon[1]+'"]').find('.date_time').text();
            var thisTime = currtTd.replace(/-/g, '/');
            var time1 = new Date(thisTime);
            var currtTime = time1.getTime();
            var nowTime =Date.parse(new Date());
            // if ( currtTime < nowTime) {
            //    layer.msg("只能添加今天以后的课程",{icon:5});
            //    return;
            // } 
           layer.confirm(str, {icon: 3, title:'提示'}, function(index){
            var getData = {};
            var tags1 = $("#classTag").find(".tag-selected");
            var tags2 = $("#roomTag").find(".tag-selected");
            var positon = $(_this).attr("positon").split(",");
            var time_solt = $(_this).parent("tr").find(".start_time").text();
            //周选择
            var Weekradio = $('input[name="week"]:checked').val();
            var weekValue = "";
            var teacher_ids = [];
            var school_ids = [];
            var class_ids = [];
            var sdate = new Date(Date.parse(currtTd.replace(/-/g, "/")));
            var nextDate = currtTime;
            var Weekradio = $('input[name="week"]:checked').val();
            // //console.log(sdate);
            // //console.log(nextDate);

            if(Weekradio == "all"){
                var weekArry = [];
                for(var i = 0;i<my.totWeek;i++){
                   weekArry.push(i+1);
                }
               weekValue=weekArry.join("|");
            }
            if( Weekradio == "week"){
                  weekValue = my.week;
            }
            if(Weekradio == "cum"){
              var weekArry = [];
               //拦截自定义未选择周
             var tags3 = $("#weekTagbox").find(".tag-selected");
             //console.log(tags3);
             tags3.find(".del").each(function(index, el) {
                   var id = $(el).attr("data-id");
                   weekArry.push(id);
                   //配合后台修改自定义周对teday的赋值
                   if(index == 0){
                       var lang = id - my.week;
                       if(lang != 0){
                          my.weekData = tools.nextWeekPei(my.weekData,lang)
                       }
                   }
                });
                weekValue=weekArry.join("|");
                //console.log(weekValue);
            }

            // 授课学校集合
             tags2.find(".del").each(function(index, el) {
                 var teacherid = $(el).attr("data-teacher");
                 var schoolid = $(el).attr("data-school");
                 var classId = $(el).attr("data-class");
                  class_ids.push(classId);
                  school_ids.push(schoolid);
                  teacher_ids.push(teacherid);
             });

            //判断修改还是新增
           if($(_this).find(".info").length > 0){
                  getData.node_id = $(_this).find(".del").attr("cp_encrypt_id");
           }else{
                  getData.node_id = "";
           }
            getData.school_id = my.school_id;
            getData.school_name = my.school_name;
            getData.room_id = my.room_id;
            getData.room_name = my.room_name;
            getData.subejct=tags1.attr("data-subject");
            getData.teacher_id=tags1.attr("data-teacher");;
            getData.teacher_name=tags1.find(".teacher_name").text();
            getData.grade=tags1.attr("data-grade");
            getData.term_id = my.term_id;
            getData.week=weekValue;  //多个|隔开
            getData.time_solt=time_solt; // 课时:08:00-09:00
            getData.time_sort =positon[0]; //序号
            getData.day=positon[1];        //星期几
            getData.receive_school_id = school_ids.join("|");  //学校id
            getData.receive_room_id = class_ids.join("|");
            getData.receive_teacher_id = teacher_ids.join("|");;
            getData.today=currtTd;  //课程计划时间戳；
            getData.type = my.tpye_class;
            var url = path.api + "/api/setSchoolRoomCourcePlan";
            // //console.log(getData);
            api.ajaxGet(url,getData,function(res){
                   //console.log(res);
                   if (res.type == "success"){
                      layer.msg("操作成功！");
                      my.studyTime (my.school_id,my.weekData);
                   }else{
                      layer.msg(res.message,{icon:5});
                   }
            })
          })
         }else{
           // layer.msg("完善顶部配置，即可添加课程",{icon:5})
         }
      }
  }) 
  
    return my;
})