<?php if (!defined('ROOT_PATH')) {exit('No Permission');}?>
<?php
include $this->view->getTplPath() . '/'  . 'header.php';
?>
<link href="<?=$this->view->css?>/index.css" rel="stylesheet" type="text/css">

<link href="<?=$this->view->css?>/sales.css?ver=201508241556" rel="stylesheet" type="text/css">
<script src="<?=$this->view->js?>/models/jquery.md5.js" type="text/javascript"></script>
</head>
<style>

#barCodeInsert{margin-left: 10px;font-weight: 100;font-size: 12px;color: #fff;background-color: #B1B1B1;padding: 0 5px;border-radius: 2px;line-height: 19px;height: 20px;display: inline-block;}
#barCodeInsert.active{background-color: #23B317;}
.hidden{display:none;}

select {
  /*Chrome和Firefox里面的边框是不一样的，所以复写了一下*/
  border: solid 1px #000;
  /*很关键：将默认的select选择框样式清除*/
  appearance:none;
  -moz-appearance:none;
  -webkit-appearance:none;
  /*在选择框的最右侧中间显示小箭头图片*/
  background: url("../../../static/default/images/img/spr_icons.png") no-repeat scroll right center transparent;
  background-position:80px -16px;
  /*为下拉小箭头留出一点位置，避免被文字覆盖*/
  padding-right: 14px;
}
/*清除ie的默认选择框样式清除，隐藏下拉箭头*/
select::-ms-expand { display: none; }
</style>
<body>


<div class="wrapper">
	<span id="config" class="ui-icon ui-state-default ui-icon-config"></span>
	<div class="mod-toolbar-top mr0 cf dn" id="toolTop"></div>
	<div class="bills cf">
		<div class="con-header">
			<dl class="cf">
				<dd class="pct25">
					<label>客户:</label>
					<span class="ui-combo-wrap" id="customer">
						<input type="text" name="" class="input-txt" autocomplete="off" value="" data-ref="date">
						<i class="ui-icon-ellipsis"></i>
					</span>
				</dd>
				<dd class="pct20 tc">
				  <label>下单日期:</label>
				  <input type="text" id="date" class="ui-input ui-datepicker-input" value="2015-09-08">
				</dd>
				
				<dd id="classes" class="pct15 tr">
					<input type="hidden" name="classes" value="150601">
				</dd>
			</dl>
			
		</div>
    
		<div class="grid-wrap">
			<table id="grid"></table>
			<div id="page"></div>
		</div>
   
		<div class="con-footer cf">
			<div class="mb10">
				<textarea type="text" id="note" class="ui-input ui-input-ph">暂无备注信息</textarea>
			</div>
			
			<ul id="amountArea" class="cf">
				<li>
					<label>优惠率:</label>
					<input type="text" id="discountRate" class="ui-input" data-ref="deduction">%
				</li>
				<li>
					<label>优惠金额:</label>
					<input type="text" id="deduction" class="ui-input" data-ref="payment">
				</li>
				<li>
					<label>优惠后金额:</label>
					<input type="text" id="discount" class="ui-input ui-input-dis" data-ref="discountRate" disabled>
				</li>
				<li>
					<label>账户余额:</label>
					<input type="text" id="cash" value="0" class="ui-input ui-input-dis" data-ref="cash" disabled>
				</li>
				<li id="accountWrap" class="">
					<label>支付方式:</label>
					<span class="ui-combo-wrap" id="account" style="padding:0;">
						<select style="border:0px;height:30px;width:100px;" id="paymentMethod" name="paymentMethod">
							<option value="1">现金支付</option>
							<option value="2">余额支付</option>
							<!-- <option value="1">POS刷卡</option>
							<option value="1">支付宝</option>
							<option value="1">微信支付</option> -->
						</select>
						<!-- <input type="text" class="input-txt" autocomplete="off" value="现金支付" disabled> -->
						<!-- <i class="trigger"></i> -->
					</span>
					<a id="accountInfo" class="ui-icon ui-icon-folder-open" style="display:none;"></a>
				</li>
				<li>
					<label>支付密码:</label>
					<input type="password" id="password" value="" class="ui-input" data-ref="password">
				</li>
			</ul>
			<ul class="c999 cf">
				<li>
					<label>最后修改时间:</label>
					<span id="modifyTime"></span>
				</li>
			</ul>
		</div>
		
		<div class="cf" id="bottomField">
			<div class="fr" id="toolBottom"></div>
		</div>
		<div id="mark"></div>
	</div>
  
	<div id="initCombo" class="dn">
		<input type="text" class="textbox goodsAuto" name="goods" autocomplete="off">
		<input type="text" class="textbox storageAuto" name="storage" autocomplete="off">
		<input type="text" class="textbox unitAuto" name="unit" autocomplete="off">
		<input type="text" class="textbox priceAuto" name="price" autocomplete="off">
		<input type="text" class="textbox skuAuto" name="price" autocomplete="off">
	</div>
	<div id="storageBox" class="shadow target_box dn"></div>
</div>

<script src="<?= Yf_Registry::get('base_url') ?>/webpos/static/default/js/controllers/order/place_order.js"></script>
<?php
include $this->view->getTplPath() . '/' . 'footer.php';
?>