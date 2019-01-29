const request = require("request")
const moment = require('moment') 
var momentRange = require('moment-range');
momentRange.extendMoment(moment);

var randomstring = require("randomstring");

var headers = {
  'User-Agent': 'Super Agent/0.0.1',
  'Content-Type': 'application/json'
}

var options = {
  url: 'http://172.16.2.5:3333/stream/insert_message',
  method: 'POST',
  headers: headers,
  json: {}
}
let listjson = []
let time = 0

randomId = () => {
  return 
}

for(let i=0 ; i< 2 ; i++) {
  listjson.push({
    userId: randomstring.generate(16),
    username: randomstring.generate(8),
    message: randomstring.generate(10)
  })
}
var beginDate = new Date()
console.log('list ',listjson );

console.log('done ', beginDate);
// var date1 = new Date()
let length = listjson.length
console.log(`time time ${length}`);

for(let j=0; j< length ; j++){
  options.json = listjson[j]
  request.post(options, (error, response, body) => {
      console.log('err ', error, response, body);
      
      time++
      if(time == 2){
        var date = new Date()
        console.log(`time time ${moment.range(beginDate, date)}`);
  }
  })
}