// 참조 (https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula)

function makeURL(local, kind){  
  // 설정한 property(capsule.properties)로부터 데이터를 가져옴
  const baseURL = "https://bixby-restaurants.firebaseio.com/";
  let url = '';
  if(kind == 'Cafe'){
    url = baseURL +local + '/cafe.json';
  }
  else if(kind == 'Restaurant'){
    url = baseURL + local + '/restaurant.json';
  }

  return url;
}

function compute(local, kind){
  const fail = require('fail');
  const http = require('http');  
  const console = require('console');
  let url = makeURL(local, kind);
  let result = [];
  let response = http.getUrl(url, {format:"json"});
  let i=1;
  while(response[i]!=undefined){
    var tempResult = new Object();
    tempResult.name = response[i].name;
    tempResult.detail = response[i].detail;
    tempResult.url = response[i].url;
    tempResult.location = response[i].location;
    tempResult.flag = true;
    console.log(tempResult);
    result.push(tempResult);
    console.log(result);
    i++;
    }
  return result;
}

module.exports.function = function getRestautantInfo (near, point, self, kind) {
  const console = require('console');
  let url = '';
  let response = '';
  let result = [];
  console.log('near= '+near);
  let kind = kind;
  if(near == 'Nearby'){ // '주변' 이라는 말이 있을 때
    if (point.subLocalityTwo=="애월읍"){
        result = compute('Aewol', kind);
    }
    else if (point.subLocalityTwo=="한림읍"){
        result = compute('Hallim', kind);
    }
    else if (point.subLocalityTwo=="대정읍"){
        result = compute('Daejung', kind);
    } 
    else if (point.subLocalityTwo=="한경면"){
        result = compute('Hankyung', kind);
    }    
  }
  else if(near == undefined || kind == undefined){ // '주변' 이란 말이 없을 때
    console.log('here');
  }
  else if(near!=undefined && near!='Nearby'){ //near에 지역명이 들어왔을 때
    result = compute(near, kind);
  }
  return result;
}
