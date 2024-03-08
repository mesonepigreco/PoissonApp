const arrowAngle = Math.PI/5.0;
const arrowHead = 5;
const min_norm = 4e-3;
const efield_color = "#00aa00";

export function draw_efield(ctx, efield_x, efield_y, Delta, normalization_factor) {
	// Draw the electric field
	
	// Use the canvas to draw an arrow each Delta pixels pointing toward the direction of the electric field
	for (let i = 0; i < ctx.canvas.width; i += Delta) {
		for (let j = 0; j < ctx.canvas.height; j += Delta) {
			// Draw the electric field
			let x = i;
			let y = j;
			let ex = efield_x[x][y];
			let ey = efield_y[x][y];
			let norm = Math.sqrt(ex*ex + ey*ey);
			if (norm > min_norm) {
				// Draw the arrow
				ctx.save();
				ctx.strokeStyle = efield_color;
				ctx.fillStyle = efield_color;
				ctx.beginPath();
				ctx.moveTo(x, y);
				ctx.lineTo(x + ex*normalization_factor, y + ey*normalization_factor);
				ctx.stroke();
				ctx.closePath();
				ctx.restore();

				// Draw the arrow head
				ctx.beginPath();
				ctx.moveTo(x + ex*normalization_factor, y + ey*normalization_factor);
				let vers_arrow = {
					x : ex / norm,
					y : ey / norm
				};
				let vers_arrow1 = rotate_vector(vers_arrow, -arrowAngle/2);
				let vers_arrow2 = rotate_vector(vers_arrow, arrowAngle/2);
				ctx.lineTo(x + ex*normalization_factor - arrowHead * vers_arrow1.x, y + ey*normalization_factor - arrowHead * vers_arrow1.y);
				ctx.lineTo(x + ex*normalization_factor - arrowHead * vers_arrow2.x, y + ey*normalization_factor - arrowHead * vers_arrow2.y);
				ctx.lineTo(x + ex*normalization_factor, y + ey*normalization_factor);
				ctx.fill();
				ctx.closePath();
				ctx.restore();
			}
		}
	}
}


function rotate_vector(v, angle) {
	return {
		x : v.x * Math.cos(angle) - v.y * Math.sin(angle),
		y : v.x * Math.sin(angle) + v.y * Math.cos(angle)
	};
}
