<?php if (!defined('ROOT_PATH'))
{
	exit('No Permission');
}

/**
 * @author     Xinze <xinze@live.cn>
 */
class PaymentChannlModel
{
	const PAY_ONLINE = 1;		//在线支付
	const PAY_CONFIRM	= 2;	//货到付款

	public function __construct()
	{
		$this->payWay = array(
			'1' => _('在线支付'),
			'2' => _('货到付款'),
		);


	}


}

?>