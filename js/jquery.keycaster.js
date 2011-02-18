/*
 * Keycaster v1.1.1
 * By Rob Garrison (aka Mottie & Fudgey)
 * Dual licensed under the MIT and GPL licenses.
 *
 * Dependency: jQuery 1.2.6+
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
   if (base.initialized) { return; }
   base.options = $.extend({}, keycaster.defaultOptions, options);
   base.keys = $.extend({}, keycaster.keys, options);
   base.lasttext = '';
   base.doc = $(document);
   base.webkit = $.browser.webkit;

   base.$el.hide();

   base.doc
    .bind('keydown', function(e){
     var k = e.which;
     // don't repeat meta or menu keys in the display window
     if (k === base.lastKey && ( k > 15 && k < 19 || k > 90 && k < 94 ) || (!base.options.showShift && k === 16)) { return; }
     base.lastKey = k;
     // show key (event, key, show-Un-Key)
     base.updateDisplay(e, k, false);
    })
    .bind('mousedown', function(e){
     if (base.webkit && e.target.tagName === 'SELECT') {
      // only Safari doesn't show the animation on mouseup, so now Chrome shows both
      base.rotateImg( e.timeStamp, e.pageX, e.pageY, ((e.shiftKey) ? true : false) );
     }
    })
    .bind('mouseup', function(e){
     // In case the click image animation interferes with the interface. Set last argument to true by using
     // Shift-Click to add the "keycasterUnderArea" (negative z-index) class instead of the "keycasterClickedArea" class - both are defined in the css
     // show clicked area
     base.rotateImg( e.timeStamp, e.pageX, e.pageY, ((e.shiftKey) ? true : false) );
    });

   // Show key release
   base.doc.bind('keyup', function(e){
    if (base.options.showUnKey) {
     var k = e.which;
      // show shift, if set
      if (!base.options.showShift && k === 16) { return; }
      // show un-meta key, except for menu
      if ( k > 15 && k < 19 || k > 90 && k < 93 ) {
       base.lastKey = null;
       // show key
       base.updateDisplay(e, k, true);
      }
    }
   });
   // prevent multiple instances
   base.initialized = true;
  };

  // display key (event, event.which, "un"-boolean)
  base.updateDisplay = function(e, k, un){
   // timer to clear displayed lines
   clearTimeout(base.timer);
   base.timer = setTimeout(base.clearDisplay, base.options.displayTime);
   base.$el.show();

   var key = base.keys[k],
    set = (base.options.abbrevName) ? 1 : 0,
    def = typeof(key) !== 'undefined',
    meta = ( e.ctrlKey || e.altKey ),
    t = (e.shiftKey) ? String.fromCharCode(e.keyCode) : String.fromCharCode(e.keyCode).toLowerCase(),
    n = $('<' + base.options.keyWrapper + '/>')
     .addClass('keycasterKey ' + ((meta || def) ? base.options.namedKey : base.options.regKey));
   if (def) {
    t = (un) ? base.options.unMessage : ''; // for un-shift, un-ctrl, un-alt
    t += (e.shiftKey) ? key[2] || key[set] : key[set];
   }
   n.html(t);

   // backspace
   if (!base.options.showBksp && k === 8){
    base.$el.find(base.options.keyWrapper + ':last').remove();
    n = null;
   }

   // add <li> if one isn't available
   if (base.$el.find('li').length === 0) {
    base.$el.append('<li><span></span></li>');
   }
   base.$el.find('li:last > span').append(n);

   // move key to next line if it gets too wide
   if (base.$el.find('li:last > span').outerWidth() > base.$el.find('li:last').innerWidth()) {
    base.$el.find('li:last > span').find(base.options.keyWrapper + ':last').remove();
    base.$el.append('<li><span></span></li>').find('li:last > span').append(n);
   }
   // add new line after each enter, escape or tab (expecting it to switch inputs)
   if (k === 13 || k === 27 || k === 9) { base.$el.append('<li><span></span></li>'); }

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
  base.rotateImg = function(imgId,x,y,under){
   // add image
   if (!$('#clicked' + imgId).length) {
    $('<div id="clicked' + imgId + '" data-num="0"></div>')
     .addClass( (under) ? 'keycasterUnderArea' : 'keycasterClickedArea' )
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
  // e.which : [ 'full key name', 'abbreviated name', 'shifted key' ]
  8   : [ 'Backspace', ($.browser.msie ? 'Bksp' : '\u232b') ],
  9   : [ 'Tab', '\u21b9' ],
  12  : [ 'Numpad 5' , '5' ], // shifted numpad 5
  13  : [ 'Enter', '\u21b5' ],
  16  : [ 'Shift', '\u21e7' ],
  17  : [ 'Control', '\u273c' ], // Ctrl symbol - 6 spoked open center asterisk
  18  : [ 'Alt', ($.browser.msie ? 'Alt' : '\u2325') ],
  19  : [ 'Break', 'Break', 'Pause' ],
  20  : [ 'Caps Lock', '\u21ea' ],
  27  : [ 'Escape', 'Esc' ],
  32  : [ 'Space', '&nbsp;' ],
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
  48  : [ '0', '0', ')' ],
  49  : [ '1', '1', '!' ],
  50  : [ '2', '2', '@' ],
  51  : [ '3', '3', '#' ],
  52  : [ '4', '4', '$' ],
  53  : [ '5', '5', '%' ],
  54  : [ '6', '6', '^' ],
  55  : [ '7', '7', '&amp;' ],
  56  : [ '8', '8', '*' ],
  57  : [ '9', '9', '(' ],
  59  : [ ';', ';', ':' ],
  91  : [ 'Command (left)', ((navigator.appVersion.indexOf("Mac")!== -1) ? '\u2318' : 'Win') ],  // \u2318 = mac command
  92  : [ 'Command (right)', ((navigator.appVersion.indexOf("Mac")!== -1) ? '\u2318' : 'Win') ], // \u2318 = mac command
  93  : [ 'Menu Select', 'Sel' ], // Same as right click in Windows
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
  107 : [ '=', '=', '+' ],
  108 : [ 'Numpad Enter', '\u21b5' ], // not in firefox (it's 13)
  109 : [ 'Subtract', '-', '_' ],
  110 : [ 'Numpad Decimal', '.' ], // not in Firefox (it's 46)
  111 : [ 'Divide', '/' ],
  112 : [ 'Help (F1)', 'F1' ], // Doubt this will work since the browser opens the help site
  113 : [ 'F2', 'F2' ],
  114 : [ 'F3', 'F3' ],
  115 : [ 'F4', 'F4' ],
  116 : [ 'Reload (F5)', 'F5' ], // Reload page
  117 : [ 'F6', 'F6' ], // Next pane
  118 : [ 'F7', 'F7' ],
  119 : [ 'F8', 'F8' ],
  120 : [ 'F9', 'F9' ],
  121 : [ 'F10', 'F10' ],
  122 : [ 'Full Screen (F11)', 'F11' ], // Browser full screen mode
  123 : [ 'F12', 'F12' ],
  144 : [ 'Num Lock', 'NmLk' ],
  145 : [ 'Scroll Lock', 'ScrLk' ],
  186 : [ ';', ';', ':' ], // IE
  187 : [ '=', '=', '+' ], // IE
  188 : [ 'Comma', ',', '&lt;' ],
  189 : [ 'Dash', '-', '_' ], // IE
  190 : [ 'Period', '.', '&gt;' ],
  191 : [ '/', '/', '?' ],
  192 : [ '`', '`', '~' ],
  193 : [ '~', '~' ], // which browser/keyboard/os does this work on?
  219 : [ '[', '[', '{' ],
  220 : [ '\\', '\\', '|'],
  221 : [ ']', ']', '}'],
  222 : [ "'", "'", '&quot;' ] // apostrophe/single quote
 };

})(jQuery);
