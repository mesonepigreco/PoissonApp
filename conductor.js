import customObject from "./object.js";

export class Conductor extends customObject {
	constructor(shape, potential = 0, charge = 0, fix_potential = true) {
		super(shape);
		this.potential = potential;
		this.charge = charge;
		this.fix_potential = fix_potential;

		// Prepare a color for conductors
		this.shape.color = "#cccccc";
	}

	applyFixedPotential(V_array, delta, fix_mask) {
		let Nx = V_array.length;
		let Ny = V_array[0].length;

		for (let i = 0; i < Nx; i++) {
			for (let j = 0; j < Ny; j++) {
				if (this.shape.contains(i, j)) {
					V_array[i][j] = this.potential;
					fix_mask[i][j] = 1;
				}
			}
		}
	}

	draw(ctx) {
		this.shape.draw(ctx);
	}
}


	
