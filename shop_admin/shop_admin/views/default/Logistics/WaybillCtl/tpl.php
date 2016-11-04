<?php if (!defined('ROOT_PATH')) {exit('No Permission');}?>
<?php
include $this->view->getTplPath() . '/'  . 'header.php';
?>
<link href="<?=$this->view->css?>/index.css" rel="stylesheet" type="text/css">
<link rel="stylesheet" href="<?=$this->view->css_com?>/jquery/plugins/validator/jquery.validator.css">
<script type="text/javascript" src="<?=$this->view->js_com?>/plugins/validator/jquery.validator.js" charset="utf-8"></script>
<script type="text/javascript" src="<?=$this->view->js_com?>/plugins/validator/local/zh_CN.js" charset="utf-8"></script>
</head>
<body>
<div class="wrapper page">
    <div class="fixed-bar">
        <div class="item-title">
            <div class="subject">
                <h3>运单模板&nbsp;</h3>
                <h5>预设供商家选择的运单快递模板</h5>
            </div>
           <ul class="tab-base nc-row">
                <li><a class="current"><span>模板列表</span></a></li>               
            </ul>
        </div>
    </div>
    <!-- 操作说明 -->
    <p class="warn_xiaoma"><span></span><em></em></p><div class="explanation" id="explanation">
        <div class="title" id="checkZoom"><i class="iconfont icon-lamp"></i>
            <h4 title="提示相关设置操作时应注意的要点">操作提示</h4>
            <span id="explanationZoom" title="收起提示"></span><em class="close_warn">X</em></div>
        <ul>		
            <li>平台现有运单模板列表。</li> 
            <li>设计完成后在编辑中修改模板状态为启用后，商家就可以绑定该模板进行运单打印。</li>
           
        </ul>
    </div>

        <div class="mod-toolbar-top cf">
			<div class="left">
                <div id="assisting-category-select" class="ui-tab-select">
                    <ul class="ul-inline">
                        <li>
                            <span id="source"></span>
                        </li>
                        <li>
                            <input type="text" id="waybill_tpl_name" class="ui-input ui-input-ph con" placeholder="请输入模板名称">
                        </li>
                        <li><a class="ui-btn" id="search">查询<i class="iconfont icon-btn02"></i></a></li>
                    </ul>
                </div>
            </div>
            <div class="fr">
				<a class="ui-btn" class="ui-btn ui-btn-sp mrb" id="btn-add" style="margin-right:10px;">新增<i class="iconfont icon-btn03"></i></a>
                <a class="ui-btn ui-btn-sp" id="btn-refresh">刷新<i class="iconfont icon-btn01"></i></a>
            </div>
        </div>
        <div class="grid-wrap">
            <table id="grid">
            </table>
            <div id="page"></div>
        </div>


</div>
<script type="text/javascript">

</script>

<script src="<?= Yf_Registry::get('base_url') ?>/shop_admin/static/default/js/controllers/logistics/tpl/tpl_list.js"></script>
<?php
include $this->view->getTplPath() . '/' . 'footer.php';
?>