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

	contains(x, y) {
		return false;
	}

	get_charge(charge_density, dx, dy, delta) {
		let Nx = charge_density.length;
		let Ny = charge_density[0].length;

		let charge = 0;
		for (let i = 0; i < Nx; i++) {
			for (let j = 0; j < Ny; j++) {
				if (this.contains(i*dx, j*dy)) {
					charge = charge_density[i][j] * delta * delta;
				}
			}
		}
		return charge;
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
			ctx.strokeStyle = "#000000";
			ctx.lineWidth = 1;
			ctx.strokeRect(this.x, this.y, this.width, this.height);
		}
		ctx.restore();
	}
}

export class Circle extends Shape {
	constructor(x, y, radius) {
		super(x, y);
		this.radius = radius;
	}

	contains(x, y) {
		let dx = x - this.x;
		let dy = y - this.y;
		return (dx*dx + dy*dy <= this.radius*this.radius);
	}

	draw(ctx) {
		super.draw(ctx);
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
		ctx.fill();

		// Draw the border if the circle is selected
		if (this.selected) {
			ctx.strokeStyle = "#000000";
			ctx.lineWidth = 1;
			ctx.stroke();
		}
		ctx.restore();
	}
}
	
