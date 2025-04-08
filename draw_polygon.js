export class Polygon extends Shape {
	constructor(x, y) {
		super(x, y);
		this.points = [(x, y)];
	}

	add_point(x, y) {
		this.points.push([x, y]);
	}

	// function that checks if the point is inside the polygon
	// using the ray-casting algorithm
	contains(x, y) {
		let inside = false;
		for (let i = 0, j = this.points.length - 1; i < this.points.length; j = i++) {
			let xi = this.points[i][0], yi = this.points[i][1];
			let xj = this.points[j][0], yj = this.points[j][1];

			let intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
			if (intersect) inside = !inside;
		}
		return inside;
	}

	draw(ctx) {
		super.draw(ctx);
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.moveTo(this.points[0][0], this.points[0][1]);
		for (let i = 1; i < this.points.length; i++) {
			ctx.lineTo(this.points[i][0], this.points[i][1]);
		}
		ctx.closePath();
		ctx.fill();

		// Draw the border if the polygon is selected
		if (this.selected) {
			ctx.strokeStyle = "#000000";
			ctx.lineWidth = 1;
			ctx.stroke();
		}
		ctx.restore();
	}
}


