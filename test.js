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
  url: 'http://192.168.10.122:3333/authen/get_user',
  method: 'POST',
  headers: headers,
  json: {}
}
let listjson = []
let time = 0

randomId = () => {
  return 
}

for(let i=0 ; i< 10 ; i++) {
  // listjson.push({
  //   username: randomstring.generate(8),
  //   password: randomstring.generate(10),
  //   streamKey: randomstring.generate(10),
  //   token: randomstring.generate(30),
  // })
  listjson.push({
    id: i
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
      console.log('body ', body);
      time++
      if(time == 10){
        var date = new Date()
        console.log(`time time ${moment.range(beginDate, date)}`);
  }
  })
}