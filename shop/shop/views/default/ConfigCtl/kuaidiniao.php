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
                <h3>物流设置&nbsp;</h3>
                <h5>快递状态查询设置</h5>
            </div>
            <ul class="tab-base nc-row">
                <li><a href="<?= Yf_Registry::get('url') ?>?ctl=Config&met=logistics&config_type%5B%5D=logistics&typ=e"><span>物流查询选用设置</span></a></li>
                <li><a href="<?= Yf_Registry::get('url') ?>?ctl=Config&met=kuaidi100&config_type%5B%5D=kuaidi100"><span>快递100</span></a></li>
                <li><a class="current"><span>快递鸟</span></a></li>
            </ul>
        </div>
    </div>
    <!-- 操作说明 -->
    <p class="warn_xiaoma"><span></span><em></em></p><div class="explanation" id="explanation">
        <div class="title" id="checkZoom"><i class="iconfont icon-lamp"></i>
            <h4 title="提示相关设置操作时应注意的要点">操作提示</h4>
            <span id="explanationZoom" title="收起提示"></span><em class="close_warn">X</em></div>
        <ul>
            <li>点击提交申请快递鸟APP</li>
        </ul>
    </div>
    
    <?php
  ?>
    <form method="post" id="kuaidiniao-setting-form" name="settingForm">
        <input type="hidden" name="config_type[]" value="kuaidiniao"/>

        <div class="ncap-form-default">
            <dl class="row">
                <dt class="tit">
                    <label for="site_name">APP Key</label>
                </dt>
                <dd class="opt">
                    <input id="kuaidiniao_app_key" name="kuaidiniao[kuaidiniao_app_key]" value="<?=$data['kuaidiniao_app_key']['config_value']?>" class="w400 ui-input " type="text"/>
                    <p class="notic">尚无App Key, <a href="http://www.kdniao.com/ServiceApply.aspx" target="_blank">点击申请</a></p>
                </dd>
            </dl>

            <dl class="row">
                <dt class="tit">
                    <label for="site_name">APP Business Id</label>
                </dt>
                <dd class="opt">
                    <input id="kuaidiniao_e_business_id" name="kuaidiniao[kuaidiniao_e_business_id]" value="<?=$data['kuaidiniao_e_business_id']['config_value']?>" class="w400 ui-input " type="text"/>
                </dd>
            </dl>


            <dl class="row">
                <dt class="tit">
                    <label for="site_name">选择采用的快递公司</label>
                </dt>
                <dd class="opt">

                <?php
                	$data['kuaidiniao_express']['config_value'] = decode_json($data['kuaidiniao_express']['config_value']);

					$kdniao_logistics_config = include_once INI_PATH . '/logistics.ini.php';
                	//foreach ($data['kuaidiniao_express']['config_value'] as $k=>$kuaidiniao_expres)
                	foreach ($kdniao_logistics_config as $k=>$kuaidiniao_expres)
                	{
				?>
                   <input id="kuaidiniao_express_<?=$k?>" name="kuaidiniao[kuaidiniao_express][]" value="<?=$k?>" type="checkbox" <?=in_array($k, $data['kuaidiniao_express']['config_value']) ? "checked" : ""?>  /> <label title="开启" class="titlelabel"  for="kuaidiniao_express_<?=$k?>" style="padding-right: 10px;"><?=$kuaidiniao_expres?></label>
				<?php
                	}
                
                ?>
                    <p class="notic"></p>
                </dd>
            </dl>
			<!--
            <dl class="row">
                <dt class="tit">是否启用</dt>
                <dd class="opt">
                    <div class="onoff">
                        <input id="kuaidiniao_status1" name="kuaidiniao[kuaidiniao_status]"  value="1" type="radio" <?=($data['kuaidiniao_status']['config_value']==1 ? 'checked' : '')?>>
						<label title="开启" class="cb-enable <?=($data['kuaidiniao_status']['config_value']==1 ? 'selected' : '')?> " for="kuaidiniao_status1">开启</label>

                        <input id="kuaidiniao_status0" name="kuaidiniao[kuaidiniao_status]"  value="0" type="radio" <?=($data['kuaidiniao_status']['config_value']==0 ? 'checked' : '')?>>
						<label title="关闭" class="cb-disable <?=($data['kuaidiniao_status']['config_value']==0 ? 'selected' : '')?>" for="kuaidiniao_status0">关闭</label>
                    </div>
                    <p class="notic"></p>
                </dd>
            </dl>
			-->
            <div class="bot"><a href="javascript:void(0);" class="ui-btn ui-btn-sp submit-btn">确认提交</a></div>
        </div>
    </form>
</div>

<script type="text/javascript">
</script>
<script type="text/javascript" src="<?=$this->view->js?>/controllers/config.js" charset="utf-8"></script>
<?php
include $this->view->getTplPath() . '/' . 'footer.php';
?>