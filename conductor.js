import {Object} from "./object.js";

export default class Conductor extends Object {
	constructor(shape, potential = 0, charge = 0, fix_potential = true) {
		super(shape);
		this.potential = potential;
		this.charge = charge;
		this.fix_potential = fix_potential;

		// Prepare a color for conductors
		this.color = "#dddddd";
	}

	applyFixedPotential(V_array, delta, fix_mask) {
		Nx = V_array.length;
		Ny = V_array[0].length;

		for (let i = 0; i < Nx; i++) {
			for (let j = 0; j < Ny; j++) {
				if (this.shape.contains(i, j)) {
					V_array[i][j] = this.potential;
					fix_mask[i][j] = 1;
				}
			}
		}
	}
}


	
