$(function () {

    searchFlag = false;
    SYSTEM = system = parent.SYSTEM;
    function initDom() {
        var defaultPage = Public.getDefaultPage();
        defaultPage.SYSTEM = defaultPage.SYSTEM || {};
        defaultPage.SYSTEM.categoryInfo = defaultPage.SYSTEM.categoryInfo || {};

        this.$_matchCon = $('#matchCon'),
            this.$_beginDate = $('#begin_date').val(system.beginDate),
            this.$_endDate = $('#end_date').val(system.endDate),
            this.$_matchCon.placeholder(),
            this.$_beginDate.datepicker(),
            this.$_endDate.datepicker()

    };

    function initGrid() {
        var a = Public.setGrid(),
            b = parent.SYSTEM.rights,
            c = !(parent.SYSTEM.isAdmin || b.AMOUNT_COSTAMOUNT),
            h = !(parent.SYSTEM.isAdmin || b.AMOUNT_INAMOUNT),
            k = !(parent.SYSTEM.isAdmin || b.AMOUNT_OUTAMOUNT),
            l = [
                {
                    name: 'user_name',
                    label: '用户名',
                    width: 200,
                    align: 'center'
                },
                {
                    name: 'nickname',
                    label: '昵称',
                    width: 100,
                    align: 'center'
                },
                {
                    name: 'user_truename',
                    label: '真实姓名',
                    width: 100,
                    align: 'center'
                },
                {
                    name: 'user_gender',
                    label: '性别',
                    width: 50,
                    align: 'center'
                },
                {
                    name: 'user_tel',
                    label: '电话',
                    width: 100,
                    align: 'center'
                },
                {
                    name: 'user_mobile',
                    label: '手机号码',
                    width: 120,
                    align: 'center'
                },
                {
                    name: 'user_qq',
                    label: 'QQ',
                    width: 120,
                    align: 'center'
                },
                {
                    name: 'user_province',
                    label: '省份',
                    width: 100,
                    align: 'center'
                },
                {
                    name: 'user_city',
                    label: '城市',
                    width: 100,
                    align: 'center'
                },
                {
                    name: 'user_reg_time',
                    label: '注册时间',
                    width: 150,
                    align: 'center'
                },
                {
                    name: 'user_lastlogin_time',
                    label: '上次登录时间',
                    width: 150,
                    align: 'center'
                },
                {
                    name: 'user_count_login',
                    label: '登录次数',
                    width: 55,
                    align: 'center'
                },
                {
                    name: 'delete',
                    label: '状态',
                    index: 'delete',
                    width: 80,
                    align: 'center',
                    formatter: i.statusFmatter
                }
            ];

            //mod_PageLicence.gridReg('grid', colModel);
            //colModel = mod_PageLicence.conf.grids['grid'].colModel;

            $('#grid').jqGrid({

                url: './index.php?ctl=User_Base&met=userList&typ=json',
                datatype: 'json',
                autowidth: true,
                shrinkToFit: true,
                forceFit: false,
                width: a.w,
                height: a.h,
                altRows: true,
                gridview: true,
                onselectrow: false,
                multiselect: false, //多选
                colModel: l,
                pager: '#page',
                viewrecords: true,
                cmTemplate: {
                    sortable: false
                },
                rowNum: 100,
                rowList: [100, 200, 500],
                //scroll: 1,
                jsonReader: {
                    root: "data.items",
                    records: "data.records",
                    total: "data.total",
                    repeatitems: false,
                    id: "id"
                },



            loadComplete: function(response) {
                if (response && response.status == 200) {
                    var gridData = {};
                    data = response.data;
                    for (var i = 0; i < data.items.length; i++) {
                        var item = data.items[i];
                        item['id'] = item.id;
                        gridData[item.id] = item;
                    }

                    $("#grid").data('gridData', gridData);
                } else {
                    var msg = response.status === 250 ? (searchFlag ? '没有满足条件的结果哦！' : '没有数据哦！') : response.msg;
                    parent.Public.tips({
                        type: 2,
                        content: msg
                    });
                }
            },
            
            loadError: function(xhr, status, error) {
                parent.Public.tips({
                    type: 1,
                    content: '操作失败了哦，请检查您的网络链接！'
                });
            },
            resizeStop: function(newwidth, index) {
                //mod_PageLicence.setGridWidthByIndex(newwidth, index, 'grid');
            }


            }).navGrid('#page', {
                edit: false,
                add: false,
                del: false,
                search: false,
                refresh: false
            }).navButtonAdd('#page', {
                caption: '',
                buttonicon: 'ui-icon-config',
                onClickButton: function () {
                    j.config()
                },
                position: 'last'
            })
    }



    function initEvent() {
            var match_con = $('#matchCon');
            //查询
            $('#search').on('click', function(e) {
                e.preventDefault();
                var skey = match_con.val() === '请输入查询内容' ? '' : $.trim(match_con.val());

                $("#grid").jqGrid('setGridParam', {
                    page: 1,
                    postData: {
                        skey: skey
                    }
                }).trigger("reloadGrid");

            });


            $('#grid').on('click', '.set-status', function (a) {
                if (a.stopPropagation(), a.preventDefault(), Business.verifyRight('INVLOCTION_UPDATE')) {
                    var b = $(this).data('id'),
                        c = !$(this).data('delete');
                    h.setStatus(b, c)
                }
            })
    }


    var d = (parent.SYSTEM, Number(parent.SYSTEM.qtyPlaces), Number(parent.SYSTEM.pricePlaces)),
        e = Number(parent.SYSTEM.amountPlaces),
        f = 95,
        g = 0,
        h = {
            operate: function (a, b) {
                var a = this;
                $('.grid-wrap').on('click', '.ui-icon-pencil', function (a) {
                    a.preventDefault();
                    var b = $(this).parent().data('id');
                    parent.tab.addTabItem({
                        tabid: 'storage-adjustment',
                        text: '信息修改',
                        url: './index.php?ctl=Purchase_Information&id=' + b
                    });
                    $('#grid').jqGrid('getDataIDs');
                    parent.salesListIds = $('#grid').jqGrid('getDataIDs')
                })
            },

            del:function (a, b) {
                var e = 600;
                var c='推送消息';
                _h = 480,
                    $.dialog({
                        title: c,
                        content: 'url:./index.php?ctl=Message_Record&met=send&t='+a,
                        data: a,
                        width: e,
                        height: 300,
                        max: !1,
                        min: !1,
                        cache: !1,
                        lock: !0
                    })
            },

            setStatus: function (a, b) {
                a && Public.ajaxPost('./index.php?ctl=User_Base&met=editStatus&typ=json', {
                    id: a,
                    server_status: Number(b)
                }, function (c) {
                    c && 200 == c.status ? (parent.Public.tips({
                        content: '状态修改成功！'
                    }), $('#grid').jqGrid('setCell', a, 'delete', b))  : parent.Public.tips({
                        type: 1,
                        content: '状态修改失败！' + c.msg
                    })
                })
            },
            setStatuses: function (a, b) {
                if (a && 0 != a.length) {
                    var c = $('#grid').jqGrid('getGridParam', 'selarrrow'),
                        d = c.join();
                    Public.ajaxPost('./index.php?ctl=User_Base&met=editStatus&typ=json', {
                        id: a,
                        server_status: Number(b)
                    }, function (c) {
                        if (c && 200 == c.status) {
                            parent.Public.tips({
                                content: '状态修改成功！'
                            });
                            for (var d = 0; d < a.length; d++) {
                                var e = a[d];
                                $('#grid').jqGrid('setCell', e, 'delete', b)
                            }
                        } else parent.Public.tips({
                            type: 1,
                            content: '状态修改失败！' + c.msg
                        })
                    })
                }
            },
            callback: function (a, b, c) {
                var d = $('#grid').data('gridData');
                d || (d = {
                }, $('#grid').data('gridData', d)),
                    d[a.id] = a,
                    'edit' == b ? ($('#grid').jqGrid('setRowData', a.id, a), c && c.api.close())  : ($('#grid').jqGrid('addRowData', a.id, a, 'last'), c && c.resetForm(a))
            }
        },
        i = {
            money: function (a, b, c) {
                var a = Public.numToCurrency(a);
                return a || '&#160;'
            },
            currentQty: function (a, b, c) {
                if ('none' == a) return '&#160;';
                var a = Public.numToCurrency(a);
                return a
            },
            quantity: function (a, b, c) {
                var a = Public.numToCurrency(a);
                return a || '&#160;'
            },
            statusFmatter: function (a, b, c) {
                var d = a === !0 ? '未激活' : '已锁定',
                    e = a === !0 ? 'ui-label-default' : 'ui-label-success';
                return '<span class="set-status ui-label ' + e + '" data-delete="' + a + '" data-id="' + c.id + '">' + d + '</span>'
            }
        },
        j = Public.mod_PageConfig.init('goodsList');

    initGrid();
    initEvent();
});
