/*
 * Keycaster Bookmarklet script
 * By Rob Garrison (aka Mottie & Fudgey)
 * Dual licensed under the MIT and GPL licenses.
 *
 * Dependency: jQuery 1.2.6+
 */

(function($){
	// Get script - keycasterfiles is a global variable set in the bookmarklet and
	// it points to the domain where the keycaster files are hosted.
	var getScript = function(url){
		if (!$('script[src*="' + url.replace('.min','') + '"]').length) {
			var script = document.createElement('script');
			script.src = keycasterfiles + url;
			script.type = 'text/javascript';
			document.getElementsByTagName('head')[0].appendChild(script);
		}
	},
	// add options panel and setup keycaster
	init = function(){
		// start plugin
		keycaster();

		// add option panel html
		$('body').append('' +
		'<link href="' + keycasterfiles + 'bookmarklet/bookmarklet.css" type="text/css" rel="stylesheet">' +
		'<link href="' + keycasterfiles + 'css/keycaster.css" type="text/css" rel="stylesheet">' +
		'<div class="keycaster-wrap">' +
			'<div class="keycaster-close" title="shortcut key: Escape">x</div>' +
			'<div class="keycaster-hdr">Keycaster Settings</div>' +
			'(Use Shift-F1 to re-open this panel)' +
			'<div style="height:8px;"></div>' +
			'<table width="100%" cellpadding=0 cellspacing=0>' +
			'<tr><td colspan=2><input class="keycaster-abbrevName" type="checkbox" checked="checked" /> Abbreviated Names</td></tr>' +
			'<tr><td colspan=2><input class="keycaster-showShift" type="checkbox" /> Show Shift key</td></tr>' +
			'<tr><td colspan=2><input class="keycaster-showBksp" type="checkbox" /> Show Backspace</td></tr>' +
			'<tr><td><input class="keycaster-showUnKey" type="checkbox" /> Show "Un-" keys&nbsp;&nbsp;</td><td><input class="keycaster-unMessage" type="text" value="Un-" /></td></tr>' +
			'<tr><td class="keycaster-leftPad">' +
				'Click Color:</td><td>' +
				'<select class="keycaster-imgUrl">' +
					'<option value="black">Black</option>' +
					'<option value="blue" selected>Blue</option>' +
					'<option value="green">Green</option>' +
					'<option value="grey">Grey</option>' +
					'<option value="red">Red</option>' +
					'<option value="white">White</option>' +
				'</select></td></tr>' +
				'<tr><td class="keycaster-leftPad">Lines to show:</td><td><input class="keycaster-lines" type="text" value="4" /></td></tr>' +
				'<tr><td class="keycaster-leftPad">Display Time :</td><td><input class="keycaster-displayTime" type="text" value="1500" /></td></tr>' +
			'</table' +
			'</div>' +
		'</div>');

		var kc = $('.keycaster-wrap');

		$(document).keydown(function(e){
			// shift f1 to open panel
			if (e.which === 112 && e.shiftKey) { kc.show(); }
			// escape to hide
			if (e.which === 27) { kc.hide(); }
		});
		// close panel
		kc.find('.keycaster-close').click(function(){
			kc.hide();
		});
		// update plugin options
		kc.find('input, select').bind('change', function(){
			var t, opt = $('#keycaster').data('key').options;
			$.each('abbrevName showShift showBksp showUnKey unMessage imgUrl lines displayTime'.split(' '), function(i,o){
				t = kc.find('.keycaster-'+o);
				opt[o] = (i<4) ? t.is(':checked') : (i===5) ? keycasterfiles + 'images/click-' + t.val() + '.png' : t.val();
			});
		});

	};

	// global variable - initialization flag
	keycasterbookmarklet = false;

	// Load Keycaster
	getScript('js/jquery.keycaster.js');

	// run when loaded
	(function check(){
		if (typeof jQuery !== 'function' || typeof keycaster !== 'function'){
			setTimeout(function(){ check(); }, 100);
		} else if (!keycasterbookmarklet) {
			keycasterbookmarklet = true;
			init();
		}
	})();

})(jQuery);

