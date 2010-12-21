### Features ([Demo](http://mottie.github.com/Keycaster))

* Mouse clicks within the browser window are shown as an animated png.
* All keys typed within the browser window are shown in a popup display (positioned using CSS).
* Options are available to show or hide the shift or delete key
* Meta (shift, alt and control) keys can be set to show when released.

### Default Setup

* **Page Head**

		<!-- jQuery -->
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js" type="text/javascript"></script>

		<!-- Keycaster script -->
		<link href="css/keycaster.css" type="text/css" rel="stylesheet" />
		<script src="js/jquery.keycaster.min.js" type="text/javascript"></script>
		<script type="text/javascript">
		$(document).ready(function(){
			keycaster({
				key : 'value'
			});
		})
		</script>

* **CSS**: (contents of "keycaster.css" shown)

		/* display window */
		#keycaster {
			list-style: none;
			width: 500px;
			text-align: left;
			background: #222;
			border: #555 1px solid;
			border-radius: 1em;
			-moz-border-radius: 1em;
			-webkit-border-radius: 1em;
			padding: 20px;
			position: absolute;
			right : 10px;
			top: 10px;
		}

		/* all keys */
		.keycasterKey {
			font-size: 18px;
			font-weight: 900;
			padding: .2em .5em;
			line-height: 2.2em;
			border: transparent 5px solid;
			white-space: nowrap;
		}

		/* named keys (e.g. Shift, Alt, Insert, etc.) */
		.keycasterKey.namedKeys {
			border-color: #555;
			border-radius: .5em;
			-moz-border-radius: .5em;
			-webkit-border-radius: .5em;
		}

		/* animated png */
		.clickedArea {
			z-index: 9999;
		}

### Default Options

	keycaster({
		// display window
		abbrevName  : true,                    // if true, abbreviated key names will show (not all unicode symbols work in IE, so set this to false)
		lines       : 4,                       // number of lines shown in the window
		displayTime : 1500,                    // time in milliseconds to display the line
		showShift   : false,                   // if true, show shift key
		showBksp    : false,                   // if true, the backspace key will show
		showUnKey   : false,                   // if true, releasing meta keys will add an "un-" meta key message
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
	});

### Option Details

* `abbrevName`
    * If true, the script uses the abbreviated key name from the keycaster.keys object.
    * If false, the full key name as set in the keycaster.keys object will be displayed.
    * Each key is defined in the keycaster.keys object as follows: 

            (event.which value) : [ 'Full key name', 'Abbreviated key name/symbol' ]

    * The abbreviated names include some unicode symbols which don't work in all browsers (namely IE).
    * Default is true.

* `lines`
    * Number of lines to show in the keycaster display window. Each line is an `<li>`
    * Default is 4 lines.

* `displayTime`
    * Time in milliseconds to display each line; started from the last key type.
    * The script removes each line in sequence from the top to bottom, with the bottom containing the most recent key pressed.
    * Default time is 1500.

* `showShift`
    * If true, when the user pressed the shift key, the shift key name or abbreviation will show as pressed in the display window.
    * If false, the shift key will not display in the display window.
    * Default is false.

* `showBksp`
    * If true, the backspace key name or abbreviation will show as pressed in the display window.
    * If false, the backspace will not show and will remove the last pressed key in the display window.
    * Default is false.

* `showUnKey`
    * If true, when the control, alt, shift or command key is released, it will show as "Un-" key in the display window.
    * If false, released keys will be ignored.
    * Default is false.

* `unMessage`
    * If the `showUnKey` is set to true, this text is added to the beginning of the key name in the display window to show that the key was released.
    * Default is 'Un-'.

* `imgUrl`
    * Set the path to the image file that is used when a mouse click is displayed at that position in the browser window.
    * There are other default images to choose from: 'click-red.png', 'click-green.png', 'click-blue.png' and 'click-grey.png'.
    * Default is 'images/click-blue.png'.

* `imgFrames`
    * The image to show a mouse click is by default a png image with six frames to cycle through.
    * The first image is on the far left and the script progressively cycles through each frame or block to animate the image.
    * Default is 6.

* `imgsize`
    * The default animation images have six frames each being 150 pixels in height and width.
    * The script assumes the `imgsize` applies to both the image height and width.
    * Default is 150.

* `imgtime`
    * Time in milliseconds to show each image frame.
    * Default is 75.

* `keyWrapper`
    * Each key in the display window is wrapped by this HTML tag.
    * `kbd` was used by default, but can be changed to any HTML tag as the style is set in the css to the "keycasterKey" class added to these tags.
    * Default is 'kbd'.

* `namedKey`
    * Named keys (keys found in the keycaster.keys object) will have this class name added to the `keyWrapper`.
    * These keys are styled in the CSS to have a rounded border
    * Default is 'namedKeys'.

* `regKey`
    * Regular keys (keys not found in the keycaster.keys object) will have this class name added to the `keyWrapper`.
    * Default is 'regKeys'.

### Todo:

* Map shifted keys.
* Test with international keyboard.
* Make this all into a bookmarklet with options.
