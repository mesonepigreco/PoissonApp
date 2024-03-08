/*
 * Integrate the poisson law
 * @param {Array} V_array - The array of the potential (2D)
 * @param {Array} fixed_mask - The mask of elements that cannot change (conductors)
 * @param {Array} charge_density - The charge density (2D)
 * @param {Array} V_new - The new potential (2D) - temporary variable that avoids allocations
 * @param {Float} delta - The resolution for the potential.
 */
export function poisson_one_step(V_array, fixed_mask, charge_density, V_new, delta) {
	let Nx = V_array.length;
	let Ny = V_array[0].length;

	for (let i = 0; i < Nx; i++) {
		for (let j = 0; j < Ny; j++) {
			// Check if this is not NaN
			if (!isNaN(V_array[i][j])) {
				let i_prev = (i - 1 + Nx) % Nx;
				let i_next = (i + 1) % Nx;
				let j_prev = (j - 1 + Ny) % Ny;
				let j_next = (j + 1) % Ny;

				if (fixed_mask[i][j] == 0) {
					// Apply the periodic boundary conditions
				
					// Integrate the Poisson law
					V_new[i][j] = 0.25 * (V_array[i_prev][j] + V_array[i_next][j] + V_array[i][j_prev] + V_array[i][j_next]);// + charge_density[i][j] * delta*delta);

					/*if (isNaN(V_new[i][j])) {
						console.log("NaN detected at i = " + i + " j = " + j);
						console.log("i_prev = " + i_prev + " i_next = " + i_next + " j_prev = " + j_prev + " j_next = " + j_next);
						console.log(V_array[i_prev][j]);
						console.log(V_array[i_next][j]);
						console.log(V_array[i][j_prev]);
						console.log(V_array[i][j_next]);
						console.log(charge_density[i][j]);
					}*/

					// If it is undefined, set it to 0
					if (V_new[i][j] == undefined) {
						V_new[i][j] = 0;
					}
				}

				// Update the charge density
				let nabla2V = (V_array[i_prev][j] + V_array[i_next][j] + V_array[i][j_prev] + V_array[i][j_next] - 4 * V_array[i][j]) / (delta * delta);
				charge_density[i][j] = - nabla2V;
			}
		}
	}

	// Copy the V_new back into V_array
	
	for (let i = 0; i < Nx; i++) {
		for (let j = 0; j < Ny; j++) {
			if (fixed_mask[i][j] == 0) {
				V_array[i][j] = V_new[i][j];
			}
		}
	}
	
}

/*
 * Evaluate the electric field from the potential
 * Use a Delta resolution with respect to the potential
 *
 * @param {Array} V_array - The array of the potential (2D)
 * @param {Number} Delta - The resolution for the electric field
 * @param {Array} E_x - The array of the electric field (2D)
 * @param {Array} E_y - The array of the electric field (2D)
 * @param {Float} delta - The resolution for the potential.
 */
export function get_electric_field(V_array, Delta, E_x, E_y, delta) {
	let Nx_pot = V_array.length;
	let Ny_pot = V_array[0].length;

	let Nx = parseInt(Nx_pot / Delta);
	let Ny = parseInt(Ny_pot / Delta);


	for (let i = 0; i < Nx; i++) {
		for (let j = 0; j < Ny; j++) {
			let i_prev = (i - 1) * Delta;
			let i_next = (i + 1) * Delta;
			let j_prev = (j - 1) * Delta;
			let j_next = (j + 1) * Delta;
			let i_center = i * Delta;
			let j_center = j * Delta;
			i_prev = Math.max(i_prev, 0);
			i_next = Math.min(i_next, Nx_pot - 1);
			j_prev = Math.max(j_prev, 0);
			j_next = Math.min(j_next, Ny_pot - 1);

			// Compute the gradient of the potential
			E_x[i][j] = - (V_array[i_next][j_center] - V_array[i_prev][j_center]) / (2 * Delta * delta);
			E_y[i][j] = -(V_array[i_center][j_next] - V_array[i_center][j_prev]) / (2 * Delta * delta);
		}
	}
}

