module.exports = (redisClient) => {

  return (analyzeList, cb) => {
    const requestList = analyzeList.map(requestData => genRequest(requestData));
    const timestamp = new Date().getTime();

    Promise.all(requestList)
    .then(result => {
      cb(null, findTop(result, timestamp));
    }).catch(err => {
      cb(err, null);
    });

  };

  function findTop(resultData, timestamp) {
    const byRooms = sumUserEnergy(resultData);
    const resultRoom = convertDataToArray(byRooms, usersByRoomToArray, timestamp);

    function sumUserEnergy(resultData) {
      const byRooms = {};
      resultData.forEach(analizData => {
        let roomKey = `${analizData.room}`; //roomKey;
        if(!byRooms.hasOwnProperty(roomKey)) {
          byRooms[roomKey] = {};
        }
        let userKey = `user_${analizData.user.id}`;
        if(!byRooms[roomKey].hasOwnProperty(userKey)) {
          byRooms[roomKey][userKey] = {
          id: analizData.user.id,
            energy: 0,
          }
        }
        byRooms[roomKey][userKey].energy += parseFloat(analizData.data.energy);
      });
      return byRooms;
    }

    function usersByRoomToArray(roomData) {
      const users = [];
      for (var userKey in roomData) {
        if (roomData.hasOwnProperty(userKey)) {
          users.push(roomData[userKey]);
        }
      }
      users.sort((a, b) => {
        return b.energy - a.energy;
      })
      return users;
    }

    function convertDataToArray(byRooms, fnUsersByRoomToArray, timestamp) {
      const resultRoom = [];
      for (let roomKey in byRooms) {
        if (byRooms.hasOwnProperty(roomKey)) {
          const userByRoom = fnUsersByRoomToArray(byRooms[roomKey])
          resultRoom.push({
            id: roomKey,
            timestamp: timestamp,
            users: userByRoom
          });
        }
      }
      return resultRoom;
    }

    return resultRoom;
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
