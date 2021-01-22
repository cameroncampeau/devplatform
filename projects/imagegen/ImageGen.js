function ImageGenerator(key) {
	const size = { w: 200, h: 200},
		pixel_size = {w:20, h: 20},
		color_str_length = 6,
		hash_size = 64, // size of hash output in bytes
		num_pixels = Math.ceil(size.w * size.h / (pixel_size.w * pixel_size.h)),
		num_color_chars = num_pixels * color_str_length;
		
		
	var data = genImageData(key);
	
	var hue = getHue(data);

	// Output 64byte hex string 
	function hash(str) {
		return sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(str))
	}

	function genImageData(keystr) {
		var colorStr = "",
		for (var i = 0; i < Math.ceil(num_color_chars / hash_size); i++) {
			colorStr +=hash(colorStr || keystr)
		}
		colorStr = colorStr.substring(0, num_color_chars);
		return colorStr;
	}
	function drawToCanvas(canvas) {
		canvas.width = size.w;
		canvas.height = size.h;
		var ctx = canvas.getContext("2d");
		
		function drawSquare(x,y,w,c) {
			ctx.fillStyle="#" + c;
			ctx.fillRect(x,y,w, w);
		}
		
		function getMostFrequentChars(str) {
			var hist = [];
			for (var i =0; i < str.length; i++) {
				if (typeof hist[str[i]] != 'undefined') hist[str[i]]++;
				else hist[str[i]] = 0;
			}
			var max = null,
				max2 = null;
			for (l in hist) {
				if (!max || hist[l] > hist[max]) {
					max2 = max;
					max = l;
				} else if (hist[l] > hist[max2]) {
					max2 = l;
				}
			}

			return [max, max2];
		}
		
		function applyHue(color, hue) {
			
			function apply(val, hue) {
				return Math.abs(hex2Str(((hue + (val % 10) - 5) % 16))).toString(16);
			}
			
			function hex2Str(hex) {
				return hex.length < 2 && "0" + hex || hex;
			}
			
			var vals = [parseInt(color.substring(0,2), 16), parseInt(color.substring(2, 4), 16), parseInt(color.substring(4, 6), 16)];
			color = apply(vals[0], hue[0]) + apply(vals[1], hue[1]) + apply(vals[2], hue[2])
			return color;
		}
		
		function getHue(data) {
			var hue = [];
			var dataPerHue = Math.floor(data.length / 3);
			
			for (var i = 0; i < 3; i++) {
				hue[i] = parseInt(getMostFrequentChars(data.substring(dataPerHue * i, dataPerHue * (i + 1))).join(''), 16);
				if (hue[i] < 50) hue[i] += 50;
			}
			
			return hue;
		}
		
		
		var x = 0, y = 0;
		for (var i = 0; i < data.length / color_str_length; i++) {
			var color = applyHue(data.substring(i * color_str_length, (i+1) * color_str_length), hue);
			
			drawSquare(x, y, pixel_size.w, color);
			x = x + pixel_size.w;
			if (x >= size.w) {
				y = y + pixel_size.w;
				x = 0;
			}
		}
		
	}
	return {drawToCanvas}
})();