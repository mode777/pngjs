export class PNG {

	// initialize all members to keep the same hidden class
	private _width = 0;
	private _height = 0;
	private _bitDepth = 0;
	private _colorType = 0;
	private _compressionMethod = 0;
	private _filterMethod = 0;
	private _interlaceMethod = 0;

	private _colors = 0;
	private _alpha = false;
	private _pixelBits = 0;
	
	private _palette: ArrayLike<number> = null;
	private _pixels: ArrayBuffer = null;

	constructor(){
	};


	get width(){
		return this._width;
	};

	set width(width){
		this._width = width;
	};

	get height(){
		return this._height;
	};

	set height(height: number){
		this._height = height;
	};
	
	get bitDepth(){
		return this._bitDepth;
	};

	set bitDepth(bitDepth: number){
		if ([2, 4, 8, 16].indexOf(bitDepth) === -1){
			throw new Error("invalid bith depth " + bitDepth);
		}
		this._bitDepth = bitDepth;
	};

	get colorType(){
		return this._colorType;
	};

	set colorType(colorType: number){

		//   Color    Allowed    Interpretation
		//   Type    Bit Depths
		//
		//   0       1,2,4,8,16  Each pixel is a grayscale sample.
		//
		//   2       8,16        Each pixel is an R,G,B triple.
		//
		//   3       1,2,4,8     Each pixel is a palette index;
		//                       a PLTE chunk must appear.
		//
		//   4       8,16        Each pixel is a grayscale sample,
		//                       followed by an alpha sample.
		//
		//   6       8,16        Each pixel is an R,G,B triple,
		//                       followed by an alpha sample.

		let colors = 0, alpha = false;

		switch (colorType){
			case 0: colors = 1; break;
			case 2: colors = 3; break;
			case 3: colors = 1; break;
			case 4: colors = 2; alpha = true; break;
			case 6: colors = 4; alpha = true; break;
			default: throw new Error("invalid color type");
		}

		this._colors = colors;
		this._alpha = alpha;
		this._colorType = colorType;
	};

	get colors(){
		return this._colors;
	}
	
	get compressionMethod(){
		return this._compressionMethod;
	};

	set compressionMethod(compressionMethod: number){
		if (compressionMethod !== 0){
			throw new Error("invalid compression method " + compressionMethod);
		}
		this._compressionMethod = compressionMethod;
	};
	
	get filterMethod(){
		return this._filterMethod;
	};

	set filterMethod(filterMethod: number){
		if (filterMethod !== 0){
			throw new Error("invalid filter method " + filterMethod);
		}
		this._filterMethod = filterMethod;
	};
	
	get interlaceMethod(){
		return this._interlaceMethod;
	};
	
	set interlaceMethod(interlaceMethod: number){
		if (interlaceMethod !== 0 && interlaceMethod !== 1){
			throw new Error("invalid interlace method " + interlaceMethod);
		}
		this._interlaceMethod = interlaceMethod;
	};

	set palette(palette: ArrayLike<number>){
		if (palette.length % 3 !== 0){
			throw new Error("incorrect PLTE chunk length");
		}
		if (palette.length > (Math.pow(2, this._bitDepth) * 3)){
			throw new Error("palette has more colors than 2^bitdepth");
		}
		this._palette = palette;
	};

	get palette(){
		return this._palette;
	};

	set pixels(pixels: ArrayBuffer){
		this._pixels = pixels;
	}

	get pixels(){
		return this._pixels;
	}

	/**
	 * get the pixel color on a certain location in a normalized way
	 * result is an array: [red, green, blue, alpha]
	 */
	getPixel(x: number, y: number){
		if (!this._pixels) throw new Error("pixel data is empty");
		if (x >= this._width || y >= this._height){
			throw new Error("x,y position out of bound");
		}
		let i = this._colors * this._bitDepth / 8 * (y * this._width + x);
		let pixels = this._pixels;

		switch (this._colorType){
			case 0: return [pixels[i], pixels[i], pixels[i], 255];
			case 2: return [pixels[i], pixels[i + 1], pixels[i + 2], 255];
			case 3: return [
				this._palette[pixels[i] * 3 + 0],
				this._palette[pixels[i] * 3 + 1],
				this._palette[pixels[i] * 3 + 2],
				255];
			case 4: return [pixels[i], pixels[i], pixels[i], pixels[i + 1]];
			case 6: return [pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]];
		}
	};
	
}
