export default class Shape {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.color = "#000000";
		this.is_dragging = false;
		this.drag_delta_x = 0;
		this.drag_delta_y = 0;
		this.selected = false;
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
		let condition = (x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height);

		return (x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height);
	}

	draw(ctx) {
		super.draw(ctx);
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);

		// Draw the border if the box is selected
		if (this.selected) {
			ctx.strokeStyle = "#ff0000";
			ctx.lineWidth = 2;
			ctx.strokeRect(this.x, this.y, this.width, this.height);
		}
		ctx.restore();
	}
}

