require(["layui","path","tools","num","api","cTable","checkTab","boot-dropdown"],function(layui,path,tools,num,api,cTable,checkTab){
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
      cTable.panel_on = false;

      checkTab.school_id = tools.queryString("school_id");
      checkTab.usefor = 1;
      
      var city_id = tools.queryString("city_id");
      var area_id = tools.queryString("area_id");
          

      $(".schoolName").html(cTable.school_name);
      $(".roomName").html(cTable.room_name);
      cTable.studyTime(cTable.school_id,cTable.weekData);
     
  
      $("#goToEdite").click(function(){
          var url = "/course/edit?school_id=" + cTable.school_id + "&room_id=" + cTable.room_id + "&weekData=" + cTable.weekData + "&term_id=" + cTable.term_id + "&week=" + cTable.week + "&room_name=" + cTable.room_name + "&school_name=" + cTable.school_name + "&type=" + cTable.tpye_class
          url += "&city_id=" + city_id;
          url += "&area_id=" + area_id;
          window.location.href = url;
      })


})
