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
                console.info(e.data);
                $.each(e.data.adv, function(key, value){
                    tem='<div style="height:130px;margin:10px 10px 10px 10px;font-size:12px"><div class="top" style="height:30px;line-height:30px"> <span style="font-size:14px;">  '+value.bespeak_title+'</span>    <a href="'+value.bespeakinfo+'"><div class="bottom" style="height:100px"> <div style="float:left;width:100px;height:100px"><img src="'+value.bespeak_img+'" alt="" width=100px height=100px/></div> <div style="float:left;height:100px;width:175px;color:#999;margin-left:20px" ><div style="height:25px;width:178px;line-height:25px">开始时间 :&nbsp;'+value.opentime+'</div><div  style="height:25px;width:178px;line-height:25px">结束时间 :&nbsp;'+value.outtime+'</div><div  style="height:25px;width:178px;line-height:25px">地点 :'+value.bes_address+'</div><div style="height:25px;width:178px;line-height:25px">联系人 :'+value.true_name+'<span style="color:#EA8A3E"> ( '+value.usercontact+' ) <span></div></div></div></a></div></div>';
                    $("#bespeak_list").append(tem);
                })
                // $.each(e.data.temp, function(key, value){
                //        tem='<ul><li><dl><dt><span class="name">已参与：'+value.bespeak_title+'</span><span class="phone" style="margin-left:20px">预约时间：'+value.starttime+'</span></dt><dd><br/>活动详情：'+value.bespeak_com+'</dd></dl><div class="handle">'+value.bespeak_state+'<span><a href="javascript:;" bespeak_id="'+value.bespeak_id+'" class="delbespeak"><i class="del"></i>取消参与</a></span></div></li></ul>';
                //     $("#bespeak_adv").append(tem);
                // })

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