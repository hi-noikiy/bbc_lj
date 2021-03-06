var page = pagesize;
var curpage = 1;
var hasMore = true;
var footer = false;
var reset = true;
var orderKey = "";
$(function () {
    var e = getCookie("key");
    if (!e) {
        window.location.href = WapSiteUrl + "/tmpl/member/login.html"
    }
    if (getQueryString("data-state") != "") {
        $("#filtrate_ul").find("li").has('a[data-state="' + getQueryString("data-state") + '"]').addClass("selected").siblings().removeClass("selected")
    }
    $("#search_btn").click(function () {
        reset = true;
        t()
    });
    $("#fixed_nav").waypoint(function () {
        $("#fixed_nav").toggleClass("fixed")
    }, {offset: "50"});
    function t() {
        if (reset) {
            curpage = 1;
            hasMore = true
        }
        $(".loading").remove();
        if (!hasMore) {
            return false
        }
        hasMore = false;
        var t = $("#filtrate_ul").find(".selected").find("a").attr("data-state");
        var r = $("#order_key").val();
        $.ajax({
            type: "post",
            url: ApiUrl + "/index.php?ctl=Buyer_Order&met=physical&typ=json&page=" + page + "&curpage=" + curpage,
            data: {k: e, u: getCookie('id'), status: t, key: r},
            dataType: "json",
            success: function (e) {
                checkLogin(e.login);
                curpage++;
                hasMore = e.hasmore;
                if (!hasMore) {
                    get_footer()
                }
                if (e.data.items.length <= 0) {
                    $("#footer").addClass("posa")
                } else {
                    $("#footer").removeClass("posa")
                }
                var t = e;
                t.WapSiteUrl = WapSiteUrl;
                t.ApiUrl = ApiUrl;
                t.key = getCookie("key");
                template.helper("$getLocalTime", function (e) {
                    var t = new Date(parseInt(e) * 1e3);
                    var r = "";
                    r += t.getFullYear() + "年";
                    r += t.getMonth() + 1 + "月";
                    r += t.getDate() + "日 ";
                    r += t.getHours() + ":";
                    r += t.getMinutes();
                    return r
                });
                template.helper("p2f", function (e) {
                    return (parseFloat(e) || 0).toFixed(2)
                });
                template.helper("parseInt", function (e) {
                    return parseInt(e)
                });console.info(t);
                var r = template.render("order-list-tmpl", t);
                if (reset) {
                    reset = false;
                    $("#order-list").html(r)
                } else {
                    $("#order-list").append(r)
                }
            }
        })
    }

    $("#order-list").on("click", ".cancel-order", r);
    $("#order-list").on("click", ".delete-order", o);
    $("#order-list").on("click", ".sure-order", n);
    $("#order-list").on("click", ".evaluation-order", l);
    $("#order-list").on("click", ".evaluation-again-order", d);
    $("#order-list").on("click", ".viewdelivery-order", c);
    $("#order-list").on("click", ".check-payment", function () {
        var e = $(this).attr("data-paySn");
        toPay(e, "member_buy", "pay");
        return false
    });
    function r() {
        var e = $(this).attr("order_id");
        $.sDialog({
            content: "确定取消订单？", okFn: function () {
                a(e);
            }
        })
    }

    function a(r) {
        $.ajax({
            type: "post",
            url: ApiUrl + "/index.php?ctl=Buyer_Order&met=orderCancel&typ=json",
            data: {order_id: r, k: e, u: getCookie('id'), user: 'buyer'},
            dataType: "json",
            success: function (e) {
                if (e.status == 200) {
                    reset = true;
                    t()
                } else {
                    $.sDialog({skin: "red", content: "操作失败！", okBtn: false, cancelBtn: false})
                }
            }
        })
    }

    function o() {
        var e = $(this).attr("order_id");
        $.sDialog({
            content: "是否移除订单？<h6>电脑端订单回收站可找回订单！</h6>", okFn: function () {
                i(e)
            }
        })
    }

    function i(r) {
        $.ajax({
            type: "post",
            url: ApiUrl + "/index.php?ctl=Buyer_Order&met=hideOrder&typ=json",
            data: {order_id: r, k: e, u: getCookie('id'), user: 'buyer'},
            dataType: "json",
            success: function (e) {
                if (e.status == 200) {
                    reset = true;
                    t()
                } else {
                    $.sDialog({skin: "red", content: "操作失败！", okBtn: false, cancelBtn: false})
                }
            }
        })
    }

    function n() {
        var e = $(this).attr("order_id");
        $.sDialog({
            content: "确定收到了货物吗？", okFn: function () {
                s(e)
            }
        })
    }

    function s(r) {
        $.ajax({
            type: "post",
            url: ApiUrl + "/index.php?ctl=Buyer_Order&met=confirmOrder&typ=json",
            data: {order_id: r, k: e, u: getCookie('id')},
            dataType: "json",
            success: function (e) {
                if (e.status == 200) {
                    reset = true;
                    t()
                } else {
                    $.sDialog({skin: "red", content: "操作失败！", okBtn: false, cancelBtn: false})
                }
            }
        })
    }

    function l() {
        var e = $(this).attr("order_id");
        location.href = WapSiteUrl + "/tmpl/member/member_evaluation.html?order_id=" + e
    }

    function d() {
        var e = $(this).attr("order_id");
        location.href = WapSiteUrl + "/tmpl/member/member_evaluation_again.html?order_id=" + e
    }

    function c() {
        var e = $(this).attr("order_id");
        var express_id = $(this).attr("express_id");
        var express_name = $(this).attr("express_name");
        var shipping_code = $(this).attr("shipping_code");
        location.href = WapSiteUrl + "/tmpl/member/order_delivery.html?order_id=" + e + '&express_id=' + express_id + '&express_name=' + express_name + '&shipping_code=' + shipping_code;
    }

    $("#filtrate_ul").find("a").click(function () {
        $("#filtrate_ul").find("li").removeClass("selected");
        $(this).parent().addClass("selected").siblings().removeClass("selected");
        reset = true;
        window.scrollTo(0, 0);
        t()
    });
    t();
    $(window).scroll(function () {
        if ($(window).scrollTop() + $(window).height() > $(document).height() - 1) {
            t()
        }
    })
});
function get_footer() {
    if (!footer) {
        footer = true;
        $.ajax({url: "../../js/tmpl/footer.js", dataType: "script"})
    }
}

window.payOrder = function(uo,o)
{
    //判断有没有支付单号，如果没有支付单号就去支付中心生成支付单号，如果有直接支付
    if(uo)
    {
        location.href = PayCenterWapUrl + "?ctl=Info&met=pay&uorder=" + uo;
    }
    else
    {
        $.ajax({
            url: ApiUrl  + '?ctl=Buyer_Order&met=addUorder&typ=json',
            data:{order_id:o,k:key, u:getCookie('id')},
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            async:false,
            success:function(a){
                console.info(a);
                if(a.status == 200)
                {
                    location.href = PayCenterWapUrl + "?ctl=Info&met=pay&uorder=" + a.data.uorder;
                }
                else
                {
                    if(a.msg != 'failure')
                    {
                        /*Public.tips.error(a.msg);*/
                        $.sDialog({skin: "red", content: a.msg, okBtn: false, cancelBtn: false})
                    }else
                    {
                        $.sDialog({skin: "red", content: '订单支付失败！', okBtn: false, cancelBtn: false})
                        /*Public.tips.error('订单支付失败！');*/
                    }

                    //alert('订单提交失败');
                }
            },
            failure:function(a)
            {
                $.sDialog({skin: "red", content: '操作失败！', okBtn: false, cancelBtn: false})
                /*Public.tips.error('操作失败！');*/
            }
        });
    }
}