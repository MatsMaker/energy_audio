module.exports = (redisClient) => {

  return (analyzeList, cb) => {
    const requestList = analyzeList.map(requestData => genRequest(requestData));

    Promise.all(requestList)
    .then(result => {
      cb(null, findTop(result));
    }).catch(err => {
      cb(err, null);
    });

  };

  function findTop(resultData) {
    const byRooms = {};

    // for (var i = 0; i < resultData.length; i++) {
    //   let analizData = resultData[i];
    //   if(!byRooms.hasOwnProperty(analizData.room)) {
    //     byRooms[analizData.room] = {};
    //   }
    //   if(!byRooms[analizData.room].hasOwnProperty(analizData.user.id)) {
    //     byRooms[analizData.room][analizData.user.id] = {
    //       userId: analizData.user.id,
    //       energy: 0
    //     }
    //   }
    //   byRooms[analizData.room][analizData.user.id].energy += byRooms[analizData.room][analizData.user.id].energy;
    // }
    resultData.forEach(analizData => {
      if(!byRooms.hasOwnProperty(analizData.room)) {
        byRooms[analizData.room] = {};
      }
      if(!byRooms[analizData.room].hasOwnProperty(analizData.user.id)) {
        byRooms[analizData.room][analizData.user.id] = {
          userId: analizData.user.id,
          energy: 0
        }
      }
      byRooms[analizData.room][analizData.user.id].energy += parseFloat(analizData.data.energy);
    });

    // for (var roomId in byRooms) {
    //   if (object.hasOwnProperty(roomId)) {
    //     byRooms[roomId].sort((a, b) => {
    //       return a - b;
    //     });
    //   }
    // }

    return byRooms;
  };

  function genRequest(requestData) {
    return new Promise((resolve, reject) => {
      redisClient.hgetall(requestData.key, (err, data) => {
        if(err){
          reject(err);
        }else{
          resolve({
            user: requestData.user,
            room: requestData.user.room,
            timeshtamp: requestData.timeshtamp,
            data: data
          });
        }
      });
    });
  };

}
