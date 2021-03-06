<?php if (!defined('ROOT_PATH'))
{
	exit('No Permission');
}

/**
 * Api接口, 让App等调用
 *
 *
 * @category   Game
 * @package    User
 * @author     Xinze <xinze@live.cn>
 * @copyright  Copyright (c) 2015, 黄新泽
 * @version    1.0
 * @todo
 */
class Api_Goods_BrandCtl extends Api_Controller
{
	/*
	 * @mars
	 * 品牌列表
	 */
	public function listBrand($return = false)
	{
		if (request_int('page'))
		{
			$page = request_int('page');
		}
		else
		{
			$page = 0;
		}
		if (request_int('rows'))
		{
			$rows = request_int('rows');
		}
		else
		{
			$rows = 99999;
		}
		$skey                 = request_string('skey');
		$Goods_BrandModel     = new Goods_BrandModel();
		$Goods_TypeBrandModel = new Goods_TypeBrandModel();
		$cond_row             = array();
		if (request_int('uncheck'))
		{
			$cond_row['brand_enable'] = 0;
		}
		else
		{
			$cond_row['brand_enable'] = 1;
		}
		if ($skey)
		{
			$cond_row['brand_name:like'] = '%' . $skey . '%';
		}

		$data_brand = $Goods_BrandModel->getBrandList($cond_row, array(), $page, $rows);
		$rows       = $data_brand['items'];
		unset($data_brand['items']);

		if (!empty($rows))
		{
			foreach ($rows as $key => $value)
			{
				$brand_id                      = $value['brand_id'];
				$rows[$key]['id']              = $brand_id;
				$data_type                     = $Goods_TypeBrandModel->getByWhere(array('brand_id' => $brand_id));
				$rows[$key]['brand_recommend'] = Goods_BrandModel::$recommend_content[$rows[$key]['brand_recommend']];
				$rows[$key]['brand_show_type'] = Goods_BrandModel::$show_content[$value['brand_show_type']];
			}
			$msg    = _('success');
			$status = 200;
		}
		else
		{
			$msg    = _('没有数据');
			$status = 250;
		}
		if ($return)
		{
			return $rows;
		}
		else
		{
			$data_brand['rows'] = $rows;
			$this->data->addBody(-140, $data_brand, $msg, $status);
		}
	}

	/*
	 * 删除品牌
	 */
	public function remove()
	{
		$Goods_BrandModel     = new Goods_BrandModel();
		$Goods_TypeBrandModel = new Goods_TypeBrandModel();

		$brand_id = request_int('brand_id');
		if ($brand_id)
		{
			$flag = $Goods_BrandModel->removeBrand($brand_id);

			if ($flag)
			{
				$data_type = $Goods_TypeBrandModel->getByWhere(array('brand_id' => $brand_id));
				if ($data_type)
				{
					foreach ($data_type as $key => $value)
					{
						$type_brand_id = $value['type_brand_id'];
						$flags         = $Goods_TypeBrandModel->removeTypeBrand($type_brand_id);
					}
				}
			}
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
		$data['id'] = $brand_id;
		$this->data->addBody(-140, $data, $msg, $status);
	}

	/*
	 * 新增品牌
	 */
	public function add()
	{
		$Goods_BrandModel           = new Goods_BrandModel();
		$goodsTypeBrandModel        = new Goods_TypeBrandModel();
		$data                       = array();
		$data['brand_name']         = request_string('brand_name');
		$data['brand_pic']          = request_string('brand_pic');
		$data['brand_show_type']    = request_int('brand_show_type');
		$data['brand_recommend']    = request_int('brand_recommend');
		$data['brand_enable']       = request_int('brand_enable');
		$data['cat_id']             = request_int('cat_id');
		$data['brand_displayorder'] = request_int('brand_displayorder');
		$data['brand_pic']          = request_string('brand_pic');
		$flag                       = $Goods_BrandModel->addBrand($data, true);
		if ($flag)
		{
			$msg    = 'success';
			$status = 200;
		}
		else
		{
			$msg    = 'failure';
			$status = 250;
		}

		$data['id']       = $flag;
		$data['brand_id'] = $flag;
		$this->data->addBody(-140, $data, $msg, $status);
	}

	public function getBrand()
	{
		$Goods_BrandModel = new Goods_BrandModel();
		$brand_id         = request_int('brand_id');
		$data_brand       = $Goods_BrandModel->getByWhere(array('brand_id' => $brand_id));
		$data             = $data_brand[$brand_id];
		if ($data)
		{
			$msg    = 'success';
			$status = 200;
		}
		else
		{
			$msg    = 'failure';
			$status = 250;
		}
		$this->data->addBody(-140, $data, $msg, $status);
	}

	public function edit()
	{
		$Goods_BrandModel = new Goods_BrandModel();
		$id               = request_int('id');

		$data                    = array();
		$data['brand_name']      = request_string('brand_name');
		$data['brand_pic']       = request_string('brand_pic');
		$data['brand_show_type'] = request_int('brand_show_type');
		$data['brand_recommend'] = request_int('brand_recommend');
		$data['brand_enable']    = request_int('brand_enable');
		if (request_int('cat_id') != -1)
		{
			$data['cat_id'] = request_int('cat_id');
		}
		$data['brand_displayorder'] = request_int('brand_displayorder');
		$data['brand_pic']          = request_string('brand_pic');

		$flag = $Goods_BrandModel->editBrand($id, $data, false);

		if ($flag === false)
		{
			$msg    = _('failure');
			$status = 250;
		}
		else
		{
			$msg    = _('success');
			$status = 200;
		}
		$data['id']              = $id;
		$data['brand_id']        = $id;
		$data['brand_recommend'] = Goods_BrandModel::$recommend_content[request_int('brand_recommend')];
		$data['brand_show_type'] = Goods_BrandModel::$show_content[request_int('brand_show_type')];
		$this->data->addBody(-140, $data, $msg, $status);
	}

	/*
	 * 取得所有品牌
	 */
	public function getBrands()
	{
		$Goods_BrandModel = new Goods_BrandModel();
		$data             = $Goods_BrandModel->getBrand('*');
		if ($data)
		{
			$msg    = _('success');
			$status = 200;
		}
		else
		{
			$msg    = _('failure');
			$status = 250;
		}
		$data = array_values($data);
		$this->data->addBody(-140, $data, $msg, $status);
	}

	//商品品牌导出
	public function getBrandListExcel()
	{
		$con = $this->listBrand(true);
		$tit = array(
			'品牌id',
			'品牌名称',
			'首字母',
			'品牌排序',
			'品牌推荐',
			'展现形式'
		);
		$key = array(
			'brand_id',
			'brand_name',
			'brand_initial',
			'brand_displayorder',
			'brand_recommend',
			'brand_show_type'
		);
		$this->excel("品牌列表", $tit, $con, $key);
	}

	function excel($title, $tit, $con, $key)
	{
		$objPHPExcel = new PHPExcel();
		$objPHPExcel->getProperties()->setCreator("mall_new");
		$objPHPExcel->getProperties()->setLastModifiedBy("mall_new");
		$objPHPExcel->getProperties()->setTitle($title);
		$objPHPExcel->getProperties()->setSubject($title);
		$objPHPExcel->getProperties()->setDescription($title);
		$objPHPExcel->setActiveSheetIndex(0);
		$objPHPExcel->getActiveSheet()->setTitle($title);

		$letter = array(
			'A',
			'B',
			'C',
			'D',
			'E',
			'F'
		);
		foreach ($tit as $k1 => $v1)
		{
			$objPHPExcel->getActiveSheet()->setCellValue($letter[$k1] . "1", $v1);
		}
		foreach ($con as $k => $v)
		{
			foreach ($key as $k2 => $v2)
			{
				$objPHPExcel->getActiveSheet()->setCellValue($letter[$k2] . ($k + 2), $v[$v2]);
			}
		}
		header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		header("Content-Disposition: attachment; filename=\"$title.xls\"");
		header('Cache-Control: max-age=0');
		$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
		$objWriter->save('php://output');
		die();
	}
}

?>