const arrowAngle = Math.PI/5.0;
const arrowHead = 5;
const min_norm = 4e-2;
const efield_color = "#00aa00";
const normalization_factor = 100.0;

export function draw_efield(ctx, Lx, Ly,  efield_x, efield_y, Delta, delta, dx_pixel, dy_pixel) {
	// Use the canvas to draw an arrow each Delta pixels pointing toward the direction of the electric field
	// Read the correct electric field
	let Nx = parseInt(Lx/Delta);
	let Ny = parseInt(Ly/Delta);

	for (let i = 0; i < Nx; i += 1) {
		for (let j = 0; j < Ny; j += 1) {
			// Draw the electric field
			let x = i * dx_pixel * Delta;
			let y = j * dy_pixel * Delta;
			let ex = efield_x[i][j] * dx_pixel / delta;
			let ey = efield_y[i][j] * dy_pixel / delta;
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


// Draw the charge density
const max_charge_value = 0.3;
export function draw_charge_density(ctx, Nx, Ny, charge_density, delta, dx_pixel, dy_pixel) {
	let max_charge = 0.0;
	for (let i = 0; i < Nx; i++) {
		for (let j = 0; j < Ny; j++) {
			let x = i * dx_pixel;
			let y = j * dy_pixel;
			let rho = charge_density[i][j];
			max_charge = Math.max(max_charge, Math.abs(rho));

			if (rho != 0) {
				ctx.save();
				// Use a color which is semi-transparent
				// The color is red if the charge is positive, blue if the charge is negative, with a gradient in between (maximum value defined by max_charge_value)

				ctx.beginPath();
				if (rho > 0) {
					ctx.fillStyle = "rgba(255, 0, 0, " + Math.min(0.5, Math.abs(rho) / max_charge_value) + ")";
				} else {
					ctx.fillStyle = "rgba(0, 0, 255, " + Math.min(0.5, Math.abs(rho) / max_charge_value) + ")";
				}

				// Prepare a path that is the square represented by the pixel
				ctx.rect(x - dx_pixel/2, y - dx_pixel/2, dx_pixel, dy_pixel);

				ctx.fill();
				ctx.closePath();
				ctx.restore();
			}
		}
	}
	//console.log("Max charge:", max_charge);
}
