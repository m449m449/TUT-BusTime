function NextTime(location_id){
    var radio = window.localStorage.getItem("bus_stop");
    var m;//テーブルの添字.みなみ野:0,八王子南口:1,学生会館:2.
    var j;//セルの添字.大学発:0,各バス停発着:1,大学着:2.
    var day;//0:日1:月2:火3:水4:木5:金6:土.
    var date;//日時データ
    var hours;//時
    var minutes;//分
    var timenow;
    var after5m;
    var genzaichi = null;
    
    Format();//初期値.
    
    if(location_id == 0){
        $.mobile.changePage("#timetable");
    }
    
    var timesearch;
	var shuttle = "シャトル運行";
    var shuttle3 = "～";
	var shuttle5 = "⇔";
    var bus_stop = [];
    $("table").each(function(key){
        bus_stop[key] = $("table")[key].rows;
    })
    
	var result = null;
    var str = null;
    var neartable = null;
    
    TimeSearch();//次の発車時刻を求める.
    WriteHTML();//HTMLに書き込む.
    
    //divだと反応が悪いのでボタンで.
    //バス停選択のラジオボタン.
    $('#hachiouji').on('click', TopRadio);
    $('#minamino').on('click', TopRadio);
    $('#ryo').on('click', TopRadio);
    //バス停選択のラジオボタン.
    function TopRadio(){
        radio = $('[name=usebus]:checked').val();
        window.localStorage.setItem("bus_stop",radio);
        Format();
        TimeSearch();
        WriteHTML();
    }
    
    
    
///////////////////////////////////////////////////////////////////////////    
    //初期値
    function Format(){
        if(radio == null){
            radio = 1;
        }else{
            switch (radio){
                case "1" :
                    $("#minamino").attr('checked',true).checkboxradio("refresh");
                    break;
                case "2" :
                    $("#hachiouji").attr('checked',true).checkboxradio("refresh");
                    break;
                case "3" :
                    $("#ryo").attr('checked',true).checkboxradio("refresh");
                    break;
            }
        }
        m = 1;//テーブルの添字.みなみ野:1,八王子南口:2,学生会館:3.
        j = 1;//セルの添字.大学発:0,各バス停発着:1,大学着:2.
        switch (location_id){
            //指定地以外.
            case 0:
                genzaichi = "バス停以外のどこか";
                m = radio;
                break;
            //みなみ野.
            case 1:
                genzaichi = "八王子みなみ野駅付近";
                m = 2;
                j = 1;
                break;
            //八王子.
            case 2:
                genzaichi = "八王子野駅付近";
                //寮をよく利用する場合.
                if(radio == 2){
                    m = radio
                }else{
                    m = 1;
                }
                j = 1;
                break;
            //学校.
            case 3:
                genzaichi = "東京工科大学付近";
                m = radio;
                j  = 0;
                break;
        }
        console.log("現在地：" + genzaichi);
        
        date = new Date();
        day = date.getDay();//0:日1:月2:火3:水4:木5:金6:土.
        hours = date.getHours();
        minutes = date.getMinutes();
        a5minutes = date.getMinutes();
        a5minutes += 5;
        //時・分が1桁の場合頭に0をつける.
        if(hours.toString().length == 1){
            hours = "0" + hours;
        }
        if(minutes.toString().length == 1){
            minutes = "0" + minutes;
        }
        if(a5minutes.toString().length == 1){
            a5minutes = "0" + a5minutes;
        }
        
        timenow = hours + ":" + minutes;
        after5m = hours + ":" + a5minutes; 
    }
    
/////////////////////////////////////////////////////////////////////////////////////    
    //次の発車時刻の走査.
    function TimeSearch(){
        //timenow = "21:10";//debug用.
        //after5m = "21:15";//
        //day = 0;//
        result = null;
        neartable = null;
        //テーブルが存在してなおかつ日曜でないなら.
        console.log("曜日" + day)
        if(bus_stop[m] && day != 0){
            jQuery.each(bus_stop[m],function(i){
        	if(i != 0){
                //テーブル終わり際用の配列
                var search_i = [1,2,3];
                var search_j = [1,2,3];
                //比較対象
    			var timesearch = bus_stop[m][i].cells[j].innerHTML;
                //hourが一桁だと比較がしにくいから頭に0をつける
                if(timesearch.toString().length == 4){
                    timesearch ="0" + timesearch;
                }
                //シャトルバス終わり際用に次の行の時間を取っとく
                var nextrow;
                if(bus_stop[m][i+1]){
                    nextrow = bus_stop[m][i+1].cells[j].innerHTML;
                    if(nextrow.toString().length == 4){
                        nextrow = "0" + nextrow;
                    }
                }
                //console.log("timenow：" + timenow + "；timesearch：" + timesearch);
                //現在時刻と比較.
    			if(timenow < timesearch){
                    //シャトル運行中か判定.
    				if(timesearch == shuttle3 || timesearch == shuttle5){
    					if(timenow < nextrow){
                            //シャトル終わり際の時間.
                            //console.log("after5m：" + after5m + "：nextrow：" + nextrow);
                            if(after5m < nextrow){
                                result = shuttle;
                                str = "現在は" + result + "です。";
            					return false;
                            }else{
        						result = bus_stop[m][i+1].cells[j].innerHTML;
                                str = "次の発車時刻は"+ result + "です。";
                                var departure = [bus_stop[m][i+1].cells[j].innerHTML,bus_stop[m][i+2].cells[j].innerHTML,bus_stop[m][i+3].cells[j].innerHTML];
                                var arriving = [bus_stop[m][i+1].cells[j+1].innerHTML,bus_stop[m][i+2].cells[j+1].innerHTML,bus_stop[m][i+3].cells[j+1].innerHTML];
                                neartable = '<table id="addtable"><tbody><tr><th style="text-align: center">発</th><th style="text-align: center">着</th></tr><tr><td style="text-align: center">' + departure[0] + '</td><td style="text-align: center">' + arriving[0] + '</td></tr><tr><td style="text-align: center">' + departure[1] + '</td><td style="text-align: center">' + arriving[1] + '</td></tr><tr><td style="text-align: center">' + departure[2] + '</td><td style="text-align: center">' + arriving[2] + '</td></tr></tbody></table>';
        				        return false; 
                            }
    					}
    				}else{
    					result = timesearch;
                        str = "次の発車時刻は"+ result + "です。";
                        jQuery.each(search_i,function(k){
                            if(!bus_stop[m][i+k]){
                                search_i[k] = "-";
                                search_j[k] = "-";
                            }else{
                                search_i[k] = bus_stop[m][i+k].cells[j].innerHTML;
                                search_j[k] = bus_stop[m][i+k].cells[j+1].innerHTML;
                            }
                        });
    					var departure = [search_i[0], search_i[1], search_i[2]];
                        var arriving = [search_j[0], search_j[1], search_j[2]];
                        neartable = '<table id="addtable"><tbody><tr><th style="text-align: center">発</th><th style="text-align: center">着</th></tr><tr><td style="text-align: center">' + departure[0] + '</td><td style="text-align: center">' + arriving[0] + '</td></tr><tr><td style="text-align: center">' + departure[1] + '</td><td style="text-align: center">' + arriving[1] + '</td></tr><tr><td style="text-align: center">' + departure[2] + '</td><td style="text-align: center">' + arriving[2] + '</td></tr></tbody></table>';
            			return false; 
    				}
    			}
    		}
    	});
        }
    	
        //タイムテーブルにひっかからなければ最終バス以後の時間.
    	if(result === null){
    		result = "本日の運行は終了しました。";
            str = result;
    	}
    }
/////////////////////////////////////////////////////////////////////////////////////////////////
    //HTMLへの書き込み.
    function WriteHTML(){
        var $next = $("#next");
        /*
        if($("#addtime")){
            $("#addtime").remove();
        }
        if($("#genzaichi")){
            $("#genzaichi").remove();
        }
        */
        //str = '<div id="addtime">' + str + '</div>';
        //genzaichi = '<div id="genzaichi">現在地：' + genzaichi + '</div>';
        genzaichi = '現在地：' + genzaichi;
        //var timehtml = $.parseHTML(str);
        //var genzaihtml = $.parseHTML(genzaichi);
        $("#genzaichi").text(genzaichi);
        $("#addtime").text(str);
        if($("#addtable")){
            $("#addtable").remove();
        }
        if(neartable != null){
            var $ntable = $("#neartable");
            var tablehtml = $.parseHTML(neartable);
            $ntable.append(tablehtml);
        }
    }
////////////////////////////////////////////////////////////////////////////////////////////
}
