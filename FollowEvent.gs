var channel_access_token = PropertiesService.getScriptProperties().getProperty("CHANNEL_ACCESS_TOKEN");
var url = "https://api.line.me/v2/bot/message/reply"

function doPostTest() {
  //eの作成
 var e = {
    parameter : {
        type : "follow"
    }
 };
 doPost(e);
}

function doPost(e) {
  
  var json = e.postData.contents
  var events = JSON.parse(json).events;
  var SetFlg = 0
  
  events.forEach(function(event) {
    if(event.type == "follow") {
      //フォローイベント発生時、スプレッドシートにユーザーIDを記入
      var spredsheetIdDB = PropertiesService.getScriptProperties().getProperty("SPREDSHEET_ID");
      var spreadsheet = SpreadsheetApp.openById(spredsheetIdDB);
      var sheet = spreadsheet.getActiveSheet();
      var ALastRow = sheet.getLastRow();
      var UserID = JSON.parse(e.postData.contents).events[0].source.userId;   
      //ユーザーIDの重複調査
      //ユーザーID一覧を取得
      var ArrayUserID = sheet.getRange(1,1,ALastRow).getValues();
      Logger.log(ArrayUserID);
      for(var i=1;i<ArrayUserID.length;i++){
        if(UserID == ArrayUserID[i][0]){
          //ユーザーID重複
          SetFlg += 1
          //居住地選択メッセージ開始
          SetLocation(event)
          break
        }
      }
      if(SetFlg == 0){
        //重複無しの場合、スプレッドシートに書き込み
        sheet.getRange(ALastRow + 1, 1).setValue(UserID);
      }
      //居住地選択メッセージ開始
      SetLocation(event)
      
      
    } 
 });
}

function follow(e) {
  var message = {
    "replyToken" : e.replyToken,
    "messages" : [{
        "type": "text",
        "text" : "フォローありがとう！"
      },{
        "type": "sticker",
        "packageId": "11539",
        "stickerId": "52114131"
      }]};
  var options = {
    "method" : "post",
    "headers" : {
      "Content-Type" : "application/json",
      "Authorization" : "Bearer " + channel_access_token
    },
    "payload" : JSON.stringify(message)
  };
  UrlFetchApp.fetch(url, options);
}

//テスト用で追加 Start
function SetLocation(e) {
  //var posted_json = JSON.parse(e.postData.contents);
  //var events = posted_json.events;
  
   //送られたLINEメッセージを取得
  //var json = JSON.parse(e.postData.contents);
  //var user_message = json.events[0].message.text; 
  //var receive_message_type = json.events[0].message.type;
  
  var postData = {
        "replyToken" :e.replyToken,
        "messages":[
          {
                     "type": "template",
                     "altText": "ボタンテンプレートメッセージ",
            "template": {
                       "type": "buttons",
                       "title": "質問文",
                       "text": "以下より選択してください。",
              "defaultAction": {
                         "type": "uri",
                         "label": "View detail",
                         "uri": "https://arukayies.com/"
              },
                       "actions": [
                         {
                           //"type": "uri",
                           "type": "postback",
                           "label": "TOPを開く",
                           //"uri": "https://arukayies.com/"
                           "data": "{\"action\":\"detail\",\"id\":123456}"
                         },
                         {
                           "type": "postback",
                           "label": "記事を開く",
                           "data": "{\"action\":\"detail\",\"id\":123456}"
                         }
                       ]
            }
          }
        ]
  };
      
      
  var options = {
        "method" : "post",
    "headers" : {
          "Content-Type" : "application/json",
          "Authorization" : "Bearer " + channel_access_token
    },
        "payload" : JSON.stringify(postData)
  };
  //var reply = UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply", options);
  UrlFetchApp.fetch(url, options);
}
//テスト用で追加 End



