<?php if (!defined('ROOT_PATH'))
{
	exit('No Permission');
} ?>
<?php
include $this->view->getTplPath() . '/' . 'header.php';
?>

<div class="pc_user_about wrap">
	<h4><?=_('财富概况')?></h4>
	<div class="pc_user_mes clearfix">
		<div class="pc_user_mes_lf fl clearfix">
			<p class="pc_user_mes_lf_img fl"><img src="<?=_($user_info['user_avatar'])?>"></p>
			<div class="pc_user_mes_lf_text fr">
				<dl class="clearfix">
					<dt><i class="iconfont icon-yonghuming"></i><?=_('用户名称')?></dt>
					<dd><?=$user_info['user_nickname']?></dd>
				</dl>
				<?php if(!empty($user_info['user_mobile'])){?>
				<dl class="clearfix">
					<dt><i class="iconfont icon-shoujihao"></i><?=_('手机号码')?></dt>
					<dd><?=$user_info['user_mobile']?></dd>
				</dl>
				<?php }?>
				<?php if(!empty($user_info['user_email'])){?>
				<dl class="clearfix">
					<dt><i class="iconfont icon-youxiang"></i><?=_('绑定邮箱')?></dt>
					<dd><?=$user_info['user_email']?></dd>
				</dl>
				<?php }?>
				<dl class="clearfix">
					<dt><i class="iconfont icon-shangcidenglushijian"></i><?=_('上次登录时间')?></dt>
					<dd><?=$user_base['user_login_time']?></dd>
				</dl>
			</div>
		</div>
		<div class="pc_user_mes_rt fr clearfix">
			<div class="pc_user_mes_rt_percent fl">
				<img src="<?= $this->view->img ?>/percent.png">
				<p class="pc_account"><?=_('账户总财产：')?><span><?=(format_money($user_resource['user_money'] + $user_resource['user_money_frozen'] + $user_resource['user_rechange_card'] + $user_resource['user_rechange_card_frozen']))?></span></p>
			</div>
			<div class="pc_user_mes_rt_text fl">
				<dl class="clearfix dl-public">
					<dt><span class="pc_col_reprens bgb"></span><?=_('账户余额：')?></dt>
					<dd><?=(format_money($user_resource['user_money']))?></dd>
				</dl>
				<dl class="clearfix dl-public">
					<dt class="dt_pad"><span class="pc_col_reprens bgy"></span><?=_('卡余额')?><i>：</i></dt>
					<dd><?=(format_money($user_resource['user_rechange_card']))?></dd>
				</dl>
				<dl class="clearfix dl-public">
					<dt><span class="pc_col_reprens bgr"></span><?=_('冻结资金：')?></dt>
					<dd><?=(format_money($user_resource['user_money_frozen']))?></dd>
				</dl>
				<dl class="clearfix pc_a_btn dl-public">
					<dd><a target="_blank" href="<?= Yf_Registry::get('url') ?>?ctl=Info&met=deposit&typ=e" class="pc_btn"><?=_('充值')?></a></dd>
					<dd><a target="_blank" href="<?= Yf_Registry::get('url') ?>?ctl=Info&met=withdraw&typ=e" class="pc_btn btn_active"><?=_('提现')?></a></dd>
					<dd><a target="_blank" href="<?= Yf_Registry::get('url') ?>?ctl=Info&met=transfer&typ=e" class="pc_btn"><?=_('转账')?></a></dd>
				</dl>
			</div>
		</div>
	</div>
</div>

<div class="pc_transaction wrap">
	<h4><?=_('最近交易')?><span class="trade_types"><a target="_blank" href="<?= Yf_Registry::get('url') ?>?ctl=Info&met=recordlist&type=3&typ=e" ><?=_('充值记录')?></a>&nbsp;|&nbsp;<a target="_blank" href="<?= Yf_Registry::get('url') ?>?ctl=Info&met=recordlist&type=2&typ=e" ><?=_('转账记录')?></a>&nbsp;|&nbsp;<a target="_blank" href="<?= Yf_Registry::get('url') ?>?ctl=Info&met=recordlist&type=4&typ=e" ><?=_('提现记录')?></a></span></h4>
	
	<div class="pc_table_head clearfix">
		<p class="pc_trans_time"><span><?=_('创建时间')?></span></p>
		<p class="pc_trans_other">
			<span class="pc_table_num"><?=_('名称')?>&nbsp;|&nbsp;<?=_('对方')?>&nbsp;|&nbsp;<?=_('交易号')?></span><span class="wp20"><?=_('金额')?></span><span class="wp20"><?=_('状态')?></span><span class="wp20"><?=_('操作')?></span>
		</p>
	</div>
	<?php foreach($consume_record_list['items'] as $conkey => $conval){?>
	<div class="pc_trans_lists clearfix">
		<div class="pc_trans_time pc_trans_det_time"><?=($conval['record_time'])?></div>
		<div class="pc_trans_det pc_trans_other">
			<p class="pc_table_num"><span><?=($conval['record_title'])?></span><span class="jyh"><?=_('交易号:')?><?=($conval['order_id'])?></span></p>
			<p class="wp20">
				<span class="textcolor">
						<?=(format_money($conval['record_money']))?>
				</span>
			</p>
			<p class="wp20"><span><?=($conval['record_status_con'])?></span></p>
			<p class="wp20"><a href="<?=Yf_Registry::get('url')?>?ctl=Info&met=recorddetail&id=<?=$conval['consume_record_id']?>" class="cb"><?=_('详情')?></a><a></a></p>
		</div>
	</div>
	<?php }?>
	<div class="pc_trans_btn"><a href="<?=Yf_Registry::get('url')?>?ctl=Info&met=recordlist" class="btn_big btn_active"><?=_('查看更多账单')?></a></div>
</div>
<?php
include $this->view->getTplPath() . '/' . 'footer.php';
?>