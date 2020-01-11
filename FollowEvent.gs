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
    //テスト用で追加 あとで消す Start
    
     //PostBackイベント(質問ボタン押下時の処理)
    if(event.type === 'postback'){
      var data = JSON.parse(json).events[0].postback.data;
      
      if(data.match("000001")){
        test(event)
      }
    }
    
    //if(event.type == "message"){
    //  SetLocation(event)
    //}
    //テスト用で追加 End
    
 });
}

function SetLocation(e) {
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
                       "actions": [
                         {
                           "type": "postback",
                           "label": "TOPを開く",
                           "text": "postback1",
                           "data": "000001"
                         },
                         {
                           "type": "postback",
                           "label": "記事を開く",
                           "text": "postback2",
                           "data": "000002"
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
  UrlFetchApp.fetch(url, options);
}



function test(e) {
  var postData = {
        "replyToken" :e.replyToken,
        "messages":[
          {
                     "type": "template",
                     "altText": "ボタンテンプレートメッセージ",
            "template": {
                       "type": "buttons",
                       "title": "test",
                       "text": "testです",
                       "actions": [
                         {
                           "type": "postback",
                           "label": "TOPを開く",
                           "text": "postback1",
                           "data": "000001"
                         },
                         {
                           "type": "postback",
                           "label": "記事を開く",
                           "text": "postback2",
                           "data": "000002"
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
  UrlFetchApp.fetch(url, options);
}



