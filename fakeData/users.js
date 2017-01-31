const usersData = [{"id":1,"name":"Lee","room":1},
{"id":2,"name":"Burton","room":1},
{"id":3,"name":"Greene","room":1},
{"id":4,"name":"Ramos","room":1},
{"id":5,"name":"Jenkins","room":0},
{"id":6,"name":"Nichols","room":1},
{"id":7,"name":"Shaw","room":0},
{"id":8,"name":"Ryan","room":1},
{"id":9,"name":"Howell","room":1},
{"id":10,"name":"Rose","room":0},
{"id":11,"name":"Hernandez","room":1},
{"id":12,"name":"Johnson","room":0},
{"id":13,"name":"Rose","room":0},
{"id":14,"name":"Bishop","room":0},
{"id":15,"name":"Robertson","room":0},
{"id":16,"name":"Williamson","room":1},
{"id":17,"name":"Meyer","room":1},
{"id":18,"name":"Hart","room":1},
{"id":19,"name":"Bradley","room":0},
{"id":20,"name":"Hayes","room":0},
{"id":21,"name":"Martin","room":1},
{"id":22,"name":"Peterson","room":1},
{"id":23,"name":"Owens","room":0},
{"id":24,"name":"Reid","room":1},
{"id":25,"name":"Lawson","room":1},
{"id":26,"name":"Lynch","room":0},
{"id":27,"name":"Franklin","room":1},
{"id":28,"name":"Gray","room":1},
{"id":29,"name":"Gardner","room":0},
{"id":30,"name":"Williamson","room":1},
{"id":31,"name":"Wright","room":1},
{"id":32,"name":"Schmidt","room":1},
{"id":33,"name":"Willis","room":1},
{"id":34,"name":"Nguyen","room":0},
{"id":35,"name":"Lawrence","room":1},
{"id":36,"name":"Brooks","room":1},
{"id":37,"name":"Ray","room":1},
{"id":38,"name":"Harris","room":1},
{"id":39,"name":"Wells","room":0},
{"id":40,"name":"Johnson","room":1},
{"id":41,"name":"Jordan","room":1},
{"id":42,"name":"Crawford","room":0},
{"id":43,"name":"Robinson","room":0},
{"id":44,"name":"Mills","room":1},
{"id":45,"name":"Lawson","room":0},
{"id":46,"name":"Morgan","room":0},
{"id":47,"name":"Richards","room":0},
{"id":48,"name":"Evans","room":0},
{"id":49,"name":"Welch","room":0},
{"id":50,"name":"Patterson","room":1},
{"id":51,"name":"Arnold","room":1},
{"id":52,"name":"Williamson","room":1},
{"id":53,"name":"Stephens","room":1},
{"id":54,"name":"Frazier","room":1},
{"id":55,"name":"Cunningham","room":1},
{"id":56,"name":"Kelly","room":1},
{"id":57,"name":"Sims","room":1},
{"id":58,"name":"West","room":0},
{"id":59,"name":"Thompson","room":1},
{"id":60,"name":"Cunningham","room":1},
{"id":61,"name":"Gonzalez","room":1},
{"id":62,"name":"Medina","room":1},
{"id":63,"name":"Jenkins","room":0},
{"id":64,"name":"Robinson","room":0},
{"id":65,"name":"Frazier","room":0},
{"id":66,"name":"Gray","room":1},
{"id":67,"name":"Miller","room":0},
{"id":68,"name":"Ortiz","room":0},
{"id":69,"name":"Morgan","room":1},
{"id":70,"name":"Mason","room":0},
{"id":71,"name":"Green","room":0},
{"id":72,"name":"Day","room":0},
{"id":73,"name":"Henderson","room":1},
{"id":74,"name":"Shaw","room":1},
{"id":75,"name":"Coleman","room":0},
{"id":76,"name":"Cunningham","room":1},
{"id":77,"name":"Long","room":1},
{"id":78,"name":"Tucker","room":1},
{"id":79,"name":"George","room":1},
{"id":80,"name":"Weaver","room":1},
{"id":81,"name":"Walker","room":1},
{"id":82,"name":"Diaz","room":1},
{"id":83,"name":"Morales","room":1},
{"id":84,"name":"Young","room":1},
{"id":85,"name":"Sims","room":1},
{"id":86,"name":"Nelson","room":0},
{"id":87,"name":"Little","room":0},
{"id":88,"name":"Coleman","room":0},
{"id":89,"name":"Cook","room":0},
{"id":90,"name":"Palmer","room":1},
{"id":91,"name":"Perkins","room":1},
{"id":92,"name":"Howell","room":0},
{"id":93,"name":"White","room":0},
{"id":94,"name":"Lee","room":1},
{"id":95,"name":"Johnston","room":0},
{"id":96,"name":"Robertson","room":1},
{"id":97,"name":"Diaz","room":0},
{"id":98,"name":"Roberts","room":0},
{"id":99,"name":"Kim","room":0},
{"id":100,"name":"Mitchell","room":1}];

const userPrefix = require('../app.config').redis.userPrefix;

module.exports = (redisClient) => {

  redisClient.on("error", (err) => {
      console.log("Error " + err);
  });

  redisClient.keys(userPrefix+':*', (err, replies) => {
    if(err) {
      throw(err);
    } else {
      usersData.forEach((user) => {
        if(!replies.find((key) => {return key == `${userPrefix}:${user.id}`})){
          user.createdAt = new Date().getTime();
          redisClient.hmset('user:' + user.id, user);
        }
      });
    }
  });

}
