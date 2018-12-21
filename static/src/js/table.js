
/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-11-14 15:55:46
 * @version $Id$
 */
 
require(["jquery","layui"],function($,layui){
      var layer = layui.layer;
      var form =  layui.form;
      

   form.on('select(city)', function(data){
     console.log(data.value);
     var getData = {
     	area_id:data.value,
     	type:3
     }
     var url = "/api/getAreaList"
     if(data.value){
     	$.get(url,getData,function(res){
     	  if(res.type == "success") {
          var list = res.data.data.list;
          var html = '<option value="">请选择</option>';
          for(var i=0;i<list.length;i++){
             html += '<option value="'+ list[i].node_encrypt_id +'">'+ list[i].node_name+'</option>'
          }
         $("select[name=area]").html(html);
         $("select[name=area]").val(" ");
          form.render('select');
       }
     })
     }else{
     	 $("select[name=area]").html('<option value="">请选择</option>');
          form.render('select');
     }
 
});    
})
