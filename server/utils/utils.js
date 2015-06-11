/**
 * Description: given a lng/lat point returns the bounding box for a 1-mile radius
 * @method getBoxForLoc
 * @param {Array[lng, lat]} coords
 * @return {Array} box
 */
var getBoxForLoc = function(coords) {
  var miles = 1;
  var radius = 0.02899 * miles;
  var box = [
    [coords[0] - radius, coords[1] - radius], //sw
    [coords[0] + radius, coords[1] + radius]
  ]; //ne
  return box;
};

/**
 * Description: return a polygon box for sw/ne coordinates
 * @method getPolyBoxQuery
 * @param {Array[sw,ne]} box
 * @return ObjectExpression
 */
var getPolyBoxQuery = function(box) {
  var polyBox = [ // sw, ne
    [
      [box[0][0], box[0][1]],
      [box[1][0], box[0][1]],
      [box[1][0], box[1][1]],
      [box[0][0], box[1][1]],
      [box[0][0], box[0][1]]
    ]
  ];
  return {
    "loc": {
      "$geoWithin": {
        "$geometry": {
          "type": "Polygon",
          "coordinates": polyBox
        }
      }
    }
  }
};

module.exports = {
  getBoxForLoc: getBoxForLoc,
  getPolyBoxQuery: getPolyBoxQuery
};