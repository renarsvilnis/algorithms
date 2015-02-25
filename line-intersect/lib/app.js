var app = function() {

  this.form = window.document.getElementById('line-data');
  this.resultEl = window.document.getElementById('results');

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


  // TODO: magic

  var intersection = [12, 124];
  return intersection;
};


module.exports = app;