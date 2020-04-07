//don't need to use localstorage because browser autofill does that for us :)
if (window.location.hash) {
	var x = window.location.hash.substr(1).split(/\D/g);
	document.getElementById("buy").value = x[0] || "";
	for (var i=2;i<12;i++) {
		document.getElementById("sell_"+i).value = x[i-1] || "";
	}
}

update();

function color(price, base) {
	var p=price/base;
	// p ranges like 0 to 6 (usually ~1)
	// so ideally this should be like
	// 0-1 (gray-red)
	// 1-2 (red-yellow)
	// 2-6 (yellow-green)
	// since the 2-6 range is basicallly nothing
	if(p<1)
		return "gray"//"magenta" //"gray" //whatever"rgb("+(p*100+50)+","+(p*100+50)+","+(p*100+50)+")"
	p = Math.max(p-1,0)/5;
	return "rgb("+((1-p)*2*200+55)+","+(p*2*200+55)+",55)"
}

function cell(min, max, base) {
	if (min != max) {
		return "<td style='background-image: linear-gradient(to right,"+color(min,base)+","+color(max,base)+")'>"+min+".."+max+"</td>";
	} else {
		return "<td class='one' style='background-color:"+color(min,base)+"'>"+min+"</td>";
	}
}

function update() {
	console.log("E");
	// Update output on any input change
	var buy_price = parseInt(document.getElementById("buy").value);

	var sell_prices = [buy_price, buy_price];
	for (var i = 2; i < 14; i++) {
		sell_prices.push(parseInt(document.getElementById("sell_"+i).value));
	}
	window.location.hash = sell_prices.slice(1).map(x=>x||"").join(" ").trimEnd().replace(/ /g,",");
	
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
			out_line += cell(day.min, day.max, poss.prices[1].min);
		}
		out_line += cell(poss.weekMin, poss.weekMax, poss.prices[1].min) + "</tr>";
		output_possibilities += out_line
	}
	
	document.getElementById("output").innerHTML = output_possibilities;
}
