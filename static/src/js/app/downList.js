define(['jquery','layui','api','path'],function($,layui,api,path){
	var form = layui.form;
    var obj = {
    renderArea:function (cityId,value,nodeId){            //生成区县前提[name=area]
			    var url = "/api/getAreaList";
			    if(cityId != ""){
			     var getData = {
			        area_id:cityId,
			        type:3
			     }
                 if(nodeId){
                 	 getData.node_id = nodeId;
                 }
			      api.ajaxGet(url,getData,function(res){
			        if(res.type == "success") {
			          var list = res.data.data.list;
			          var html = '<option value="">选择区县</option>';
			          for(var i=0;i<list.length;i++){
			             html += '<option value="'+ list[i].node_encrypt_id +'">'+ list[i].node_name+'</option>'
			          }
			           
			         $("select[name=area]").html(html);
			         if(value){
			           $("select[name=area]").val(value);
			         }else {
			             $("select[name=area]").val("");
			         }
			          form.render('select');
			       }
			     })
			     }else{
			       $("select[name=area]").html('<option value="">此地区无数据</option>');
			          form.render('select');
			     }
			  },
	renderShool:function(areId,value,nodeId,is_center_school){             //生成学校前提[name=school]
		    var url = path.api+"/api/getSchoolListByAreaId";
		    var text;
		    if(areId != ""){
		     var getData = {
		        area_id:areId,
		        type:3
		     }
		     if(is_center_school){
		     	getData.is_all = is_center_school;
		     }
             if(nodeId){
                 	 getData.school_id = nodeId;
              }
		      api.ajaxGet(url,getData,function(res){
		        console.log(res);
		        if(res.type == "success") {
		          var list = res.data.data.list;
		          var html = '<option value="">请选择</option>';
		          for(var i=0;i<list.length;i++){
		             html += '<option value="'+ list[i].school_encrypt_id +'|'+list[i].school_classify+'">'+ list[i].school_name+'</option>'
		          }
		         $("select[name=school]").html(html);
		        if(value){

		              $("select[name=school]").val(value);
		         }else {
		             $("select[name=school]").val("");
		         }
		          form.render('select');       
		       }else{
		         $("select[name=school]").html('<option value="">此地区无数据</option>');
		          form.render('select');
		       }
		     })
		   }
		 
		 
		   // var text = $("select[name=school]").parents("dd").find('input.layui-unselect');
		
		}		  
    }
    return obj
})