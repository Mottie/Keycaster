/*
 * Keycaster v0.9alpha
 * By Rob Garrison (aka Mottie & Fudgey)
 * Dual licensed under the MIT and GPL licenses.
 *
 */
 
(function($){
 keycaster = function(options){
  
  if (!$('#keycaster').length) {
   $('<ul id="keycaster"></ul>').appendTo('body');
  }
  var base = $('#keycaster')[0];
  base.$el = $('#keycaster');

  // Add a reverse reference to the DOM object
  base.$el.data("key", base);
  
  base.init = function(){
   base.options = $.extend({}, keycaster.defaultOptions, options);
   base.keys = $.extend({}, keycaster.keys, options);
   base.keyset = (base.options.abbrevName) ? 1 : 0;
   base.lasttext = '';

   base.$el.hide();

   $(document)
    .bind('keydown', function(e){
     var k = e.which;
     // don't repeat meta or menu keys
     if (k === base.lastKey && ( k > 15 && k < 19 || k > 90 && k < 94 ) || (!base.options.showShift && k === 16)) { return; }
     base.lastKey = k;
     // show key
     base.updateDisplay(e, k, false);
    })
    .bind('mousedown', function(e){
     // show clicked area
     base.rotateImg(e.timeStamp, e.pageX, e.pageY);
    });

   // Show key release
   if (base.options.showUnKey) {
    $(document).bind('keyup', function(e){
     var k = e.which;
     // show shift, if set
     if (!base.options.showShift && k === 16) { return; }
     // show un-meta key, except for menu
     if ( k > 15 && k < 19 || k > 90 && k < 93 ) {
      base.lastKey = null;
      // show key
      base.updateDisplay(e, k, true);
     }
    });
   }

  };

  // display key (event, event.which, "un"-boolean)
  base.updateDisplay = function(e, k, un){
   // timer to clear displayed lines
   clearTimeout(base.timer);
   base.timer = setTimeout(base.clearDisplay, base.options.displayTime);
   base.$el.show();

   // console.debug(k);

   var def = typeof(base.keys[k]) !== 'undefined',
    meta = ( e.ctrlKey || e.altKey ),
    t = (e.shiftKey) ? String.fromCharCode(e.keyCode) : String.fromCharCode(e.keyCode).toLowerCase(),
    n = '<' + base.options.keyWrapper + ' class="keycasterKey ';

   n += (meta || def) ? base.options.namedKey : base.options.regKey;
   n += '">';
   if (def) {
    t = (un) ? base.options.unMessage : ''; // for un-shift, un-ctrl, un-alt
    t += base.keys[k][base.keyset];
   }
   n += t + '</' + base.options.keyWrapper + '>';

   if (!base.options.showBksp && k === 8){
    base.$el.find(base.options.keyWrapper + ':last').remove();
    n = '';
   }

   // add <li> if one isn't available
   if (base.$el.find('li').length === 0) {
    base.$el.append('<li><span></span></li>');
   }
   base.$el.find('li:last > span').html(function(i,h){ return h + n; });

   // move key to next line if it gets too wide
   if (base.$el.find('li:last > span').outerWidth() > base.$el.find('li:last').innerWidth()) {
    base.$el.find('li:last > span').find(base.options.keyWrapper + ':last').remove();
    base.$el.append('<li><span>' + n + '</span></li>');
   }
   // add new line after each enter or escape
   if (k === 13 || k === 27) { base.$el.append('<li><span></span></li>'); }

   if (base.$el.find('li').length > base.options.lines) {
    base.$el.find('li:first').remove();
   }
  };

  // clear the top line of the display every x seconds
  base.clearDisplay = function(){
   base.$el.find('li:first').remove();
   if (base.$el.find('li').length === 0 || base.$el.find('li').text() === '') {
    clearTimeout(base.timer);
    base.$el.hide();
   } else {
    base.timer = setTimeout(base.clearDisplay, base.options.displayTime);
   }
  };

  // Animate png image
  base.rotateImg = function(imgId,x,y){
   // add image
   if (!$('#clicked' + imgId).length) {
    $('<div class="clickedArea" id="clicked' + imgId + '" data-num="0"></div>')
     .css({
      background : 'transparent url(' + base.options.imgUrl + ') no-repeat 0 0',
      height     : base.options.imgsize,
      width      : base.options.imgsize,
      position   : 'absolute',
      left       : x - base.options.imgsize/2,
      top        : y - base.options.imgsize/2
     })
     .appendTo('body');
   }
   // animate image
   var img = $('div#clicked' + imgId),
    n = parseInt(img.attr('data-num'), 10) + 1;
   if (n <= base.options.imgFrames) {
    img
     .css('background-position', '-' + base.options.imgsize * n + 'px 0')
     .attr('data-num', n);
    setTimeout(function(){ base.rotateImg(imgId,x,y); }, base.options.imgtime);
   } else {
    img.remove();
   }
  };

  base.init();
 };
 
 keycaster.defaultOptions = {
  // display window
  abbrevName  : true,                    // if true, abbreviated key names will show (not all unicode symbols work in IE, so set this to false)
  lines       : 4,                       // number of lines shown in the window
  displayTime : 1500,                    // time in milliseconds to display the line
  showShift   : false,                   // if true, show shift key
  showUnKey   : false,                   // if true, releasing meta keys will add an "un-" meta key message
  showBksp    : false,                   // if true, the backspace key will show
  unMessage   : 'Un-',                   // Un- message, just because I'm crazy like that

  // animated png - shown when mouse clicked on screen
  imgUrl      : 'images/click-blue.png', // image with frame blocks for animation
  imgFrames   : 6,                       // number of frames to animate
  imgsize     : 150,                     // image height & width
  imgtime     : 75,                      // time in milliseconds between images

  // class names applied to keys
  keyWrapper  : 'kbd',                   // HTML tag wrapped around the displayed key
  namedKey    : 'namedKeys',             // named key class - found in keycaster.keys
  regKey      : 'regKeys'                // un-named key class
 };

  keycaster.keys = {
  // e.which : [ 'full key name', 'abbreviated name' ]
  8   : [ 'Backspace', '\u232b' ],
  9   : [ 'Tab', '\u21b9' ],
  12  : [ 'Numpad 5' , '5' ],
  13  : [ 'Enter', '\u21b5' ],
  16  : [ 'Shift', '\u21e7' ],
  17  : [ 'Control', '\u273c' ], // Ctrl symbol - 6 spoked open center asterisk
  18  : [ 'Alt', '\u2325' ],
  19  : [ 'Pause', 'Pause' ],
  20  : [ 'Caps Lock', '\u21ea' ],
  27  : [ 'Escape', 'Esc' ],
  32  : [ 'Space', '_' ],
  33  : [ 'Page Up', 'PgUp' ],
  34  : [ 'Page Down', 'PgDwn' ],
  35  : [ 'End', 'End' ],
  36  : [ 'Home', 'Home' ],
  37  : [ 'Left', '\u2190' ],
  38  : [ 'Up', '\u2191' ],
  39  : [ 'Right', '\u2192' ],
  40  : [ 'Down', '\u2193' ],
  44  : [ 'Print Screen', 'PrtScn' ],
  45  : [ 'Insert', 'Ins' ],
  46  : [ 'Delete', 'Del' ],
  // \u2318 = mac command, \u2317 = viewdata square, there is no unicode symbol for windows
  91  : [ 'Command (left)', ((navigator.appVersion.indexOf("Mac")!== -1) ? '\u2318' : '\u2317') ],  // these symbols do not work in IE
  92  : [ 'Command (right)', ((navigator.appVersion.indexOf("Mac")!== -1) ? '\u2318' : '\u2317') ], // these symbols do not work in IE
  93  : [ 'Menu', '\u29c9' ], // symbol two joined squares - does not work in IE
  96  : [ 'Numpad 0', '0'],
  97  : [ 'Numpad 1', '1'],
  98  : [ 'Numpad 2', '2'],
  99  : [ 'Numpad 3', '3'],
  100 : [ 'Numpad 4', '4'],
  101 : [ 'Numpad 5', '5'],
  102 : [ 'Numpad 6', '6'],
  103 : [ 'Numpad 7', '7'],
  104 : [ 'Numpad 8', '8'],
  105 : [ 'Numpad 9', '9'],
  106 : [ 'Multiply', '*' ],
  107 : [ 'Add', '+' ],
  108 : [ 'Numpad Enter', '\u21b5' ],
  109 : [ 'Subtract', '-' ],
  110 : [ 'Numpad Decimal', '.' ],
  111 : [ 'Divide', '/' ],
  112 : [ 'Help', 'F1' ], // Doubt this will work since the browser opens the help site
  113 : [ 'F2', 'F2' ],
  114 : [ 'F3', 'F3' ],
  115 : [ 'F4', 'F4' ],
  116 : [ 'Reload', 'F5' ], // Reload page
  117 : [ 'F6', 'F6' ], // Next pane
  118 : [ 'F7', 'F7' ],
  119 : [ 'F8', 'F8' ],
  120 : [ 'F9', 'F9' ],
  121 : [ 'F10', 'F10' ],
  122 : [ 'Full Screen', 'F11' ], // Browser full screen mode
  123 : [ 'F12', 'F12' ],
  144 : [ 'Num Lock', 'NmLk' ],
  145 : [ 'Scroll Lock', 'ScrLk' ],
  186 : [ ';', ';' ],
  187 : [ '=', '=' ],
  188 : [ 'Comma', ',' ],
  189 : [ '-', '-' ],
  190 : [ 'Period', '.' ],
  191 : [ '/', '/' ],
  192 : [ '`', '`' ],
  193 : [ '~', '~' ],
  219 : [ '[', '[' ],
  220 : [ '\\', '\\'],
  221 : [ ']', ']'],
  222 : [ "'", "'" ] // apostrophe
 };

})(jQuery);
