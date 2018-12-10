define(["path"],function(path){
     return {
         img:function(button,Image){
			var uploader = new plupload.Uploader({
				runtimes: 'html5,flash,silverlight,html4',
				browse_button: button,
				// container: document.getElementById('upImgWrap'),
				multi_selection: false, //是否多选
				url: path.upLoad+'/upload',
				flash_swf_url: '../static/plupload/js/Moxie.swf',
				silverlight_xap_url: '../static/plupload/js/Moxie.xap',
				max_file_size: '30mb', // 文件上传最大限制。
				unique_names: true, // 上传的文件名是否唯一
				chunk_size: '5mb', // 分片大小
				filters: {
					mime_types: [{
						title: "Image files",
						extensions: "jpeg,jpg,png"
					}, ]
				},

				init: {
					PostInit: function() {
						document.getElementById('imglist').innerHTML = '';
					},

					FilesAdded: function(up, files) {
						plupload.each(files, function(file) {
							document.getElementById('imglist').innerHTML = "";
							// document.getElementById('img_file_size').value = file.size;
							document.getElementById('imglist').innerHTML = '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ') <b></b></div>';
							previewImage(file, function(url) {
								$("#"+Image).attr("src", url);
							});

						});
						uploader.start();
					},

					UploadProgress: function(up, file) {
						document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
					},

					Error: function(up, err) {
						// document.getElementById('console').appendChild(document.createTextNode("\nError #" + err.code + ": " + err.message));
						alert(err.message);
					},

					OptionChanged: function(up, option_name, new_value, old_value) {

					}
				}
			});


			uploader.bind('FileUploaded', function(uploader, file, responseObject) {
				var msg = JSON.parse(responseObject.response);
				if (msg.code == 1000) {
					// console.log(msg.data);
					document.getElementById('img_file_path').value = msg.data.file_path;
					// doument.getElementById('img_str').value = document.getElementById('img_str').value + msg.data.file_path + ",";

				}
			});
			uploader.init();


			function previewImage(file, callback) { //file为plupload事件监听函数参数中的file对象,callback为预览图片准备完成的回调函数
				if (!file || !/image\//.test(file.type)) return; //确保文件是图片
				if (file.type == 'image/gif') { //gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
					var fr = new moxie.image.Image();
					fr.onload = function() {
						callback(fr.result);
						fr.destroy();
						fr = null;
					}
					fr.readAsDataURL(file.getSource());
				} else {
					var preloader = new moxie.image.Image();
					preloader.onload = function() {
						//preloader.downsize(550, 400);//先压缩一下要预览的图片,宽300，高300
						var imgsrc = preloader.type == 'image/jpeg' ? preloader.getAsDataURL('image/jpeg', 80) : preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
						callback && callback(imgsrc); //callback传入的参数为预览图片的url
						preloader.destroy();
						preloader = null;
					};
					preloader.load(file.getSource());
				}

			}
		}




















	}
})
