require(["layui", "path"], function(layui, path) {
    var layer = layui.layer;
    var $ = jQuery = layui.jquery; 
    $("#add").click(function() {
      layer.open({
        type: 1,
        title:"上传新图片",
        content: $('#controlImg'),
        area:["650px","500px"],
      
        yes: function(index, layero){
          layer.close(index); 
        }
      });
    })
    



    $(".change").click(function() {
              layer.open({
                type: 1,
                title:"修改推荐",
                content: $('#controlChange'),
                area:["500px","500px"],
                btn: ['确定', '取消'],
                yes: function(index, layero){
                  layer.close(index); 
                }
              });
            
    })



    $(".del").click(function(){
         layer.confirm('确定删除此图片吗？', {icon: 3, title:'提示'}, function(index){
          layer.close(index);
        });
    })
})