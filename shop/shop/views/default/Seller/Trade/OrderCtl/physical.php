<?php if (!defined('ROOT_PATH')) exit('No Permission');?>

<?php
include $this->view->getTplPath() . '/' . 'seller_header.php';
?>

<link href="<?= $this->view->css ?>/seller_center.css?ver=<?= VER ?>" rel="stylesheet">
<link href="<?= $this->view->css ?>/base.css?ver=<?= VER ?>" rel="stylesheet">
<link href="<?= $this->view->css_com ?>/jquery/plugins/dialog/green.css?ver=<?=VER?>" rel="stylesheet">
<script src="<?= $this->view->js_com ?>/plugins/jquery.dialog.js" charset="utf-8"></script>

	<style>

		.search-form {
			color: #999;
			width: 100%;
			margin-top: 10px;
			border-bottom: solid 1px #E6E6E6;
		}

		.search-form td {
			text-align: left;
			padding: 8px 0;
		}

		.w240 {
			width: 240px;
		}

		.w100 {
			width: 100px !important;
		}

		.w160 {
			width: 160px;
		}

		.search-form td {
			text-align: left;
			padding: 8px 0;
		}

		.search-form input[type="text"], input[type="password"], input.text, input.password {
			font: 12px/20px Arial;
			color: #777;
			background-color: #FFF;
			vertical-align: top;
			display: inline-block;
			height: 20px;
			padding: 4px;
			border: solid 1px #E6E9EE;
			outline: 0 none;
		}

		#skip_off{
			vertical-align: middle;
		}

		a.ncbtn {
			height: 20px;
			padding: 5px 10px;
			border-radius: 3px;
		}

		a.ncbtn-grapefruit {
			background-color: #ED5564;
		}

		.tabmenu a.ncbtn {
			position: absolute;
			z-index: 1;
			top: -2px;
			right: 0px;
			background-color: #FB6E52;
		}

		.add-on {
			height: 28px;
		}

		a.ncbtn-mini, a.ncbtn {
			cursor: pointer;
			line-height: 16px;
			height: 16px;
			padding: 3px 7px;
			border-radius: 2px;
			margin-left: 0px;
		}

		.search-form input.text {
			height: 20px !important;
		}
	</style>
</head>
<body>
<form>
	<table class="search-form">
		<tbody>
		<tr>
			<td>&nbsp;</td>
			<td><input type="checkbox" id="skip_off" value="1" <?php if (!empty($condition['order_status:<>'])) {
					echo 'checked';
				} ?> name="skip_off"> <label class="relative_left" for="skip_off">不显示已关闭的订单</label>
			</td>
			<th>下单时间</th>
			<td class="w240">
				<input type="text" class="text w70 hasDatepicker heigh" placeholder="起始时间" name="query_start_date" id="query_start_date" value="<?php if (!empty($condition['order_create_time:>='])) {
					echo $condition['order_create_time:>='];
				} ?>" readonly="readonly"><label class="add-on"><i class="iconfont icon-rili"></i></label><span class="rili_ge">–</span>
				<input id="query_end_date" class="text w70 hasDatepicker heigh" placeholder="结束时间" type="text" name="query_end_date" value="<?php if (!empty($condition['order_create_time:<='])) {
					$condition['order_create_time:<='];
				} ?>" readonly="readonly"><label class="add-on"><i class="iconfont icon-rili"></i></label>
			</td>
			<th>买家</th>
			<td class="w100">
				<input type="text" class="text w80" placeholder="买家昵称" id="buyer_name" name="buyer_name" value="<?php if (!empty($condition['buyer_user_name:LIKE'])) {
					echo str_replace('%', '', $condition['buyer_user_name:LIKE']);
				} ?>"></td>
			<th>订单编号</th>
			<td class="w160">
				<input type="text" class="text w150 heigh" placeholder="请输入订单编号" id="order_sn" name="order_sn" value="<?php if (!empty($condition['order_id'])) {
					echo $condition['order_id'];
				} ?>"></td>
			<td class="w70 tc"><a onclick="formSub()" class="button btn_search_goods" href="javascript:void(0);"><i class="iconfont icon-btnsearch"></i>搜索</a>
			<input name="ctl" value="Seller_Trade_Order" type="hidden" /><input name="met" value="physical" type="hidden" />
			</td>
			<td class="mar"><a class="button refresh" onclick="location.reload()"><i class="iconfont icon-huanyipi"></i></a><td>
		</tr>
		</tbody>
	</table>
</form>

<table class="ncsc-default-table order ncsc-default-table2">
	<thead>
	<tr>
		<th class="w10"></th>
		<th colspan="2">商品</th>
		<th class="w100">单价<!--（<?/*=Web_ConfigModel::value('monetary_unit')*/?>）--></th>
		<th class="w40">数量</th>
		<th class="w100">买家</th>
		<th class="w100">订单金额</th>
		<th class="w90">交易状态</th>
		<th class="w120">交易操作</th>
	</tr>
	</thead>

	<?php if ( !empty($data['items']) ) { ?>
	<?php foreach ( $data['items'] as $key => $val ) { ?>
	<tbody>
	<tr>
		<td colspan="20" class="sep-row"></td>
	</tr>
	<tr>
		<th colspan="20"><span class="ml10">订单编号：<em><?= $val['order_id']; ?></em>
                </span> <span>下单时间：<em class="goods-time"><?= $val['order_create_time']; ?></em></span>
			<span class="fr mr5"> <a href="<?= $val['delivery_url']; ?>" class="ncbtn-mini bbc_seller_btns" target="_blank" title="打印发货单"><i class="icon-print"></i>打印发货单</a></span>
		</th>
	</tr>

	<!-- S商品列表 -->
	<?php if( !empty($val['goods_list']) ) { ?>
	<?php foreach( $val['goods_list'] as $k => $v ) { ?>
	<tr>
		<td class="bdl"></td>
		<td class="w70">
			<div class="ncsc-goods-thumb">
				<a href="<?= $v['goods_link']; ?>" target="_blank"><img src="<?= $v['goods_image']; ?>"></a>
			</div>
		</td>
		<td class="tl">
			<dl class="goods-name">
				<dt>
					<a target="_blank" href="<?= $v['goods_link']; ?>"><?= $v['goods_name']; ?></a>
					<a target="_blank" class="blue ml5" href="<?= $v['goods_link']; ?>">[交易快照]</a>
				</dt>
				<dd></dd>
				<!-- S消费者保障服务 -->
				<!-- E消费者保障服务 -->
			</dl>
		</td>
		<td><p><?= @format_money($v['goods_price']); ?></p>
		</td>
		<td><?= $v['order_goods_num']; ?></td>

		<!-- S 合并TD -->
		<?php if ( $k == 0 ) { ?>
		<td class="bdl" rowspan="<?= $val['goods_cat_num']; ?>">
			<div class="buyer"><?= $val['buyer_user_name']; ?><p member_id="<?= $val['buyer_user_id']; ?>"></p>
				<div class="buyer-info"><em></em>
					<div class="con">
						<h3><i></i><span>联系信息</span></h3>
						<dl>
							<dt>姓名：</dt>
							<dd><?= $val['buyer_user_name']; ?></dd>
						</dl>
						<dl>
							<dt>电话：</dt>
							<dd><?= $val['order_receiver_contact']; ?></dd>
						</dl>
						<dl>
							<dt>地址：</dt>
							<dd><?= $val['order_receiver_address']; ?></dd>
						</dl>
					</div>
				</div>
			</div>
		</td>
		<td class="bdl" rowspan="<?= $val['goods_cat_num']; ?>" style="width: 126px;">
			<p class="ncsc-order-amount"><?= @format_money($val['order_payment_amount']); ?></p>
			<p class="goods-freight"><?= $val['shipping_info']; ?></p>
			<p class="goods-pay" title="支付方式：站内余额支付">站内余额支付</p>
			<?php if ( !empty($val['order_shop_benefit']) ) { ?>
				<span class="td_sale bbc_btns"><?= $val['order_shop_benefit'] ?></span>
			<?php } ?>
		</td>
		<td class="bdl bdr" rowspan="<?= $val['goods_cat_num']; ?>">
			<p><?= $val['order_stauts_text']; ?></p>
			<!-- 订单查看 -->
			<p><a href="<?= $val['info_url']; ?>" target="_blank">订单详情</a></p>
			<!-- 物流跟踪 -->
			<p></p>
		</td>
		<td class="bdl bdr" rowspan="<?= $val['goods_cat_num']; ?>">
			<?php if($val['order_ps_type']==1){?>
			<p style="margin-top:10px">物流配送</p>
			<?php }else{?>
			<p style="margin-top:10px">上门自提</p>
			<?php }?>
			<!-- 订单查看 -->
			
		</td>

		<!-- 取消订单 -->
		<td class="bdl bdr" rowspan="<?= $val['goods_cat_num']; ?>">
			<!-- 修改价格 -->
			<!-- 发货 -->
			<p>
				<?= $val['set_html']; ?>
			</p>
			<!-- 锁定 -->
		</td>
		<!-- E 合并TD -->
	</tr>
	<?php } ?>
	<?php } ?>
	<?php } ?>
	</tbody>
	<?php } ?>
	<?php } ?>
</table>

<?php if ( empty($data['items']) ) { ?>
<div class="no_account">
	<img src="<?=$this->view->img?>/ico_none.png">
	<p>暂无符合条件的数据记录</p>
</div>
<?php } ?>
<div class="page">
	<?= $data['page_nav']; ?>
</div>

<?php
include $this->view->getTplPath() . '/' . 'seller_footer.php';
?>

<script>

	$('.tabmenu').find('li:gt(5)').hide();

	$(function () {

		//时间
		$('#query_start_date').datetimepicker({
			format: 'Y-m-d',
			timepicker: false,
			onShow:function( ct ){
				this.setOptions({
					maxDate:$('#query_end_date').val() ? $('#query_end_date').val() : false
				})
			}
		});
		$('#query_end_date').datetimepicker({
			format: 'Y-m-d',
			timepicker: false,
			onShow:function( ct ){
				this.setOptions({
					minDate:$('#query_start_date').val() ? $('#query_start_date').val() : false
				})
			},
		});

		//搜索

		var URL;

		$('input[type="submit"]').on('click', function (e) {

			e.preventDefault();

			URL = createQuery();
			window.location = URL;
		});

		$('#skip_off').on('click', function () {

			URL = createQuery();
			window.location = URL;
		});

		function createQuery () {

			var url = SITE_URL + '?' + location.href.match(/ctl=\w+&met=\w+/) + '&';

			$('#query_start_date').val() && (url += 'query_start_date=' + $('#query_start_date').val() + '&');
			$('#query_end_date').val() && (url += 'query_end_date=' + $('#query_end_date').val() + '&');
			$('#buyer_name').val() && (url += 'buyer_name=' + $('#buyer_name').val() + '&');
			$('#order_sn').val() && (url += 'order_sn=' + $('#order_sn').val() + '&');
			$('#skip_off').prop('checked') && (url += 'skip_off=1&');

			return url;
		}

		//取消订单
		$('a[dialog_id="seller_order_cancel_order"]').on('click', function () {

			var order_id = $(this).data('order_id'),
				url = SITE_URL + '?ctl=Seller_Trade_Order&met=orderCancel&typ=';

			$.dialog({
				title: '取消订单',
				content: 'url: ' + url + 'e',
				data: { order_id: order_id },
				height: 250,
				width: 400,
				lock: true,
				drag: false,
				ok: function () {

					var form_ser = $(this.content.order_cancel_form).serialize();

					$.post(url + 'json', form_ser, function (data) {
						if ( data.status == 200 ) {
							parent.Public.tips({
								content: '修改成功',
								type: 3
							}), window.location.reload();
							return true;
						} else {
							parent.Public.tips({
								content: '修改失败',
								type: 1
							});
							return false;
						}
					})
				}
			})
		});
	});

	function formSub(){
		$('.search-form').parents('form').submit();
	}

</script>
