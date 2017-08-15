const converter = (obj) => {
  return Object.keys(obj).reduce((total, k) => {
    total[k] = obj[k];
    total[obj[k]] = k;
    return total;
  }, {});
};

exports.BUCKETS = converter({
  'bee-other': 'others.117sport.com',
  'bee-image': 'img.117sport.com',
  'bee-video': 'video.117sport.com',
  'bee-static': 'static.117sport.com',
  'bee-track': 'track.117sport.com'
});
