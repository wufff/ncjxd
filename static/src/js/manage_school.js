require(["layui", "path"], function(layui, path) {
    var layer = layui.layer;
    var upload = layui.upload;
    var $ = jQuery = layui.jquery; //用他的jquey否则弹窗会有问题
  
    $(".Untying").click(function(){
          layer.open({
            type: 1,
            title:"解绑学校",
            content: $('#controluntySchool'),
            area:["500px","500px"],
            btn: ['确定', '取消'],
            yes: function(index, layero){
              layer.close(index); 
            }
          });
    })




  $("body").on("click",".edit",function (){
      layer.open({
            type: 1,
            title:"编辑教室",
            content: $('#conrolEditClass'),
            area:["700px","700px"],
            btn: ['确定', '取消'],
            yes: function(index, layero){
              layer.close(index); 
            }
          });
  })





  $("body").on("click",".editClass",function (){
      layer.open({
            type: 1,
            title:"编辑教室",
            content: $('#conrolEditClassAdd'),
            area:["500px","500px"],
            btn: ['确定', '取消'],
            yes: function(index, layero){
              layer.close(index); 
            }
          });
  })



$("body").on("click","#addClassbtn",function (){
      layer.open({
            type: 1,
            title:"添加教室",
            content: $('#conrolEditClassAdd'),
            area:["500px","500px"],
            btn: ['确定', '取消'],
            yes: function(index, layero){
              layer.close(index); 
            }
          });
  })




   
})