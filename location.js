// アシアル社さんのサンプルをコピペ＆編集
function Pospos(){
    console.log("im Position");
    var ido = [35.631364,35.655641,35.62571];//0:minamino,1:hachiouji,2:tut
    var keido = [139.330975,139.338968,139.34145];//0:minamino,1:hachiouji,2:tut
    var loc_lati;
    var loc_long;
    var earth_r = 6378.137;
    var latirag;
    var longrag;
    var nanboku;
    var touzai;
    var kyori;
    var tut_kyori
    var hachi_kyori
    var minami_kyori
    
    var location_id = 0;
    
    var gate = true;
    
    checkGps();
    //GPS精度確認
    function checkGps() {
        //タイマー起動(45秒後にGPS停止)
        timerID = setTimeout( function () { stopGps(); }, 45000);
        //GPS起動
        watchId = navigator.geolocation.watchPosition(onSuccessGps, onErrorGps, 
            { maximumAge: 3000, timeout: 30000, enableHighAccuracy: true });    
    }
    //GPS成功
    function onSuccessGps(p) {
        //記録終了
        navigator.geolocation.clearWatch(watchId);
        //タイマー終了
        clearTimeout(timerID);
        //誤差取得
        var acc = p.coords.accuracy;
        //測定データをコンソールに表示
        console.log("緯度:" + p.coords.latitude +
                    ",経度:" + p.coords.longitude +
                    ",誤差:" + acc);
        loc_lati = p.coords.latitude;
        loc_long = p.coords.longitude;
        
        Location();
    }
    //GPSエラー
    function onErrorGps(error) {
        //記録終了
        navigator.geolocation.clearWatch(watchId);
        //タイマー終了
        clearTimeout(timerID);
    }
    //タイムアウト処理（確認終了）
    function stopGps() {
        //記録終了
        navigator.geolocation.clearWatch(watchId);
    }
    //距離計算.
    function Location(){
        jQuery.each(ido,function(i){
            latirag = (ido[i] - loc_lati) * Math.PI / 180;
            longrag = (keido[i] - loc_long) * Math.PI / 180;
            nanboku = earth_r * latirag;
            touzai = Math.cos(loc_lati * Math.PI / 180) * earth_r * longrag;
            kyori = ~~(Math.sqrt(Math.pow(touzai,2) + Math.pow(nanboku,2)) * 1000);
            console.log(i + "距離:" + kyori);
            if(kyori < 500){
                location_id = i + 1;
            }
        });
        //何度も読み込むとバグるから１回だけ.
        if(gate){
            gate = !gate;
            console.log("locID：" + location_id);
            //次の発車時刻.
            NextTime(location_id);
        }
    }
}
/*
$aIdo = 34.701909;    				//  A点（大阪）の緯度
$aKeido = 135.4949770;		 //  A点（大阪）の経度

$bIdo = 35.681382;				//  B点（東京）の緯度
$bKeido = 139.766084;		//  B点（東京）の経度

$earth_r = 6378.137;		//	地球の半径

$idoSa = deg2rad($bIdo - $aIdo);	//緯度差をラジアンに
$keidoSa = deg2rad($bKeido - $aKeido);	//経度差をラジアンに

$nanbokuKyori =  $earth_r * $idoSa;		//南北の距離
$touzaiKyori = cos(deg2rad($aIdo)) * $earth_r * $keidoSa;		//東西の距離

$d = sqrt(pow($touzaiKyori,2) + pow( $nanbokuKyori,2));			//三平方の定理でdを求める
var rad = deg * Math.PI / 180;
*/