<?php if (!defined('ROOT_PATH'))
{
	exit('No Permission');
}

/**
 * Author: yesai
 * Date: 2016/5/19
 * Time: 9:26
 */
class Api_Promotion_GroupBuyCtl extends Api_Controller
{
	public $GroupBuy_BaseModel       = null;
	public $GroupBuy_QuotaModel      = null;
	public $GroupBuy_PriceRangeModel = null;
	public $GroupBuy_CatModel        = null;
	public $GroupBuy_AreaModel       = null;

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
		$this->GroupBuy_BaseModel       = new GroupBuy_BaseModel();
		$this->GroupBuy_QuotaModel      = new GroupBuy_QuotaModel();
		$this->GroupBuy_PriceRangeModel = new GroupBuy_PriceRangeModel();
		$this->GroupBuy_CatModel        = new GroupBuy_CatModel();
		$this->GroupBuy_AreaModel       = new GroupBuy_AreaModel();
	}

	//团购商品列表
	public function getGroupBuyGoodsList()
	{
		$page     = request_int('page', 1);
		$rows     = request_int('rows', 100);
		$cond_row = array();

		$groupbuy_state	= request_int('groupbuy_state');
		$groupbuy_name 	= trim(request_string('groupbuy_name'));   //团购活动名称
		$goods_name    	= trim(request_string('goods_name'));        //团购商品名称
		$shop_name     	= trim(request_string('shop_name'));         //店铺名称

		if ($groupbuy_state)
		{
			$cond_row['groupbuy_state'] = $groupbuy_state;
		}
		if ($groupbuy_name)
		{
			$cond_row['groupbuy_name:LIKE'] = $groupbuy_name . '%';
		}
		if ($goods_name)
		{
			$cond_row['goods_name:LIKE'] = $goods_name . '%';
		}
		if ($shop_name)
		{
			$cond_row['shop_name:LIKE'] = $shop_name . '%';
		}

		$data = $this->GroupBuy_BaseModel->getGroupBuyGoodsList($cond_row, array('groupbuy_id' => 'DESC'), $page, $rows);

		$this->data->addBody(-140, $data);
	}

	public function groupbuyManage()
	{
		$groupbuy_id = request_int('groupbuy_id');
		$data        = $this->GroupBuy_BaseModel->getGroupBuyDetailByID($groupbuy_id);
		$this->data->addBody(-140, $data);
	}

	public function editGroupBuy()
	{
		$groupbuy_id                     = request_int('groupbuy_id');
		$field_row['groupbuy_id']        = $groupbuy_id;
		$field_row['groupbuy_state']     = request_int('groupbuy_state');
		$field_row['groupbuy_recommend'] = request_int('groupbuy_recommend');

		$flag = $this->GroupBuy_BaseModel->editGroupBuy($groupbuy_id, $field_row);

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

		$data                             = array();
		$data                             = $field_row;
		$data['groupbuy_state_label']     = GroupBuy_BaseModel::$groupbuy_state_map[request_int('groupbuy_state')];
		$data['groupbuy_recommend_label'] = GroupBuy_BaseModel::$recommend_map[request_int('groupbuy_recommend')];
		$data['groupbuy_id']              = $groupbuy_id;
		$this->data->addBody(-140, $data, $msg, $status);
	}

	//删除团购
	public function removeGroupBuyGoods()
	{
		$groupbuy_id = request_int('groupbuy_id');

		$flag = $this->GroupBuy_BaseModel->removeGroupBuyGoods($groupbuy_id);

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

		$data = array();
		$this->data->addBody(-140, $data, $msg, $status);
	}

	//团购分类
	public function getCat()
	{
		$cond_row = array();
		if (request_int('cat_type'))
		{
			$cond_row['groupbuy_cat_type'] = request_int('cat_type');
		}

		$groupbuy_cat_parent_id = request_int('nodeid', 0);
		$groupbuy_cat_deep      = request_int('n_level', 0);

		$data = $this->GroupBuy_CatModel->getCatTree($groupbuy_cat_parent_id, false, $groupbuy_cat_deep);
		$this->data->addBody(-140, $data);

	}

	//分类管理
	public function getGroupBuyCatName()
	{
		$data_re         = array();
		$groupbuy_cat_id = request_int('id');

		$data = $this->GroupBuy_CatModel->getOne($groupbuy_cat_id);
		if ($data)
		{
			$data_re['id']                      = $groupbuy_cat_id;
			$data_re['groupbuy_cat_name']       = $data['groupbuy_cat_name'];
			$data_re['groupbuy_cat_type']       = $data['groupbuy_cat_type'];
			$data_re['groupbuy_cat_type_label'] = GroupBuy_CatModel::$cat_type_map[$data['groupbuy_cat_type']];
		}

		if ($data_re)
		{
			$msg    = _('success');
			$status = 200;
		}
		else
		{
			$msg    = _('failure');
			$status = 250;
		}

		$this->data->addBody(-140, $data_re, $msg, $status);
	}

	//增加分类
	public function addGroupBuyCat()
	{
		$data['groupbuy_cat_name']       = $field_row['groupbuy_cat_name'] = request_string('groupbuy_cat_name');
		$data['groupbuy_cat_parent_id']  = $field_row['groupbuy_cat_parent_id'] = request_int('parent_cat');
		$data['groupbuy_cat_sort']       = $field_row['groupbuy_cat_sort'] = request_int('groupbuy_cat_sort');
		$data['groupbuy_cat_type']       = $field_row['groupbuy_cat_type'] = request_int('groupbuy_cat_type');
		$data['groupbuy_cat_type_label'] = GroupBuy_CatModel::$cat_type_map[request_int('groupbuy_cat_type')];

		$groupbuy_cat_id = $this->GroupBuy_CatModel->addGroupBuyCat($field_row, true);

		if ($groupbuy_cat_id)
		{
			$msg    = _('success');
			$status = 200;
		}
		else
		{
			$msg    = _('failure');
			$status = 250;
		}

		$data['id']       = $groupbuy_cat_id;
		$data_re['items'] = $data;
		$this->data->addBody(-140, $data_re, $msg, $status);

	}

	//编辑分类
	public function editGroupBuyCat()
	{
		$groupbuy_cat_id                = request_string('groupbuy_cat_id');
		$field_row['groupbuy_cat_name'] = request_string('groupbuy_cat_name');
		$field_row['groupbuy_cat_sort'] = request_int('groupbuy_cat_sort');
		$flag                           = $this->GroupBuy_CatModel->editGroupBuyCat($groupbuy_cat_id, $field_row);

		if ($flag !== false)
		{
			$msg    = _('success');
			$status = 200;
		}
		else
		{
			$msg    = _('failure');
			$status = 250;
		}
		$data                    = $field_row;
		$data['id']              = $groupbuy_cat_id;
		$data['groupbuy_cat_id'] = $groupbuy_cat_id;
		$data_re['items']        = $data;
		$this->data->addBody(-140, $data_re, $msg, $status);
	}

	/**
	 * 删除操作
	 *
	 * @access public
	 */
	public function removeGroupBuyCat()
	{
		$groupbuy_cat_id = request_int('groupbuy_cat_id');

		$flag = $this->GroupBuy_CatModel->removeGroupBuyCat($groupbuy_cat_id);

		if ($flag)
		{
			$msg    = _('success');
			$status = 200;
		}
		else
		{

			$m      = $this->GroupBuy_CatModel->msg->getMessages();
			$msg    = $m ? $m[0] : _('failure');
			$status = 250;
		}

		$data['id'] = array($groupbuy_cat_id);

		$this->data->addBody(-140, $data, $msg, $status);
	}

	//虚拟团购地区
	public function getArea()
	{
		$district_parent_id = request_int('nodeid', 0);
		$district_level     = request_int('n_level', 0);

		$data = $this->GroupBuy_AreaModel->getDistrictTree($district_parent_id, false, $district_level);
		$this->data->addBody(-140, $data);
	}

	public function getGroupBuyAreaName()
	{
		$data_re          = array();
		$groupbuy_area_id = request_int('id');

		$data = $this->GroupBuy_AreaModel->getGroupBuyAreaByID($groupbuy_area_id);
		if ($data)
		{
			$data_re['id']                 = $groupbuy_area_id;
			$data_re['groupbuy_area_name'] = $data['groupbuy_area_name'];
		}

		if ($data_re)
		{
			$msg    = _('success');
			$status = 200;
		}
		else
		{
			$msg    = _('failure');
			$status = 250;
		}

		$this->data->addBody(-140, $data_re, $msg, $status);
	}

	public function addGroupBuyArea()
	{
		$data['groupbuy_area_name']      = $field_row['groupbuy_area_name'] = request_string('groupbuy_area_name');
		$data['groupbuy_area_parent_id'] = $field_row['groupbuy_area_parent_id'] = request_int('parent_district');

		$groupbuy_area_id = $this->GroupBuy_AreaModel->addGroupBuyArea($field_row, true);

		if ($groupbuy_area_id)
		{
			$msg    = _('success');
			$status = 200;
		}
		else
		{
			$msg    = _('failure');
			$status = 250;
		}

		$data['id']       = $groupbuy_area_id;
		$data_re['items'] = $data;
		$this->data->addBody(-140, $data_re, $msg, $status);
	}

	public function editGroupBuyArea()
	{
		$id = request_int('groupbuy_area_id');

		$edit_data['groupbuy_area_name'] = request_string('groupbuy_area_name');

		$flag = $this->GroupBuy_AreaModel->editGroupBuyArea($id, $edit_data);

		if ($flag !== false)
		{
			$msg    = _('success');
			$status = 200;
		}
		else
		{
			$msg    = _('failure');
			$status = 250;
		}
		$data                     = $edit_data;
		$data['id']               = $id;
		$data['groupbuy_area_id'] = $id;
		$data_re['items']         = $data;
		$this->data->addBody(-140, $data_re, $msg, $status);
	}

	/**
	 * 删除操作
	 *
	 * @access public
	 */
	public function removeArea()
	{
		$groupbuy_area_id = request_int('groupbuy_area_id');

		$flag = $this->GroupBuy_AreaModel->removeGroupArea($groupbuy_area_id);

		if ($flag)
		{
			$msg    = _('success');
			$status = 200;
		}
		else
		{
			$m      = $this->GroupBuy_AreaModel->msg->getMessages();
			$msg    = $m ? $m[0] : _('failure');
			$status = 250;
		}

		$data['id'] = array($groupbuy_area_id);

		$this->data->addBody(-140, $data, $msg, $status);
	}

	//团购活动套餐类表
	public function getGroupBuyQuotaList()
	{
		$cond_row  = array();
		$page      = request_int('page', 1);
		$rows      = request_int('rows', 100);
		$shop_name = request_string('shop_name');

		if ($shop_name)
		{
			$cond_row['shop_name:LIKE'] = $shop_name . '%';
		}

		$data = $this->GroupBuy_QuotaModel->getGroupBuyQuotaList($cond_row, array('combo_id' => 'DESC'), $page, $rows);

		$this->data->addBody(-140, $data);
	}

	//团购价格区间列表
	public function getPriceRangeList()
	{
		$data = $this->GroupBuy_PriceRangeModel->getPriceRangeList();
		$this->data->addBody(-140, $data);
	}

	//添加团购价格区间
	public function addPriceRange()
	{
		$data["range_name"]  = request_string("range_name");
		$data["range_start"] = request_int("range_start");
		$data["range_end"]   = request_int("range_end");

		if ($data)
		{
			$range_id = $this->GroupBuy_PriceRangeModel->addPriceRange($data);
		}
		if ($range_id)
		{
			$msg    = _('success');
			$status = 200;
		}
		else
		{
			$msg    = _('failure');
			$status = 250;
		}
		$data['range_id'] = $range_id;
		$data['id']       = $range_id;

		$this->data->addBody(-140, $data, $msg, $status);
	}

	//修改团购价格区间
	public function editPriceRange()
	{
		$range_id       		= request_int("range_id");
		$data["range_name"] 	= request_string("range_name");
		$data["range_start"] 	= request_int("range_start");
		$data["range_end"]  	= request_int("range_end");

		$data_rs          		= $data;
		$data_rs['range_id']    = $range_id;

		$this->GroupBuy_PriceRangeModel->editPriceRange($range_id, $data);

		$this->data->addBody(-140, $data_rs);
	}

	//删除团购价格区间
	public function removePriceRange()
	{
		$range_id = request_int('range_id');

		$flag = $this->GroupBuy_PriceRangeModel->removePriceRange($range_id);

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

		$data = array();
		$this->data->addBody(-140, $data, $msg, $status);
	}

	//获取团购分类
	public function getGroupBuyCatList()
	{
		$data = $this->GroupBuy_CatModel->getGroupBuyCatList();
		$this->data->addBody(-140, $data);
	}


}