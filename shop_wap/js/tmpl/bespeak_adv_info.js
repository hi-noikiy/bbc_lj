var key = getCookie("key");


$(function ()
{
     var key=getCookie("key");if(!key){location.href="login.html"}

    function s()
    {
         var e = getQueryString("bespeak_id");
        var a = getCookie("key");
        $.ajax({
            type: "post", url: ApiUrl + "/index.php?ctl=Buyer_Bespeak&met=getbespeaklist&typ=json", data: {k:a,u:getCookie('id'), id: e}, dataType: "json", success: function (a)
            {
                checkLogin(a.login);
                console.log(a);
                $.each(a.data, function(key, value){
                       tem='<dl><span style="margin-left: 10px; style=font-size: 0.6rem;line-height: 0.65rem;color: #000;">相关图片：</span><img src="'+value.bespeak_img+'" style="width:100%"><span>活动详情：<br><dd style="width:90%;margin:auto">'+value.bespeak_com+'</dd></span><dt>联系人：<span class="name" id="name">'+value.true_name+'</span></dt><dt>联系方式：<span class="name">'+value.usercontact+'</span></dt><div class="error-tips"></div><div class="form-btn"><a class="btn" href="bespeak_adv.html?bespeak_id='+value.bespeak_id+'">申请预约</a></div></dl>';
                    $("#bespeak_list").append(tem);
                })
                $("#img").attr('src',a.data.bespeak_img);
                $("#com").val(a.data.bespeak_com);
                $("#name").val(a.data.true_name);
                $("#usercontact").val(a.data.usercontact);
                var e = a.data.bespeak_default == "1" ? true : false;
                $("#is_default").prop("checked", e);
                if (e)
                {
                    $("#is_default").parents("label").addClass("checked")
                }
            }
        })
    }

    s();

});