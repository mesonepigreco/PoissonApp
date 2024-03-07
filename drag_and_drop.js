// Function to check if the mouse is over the rectangle
function isMouseOverRect(mouseX, mouseY) {
    return mouseX > rect.x && mouseX < rect.x + rect.width &&
           mouseY > rect.y && mouseY < rect.y + rect.height;
}

// Function to drag the rectangles

export function move_objects_on_drag(list_of_objects, mouseX, mouseY) {
	for (let i = 0; i < list_of_objects.length; i++) {
		if (list_of_objects[i].shape.is_dragging) {
			let obj = list_of_objects[i].shape;
			obj.x = mouseX - obj.drag_delta_x;
			obj.y = mouseY - obj.drag_delta_y;
		}
	}
}

export function start_dragging(list_of_objects, mouseX, mouseY) {
	for (let i = 0; i < list_of_objects.length; i++) {
		let obj = list_of_objects[i].shape;
		if (obj.contains(mouseX, mouseY)) {
			obj.is_dragging = true;
			obj.drag_delta_x = mouseX - obj.x;
			obj.drag_delta_y = mouseY - obj.y;
			obj.selected = true;
		} else {
			obj.is_dragging = false;
			obj.selected = false;
		}
	}
}

export function stop_dragging(list_of_objects) {
	for (let i = 0; i < list_of_objects.length; i++) {
		list_of_objects[i].shape.is_dragging = false;
	}
}

