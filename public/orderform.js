let currentSubtotal = 0;
let currentTotal = 0;
let currentFee = 0;
let currentRestaurant = null;

//The code used to submit the order
function submitOrder(){
	// let info = {}
	// info.restaurantID = select.selectedIndex;
	// info.restaurantName = select.options[select.selectedIndex].value;
	// info.subtotal = currentSubtotal;
	// info.total = currentTotal;
	// info.fee = currentFee;
	// info.tax = currentSubtotal * 0.1;
	// info.order = order;

	let restaurantID = select.selectedIndex;
	let restaurantName = select.options[select.selectedIndex].value;
	let subtotal = currentSubtotal;
	let total = currentTotal;
	let fee = currentFee;
	let tax = currentSubtotal * 0.1;
	
	const reqBody = {
		restaurantID, restaurantName, subtotal, total, fee, tax, order
	}
	
	req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
			alert("Order placed!")
			console.log(this.responseText);
			order = {}
			selectRestaurant();
		}
	}
					
	req.open("POST", `http://localhost:3000/orders`);
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(reqBody));
}




let aragorn = {
	id: 0,
	name: "Aragorn's Orc BBQ",
	min_order: 20,
	delivery_fee: 5,
	menu: {
		"Appetizers": {
			0: {
				name: "Orc feet",
				description: "Seasoned and grilled over an open flame.",
				price: 5.50
			},
			1: {
				name: "Pickled Orc fingers",
				description: "Served with warm bread, 5 per order.",
				price: 4.00
			},
			2: { //Thank you Kiratchii
				name: "Sauron's Lava Soup",
				description: "It's just really spicy water.",
				price: 7.50
			},
			3: {
				name: "Eowyn's (In)Famous Stew",
				description: "Bet you can't eat it all.",
				price: 0.50
			},
			4: {
				name: "The 9 rings of men.",
				description: "The finest of onion rings served with 9 different dipping sauces.",
				price: 14.50
			}
		},
		"Combos": {
			5: {
				name: "Buying the Farm",
				description: "An arm and a leg, a side of cheek meat, and a buttered biscuit.",
				price: 15.99
			},
			6: {
				name: "The Black Gate Box",
				description: "Lots of unidentified pieces. Serves 50.",
				price: 65.00
			},
			7: {//Thanks to M_Sabeyon
				name: "Mount Doom Roast Special with Side of Precious Onion Rings.",
				description: "Smeagol's favorite.",
				price: 15.75
			},
			8: { //Thanks Shar[TA]
				name: "Morgoth's Scorched Burgers with Chips",
				description: "Blackened beyond recognition.",
				price: 13.33
				
			},
			10: {
				name: "Slab of Lurtz Meat with Greens.",
				description: "Get it while supplies last.",
				price: 17.50
			},
			11: {
				name: "Rangers Field Feast.",
				description: "Is it chicken? Is it rabbit? Or...",
				price: 5.99
			}
		},
		"Drinks": {
			12: {
				name: "Orc's Blood Mead",
				description: "It's actually raspberries - Orc's blood would be gross.",
				price: 5.99
			},
			13: {
				name: "Gondorian Grenache",
				description: "A fine rose wine.",
				price: 7.99
			},
			14: {
				name: "Mordor Mourvedre",
				description: "A less-fine rose wine.",
				price: 5.99
			}
		}	
	}
}

let legolas = {
	id: 1,
	name: "Lembas by Legolas",
	min_order: 15,
	delivery_fee: 3.99,
	menu: {
		"Lembas": {
			0: {
				name: "Single",
				description: "One piece of lembas.",
				price: 3
			},
			1: {
				name: "Double",
				description: "Two pieces of lembas.",
				price: 5.50
			},
			2: { 
				name: "Triple",
				description: "Three pieces, which should be more than enough.",
				price: 8.00
			}
		},
		"Combos": {
			3: {
				name: "Second Breakfast",
				description: "Two pieces of lembas with honey.",
				price: 7.50
			},
			4: {
				name: "There and Back Again",
				description: "All you need for a long journey - 6 pieces of lembas, salted pork, and a flagon of wine.",
				price: 25.99
			},
			5: {
				name: "Best Friends Forever",
				description: "Lembas and a heavy stout.",
				price: 6.60
			}
		}
	}
}

let frodo = {
	id: 2,
	name: "Frodo's Flapjacks",
	min_order: 35,
	delivery_fee: 6,
	menu: {
		"Breakfast": {
			0: {
				name: "Hobbit Hash",
				description: "Five flapjacks, potatoes, leeks, garlic, cheese.",
				price: 9.00
			},
			1: {
				name: "The Full Flapjack Breakfast",
				description: "Eight flapjacks, two sausages, 3 eggs, 4 slices of bacon, beans, and a coffee.",
				price: 14.00
			},
			2: { 
				name: "Southfarthing Slammer",
				description: "15 flapjacks and 2 pints of syrup.",
				price: 12.00
			}
			
		},
		"Second Breakfast": {
			3: {
				name: "Beorning Breakfast",
				description: "6 flapjacks smothers in honey.",
				price: 7.50
			},
			4: {
				name: "Shire Strawberry Special",
				description: "6 flapjacks and a hearty serving of strawberry jam.",
				price: 8
			},
			5: {
				name: "Buckland Blackberry Breakfast",
				description: "6 flapjacks covered in fresh blackberries. Served with a large side of sausage.",
				price: 14.99
			}
		},
		"Elevenses": {
			6: {
				name: "Lembas",
				description: "Three pieces of traditional Elvish Waybread",
				price: 7.70
			},
			7: {
				name: "Muffins of the Marish",
				description: "A variety of 8 different types of muffins, served with tea.",
				price: 9.00
			},
			8: {
				name: "Hasty Hobbit Hash",
				description: "Potatoes with onions and cheese. Served with coffee.",
				price: 5.00
			}
		},
		"Luncheon": {
			9: {
				name: "Shepherd's Pie",
				description: "A classic. Includes 3 pies.",
				price: 15.99
			},
			10: {
				name: "Roast Pork",
				description: "An entire pig slow-roasted over a fire.",
				price: 27.99
			},
			11: {
				name: "Fish and Chips",
				description: "Fish - fried. Chips - nice and crispy.",
				price: 5.99
			}
		},
		"Afternoon Tea": {
			12: {
				name: "Tea",
				description: "Served with sugar and cream.",
				price: 3
			},
			13: {
				name: "Coffee",
				description: "Served with sugar and cream.",
				price: 3.50
			},
			14: {
				name: "Cookies and Cream",
				description: "A dozen cookies served with a vat of cream.",
				price: 15.99
			},
			15: {
				name: "Mixed Berry Pie",
				description: "Fresh baked daily.",
				price: 7.00
			}
		},
		"Dinner": {
			16: {
				name: "Po-ta-to Platter",
				description: "Boiled. Mashed. Stuck in a stew.",
				price: 6
			},
			17: {
				name: "Bree and Apple",
				description: "One wheel of brie with slices of apple.",
				price: 7.99
			},
			18: {
				name: "Maggot's Mushroom Mashup",
				description: "It sounds disgusting, but its pretty good",
				price: 6.50
			},
			19: {
				name: "Fresh Baked Bread",
				description: "A whole loaf of the finest bread the Shire has to offer.",
				price: 6
			},
			20: {
				name: "Pint of Ale",
				description: "Yes, it comes in pints.",
				price: 5
			}
		},
		"Supper": {
			21: {
				name: "Sausage Sandwich",
				description: "Six whole sausages served on a loaf of bread. Covered in onions, mushrooms and gravy.",
				price: 15.99
			},
			22: {
				name: "Shire Supper",
				description: "End the day as you started it, with a dozen flapjacks, 5 eggs, 3 sausages, 7 pieces of bacon, and a pint of ale.",
				price: 37.99
			}
		}
	}
}

//This should also be removed. The restaurant names should also come from the server.
let restaurants = {"Aragorn's Orc BBQ": aragorn, "Lembas by Legolas": legolas, "Frodo's Flapjacks": frodo};


//The drop-down menu
let select = document.getElementById("restaurant-select");
//Stores the currently selected restaurant index to allow it to be set back when switching restaurants is cancelled by user
let currentSelectIndex = select.selectedIndex
//Stores the current restaurant to easily retrieve data. The assumption is that this object is following the same format as the data included above. If you retrieve the restaurant data from the server and assign it to this variable, the client order form code should work automatically.
//Stored the order data. Will have a key with each item ID that is in the order, with the associated value being the number of that item in the order.
let order = {};


//Called on page load. Initialize the drop-down list, add event handlers, and default to the first restaurant.
function init(){
	document.getElementById("restaurant-select").innerHTML = genDropDownList();
	document.getElementById("restaurant-select").onchange = selectRestaurant;
	selectRestaurant();
}

//Generate new HTML for a drop-down list containing all restaurants.
function genDropDownList(){
	let result = '<select name="restaurant-select" id="restaurant-select">';
	Object.keys(restaurants).forEach(elem => {
		result += `<option value="${elem}">${elem}</option>`
	});
	result += "</select>";
	return result;
}

//Called when drop-down list item is changed.
function selectRestaurant(){
	let result = true;
	
	//If order is not empty, confirm the user wants to switch restaurants.
	if(!isEmpty(order)){
		result = confirm("Are you sure you want to clear your order and switch menus?");
	}
	
	//If switch is confirmed, load the new restaurant data
	if(result){
		//Get the selected index and set the current restaurant
		let selected = select.options[select.selectedIndex].value;
		currentSelectIndex = select.selectedIndex;
		currentRestaurant = restaurants[selected];
		currentMenu = currentRestaurant.menu;
		currentFee = currentRestaurant.delivery_fee;
		currentMin = currentRestaurant.min_order;
		currentSubtotal = 0;
		
		//Update the page contents to contain the new menu
		document.getElementById("left").innerHTML = getCategoryHTML(currentRestaurant);
		document.getElementById("middle").innerHTML = getMenuHTML(currentRestaurant);
		
		//Clear the current oder and update the order summary
		order = {};
		updateOrder();
		
		//Update the restaurant info on the page
		let info = document.getElementById("info");
		info.innerHTML = currentRestaurant.name + "<br>Minimum Order: $" + currentRestaurant.min_order + "<br>Delivery Fee: $" + currentRestaurant.delivery_fee + "<br><br>";
	}else{
		//If they refused the change of restaurant, reset the selected index to what it was before they changed it
		let select = document.getElementById("restaurant-select");
		select.selectedIndex = currentSelectIndex;
	}
}

//Given a restaurant object, produces HTML for the left column
function getCategoryHTML(rest){
	let menu = rest.menu;
	let result = "<b>Categories<b><br>";
	Object.keys(menu).forEach(key =>{
		result += `<a href="#${key}">${key}</a><br>`;
		console.log(key);
	});
	return result;
}

//Given a restaurant object, produces the menu HTML for the middle column
function getMenuHTML(rest){
	let menu = rest.menu;
	let result = "";
	//For each category in the menu
	Object.keys(menu).forEach(key =>{
		result += `<b>${key}</b><a name="${key}"></a><br>`;
		//For each menu item in the category
		Object.keys(menu[key]).forEach(id => {
			item = menu[key][id];
			result += `${item.name} (\$${item.price}) <img src='add.png' style='height:20px;vertical-align:bottom;' onclick='addItem(${id})'/> <br>`;
			result += item.description + "<br><br>";
		});
	});
	return result;
}

//Responsible for adding one of the item with given id to the order and updating the summary
function addItem(id){
	if(order.hasOwnProperty(id)){
		order[id].quantity += 1;
	}else{
		order[id] = {}
		order[id].quantity = 1;
		order[id].name = getItemById(id).name;
	}
	updateOrder();
}

//Responsible for removing one of the items with given id from the order and updating the summary
function removeItem(id){
	if(order.hasOwnProperty(id)){
		order[id].quantity -= 1;
		if(order[id].quantity <= 0){
			delete order[id];
		}
		updateOrder();
	}
}

//Reproduces new HTML containing the order summary and updates the page
//This is called whenever an item is added/removed in the order
function updateOrder(){
	let result = "";
	currentSubtotal = 0;
	
	//For each item ID currently in the order
	Object.keys(order).forEach(id =>{
		//Retrieve the item from the menu data using helper function
		//Then update the subtotal and result HTML
		let item = getItemById(id);
		currentSubtotal += (item.price * order[id].quantity);
		result += `${item.name} x ${order[id].quantity} (${(item.price * order[id].quantity).toFixed(2)}) <img src='remove.png' style='height:15px;vertical-align:bottom;' onclick='removeItem(${id})'/><br>`;
	});
	
	//Add the summary fields to the result HTML, rounding to two decimal places
	result += `Subtotal: \$${currentSubtotal.toFixed(2)}<br>`;
	result += `Tax: \$${(currentSubtotal*0.1).toFixed(2)}<br>`;
	result += `Delivery Fee: \$${currentRestaurant.delivery_fee.toFixed(2)}<br>`;
	currentTotal = currentSubtotal + (currentSubtotal*0.1) + currentRestaurant.delivery_fee;
	result += `Total: \$${currentTotal.toFixed(2)}<br>`;
	
	//Decide whether to show the Submit Order button or the Order X more label
	if(currentSubtotal >= currentRestaurant.min_order){
		result += `<button type="button" id="submit" onclick="submitOrder()">Submit Order</button>`
	}else{
		result += `Add \$${(currentRestaurant.min_order - currentSubtotal).toFixed(2)} more to your order.`;
	}
	
	document.getElementById("right").innerHTML = result;
}

//Helper function. Given an ID of an item in the current restaurant's menu, returns that item object if it exists.
function getItemById(id){
	let categories = Object.keys(currentRestaurant.menu);
	for(let i = 0; i < categories.length; i++){
		if(currentRestaurant.menu[categories[i]].hasOwnProperty(id)){
			return currentRestaurant.menu[categories[i]][id];
		}
	}
	return null;
}

//Helper function. Returns true if object is empty, false otherwise.
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}