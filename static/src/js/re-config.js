require.config({
	baseUrl: "http://images.dev.dodoedu.com/ncjxdPage/static/src/js",
	urlArgs: "v=" + new Date().getTime(),
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
			"expression":"./ui/expression",
			"ZeroClipboard":"./lib/ueditor/third-party/zeroclipboard/ZeroClipboard.min"
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
         "normalize":{
         	exports:"normalize"
         }
	}
});


