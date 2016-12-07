$(function ()
{
  var city = $.cookie('trans_city');
  // alert($.cookie('trans_city'));

    $.getJSON(ApiUrl + "/index.php?ctl=Shop_Shoplist&met=index&typ=json", function (t)
    {
        var r = t.data.items;
        // console.info(r);
        for(var i in r)
        {
                  var temp = r.shop_company_address;
                  var map = new BMap.Map("container1");
                  var localSearch = new BMap.LocalSearch(map);

                    function searchByStationName(info) 
                    {
                        map.clearOverlays();//清空原来的标注
                        var keyword = info;

                        localSearch.setSearchCompleteCallback(function (searchResult) {
                            var poi = searchResult.getPoi(0);

                            map.centerAndZoom(poi.point, 13);
                            var marker = new BMap.Marker(new BMap.Point(poi.point.lng, poi.point.lat));  // 创建标注，为要查询的地方对应的经纬度
                            map.addOverlay(marker);
                            // var content = document.getElementById("text_").value + "<br/><br/>经度：" + poi.point.lng + "<br/>纬度：" + poi.point.lat;
                            // alert(poi.point.lng);
                            // alert(poi.point.lat);
                            //=============================================================
                            var point = new BMap.Point(poi.point.lng,poi.point.lat);
                            var geoc = new BMap.Geocoder();    
                            geoc.getLocation(point, function(rs){
                              var addComp = rs.addressComponents;
                              var address = addComp.province + "" + addComp.city + "" + addComp.district + "" + addComp.street + "" + addComp.streetNumber;
                              // var address = addComp.city;  
                              alert(address)  ;  
                                 });
                            //==============================================================                       

                            });
                           localSearch.search(keyword);
                        } 
                    searchByStationName(temp);             

        }
    });



});


