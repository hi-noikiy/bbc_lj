<{include file="header.htm"}>
<style>.matchCon{width:280px;}</style>
	<body class="body">
		<div class="wrapper">
			<div class="mod-search cf">
				<div class="fl">
					<ul class="ul-inline">
						<!-- <li><span id="catorage"></span></li> -->
						<li><input type="text" id="matchCon" class="ui-input ui-input-ph matchCon" value="输入会员卡号/手机号码/身份证号/昵称"></li>
						<li><a class="ui-btn mrb" id="search">查询</a></li>
					</ul>
				</div>
				<div class="fr">
					<!-- <a href="#" class="ui-btn ui-btn-sp mrb" id="btn-add">新增</a> -->
					<a href="#" class="ui-btn ui-btn-sp mrb" id="btn-refresh">刷新</a>
				</div>
			</div>
			<div class="grid-wrap" style="width: 735px; ">
				<table id="grid">
				</table>
				<div id="page"></div>
			</div>
		</div>
		<script src="<?= Yf_Registry::get('base_url') ?>/webpos/static/default/js/controllers/order/member_select.js"></script>
	</body>
</html>