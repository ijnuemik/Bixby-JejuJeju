module.exports.function = function getProverbs(topic) {
  // 다른 경로의 파일을 가져옴
  const fakeData = require("./data/ProverbsData.js");
  const console = require('console');
  let result = [];
  console.log('hihi');
  result = fakeData['verb'];
  var rand = Math.ceil(Math.random() * result.length);
  console.log(rand);
  result = result[rand-1];
  
  console.log(result);
  return result;
}
