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
        a.ncbtn-mini, a.ncbtn {
            font: normal 12px/20px "microsoft yahei", arial;
            text-align: center;
            vertical-align: middle;
            display: inline-block;
            height: 20px;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
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

        a {
            color: #333;
        }

        .blue {
            color: #27A9E3 !important;
        }

        .search-form input.text {
            height: 20px !important;
        }
    </style>

</head>
<body>


<div class="alert1 alert-block mt10">
    <ul class="mt5">
        <li>1、可以对待发货的订单进行发货操作，发货时可以设置收货人和发货人信息，填写一些备忘信息，选择相应的物流服务，打印发货单。</li>
        <li>2、已经设置为发货中的订单，您还可以继续编辑上次的发货信息。</li>
        <li>3、如果因物流等原因造成买家不能及时收货，您可使用点击延迟收货按钮来延迟系统的自动收货时间。</li>
    </ul>
</div>

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
                <input name="ctl" value="Seller_Trade_Deliver" type="hidden" /><input name="met" value="deliver" type="hidden" />
            </td>
            <td class="mar"><a class="button refresh" onclick="location.reload()"><i class="iconfont icon-huanyipi"></i></a></td>
        </tr>
        </tbody>
    </table>
</form>

<table class="ncsc-default-table order deliver ncsc-default-table2">
    
    <?php if ( !empty($data['items']) ) { ?>
    <?php foreach( $data['items'] as $key => $val ) { ?>
    <tbody>
    <tr>
        <td colspan="21" class="sep-row"></td>
    </tr>
    <tr>
        <th colspan="21">
            <span class="ml5">订单编号：<strong><?= $val['order_id']; ?></strong></span><span>下单时间：<em class="goods-time"><?= $val['order_create_time']; ?></em></span>
         <span class="fr mr10">
                <a href="<?= $val['delivery_url']; ?>" target="_blank" class="ncbtn-mini bbc_seller_btns" title="打印发货单">
                    <i class="icon-print"></i>打印发货单
                </a>
         </span>
        </th>
    </tr>
    
    <?php if ( !empty($val['goods_list']) ) { ?>
    <?php foreach ( $val['goods_list'] as $k => $v ) { ?>
    <tr>
        <td class="bdl w10"></td>
        <td class="w50">
            <div class="pic-thumb">
                <a href="<?= $v['goods_link']; ?>" target="_blank">
                    <img src="<?= $v['goods_image']; ?>" >
                </a>
            </div>
        </td>
        <td class="tl">
            <dl class="goods-name">
                <dt>
                    <a target="_blank" href="<?= $v['goods_image']; ?>"><?= $v['goods_name']; ?></a>
                </dt>
                <dd><strong>￥<?= $v['goods_price']; ?></strong>&nbsp;x&nbsp;<em><?= $v['order_goods_num']; ?></em>件</dd>
            </dl>
        </td>

        <?php if ( $k == 0 ) { ?>
        <!-- S 合并TD -->
        <td class="bdl bdr order-info w500" rowspan="<?= $val['goods_cat_num']; ?>">
            <dl>
                <dt>买家：</dt>
                <dd><?= $val['buyer_user_name']; ?> <span member_id="<?= $val['buyer_user_id']; ?>"></span>
                </dd>
            </dl>
            <dl>
                <dt>收货人：</dt>
                <dd>
                    <div class="alert alert-info m0">
                        <p><i class="icon-user"></i><?= $val['order_receiver_name']; ?><span class="ml30" title="电话"><i class="icon-phone"></i><?= $val['order_receiver_contact']; ?></span>
                        </p>
                        <p class="mt5" title="收货地址"><i class="icon-map-marker"></i><?= $val['order_receiver_address']; ?></p>
                        <p class="mt5" title="收货地址"><i class="icon-map-marker"></i><?= $val['order_message']; ?></p>
                    </div>
                </dd>
            </dl>
            <dl>
                <dt>运费：</dt>
                <dd>
                    <?= $val['shipping_info']; ?>
                    <span>
                        <?php if ( $val['order_status'] == Order_StateModel::ORDER_PAYED ) { ?>
                            <?php if($val['order_refund_status'] == Order_StateModel::ORDER_REFUND_IN){ ?>
                                <a href="<?= $val['retund_url']; ?>" class="ncbtn-mini ncbtn-mint fr bbc_seller_btns"><i class="icon-truck"></i>处理退款</a>
                            <?php }else{ ?>
                                <a href="<?= $val['send_url']; ?>" class="ncbtn-mini ncbtn-mint fr bbc_seller_btns"><i class="icon-truck"></i>设置发货</a>
                            <?php }?>
                        <?php }elseif ( $val['order_status'] == Order_StateModel::ORDER_WAIT_CONFIRM_GOODS ) { ?>
                            <a href="javascript:void(0)" class="ncbtn-mini ncbtn-bittersweet ml5 fr bbc_seller_btns" dialog_id="seller_order_delay_receive"
                               data-order_id="<?= $val['order_id'] ?>"
                               data-order_receiver_date="<?= $val['order_receiver_date']; ?>"
                               data-buyer_user_name="<?= $val['buyer_user_name'] ?>" >
                                <i class="icon-time"></i>延迟收货</a>
                            <a href="<?= $val['send_url']; ?>" class="ncbtn-mini ncbtn-aqua fr bbc_seller_btns mr10"><i class="icon-edit"></i>编辑发货</a>
                        <?php } ?>
                    </span>
                </dd>
            </dl>
        </td>
        <!-- E 合并TD -->
        <?php } ?>
    </tr>
    <!-- S 赠品列表 -->
    <!-- E 赠品列表 -->
    <?php } ?>
    <?php } ?>

    <!-- S 赠品列表 -->
    <!-- E 赠品列表 -->

    </tbody>
    <?php } ?>
    <?php } ?>
</table>

<div class="page">
    <?= $data['page_nav'] ?>
</div>

<?php if ( empty($val['goods_list']) ) { ?>
    <div class="no_account">
        <img src="http://127.0.0.1/yf_shop/shop/static/default/images/ico_none.png">
        <p>暂无符合条件的数据记录</p>
    </div>
<?php } ?>

<?php
include $this->view->getTplPath() . '/' . 'seller_footer.php';
?>

<script>

    $('.tabmenu').find('li:gt(6)').hide();

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


        //延迟收货
        $('a[dialog_id="seller_order_delay_receive"]').on('click', function () {

            var $this = $(this),
                order_id = $this.data('order_id'),
                buyer_name = $this.data('buyer_user_name'),
                order_receiver_date = $this.data('order_receiver_date'),
                url = SITE_URL + '?ctl=Seller_Trade_Deliver&met=delayReceive&typ=';

            $.dialog({
                title: '延迟收货',
                content: 'url: ' + url + 'e',
                data: { order_id: order_id, order_receiver_date: order_receiver_date, buyer_name: buyer_name },
                height: 250,
                width: 500,
                lock: true,
                drag: false,
                ok: function () {

                    var delay_days = $(this.content.document.getElementsByName('delay_date')).val();

                    $.post(url + 'json', { order_id: order_id, order_receiver_date: order_receiver_date, delay_days: delay_days }, function ( data ) {
                            if ( data.status == 200 ) {
                                $this.data('order_receiver_date', data.order_receiver_date);
                                Public.tips({ content: data.msg, type: 3 });
                            } else {
                                Public.tips({ content: data.msg, type: 1 });
                            }
                    })
                }
            })
        })
    });

    function formSub(){
        $('.search-form').parents('form').submit();
    }
</script>
