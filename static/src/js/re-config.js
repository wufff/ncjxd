require.config({
	baseUrl: "http://ncjxd.images.dev.dodoedu.com/static/src/js",
	// urlArgs: "v=" + new Date().getTime(),
	paths: {
			"jquery": "./lib/jquery/jquery",
			"bootstrap":"./lib/bootstrap/bootstrap.min.3.3.7",
		    "boot-dropdown":"./lib/bootstrap/modules/dropdown",
			"Swiper":"./lib/swiper.min",
			"dialog": "./ui/dialog",
			"path":"./tools/path",
			"page": "./tools/pags",
			"ckplayer":"./lib/ckplay/ckplayer/ckplayer",
			"viewPhoto":"./ui/viewPhoto",
			"layui":"../layui/layui.all",
			"tools":"./tools/tools",
			"api":"./tools/api",
			"expression":"./ui/expression",
			"ZeroClipboard":"./lib/ueditor/third-party/zeroclipboard/ZeroClipboard.min",
			"plupload":"./lib/plupload/plupload.dev",
			"moxie":"./lib/plupload/moxie",
			"upLoad":"./tools/upLoad",
			"num":"./tools/num",
			"star":"./lib/star",
			"cTable":"./app/renderTable",
			"downList":"./app/downList"
	},
	shim: {

		 "Swiper":["jquery"],
         "bootstrap":["jquery"],
         "boot-dropdown":["jquery"],
          "layui":{
          	exports:"layui"
          },
         "ZeroClipboard":{
         	exports:"ZeroClipboard"
         },
         "ckplayer":{
         	exports:"ckplayer"
         },
         "zTree":{
         	deps:['jquery']
         },
	}
});


