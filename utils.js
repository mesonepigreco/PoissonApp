export function floatToString(num, fixed_positions, max_length=8) {
	let stringvalue = num.toFixed(fixed_positions);

	if (stringvalue >= 0) {
		stringvalue = "+" + stringvalue;
	}
	// Add spaces to the front string for
	let n_spaces = max_length - stringvalue.length;
	for (let i = 0; i < n_spaces; i++) {
		stringvalue = " " + stringvalue;
	}
	return stringvalue;
}

