<?php if (!defined('ROOT_PATH')){exit('No Permission');}?>
<?php
include $this->view->getTplPath() . '/' . 'seller_header.php';
?>

<div class="content">
    <div class="form-style">
        <dl>
            <dt><?=_('代金券名称')?>：</dt>
            <dd><?=$data['voucher_t_title']?></dd>
        </dl>
        <dl>
            <dt><?=_('店铺分类')?>：</dt>
            <dd><?=$data['shop_class_name']?></dd>
        </dl>

        <dl>
            <dt><?=_('领取方式')?>：</dt>
            <dd><?=$data['voucher_t_access_method_label']?></dd>
        </dl>

        <dl>
            <dt><?=_('有效期')?>：</dt>
            <dd><?=$data['voucher_t_end_date']?></dd>
        </dl>
        <dl>
            <dt><?=_('面额')?>：</dt>
            <dd><?=format_money($data['voucher_t_price'])?></dd>
        </dl>
        <dl>
            <dt><?=_('兑换所需积分')?>：</dt>
            <dd><?=$data['voucher_t_points']?> <?=_('分')?></dd>
        </dl>
        <dl>
            <dt><?=_('可发放总数')?>：</dt>
            <dd><?=$data['voucher_t_total']?> <?=_('张')?></dd>
        </dl>
        <dl>
            <dt><?=_('每人限领')?>：</dt>
            <dd><?=$data['voucher_t_eachlimit']?> <?=_('张')?></dd>
        </dl>
        <dl>
            <dt><?=_('消费金额')?>：</dt>
            <dd><?=format_money($data['voucher_t_limit'])?></dd>
        </dl>

        <dl>
            <dt><?=_('会员级别')?>：</dt>
            <dd><?=$data['voucher_t_user_grade_limit_label']?></dd>
        </dl>
        <dl>
            <dt><?=_('代金券描述')?>：</dt>
            <dd>
                <textarea name="voucher_t_desc" readonly class="text textarea w450"><?=$data['voucher_t_desc']?></textarea>
            </dd>
        </dl>
        <dl>
            <dt><?=_('代金券图片')?>：</dt>
            <dd>
               <img id="image_review" src="<?=image_thumb($data['voucher_t_customimg'],200,200)?>" height="200" width="200" />
            </dd>
        </dl>
        <dl>
            <dt><?=_('最后修改时间')?>：</dt>
            <dd><?=$data['voucher_t_update_date']?></dd>
        </dl>
        <dl>
            <dt><?=_('状态')?>：</dt>
            <dd><?=$data['voucher_t_state_label']?></dd>
        </dl>
        <dl>
            <dt><?=_('已领取')?>：</dt>
            <dd><?=$data['voucher_t_giveout']?> <?=_('张')?></dd>
        </dl>
        <dl>
            <dt><?=_('已使用')?>：</dt>
            <dd><?=$data['voucher_t_used']?> <?=_('张')?></dd>
        </dl>
    </div>
</div>

<?php
include $this->view->getTplPath() . '/' . 'seller_footer.php';
?>

