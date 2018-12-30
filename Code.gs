var sheet = SpreadsheetApp.getActive().getActiveSheet();

function listEventResults(){
  
  var teamKey = "frc"
  
  for(var currentRow = 2; currentRow < 126; currentRow++){
    
    teamKey = "frc" + sheet.getRange("A" + currentRow).getValue();
    
    var currentCol = 6;
    
    var matchWins = 0, matchLosses = 0, matchTies = 0;
    
    var url = "https://www.thebluealliance.com/api/v3/team/" + teamKey + "/events/2018/statuses";
    var options = {
      "method": "GET",
      "headers": {
        "X-TBA-Auth-Key": "ElyWdtB6HR7EiwdDXFmX2PDXQans0OMq83cdBcOhwri2TTXdMeYflYARvlbDxYe6"
      },
      "payload": {
      }
    };
    var response = JSON.parse(UrlFetchApp.fetch(url, options));
    
    for (var eventKey in response){
      var event = response[eventKey];
      if(event != null){
        
//        statusStr = event.overall_status_str;
//        statusStr = statusStr.replace(/<b>/g, "");
//        statusStr = statusStr.replace(/<\/b>/g, "");
//        Logger.log(statusStr);
        
        var eventWeek = getWeekCompeted(eventKey);
        if(eventWeek != -1){
          var eventStr = eventKey + " (" + eventWeek + ")";
          if(event.qual != null || event.playoff != null){
            if(event.qual != null){
              var rank = event.qual.ranking.rank;
              var qualRecord = event.qual.ranking.record.wins + "-" + event.qual.ranking.record.losses + "-" + event.qual.ranking.record.ties;
              matchWins += event.qual.ranking.record.wins;
              matchLosses += event.qual.ranking.record.losses;
              matchTies += event.qual.ranking.record.ties;
            } else {
              var rank = "--";
              var qualRecord = "--";
            }
            var allianceStatusStr = event.alliance_status_str.replace(/<b>/g, "").replace(/<\/b>/g, "");
            if(event.playoff != null){
              var playoffRecord = event.playoff.record.wins + "-" + event.playoff.record.losses + "-" + event.playoff.record.ties;
              matchWins += event.playoff.record.wins;
              matchLosses += event.playoff.record.losses;
              matchTies += event.playoff.record.ties;
              var result = event.playoff_status_str;
              if(result.indexOf("Won") != -1)
                result = "W";
              else if(result.indexOf("Finals") != -1)
                result = "F";
              else if(result.indexOf("Semifinals") != -1)
                result = "SF";
              else if(result.indexOf("Quarterfinals") != -1)
                result = "QF";
              else
                result = "--";
            } else {
              var playoffRecord = "--";
              var result = "--";
            }
            
            sheet.getRange(currentRow, currentCol).setValue(eventStr);
            currentCol++;
            sheet.getRange(currentRow, currentCol).setValue(rank);
            currentCol++;
            sheet.getRange(currentRow, currentCol).setValue(qualRecord);
            currentCol++;
            sheet.getRange(currentRow, currentCol).setValue(allianceStatusStr);
            currentCol++;
            sheet.getRange(currentRow, currentCol).setValue(playoffRecord);
            currentCol++;
            sheet.getRange(currentRow, currentCol).setValue(result);
            currentCol++;
          }
        }
      }
    }
    
    sheet.getRange(currentRow, 5).setValue(matchWins + "-" + matchLosses + "-" + matchTies);

  }
  
}

function getWeekCompeted(eventKey){
  var url = "https://www.thebluealliance.com/api/v3/event/" + eventKey;
    var options = {
      "method": "GET",
      "headers": {
        "X-TBA-Auth-Key": "ElyWdtB6HR7EiwdDXFmX2PDXQans0OMq83cdBcOhwri2TTXdMeYflYARvlbDxYe6"
      },
      "payload": {
      }
    };
    var response = JSON.parse(UrlFetchApp.fetch(url, options));
  
  if(response.event_type == 99 || response.event_type == 100 || response.event_type == -1)
    return -1;
  else if(response.event_type == 3)
    return "CMP";
  else if(response.event_type == 4)
    return "Einstein";
  
  return response.week + 1;
}

function run(){
  Logger.log("Curie" + getWeekCompeted("2018cmpmi"));
}