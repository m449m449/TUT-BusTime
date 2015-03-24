//angular.module('myApp', ['onsen.directives']);
// forked from _note109's "twitter API 1.1" http://jsdo.it/_note109/9VMj
/**
 * Twitterオブジェクト
 */
function Twitter() {}
Twitter.prototype = {
        consumerKey:    "*************************",
        consumerSecret: "**************************************************",
        accessToken:    window.localStorage.getItem("acces_token"),
        tokenSecret:    window.localStorage.getItem("acces_token_secret")
};
var count = 10; // 表示する件数

// Twitter APIを使用してTweetを取得する部分
// function getTwitter(action, options) {
Twitter.prototype.get =function(api, keywords) {

    var accessor = {
        consumerSecret: this.consumerSecret,
        tokenSecret: this.tokenSecret
    };

    // 送信するパラメータを連想配列で作成
    var message = {
        method: "GET", // リクエストの種類
        action: api,
        parameters: {
            oauth_version: "1.0",
            oauth_signature_method: "HMAC-SHA1",
            oauth_consumer_key: this.consumerKey, // コンシューマーキー
            oauth_token: this.accessToken, // アクセストークン
            count: count, // 取得する件数
            "q": keywords, // 検索するキーワード
            "lang": "ja", // 日本語に設定
            "result_type": "recent", // 最新の情報を取得するように設定
            callback: "update" // 取得したデータをupdate関数に渡すよう設定
        }
    };
    // OAuth認証関係
    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);
    var url = OAuth.addToURL(message.action, message.parameters);
    var options = {
        type: message.method,
        url: url, // リクエスト先のURL
        dataType: "jsonp",
        jsonp: false,
        cache: true,
    };
    // ajaxによる通信
    $.ajax(options)
    .done(function(){})
    .fail(function(XMLHttpRequest, textStatus, errorThrown){
        if(XMLHttpRequest.status != 200){
            console.log("XMLHttpRequest:" + XMLHttpRequest.status);
            alert("status:" + XMLHttpRequest.status);
        }
    });
}

// UIの更新
function update(data){ // 引数(data)に取得したデータが入ってくる
    var result = data.statuses; // 取得したデータから、メソッドチェーンで必要なものを取得
    var hashtags;
    var html = "";
    //console.log("result.length:" + result.length);
    //取得したツイート処理
    for( var i = 0; i < result.length; i++ ) {
        var name = result[i].user.name; // ツイートした人の名前
        var imgsrc = result[i].user.profile_image_url; // ツイートした人のプロフィール画像
        var content = result[i].text; // ツイートの内容
        var updated = result[i].created_at; // ツイートした時間
        // 日時データを要素分解
        var created_at = result[i]['created_at'].split(" ");
        // 投稿日時変換 "Mon Dec 01 14:24:26 +0000 2008" -> "Dec 01, 2008 14:24:26"
        var post_date  = created_at[1] + " "
                       + created_at[2] + ", "
                       + created_at[5] + " "
                       + created_at[3];
        // 日時データ処理
        var date = new Date(post_date);     // 日付文字列 -> オブジェクト変換
        date.setHours(date.getHours() + 9); // UTC -> JST (+9時間)
        var yea = date.getFullYear();       //年
        var mon  = date.getMonth() + 1;     // 月取得
        var day  = date.getDate();          // 日取得
        var hou  = date.getHours();         //時
        var min  = date.getMinutes();       //分
        var now  = new Date();              //今現在の年月日、時間
        var nyea = now.getFullYear();
        var nmon = now.getMonth() + 1;
        var nday = now.getDate();
        var nhou = now.getHours();
        var nmin = now.getMinutes();
        var time = "";
        //1時間以内に投稿されたのなら何分前に投稿されたか計算
        if(yea == nyea){
            if(mon == nmon){
                if(day == nday){
                    if(hou == nhou){
                        time = nmin - min;
                        if(time == ""){
                            time = "0";
                        }
                    }else if(hou + 1 == nhou){
                        time = (nmin + 60) - min;
                        if(time >= 60){
                            time = "";
                        }
                    }
                }
            }
        }
        //最初の1回はどのハッシュタグか判別、各テーブルナンバーへ割り振り
        if(i == 0){
            if(content.search("H") != -1){
                num = 0;
            }else if(content.search("M") != -1){
                num = 1;
            }else{
                num = 2;
            }
            //console.log("new:" + yea + "年" + mon + "月" + day + "日" + hou + "時" + min + "分");
            //console.log("now:" + nyea + "年" + nmon + "月" + nday + "日" + nhou + "時" + nmin + "分");
        }
        if(time == ""){
            updated = mon + "月" + day + "日";
        }else{
            updated = time + "分前";
        }
        // Tweet表示エリアに取得したデータを追加していく
        html += '<tr><td><img src="'+imgsrc+'" /></td><td>' + name + '<br>' + content + '<br>' + updated + '</td></tr>';
        
        //$("#test").append('<p><table><tbody><tr><td><img src="'+imgsrc+'" /></td><td>' + name + '<br>' + content + '<br>' + updated + '</td></tr></tbody></table></p>');
    }
    html = '<p><table class="clear"><tbody>' + html + '</tbody></table></p>';
    if($(tag_id[num])){
       var doc = $(tag_id[num]);
        doc.html(html);
    }
}

/**
 * API を取得して使う
 * @param {string} API の URL
 * @param {content} 渡すデータ
 */
Twitter.prototype.post = function(api, content, callback) {
    var accessor = {
        consumerSecret: this.consumerSecret,
        tokenSecret: window.localStorage.getItem("acces_token_secret")
    };

    var message = {
        method: "POST",
        action: api,
        parameters: {
            oauth_version: "1.0",
            oauth_signature_method: "HMAC-SHA1",
            oauth_consumer_key: this.consumerKey,
            oauth_token: window.localStorage.getItem("acces_token")
        }
    };

    for (var key in content) {
        message.parameters[key] = content[key];
    }

    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);
    var target = OAuth.addToURL(message.action, message.parameters);
 
    var options = {
        type: message.method,
        url: target,
        dataType: "json",
        success: function(d, dt) {
            //callback(d, dt);
            alert("ツイートしました。");
        }
    };

    $.ajax(options)
    .fail(function(data){
        alert("送信に失敗しました。");
    });
    //alert("ツイートしました。");
};

var twitter = new Twitter();

var bustl = ["%23tut_busH", "%23tut_busM", "%23tut_busG"];
var ubustl = ["%23tut_busUH", "%23tut_busUM", "%23tut_busUG"];
var tag_id = ["#hachiTL", "#minaTL", "#ryoTL"];
var num;
//GETfunction
function Get_Ctrl(){
    twitter = new Twitter();
    var url = "https://api.twitter.com/1.1/search/tweets.json";
    if(location_id == 3){
        for(var key in ubustl){
            // Tweet検索関数の呼び出し
            twitter.get(url, ubustl[key]);
        }
    }else{
        for(var key in bustl){
            // Tweet検索関数の呼び出し
            twitter.get(url, bustl[key]);
        }
    }
}
//POSTfanction
var tweet = function (radio) {
    twitter = new Twitter();
    var head = "";
    var hush = "";
    bus = window.localStorage.getItem("bus_stop");
    switch (location_id){
        case 0:
            switch (bus){
                case "1":
                        head = "みなみ野発：";
                        hush = " #tut_busM";
                    break;
                case "2":
                        head ="八王子発：";
                        hush = " #tut_busH";
                    break;
                case "3":
                        head = "学生会館発："
                        hush = " #tut_busG";
                    break;
            }
            break;
        case 1:
            switch (bus){
                case "1":
                        head = "みなみ野発：";
                        hush = " #tut_busM";
                    break;
                case "2":
                        head = "みなみ野発：";
                        hush = " #tut_busM";
                    break;
                case "3":
                        head = "学生会館発："
                        hush = " #tut_busG";
                    break;
            }
            break;
        case 2:
            head ="八王子発：";
            hush = " #tut_busH";
            break;
        case 3:
            switch (bus){
                case "1":
                        head = "みなみ野行き：";
                        hush = " #tut_busUM";
                    break;
                case "2":
                        head = "八王子行き：";
                        hush = " #tut_busUH";
                    break;
                case "3":
                        head = "学生会館行き：";
                        hush = " #tut_busUG";
                    break;
            }
            break;
    }
    var content = {
        status: head + radio + hush
    };
    if(head == ""){
        alert("現在地が不明又は不正です。");
    }else{
        twitter.post("https://api.twitter.com/1.1/statuses/update.json", content);
    }
};

$(function(){ 
   $("#send").on('click',function(){
       var radio = $('[name=tweet]:checked').val();
       if(typeof radio != "undefined"){
            if(window.localStorage.getItem("acces_token")){
                tweet(radio);
            }else{
               connect();
            }
        }else{
            alert("混雑状況が未選択です。");
        }
   });
   $(".get").on('click',function(){
      Get_Ctrl(); 
   });
});