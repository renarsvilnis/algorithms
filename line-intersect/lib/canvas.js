var canvas = function() {
  this.canvas = window.document.getElementById('canvas');
  this.ctx = this.canvas.getContext('2d');

  // 4:3 aspect ratio
  this.canvas.width = 600;
  this.canvas.height = 450;

  // padding from edge
  this.padding = 0.1;

  // point coordinates where the image will laying in
  this.startX = this.canvas.width * this.padding;
  this.endX = this.canvas.width - this.startX;
  this.startY = this.canvas.height * this.padding;
  this.endY = this.canvas.height - this.startY;
};

canvas.prototype.drawLines = function(lines) {

  // clear canvas
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  var colors = [
    '#03A9F4',
    '#8BC34A'
  ];

  // image
  var padding = 0.2; // how much padding from edges

  // find min/max values
  var edge = this.findEdgeValues(lines);

  for (var i = 0; i < 2; i++) {
    var line = lines[i];

    var x0 = line[0].x,
      y0 = line[0].y,
      x1 = line[1].x,
      y1 = line[1].y;

    // map values
    x0 = this.mapRange(x0, edge.minX, edge.maxX, this.startX, this.endX);
    y0 = this.mapRange(y0, edge.minY, edge.maxY, this.startY, this.endY);
    x1 = this.mapRange(x1, edge.minX, edge.maxX, this.startX, this.endX);
    y1 = this.mapRange(y1, edge.minY, edge.maxY, this.startY, this.endY);

    this.drawLine({
      x0: x0,
      y0: y0,
      x1: x1,
      y1: y1,
      color: colors[i]
    });
  }

};

canvas.prototype.findEdgeValues = function(lines) {

  // seperate all x and y points
  var xList = [],
    yList = [];

  xList.push(lines[0][0].x);
  xList.push(lines[0][1].x);
  xList.push(lines[1][0].x);
  xList.push(lines[1][1].x);

  yList.push(lines[0][0].y);
  yList.push(lines[0][1].y);
  yList.push(lines[1][0].y);
  yList.push(lines[1][1].y);

  // find edge values
  function findEdges(list) {
    var min, max;

    list.forEach(function(item) {

      if (typeof min == 'undefined' || item < min)
        min = item;

      if (typeof max == 'undefined' || item > max)
        max = item;
    });

    return [min, max];
  }

  var xEdges = findEdges(xList);
  var yEdges = findEdges(yList);

  return {
    minX: xEdges[0],
    maxX: xEdges[1],
    minY: yEdges[0],
    maxY: yEdges[1]
  };
};

canvas.prototype.mapRange = function(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
};

canvas.prototype.drawLine = function(line) {
  var ctx = this.ctx;

  ctx.beginPath();
  ctx.moveTo(line.x0, line.y0);
  ctx.lineTo(line.x1, line.y1);
  ctx.lineWidth = 2;
  ctx.strokeStyle = line.color;
  ctx.stroke();
};

module.exports = canvas;