//スコープ気にしないもので新しくイベント処理書く時はここで.
$(function(){
    //monacaだと?ボタンアクティブ引き継いでくれないのでイベント処理で......
   $("#loclink2").on('click',function(){
       $("#loclink").attr('class','ui-btn-active ui-btn ui-btn-up-a ui-btn-inline')
   }); 
   $("#timelink").on('click',function(){
        $("#timelink2").attr('class','ui-btn-active ui-btn ui-btn-up-a ui-btn-inline');
   }); 
   $("#twilink").on('click',function(){
        $("#twilink3").attr('class','ui-btn-active twilink get ui-btn ui-btn-up-a ui-btn-inline');
   });
   $("#conflink").on('click',function(){
        $("#conflink4").attr('class','ui-btn-active twilink ui-btn ui-btn-up-a ui-btn-inline');
   });
   $("#loclink3").on('click',function(){
       $("#loclink").attr('class','ui-btn-active ui-btn ui-btn-up-a ui-btn-inline')
   }); 
   $("#timelink3").on('click',function(){
        $("#timelink2").attr('class','ui-btn-active ui-btn ui-btn-up-a ui-btn-inline');
   }); 
   $("#twilink2").on('click',function(){
        $("#twilink3").attr('class','ui-btn-active twilink get ui-btn ui-btn-up-a ui-btn-inline');
   }); 
   $("#conflink2").on('click',function(){
        $("#conflink4").attr('class','ui-btn-active twilink ui-btn ui-btn-up-a ui-btn-inline');
   });
   $("#loclink4").on('click',function(){
       $("#loclink").attr('class','ui-btn-active ui-btn ui-btn-up-a ui-btn-inline')
   }); 
   $("#timelink4").on('click',function(){
        $("#timelink2").attr('class','ui-btn-active ui-btn ui-btn-up-a ui-btn-inline');
   }); 
   $("#twilink4").on('click',function(){
        $("#twilink3").attr('class','ui-btn-active twilink get ui-btn ui-btn-up-a ui-btn-inline');
   });
   $("#conflink3").on('click',function(){
        $("#conflink4").attr('class','ui-btn-active twilink ui-btn ui-btn-up-a ui-btn-inline');
   });
   //ここまでアクティブ処理.
   //ログアウト.
   $('#logout').on('click',logout);
    function logout(){
        if(window.localStorage.getItem("acces_token")){
            window.localStorage.removeItem("acces_token");
            window.localStorage.removeItem("acces_token_secret");
            alert("ログアウトしました。");
        }
    }
    
    //設定画面のチェックボタン処理
    //GPSを使わない
    $('#nogps').on('click', function(){
        //check = $('[name=nogps]:checked').val();
        if($('[name=nogps]:checked').val() == "on"){
            window.localStorage.setItem('usegps',1);
        }else{
            window.localStorage.setItem('usegps',0);
        }
    });
    //大学をデフォルト地に
    $('#deftut').on('click', function(){
        if($('[name=deftut]:checked').val() == "on"){
            window.localStorage.setItem('nogpsloc',3);
        }else{
            window.localStorage.setItem('nogpsloc',0);
        }
    });
    //起動時フラグが立ってるならチェック表示
    if(window.localStorage.getItem('usegps') == "1"){
        $("#nogps").prop('checked',true);
    }
    if(window.localStorage.getItem('nogpsloc') == "3"){
        $("#deftut").prop('checked',true);
    }
    
    //再読み込み.
    $("#reload").on('click',Pospos);
    //$.mobile.fixedToolbars.setTouchToggleEnabled(false);
    $(document).on("mobileinit", function(){
　          $.event.special.swipe.horizontalDistanceThreshold = 1000;
    });
    
    /*スワイプ　挙動がよろしくないので保留
    //ほぼコピペ.
    //「data-role=page」というDOMを取得
    //　eachメソッドで各要素に対して関数を実行する
    $(":jqmData(role='page')").each(function() {
      //各要素に対してswipeleftイベントを追加
      $(this).bind("swipeleft", function() {
        //　ページIDから現在のページナンバーを取得そして一を足す
        var nextPage = parseInt($(this).attr("id").split("page")[1]) +1;
        //全ページが4ページなので、4よりおおきくなったら１を代入。
        if (nextPage > 4) nextPage = 1;
        switch (nextPage){
            case 1:
                $("#loclink").attr('class','ui-btn-active ui-btn ui-btn-up-a ui-btn-inline')
                break;
            case 2:
                $("#timelink2").attr('class','ui-btn-active ui-btn ui-btn-up-a ui-btn-inline');
                break;
            case 3:
                $("#twilink3").attr('class','ui-btn-active twilink get ui-btn ui-btn-up-a ui-btn-inline');
                break;
            case 4:
                $("#conflink4").attr('class','ui-btn-active twilink ui-btn ui-btn-up-a ui-btn-inline');
                break;
        }
        // ページ遷移
        $.mobile.changePage("#page"+nextPage, {
            transition : "slide"
        });
        
      });
      $(this).bind("swiperight", function() {
     
        // ページIDから現在のページナンバーを取得。そして一を引く
        var nextPage = parseInt($(this).attr("id").split("page")[1]) -1;
        if (nextPage === 0) nextPage = 4;
        switch (nextPage){
            case 1:
                $("#loclink").attr('class','ui-btn-active ui-btn ui-btn-up-a ui-btn-inline')
                break;
            case 2:
                $("#timelink2").attr('class','ui-btn-active ui-btn ui-btn-up-a ui-btn-inline');
                break;
            case 3:
                $("#twilink3").attr('class','ui-btn-active twilink get ui-btn ui-btn-up-a ui-btn-inline');
                break;
            case 4:
                $("#conflink4").attr('class','ui-btn-active twilink ui-btn ui-btn-up-a ui-btn-inline');
                break;
        }
        // ページ遷移
        $.mobile.changePage("#page"+nextPage, {
            transition : "slide",
            reverse    : true
        });
      })
    })
    */
});
