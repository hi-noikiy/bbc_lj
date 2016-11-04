<?php if (!defined('ROOT_PATH'))
{
	exit('No Permission');
} ?>
<?php
include $this->view->getTplPath() . '/' . 'header.php';
?>
<link rel="stylesheet" href="<?= $this->view->css ?>/security.css">
</div>
<div class="form-style-layout wrap" style="border:none;">
	<h2 class="pc_user_about"><?=_('修改支付密码')?></h2>
    <?php if($data['user_email'] || $data['user_mobile']){?>
    <div class="form-style">
    	<div class="step">
        	<dl class="step-first current">
            	<dt>1.验证身份</dt>
            </dl>
        	<dl>
            	<dt>2.<?= _('修改支付密码')?></dt>
                <dd></dd>
            </dl>
        	<dl>
            	<dt>3.修改完成</dt>
                <dd></dd>
            </dl>
        </div>
        <form id="form" name="form" action="" method="post">
            <dl>
                <dt><em>*</em>验证方式：</dt>
                <dd>
                <select id="type">
                	<?php if($data['user_email']){?>
                	<option value="email">邮件验证</option>
                    <?php }?>
                    
					<?php if($data['user_mobile']){?>
                	<option value="mobile">手机验证</option>
					<?php }?>
                </select>
                </dd>
            </dl>
            
			<?php if($data['user_email']){?>
            <div id="email">
            <dl>
                <dt>邮箱：</dt>
                <dd><?=$data['user_email']?></dd>
            </dl>
            </div>
            <?php }?>
            
			<?php if($data['user_mobile']){?>
            <div id="mobile" <?php if($data['user_email']){?>class="fn-hidden"<?php }?>>
            <dl>
                <dt>手机：</dt>
                <dd><?=$data['user_mobile']?></dd>
            </dl>
            </div>
            <?php }?>
            
            <dl>
                <dt><em>*</em>验证码：</dt>
                <dd>
                <input type="text" name="yzm" id="yzm" class="text w82" value="" onchange="javascript:checkyzm();"/>
				<?php if(empty($data['user_email'])){?>
					<input type="button" class="send" data-type="mobile" value="获取手机验证码" />
				 <?php }else{?>
					<input type="button" class="send" data-type="email" value="获取邮箱验证码" />
				 <?php }?>
                </dd>
            </dl>


            <dl>
                <dt><em>*</em>新密码：</dt>
                <dd>
					<input type="text" class="text" maxlength="30" name="password" id="password">
                </dd>
            </dl>

            <dl class="foot">
                <dt>&nbsp;</dt>
                <dd><input type="submit" value="提交" class="submit"></dd>
            </dl>
        </form>
	</div>
    <script type="text/javascript">
    var email = "<?=$data['user_email']?>";
    var mobile = "<?=$data['user_mobile']?>";
    $("#type").change(function(){
        val = $(this).val();
        $("#form").find("#"+val).show().siblings("div").hide();
        $(".send").attr("data-type", val);
        $(".send").val("获取"+(val == "email" ? "邮件" : "手机")+"验证码");
    });
    var icon = '<i class="iconfont icon-exclamation-sign"></i>';
    $(".send").click(function(){
        var type = $(this).attr("data-type");
        var val = eval(type);
        msg = "获取"+(type == "email" ? "邮件" : "手机")+"验证码";
        $(".send").attr("disabled", "disabled");
        $(".send").attr("readonly", "readonly");
        $("#type").attr("disabled", "disabled");
        t = setTimeout(countDown,1000);
        var url = SITE_URL +'?ctl=Info&met=getYzm&typ=json';
        var sj = new Date();
        var pars = 'shuiji=' + sj +'&type='+type +'&val='+val; 
        $.post(url, pars, function (data){alert(data.status)})
    });
    var delayTime = 30;
    function countDown()
    {
        delayTime--;
        $(".send").val(delayTime + '秒后重新获取');
        if (delayTime == 0) {
            delayTime = 30;
            $(".send").val(msg);
            $(".send").removeAttr("disabled");
            $(".send").removeAttr("readonly");
            clearTimeout(t);
        }
        else
        {
            t=setTimeout(countDown,1000);
        }
    }
	flag = false;
function checkyzm(){
	$("label.error").remove();
	var yzm = $.trim($("#yzm").val());
	var type = $(".send").attr("data-type");
    var val = eval(type);
	var obj = $(".send");
	if(yzm == ''){
		obj.addClass('red');
	 	$("<label class='error'>"+icon+"<?=_('请填写验证码')?></label>").insertAfter(obj);
		return false;
	}
	var url = SITE_URL +'?ctl=Info&met=checkYzm&typ=json';
	var pars = 'yzm=' + yzm +'&type='+type +'&val='+val;
	$.post(url, pars, function(a){
			flag = false;
	        if (a.status == 200)
	        {
				flag = true;
	        }
	        else
	        {
	        	obj.addClass('red');
				$("<label class='error'>"+icon+"<?=_('验证码错误')?></label>").insertAfter(obj);
				return flag;
	        }
	});
	return flag;
}
$(".submit").click(function(){
		var obj = $(".send");

		/*
        var F = checkyzm();
        if(F == false) 
		{
			return false;	
		}
		*/

		var yzm = $.trim($("#yzm").val());
		var password = $.trim($("#password").val());
		var type = $(".send").attr("data-type");
		var val = eval(type);
		var pars = 'yzm=' + yzm +'&type=passwd' +'&val='+val  + '&password=' + password;
        var ajax_url = SITE_URL +'?ctl=Info&met=editAllInfo&typ=json';

        $('#form').validator({
            ignore: ':hidden',
            theme: 'yellow_right',
            timely: 1,
            stopOnError: false,
            fields: {
                'yzm':'required;',
                'password':'required;',
            },
            valid:function(form){
                //表单验证通过，提交表单
                $.ajax({
                    url: ajax_url,
                    data:pars,
                    success:function(a){
                        if(a.status == 200)
                        {
							Public.tips.success("<?=_('操作成功')?>");
                            location.href= SITE_URL +"?ctl=Info&met=security";
                        }else if(a.status == 240){
							obj.addClass('red');
							$("<label class='error'>"+icon+"<?=_('验证码错误')?></label>").insertAfter(obj);
						}
                        else
                        {
                            Public.tips.error("<?=_('操作失败')?>");
                        }
                    }
                });
            }

        });

    });
    </script>
    <?php }else{?>
        <div class="security-tips">修改密码前必须先进行邮箱绑定或手机绑定，点击这里进行<a href="<?=Yf_Registry::get('ucenter_api_url')?>?ctl=User&met=security&op=mobile">手机绑定</a>或<a href="<?=Yf_Registry::get('ucenter_api_url')?>?ctl=User&met=security&op=email">邮箱绑定</a></div>
    <?php }?>
</div>
<?php
include $this->view->getTplPath() . '/' . 'footer.php';
?>