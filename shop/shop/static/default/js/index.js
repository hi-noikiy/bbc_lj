$(document).ready(function(){
	var i=0;
	var index;
	var timer=null;
	// function start(){
 //        timer=setInterval(function(){
 //        	i++;
 //        	if(i>=$(".banimg li").length){
 //        		i=0;
 //        	}
 //            tab(i);
 //        },3000)
 //    }
 //    function tab(i){
 //    	$(".banimg li").css({
	// 		"display":"none",
	// 		"opacity":"0"
	// 	})
	//     $(".banimg li").eq(i).css({
	// 		"display":"block",
	// 		"opacity":"1"
	// 	})
 //    }
 //    start();
    //顶部导航栏鼠标移入效果
    $(".floor_head nav li").bind("mouseover",function(){
    	$(".floor_head nav li").find("a").removeClass("selected");
    	$(this).find("a").addClass("selected");
    	var aW=$(this).find("a").width();
    	var pad=parseInt($(this).find("a").css("paddingLeft"));
    	var liW=aW+pad*2+1;
    	$(this).css("width",liW);
    	
    })
    //左侧菜单栏鼠标移入效果
     $(".tleft ul li").hover(function(){
        $(this).addClass("hover_leave");
        $(this).find("h3 a").css("color","red");
        $(this).find(".hover_content").show();
    },function(){
        $(this).removeClass("hover_leave");
        $(this).find("h3 a").css("color","#fff");
        $(this).find(".hover_content").hide();
    })

 	//导航栏移入显示下拉单
 	$(".head_right dl").hover(function(){
 		$(this).addClass("navactive");
 		$(this).find("dd").show();
 	},function(){
 		$(".head_right dl").removeClass("navactive");
 		$(".head_right dd").hide();
 	})

 	//遍历楼层图标背景
 	$(".m .mt .title span").each(function(i){
 		var str="url("+STATIC_URL+"/images/flad"+(i+1)+".png)";
  		$(this).css("background",str);
  	})
    //遍历商品背景色
    var arr=["#fff0f0","#fdf5f2","#f1f6ef","#f9f9f9","#f2fbff"];
    $.each($(".goodsUl li"),function(i,obj){
         if(i>=5){
            var thisindex=$(this).index();
          i=thisindex-Math.floor(thisindex/5)*5;
        }
        $(this).css("backgroundColor",arr[i])
       
    })
    //商品滚动
    function doMove(obj,attr,speed,target,callBack){
        if(obj.timer) return;
        var ww=obj.css(attr);
        var num = parseFloat(ww); 
        speed = num > target ? -Math.abs(speed) : Math.abs(speed);
        obj.timer = setInterval(function (){
            num += speed;
            if( speed > 0 && num >= target || speed < 0 && num <= target  ){
                num = target;
                clearInterval(obj.timer);
                obj.timer = null;
                var mm=num+"px";
                // obj.style[attr] = num + "px";
                obj.css(attr,mm);
                (typeof callBack === "function") && callBack();

            }else{
                var mm=num+"px";
                // obj.css(attr) = num + "px";
                 obj.css(attr,mm)
            }
        },30)   
    }
    var m=0;
    $(".btn1").bind("click",function(){
        var W=$(this).parent().width();
        var goodsUl=$(this).parent().find(".goodsUl");
        var ali=goodsUl.find("li");
        var rightA=$(this).parent().find(".btn2");
        m=$(this).attr("data-numb");
        if(m<=0){
            m=0;
            return;
        }
        m--;
        $(this).attr("data-numb",m);
        rightA.attr("data-num",m);
        doMove(goodsUl,"left",30, -m*W);

    })
    $(".btn2").bind("click",function(){
        var W=$(this).parent().width();
        var goodsUl=$(this).parent().find(".goodsUl");
        var ali=goodsUl.find("li");
        goodsUl.css("width",240*ali.length);
        var ulW=goodsUl.width();
        var nums=Math.ceil(ulW/W);
        var leftA=$(this).parent().find(".btn1");
        m=$(this).attr("data-num");
        if(m>=(nums-1)){
            return;
        }
        m++;
        $(this).attr("data-num",m);
        leftA.attr("data-numb",m);
        doMove(goodsUl,"left",30,-m*W);
    })

    //地点定位
    $(".header_select_province").hover(function(){
        $(this).find("dt").css("background","#fff");
        $(this).find("dd").show();
    },function(){
       $(this).find("dt").css("background","#f2f2f2");
        $(this).find("dd").hide();
    })
    $(".code_screen").click(function(){
        $(".code_cont").css("display","block");
    },function(){
        $(".code_cont").css("display","none");
    })

     $(".all_check").click(function(){
        var isChecked = $(this).prop("checked");
        $(".cart_contents input").prop("checked", isChecked);
    });
    $(".cart_contents_head input").click(function(){
        var isChecked1 = $(this).prop("checked");
        $(this).parent().parent().siblings().find("input").prop("checked", isChecked1);
    })
})


$(function(){
    ucenterLogin(UCENTER_URL, SITE_URL, false);
});


/** 省的地区选择 **/
$(document).ready(function(){

    if($.cookie('areaId'))
    {
        //获取该地区的名字
        $.post(SITE_URL  + '?ctl=Base_District&met=getDistrictName&id=' + $.cookie('areaId') +  '&typ=json',function(data)
        {
            $("#area").html(data.data.district_name);
        });
    }


    //获取所有的一级地址
    $.post(SITE_URL  + '?ctl=Base_District&met=district&pid=0&typ=json',function(data){
            for (i = 0; i < data.data.items.length; i++) {
                $(".header_select_province dd").append("<div class='dd'><a onclick='setcook(  " +  data.data.items[i]['district_id']  + " )' >" + data.data.items[i]['district_name'] + "</a></li>");
            }
        }
    );

    window.setcook = function(e)
    {
        $.cookie("areaId",e);
        location.reload();

    }


})

$(document).ready(function(){
    url = 'index.php?ctl=Index&met=toolbar';
    $(".J-global-toolbar").load(url, function(){
    });
})

$(function(){
    if ($.isFunction($.fn.blueberry))
    {
        $(".blueberry").blueberry();
    }
})

