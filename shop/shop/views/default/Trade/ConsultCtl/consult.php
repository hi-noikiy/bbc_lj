<?php if (!defined('ROOT_PATH')) {exit('No Permission');}?>
<?php
include $this->view->getTplPath() . '/'  . 'header.php';
?>

    <link href="<?= $this->view->css ?>/iconfont/iconfont.css" rel="stylesheet" type="text/css">
    
<link href="<?=$this->view->css?>/index.css" rel="stylesheet" type="text/css">
<link rel="stylesheet" href="<?=$this->view->css_com?>/jquery/plugins/validator/jquery.validator.css">
<script type="text/javascript" src="<?=$this->view->js_com?>/plugins/validator/jquery.validator.js" charset="utf-8"></script>
<script type="text/javascript" src="<?=$this->view->js_com?>/plugins/validator/local/zh_CN.js" charset="utf-8"></script>
    <link href="<?= $this->view->css_com ?>/jquery/plugins/datepicker/dateTimePicker.css" rel="stylesheet" type="text/css">
    <script type="text/javascript" src="<?=$this->view->js_com?>/plugins/jquery.datetimepicker.js" charset="utf-8"></script>
<script type="text/javascript">
    var BASE_URL = "<?= Yf_Registry::get('base_url') ?>";
</script>
</head>
<body>
<div class="wrapper page">
    <div class="fixed-bar">
        <div class="item-title">
            <div class="subject">
                <h3>咨询管理</h3>
                <h5>商品咨询管理与设置</h5>
            </div>
            <ul class="tab-base nc-row">
                <li><a class="current"><span>咨询管理</span></a></li>
                <li><a href="<?= Yf_Registry::get('url') ?>?ctl=Trade_Consult&met=type"><span>类型设置</span></a></li>
                <li><a href="<?= Yf_Registry::get('url') ?>?ctl=Config&met=consult&config_type%5B%5D=consult"><span>头部文字设置</span></a></li>
            </ul>
        </div>
    </div>
    <!-- 操作说明 -->
    <p class="warn_xiaoma"><span></span><em></em></p><div class="explanation" id="explanation">
        <div class="title" id="checkZoom"><i class="iconfont icon-lamp"></i>
            <h4 title="提示相关设置操作时应注意的要点">操作提示</h4>
            <span id="explanationZoom" title="收起提示"></span><em class="close_warn">X</em></div>
        <ul>
            <li>退款咨询内容操作</li>
        </ul>
    </div>
    
        <div class="mod-toolbar-top cf">
            <div class="left">
                <div id="assisting-category-select" class="ui-tab-select">
                    <ul class="ul-inline">
                        <li>
                            <input type="text" id="consult_question" class="ui-input ui-input-ph con" placeholder="咨询内容...">
                        </li>
                        <li>
                            <input type="text" id="user_account" class="ui-input ui-input-ph con" placeholder="咨询人账号...">
                        </li>
                        <li>
                            <input id="start_time" class="ui-input ui-datepicker-input" type="text" readonly placeholder="开始时间"/>
                            至
                            <input id="end_time" class="ui-input  ui-datepicker-input" type="text"  readonly placeholder="结束时间"/>
                        </li>
                        <li><a class="ui-btn" id="search">查询<i class="iconfont icon-btn02"></i></a></li>
                    </ul>
                </div>
            </div>
	    <div class="fr">
		<a class="ui-btn ui-btn-sp" id="btn-refresh">刷新<i class="iconfont icon-btn01"></i></a>
            </div>
        </div>
        <div class="grid-wrap">
            <table id="grid">
            </table>
            <div id="page"></div>
        </div>
   
    <script src="<?=$this->view->js?>/controllers/trade/consult/consult_list.js"></script>
</div>

<?php
include $this->view->getTplPath() . '/' . 'footer.php';
?>