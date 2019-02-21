define(["layui","downList","cTable"], function(layui,downList,cTable) { 
    var $ = jquery = layui.jquery;
    //权限控制 0省 1市 2县 3学校
    var my = {};
    var city_id_authority = $("#city_id").val();
    var town_id_authority = $("#town_id").val();
    var school_id_authority = $("#school_id").val();
    var is_center_school = $("#is_center_school").val();
    var authority = 0;
    if (school_id_authority && school_id_authority != 0) {
      authority = 3;
    } else if (town_id_authority && town_id_authority != 0) {
      authority = 2;
    } else if (city_id_authority && city_id_authority != 0) {
      authority = 1;
    }
    console.log("权限" + authority);
   switch (authority) {
    case 1:
      downList.renderArea(city_id_authority);
      break;
    case 2:
      downList.renderArea(city_id_authority,town_id_authority,town_id_authority);
      downList.renderShool(town_id_authority,null,null,is_center_school);
      break;
    case 3: //学校管理员
      cTable.school_id = school_id_authority;
      cTable.school_name = $("#school_name").val();
      var school_classify = $("#school_classify").val();
      city_id = city_id_authority;
      town_id = town_id_authority;
      var schoolvalue = cTable.school_id + '|' + school_classify;
      cTable.schoolType = school_classify;
      downList.renderArea(city_id_authority, town_id_authority, town_id_authority);
      downList.renderShool(town_id_authority,schoolvalue,cTable.school_id,is_center_school);
      cTable.renderClassRoom(cTable.school_id, cTable.weekData, function() {
            cTable.studyTime(cTable.school_id, cTable.weekData);
      });
      break;
    default:
      break;
  }
    my.is_center_school = is_center_school;
    return my;
})