export default new Promise((resolve, reject) => {
  let geol = null;
  try {
    if (typeof(navigator.geolocation) === 'undefined') {
      geol = google.gears.factory.create('beta.geolocation');
      } else {
        geol = navigator.geolocation;
      }
  } catch (error) {
  }
  if (geol) {
    geol.getCurrentPosition((position) => {
      var nowLatitude = position.coords.latitude;
      var nowLongitude = position.coords.longitude;
      resolve({nowLatitude, nowLongitude});
    }, function(error) {
      console.log('timeout:', error.TIMEOUT, 'permision:', error.PERMISSION_DENIED, 'UNVA:', error.POSITION_UNAVAILABLE)
      reject(new Error(error.code));
    }, {timeout:5000});  //设置十秒超时
  }
});
