var today;
var start;
var end;
$(function(){
    var alldate = new Date();
    var year = alldate.getFullYear() * 10000;//年
    var month = (alldate.getMonth() + 1) * 100;//月
    var date = alldate.getDate();//日
    var day = alldate.getDay();//0:日1:月2:火3:水4:木5:金6:土.
    today = year + month + date;//今日の年月日
    var past;//前回起動日
    var past = window.localStorage.getItem("date");
    var url = [0,1,2]//平日,土曜,臨時.
    //url[0] = "http://www.teu.ac.jp/campus/access/2014_kihon-a_bus.html";
    //url[1] = "http://www.teu.ac.jp/campus/access/2014_kihon-b_bus.html";
    var $table = [];//urlに対応.
    var table_key = ["weekday_table" , "saturday_table" , "temporary_table"];//key名
    var $html = $("#time");
    var MC = monaca.cloud;//Monacaバッグエンド
    var collection = MC.Collection("******");//コレクション名
    var id = "*********-****-****-****-************";//コレクションid
    var t_radio;//各時刻表テーブルのラジオボタン
    var xday = 15;//更新日
    var long_va = 0;//長期休暇プロパティ
    var long_vacation = 0;//長期休暇フラグ
    getBackEnd()
    //更新.
    /*
    collection.find(MC.Criteria("_id==?", [id]))
    .done(function(items)
    {
        items.items[0].start = 20140802;
        items.items[0].end = 20140803;
        items.items[0].temporary_url = "http://www.teu.ac.jp/campus/access/2014_0802_03_09_10_19_23_24_30_31_bus.html";
        //items.items[0].weekday = null;
        //items.items[0].saturday = null;
        items.items[0].update()
        .done(function(updatedItem)
        {
          console.log('Updating is success!');
        })
        .fail(function(err){ console.error(JSON.stringify(err)); });
    })
    .fail(function(err){
      console.error(JSON.stringify(err));
    });
    //*/
    //Monacaバックエンドで手動追加はなぜか読み取ってくれない？のでコードで追加.(デバッグ用)
    /*
    collection.insert({ "start": 20140601,
    "end": 20140614,
    "weekday_url": "http://www.teu.ac.jp/campus/access/2014_kihon-a_bus.html",
    "saturday_url": "http://www.teu.ac.jp/campus/access/2014_kihon-b_bus.html",
    "temporary_url": "http://",
    "empty_el":null
    })
  .done(function(insertedItem)
  {
    console.log('Insert is success!');
  })
  .fail(function(err){
    if (err.code == -32602) {
      alert("Collection 'Memo' not found! Please create collection from IDE.");
    } else {
      console.error(JSON.stringify(err));
      alert('Insert failed!');
    }
  });
  */
  /*バックエンドから臨時運行期間、各URL、更新日、長期休暇プロパティの受取り*/
    function getBackEnd(){
        collection.find(MC.Criteria("_id==?", [id]))
        .done(function(items)
        {
            var list = items.items;
            //items.items[0].delete();消すとき用.
            //console.log("list.length: " + list.length);
            for(var i in list){
                var prp = list[i];
                start = prp.start;
                end =  prp.end;
                url[0] =  prp.weekday_url;
                url[1] =  prp.saturday_url;
                url[2] =  prp.temporary_url;
                xday = prp.xday;
                long_va = prp.long_va;
            }
            console.log("find succes");
            First();
        })
        .fail(function(err){
            console.log(JSON.stringify(err));
            alert(JSON.stringify(err)); 
        });
    }
  
    function First(){
        //today = 20140808;//debug用
        //past = 20140720;
        window.localStorage.setItem("date",today);//最終起動日を記録.
        console.log("past:" + past);
        //初回起動時
        if(!past){
            past = today;
            Loading();
            //BackEndUp();
        }else{
            /*
            if(today <= end){//臨時スケジュール
                if(window.localStorage.getItem("read") != "false"){
                    window.localStorage.setItem("read","false");//1度臨時を読み込んだかどうか
                    Loading();
                }else{
                    WriteTable();
                }
            }else{
                window.localStorage.setItem("read","true");
                */
                 //毎月指定日にスケジュール更新.
                if(today > past){
                    //前回の起動日が先月の更新指定日以前かどうか.
                    if(year + (month + xday) > ~~(past/100)){
                        Loading();
                        //BackEndUp();
                    //今月の指定日を跨いでるか.
                    }else if(date >= xday && past - (year + month) < xday){
                        Loading();
                        //BackEndUp();
                    }else{
                        WriteTable();
                    }
                }else{
                    WriteTable();
                }
                
        }
    }

    
    //時刻表を取得.
    function Loading(){
        window.localStorage.setItem("long_vacation",long_va);
        console.log("Load");
        jQuery.each(url,function(i){
            if(url[i]){
                $.ajax(url[i] , {
                    type: 'GET',
                    dataType: 'html',
                }).done(function(data) {
                    //alert('タイムテーブルを取得しました');
                    //土曜や臨時はテーブル1つごとにdiv使ってるので一度ダミーページに書き込む.
                    if($(data).find('.detailBox01Alter').html()){
                        console.log("i" + i);
                        $("#emp").html($(data).find('.detailBox01Alter'));
                    }else if($(data).find('.commonDetailBox01').html()){
                         $("#emp").html($(data).find('.commonDetailBox01'));
                    }
                    if(i == 0){
                        if($(".commonDetailBox01").html()){
                            $(".commonDetailBox01").before($(data).find('h3')[0]);
                            $(".commonDetailBox01").before('<a href="#minamino" data-ajax="false"><span class="a">八王子みなみ野駅行</span></a><br><a href="#minamiguti" data-ajax="false"><span class="a">八王子駅南口行</span></a>');
                        }else if( $(".detailBox01Alter").html()){
                            $(".detailBox01Alter").before($(data).find('h3')[0]);
                            $(".detailBox01Alter").before('<a href="#schedule01" data-ajax="false"><span class="a">八王子みなみ野駅行</span></a><br><a href="#schedule02" data-ajax="false"><span class="a">八王子駅南口行</span></a><br><a href="#schedule03" data-ajax="false"><span class="a">学生会館行</span></a>');
                        }
                    }else if(i == 1){                       
                        if($(".commonDetailBox01").html()){
                            $(".commonDetailBox01").before($(data).find('h3')[0]);
                            $(".commonDetailBox01").before('<a href="#minamino" data-ajax="false"><span class="a">八王子みなみ野駅行</span></a><br><a href="#minamiguti" data-ajax="false"><span class="a">八王子駅南口行</span></a>');
                        }else if( $(".detailBox01Alter").html()){
                            $(".detailBox01Alter").before($(data).find('h3')[0]);
                            $(".detailBox01Alter").before('<a href="#schedule01" data-ajax="false"><span class="a">八王子みなみ野駅行</span></a><br><a href="#schedule02" data-ajax="false"><span class="a">八王子駅南口行</span></a>');
                        }
                    }else{
                        if($(".commonDetailBox01").html()){
                            $(".commonDetailBox01").before($(data).find('h3')[0]);
                            $(".commonDetailBox01").before('<a href="#minamino" data-ajax="false"><span class="a">八王子みなみ野駅行</span></a><br><a href="#minamiguti" data-ajax="false"><span class="a">八王子駅南口行</span></a>');
                        }else if( $(".detailBox01Alter").html()){
                            $(".detailBox01Alter").before($(data).find('h3')[0]);
                            $(".detailBox01Alter").before('<a href="#schedule01" data-ajax="false"><span class="a">八王子みなみ野駅行</span></a><br><a href="#schedule02" data-ajax="false"><span class="a">八王子駅南口行</span></a>');
                        }
                        
                    }
                    $('#busScheduleList').remove();
                    $table[i] = $("#emp").html();
                    window.localStorage.setItem(table_key[i],$table[i]);
                    if(i == url.length - 1){
                        console.log(url.length -1);
                        WriteTable();
                    }
                }).fail(function() {
                    alert('アクセス失敗.');
                });
            }else{
                window.localStorage.setItem(table_key[i],"");
                WriteTable();
            }
        });
    }
    /*
    //バックエンドにアップ.(OnsenUIverはこいつにアップしてもらったものを使う)
    function BackEndUp(){
        collection.find(MC.Criteria("_id==?", [id]))
        .done(function(items)
        {
            items.items[0].wtable = window.localStorage.getItem("weekday_table");
            items.items[0].stable = window.localStorage.getItem("saturday_table");
            items.items[0].ttable = window.localStorage.getItem("temporary_table");
            //items.items[0].ttable = "現在臨時スケジュールはありません。"
            items.items[0].update()
            .done(function(updatedItem)
            {
              console.log('Updating is success!');
            })
            .fail(function(err){ console.error(JSON.stringify(err)); });
        })
        .fail(function(err){
          console.error(JSON.stringify(err));
        });
    }
    */
    //時刻表をHTMLに書き込む.
    function WriteTable(){
        //day = 0;//デバッグ用.
        console.log(long_vacation);
        long_vacation = window.localStorage.getItem("long_vacation");
        if(start <= today && today <= end && long_vacation == "0"){//臨時スケジュール
            $('#temporary').attr('checked',true);
            $html.html(window.localStorage.getItem("temporary_table"));
        }else if(day == 6){//土曜
            $('#saturday').attr('checked',true);
            $html.html(window.localStorage.getItem("saturday_table"));
        }else{
            $('#weekday').attr('checked',true);
            $html.html(window.localStorage.getItem("weekday_table"));
        }
        Pospos();
    }
    //時刻表のラジオボタン.
    $('#weekday').on('click', TableRadio);
    $('#saturday').on('click', TableRadio);
    $('#temporary').on('click', TableRadio);
    function TableRadio(){
        t_radio = $('[name=table_button]:checked').val();
        switch (t_radio){
            case "0" :
                $html.html(window.localStorage.getItem("weekday_table"));
                break;
            case "1" :
                $html.html(window.localStorage.getItem("saturday_table"));
                break;
            case "2" :
                $html.html(window.localStorage.getItem("temporary_table"));
                break;
        }
    }
});