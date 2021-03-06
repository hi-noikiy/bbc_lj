<?php if (!defined('ROOT_PATH'))
{
	exit('No Permission');
}

/**
 * Api接口, 让App等调用
 *
 *平台红包接口控制器类
 */
class Api_Promotion_RedPacketCtl extends Api_Controller
{
	public $RedPacket_TempModel  = null;
	public $RedPacket_BaseModel  = null;
    public $UserGradeModel       = null;

	/**
	 * Constructor
	 *
	 * @param  string $ctl 控制器目录
	 * @param  string $met 控制器方法
	 * @param  string $typ 返回数据类型
	 * @access public
	 */
	public function __construct(&$ctl, $met, $typ)
	{
		parent::__construct($ctl, $met, $typ);

		$this->RedPacket_TempModel  = new RedPacket_TempModel();
		$this->RedPacket_BaseModel  = new RedPacket_BaseModel();
		$this->UserGradeModel        = new User_GradeModel();
	}

	/*平台红包列表*/
	public function getRedPacketTempList()
	{
		$page                      = request_int('page', 1);
		$rows                      = request_int('rows', 100);

		$redpacket_t_title           = request_string('redpacket_t_title');
		$redpacket_t_state		   = request_int('redpacket_t_state');
		$cond_row                  = array();
		$order_row                 = array();
		$order_row['redpacket_t_id'] = 'DESC';

		if ($redpacket_t_state)
		{
			$cond_row['redpacket_t_state'] = $redpacket_t_state;
		}
		if ($redpacket_t_title)
		{
			$cond_row['redpacket_t_title:LIKE'] = '%'.$redpacket_t_title . '%';
		}

		$data = $this->RedPacket_TempModel->getRedPacketTempList($cond_row, $order_row, $page, $rows);

		$this->data->addBody(-140, $data);
	}

    //添加红包模板页面，获取会员等级列表
    public function redPacketManage()
    {
        $data = $this->UserGradeModel->getGradeList();
        $this->data->addBody(-140, $data);
    }
   /* 增加平台红包模板*/
    public function addRedPacketTemp()
    {
        $field_row  = array();
        $data       = array();
        $field_row['redpacket_t_title']         = request_string('redpacket_t_title');               //平台红包名称
        $field_row['redpacket_t_start_date']    = request_string('redpacket_t_start_date');        //有效期起始时间
        $field_row['redpacket_t_end_date']      = request_string('redpacket_t_end_date');         //有效期结束时间
        $field_row['redpacket_t_price']         = request_int('redpacket_t_price');                  //红包面额
        $field_row['redpacket_t_orderlimit']    = request_int('redpacket_t_orderlimit');           //订单限额
        $field_row['redpacket_t_total']         = request_int('redpacket_t_total');                  //可发放总数
        $field_row['redpacket_t_add_date']      = get_date_time();                                    //发布时间
        $field_row['redpacket_t_update_date']   = get_date_time();                                //最后编辑时间
        $field_row['redpacket_t_eachlimit']     = request_int('redpacket_t_eachlimit');          //每人限领张数
        $field_row['redpacket_t_user_grade_limit'] = request_int('redpacket_t_user_grade_limit'); //用户领取等级限制
        $field_row['redpacket_t_img']           = request_string('redpacket_t_img');            //红包图片
        $field_row['redpacket_t_access_method'] =  RedPacket_TempModel::GETFREE;               //领取方式，暂定为免费领取
        $field_row['redpacket_t_recommend']     =  RedPacket_TempModel::UNRECOMMEND;           //是否推荐，不推荐
        $field_row['redpacket_t_desc']          = request_string('redpacket_t_desc');         //红包描述
        $flag = $this->RedPacket_TempModel->addRedPacketTemp($field_row,true);

        if ($flag)
        {
            $msg    = _('success');
            $status = 200;
            $data = $this->RedPacket_TempModel->getRedPacketTempInfoById($flag);
        }
        else
        {
            $msg    = _('failure');
            $status = 250;
        }

        $this->data->addBody(-140, $data, $msg, $status);
    }

   /* 删除红包模板*/
    public function removeRedPacketTemp()
    {
        $cond_row = array();
        $data = array();
        $redpacket_t_id = request_int('redpacket_t_id');
        //查询红包状态信息，如果已经有人兑换红包，则不允许删除
        $cond_row['redpacket_t_id'] = $redpacket_t_id;
        $cond_row['redpacket_t_giveout:>'] = 0;
        $row = $this->RedPacket_TempModel->getRedPacketTempByWhere($cond_row);
        if($row)
        {
            $flag = false;
        }
        else
        {
            $flag = $this->RedPacket_TempModel->removeRedPacketTemp($redpacket_t_id);
        }

        if ($flag)
        {
            $msg    = _('success');
            $status = 200;
        }
        else
        {
            $msg    = _('failure');
            $status = 250;
        }
        $data['redpacket_t_id'] = $redpacket_t_id;

        $this->data->addBody(-140, $data, $msg, $status);
    }

    /*获取红包详情*/
    public function redPacketInfo()
    {
        $redpacket_t_id = request_int('id');
        $data = $this->RedPacket_TempModel->getRedPacketTempById($redpacket_t_id);
        $this->data->addBody(-140, $data);
    }
	/**
	 * 修改红包推荐状态
	 *
	 * @access public
	 */
	public function enable()
	{
		$data['redpacket_t_recommend'] = request_string('is_rec'); // 其是启用

		$redpacket_t_id = request_int('redpacket_t_id');
		$data_rs      = $data;

		$flag = $this->RedPacket_TempModel->editRedPacketTemp($redpacket_t_id, $data);

		$data_rs['id'] = array($redpacket_t_id);

		$this->data->addBody(-140, $data_rs);
	}

	/* 平台红包详情*/
	public function getRedPacketTempInfo()
	{
		$redpacket_t_id             = request_int('id');
		$data = $this->RedPacket_TempModel->getRedPacketTempInfoById($redpacket_t_id);

		$this->data->addBody(-140, $data);
	}

	/*编辑平台红包信息*/
	public function editRedPacketTemp()
	{
		$redpacket_t_id                  = request_int('id');
        $data = $this->RedPacket_TempModel->getRedPacketTempInfoById($redpacket_t_id);
		$this->data->addBody(-140, $data);
	}
    public function editRedPacketTempInfo()
    {
        $field_row = array();
        $data      = array();
        $redpacket_t_id = request_int('redpacket_t_id');
        $field_row['redpacket_t_state'] = in_array(request_int('redpacket_t_state'),array_keys(RedPacket_TempModel::$redpacket_state_map))?request_int('redpacket_t_state'):RedPacket_TempModel::VALID; //红包状态
        $field_row['redpacket_t_recommend'] = in_array(request_int('redpacket_t_recommend'),array_keys(RedPacket_TempModel::$redpacket_recommend_map))?request_int('redpacket_t_recommend'):RedPacket_TempModel::UNRECOMMEND; //是否推荐
        $field_row['redpacket_t_desc'] = request_string('redpacket_t_desc'); //红包描述

        $flag = $this->RedPacket_TempModel->editRedPacketTemplate($redpacket_t_id,$field_row);
        if ($flag)
        {
            $msg    = _('success');
            $status = 200;
            $data   = $this->RedPacket_TempModel->getRedPacketTempInfoById($redpacket_t_id);
        }
        else
        {
            $msg    = _('failure');
            $status = 250;
        }
        $this->data->addBody(-140, $data, $msg, $status);
    }

    /*根据红包模板ID获取红包列表*/
    public function getRedPacketListByTempID()
    {
        $cond_row = array();
        $redpacket_t_id = request_int('redpacket_t_id');
        $cond_row['redpacket_t_id'] = $redpacket_t_id;
        $data = $this->RedPacket_BaseModel->getRedPacketList($cond_row);
        $this->data->addbody(-140, $data);
    }



}

?>