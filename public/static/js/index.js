//图标大小scale
setTimeout("logo0()",1500);
setTimeout("reg()",2500);
setTimeout("ser()",4000);
setTimeout("shop()",6500);
setTimeout("still()",12000);
function logo0(){
	$(".logo0").animate({
	width:'90px',
	height:'98px',
	opacity:'1'
},{ 
    easing: 'easeOutElastic', 
    duration: 1000
}); 
}

$("#logo img").animate({
	left:'0'
},{ 
    easing: 'easeInOutCirc', 
    duration: 500
});

function reg(){
	$(".reg").animate({
	top: "200px",
	opacity:'1'
},{ 
    easing: 'easeOutBounce', 
    duration: 1000
});
}

function ser(){
	$(".ser").animate({
	top: "280px",
	opacity:'1'
},{ 
    easing: 'easeOutBounce', 
    duration: 1000
});
}

function shop(){
	$(".shop").animate({
	top: "160px",
	opacity:'1'
},{ 
    easing: 'easeOutBounce', 
    duration: 1000
}); 
}
function still(){
	$(".still").animate({
	left: "1050px",
	opacity:'1'
},{ 
    easing: 'easeOutElastic', 
    duration: 2000
}); 
}
$(".showItem img").hover(function(){
	$(this).parent().next(".tips").show();
},function(){
	$(this).parent().next(".tips").hide();
});
$(".tips").prepend("<div class='bg_opacity'></div>");
$("#user img").hover(function(){
	$(this).animate({
		height:"150%",
		width:"150%",
		opacity:'0.4'
	},{
		easing: 'easeOutElastic', 
   	    duration: 2000
	});
},function(){
	$(this).animate({
		height:"100%",
		width:"100%",
		opacity:'1'
	},{
		easing: 'easeOutElastic', 
   	    duration: 2000
	});
})
//alert($(window).height());
//启动全屏模式
// 判断各种浏览器，找到正确的方法
function launchFullScreen(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}
// 启动全屏!
launchFullScreen(document.documentElement); // 整个网页
launchFullScreen(document.getElementById("fullBg")); // 某个页面元素

