let config = require('config');

function makeURL(station){  
  // 설정한 property(capsule.properties)로부터 데이터를 가져옴
  const baseURL = "http://busopen.jeju.go.kr/OpenAPI/service/bis/BusArrives";
  let url = '';
  url = baseURL + '?station=' + station;
  return url;
}

function getDistance(lat1,lon1,lat2,lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2-lat1);
  const dLon = deg2rad(lon2-lon1); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

module.exports.function = function getBusInfo (point, self, busnumber) {
  //다른 경로의 파일을 가져옴 
  const dummyData = require("./data/busstops.js");
  const fail = require('fail');
  const http = require('http');
  const console = require('console');
  
  let url = '';
  let base = null;
  let target = null;
  
  let distance = dummyData[0];
  let temp = 0;
  let stopnumber = 0;
//  for(let i = 1; i < dummyData.length; i++){
//      temp = getDistance(point.point.latitude, point.point.longitude,
//                             dummyData[i].point.point.latitude, dummyData[i].point.point.longitude);
//      if (temp < distance){
//        stopnumber = i;
//      }
//  } // 가장 가까운 정류장이 들어있는 배열 칸 number를 저장 
  
  
//  var nearStation = dummyData[stopnumber].number; //사용자의 위치를 기반으로 가까운 정류장을 찾는 것
  
  url = makeURL('405000364'); // get할 url 만들기, nearStation 없으면 아무것도 return 안하기 추가할 것

  //외부 API와 http 통신 (https://bixbydevelopers.com/dev/docs/reference/JavaScriptAPI/http)
  // returnHeaders: API에 대한 Response를 Header 형식으로 받음
  let response = http.getUrl(url, {format:"xmljs", returnHeaders:true}); //format xmljs XML JSON으로 바꿔줌
  
//  let test = http.getUrl('https://bixby-restaurants.firebaseio.com/Aewol.json', {format:"json"});
//  console.log('test= '+test[0].keyword); 
  
  console.log(response);
  
  if(response.status != 200){
    throw fail.checkedError("No Information", "NoInfo");
  } //잘 작동하는지 확인
     
  let result = [];
  
  //json 형태로 들어온 response를 다뤄서 predicttravtm>0일 때 arrvvhid, leftstation, predicttravtm를 반환해야

  
  let username;
  if(self.nameInfo != undefined){
          if(self.nameInfo.nickName){
            username = self.nameInfo.nickName;
          }else{
            username = self.nameInfo.structuredName;
          }  
        }else{
          username = '사용자';
        }
  
  var tempResult = new Object();
    
  if(busnumber != undefined){
    for (let i = 0; i<response.parsed.response.body.numOfRows; i++){
      if (busnumber == response.parsed.response.body.items.item[i].arrvVhId){
        tempResult.username = username;
        tempResult.busnumber = response.parsed.response.body.items.item[i].arrvVhId;
        tempResult.buslefttime = response.parsed.response.body.items.item[i].predictTravTm;
        tempResult.leftbusstop = response.parsed.response.body.items.item[i].leftStation;      
        result.push(tempResult);        
      }
    }
  } else{
    for(let i = 0; i<response.parsed.response.body.numOfRows; i++){
      if(response.parsed.response.body.items.item[i].predictTravTm > 0){
        console.log('undefined 안에 if 문 안에');
        tempResult.username = username;
        tempResult.busnumber = response.parsed.response.body.items.item[i].arrvVhId;
        tempResult.buslefttime = response.parsed.response.body.items.item[i].predictTravTm;
        tempResult.leftbusstop = response.parsed.response.body.items.item[i].leftStation;      
        result.push(tempResult);
      }
    }    
  }

//  for(let i = 0; i < dummyData.length; i++){
//    result.push(tempResult[i]);
//  }
  
//  for(let val in response.parsed.rates){
//      result.push({
//        baseSymbol: {
//          currencySymbol: base
//        },
//        username: username,
//        busnumber: 0,
//        buslefttime: 0,
//        leftbusstop: 0
//      });
//  }

  //result에는 username, busnumber, buslefttime, leftbusstop! 정류장 이름도 들어가야할까?
  return result;
}
