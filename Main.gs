
//諸々の設定
var channel_access_token = PropertiesService.getScriptProperties().getProperty("CHANNEL_ACCESS_TOKEN");
var user_id = PropertiesService.getScriptProperties().getProperty("MY_USER_ID"); //自分のUSER_ID
var line_url = 'https://api.line.me/v2/bot/message/push'
var openweathermap_url = 'http://api.openweathermap.org/data/2.5/forecast?id=1850147' //idで東京を指定
var openweathermap_appid = PropertiesService.getScriptProperties().getProperty("OPENWEATHEE_APIKEY");
var text
var text_jp = []
var rain_flg = 0
var final_text

// その日の06時20分にトリガーを設定
function setTrigger() {
  var triggerDay = new Date();
  triggerDay.setHours(06);
  triggerDay.setMinutes(20);
  ScriptApp.newTrigger("weatherforecast").timeBased().at(triggerDay).create();
}

// その日のトリガーを削除する関数(消さないと残る)
function deleteTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  for(var i=0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() == "weatherforecast") {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
}

//毎日AM6:20に以下のメソッドを起動
function weatherforecast() {
  //openweathermapから東京の天気予報を取得
  var weatherforecast_finalurl = openweathermap_url + '&APPID=' + openweathermap_appid
  var response = UrlFetchApp.fetch(weatherforecast_finalurl)
  var json = [JSON.parse(response.getContentText())]
  Logger.log(json[0]) //意図した場所の天気が取得できているか確認

  //天気情報を日本語に変換
  //18時と21時の天気だけ取得できればいい
  // i = 0にすると1日を通した天気が取得できる
  for (var i = 3; i <= 4; i++) {
    text = JSON.stringify((json[0].list[3 + i].weather[0].icon))
    Logger.log(json[0].list[3 + i]) //意図した時間の天気が取得できているか確認
    start_weatherforecast(text)
    text_jp[i] = text
  }
  //天気情報をline送信用に編集する
  text_edit()
  //lineへ送信する
  weatherforecast_to_line(channel_access_token,user_id,final_text);
}

//天気情報を日本語に変換
function start_weatherforecast(weather) {
  //雨の場合のみフラグ反映
  if (weather == '"01n"' || weather == '"01d"'){
    text = '快晴'
  }
  if (weather == '"02n"' || weather == '"02d"'){
    text = '晴れ'
  }
  if (weather == '"03n"' || weather == '"03d"'){
    text = '曇り'
  }
  if (weather == '"04n"' || weather == '"04d"'){
    text = '曇り'
  }
  if (weather == '"09n"' || weather == '"09d"'){
    text = '小雨'
    rain_flg += 1 //雨判定
  }
  if (weather == '"10n"' || weather == '"10d"'){
    text = '雨'
    rain_flg += 1 //雨判定
  }
  if (weather == '"11n"' || weather == '"11d"'){
    text = '雷雨'
    rain_flg += 1 //雨判定
  }
  if (weather == '"13n"' || weather == '"13d"'){
    text = '雪'
    rain_flg += 1 //雨判定
  }
  if (weather == '"50n"' || weather == '"50d"'){
    text = '霧'
  }
}

function text_edit() {
  final_text = '傘持っていくといいかも。\n' + '\n18:00  '
              + text_jp[3]+ '\n21:00  ' + text_jp[4]
}

//LINEへ送信
function weatherforecast_to_line(channel_access_token,user_id,text){
  if(rain_flg >= 1){
    //LINEに取得結果を送る
    UrlFetchApp.fetch(line_url,{
      'headers': {
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer ' + channel_access_token,
      },
      'method': 'post',
      'payload': JSON.stringify({
        'to': user_id,
        'messages' : [
          {
            'type':'text',
            'text':final_text,
          }
        ]
      })
    });
  }
}
