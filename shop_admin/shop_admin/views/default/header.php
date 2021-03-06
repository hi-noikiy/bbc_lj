<?php if (!defined('ROOT_PATH')){exit('No Permission');}?><!doctype html>
<html>
<head>
	<meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=11">
	<meta name="viewport" content="width=1280, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
	<meta name="renderer" content="webkit|ie-comp|ie-stand">
	<title>远丰商城系统管理中心</title>

	<link href="<?= $this->view->css ?>/iconfont/iconfont.css" rel="stylesheet" type="text/css">
	<link href="<?= $this->view->css ?>/ui.min.css?ver=20140430" rel="stylesheet">
	<link href="<?= $this->view->css ?>/common.css?ver=20140430" rel="stylesheet" type="text/css">
	<script src="<?= $this->view->js_com ?>/jquery-1.10.2.min.js"></script>
	<script src="<?= $this->view->js_com ?>/json2.js"></script>
	<script src="<?= $this->view->js_com ?>/plugins.js?ver=20140430"></script>
	<script src="<?= $this->view->js_com ?>/plugins/jquery.dialog.js?ver=20140430"></script>
	<script src="<?= $this->view->js_com ?>/plugins/grid.js?ver=20140430"></script>
	<script src="<?= $this->view->js ?>/models/common.js?ver=20140430"></script>
	<script src="<?= $this->view->js ?>/models/config.js?ver=20140430"></script>

	<script type="text/javascript">
		var BASE_URL = "<?=Yf_Registry::get('base_url')?>";
		var SITE_URL = "<?=Yf_Registry::get('url')?>";
		var INDEX_PAGE = "<?=Yf_Registry::get('index_page')?>";
		var STATIC_URL = "<?=Yf_Registry::get('static_url')?>";
		var SHOP_URL =  "<?=Yf_Registry::get('shop_api_url')?>";

		var DOMAIN = document.domain;
		var WDURL = "";
		var SCHEME = "default";
		try
		{
			//document.domain = 'ttt.com';
		} catch (e)
		{
		}

		var SYSTEM = SYSTEM || {};
		SYSTEM.skin = 'green';
		SYSTEM.isAdmin = true;
		SYSTEM.siExpired = false;
	</script>