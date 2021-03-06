    var curRow, curCol, loading, SYSTEM = system = parent.SYSTEM,
    billRequiredCheck   = system.billRequiredCheck,
    taxRequiredCheck    = system.taxRequiredCheck,
    taxRequiredInput    = system.taxRequiredInput,
    hiddenAmount        = false;
var urlParam        = Public.urlParam();
var disEditable     = urlParam['disEditable'];
var qtyPlaces       = Number(parent.SYSTEM.qtyPlaces),
    pricePlaces     = Number(parent.SYSTEM.pricePlaces),
    amountPlaces    = Number(parent.SYSTEM.amountPlaces);
var defaultPage     = Public.getDefaultPage();

var THISPAGE = { //页面初始化
    init: function(data){
        this.mod_PageConfig = Public.mod_PageConfig.init('salesOrder'); //页面配置初始化
        if (SYSTEM.isAdmin === false && !SYSTEM.rights.AMOUNT_OUTAMOUNT) {
            hiddenAmount = true;
            $('#amountArea').hide();
        };
        this.initDom(data);
        this.loadGrid(data);
        this.initCombo();

        if(data.id != -1 && data.checked) {
            this.disableEdit();
        } else {
            this.editable = true;
            $("#grid").jqGrid('setGridParam',{cellEdit: true});
        };

		$("#customer").find("input").eq(0).focus();//选中客户

        //初始化设置，启用扫码枪
        $.cookie('BarCodeInsert',1);
        //查看cookie，是否启用了扫描枪
        if($.cookie('BarCodeInsert')){
            THISPAGE.$_barCodeInsert.addClass('active');
        };
        this.goodsEdittypeInit();   //初始化商品编辑
		this.addEvent();            //加载事件
    },


    //初始化订单信息，初始化DOM
    initDom: function(data){
        var _self = this;
        this.$_customer = $('#customer');
        this.$_date = $('#date').val(system.endDate);
        this.$_deliveryDate = $('#deliveryDate').val(system.endDate);
        this.$_number = $('#number');
        this.$_classes = $('#classes');
        this.$_note = $('#note');
        this.$_discountRate = $('#discountRate');
        this.$_deduction = $('#deduction');
        this.$_discount = $('#discount');
        this.$_payment = $('#payment');
		this.$_paymentMethod = $('#paymentMethod');
		this.$_password = $("#password");//支付密码
		this.$_cash = $('#cash');//账户余额
        this.$_totalArrears = $('#totalArrears');
        this.$_toolTop = $('#toolTop');
        this.$_toolBottom = $('#toolBottom');
        this.$_paymentTxt = $('#paymentTxt');
        this.$_accountInfo = $('#accountInfo');
        this.$_modifyTime = $('#modifyTime');
		this.$_cash = $('#cash');
        this.customerArrears = 0; //客户欠款
        this.$_note.placeholder();
        if(data.status === 'add' && !data.salesId) {
            var defaultSales = 0;
        } else {
            var defaultSales = ['id', data.salesId];
        };

        this.salesCombo = Business.billSalesCombo($('#sales'), {
            defaultSelected: defaultSales
        });

        //是否选择有效的客户，显示客户账户余额，客户输入框失去焦点时触发
        this.customerCombo = Business.billCustomerCombo($('#customer'), {
            defaultSelected: -1,
            callback: {
                onBlur: function(data)
				{	
					var skey = _self.$_customer.find('input').val();
                    Public.ajaxPost(SITE_URL + '?ctl=Order&met=getCustomer&typ=json',{skey:skey},function(data){
                                               $("#cash").val();
						if(data.status!=200){
							if(data.status==300){
								//未选择客户
								parent.Public.tips({type: 2, content: '请选择客户！'});
								return false;
							}else{
								//当前用户不存在
								parent.Public.tips({type: 2, content: '当前客户不存在！'});
								return false;
							}
						}
						data = data.data;
						var contactInfo = { id: data.user_id, name: data.user_account ,cLevel: data.cLevel};
						_self.$_customer.data('contactInfo', contactInfo);
						if(skey=='')
							_self.customerCombo.input.val(data.contactName);

                            _self.setSaleByContact(contactInfo);  //设置客户的账户余额信息
					});
                }
            }
        });


        if(data.status === 'add' && !data.user_id)
        {
			//新增订单操作
        }
        else
        {
            //编辑订单信息
            var contactInfo = { id: data.buyer_user_id, name: data.buyer_user_name, cLevel : data.cLevel};
            this.$_customer.data('contactInfo', contactInfo);
            this.customerCombo.input.val(data.contactName); //买家ID
        };

        //批量选择客户F7弹窗的回调
        $('#customer').data('callback',function(contactInfo){
            _self.setSaleByContact(contactInfo);
        });

        this.$_date.datepicker({onSelect:function(date){
            if(originalData.id != 0) return;//修改不能改变单据编号
            var newDate = date.format("yyyy-MM-dd");
            _self.$_number.text('');
            //生成单据编号
            Public.ajaxPost(SITE_URL+'?ctl=Order&met=generateNo', {billType:'SO', billDate:newDate}, function(data){
                if(data.status === 200) {
                    _self.$_number.text(data.data.billNo);
                } else {
                    parent.Public.tips({type: 1, content : data.msg});
                }
            })
        }});


        this.$_deliveryDate.datepicker();
        this.classBox = this.$_classes.cssRadio({ callback: function($_obj){
            if($_obj.find('input').val() == "150601") {
                _self.$_paymentTxt.text('本次收款:');
            } else {
                _self.$_paymentTxt.text('本次退款:');
            }
        }});

        data.transType == 150601 ? this.classBox.setValue(0) : this.classBox.setValue(1);
        data.description && this.$_note.val(data.description); //备注信息
        this.$_discountRate.val(data.disRate);                  //优惠率
        this.$_deduction.val(data.disAmount);                   //优惠金额
        this.$_discount.val(data.amount);                       //折扣后的金额
        this.$_payment.val(data.rpAmount);                      //

        var btn_add = '<a id="save" class="ui-btn ui-btn-sp">结&nbsp;算</a>';
		var btn_edit = '<a id="add" class="ui-btn ui-btn-sp">下单</a><a class="ui-btn print ui-btn-sp" id="print">打印</a>';
        var btn_view = '<a id="add" class="ui-btn ui-btn-sp">下单</a><a class="ui-btn" id="print">打印</a>';
        var btn_audit = '', btn_reaudit = '';
        var trunStr = originalData.transType == '150602' ? '生成退货单' : '生成销货单';
	    var btn_turn ='';
        if(billRequiredCheck) {
            btn_audit = '<a class="ui-btn" id="audit">审核</a>';
            btn_reaudit = '<a class="ui-btn" id="reAudit">反审核</a>';
        }else{
            btn_edit = btn_turn + btn_edit;
        };

        var btn_p_n = '<a class="ui-btn-prev" id="prev" title="上一张"><b></b></a><a class="ui-btn-next" id="next" title="下一张"><b></b></a>';
        this.btn_edit = btn_edit;
        this.btn_audit = btn_audit;
        this.btn_view = btn_view;
        this.btn_reaudit = btn_reaudit;
        this.btn_turn = btn_turn;
        if(data.id != -1)    //编辑订单信息
        {
            this.$_number.text(data.billNo);
            this.$_date.val(data.date);
            this.$_deliveryDate.val(data.deliveryDate);
            this.$_accountInfo.data('accountInfo', data.accounts);
            if(data.accId === -1)
            {
                this.$_accountInfo.show();
                _self.$_payment.attr('disabled', 'disabled').addClass('ui-input-dis');
            };
            $("#grid").jqGrid('footerData', 'set', { qty:data.totalQty, amount: data.totalAmount });
            if(urlParam.flag !== 'list') {
                btn_p_n = '';
            };
            if(data.status === 'edit')
            {
                this.$_toolBottom.html('<span id=groupBtn>' + btn_edit + btn_audit + '</span>' + btn_p_n);
            }
            else
            {
                if(data.checked)
                {
                    $("#mark").addClass("has-audit");
                    this.$_toolBottom.html('<span id="groupBtn">'+ btn_turn  + btn_view + btn_reaudit + '</span>' + btn_p_n);
                }
                else
                {
                    this.$_toolBottom.html('<span id="groupBtn">' + btn_view + '</span>' + btn_p_n);
                };
            };

            this.idList = parent.cacheList.salesOrderId || [];	        //单据ID数组
            this.idPostion = $.inArray(String(data.id), this.idList);	//当前单据ID位置
            this.idLength = this.idList.length;
            if(this.idPostion === 0)
            {
                $("#prev").addClass("ui-btn-prev-dis");
            }
            if(this.idPostion === this.idLength - 1)
            {
                $("#next").addClass("ui-btn-next-dis");
            };

            this.$_modifyTime.html(data.modifyTime);
			this.$_customer.find("input").val(data.contactName);
			this.$_paymentMethod.find("option[value='"+data.payment_method+"']").attr('selected','selected');//选中支付方式
        }
        else
        {
            if(billRequiredCheck) {
                this.$_toolBottom.html('<span id=groupBtn>' + btn_add + btn_audit + '</span>');
            } else {
                this.$_toolBottom.html('<span id="groupBtn">' + btn_add + '</span>');
            };
            this.$_modifyTime.parent().hide();
        };
        if(disEditable){
            THISPAGE.disableEdit();
            this.$_toolBottom.hide();
        }
    },


    //下单页面表格初始化
    loadGrid: function(data){
        var _self = this;
        if(data.id != -1) {  //如果是查看订单信息，循环讲订单中的商品填充到表格
            var gap = 8 - data.entries.length;
            if(gap > 0)
            {
                for(var i = 0; i < gap; i++)
                {
                    data.entries.push({});
                };
            }
        };
        _self.newId = 9;
        var colModel = [
            {name:'operating', label:' ', width:60, fixed:true, formatter:Public.billsOper_goods, align:"center"},
            {name:'goods', label:'商品', nameExt:'<span id="barCodeInsert" class="active">扫描枪录入</span>', width:200, classes: 'goods', formatter:goodsFmt, editable:true, enterCallback:function(){
                if(THISPAGE.$_barCodeInsert.hasClass('active'))
                {
                    var nextRow = (function(curID){
                        var $_curRow = $('#' + curID);
                        var $_nextTr = $_curRow.next();
                        var _nextRow = $_curRow.index() + 1;
                        if($_nextTr.length == 0)
                        {
                            $("#grid").jqGrid('addRowData', THISPAGE.newId, {}, 'last');
                            THISPAGE.newId++;
                            return $('#'+(THISPAGE.newId-1)).index();
                        }
                        if($_nextTr.data('goodsInfo'))
                        {
                            return arguments.callee(_nextRow);
                        }
                        else
                        {
                            return _nextRow;
                        }
                    })(THISPAGE.curID);
                    $("#grid").jqGrid("nextCell", nextRow, 1);
                }
                else if($('#grid')[0].p.savedRow.length != 0)
                {
                    $("#grid").jqGrid("nextCell", $('#grid')[0].p.savedRow[0].id, $('#grid')[0].p.savedRow[0].ic);
                }
            }},
            {name:'skuId', label:'属性ID' ,hidden:true},
			{name:'goods_id', label:'商品ID' ,hidden:true},
			{name:'goods_stock', label:'商品库存' ,hidden:true},
			{name:'pic', label:'商品图片' ,hidden:true},
			{name:'cat_id', label:'商品分类ID' ,hidden:true},
			{name:'specName', label:'商品属性名称' ,hidden:true},
			{name:'goods_name', label:'商品名称' ,hidden:true},
            {name:'skuName', label:'规格型号' , width:100 , classes: 'ui-ellipsis' ,hidden:!SYSTEM.enableAssistingProp},
            {name:'shop_name', label:'店铺', width:100, editable:true},
            {name:'qty', label:'数量', width:80, align:"right", formatter:'number', formatoptions:{decimalPlaces: qtyPlaces}, editable:true},
            {name:'price', label:'销售单价', hidden: hiddenAmount, width:100, fixed:true, align:"right", formatter:'currency', formatoptions:{showZero: true, decimalPlaces: pricePlaces}, editable:true},
            {name:'discountRate', label:'折扣率(%)', hidden: hiddenAmount, width:70, fixed:true, align:"right", formatter:'integer', editable:true},
            {name:'deduction', label:'折扣额', hidden: hiddenAmount, width:70, fixed:true, align:"right", formatter:'currency', formatoptions:{showZero: true, decimalPlaces: amountPlaces}, editable:true},
            {name:'amount', label:'销售金额', hidden: hiddenAmount, width:100, fixed:true, align:"right", formatter:'currency', formatoptions:{showZero: true, decimalPlaces: amountPlaces}, editable:true}
        ];
        this.calAmount = 'amount';
        if(taxRequiredCheck)
        {
            colModel.pop();
            colModel.push(
                {name:'amount', label:'金额', hidden: hiddenAmount, width:100, fixed:true, align:"right", formatter:'currency', formatoptions:{showZero: true, decimalPlaces: amountPlaces}, editable:true}
            );
            this.calAmount = 'taxAmount';
        };
        colModel.push(
            {name:'description', label:'备注', width:150, title:true, editable:true}
        );

        //订单的几种状态，新商城有所改变
        //
		function d(a, b, c) {
			var d;
			if(a==5)
            {
				d="已退货";
				e="ui-label-default";
			}
            else if(a==3)
            {
				d="可退货"
				e="ui-label-success set-status";
			}
            else
            {
				d="";
				e="";
			}
			return '<span class="ui-label ' + e + '" data-delete="' + a + '" data-id="' + c.id + '">' + d + "</span>"
		}
		
		//已经完成订单 ,显示是否可以退换
		if(data.checked)
        {
			colModel.push({
				name:'delete', 
				label:'退货',
				width:150, 
				title:true, 
				editable:true,
				align: "center",
				formatter:d
			});
		}
		
		//退货事件
        //执行线下退款，不会往流水表写记录
		$("#grid").on("click", ".set-status",
		function(a) {
			if (a.stopPropagation(), a.preventDefault(), Business.verifyRight("INVLOCTION_UPDATE")) {
				var b = $(this).data("id"),
				c = !$(this).data("delete");
				g.setStatus(b, c)
			}
		});
		
		var g = {
			setStatus: function(a, b) {
				a && Public.ajaxPost(SITE_URL+'?ctl=Order&met=orderReturn', {
					id: a,
					disable:1,
					paymentMethod:$('#paymentMethod').val()
				},
				function(c) {
					c && 200 == c.status ? (
						parent.Public.tips({
							content: "退货成功！"
						}), $("#grid").jqGrid("setCell", a, "delete", 5)) : parent.Public.tips({
							type: 1,
							content: "退货失败！" + c.msg
						})
				})
			},
			callback: function(a, b, c) {
				var d = $("#grid").data("gridData");
				d || (d = {},
				$("#grid").data("gridData", d)),
				a.difMoney = a.amount - a.periodMoney,
				d[a.id] = a,
				"edit" == b ? ($("#grid").jqGrid("setRowData", a.id, a), c && c.api.close()) : ($("#grid").jqGrid("addRowData", a.id, a, "first"), c && c.resetForm(a))
			}
		}


        var gridId = 'grid';
        _self.mod_PageConfig.gridReg(gridId, colModel);
        colModel = _self.mod_PageConfig.conf.grids[gridId].colModel;
        //导入用户配置end
        $("#grid").jqGrid({
            data: data.entries,
            datatype: "clientSide",
            autowidth:true,
            height: '100%',
            rownumbers: true,
            gridview: true,
            onselectrow: false,
            colModel: colModel,
            cmTemplate: {sortable: false, title: false},
            shrinkToFit: true,
            forceFit: false,
            rowNum: 1000,
            cellEdit: false,
            cellsubmit: 'clientArray',
            localReader: {
                root: "rows",
                records: "records",
                repeatitems : false,
                id: "id"
            },
            jsonReader: {
                root: "data.entries",
                records: "records",
                repeatitems : false,
                id: "id"
            },
            loadComplete: function(data) {
                THISPAGE.$_barCodeInsert = $('#barCodeInsert');
                if(urlParam.id > 0){
                    var rows = data['rows'];
                    var len = rows.length;
                    var ids = ''
                    _self.newId = len + 1;
                    var tmpObjs = {};
                    for(var i = 0; i < len; i++) {
                        var tempId = i + 1, row = rows[i];
                        if($.isEmptyObject(rows[i])){
                            break;
                        };
                        ids += ids? ','+ tempId : tempId;
                        tmpObjs[row.invId] = tempId;
                        var goodsInfo = $.extend(true,{
                            id: row.invId,
                            number:	row.invNumber,
                            name: row.invName,
                            spec: row.invSpec,
                            unitId: row.unitId,
                            unitName: row.mainUnit
                        },row);
                        //获取商品信息
                        Business.cacheManage.getGoodsInfoByNumber(goodsInfo.number,function(good){
                            goodsInfo.isSerNum = good.isSerNum;
                            goodsInfo.isWarranty = row.isWarranty = good.isWarranty;
                            goodsInfo.safeDays = row.safeDays = good.safeDays;
                            goodsInfo.invSkus = good.invSkus;
                            goodsInfo.id = row.invId;
                            $('#' + tempId).data('goodsInfo', goodsInfo)
                                .data('storageInfo', {
                                    id: row.shop_id,
                                    name: row.shop_name
                                }).data('unitInfo',{
                                    unitId: row.unitId,
                                    name: row.mainUnit
                                }).data('skuInfo',{
                                    name:row.skuName,
                                    id: row.skuId
                                });;
                        });
                    };
                }
            },
            gridComplete: function(){
                setTimeout(function(){
                    Public.autoGrid($('#grid'));
                },10);
            },
            afterEditCell: function (rowid,name,val,iRow,iCol){
                THISPAGE.curID = rowid;
                if(name==='goods') {
                    //更新goodsInfo
                    var goodsInfo = $('#' + rowid).data('goodsInfo');
                    if(goodsInfo){
                        var rowData = $("#grid").jqGrid('getRowData',rowid);
                        goodsInfo = $.extend(true,{},goodsInfo);
                        goodsInfo.skuName = rowData.goods_name;
                        goodsInfo.goods_id = rowData.goods_id;
                        goodsInfo.goods_stock = rowData.goods_count;
                        goodsInfo.pic = rowData.goods_image;
                        goodsInfo.cat_id = rowData.cat_id;
                        goodsInfo.specName = rowData.specName;
                        goodsInfo.goods_name = rowData.goods_name;
                        goodsInfo.mainUnit = rowData.mainUnit;
                        goodsInfo.unitId = rowData.unitId;
                        goodsInfo.qty = rowData.qty;
                        goodsInfo.price = rowData.price;
                        goodsInfo.discountRate = rowData.discountRate;
                        goodsInfo.deduction = rowData.deduction;
                        goodsInfo.amount = rowData.amount;
                        goodsInfo.shop_name = rowData.shop_name;
                        $('#' + rowid).data('goodsInfo',goodsInfo);
                    }
                    $("#"+iRow+"_goods","#grid").val(val);
                    THISPAGE.goodsCombo.selectByText(val);
                };
                if(name==='skuName') {
                    //更新goodsInfo
                    var goodsInfo = $('#' + rowid).data('goodsInfo');
                    if(typeof goodsInfo.invSkus === 'string'){
                        goodsInfo.invSkus = $.parseJSON(goodsInfo.invSkus);
                    }
                    if(!goodsInfo || !goodsInfo.invSkus || !goodsInfo.invSkus.length){
                        $("#grid").jqGrid('restoreCell',iRow,iCol);
                        curCol = iCol+1;
                        $("#grid").jqGrid('nextCell',iRow,iCol+1);
                        return;
                    }
                    $("#"+iRow+"_skuName","#grid").val(val);
                    THISPAGE.skuCombo.loadData(goodsInfo.invSkus||[] , 1 ,false);
                    THISPAGE.skuCombo.selectByText(val);//存在问题：若本地缓存没有这个数据，combo.selectbytext()方法会清空单元格内容。考虑THISPAGE.goodsCombo.input.val(val)，但修改不出发combo的onchange事件，匹配不到的时候，清空goodinfo的操作失效
                };
                if(name==='price') {
                    $("#"+iRow+"_price","#grid").val(val);
                };
                if(name==='shop_name') {
                    $("#"+iRow+"_shop_name","#grid").val(val);
                    THISPAGE.storageCombo.selectByText(val);
                };
                if(name==='mainUnit') {
                    $("#"+iRow+"_mainUnit","#grid").val(val);
                    var unit = $('#'+rowid).data('unitInfo') || {};
                    if((!unit.unitId)|| unit.unitId ==='0'){
                        $("#grid").jqGrid('restoreCell',iRow,iCol);
                        curCol = iCol+1;
                        $("#grid").jqGrid('nextCell',iRow,iCol+1);
                        return;
                    }else{
                        THISPAGE.unitCombo.enable();
                    }
                    THISPAGE.unitCombo.loadData(function(){
                        var tmp = {};
                        var baseUnit = [];
                        for(var i = 0; i < SYSTEM.unitInfo.length; i++){
                            var _u = SYSTEM.unitInfo[i];
                            var unitId = unit.unitId;
                            if(unit.unitId == _u.id){
                                unit = _u;
                            }
                            unit.unitId = unitId;
                            var index = _u.unitTypeId || i;
                            if(!tmp[index])
                                tmp[index]= [];
                            tmp[index].push(_u);
                        }
                        return unit.unitTypeId ? tmp[unit.unitTypeId] : [unit];
                    });
                    THISPAGE.unitCombo.selectByText(val);
                };
            },
            formatCell: function(rowid,name,val,iRow,iCol) {

            },
            beforeSubmitCell: function(rowid,name,val,iRow,iCol) {

            },
            beforeSaveCell: function(rowid,name,val,iRow,iCol) {
                switch(name){
                    case 'goods':
                        var goodsInfo = $('#' + rowid).data('goodsInfo');
                        if(!goodsInfo) {
                            _self.skey = val;
                            var goodName;
                            var _callback = function(good){
                                $('#' + rowid).data('goodsInfo',good)
                                    .data('storageInfo', {
                                        id: good.shop_id,
                                        name: good.shop_name
                                    }).data('unitInfo',{
                                        unitId: good.unitId,
                                        name: good.unitName
                                    });
                                goodName = Business.formatGoodsName(good);
                            }
                            //如果是扫描枪录入
                            if(THISPAGE.$_barCodeInsert.hasClass('active')){
                                //条码模式
                                //Business.cacheManage.getGoodsInfoByBarCode(val,_callback,true);
                            }else{
                                //非条码模式
                                Business.cacheManage.getGoodsInfoByNumber(val,_callback,true);
                            }
                            if(goodName){
                                return goodName;
                            }
                            //选择商品弹出框
                            $.dialog({
                                width: 775,
                                height: 510,
                                title: '选择商品',
                                content: 'url:'+SITE_URL+'?ctl=Goods&met=goodsList',
                                data: {
                                    skuMult: SYSTEM.enableAssistingProp,
                                    skey:_self.skey,
                                    callback: function(newId, curID, curRow){
                                        if(curID === '') {
                                            $("#grid").jqGrid('addRowData', newId, {}, 'last');
                                            _self.newId = newId + 1;
                                        };
                                        setTimeout( function() { $("#grid").jqGrid("editCell", curRow, 2, true) }, 10);
                                        _self.calTotal();
                                    }
                                },
                                init:function(){
                                    _self.skey = '';
                                },
                                lock: true,
                                button:[{name: '选中',defClass:'ui_state_highlight fl', focus :true, callback: function () {
                                    this.content.callback && this.content.callback('purchase');
                                    return false;
                                }},
                                {name: '选中并关闭',defClass:'ui_state_highlight', callback: function () {
                                    this.content.callback('purchase');
                                    this.close();
                                    return false;
                                }},
                                {name: '关闭', callback: function () {
                                    return true;
                                }}]
                            });
                            setTimeout( function() {
                                $("#grid").jqGrid("editCell", curRow, 2, true);
                                $("#grid").jqGrid("setCell", curRow, 2, '');
                            }, 10);
                            return '&#160;';
                        }
                    default:break;
                }
                return val;
            },

            afterSaveCell : function(rowid,name,val,iRow,iCol) {
                switch (name) {
                    case 'goods':
                        break;
                    case 'qty':
                        var val = parseFloat(val);
                        var price = parseFloat($("#grid").jqGrid('getCell', rowid, iCol+1));
                        var discountRate = parseFloat($("#grid").jqGrid('getCell', rowid, iCol+2));
                        if($.isNumeric(price))
                        {
                            if($.isNumeric(discountRate))
                            {
                                var deduction = val * price * discountRate / 100;
                                var amount = val * price - deduction;
                                var su = $("#grid").jqGrid('setRowData', rowid, {deduction: deduction, amount: amount});
                            }
                            else
                            {
                                var su = $("#grid").jqGrid('setRowData', rowid, {amount: val * price});
                            };
                        };
                        taxRequired(rowid);
                        if(su)
                        {
                            THISPAGE.calTotal();
                        };
                        break;
                    case 'price':
                        var val             = parseFloat(val);
                        var quantity        = parseFloat($("#grid").jqGrid('getCell', rowid, iCol-1));
                        var discountRate    = parseFloat($("#grid").jqGrid('getCell', rowid, iCol+1));
                        if($.isNumeric(quantity))
                        {
                            if($.isNumeric(discountRate))
                            {
                                var deduction = val * quantity * discountRate / 100;
                                var amount = val * quantity - deduction;
                                var su = $("#grid").jqGrid('setRowData', rowid, {deduction: deduction, amount: amount});
                            }
                            else
                            {
                                var su = $("#grid").jqGrid('setRowData', rowid, {amount: val * quantity});
                            };
                        };
                        taxRequired(rowid);
                        if(su) {
                            THISPAGE.calTotal();
                        };
                        break;
                    case 'discountRate':    //折扣率
                        var val = parseFloat(val);
                        var quantity = parseFloat($("#grid").jqGrid('getCell', rowid, iCol-2));  //商品数量
                        var price = parseFloat($("#grid").jqGrid('getCell', rowid, iCol-1));     //商品价格
                        if($.isNumeric(quantity) && $.isNumeric(price))
                        {
                            var original = quantity * price;        //商品原总价
                            var amount = original * val / 100;
                            var deduction = original - amount;
                            var su = $("#grid").jqGrid('setRowData', rowid, { deduction: deduction, amount: amount });
                        };
                        taxRequired(rowid);
                        if(su) {
                            THISPAGE.calTotal();
                        };
                        break;
                    case 'deduction':
                        var val = parseFloat(val);    //折扣金额
                        var quantity = parseFloat($("#grid").jqGrid('getCell', rowid, iCol-3)); //数量
                        var price = parseFloat($("#grid").jqGrid('getCell', rowid, iCol-2));    //单价
                        if($.isNumeric(quantity) && $.isNumeric(price)) {
                            var original = quantity * price;
                            var amount = original - val;        //折扣后金额
                            var discountRate = original ? (100*amount/original).toFixed(amountPlaces) : 0;
                            var su = $("#grid").jqGrid('setRowData', rowid, { discountRate: discountRate, amount: amount });
                        };
                        taxRequired(rowid);
                        if(su) {
                            THISPAGE.calTotal();
                        };
                        break;
                    case 'amount':
                        var val = parseFloat(val);
                        var row = $("#grid").jqGrid('getRowData', rowid);
                        var deduction = parseFloat(row.deduction);
                        var quantity  = parseFloat($("#grid").jqGrid('getCell', rowid, iCol-3));
                        if($.isNumeric(val))
                        {
                            //var deduction = parseFloat(row.deduction);
                            var qty = parseFloat(row.qty);
                            var price = (val + deduction)/qty;
                            if($.isNumeric(quantity) && $.isNumeric(price))
                            {
                                var original = quantity * price;
                                var discountRate = original ? (deduction*100/original).toFixed(amountPlaces) : 0;
                                $("#grid").jqGrid('setRowData', rowid, { discountRate: discountRate});
                            };
                            $("#grid").jqGrid('setRowData', rowid, { discountRate:discountRate, price: price});
                        };
                        taxRequired(rowid);
                        THISPAGE.calTotal();
                        break;
                    case 'taxRate':
                        var strVal = val;
                        var val = parseFloat(val);
                        var row = $("#grid").jqGrid('getRowData', rowid);
                        var amount = parseFloat(row.amount);
                        if($.isNumeric(val)) {
                            var tax = amount * val / 100;
                            var taxAmount = amount + tax;
                            var su = $("#grid").jqGrid('setRowData', rowid, {tax: tax, taxAmount: taxAmount});
                            if(su) {
                                THISPAGE.calTotal();
                            };
                            break;
                        };
                        if(strVal === '') {
                            var su = $("#grid").jqGrid('setRowData', rowid, {tax: '', taxAmount: amount});
                            if(su) {
                                THISPAGE.calTotal();
                            };
                            break;
                        };
                    case 'tax':
                        var val = parseFloat(val);
                        var row = $("#grid").jqGrid('getRowData', rowid);
                        if($.isNumeric(val)) {
                            var amount = parseFloat(row.amount);
                            var taxAmount = amount + val;
                            var su = $("#grid").jqGrid('setRowData', rowid, {taxAmount: taxAmount});
                            if(su) {
                                THISPAGE.calTotal();
                            };
                        };
                        break;
                    case 'taxAmount':
                        var val = parseFloat(val);
                        var row = $("#grid").jqGrid('getRowData', rowid);
                        if($.isNumeric(val)) {
                            var deduction = parseFloat(row.deduction);
                            var taxRate = parseFloat(row.taxRate)/100;
                            var amount = val/(1+taxRate);
                            var discountRate = (deduction*100/(amount+deduction)).toFixed(amountPlaces);
                            var qty = parseFloat(row.qty);
                            //var price = ((val + deduction)/(1+taxRate))/qty;
                            //var deduction = amount/(1-discountRate) - amount;
                            var price = (amount + deduction)/ qty;
                            var tax = val - amount;
                            var su = $("#grid").jqGrid('setRowData', rowid, {discountRate :discountRate , price: price, amount: amount, tax: tax});
                            if(su) {
                                THISPAGE.calTotal();
                            };
                        };
                        break;
                };
            },
            loadonce: true,
            resizeStop: function(newwidth, index){
                _self.mod_PageConfig.setGridWidthByIndex(newwidth, index, 'grid');
            },
            footerrow : true,
            userData: { goods:"合计：", qty: data.totalQty, deduction: data.totalDiscount, amount: data.totalAmount,taxAmount: data.totalTaxAmount},
            userDataOnFooter : true,
            loadError : function(xhr,st,err) {
                Public.tips({type: 1, content : "Type: "+st+"; Response: "+ xhr.status + " "+xhr.statusText});
            }
        });

        function taxRequired(rowid){
            if(taxRequiredCheck) {
                var row = $("#grid").jqGrid('getRowData', rowid);
                var taxRate = parseFloat(row.taxRate);
                if($.isNumeric(taxRate)) {
                    var amount = parseFloat(row.amount);
                    var tax = amount * taxRate / 100;
                    var taxAmount = amount + tax;
                    var su = $("#grid").jqGrid('setRowData', rowid, {tax: tax, taxAmount: taxAmount});
                };
            };
        };

        function goodsFmt(val, opt, row){
            if(val) {
                goodsInfoHandle(opt.rowId);
                return val;
            } else if(row.invNumber) {
                if(row.invSpec) {
                    return row.invNumber + ' ' + row.invName + '_' + row.invSpec;
                } else {
                    return row.invNumber + ' ' + row.invName;
                }
            } else {
                return '&#160;';
            }

        };

        function skuElem(value, options) {
            var el = $('.skuAuto')[0];
            return el;
        };

        function skuValue(elem, operation, value) {
            if(operation === 'get') {
                if($('.skuAuto').getCombo().getValue() !== '') {
                    return $(elem).val();
                } else {
                    var parentTr = $(elem).parents('tr');
                    parentTr.removeData('skuInfo');
                    return '';
                }
            } else if(operation === 'set') {
                $('input', elem).val(value);
            }
        };

        function skuHandle() {
            $('#initCombo').append($('.skuAuto').val(''));
        };

        function storageElem(value, options) {
            var el = $('.storageAuto')[0];
            return el;
        };

        function storageValue(elem, operation, value) {
            if(operation === 'get') {
                if($('.storageAuto').getCombo().getValue() !== '') {
                    return $(elem).val();
                } else {
                    var parentTr = $(elem).parents('tr');
                    parentTr.removeData('storageInfo');
                    return '';
                }
            } else if(operation === 'set') {
                $('input', elem).val(value);
            }
        };

        function storageHandle() {
            $('#initCombo').append($('.storageAuto').val(''));
        };
        function unitElem(value, options) {
            var el = $('.unitAuto')[0];
            return el;
        };

        function unitValue(elem, operation, value) {
            if(operation === 'get') {
                if($('.unitAuto').getCombo().getValue() !== '') {
                    return $(elem).val();
                } else {
                    var parentTr = $(elem).parents('tr');
                    parentTr.removeData('unitInfo');
                    return '';
                }
            } else if(operation === 'set') {
                $('input', elem).val(value);
            }
        };

        function unitHandle() {
            $('#initCombo').append($('.unitAuto').val(''));
        };

        function priceElem(value, options) {
            var el = $('.priceAuto')[0];
            return el;
        };

        function priceValue(elem, operation, value) {
            if(operation === 'get') {
                var val = elem.val().split('：')[1];
                return val || elem.val();
            } else if(operation === 'set') {
                $('input', elem).val(value);
            }
        };

        function priceHandle() {
            $('#initCombo').append($('.priceAuto').val(''));
        };

        function goodsInfoHandle(rowid){
            var goodsInfo = $('#' + rowid).data('goodsInfo');
            if(goodsInfo) {
                if(!goodsInfo.price){
                    //用户没有录入价格的时候
                    var contactInfo = _self.$_customer.data('contactInfo');
                    if(contactInfo && contactInfo.id) {
                        //商品价格
                        var clevelPrice = goodsInfo.goods_price;//默认是零售价
                        var priceArr = [
                            goodsInfo.goods_price, //零售价格
                            goodsInfo.retailPrice, //批发价格
                            goodsInfo.goods_price1, //vip价格
                            goodsInfo.goods_price2, //折扣率一
                            goodsInfo.goods_price3 //折扣率二
                        ];
                        if(contactInfo.cLevel<3){
                            //非折扣
                            clevelPrice = priceArr[contactInfo.cLevel];
                        }else{
                            //折扣
                            clevelPrice = (goodsInfo.goods_price *10000* priceArr[contactInfo.cLevel] /1000000).toFixed(2);
                        };
                        goodsInfo.price = clevelPrice;
                    }
                }
                var rowData = {
                    skuName : goodsInfo.skuName || '',
                    mainUnit : goodsInfo.mainUnit || goodsInfo.unitName,
                    unitId : goodsInfo.unitId,
                    qty : goodsInfo.qty || 1,
                    goods_id:goodsInfo.goods_id,
                    goods_stock:goodsInfo.goods_stock,
					pic:goodsInfo.pic,
                    cat_id:goodsInfo.cat_id,
					specName:goodsInfo.specName,
                    goods_name:goodsInfo.goods_name,
                    price : goodsInfo.goods_price || goodsInfo.goods_price,
                    discountRate : goodsInfo.discountRate || 0,
                    deduction : goodsInfo.deduction || 0,
                    amount : goodsInfo.amount,
                    shop_name : goodsInfo.shop_name,
                    taxRate : goodsInfo.taxRate || taxRequiredInput,
                    safeDays : goodsInfo.safeDays
                };
                rowData.amount = rowData.amount ? rowData.amount : rowData.price * rowData.qty;
                var amount = Number(rowData.amount);
                if(taxRequiredCheck) {
                    var taxRate = rowData.taxRate;
                    var tax = amount * taxRate / 100;
                    var taxAmount = amount + tax;
                    rowData.tax = goodsInfo.tax || tax;
                    rowData.taxAmount = goodsInfo.taxAmount || taxAmount;
                };
                var su =  $("#grid").jqGrid('setRowData', rowid, rowData);
                if(su) {
                    THISPAGE.calTotal();
                };
            };
        }
    },

    //获得客户的账户金额信息
    setSaleByContact:function(contactInfo){
        var _self = this;
       /* if(_self.salesCombo){
			//显示买家账户金额
            Public.ajaxGet(SITE_URL + '?ctl=Order&met=getcontactInfo&typ=json',{buid:contactInfo.id},function(data){
                if(data.data.user_id){
                    $("#cash").val(data.data.user_money);
                }
            });
        }*/
        //显示用户账户余额
        Public.ajaxGet(SITE_URL + '?ctl=Order&met=getcontactInfo&typ=json',{buid:contactInfo.id},function(data){
            if(data.data.user_id){
                $("#cash").val(data.data.user_money);
            }
        });
    },

    goodsEdittypeInit:function(){
        if($('#grid')[0].p.savedRow.length != 0){
            $("#grid").jqGrid("saveCell", $('#grid')[0].p.savedRow[0].id, $('#grid')[0].p.savedRow[0].ic);
        }
        if(!THISPAGE.$_barCodeInsert.hasClass('active')){
            //非扫描枪录入，提供模糊搜索功能
            $('#grid').jqGrid('setColProp','goods', { edittype : 'custom' , editoptions:{custom_element: goodsElem, custom_value: goodsValue, handle: goodsHandle, trigger:'ui-icon-ellipsis'}});
        }else{
            //扫描枪录入，提供绝对匹配功能
            $('#grid').jqGrid('setColProp','goods', { edittype : 'text' ,editoptions : null});
        }
        function goodsElem(value, options) {
            var el = $('.goodsAuto')[0];
            return el;
        };

        function goodsValue(elem, operation, value) {
            if(operation === 'get') {
                if($('.goodsAuto').getCombo().getValue() !== '') {
                    return $(elem).val();
                } else {
                    var parentTr = $(elem).parents('tr');
                    parentTr.removeData('goodsInfo');
                    return '';
                }
            } else if(operation === 'set') {
                $('input',elem).val(value);
            }
        };

        function goodsHandle() {
            $('#initCombo').append($('.goodsAuto').val('').unbind("focus.once"));
        };
    },
    reloadData: function(data){
        $("#grid").clearGridData();
        //重载基础数据
        var _self = this;
        originalData = data;
        function _reloadBase(){
            _self.$_customer.data('contactInfo', { id: data.user_id, name: data.user_account});
            _self.customerCombo.input.val(data.contactName);
            _self.salesCombo.selectByValue(data.salesId, false);
            _self.$_date.val(data.date);
            _self.$_deliveryDate.val(data.deliveryDate);
            _self.$_number.text(data.billNo);
            data.transType == 150601 ? _self.classBox.setValue(0) : _self.classBox.setValue(1);
            _self.$_note.val(data.description);
            _self.$_discountRate.val(data.disRate);
            _self.$_deduction.val(data.disAmount);
            _self.$_discount.val(data.amount);
            _self.$_payment.val(data.rpAmount);
            _self.$_accountInfo.data('accountInfo', data.accounts);
            if(data.accId === -1) {
                _self.$_accountInfo.show();
            } else {
                _self.$_accountInfo.hide();
            };
            _self.$_totalArrears.val(data.totalArrears);
            _self.$_modifyTime.html(data.modifyTime);
        };
        var gap = 8 - data.entries.length;
        if(gap > 0) {
            for(var i = 0; i < gap; i++) {
                data.entries.push({});
            };
        };
        $("#grid").jqGrid('setGridParam',{data: data.entries, userData: { qty: data.totalQty, deduction: data.totalDiscount, amount: data.totalAmount, taxAmount: data.totalTaxAmount }}).trigger("reloadGrid");
        _reloadBase();
        if(data.status === 'edit')
        {
            if(!this.editable) {
                _self.enableEdit();
                $('#groupBtn').html(_self.btn_edit + _self.btn_audit);
                $("#mark").removeClass("has-audit");
            };
        }
        else
        {
            if(this.editable)
            {
                _self.disableEdit();
                $('#groupBtn').html( _self.btn_turn + _self.btn_view + _self.btn_reaudit);
                $("#mark").addClass("has-audit");
            };
        };
    },

    initCombo: function(){
        var _self = this;
        this.goodsCombo = Business.billGoodsCombo($('.goodsAuto'),{disSerNum:true});
        this.skuCombo = Business.billskuCombo($('.skuAuto'),{
            data:[]
        });
        this.storageCombo = Business.billStorageCombo($('.storageAuto'));
        this.unitCombo = Business.unitCombo($('.unitAuto'),{
            defaultSelected:-1,
            forceSelection:false
        });
        this.priceCombo = $('.priceAuto').combo({
            data: function(){
                if(!this.input)return [];
                var customerData = $('#customer').data('contactInfo');
                if(!customerData) return [];
                var $ptr = this.input.closest('tr');
                var goodsInfo = $ptr.data('goodsInfo');
                if(!goodsInfo) return [];
                var priceListInfo = $('#customer').data('priceList')[goodsInfo.id];
                if(!priceListInfo || !priceListInfo.prices) return [];
                if( customerData.id <= 0 )return [];
                var priceList = [];
                if(priceListInfo.prices.levelPrice){
                    var clevel = '';
                    if(customerData.cLevel<3){
                        //非折扣
                        clevel = ['零售','批发','VIP'][customerData.cLevel] + '价：' + priceListInfo.prices.levelPrice;
                    }else if(priceListInfo.prices.discountRate){
                        //折扣
                        clevel = ['折扣一','折扣二'][customerData.cLevel-3] + '价：' + priceListInfo.prices.levelPrice * priceListInfo.prices.discountRate/100;
                    }
                    clevel && priceList.push({name:clevel , id:1});
                }
                if(priceListInfo.prices.nearPrice){
                    priceList.push({name:'最近售价：' + priceListInfo.prices.nearPrice, id:2});
                }
                return priceList;
            },
            text: 'name',
            value: 'id',
            defaultSelected: 0,
            cache: false,
            editable: true,
            trigger: false,
            defaultFlag: false,
            forceSelection:false,
            listWidth: 140,
            callback: {
                onChange: function(data){

                },
                onFocus:function(){
                    var $trigger = $('.priceAuto ').siblings('.ui-icon-triangle-1-s').hide();
                    var $ptr = this.input.closest('tr');
                    var goodsInfo = $ptr.data('goodsInfo');
                    if(!goodsInfo)return;
                    var contactInfo = _self.$_customer.data('contactInfo');
                    var priceList = _self.$_customer.data('priceList');
                    if(!priceList){
                        priceList = {};
                        _self.$_customer.data('priceList',priceList);
                    }
                    if(!contactInfo || $.trim(_self.$_customer.find('input').val()) === ''){
                        return;
                    }
                    var _getPrice = function(){
                        var priceListInfo = {cId : contactInfo.id};
                        priceList[goodsInfo.id] = priceListInfo;
                        Public.ajaxPost(SITE_URL+'?ctl=Order&met=listBySelected', {type: 'so',ids : goodsInfo.id, contactId : contactInfo.id}, function(data){
                            if(data.status === 200 && data.data && data.data.result) {
                                var items = data.data.result;
                                for(var i = 0, len = items.length; i< len ; i++){
                                    var _item = items[i];
                                    if(_item.nearPrice){
                                        priceListInfo.prices = {};
                                        priceListInfo.prices.nearPrice = _item.nearPrice;
                                    }
                                    if(_item.goods_price){
                                        priceListInfo.prices = priceListInfo.prices || {};
                                        priceListInfo.prices.levelPrice = _item.goods_price;
                                        priceListInfo.prices.discountRate = _item.discountRate;
                                    }
                                }
                                if(priceListInfo.prices){
                                    $trigger.show();
                                }
                            }
                        });
                    }
                    if(priceList[goodsInfo.id]){
                        //商品价格信息存在
                        var goodsPirceList = priceList[goodsInfo.id];
                        if(goodsPirceList.cId != contactInfo.id){
                            //客户信息不存在或者变了之后要跟新当前的价格列表
                            _getPrice();
                        }else if(goodsPirceList.prices){
                            $trigger.show();
                        }
                    }else{
                        //商品价格信息不存在
                        _getPrice();
                    }
                }
            }
        }).getCombo();
    },

    disableEdit: function(){
        this.customerCombo.disable();
        //this.salesCombo.disable();
        this.$_date.attr('disabled', 'disabled').addClass('ui-input-dis');
        this.$_deliveryDate.attr('disabled', 'disabled').addClass('ui-input-dis');
        this.$_note.attr('disabled', 'disabled').addClass('ui-input-dis');
        this.$_discountRate.attr('disabled', 'disabled').addClass('ui-input-dis');
        this.$_deduction.attr('disabled', 'disabled').addClass('ui-input-dis');
        this.$_payment.attr('disabled', 'disabled').addClass('ui-input-dis');
		this.$_paymentMethod.attr('disabled', 'disabled').addClass('ui-input-dis');
		this.$_password.attr('disabled', 'disabled').parent().addClass("hidden");
		this.$_cash.parent().addClass('hidden');
        $("#grid").jqGrid('setGridParam',{cellEdit: false});
        this.editable = false;
    },

    enableEdit: function(){
        if(disEditable){
            return;
        }
        this.salesCombo.enable();
        this.customerCombo.enable();
        this.$_date.removeAttr('disabled').removeClass('ui-input-dis');
        this.$_deliveryDate.removeAttr('disabled').removeClass('ui-input-dis');
        this.$_note.removeAttr('disabled').removeClass('ui-input-dis');
        this.$_discountRate.removeAttr('disabled').removeClass('ui-input-dis');
        this.$_deduction.removeAttr('disabled').removeClass('ui-input-dis');
        this.$_payment.removeAttr('disabled').removeClass('ui-input-dis');
		this.$_paymentMethod.removeAttr('disabled').removeClass('ui-input-dis');
		this.$_password.removeAttr('disabled').removeClass('ui-input-dis');
        this.accountCombo.enable();
        $("#grid").jqGrid('setGridParam',{cellEdit: true});
        this.editable = true;
    },

    addEvent: function(){
        var _self = this;
        this.customerCombo.input.enterKey();
        this.$_date.bind('keydown', function(e){
            if(e.which === 13){
                _self.$_deliveryDate.trigger('focus').select();
            }
        }).bind('focus', function(e){
            _self.dateValue = $(this).val();
        }).bind('blur', function(e){
            var reg = /((^((1[8-9]\d{2})|([2-9]\d{3}))(-)(10|12|0?[13578])(-)(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(11|0?[469])(-)(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(0?2)(-)(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)(-)(0?2)(-)(29)$)|(^([3579][26]00)(-)(0?2)(-)(29)$)|(^([1][89][0][48])(-)(0?2)(-)(29)$)|(^([2-9][0-9][0][48])(-)(0?2)(-)(29)$)|(^([1][89][2468][048])(-)(0?2)(-)(29)$)|(^([2-9][0-9][2468][048])(-)(0?2)(-)(29)$)|(^([1][89][13579][26])(-)(0?2)(-)(29)$)|(^([2-9][0-9][13579][26])(-)(0?2)(-)(29)$))/;
            if(!reg.test($(this).val())) {
                parent.Public.tips({type:2, content : '日期格式有误！如：2012-08-08。'});
                $(this).val(_self.dateValue);
            };
        });
        this.$_deliveryDate.bind('keydown', function(e){
            if(e.which === 13){
                $("#grid").jqGrid("editCell", 1, 2, true);
            }
        }).bind('focus', function(e){
            _self.dateValue = $(this).val();
        }).bind('blur', function(e){
            var reg = /((^((1[8-9]\d{2})|([2-9]\d{3}))(-)(10|12|0?[13578])(-)(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(11|0?[469])(-)(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(0?2)(-)(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)(-)(0?2)(-)(29)$)|(^([3579][26]00)(-)(0?2)(-)(29)$)|(^([1][89][0][48])(-)(0?2)(-)(29)$)|(^([2-9][0-9][0][48])(-)(0?2)(-)(29)$)|(^([1][89][2468][048])(-)(0?2)(-)(29)$)|(^([2-9][0-9][2468][048])(-)(0?2)(-)(29)$)|(^([1][89][13579][26])(-)(0?2)(-)(29)$)|(^([2-9][0-9][13579][26])(-)(0?2)(-)(29)$))/;
            if(!reg.test($(this).val())) {
                parent.Public.tips({type:2, content : '日期格式有误！如：2012-08-08。'});
                $(this).val(_self.dateValue);
            };
        });
        this.$_note.enterKey();
        this.$_discount.enterKey();
        this.$_discountRate.enterKey();
		this.$_paymentMethod.enterKey();
		this.$_password.enterKey();

        //仓库和单位下拉显示
        $('.grid-wrap').on('click', '.ui-icon-triangle-1-s', function(e){
            var $input = $(this).siblings();
            var _combo = $input.getCombo();
            setTimeout(function(){
                _combo.active = true;
                _combo.doQuery();
            }, 10);
        });
 
        this.$_deduction.keyup(function(){
            var value = Number($(this).val());
            var inTotal = Number($("#grid").jqGrid('footerData', 'get')[_self.calAmount].replace(/,/g,''));
            var discount = (inTotal - value).toFixed(amountPlaces);
            if(inTotal) {
                var rate = (value/inTotal)*100;
                var arrears = discount - Number($.trim(_self.$_payment.val()));
                THISPAGE.$_discountRate.val(rate.toFixed(amountPlaces));
                THISPAGE.$_discount.val(discount);
				THISPAGE.$_paymentMethod.find("option:selected").val();
				THISPAGE.$_password.val();
            }
        }).on('keypress', function(e){
            Public.numerical(e);
        }).on('click', function(){
            this.select();
        }).blur(function(event) {
            if( $(this).val() < 0 ){
                defaultPage.Public.tips({content:2 , content:'优惠金额不能为负数！'});
                $(this).focus();
            }
        });

        this.$_discountRate.keyup(function(){
            var value = Number($(this).val());
            var inTotal = Number($("#grid").jqGrid('footerData', 'get')[_self.calAmount].replace(/,/g,''));
            var rate = inTotal*(value/100);
            var deduction = rate.toFixed(amountPlaces);
            var discount = (inTotal - deduction).toFixed(amountPlaces);
            var arrears = discount - Number($.trim(_self.$_payment.val()));
            THISPAGE.$_deduction.val(deduction);
            THISPAGE.$_discount.val(discount);
        }).on('keypress', function(e){
            Public.numerical(e);
        }).on('click', function(){
            this.select();
        }).blur(function(event) {
            if( $(this).val() < 0 ){
                defaultPage.Public.tips({content:2 , content:'优惠率不能为负数！'});
                $(this).focus();
            }
        });

        this.$_payment.keyup(function(){
            var value = $(this).val() || 0;
            var discount = _self.$_discount.val();
            var arrears = Number(parseFloat(discount) - parseFloat(value));
            var totalArrears = Number(arrears  + THISPAGE.customerArrears);
            THISPAGE.$_totalArrears.val(totalArrears.toFixed(amountPlaces));
            var accountInfo = _self.$_accountInfo.data('accountInfo');
            if(accountInfo && accountInfo.length === 1) {
                accountInfo[0].payment = value;
            };
        }).on('keypress', function(e){
            Public.numerical(e);
        }).on('click', function(){
            this.select();
        });

        //点击结算按钮，进行订单结算操作，下单
        $('.wrapper').on('click', '#save', function(e){
            e.preventDefault();
            var $this = $(this);
            var postData = THISPAGE.getPostData();     //获取提交数据
            if(postData)
            {
                if(originalData.stata === 'edit')
                {
                    postData.id = originalData.id;
                    postData.stata = 'edit';
                };
                if(postData.paymentMethod == 2 && $("#password").val() =='') //余额支付，需要校验密码
				{
					 parent.Public.tips({type: 1, content : '请输入支付密码！'});
                     return false;
				};
                $this.ajaxPost(SITE_URL+'?ctl=Order&met=addOrder&typ=json', postData, function(data)
                {
                    if(data.status === 200)
                    {
                        if(postData.paymentMethod == 3){  //微信支付
                              window.location.href = PAY_URL+"/index.php?ctl=Pay&met=wx_native&trade_id="+data.data.uorder+"&op=pc";
                        }
						else
						{
                            _self.$_modifyTime.html((new Date()).format('yyyy-MM-dd hh:mm:ss')).parent().show();
                            originalData.id = data.data.id;   //返回订单号
                            if(billRequiredCheck)
                            {
                                _self.$_toolBottom.html('<span id="groupBtn">' + _self.btn_edit + _self.btn_audit + '</span>');
                            }
                            else
                            {
                                _self.$_toolBottom.html('<span id="groupBtn">' + _self.btn_edit + '</span>');
                            }
                            parent.Public.tips({content : '保存成功！'});
                            _self.disableEdit();                        //订单提交成功后,表格变为不可编辑
                        }
                    }
                    else
                    {
                        parent.Public.tips({type: 1, content : data.msg});
                    }
                })
            }
        });

        //修改
        $('.wrapper').on('click', '#edit', function(e){
            e.preventDefault();
            if (!Business.verifyRight('SO_UPDATE')) {
                return ;
            };
            var $this = $(this);
            var postData = THISPAGE.getPostData();
            if(postData) {
                $this.ajaxPost('/scm/invSo.do?action=updateInvSo', {postData: JSON.stringify(postData)}, function(data){
                    if(data.status === 200) {
                        _self.$_modifyTime.html((new Date()).format('yyyy-MM-dd hh:mm:ss')).parent().show();
                        originalData.id = data.data.id;
                        parent.Public.tips({content : '修改成功！'});
                    } else {
                        parent.Public.tips({type: 1, content : data.msg});
                    }
                })
            }
        });


        //审核
        $('.wrapper').on('click', '#audit', function(e){
            e.preventDefault();
            if (!Business.verifyRight('SO_CHECK')) {
                return ;
            };
            var $this = $(this);
            var postData = THISPAGE.getPostData();
            if(postData) {
                $this.ajaxPost('/scm/invSo.do?action=checkInvSo', {postData: JSON.stringify(postData)}, function(data){
                    if(data.status === 200) {
                        originalData.id = data.data.id;
                        $('#mark').addClass("has-audit");
                        $('#edit').hide();
                        _self.disableEdit();
                        $("#groupBtn").html(_self.btn_turn + _self.btn_view + _self.btn_reaudit);
                        if(_self.classBox.getValue() == '150602'){
                            $('#turn').html('生成退货单')
                        }else{
                            $('#turn').html('生成销货单')
                        }
                        parent.Public.tips({content : '审核成功！'});
                    } else {
                        parent.Public.tips({type: 1, content : data.msg});
                    }
                })
            }
        });

        //反审核
        $('.wrapper').on('click', '#reAudit', function(e){
            e.preventDefault();
            if (!Business.verifyRight('SO_UNCHECK')) {
                return ;
            };
            var $this = $(this);
            $this.ajaxPost('/scm/invSo.do?action=rsBatchCheckInvSo', {"id":originalData.id}, function(data){
                if(data.status === 200) {
                    $('#mark').removeClass();

                    $('#edit').show();
                    _self.enableEdit();
                    $("#groupBtn").html(_self.btn_edit + _self.btn_audit);
                    parent.Public.tips({content : '反审核成功！'});
                } else {
                    parent.Public.tips({type: 1, content : data.msg});
                }
            });
        });


        //新增，点击下单
        $('.wrapper').on('click', '#add', function(e){
            e.preventDefault();
            if (!Business.verifyRight('SO_ADD')) {
                return ;
            };
            parent.tab.overrideSelectedTabItem({tabid: 'sales-salesOrder', text: '下单', url: SITE_URL+'?ctl=Order&met=ordering'});
        });


        //打印单据
        $('.wrapper').on('click', '#print', function(e){
            e.preventDefault();
            if (!Business.verifyRight('SO_PRINT')) {
                return ;
            };
            Public.print({
                title:'打印票据',
                $grid:$('#grid'),
                pdf: SITE_URL+'?ctl=Order&met=printOrder&action=toPdf',
                billType: 10303,
                filterConditions:{
                    id:originalData.id
                }
            });
            //打印单据
            $("#add").show();//点击打印后，显示下单按钮
        });

        this.$_accountInfo.click(function(){
            var accountInfo = $(this).data('accountInfo');
            _self.chooseAccount(accountInfo);
        });
		
		//打印单据
		$(".print").on('click',function(){ $(".bills").printTable();});
		



        //上一张
        $('#prev').click(function(e){
            e.preventDefault();
            if($(this).hasClass("ui-btn-prev-dis")) {
                parent.Public.tips({type:2, content : '已经没有上一张了！'});
                return false;
            } else {
                _self.idPostion = _self.idPostion - 1;
                if(_self.idPostion === 0) {
                    $(this).addClass("ui-btn-prev-dis");
                };
                loading = $.dialog.tips('数据加载中...', 1000, 'loading.gif', true);
                Public.ajaxGet(SITE_URL+'?ctl=Order&met=updateOrderInfo&typ=json', {id : _self.idList[_self.idPostion]}, function(data){
                    THISPAGE.reloadData(data.data);
                    $("#next").removeClass("ui-btn-next-dis");
                    if(loading) {
                        loading.close();
                    };
                });
            };

        });
        //下一张
        $('#next').click(function(e){
            e.preventDefault();
            if($(this).hasClass("ui-btn-next-dis")) {
                parent.Public.tips({type:2, content : '已经没有下一张了！'});
                return false;
            } else {
                _self.idPostion = _self.idPostion + 1;
                if(_self.idLength === _self.idPostion + 1) {
                    $(this).addClass("ui-btn-next-dis");
                };
                loading = $.dialog.tips('数据加载中...', 1000, 'loading.gif', true);
                Public.ajaxGet(SITE_URL+'?ctl=Order&met=updateOrderInfo&typ=json', {id : _self.idList[_self.idPostion]}, function(data){
                    THISPAGE.reloadData(data.data);
                    $("#prev").removeClass("ui-btn-prev-dis");
                    if(loading) {
                        loading.close();
                    };
                });
            };
        });

        //启动或关闭扫描枪
        THISPAGE.$_barCodeInsert.click(function(event) {
            var _isActive = 1;
            if(THISPAGE.$_barCodeInsert.hasClass('active'))
            {
                THISPAGE.$_barCodeInsert.removeClass('active');
                _isActive = null;
            }
            else
            {
                THISPAGE.$_barCodeInsert.addClass('active');
            }
            _self.goodsEdittypeInit();
            $.cookie('BarCodeInsert',_isActive);
        });

        //列配置
        $('#config').click(function(event) {
            _self.mod_PageConfig.config();
        });

        $(window).resize(function(event) {
            Public.autoGrid($('#grid'));
        });
		
		//防止js中断，放在最后
		Business.billsEvent(_self, 'sales');
    },

    resetData: function(){
        var _self = this;
        $("#grid").clearGridData();
        for(var i=1; i<=8; i++) {
            $("#grid").jqGrid('addRowData', i, {});
            $("#grid").jqGrid('footerData', 'set', { qty:0, amount: 0 });
        };
        _self.$_note.val('');
        _self.$_discountRate.val(originalData.disRate);
        _self.$_deduction.val(originalData.disAmount);
        _self.$_discount.val(originalData.amount);
        _self.$_payment.val(originalData.rpAmount);
		_self.$_paymentMethod.find("option:selected").val();
		_self.$_password.val();
    },

    //计算订单总金额，总折扣
    calTotal: function(){
        var ids = $("#grid").jqGrid('getDataIDs');
        var total_quantity = 0, total_deduction = 0, total_amount = 0, total_tax = 0, total_taxAmount = 0;
        for(var i = 0, len = ids.length; i < len; i++){
            var id = ids[i];
            var row = $("#grid").jqGrid('getRowData',id);
            if(row.qty) {
                total_quantity += parseFloat(row.qty);
            };
            if(row.deduction) {
                total_deduction += parseFloat(row.deduction); //总共优惠
            };
            if(row.amount) {
                total_amount += parseFloat(row.amount);
            };
        };
        $("#grid").jqGrid('footerData', 'set', { qty:total_quantity, deduction:total_deduction, amount: total_amount, tax:total_tax, taxAmount: total_taxAmount});

        var discountVal = (total_amount - Number(this.$_deduction.val())).toFixed(2);
        this.$_discount.val(discountVal);
    },



    _getEntriesData: function(){
        var entriesData = [];
        var ids = $("#grid").jqGrid('getDataIDs');
        for(var i = 0, len = ids.length; i < len; i++){
            var id = ids[i], itemData;
            var row = $("#grid").jqGrid('getRowData',id);
            if(row.goods === '') {
                continue;	//跳过无效分录
            };
            var goodsInfo = $('#' + id).data("goodsInfo");
            var storageInfo = $('#' + id).data("storageInfo");
            var unitInfo = $('#' + id).data("unitInfo")||{};
            var skuInfo = $('#' + id).data("skuInfo") || {} ;
            if(goodsInfo.invSkus && goodsInfo.invSkus.length>0 && !skuInfo.id) {
                parent.Public.tips({type:2, content:'请选择相应的属性！'});
                $("#grid").jqGrid('editCellByColName', id, 'skuName');
                return false;
            }
            itemData = {
                invId: goodsInfo.goods_id,
                invNumber: goodsInfo.number,
                invName: goodsInfo.name,
                invSpec: goodsInfo.spec,
                skuId: skuInfo.id || -1,
                skuName: skuInfo.name || '',
                unitId: unitInfo.unitId || -1,
                mainUnit: unitInfo.name || '',
                qty: row.qty,
                price: row.price,
                goods_id:row.goods_id,
                goods_stock:row.goods_stock,
				pic:row.pic,
                cat_id:row.cat_id,
				specName:row.specName,
                goods_name:row.goods_name,
				skuId:row.skuId,
				skuName:row.skuName,
                discountRate: row.discountRate,
                deduction: row.deduction,
                amount: row.amount,
                shop_id: storageInfo.id,
                shop_name: storageInfo.name,
                description: row.description
            };
            if(taxRequiredCheck) {
                itemData.taxRate = row.taxRate;
                itemData.tax = row.tax;
                itemData.taxAmount = row.taxAmount;
            }
            entriesData.push(itemData);
        };

        return entriesData;
    },


    //构造提交数据
    getPostData: function(){
        var self = this;
        var _self = this;
        if(curRow !== null && curCol !== null){
            $("#grid").jqGrid("saveCell", curRow, curCol);
            curRow = null;
            curCol = null;
        };
        var $_contact_input = _self.$_customer.find('input');
        if($_contact_input.val() === '')
        {
            _self.$_customer.removeData('contactInfo');
            parent.Public.tips({type: 2, content: '请选择客户！'});
            return false;
        }
        else
        {
            var contactInfo = _self.$_customer.data('contactInfo');
            if(!contactInfo || !contactInfo.id) {

                setTimeout(function(){
                    $_contact_input.focus().select();
                }, 15);

                parent.Public.tips({type: 2, content: '当前客户不存在！'});
                return false;
            };
        };
        var entries = this._getEntriesData();
        if(!entries) return false;
        if(entries.length > 0)
        {
            var _note = $.trim(self.$_note.val());
            var postData = {
                id: originalData.id,	                                                            //单号
                buId: contactInfo.id,	                                                            //客户ID
                contactName: contactInfo.name,	                                                    //客户名称
                date: $.trim(self.$_date.val()),	                                                //日期
                deliveryDate: $.trim(self.$_deliveryDate.val()),	                                //交货日期
                billNo: $.trim(self.$_number.text()),	                                            //单据编号
                transType: self.classBox.getValue(),	                                            //单据类型
                entries: entries,	                                                                //分录数据
                totalQty: $("#grid").jqGrid('footerData', 'get').qty.replace(/,/g,''),	            //合计数量
                totalDiscount: $("#grid").jqGrid('footerData', 'get').deduction.replace(/,/g,''),	//合计折扣额
                totalAmount: $("#grid").jqGrid('footerData', 'get').amount.replace(/,/g,''),	    //合计金额
                description: _note === self.$_note[0].defaultValue ? '' : _note,	                //备注
                disRate: $.trim(self.$_discountRate.val()),	                                        //折扣率
                disAmount: $.trim(self.$_deduction.val()),	                                        //折扣额
                amount: $.trim(self.$_discount.val()),	                                            //折后金额
				password: $.trim($.md5(self.$_password.val())),	                                    //支付密码
				cash:$.trim(self.$_cash.val()),                                                     //账户余额
				paymentMethod: $.trim(self.$_paymentMethod.find("option:selected").val()),	        //支付方式
            };
            if(taxRequiredCheck){

            };
            return postData;
        }
        else
        {
            parent.Public.tips({type: 2, content: '商品信息不能为空！'});
            $("#grid").jqGrid("editCell", 1, 2, true);
            return false;
        }
    }
};




//初始化添加订单页面信息
var hasLoaded = false, originalData;
$(function(){
    if(!urlParam.id) {      //添加订单
        originalData = {
            id: -1,
            status: "add",	//操作类型
            customer: 0,
            transType: 150601,
            entries: [                      //默认8个商品
                {id:"1", mainUnit: null},
                {id:"2"},
                {id:"3"},
                {id:"4"},
                {id:"5"},
                {id:"6"},
                {id:"7"},
                {id:"8"}
            ],
            totalQty: 0,
            totalDiscount: 0,
            totalAmount: 0,
            totalTaxAmount: 0,
            disRate: 0,
            disAmount: 0,
            amount: '0.00',
            rpAmount: '0.00',
            arrears: '0.00',
            accId: 0
        };
        THISPAGE.init(originalData);
        //新增
    } 
    else 
    {
        if(!hasLoaded)  //编辑
        {
            var $_bills = $('.bills').hide();
            Public.ajaxGet(SITE_URL+'?ctl=Order&met=updateOrderInfo&typ=json', {id : urlParam.id}, function(data){
                if(data.status === 200) 
                {
                    originalData = data.data;
                    THISPAGE.init(data.data);
                    $_bills.show();
                    hasLoaded = true;
                } 
                else 
                {
                    parent.Public.tips({type: 1, content : data.msg});
                }
            });
        } 
        else {

        };
    }
});
