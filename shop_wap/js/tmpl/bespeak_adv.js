var key = getCookie("key");


$(function ()
{
     var key=getCookie("key");if(!key){location.href="login.html"}

    function s()
    {
        $.ajax({
            type: "post", url: ApiUrl + "/index.php?ctl=Buyer_Bespeak&met=advBespeak&typ=json", data: {k: key, u:getCookie('id')}, dataType: "json", success: function (e)
            {
                
                checkLogin(e.login);
                $.each(e.data.adv, function(key, value){
                       tem='<ul><li><dl><dt><span class="name"><a href="'+value.bespeakinfo+'" style="list-style: none;">'+value.bespeak_title+'</a></span></dt><div style="width:100%;height:70px;"><a href="'+value.bespeakinfo+'"><img src="'+value.bespeak_img+'" style="width:50px;height:50px;float:left"></a><dd style="margin-top:5px;float: left;margin-left: 10px;overflow:hidden;height:13px;width:84%">活动时间：'+value.opentime.substr(0,10)+'--'+value.outtime.substr(0,10)+'</dd><dd style="margin-left: 59px;line-height:28px"><br/>联系人：'+value.true_name+'</dd></div></dl><div class="handle">'+value.bespeak_state+'<span><a href="'+value.bespeak_id+'"><i class="edit"></i>'+value.bespeak_click+'</a></div></li></ul>';
                    $("#bespeak_list").append(tem);
                })
                $.each(e.data.temp, function(key, value){
                       tem='<ul><li><dl><dt><span class="name">已参与：'+value.bespeak_title+'</span><span class="phone" style="margin-left:20px">预约时间：'+value.starttime+'</span></dt><dd><br/>活动详情：'+value.bespeak_com+'</dd></dl><div class="handle">'+value.bespeak_state+'<span><a href="javascript:;" bespeak_id="'+value.bespeak_id+'" class="delbespeak"><i class="del"></i>取消参与</a></span></div></li></ul>';
                    $("#bespeak_adv").append(tem);
                })

                if (e.data == null)
                {
                    return false
                }

                $(".delbespeak").click(function ()
                {
                    var bespeak_id = $(this).attr("bespeak_id");
                    $.sDialog({
                        skin: "block", content: "确定取消吗？", okBtn: true, cancelBtn: true, okFn: function ()
                        {
                            del(bespeak_id)
                        }
                    })
                })
            }
        })
    }

    s();
    function del(a)
    {
        $.ajax({
            type: "post", url: ApiUrl + "?ctl=Buyer_Bespeak&met=delBespeak&typ=json", data: {id: a, k: key, u:getCookie('id')}, dataType: "json", success: function (e)
            {
                checkLogin(e.login);
                if (e)
                {
                        location.href = WapSiteUrl + "/tmpl/member/bespeak_adv.html";
                }
            }
        })
    }

});