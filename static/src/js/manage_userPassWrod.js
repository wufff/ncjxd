require(["layui", "path"], function(layui, path) {
    var layer = layui.layer;
    var upload = layui.upload;
    var $ = jQuery = layui.jquery; //用他的jquey否则弹窗会有问题
    $("#addTeacherBtn").click(function() {
      layer.open({
        type: 1,
        title:"添加教师",
        content: $('#controlAddteacher'),
        area:["600px","540px"],
        btn: ['确定', '取消'],
        yes: function(index, layero){
          layer.close(index); 
        }
      });
    })
  $("body").on("click",".del",function(){
        layer.confirm('确定删除此条推荐吗?', {icon: 3, title:'提示'}, function(index){
        layer.close(index);
      });

  })
})



