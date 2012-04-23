(function() {
  var $, Color, Input, Picker, PickerPopup, Popup, Spine,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  $ = jQuery;

  Spine = ColorCanvas.Spine;

  Color = ColorCanvas.Color;

  Picker = ColorCanvas.Picker;

  $.colorcanvas = {};

  $.colorcanvas.replaceInputs = function() {
    return $('input[type=color]').each(function() {
      return (new Input).replace(this);
    });
  };

  $(function() {
    return $.colorcanvas.replaceInputs();
  });

  Popup = (function(_super) {

    __extends(Popup, _super);

    Popup.name = 'Popup';

    Popup.prototype.width = 400;

    Popup.prototype.events = {
      mousedown: 'listen'
    };

    function Popup() {
      this.drop = __bind(this.drop, this);

      this.drag = __bind(this.drag, this);

      this.listen = __bind(this.listen, this);

      this.close = __bind(this.close, this);

      this.open = __bind(this.open, this);
      Popup.__super__.constructor.apply(this, arguments);
      this.el.delegate('click', '.close', this.close);
      this.el.addClass('popup');
      this.el.css({
        position: 'absolute'
      });
    }

    Popup.prototype.open = function(position) {
      var left, top,
        _this = this;
      if (position == null) {
        position = {
          left: 0,
          top: 0
        };
      }
      left = position.left || position.clientX;
      top = position.top || position.clientY;
      left += 25;
      top -= 5;
      this.el.css({
        left: left,
        top: top
      });
      $('body').append(this.el);
      return setTimeout(function() {
        return $('body').mousedown(_this.close);
      });
    };

    Popup.prototype.close = function() {
      $('body').unbind('mousedown', this.close);
      this.release();
      return this.trigger('close');
    };

    Popup.prototype.isOpen = function() {
      return !!this.el.parent().length;
    };

    Popup.prototype.listen = function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (e.target !== e.currentTarget) {
        return;
      }
      this.dragPosition = {
        left: e.pageX,
        top: e.pageY
      };
      $(document).mousemove(this.drag);
      return $(document).mouseup(this.drop);
    };

    Popup.prototype.drag = function(e) {
      var difference, offset;
      difference = {
        left: e.pageX - this.dragPosition.left,
        top: e.pageY - this.dragPosition.top
      };
      this.dragPosition = {
        left: e.pageX,
        top: e.pageY
      };
      offset = this.el.offset();
      offset.left += difference.left;
      offset.top += difference.top;
      return this.el.css(offset);
    };

    Popup.prototype.drop = function(e) {
      $(document).unbind('mousemove', this.drag);
      return $(document).unbind('mouseup', this.drop);
    };

    return Popup;

  })(Spine.Controller);

  PickerPopup = (function(_super) {

    __extends(PickerPopup, _super);

    PickerPopup.name = 'PickerPopup';

    function PickerPopup() {
      var _this = this;
      PickerPopup.__super__.constructor.apply(this, arguments);
      this.color || (this.color = new Color);
      this.picker = new Picker({
        color: this.color
      });
      this.picker.bind('change', function() {
        return _this.trigger.apply(_this, ['change'].concat(__slice.call(arguments)));
      });
      this.append(this.picker);
    }

    return PickerPopup;

  })(Popup);

  Input = (function(_super) {

    __extends(Input, _super);

    Input.name = 'Input';

    Input.prototype.className = 'colorCanvasInput';

    Input.prototype.events = {
      'click': 'open'
    };

    function Input() {
      Input.__super__.constructor.apply(this, arguments);
      this.input || (this.input = $('<input />'));
      this.color || (this.color = new Color.Black);
      this.render();
    }

    Input.prototype.render = function() {
      return this.el.css({
        backgroundColor: this.color.toString()
      });
    };

    Input.prototype.replace = function(input) {
      this.input = $(input);
      this.color.set(Color.fromString(this.input.val()));
      this.input.hide();
      return this.input.after(this.el);
    };

    Input.prototype.open = function() {
      var _this = this;
      if (this.picker && this.picker.isOpen()) {
        this.picker.close();
        return;
      }
      this.picker = new PickerPopup({
        color: this.color
      });
      this.picker.bind('change', function(color) {
        _this.color.set(color);
        _this.trigger('change', _this.color);
        _this.input.val(_this.color.toString());
        _this.input.change();
        return _this.render();
      });
      return this.picker.open(this.el.offset());
    };

    return Input;

  })(Spine.Controller);

  this.ColorCanvas.Input = Input;

  this.ColorCanvas.Popup = Popup;

  this.ColorCanvas.PickerPopup = PickerPopup;

}).call(this);