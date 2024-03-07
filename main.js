import { Box } from './shape.js';
import {Conductor} from './conductor.js';
import {start_dragging, move_objects_on_drag, stop_dragging} from './drag_and_drop.js';
import {poisson_one_step, get_electric_field} from './solver.js';
import {draw_efield} from './draw_efield.js';


// Integrate the poisson law
const Delta = 10;

const list_of_items = [];

// Add the event listener to the document
const slider = document.getElementById("potential-slider");
// Add onchange event listener
slider.addEventListener("input", function() {
	// Update the potential value
	update_potential(this.value);
});

// Add the event listener to the add box button
const add_box_button = document.getElementById("add-box");
add_box_button.addEventListener("click", function() {
	add_box();
});

const clear_button = document.getElementById("clear");
clear_button.addEventListener("click", function() {
	clear_boxes();
});

const potentialLabel = document.getElementById("mouse-potential");
const exLabel = document.getElementById("mouse-field-x");
const eyLabel = document.getElementById("mouse-field-y");



function update_potential(value) {
	let label_value = document.getElementById("potential-value");
	label_value.innerHTML = value;

	// Set the potential of the selected objects
	for (let i = 0; i < list_of_items.length; i++) {
		if (list_of_items[i].shape.selected) {
			list_of_items[i].potential = parseFloat(value);
		}
	}
}

function add_box() {
	// Add a box of a conductor
	let box = new Box(10, 10, 20, 20);
	let conductor = new Conductor(box, 0, 0, true);
	list_of_items.push(conductor);
}

function draw_all(ctx) {
	for (let i = 0; i < list_of_items.length; i++) {
		list_of_items[i].draw(ctx);
	}
}

function clear_boxes() {
	for (let i = 0; i < list_of_items.length; i++) {
		list_of_items.pop();
	}
}

// Get the context of the canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Add the event listner to the canvas
canvas.addEventListener("mousedown", function(e) {
	let mouseX = e.clientX - canvas.getBoundingClientRect().left;
	let mouseY = e.clientY - canvas.getBoundingClientRect().top;
	start_dragging(list_of_items, mouseX, mouseY);

	// Also change the potential value to the selected object
	for (let i = 0; i < list_of_items.length; i++) {
		if (list_of_items[i].shape.selected) {
			slider.value = list_of_items[i].potential;
			update_potential(list_of_items[i].potential);
		}
	}
});
canvas.addEventListener("mousemove", function(e) {
	let mouseX = e.clientX - canvas.getBoundingClientRect().left;
	let mouseY = e.clientY - canvas.getBoundingClientRect().top;
	move_objects_on_drag(list_of_items, mouseX, mouseY);

	// Update the value of the potential in the mouse-potential object
	potentialLabel.innerHTML = V_array[mouseX][mouseY];
	exLabel.innerHTML = efield_x[mouseX][mouseY] * 100;
	eyLabel.innerHTML = efield_y[mouseX][mouseY] * 100;
});
canvas.addEventListener("mouseup", function(e) {
	stop_dragging(list_of_items);
});

// Prepare the potential array and the fixed mask
// 2D arrays of the same size as the canvas
const Nx = canvas.width;
const Ny = canvas.height;
let V_array = new Array(Nx);
let fixed_mask = new Array(Nx);
let charge_density = new Array(Nx);
let V_tmp = new Array(Nx);
let efield_x = new Array(parseInt(Nx / Delta));
let efield_y = new Array(parseInt(Nx / Delta));
for (let i = 0; i < Nx; i++) {
	V_array[i] = new Array(Ny);
	fixed_mask[i] = new Array(Ny);
	charge_density[i] = new Array(Ny);
	V_tmp[i] = new Array(Ny);
	efield_x[i] = new Array(parseInt(Ny / Delta));
	efield_y[i] = new Array(parseInt(Ny / Delta));
	for (let j = 0; j < Ny; j++) {
		V_array[i][j] = 0;
		fixed_mask[i][j] = 0;
		charge_density[i][j] = 0;
		V_tmp[i][j] = 0;
		efield_x[i][j] = 0;
		efield_y[i][j] = 0;
	}
}

// Animation frame
let solve_this_step = true;
function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	draw_all(ctx);

	// Draw the electric field	
	draw_efield(ctx, efield_x, efield_y, Delta, 1000);
	

	requestAnimationFrame(animate);


	// Solve the poissons equation
	if (solve_this_step) {
		// Reset the fixed mask
		for (let i = 0; i < Nx; i++) {
			for (let j = 0; j < Ny; j++) {
				fixed_mask[i][j] = 0;
			}
		}
		// Apply the constrains on the potential
		for (let i = 0; i < list_of_items.length; i++) {
			list_of_items[i].applyFixedPotential(V_array, 1.0, fixed_mask);
		}

		// Solve the poisson equation
		poisson_one_step(V_array, fixed_mask, charge_density, V_tmp);

		// Get the electric field
		get_electric_field(V_array, Delta, efield_x, efield_y);
	}

}


// Start the animation
animate();

