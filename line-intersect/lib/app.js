var Canvas = require('./canvas.js');

var app = function() {

  this.form = window.document.getElementById('line-data');
  this.resultEl = window.document.getElementById('results');

  // set up canvas
  this.canvas = new Canvas();

  this.bindEvents();
};

app.MESSAGE = {
  INVALID_PARAMS: 'Please fillout all the parameters',
  DONT_INTERSECT: 'Lines don\'t intersect',
  INTERSECT: 'Lines intersect at point: '
};

app.prototype.bindEvents = function() {
  var that = this;
  var form = this.form;

  form.addEventListener('submit', function(ev) {
    ev.preventDefault();

    // validate and get form values
    var lines = that.validateForm();

    if (!lines) {
      that.resultEl.innerHTML = app.MESSAGE.INVALID_PARAMS;
      return;
    }

    that.canvas.drawLines(lines);

    // calculate intersection
    var results = that.calculateIntersection(lines[0], lines[1]);

    // display results
    var msg = results ? app.MESSAGE.INTERSECT + results[0] + ', ' + results[1] : app.MESSAGE.DONT_INTERSECT;
    that.resultEl.innerHTML = msg;
  });
};

app.prototype.validateForm = function() {
  // All form elements (including submit)
  var fields = this.form.elements;

  var lines = [];

  for (var i in fields) {
    var field = fields[i];

    // filter text fields
    if (field.type != 'text')
      continue;

    var name = field.name;
    var value = parseInt(field.value, 10);

    if (isNaN(value))
      return false;

    var parts = name.split('-');

    if (parts.length < 4)
      return false;

    // which line is it
    var iLine = parts[1];

    // is it x or y
    var valName = parts[2];

    // which line x/y coord is it
    var iVal = parts[3];

    if (!lines[iLine])
      lines[iLine] = [];

    if (!lines[iLine][iVal])
      lines[iLine][iVal] = {};

    lines[iLine][iVal][valName] = value;
  }

  return lines;
};

app.prototype.calculateIntersection = function(line1, line2) {

  // assing lines to more readable variables
  var p0_x = line1[0].x,
    p0_y = line1[0].y,
    p1_x = line1[1].x,
    p1_y = line1[1].y,
    p2_x = line2[0].x,
    p2_y = line2[0].y,
    p3_x = line2[1].x,
    p3_y = line2[1].y;

  // calculate cross product of 2 points
  var s1_x = p1_x - p0_x,
    s1_y = p1_y - p0_y,
    s2_x = p3_x - p2_x,
    s2_y = p3_y - p2_y;

  var s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
  var t = (s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

  return s >= 0 && s <= 1 && t >= 0 && t <= 1 ? [p0_x + s * s1_x, p0_y + t * s1_y] : 0;
};


module.exports = app;