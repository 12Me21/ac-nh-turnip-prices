//don't need to use localstorage because browser autofill does that for us :)
update();

function update() {
	console.log("E");
	// Update output on any input change
	var buy_price = parseInt(document.getElementById("buy").value);

	var sell_prices = [buy_price, buy_price];
	for (var i = 2; i < 14; i++) {
		sell_prices.push(parseInt(document.getElementById("sell_"+i).value));
	}
	
	localStorage.setItem("sell_prices", JSON.stringify(sell_prices));
	
	const is_empty = sell_prices.every(sell_price => !sell_price);
	if (is_empty) {
		document.getElementById("output").innerHTML = "";
		return;
	}
	
	var output_possibilities = "";
	for (var poss of analyze_possibilities(sell_prices)) {
		var out_line = "<tr><td>" + poss.pattern_description + "</td>"
		for (var day of poss.prices.slice(1)) {
			if (day.min !== day.max) {
				out_line += "<td>"+day.min+".."+day.max+"</td>";
			} else {
				out_line += "<td class='one'>"+day.min+"</td>";
			}
		}
		out_line += "<td class='one'>"+poss.weekMin+"</td><td class='one'>"+poss.weekMax+"</td></tr>";
		output_possibilities += out_line
	}
	
	document.getElementById("output").innerHTML = output_possibilities;
}
