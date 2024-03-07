import { Box } from './box.js';
import { Conductor } from './conductor.js';


// Integrate the poisson law
const dx = 0.01;

const list_of_items = [];

// Add the event listener to the document
const slider = document.getElementById("potential-slider");
// Add onchange event listener
slider.addEventListener("input", function() {
	// Update the potential value
	update_potential(this.value);
});
function add_box() {
	// Add a box
}

function update_potential(value) {
	let label_value = document.getElementById("potential-value");
	label_value.innerHTML = value;
}

function add_box() {
	// Add a box of a conductor
	box = new Box(10, 10, 20, 20);
	conductor = new Conductor(box, 0, 0, fix_potential = true);
	list_of_items.push(conductor);
}

function draw_all(ctx) {
	for (let i = 0; i < list_of_items.length; i++) {
		list_of_items[i].draw(ctx);
	}
}

