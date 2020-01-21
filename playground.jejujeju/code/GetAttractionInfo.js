// 참조 (https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula)
function getDistance(lat1,lon1,lat2,lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2-lat1);
  const dLon = deg2rad(lon2-lon1); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

module.exports.function = function getAttractionInfo (near, point, self) {
  const dummyData = require("./data/attractions.js");
  const console = require('console');
  
  // console.log(near);
  // console.log(point);
  console.log(self);
  
  let result = [];
  
  
  if(near != undefined){
    let distance = 0;
    
    for(let i = 0; i < dummyData.length; i++){
      distance = getDistance(point.point.latitude, point.point.longitude,
                             dummyData[i].point.point.latitude, dummyData[i].point.point.longitude);      
      
      if(distance < 2){
        if(self.nameInfo != undefined){
          if(self.nameInfo.nickName){
            dummyData[i].username = self.nameInfo.nickName;
          }else{
            dummyData[i].username = self.nameInfo.structuredName;
          }  
        }else{
          dummyData[i].username = '사용자';
        }
              
        dummyData[i].flag = true;
        result.push(dummyData[i]);
      }   
    }
   
  }else{ //근처라는 말이 없을 때   
    for(let i = 0; i < dummyData.length; i++){
      result.push(dummyData[i]);
    }
  }
  
  console.log(result);
  return result;
}