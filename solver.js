/*
 * Integrate the poisson law
 * @param {Array} V_array - The array of the potential (2D)
 * @param {Array} fixed_mask - The mask of elements that cannot change (conductors)
 * @param {Array} charge_density - The charge density (2D)
 * @return {Array} V_array - The array of the potential (2D) with the new values
 */
export function poisson_one_step(V_array, fixed_mask, charge_density, V_new) {
	let Nx = V_array.length;
	let Ny = V_array[0].length;

	for (let i = 0; i < Nx; i++) {
		for (let j = 0; j < Ny; j++) {
			// Check if this is not NaN
			if (!isNaN(V_array[i][j])) {
				if (fixed_mask[i][j] == 0) {
					// Apply the periodic boundary conditions
					let i_prev = (i - 1 + Nx) % Nx;
					let i_next = (i + 1) % Nx;
					let j_prev = (j - 1 + Ny) % Ny;
					let j_next = (j + 1) % Ny;

					// Integrate the Poisson law
					V_new[i][j] = 0.25 * (V_array[i_prev][j] + V_array[i_next][j] + V_array[i][j_prev] + V_array[i][j_next]) + charge_density[i][j];

					if (isNaN(V_new[i][j])) {
						console.log("NaN detected at i = " + i + " j = " + j);
						console.log("i_prev = " + i_prev + " i_next = " + i_next + " j_prev = " + j_prev + " j_next = " + j_next);
						console.log(V_array[i_prev][j]);
						console.log(V_array[i_next][j]);
						console.log(V_array[i][j_prev]);
						console.log(V_array[i][j_next]);
						console.log(charge_density[i][j]);
					}
				}
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
 * @return {Array} [E_x, E_y] - The electric field (2D) on a grid of Delta resolution
 */
export function get_electric_field(V_array, Delta, E_x, E_y) {
	let Nx = V_array.length;
	let Ny = V_array[0].length;


	for (let i = 0; i < Nx; i+=Delta) {
		for (let j = 0; j < Ny; j+=Delta) {
			let i_prev = (i - Delta + Nx) % Nx;
			let i_next = (i + Delta) % Nx;
			let j_prev = (j - Delta + Ny) % Ny;
			let j_next = (j + Delta) % Ny;

			// Compute the gradient of the potential
			E_x[i][j] = - (V_array[i_next][j] - V_array[i_prev][j]) / (2 * Delta);
			E_y[i][j] = -(V_array[i][j_next] - V_array[i][j_prev]) / (2 * Delta);
		}
	}
}

