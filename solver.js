/*
 * Integrate the poisson law
 * @param {Array} V_array - The array of the potential (2D)
 * @param {Array} fixed_mask - The mask of elements that cannot change (conductors)
 * @param {Array} charge_density - The charge density (2D)
 * @return {Array} V_array - The array of the potential (2D) with the new values
 */
export function poisson_one_step(V_array, fixed_mask, charge_density) {
	Nx = V_array.length;
	Ny = V_array[0].length;

	// Copy the array of the potential
	V_new = V_array.map(function(arr) {
		return arr.slice();
	});
	

	for (let i = 0; i < Nx; i++) {
		for (let j = 0; j < Ny; j++) {
			if (fixed_mask[i][j] == 0) {
				// Apply the periodic boundary conditions
				i_prev = (i - 1 + Nx) % Nx;
				i_next = (i + 1) % Nx;
				j_prev = (j - 1 + Ny) % Ny;
				j_next = (j + 1) % Ny;

				// Integrate the Poisson law
				V_new[i][j] = 0.25 * (V_array[i_prev][j] + V_array[i_next][j] + V_array[i][j_prev] + V_array[i][j_next] + charge_density[i][j]);
			}
		}
	}

	return V_new;
}

/*
 * Evaluate the electric field from the potential
 * Use a Delta resolution with respect to the potential
 *
 * @param {Array} V_array - The array of the potential (2D)
 * @param {Number} Delta - The resolution for the electric field
 * @return {Array} [E_x, E_y] - The electric field (2D) on a grid of Delta resolution
 */
export function get_electric_field(V_array, Delta) {
	Nx = V_array.length;
	Ny = V_array[0].length;

	E_x = [];
	E_y = [];

	for (let i = 0; i < Nx; i+=Delta) {
		E_x.push([]);
		E_y.push([]);
		for (let j = 0; j < Ny; j+=Delta) {
			i_prev = (i - Delta + Nx) % Nx;
			i_next = (i + Delta) % Nx;
			j_prev = (j - Delta + Ny) % Ny;
			j_next = (j + Delta) % Ny;

			// Compute the gradient of the potential
			dV_dx = (V_array[i_next][j] - V_array[i_prev][j]) / (2 * Delta * dx);
			dV_dy = (V_array[i][j_next] - V_array[i][j_prev]) / (2 * Delta * dx);

			// Compute the electric field
			E_x[i].push(-dV_dx);
			E_y[i].push(-dV_dy);
		}
	}

	return [E_x, E_y];
}


