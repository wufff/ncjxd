require(["layui", "path", "downList", "tools", "num", "api", "cTable", "boot-dropdown"], function(layui, path, downList, tools, num, api, cTable) {
  var layer = layui.layer;
  var form = layui.form;
  var $ = jQuery = layui.jquery;
  var laydate = layui.laydate;
  var loading;
 
  var class_isCenter;
  //是否可以修改时间
  var st_is_modify;
  //设置确认时间
  var studytype ="";
  var commitTitle = "";
  //权限控制 0省 1市 2县 3学校
  var city_id_authority = $("#city_id").val();
  var town_id_authority = $("#town_id").val();
  var school_id_authority = $("#school_id").val();
  var is_center_school = $("#is_center_school").val();
  var authority = 0;
  //权限控制 显示开课
  var c20c30 = $("#c20c30").val();



//设置权限 ==============================================================================================================================

  if (school_id_authority && school_id_authority != 0) {

    authority = 3;
  } else if (town_id_authority && town_id_authority != 0) {

    authority = 2;
  } else if (city_id_authority && city_id_authority != 0) {

    authority = 1;
  }

  console.log("权限" + authority)
  switch (authority) {
    case 1:
      city_id = city_id_authority;
      var url = "/api/getAreaList";
      var getData = {
        area_id: city_id_authority,
        type: 3,

      }
      api.ajaxGet(url, getData, function(res) {
        console.log(res);
        if (res.type == "success") {
          var list = res.data.data.list;
          var html = '<option value="">请选择</option>';
          for (var i = 0; i < list.length; i++) {
            html += '<option value="' + list[i].node_encrypt_id + '">' + list[i].node_name + '</option>'
          }
          $("select[name=area]").html(html);
          $("select[name=area]").val("");
          form.render('select');
        }
      })
      break;
    case 2:
      town_id = town_id_authority;
      city_id = city_id_authority;
      var url = "/api/getAreaList";
      var getData = {
        area_id: city_id_authority,
        type: 3,
        node_id: town_id_authority
      }
      api.ajaxGet(url, getData, function(res) {
        console.log(res);
        if (res.type == "success") {
          var list = res.data.data.list;
          var html = '';
          for (var i = 0; i < list.length; i++) {
            html += '<option value="' + list[i].node_encrypt_id + '">' + list[i].node_name + '</option>'
          }
          $("select[name=area]").html(html);
          form.render('select');
        }
      })

      var getData2 = {
        area_id: town_id_authority,
        is_all: is_center_school
      }

      var url2 = path.api + "/api/getSchoolListByAreaId";
      api.ajaxGet(url2, getData2, function(res) {
        // console.log(res);
        if (res.type == "success") {
          var list = res.data.data.list;
          var html = '<option value="">请选择</option>';
          for (var i = 0; i < list.length; i++) {
            html += '<option value="' + list[i].school_encrypt_id + '">' + list[i].school_name + '</option>'
          }
          $("select[name=school]").html(html);
          $("select[name=school]").val("");
          form.render('select');
        } else {
          $("select[name=school]").html('<option value="">此地区无数据</option>');
          form.render('select');
        }
      })
      break;
    case 3: //学校管理员
      cTable.school_id = school_id_authority;
      cTable.school_name = $("#school_name").val();
      city_id = city_id_authority;
      town_id = town_id_authority;
      var url = "/api/getAreaList";
      var schoolvalue = cTable.school_id + '|' + is_center_school;
      downList.renderArea(city_id_authority, town_id_authority, town_id_authority);
      downList.renderShool(town_id_authority,schoolvalue,cTable.school_id,is_center_school);
      // $("select[name=school]").val(schoolvalue);
      // console.log(text);
       cTable.renderClassRoom(cTable.school_id, cTable.weekData, function() {
            cTable.studyTime(cTable.school_id, cTable.weekData);
      });
      break;
    default:
      break;
  }

  if (c20c30 == 0) {
    $(".configConfirmTimeBt").parents("li").css("display", "none");
  }
  //判断editeFormWrap,根据两个维度 1.身份是可以is_center_school，2 选择的学校是否是中心校 class_isCenter

  if (is_center_school == 0) {
    $(".editeFormWrap").hide();
  }


  //设置权限 结束==============================================
  form.on('select(city)', function(data) {
    if ($("#selectCity").find("option").length < 3) {
      return;
    } else if (data.value == "") {
      intInfo();
      $("select[name=area]").html('<option value="">请先选择市</option>');
      form.render('select');
      city_id = data.value;
      $("#inputText").val("");
    } else {
      intInfo();
      downList.renderArea(data.value)
      city_id = data.value;
      $("#inputText").val("");
      $("#rebox").hide();
    }
  });

  form.on('select(area)', function(data) {
    if ($("#area").find("option").length < 3) {
      return;
    } else if (data.value == "") {
      intInfo();
      $("select[name=school]").html('<option value="">请先选择地区</option>');
      form.render('select');
      town_id = data.value;
      $("#inputText").val("");
      $("#rebox").hide();
    } else {
      town_id = data.value;
      downList.renderShool(data.value);
    }
    $("#inputText").val("");
  });


  form.on('select(school)', function(data) {
    var ele = data.elem;
    $("#inputText").val("");
    var text = $(ele).find("option:selected").text();
    cTable.school_name = text;
    cTable.school_id = data.value.split("|")[0];
    class_isCenter = data.value.split("|")[1];
    if (data.value != "") {
      $(".schoolName").text(cTable.school_name);
    } else {
      $(".schoolName").text("");
    }

    if (class_isCenter == 1 && is_center_school != 0) {
      $(".editeFormWrap").show();
    } else {
      $(".editeFormWrap").hide();
    }

    //先有教室才有教室id;
    cTable.renderClassRoom(cTable.school_id, cTable.weekData, function() {
      cTable.studyTime(cTable.school_id, cTable.weekData);
    });
  });

   function intInfo(){
     $(".classRoom").html(" ");
     $(".classType").html(" ");
     $("#schoolTerm").html(" ");
     $("#week_time").html(" ");
     $("#week").text(" ");
     $("#tbody").html('<tr><td colspan="9" class="noneTd">请选择学校查询对应课表~！</td></td>');
     $("#table_header").hide(); 
     $(".schoolName").text("");
   }




  //快速搜索
  $("#searchBt").click(function() {
    var keyword = $("#inputText").val();
    if (keyword) {
      var url = path.api + "/api/getSchoolAreaData";
      api.ajaxGet(url, {
        keyword: keyword
      }, function(res) {
        if (res.type == "success") {
          var list = res.data.data;
          console.log(list);
          var length = list.length;
          var html = '<option value="" disabled>' + length + '条 搜索结果</option>';
          for (var i = 0; i < list.length; i++) {
            html += '<option value="' + list[i].city_id + '|' + list[i].county_id + '|' + list[i].school_encrypt_id + '|' + list[i].school_classify + '">' + list[i].school_name + '</option>'
          }

          $("select[name=ssrez]").html(html);
          $("select[name=ssrez]").val("");
          form.render('select');
        } else {
          $("select[name=ssrez]").html('<option value="">0 条搜索结果</option>');
          form.render('select');
        }
        $("#rebox").show();
      })
    }
    return false;
  })

  $("#inputText").focus(function(event) {
    $("#rebox").hide();
  });
  $("#inputText").change(function() {
    $("#rebox").hide();
  })

  form.on('select(ssrez)', function(data) {
    // console.log(data.value)
    if (data.value) {
      var text = $("select[name=ssrez]").find("option:selected").text();
      cTable.school_name = text;
      $(".schoolName").text(cTable.school_name);
      $("#inputText").val(text);
      var arry = data.value.split('|');
      var cityId = arry[0];
      var area = arry[1];
      cTable.school_id = arry[2];
      var classify = arry[3];
      $("select[name=city]").val(cityId);
      downList.renderArea(cityId, area);
      downList.renderShool(area, cTable.school_id + '|' + classify);
      form.render('select');
      cTable.renderClassRoom(cTable.school_id, cTable.weekData, function() {
        cTable.studyTime(cTable.school_id, cTable.weekData);
      });
    } else {
      $("#inputText").val("");
    }
    $("#rebox").hide();
  });

  


  //切换教室
  $(".classRoom").on("click", "span", function() {
    if ($(this).hasClass("active")) {
      return;
    }
    cTable.room_id = $(this).attr("data-id");
    cTable.room_name = $(this).text();
    $(this).siblings("span").removeClass('active');
    $(this).addClass('active');
    cTable.studyTime(cTable.school_id, cTable.weekData);
  })



  //发起接受切换
  $(".classType").on("click", "span", function() {
    if ($(this).hasClass("active")) {
      return;
    }
     cTable.tpye_class = $(this).attr("data-tpye");

    if (cTable.tpye_class == 1) {
      // $(".editeFormWrap").css("visibility","hidden");
      $(".editeFormWrap").hide();
    } else {
      // $(".editeFormWrap").css("visibility","visible");

      var value =  $("select[name=school]").val().split('|');
      class_isCenter = value[1];
      if (class_isCenter == 1 && is_center_school != 0) {
        $(".editeFormWrap").show();
      } else {
        $(".editeFormWrap").hide();
      }
    }
    $(this).siblings("span").removeClass('active');
    $(this).addClass('active');
    cTable.studyTime(cTable.school_id, cTable.weekData);
  })


  //去编辑课表
  $("#goToEdite").click(function() {
    var url = "/course/edit?school_id=" + cTable.school_id + "&room_id=" + cTable.room_id + "&weekData=" + cTable.weekData + "&term_id=" + cTable.term_id + "&week=" + cTable.week + "&room_name=" + cTable.room_name + "&school_name=" + cTable.school_name + "&type=" + cTable.tpye_class
    url += "&city_id=" + $("#selectCity").val();
    url += "&area_id=" + $("#area").val();
    window.location.href = url;
  })
  $("#goToConfirm").click(function() {
    var url = "/course/confirm?school_id=" + cTable.school_id + "&room_id=" + cTable.room_id + "&weekData=" + cTable.weekData + "&term_id=" + cTable.term_id + "&week=" + cTable.week + "&room_name=" + cTable.room_name + "&school_name=" + cTable.school_name + "&type=" + cTable.tpye_class
    url += "&city_id=" + $("#selectCity").val();
    url += "&area_id=" + $("#area").val();
    window.location.href = url;
  })

  //======================编辑上课时间弹窗===================

  // 未设置时候给出默认框
  $(".uptimeInput").each(function(index, el) {
    if (index == 0) {
      var value = "8:00 - 8:45"
    }
    if (index == 1) {
      var value = "9:00 - 9:45"
    }
    if (index == 2) {
      var value = "10:00 - 10:45"
    }
    if (index == 3) {
      var value = "11:00 - 11:45"
    }

    laydate.render({
      elem: "#" + $(el).attr("id"),
      type: 'time',
      format: 'HH:mm',
      btns: ['confirm'],
      ready: tools.formatminutesUp,
      range: '-',
      value: value
    });

  });
  $(".downtimeInput").each(function(index, el) {
    if (index == 0) {
      var value = "14:00 - 14:45"
    }
    if (index == 1) {
      var value = "15:00 - 15:45"
    }
    if (index == 2) {
      var value = "16:00 - 16:45"
    }

    laydate.render({
      elem: "#" + $(el).attr("id"),
      type: 'time',
      format: 'HH:mm',
      btns: ['confirm'],
      ready: tools.formatminutesDown,
      range: '-',
      value: value
    });

  });



  $(".configClassTimeBt").click(function() {
    var url = path.api + "/api/getLastTermSchoolCourseTime";
    api.ajaxGet(url, {
      school_id: cTable.school_id
    }, function(res) {
      console.log(res);
      if (res.type == "success") {
        var list = res.data.data.time_info;
        st_is_modify = res.data.data.st_is_modify ? res.data.data.st_is_modify : 2;
        if (list && list.length > 0) {
          var up = res.data.data.noon_count.up;
          var down = res.data.data.noon_count.down;
          console.log(st_is_modify);
          var tat = up + down;
          //渲染上午
          $(".up").html("");
          for (var i = 0; i < up; i++) {
            var id = 'uptimebox_' + (i + 1);
            var s = list[i].st_start_time;
            var l = list[i].st_end_time;
            var value = s + " " + "-" + " " + l
            var html = '<div class="item">'
            html += '<span>节次：</span>'
            html += '<span sort ="' + (i + 1) + '">' + num.Hanzi(i + 1) + '</span>'
            html += '<span class="timebox">设置时间：'
            html += '<input type="text" name="sort1_start" class="layui-input timeInput" id="' + id + '">'
            html += '</span>'
            html += '</div>'
            $(".up").append(html);
            laydate.render({
              elem: '#' + id,
              type: 'time',
              format: 'HH:mm',
              btns: ['clear', 'confirm'],
              ready: tools.formatminutesUp,
              range: '-',
              value: value
            });

          }
          //渲染下午
          $(".down").html("");
          for (var i = up; i < tat; i++) {
            var id = 'downtimebox_' + (i + 1 - up);
            var s = list[i].st_start_time;
            var l = list[i].st_end_time;
            var value = s + " " + "-" + " " + l
            var html = '<div class="item">'
            html += '<span>节次：</span>'
            html += '<span sort ="' + (i + 1 - up) + '">' + num.Hanzi(i + 1 - up) + '</span>'
            html += '<span class="timebox">设置时间：'
            html += '<input type="text" name="sort1_start" class="layui-input timeInput" id="' + id + '">'
            html += '</span>'
            html += '</div>'
            $(".down").append(html);
            laydate.render({
              elem: '#' + id,
              type: 'time',
              format: 'HH:mm',
              btns: ['confirm'],
              ready: tools.formatminutesDown,
              range: '-',
              value: value
            });

          }

        }
        //st_is_modify 0 计划中  1 可以 2学期不存在
        if (st_is_modify == 0) {
          $(".timeInput").attr("disabled", true);
          $("#titlePont").text("课程在计划中,暂时不能修改时间");
          $("#titlePont").show();
          $("#upAddbt").hide();
          $("#downAddbt").hide();
        } else if (st_is_modify == 2) {
          $(".timeInput").attr("disabled", true);
          $("#titlePont").text("不能设置上课时间，因为没有设置学期，请先设置学期");
          $("#titlePont").show();
          $("#upAddbt").hide();
          $("#downAddbt").hide();
        } else {
          $(".timeInput").attr("disabled", false);
          $("#titlePont").hide();
          $("#upAddbt").show();
          $("#downAddbt").show();
        }

      }
    })
    layer.open({
      type: 1,
      title: "设置上课时间",
      content: $('#controlstudyTime'),
      area: ["500px", "600px"],
      btn: ["确认", "取消"],
      yes: function(index, layero) {

        if (st_is_modify == 0 || st_is_modify == 2) {
          //不能设置直接return;
          layer.close(index);
          return;
        }
        var array = [];
        $(".timeInput").each(function(index, el) {
          var value = $(el).val();
          var str = value.replace(/\s*/g, "");
          array.push(str);
        });
        var url = path.api + "/api/setTermSchoolCourseTime";
        api.ajaxGet(url, {
          term_id: cTable.term_id,
          times: array.join(","),
          school_id: cTable.school_id
        }, function(res) {
          console.log(res);
          if (res.type == "success") {
            layer.msg("设置成功", {
              time: 600
            });
            layer.close(index);
            cTable.studyTime(cTable.school_id, cTable.weekData);
          }
        })
      }
    });
  })


  $("#upAddbt").click(function() {
    var length = $(".up").find(".item").length;
    if (length == 5) {
      layer.msg("已达上线", {
        icon: 5
      });
      return;
    }
    var id = 'uptimebox_' + (length + 1);
    var html = '<div class="item">'
    html += '<span>节次：</span>'
    html += '<span sort ="' + (length + 1) + '">' + num.Hanzi(length + 1) + '</span>'
    html += '<span class="timebox">设置时间：'
    html += '<input type="text" name="sort1_start" class="layui-input timeInput" id="' + id + '">'
    html += '</span>'
    html += '<span>'
    html += '<button class="layui-btn layui-btn-sm layui-btn-primary del">-</button>'
    html += '</span>'
    html += '</div>'
    $(".up").append(html);
    laydate.render({
      elem: '#' + id,
      type: 'time',
      format: 'HH:mm',
      btns: ['confirm'],
      ready: tools.formatminutesUp,
      range: '-',
      value: '11:00 - 11:45'
    });
  })

  $("#downAddbt").click(function() {
    var length = $(".down").find(".item").length;
    if (length == 9) {
      layer.msg("已达上线", {
        icon: 5
      });
      return;
    }


    var id = 'downtimebox_' + (length + 1);
    var html = '<div class="item">'
    html += '<span>节次：</span>'
    html += '<span sort ="' + (length + 1) + '">' + num.Hanzi(length + 1) + '</span>'
    html += '<span class="timebox">设置时间：'
    html += '<input type="text" name="sort1_start" class="layui-input timeInput" id="' + id + '">'
    html += '</span>'
    html += '<span>'
    html += '<button class="layui-btn layui-btn-sm layui-btn-primary del">-</button>'
    html += '</span>'
    html += '</div>'
    $(".down").append(html);
    laydate.render({
      elem: '#' + id,
      type: 'time',
      format: 'HH:mm',
      btns: ['confirm'],
      ready: tools.formatminutesDown,
      range: '-',
      value: '16:00 - 16:45'
    });
  })



  $("#controlstudyTime").on("click", ".del", function() {
    $(this).parents(".item").remove();
  })



  //======================编辑学期弹窗===================

  $(".configStudeyTimeBt").click(function() {
    initstudyTimelang();
    redenerHoildForm();
    layer.open({
      type: 1,
      title: "设置学期",
      content: $('#controlstudyTimelang'),
      area: ["900px", "600px"],
      btn: ["确认", "取消"],
      yes: function(index, layero) {
        layer.close(index);
      }
    });
  })

function initstudyTimelang() {
    laydate.render({
      elem: '#holidayStart_time',
      calendar: true
    });
    laydate.render({
      elem: '#holidayEnd_time',
      calendar: true
    });
// 初始化学期弹窗
    var url = path.api + "/api/getSchoolTermWeek";
    api.ajaxGet(url, {
      school_id: cTable.school_id
    }, function(res) {
      console.log(res);
      if (res.type == "success") {
        var list = res.data.data;
        $(".studyTime_title").html(list.title);
        var start_time = list.term_time.start_time.slice(0, 10);
        var end_time = list.term_time.end_time.slice(0, 10);
        var range_start = list.term_range_time.start_time;
        var range_end = list.term_range_time.end_time;
        laydate.render({
          elem: '#studyStart_time',
          value: start_time,
          min:  range_start,
          max: range_end
        });

        laydate.render({
          elem: '#studyEnd_time',
          value: end_time,
          min: range_start,
          max: range_end
        });
       
      } else {
        layer.mag(res.message);
      }
    })
  }



  //设置学校学期
  $("#addtimedaysbt").click(function() {
    var Start_time = $("#studyStart_time").val();
    var End_time = $("#studyEnd_time").val();
    if (Start_time && End_time) {
      var url = "/api/setSchoolTerm";
      var getData = {
        start_time: Start_time,
        end_time: End_time,
        school_id: cTable.school_id
      }

      api.ajaxGet(url, getData, function(res) {
        console.log(res);
        if (res.type == 'success') {
          layer.msg("设置成功", {
            time: 800
          })
        } else {
          layer.msg(res.message, {
            icon: 5
          })
        }
      })
    }
  })



  //学校设置假日
  $("#addHolidaysbt").click(function() {
    var holiday = $("#holiday").val();
    var End_time = $("#holidayEnd_time").val();
    var Start_time = $("#holidayStart_time").val();
    if (holiday && End_time && Start_time) {
      var getData = {
        start_time: Start_time,
        end_time: End_time,
        holiday: holiday
      }
      var url = '/api/setSchoolHoliday'
      api.ajaxGet(url, getData, function(res) {
        if (res.type == "success") {
          layer.msg("设置成功", {
            time: 800
          });
          redenerHoildForm();
          $("#holiday").val("");
          $("#holidayEnd_time").val("");
          $("#holidayStart_time").val("");
        }else{
           layer.msg(res.message,{icon:5});
        }
      })
    } else {
      layer.msg("输入信息不完整！~", {
        icon: 5
      })
    }
  });

  //删除假期 
  $("#holidayTbody").on("click", ".del", function() {
    var url = path.api + "/api/delSchoolHolidayData";
    var id = $(this).attr("id");
    // console.log(cTable.school_id);
    var getData = {
      holiday_id: id,
      school_id: cTable.school_id
    }
    api.ajaxGet(url, getData, function(res) {
      if (res.type == "success") {
        layer.msg("删除成功", {
          time: 500
        });
        redenerHoildForm();
      } else {
        layer.msg(res.message, {
          icon: 5
        })
      }
    })
  });

//渲染假期列表
  function redenerHoildForm() {
    $("#holidayTbody").html("");
    var url = path.api + "/api/getSchoolHolidayList?v=" + new Date().getTime();
    api.ajaxGet(url, {
      school_id: school_id
    }, function(res) {
      if (res.type == "success") {
        var list = res.data.data.list;
        // console.log(list);
        for (var i = 0; i < list.length; i++) {
          var html = "<tr>";
          html += "<td>" + list[i].sh_name + "</td>";
          html += "<td>" + list[i].sh_start_time_chs + "</td>";
          html += "<td>" + list[i].sh_end_time_chs + "</td>"
          html += "<td><a style='color:#1E9FFF;cursor:pointer' class='del' id='" + list[i].sh_id + "'>删除</a></td></tr>";
          $("#holidayTbody").append(html);
        }
      }
    })
  }

  ////======================编辑学期结束===================

  //======================编辑计划确认时间===================


  // controlTimeComfirm

  $(".configConfirmTimeBt").click(function() {
    //初始化弹窗
    var url = path.api + "/api/getSchoolTermWeek";
    api.ajaxGet(url, {
      school_id: cTable.school_id
    }, function(res) {
      console.log(res);
      if (res.type == "success") {
        var list = res.data.data;
        studytype = list.term;
        commitTitle = list.year;
        $(".studyTime_title").html(list.title);
        var start_time = list.term_time.start_time.slice(0, 10);
        var end_time = list.term_time.end_time.slice(0, 10);
        var range_start = list.term_range_time.start_time;
        var range_end = list.term_range_time.end_time;
        laydate.render({
          elem: '#ChirformStart_time',
          value: start_time,
          min:  range_start,
          max: range_end
        });

        laydate.render({
          elem: '#ChirformEnd_time',
          value: end_time,
          min: range_start,
          max: range_end
        });
      } else {
        layer.mag(res.message);
      }
    })
    layer.open({
      type: 1,
      title: "设置填报时间",
      content: $('#controlTimeComfirm'),
      area: ["800px", "500px"],
      btn: ["确认", "取消"],
      yes: function(index, layero) {
        layer.close(index)
      }
    });
  })

  $("#addconfirmtimedaysbt").click(function() {
      var url = path.api + "/api/setSchoolCourseInfo";
      var start_time = $("#ChirformStart_time").val();
      var end_time = $("#ChirformEnd_time").val();
      if (start_time && end_time) {
        api.ajaxGet(url, {
          start_time: start_time,
          end_time: end_time,
          year: commitTitle,
          type: studytype
        }, function(res) {
          if (res.type == "success") {
            layer.msg("设置成功", {
              time: 800
            })
          }
        })
      }
})

})


  
