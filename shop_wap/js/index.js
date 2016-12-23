var map_list = [];
var map_index_id = '';
var shop_slide = new Array();
var shop_slideurl = new Array();
var sli='';
var cart_count = 1 ;
var total = 1;
var dis = new Array();
dis[0]=10000000000000000;
var temp ='';

    var EARTH_RADIUS = 6378137.0;    //单位M
    var PI = Math.PI;
    
    function getRad(d){
        return d*PI/180.0;
    }
    
    /**
     * caculate the great circle distance
     * @param {Object} lat1
     * @param {Object} lng1
     * @param {Object} lat2
     * @param {Object} lng2
     */
    function getGreatCircleDistance(lat1,lng1,lat2,lng2){
        var radLat1 = getRad(lat1);
        var radLat2 = getRad(lat2);
        
        var a = radLat1 - radLat2;
        var b = getRad(lng1) - getRad(lng2);
        
        var s = 2*Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) + Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
        s = s*EARTH_RADIUS;
        s = Math.round(s*10000)/10000.0;
                
        return parseInt(s);
    }
    function getFlatternDistance(lat1,lng1,lat2,lng2){
      var lat1=eval(lat1);
      var lat2=eval(lat2);
      var lng1=eval(lng1);
      var lng2=eval(lng2);

      // alert((lat1+lat2));
        var f = getRad((lat1 + lat2)/2);
        var g = getRad((lat1 - lat2)/2);
        var l = getRad((lng1 - lng2)/2);
        
        var sg = Math.sin(g);
        var sl = Math.sin(l);
        var sf = Math.sin(f);
        
        var s,c,w,r,d,h1,h2;
        var a = EARTH_RADIUS;
        var fl = 1/298.257;
        var ss = 0;
        sg = sg*sg;
        sl = sl*sl;
        sf = sf*sf;
        
        s = sg*(1-sl) + (1-sf)*sl;
        c = (1-sg)*(1-sl) + sf*sl;
        
        w = Math.atan(Math.sqrt(s/c));
        r = Math.sqrt(s*c)/w;
        d = 2*w*a;
        h1 = (3*r -1)/2/c;
        h2 = (3*r +1)/2/s;
        ss = d*(1 + fl*(h1*sf*(1-sg) - h2*(1-sf)*sg));
        // alert(ss);
        return parseInt(ss);
    }

// function sort (arr) {
//   for (var i = 0;i<arr.length;i++) {
//       for (var j = 0; j < arr.length-i-1; j++) {
//         if (arr[j]<arr[j+1]) {
//         var temp=arr[j];
//         arr[j]=arr[j+1];
//         arr[j+1]=temp;
//         }
//       }
//   }
//   return arr;
// }
function min(a){

      var min = a[0];
      var len = a.length;
      var c = '';
      for (var i = 1; i < len; i++){ 
        // alert(a[i]) ;
        if (a[i] <= min){ 
        min = a[i];
        c = i;
        }
         
      } 
      if(c == '')
      {
        c = 1;
      }
      return c;
    }  
function shopinfo(){
  
// alert(dis);
var spid = min(dis);
 // alert(spid);
     
      if(spid)
      {  

        $.cookie('shot_shop',spid);
        $.cookie('shot_distance',dis[spid]);
        if(dis[spid]>10000){
          // alert(dis[spid]);
          delCookie('shot_shop');
          delCookie('shot_distance');
          location.replace('index.html');
        }

         $.ajax({
                url: ApiUrl + "/index.php?ctl=Goods_Goods&met=getShopInfo&typ=json&shop_id="+getCookie('shot_shop'),
                type: 'get',
                dataType: 'json',
                success: function(result) {
                    var da = result.data;

                    shop_slide = da.shop_slide.split(',');
                    shop_slideurl = da.shop_slideurl.split(',');
                    if(shop_slide[0]!='')
                    {
                         for(var i=0;i<5;i++)
                         {
                          sli+='<a href="'+shop_slideurl[i]+'"/><div class="swiper-slide"><img src="'+shop_slide[i]+'"></div></a>';
                         }
                         $("#shopslid").find('.swiper-wrapper').append(sli);   

                    }
                    if(parseFloat(getCookie('shot_distance'))<1000) 
                    {
                      // alert(1);
                     var stamp=parseFloat(getCookie('shot_distance'));
                     da.shop_stamp=stamp.toFixed(2) +'m';
                    }else if(parseFloat(getCookie('shot_distance'))>=1000){

                     var stamp=parseFloat(parseFloat(getCookie('shot_distance'))/1000);
                     da.shop_stamp=stamp.toFixed(2) +'km';

                    }else{
                      location.replace('index.html');
                     da.shop_stamp=' km';

                    }         
                 $("#shopinfo").html(template.render('shop_info', da));
                  var swiper = new Swiper('.banner02', {
                  pagination: '.swiper-pagination',
                  paginationType : 'bullets',
                  // paginationType : 'fraction',
                  paginationClickable: true,
                  autoplayDisableOnInteraction: false,
                  autoplay: 1300,
                  speed: 500,
                  height : 120, 
                  grabCursor: true,
                  paginationClickable: true,
                  mousewheelControl: true,
                  lazyLoading: true,
                  // nextButton: '.swiper-button-next',
                  // prevButton: '.swiper-button-prev',
                  // pagination: '.swiper-pagination',

                });    
                 $.getJSON(ApiUrl + "/index.php?ctl=Goods_Goods&met=cur_goodslist&typ=json&shop_id="+getCookie('shot_shop'), function (t)
                     {
             
                       $("#product-contain3").html(template.render('goods3', t));
                
                     });      
                                    

              }
            });
      }

}

function distance1(ship_id){
  if(($.cookie('lat')!='')&&($.cookie('lng')!=''))
  {
      var shop_id1 = ship_id;
      // var dis = [];
      var distance = ''
        $.getJSON(ApiUrl + "/index.php?ctl=Goods_Goods&met=getShopInfo&typ=json&shop_id="+shop_id1, function (t)
             {
                      var da = t.data;
                      var shop_latitude = da.shop_latitude;
                      var shop_longitude = da.shop_longitude;
                      // alert(shop_latitude);alert(shop_longitude);
                      // var shop_latitude = 31.24916340;
                      // var shop_longitude = 121.48790048;
                      // alert(shop_latitude);
                      // distance= getGreatCircleDistance(shop_latitude,shop_longitude,$.cookie('lat'),$.cookie('lng'));
                      distance= getFlatternDistance(shop_latitude,shop_longitude,$.cookie('lat'),$.cookie('lng'));
                      // alert(distance); 
             }); 
               setTimeout(function(){

                   dis[shop_id1] = distance; 
               },400);
   }
}
$(function() {

// alert(getCookie('lat'));
// alert(getCookie('lng'));


    $.getJSON(ApiUrl + "/index.php?ctl=Goods_Goods&met=index&typ=json", function (t)
         {
              var total = t.data.totalsize;
              var shop = t.data.items;
              
               for(var i=0;i<total;i++)
              {
                
                 distance1(shop[i].shop_id);
              }

         }); 


if($.cookie('community_shopid'))
{
         $.ajax({
                url: ApiUrl + "/index.php?ctl=Goods_Goods&met=getShopInfo&typ=json&shop_id="+$.cookie('community_shopid'),
                type: 'get',
                dataType: 'json',
                success: function(result) {
                    var da = result.data;
                    var shop_longitude = da.shop_longitude;
                    var shop_latitude = da.shop_latitude;
                    var distan = '';
                    shop_slide = da.shop_slide.split(',');
                    shop_slideurl = da.shop_slideurl.split(',');
                        if(shop_slide[0]!='')
                        {
                             for(var i=0;i<5;i++)
                             {
                              sli+='<a href="'+shop_slideurl[i]+'"/><div class="swiper-slide"><img src="'+shop_slide[i]+'"></div></a>';
                             }
                             $("#shopslid").find('.swiper-wrapper').append(sli);   

                        }

                    distan= getFlatternDistance(shop_latitude,shop_longitude,$.cookie('lat'),$.cookie('lng'));
                       
                             if(parseFloat(distan)<1000)
                             {

                             da.shop_stamp=distan+'m'; 
                             }else if(parseFloat(distan)>=1000){
                               da.shop_stamp=parseFloat(distan/1000).toFixed(2)+'km'; 

                             }
                         $("#shopinfo").html(template.render('shop_info', da));   
                          
                            

                }
            });

 }else{
  console.log(dis);
  /////////////////////获取店铺最近信息///////        
     setTimeout(shopinfo,3000); 

 }         
 var key = getCookie('key');
  var unixTimeToDateString = function(ts, ex) {
        ts = parseFloat(ts) || 0;
        if (ts < 1) {
            return '';
        }
        var d = new Date();
        d.setTime(ts * 1e3);
        var s = '' + d.getFullYear() + '-' + (1 + d.getMonth()) + '-' + d.getDate();
        if (ex) {
            s += ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        }
        return s;
    };

    var buyLimitation = function(a, b) {
        a = parseInt(a) || 0;
        b = parseInt(b) || 0;
        var r = 0;
        if (a > 0) {
            r = a;
        }
        if (b > 0 && r > 0 && b < r) {
            r = b;
        }
        return r;
    };

    template.helper('isEmpty', function(o) {
        for (var i in o) {
            return false;
        }
        return true;
    });

  function contains(arr, str) {//检测goods_id是否存入
        var i = arr.length;
        while (i--) {
           if (arr[i] === str) {
               return true;
           }
        }
        return false;
    }

if(!key)
{
    delCookie('cart_count');
}else{
     // 购物车中商品数量
     if (getCookie('cart_count')) {
       if (getCookie('cart_count') > 0) {
           $('#cart_count').html('<sup>'+getCookie('cart_count')+'</sup>');
           }
       }

}

        $.getJSON(ApiUrl + "/index.php?ctl=Article_Base&met=getlist&typ=json", function (t)
             {

               // console.log(t);
                $("#announ").html(template.render('announcement', t));
        
             });


 //**********************调用商品数据****************************      
if(getCookie('community_shopid'))
{
       delCookie('shot_shop');
        $.getJSON(ApiUrl + "/index.php?ctl=Goods_Goods&met=cur_goodslist&typ=json&shop_id="+getCookie('community_shopid'), function (t)
             {
     
               $("#product-contain3").html(template.render('goods3', t));
        
             });  

}


        $.getJSON(ApiUrl + "/index.php?ctl=Goods_Goods&met=getwap_adv&typ=json", function (t)
             {	
                var data = t;
                
                if(data)
                {	
               $("#product-contain2").html(template.render('goods2', data));
               $("#product-contain1").html(template.render('goods1', data));
               $("#product-contain0").html(template.render('goods0', data));
                }
             });
//*******************加入购物车功能*********************************
// alert( 111 );
setTimeout(function(){

    $('.add2').each(function(){

    $(this).click(function(){
     // alert(1);
        var goods_id = $(this).find('input').val();
            get_detail(goods_id);
  function get_detail(goods_id) {
      //渲染页面
      $.ajax({
         url:ApiUrl+"/index.php?ctl=Goods_Goods&met=goods&typ=json",
         type:"get",
         data:{goods_id:goods_id,k:key,u:getCookie('id')},
         dataType:"json",
         success:function(result){
            var data = result.data;
             console.info(data);
            if(result.status == 200){
              //商品图片格式化数据
              if(data.goods_image){
                var goods_image = data.goods_image.split(",");
                data.goods_image = goods_image;
              }else{
                 data.goods_image = [];
              }
            if(data.goods_info)
            {
                //商品规格格式化数据
                if(data.goods_info.common_spec_name){
                    var goods_map_spec = $.map(data.goods_info.common_spec_name,function (v,i){
                        var goods_specs = {};
                        goods_specs["goods_spec_id"] = i;
                        goods_specs['goods_spec_name']=v;
                        if(data.goods_info.common_spec_value_c){
                            $.map(data.goods_info.common_spec_value_c,function(vv,vi){
                                if(i == vi){
                                    goods_specs['goods_spec_value'] = $.map(vv,function (vvv,vvi){
                                        var specs_value = {};
                                        specs_value["specs_value_id"] = vvi;
                                        specs_value["specs_value_name"] = vvv;
                                        return specs_value;
                                    });
                                }
                            });
                            return goods_specs;
                        }else{
                            data.goods_info.common_spec_value = [];
                        }
                    });
                    data.goods_map_spec = goods_map_spec;
                }else {
                    data.goods_map_spec = [];
                }

                // 虚拟商品限购时间和数量
                if (data.goods_info.common_is_virtual == '1') {
                    data.goods_info.virtual_indate_str = unixTimeToDateString(data.goods_info.virtual_indate, true);
                    data.goods_info.buyLimitation = buyLimitation(data.goods_info.virtual_limit, data.goods_info.upper_limit);
                }


                // 购物车中商品数量
                if (getCookie('cart_count')) {
                    if (getCookie('cart_count') > 0) {
                        $('#cart_count').html('<sup>'+getCookie('cart_count')+'</sup>');
                    }
                }

 
                //加入购物车
         
                    var key = getCookie('key');//登录标记
                    // var quantity = parseInt($(".buy-num").val());
                    var quantity = 1;
                    
                    if(!key){
                        var goods_info = decodeURIComponent(getCookie('goods_cart'));
                        if (goods_info == null) {
                            goods_info = '';
                        }
                        if(goods_id<1){
                            // show_tip();
                            return false;
                        }
                        if(!goods_info){
                            goods_info = goods_id+','+quantity;
                            cart_count = 1;
                        }else{
                            var goodsarr = goods_info.split('|');
                            for (var i=0; i<goodsarr.length; i++) {
                                var arr = goodsarr[i].split(',');
                                if(contains(arr,goods_id)){
                                    // show_tip();
                                    return false;
                                }
                            }
                            goods_info+='|'+goods_id+','+quantity;
                            cart_count = goodsarr.length;
                        }
                        // show_tip();
                        // 加入cookie
                        addCookie('goods_cart',goods_info);
                        alert('加入成功');
                        if(!getCookie('goods_cart_num'))
                        {
                        addCookie('goods_cart_num',cart_count);
                          
                        }else{
                        addCookie('goods_cart_num',cart_count+parseInt(getCookie('goods_cart_num')));

                        }
                        // 更新cookie中商品数量
                        addCookie('cart_count',cart_count);
                        // show_tip();
                        getCartCount();
                        $('#cart_count').html('<sup>'+cart_count+'</sup>');
                        return false;
                    }else{
                        if(data.shop_owner)
                        {
                            alert('不能购买自己的商品');
                            return;
                        }
                        if(data.isBuyHave)
                        {
                         
                                alert('您已达购买上限！');
                         
                            return;
                        }
                        $.ajax({
                            url:ApiUrl+"/index.php?ctl=Buyer_Cart&met=addCart&typ=json",
                            data:{k:key,u:getCookie('id'),goods_id:goods_id,goods_num:quantity},
                            type:"post",
                            success:function (result){
                                /*var rData = $.parseJSON(result);*/
                                if(checkLogin(result.login)){
                                    if(result.status == 200){
                                        // show_tip();
                                        // 更新购物车中商品数量
                                        delCookie('cart_count');
                                        alert('加入成功');
                                        getCartCount();
                                        if(!getCookie('goods_cart_num'))
                                        {
                                        addCookie('goods_cart_num',cart_count);
                                          
                                        }else{
                                        addCookie('goods_cart_num',cart_count+parseInt(getCookie('goods_cart_num')));

                                        }
                                        $('#cart_count').html('<sup>'+getCookie('cart_count')+'</sup>');
                                    }else{
                               
                                           alert(result.msg);
                                    }
                                }
                            }
                        })
                    }
        


            }
            else
            {
                $.sDialog({
                    content: '该商品已下架或该店铺已关闭！<br>请返回上一页继续操作…',
                    okBtn:false,
                    cancelBtnText:'  返回',
                    cancelFn: function() { history.back(); }
                });
            }


            }else {

              $.sDialog({
                  content: data.error + '！<br>请返回上一页继续操作…',
                  okBtn:false,
                  cancelBtnText:'  返回',
                  cancelFn: function() { history.back(); }
              });
            }





         }
      });
  }
  

    });        
    });

},2000)







});
$(function(){
  var src;
  var sr2;

 
  src =  $('#active1').find('img')[0].src;
  var sr = src.split('.png');
  var src1 = sr[0]+2+'.png';
  // alert(src1);
  src2 = $('#active1').find('img')[0].src=src1;

})