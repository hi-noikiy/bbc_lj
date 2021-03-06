<?php if (!defined('ROOT_PATH')) {exit('No Permission');}?>
<?php
include $this->view->getTplPath() . '/'  . 'header.php';
?>
<link href="<?=$this->view->css?>/index.css" rel="stylesheet" type="text/css">
</head>
<body>
<div class="wrapper page">
    <div class="fixed-bar">
        <div class="item-title">
            <div class="subject">
                <h3>运营设置</h3>
                <h5>各个运营模块的相关设置</h5>
            </div>
            <ul class="tab-base nc-row">
                <li><a class="current"><span>运营设置</span></a></li>
            </ul>
        </div>
    </div>
    <!-- 操作说明 -->
    <p class="warn_xiaoma"><span></span><em></em></p><div class="explanation" id="explanation">
        <div class="title" id="checkZoom"><i class="iconfont icon-lamp"></i>
            <h4 title="提示相关设置操作时应注意的要点">操作提示</h4>
            <span id="explanationZoom" title="收起提示"></span><em class="close_warn">X</em></div>
        <ul>
            <li>运营设置操作</li>
        </ul>
    </div>
    
    <form method="post" id="operation-setting-form" name="settingForm">
        <input type="hidden" name="config_type[]" value="operation"/>

        <div class="ncap-form-default">
            <dl class="row">
                <dt class="tit">消费者保障服务</dt>
                <dd class="opt">
                    <ul class="nofloat">
                        <li>
			    <div class="onoff">
				<label title="开启" class="cb-enable <?=($data['protection_service_status']['config_value']==1 ? 'selected' : '')?> " for="protection_service_enable">开启</label>
				<label title="关闭" class="cb-disable <?=($data['protection_service_status']['config_value']==0 ? 'selected' : '')?>" for="protection_service_disabled">关闭</label>
				<input type="radio" value="1" name="operation[protection_service_status]" id="protection_service_enable" <?=($data['protection_service_status']['config_value']==1 ? 'checked' : '')?> />
				<input type="radio" value="0" name="operation[protection_service_status]" id="protection_service_disabled" <?=($data['protection_service_status']['config_value']==0 ? 'checked' : '')?> />
			    </div>
                        </li>
                    </ul>
                    <p class="notic">消费者保障服务开启后，店铺可以申请加入保障服务，为消费者提供商品筛选依据</p>
                </dd>
            </dl>
            <dl class="row">
                <dt class="tit">物流自提服务站</dt>
                <dd class="opt">
                    <ul class="nofloat">
                        <li>
                            <div class="onoff">
				<label title="开启" class="cb-enable <?=($data['service_station_status']['config_value']==1 ? 'selected' : '')?> " for="service_station_enable">开启</label>
				<label title="关闭" class="cb-disable <?=($data['service_station_status']['config_value']==0 ? 'selected' : '')?>" for="service_station_disabled">关闭</label>
				<input type="radio" value="1" name="operation[service_station_status]" id="service_station_enable" <?=($data['service_station_status']['config_value']==1 ? 'checked' : '')?> />
				<input type="radio" value="0" name="operation[service_station_status]" id="service_station_disabled" <?=($data['service_station_status']['config_value']==0 ? 'checked' : '')?> />
			    </div>
                        </li>
                    </ul>
                    <p class="notic">现在去设置物流自提服务站使用的快递公司</p>
                </dd>
            </dl>
            <div class="bot"><a href="JavaScript:void(0);" class="ui-btn ui-btn-sp submit-btn">确认提交</a></a></div>
        </div>
    </form>
</div>
    <script type="text/javascript" src="<?=$this->view->js?>/controllers/config.js" charset="utf-8"></script>
<?php
include $this->view->getTplPath() . '/' . 'footer.php';
?>