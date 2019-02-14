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
      cTable.usrsfor = 1
  
      checkTab.school_id = tools.queryString("school_id");
      checkTab.weekData = tools.queryString("weekData");
      checkTab.usrsfor = 0;
   

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

   




$("#goToConfirm").click(function() {
    var url = "/course/confirm?school_id=" + cTable.school_id + "&room_id=" + cTable.room_id + "&weekData=" + cTable.weekData + "&term_id=" + cTable.term_id + "&week=" + cTable.week + "&room_name=" + cTable.room_name + "&school_name=" + cTable.school_name + "&type=" + cTable.tpye_class
    url += "&city_id=" + city_id;
    url += "&area_id=" + area_id;
    window.location.href = url;
  })


 
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
