/*
 * Keycaster Bookmarklet script
 * By Rob Garrison (aka Mottie & Fudgey)
 * Dual licensed under the MIT and GPL licenses.
 *
 * Dependency: jQuery 1.2.6+
 */

(function($){

	// bookmarklet script host
	var files = 'http://mottie.github.com/Keycaster/';

	// Get script
	getScript = function(url){
		if (!$('script[src*="' + url.replace('.min','') + '"]').length) {
			var script = document.createElement('script');
			script.src = files + url;
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
		'<link href="' + files + 'bookmarklet/bookmarklet.css" type="text/css" rel="stylesheet">' +
		'<link href="' + files + 'css/keycaster.css" type="text/css" rel="stylesheet">' +
		'<div class="kc-wrap">' +
			'<div class="kc-close" title="shortcut key: Escape">x</div>' +
			'<div class="kc-hdr">Keycaster Settings</div>' +
			'(Use Shift-F1 to re-open this panel)' +
			'<div style="height:8px;"></div>' +
			'<table width="100%" cellpadding=0 cellspacing=0>' +
			'<tr><td colspan=2><input class="kc-abbrevName" type="checkbox" checked="checked" /> Abbreviated Names</td></tr>' +
			'<tr><td colspan=2><input class="kc-showShift" type="checkbox" /> Show Shift key</td></tr>' +
			'<tr><td colspan=2><input class="kc-showBksp" type="checkbox" /> Show Backspace</td></tr>' +
			'<tr><td><input class="kc-showUnKey" type="checkbox" /> Show "Un-" keys&nbsp;&nbsp;</td><td><input class="kc-unMessage" type="text" value="Un-" /></td></tr>' +
			'<tr><td class="kc-leftPad">' +
				'Click Color:</td><td>' +
				'<select class="kc-imgUrl">' +
					'<option value="black">Black</option>' +
					'<option value="blue" selected>Blue</option>' +
					'<option value="green">Green</option>' +
					'<option value="grey">Grey</option>' +
					'<option value="red">Red</option>' +
					'<option value="white">White</option>' +
				'</select></td></tr>' +
				'<tr><td class="kc-leftPad">Lines to show:</td><td><input class="kc-lines" type="text" value="4" /></td></tr>' +
				'<tr><td class="kc-leftPad">Display Time :</td><td><input class="kc-displayTime" type="text" value="1500" /></td></tr>' +
			'</table' +
			'</div>' +
		'</div>');

		var kc = $('.kc-wrap');

		$(document).keydown(function(e){
			// shift f1 to open panel
			if (e.which === 112 && e.shiftKey) { kc.show(); }
			// escape to hide
			if (e.which === 27) { kc.hide(); }
		});
		// close panel
		kc.find('.kc-close').click(function(){
			kc.hide();
		});
		// update plugin options
		kc.find('input, select').bind('change', function(){
			var t, opt = $('#keycaster').data('key').options;
			$.each('abbrevName showShift showBksp showUnKey unMessage imgUrl lines displayTime'.split(' '), function(i,o){
				t = kc.find('.kc-'+o);
				opt[o] = (i<4) ? t.is(':checked') : (i===5) ? 'images/click-' + t.val() + '.png' : t.val();
			});
		});

	};

	// initialization flag
	kc_bookmarklet = false;

	// Load Keycaster
	getScript('js/jquery.keycaster.js');

	// run when loaded
	(function check(){
		if (typeof jQuery !== 'function' || typeof keycaster !== 'function'){
			setTimeout(function(){ check(); }, 100);
		} else if (!kc_bookmarklet) {
			kc_bookmarklet = true;
			init();
		}
	})();

})(jQuery);

