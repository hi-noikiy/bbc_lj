var goods_id = getQueryString("goods_id");
$(function () {
    var o = new ncScrollLoad;
    o.loadInit({
        url: ApiUrl + "/index.php?ctl=Goods_Goods&met=getGoodsEvaluationList&type=all&typ=json&sou=wap",
        getparam: {goods_id: goods_id},
        tmplid: "product_ecaluation_script",
        containerobj: $("#product_evaluation_html"),
        iIntervalId: true,
        callback: function () {
            callback()
        }
    });
    $("#goodsDetail").click(function () {
        window.location.href = WapSiteUrl + "/tmpl/product_detail.html?goods_id=" + goods_id
    });
    $("#goodsBody").click(function () {
        window.location.href = WapSiteUrl + "/tmpl/product_info.html?goods_id=" + goods_id
    });
    $("#goodsEvaluation").click(function () {
        window.location.href = WapSiteUrl + "/tmpl/product_eval_list.html?goods_id=" + goods_id
    });
    $(".nctouch-tag-nav").find("a").click(function () {
        var i = $(this).attr("data-state");
        o.loadInit({
            url: ApiUrl + "/index.php?ctl=Goods_Goods&met=getGoodsEvaluationList&typ=json&sou=wap",
            getparam: {goods_id: goods_id, type: i},
            tmplid: "product_ecaluation_script",
            containerobj: $("#product_evaluation_html"),
            iIntervalId: true,
            callback: function () {
                callback()
            }
        });
        $(this).parent().addClass("selected").siblings().removeClass("selected")
    })
});

function plusXing (str,frontLen,endLen) 
{ 
    var len = str.length-frontLen-endLen;
    var xing = '';
    for (var i=0;i<len;i++) {
    xing+='*';
    }
    return str.substring(0,frontLen)+xing+str.substring(str.length-endLen);
}


 setTimeout(function(){
   $('.abc').each(function(i){
    var str = $('.abc').eq(i).html();
     var su = plusXing(str,1,1);
     // alert(su);
    $(this).html(su);
});
 },200)


function callback() {
    $(".goods_geval").on("click", "a", function () {
        var o = $(this).parents(".goods_geval");
        o.find(".nctouch-bigimg-layout").removeClass("hide");
        var i = o.find(".pic-box");
        o.find(".close").click(function () {
            o.find(".nctouch-bigimg-layout").addClass("hide")
        });
        if (i.find("li").length < 2) {
            return
        }
        Swipe(i[0], {
            speed: 400,
            auto: 3e3,
            continuous: false,
            disableScroll: false,
            stopPropagation: false,
            callback: function (o, i) {
                $(i).parents(".nctouch-bigimg-layout").find("div").last().find("li").eq(o).addClass("cur").siblings().removeClass("cur")
            },
            transitionEnd: function (o, i) {
            }
        })
    })
}