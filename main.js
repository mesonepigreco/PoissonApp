import { Box, Circle } from './shape.js';
import {floatToString} from './utils.js';
import {Conductor} from './conductor.js';
import {start_dragging, move_objects_on_drag, stop_dragging} from './drag_and_drop.js';
import {poisson_one_step, get_electric_field} from './solver.js';
import {draw_efield, draw_charge_density} from './draw_efield.js';


const canvas = document.getElementById("canvas");
const playground = document.querySelector(".playground");
const playgroundContainer = document.querySelector(".playground-container");
const ctrlPanel = document.querySelector(".ctrl-panel");

const checkEfield = document.getElementById("show-field");
const checkCharge = document.getElementById("show-charge");

// Ensure that the playground width satisfy the correct aspect ratio
function adjustAspectRatio() {
	let aspectRatio = canvas.width / canvas.height;
	let viewportHeight = window.innerHeight;
	let maxHeight = viewportHeight * 0.6;
	let maxWidth = maxHeight * aspectRatio;
	let viewportWidth = window.innerWidth;
	if (maxWidth > viewportWidth) {
		playground.style.width = viewportWidth + "px";
		playground.style.height = (viewportWidth / aspectRatio) + "px";
	}
	if (playground.offsetHeight > maxHeight) {
		playground.style.width = maxWidth + "px";
		playground.style.height = maxHeight + "px";
	}
	else {
		playground.style.width = "100%";
		playground.style.height = "auto";
	}

	ctrlPanel.style.width = playground.style.width;
}

window.addEventListener("resize", adjustAspectRatio);


// Integrate the poisson law
const Delta = 6;
const delta = 2.0;
// The actual size of the simulation
const Lx = canvas.width / delta; //200.0;
const Ly = (Lx * canvas.height) / canvas.width;

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
const add_circle_button = document.getElementById("add-circle");
add_circle_button.addEventListener("click", function() {
	add_circle();
});


const clear_button = document.getElementById("clear");
clear_button.addEventListener("click", function() {
	clear_boxes();
});


const potentialLabel = document.getElementById("mouse-potential");
const exLabel = document.getElementById("mouse-field-x");
const eyLabel = document.getElementById("mouse-field-y");


const chargeValueLabel = document.getElementById("charge-value");



function update_potential(value) {
	let label_value = document.getElementById("potential-value");
	label_value.innerHTML = floatToString(parseFloat(value), 1, 5);

	// Set the potential of the selected objects
	for (let i = 0; i < list_of_items.length; i++) {
		if (list_of_items[i].shape.selected) {
			list_of_items[i].potential = parseFloat(value);
		}
	}
}

function add_box() {
	// Get a random x, y values between 30 and the width of the canvas
	let box_size = 40;
	let x = Math.random() * (Lx - box_size*2) + box_size;
	let y = Math.random() * (Ly - box_size*2) + box_size;

	x *= dx_pixel / delta;
	y *= dy_pixel / delta;

	// Add a box of a conductor
	let box = new Box(x, y, box_size, box_size);
	let conductor = new Conductor(box, 0, 0, true);
	list_of_items.push(conductor);
}
function add_circle() {
	// Get a random x, y values between 30 and the width of the canvas
	let radius = 20;
	let x = Math.random() * (Lx - radius * 2) + radius;
	let y = Math.random() * (Ly - radius * 2) + radius;

	x *= dx_pixel / delta;
	y *= dy_pixel / delta;

	// Add a circle of a conductor
	let circle = new Circle(x, y, 20);
	let conductor = new Conductor(circle, 0, 0, true);
	list_of_items.push(conductor);
}

function draw_all(ctx) {
	for (let i = 0; i < list_of_items.length; i++) {
		list_of_items[i].draw(ctx);
	}
}

function clear_boxes() {
	let ntot = list_of_items.length;
	for (let i = 0; i < ntot; i++) {
		list_of_items.pop();
	}
}

// Get the context of the canvas
const ctx = canvas.getContext("2d");

// Add the event listner to the canvas
canvas.addEventListener("mousedown", function(e) {
	// Get the mouse position, rescaling the width and height of the canvas style
	let rect = canvas.getBoundingClientRect();
	let mouseX = e.clientX - rect.left;
	let mouseY = e.clientY - rect.top;

	let scaleX = canvas.width / rect.width;
	let scaleY = canvas.height / rect.height;

	// Scale the width and height of the canvas
	mouseX *= scaleX;
	mouseY *= scaleY;
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
	let scaleX = canvas.width / canvas.getBoundingClientRect().width;
	let scaleY = canvas.height / canvas.getBoundingClientRect().height;
	mouseX *= scaleX;
	mouseY *= scaleY;
	move_objects_on_drag(list_of_items, mouseX, mouseY);

	// Get the coordinates in the aux system
	mouseX *= Lx / canvas.width;
	mouseY *= Ly / canvas.height;

	// Get the coordinates in the auxiliary position system
	let x_pos = parseInt(mouseX / delta);
	let y_pos = parseInt(mouseY / delta);

	// console.log("x_pos = " + x_pos * dx_pixel + " y_pos = " + y_pos * dy_pixel);
	// for (let i = 0; i < list_of_items.length; i++) {
	// 	let xx = list_of_items[i].shape.x; 
	// 	let yy = list_of_items[i].shape.y;
	// 	console.log("conductor", i, "potential = ", list_of_items[i].potential, "pos = ", xx, yy);
	// 	if (list_of_items[i].shape.contains(mouseX, mouseY)) {
	// 		console.log("Inside!");
	// 	}
	// }

	// console.log(V_array);
	// console.log("x_pos = " + x_pos + " y_pos = " + y_pos);
	// console.log("Lx = ", V_array.length);
	// console.log("Varray[x_pos] = " + V_array[x_pos]);
	

	// Update the value of the potential in the mouse-potential object
	potentialLabel.innerHTML = floatToString(V_array[x_pos][y_pos], 2);
	exLabel.innerHTML = floatToString(efield_x[parseInt(x_pos/Delta)][parseInt(y_pos/Delta)] * 100.0, 2);
	eyLabel.innerHTML = floatToString(efield_y[parseInt(x_pos/Delta)][parseInt(y_pos/Delta)] * 100.0, 2);
});
canvas.addEventListener("mouseup", function(e) {
	stop_dragging(list_of_items);
});

// Prepare the potential array and the fixed mask
// 2D arrays of the same size as the canvas
const Nx = canvas.width;
const Ny = canvas.height;

const dx_pixel = Nx * delta / Lx;
const dy_pixel = Ny * delta / Ly;

const Nx_pot = parseInt(Lx / delta);
const Ny_pot = parseInt(Ly / delta);
let V_array = new Array(Nx_pot);
let fixed_mask = new Array(Nx_pot);
let charge_density = new Array(Nx_pot);
let V_tmp = new Array(Nx_pot);
let efield_x = new Array(parseInt(Nx_pot / Delta));
let efield_y = new Array(parseInt(Nx_pot / Delta));
for (let i = 0; i < Nx_pot; i++) {
	V_array[i] = new Array(Ny_pot);
	fixed_mask[i] = new Array(Ny_pot);
	charge_density[i] = new Array(Ny_pot);
	V_tmp[i] = new Array(Ny_pot);
	efield_x[i] = new Array(parseInt(Ny_pot / Delta));
	efield_y[i] = new Array(parseInt(Ny_pot / Delta));
	for (let j = 0; j < Ny_pot; j++) {
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
let value = 0;
function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

		
	// Draw the electric field	
	if (checkEfield.checked) {
		draw_efield(ctx, Nx_pot, Ny_pot, efield_x, efield_y, Delta, delta, dx_pixel, dy_pixel);
	}

	draw_all(ctx);
	//
	// Draw the charge density
	if (checkCharge.checked) {
		draw_charge_density(ctx, Nx_pot, Ny_pot, charge_density, delta, dx_pixel, dy_pixel);
	}


	requestAnimationFrame(animate);


	// Solve the poissons equation
	if (solve_this_step) {
		// Reset the fixed mask
		for (let i = 0; i < Nx_pot; i++) {
			if (i == 0 || i == Nx_pot - 1) {
				value = 1;
			} else {
				value = 0;
			}
			for (let j = 0; j < Ny_pot; j++) {
				if (j == 0 || j == Ny_pot - 1) {
					value = 1;
				}
				else {
					value = 0;
				}
				fixed_mask[i][j] = value;
			}
		}
		// Apply the constrains on the potential
		for (let i = 0; i < list_of_items.length; i++) {
			list_of_items[i].applyFixedPotential(V_array, dx_pixel, dy_pixel, fixed_mask);
		}

		// Solve the poisson equation
		poisson_one_step(V_array, fixed_mask, charge_density, V_tmp, delta);

		// Get the electric field
		get_electric_field(V_array, Delta, efield_x, efield_y, delta);

	}


	// Update the charge on each conductor
	let total_charge = 0;
	for (let i = 0; i < list_of_items.length; i++) {
		if (list_of_items[i].shape.selected) {
			list_of_items[i].charge = list_of_items[i].shape.get_charge(charge_density, dx_pixel, dy_pixel, delta);
			total_charge += list_of_items[i].charge;
		}
	}
	// Create a string with 2 fixed values of floats but with constant length
	chargeValueLabel.innerHTML = floatToString(total_charge, 2);


}

// Adjust the aspect ratio on page loading
adjustAspectRatio();

// Start the animation
animate();

