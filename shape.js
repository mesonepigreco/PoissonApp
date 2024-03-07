export default class Shape {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.color = "#000000";
	}

	draw(ctx) {
	}
}

export class Box extends Shape {
	constructor(x, y, width, height) {
		super(x, y);
		this.width = width;
		this.height = height;
	}

	contains(x, y) {
		return (x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height);
	}

	draw(ctx) {
		super.draw(ctx);
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.restore();
	}
}

