<?php if (!defined('ROOT_PATH')) {exit('No Permission');}?>
<?php
include $this->view->getTplPath() . '/'  . 'header.php';
?>
<link href="<?=$this->view->css?>/index.css" rel="stylesheet" type="text/css">
<link rel="stylesheet" href="<?=$this->view->css_com?>/jquery/plugins/validator/jquery.validator.css">
<script type="text/javascript" src="<?=$this->view->js_com?>/plugins/validator/jquery.validator.js" charset="utf-8"></script>
<script type="text/javascript" src="<?=$this->view->js_com?>/plugins/validator/local/zh_CN.js" charset="utf-8"></script>
<style>

    .ui-jqgrid tr.jqgrow .img_flied{padding: 1px; line-height: 0px;}
    .img_flied img{width: 60px; height: 60px;}

</style>
</head>
<body style="background-color: #FFF; overflow: auto;">
<script type="text/javascript" src="http://b2b2c.shopnctest.com/tesa/shopnc/resource/js/jquery.picTip.js"></script>
<div id="append_parent"></div>
<div id="ajaxwaitid"></div>

<div class="page">
    <div class="fixed-bar">
        <div class="item-title">
            <div class="subject">
                <h3>品牌管理</h3>
                <h5>商品品牌管理及店铺申请品牌审核</h5>
            </div>
            <ul class="tab-base nc-row">
                <li><a href="index.php?ctl=Goods_Brand&met=brand">管理</a></li>
                <li><a href="index.php?ctl=Goods_Brand&met=brands" class="current">待审核</a></li>
            </ul>
        </div>
    </div>
    <p class="warn_xiaoma"><span></span><em></em></p><div class="explanation" id="explanation">
        <div class="title" id="checkZoom"><i class="iconfont icon-lamp"></i>
            <h4 title="提示相关设置操作时应注意的要点">操作提示</h4>
            <span id="explanationZoom" title="收起提示"></span><em class="close_warn">X</em> </div>
        <ul>
            <li>当店主添加商品时可选择商品品牌，用户可根据品牌查询商品列表</li>
            <li>被推荐品牌，将在前台品牌推荐模块处显示</li>
            <li>在品牌列表页面，品牌将按类别分组，即具有相同类别的品牌为一组，品牌类别与品牌分类无联系</li>
        </ul>
    </div>
    <div class="wrapper">
        <div class="mod-search cf">
            <div class="fl">
                <ul class="ul-inline">
                    <li>
                        <input type="text" id="matchCon" class="ui-input ui-input-ph matchCon" placeholder="按品牌名称" value="">
                    </li>
                    <li><a class="ui-btn mrb" id="search">查询<i class="iconfont icon-btn02"></i></a></li>
                </ul>
            </div>
            <div class="fr"><a href="#" class="ui-btn ui-btn-sp mrb" id="btn-add">新增<i class="iconfont icon-btn03"></i></a><!--<a href="#" class="ui-btn mrb" id="btn-print">打印</a>--><a href="javascript:void(0)" class="ui-btn mrb" id="export">导出<i class="iconfont icon-btn04"></i></a><!--<a href="#" class="ui-btn" id="btn-batchDel">删除</a>--></div>
        </div>
        <div class="grid-wrap">
            <table id="grid">
            </table>
            <div id="page"></div>
        </div>
    </div>
</div>

<script type="text/javascript" src="<?=$this->view->js?>/controllers/goods/goods_brands.js" charset="utf-8"></script>
<?php
include $this->view->getTplPath() . '/' . 'footer.php';
?>
