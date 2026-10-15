const app = document.getElementById("app");
const container = document.getElementById("form-container")

const unitTypes = {
	length:{
		mm: { scale: 0.001, offset: 0 },
		cm: { scale: 0.01,  offset: 0 },
		m:  { scale: 1,     offset: 0 },
		km: { scale: 1000,  offset: 0 },
	},
	weight:{
		mg:{ scale:0.000001, offset: 0 },
		g: { scale: 0.001, offset: 0 },
		kg: { scale: 1, offset: 0 },
		ton: { scale: 1000, offset: 0 }
	},
	temperature:{
		C: { scale: 1, offset: 0 },
		F: { scale: 5 / 9, offset: -32 * 5 / 9 },
		K: { scale: 1,     offset: -273.15 },
	}
}


const appStates = {
	selectedType: "length",
	input: 0,
	output: 0,

	inputUnit: "mm",
	outputUnit: "cm",
}

const unitTypesEl = document.getElementById("unit-type")

const from = document.getElementById("from")
const fromValue = document.getElementById("from-value")

const to = document.getElementById("to")
const toValue = document.getElementById("to-value")


Object.keys(unitTypes).map( item => {
	const option = document.createElement("option");
	option.value = item;
	option.textContent = item

	unitTypesEl.appendChild(option);
} )

unitTypesEl.addEventListener("change", (e)=>{
	appStates.selectedType = e.target.value;

	// Assign the input and output keys of the currently selected type (as they're the units of this type) to input and output units
	appStates.inputUnit = Object.keys(unitTypes[appStates.selectedType])[0];
	appStates.outputUnit = Object.keys(unitTypes[appStates.selectedType])[1];

	update();
})

function update(){
	from.replaceChildren();
	to.replaceChildren();

	Object.keys(unitTypes[appStates.selectedType]).forEach(item =>{
		const option = document.createElement("option")
		option.value = item;
		option.textContent = item;

		from.appendChild(option);
		to.appendChild(option.cloneNode(true));
	})

	from.value = appStates.inputUnit;
	to.value = appStates.outputUnit;

	updateValues();
}

function updateValues(){
	fromValue.value = appStates.input;
	toValue.value = appStates.output;
}

function converstion( value ){
	const units = unitTypes[appStates.selectedType];

	const inp = units[appStates.inputUnit];
	const out = units[appStates.outputUnit];

	const base = value * inp.scale + inp.offset;
	return ( base - out.offset ) / out.scale;
}

function handleFromChange(e){
	const value = e.target.value;
	const output = converstion(value);

	appStates.input = value;
	appStates.output = output

	updateValues();
}

function handleToChange(e){
	const value = e.target.value;
	const input = converstion(value);

	appStates.output = value;
	appStates.input = input;

	updateValues();
}

function handleLableChange( e, type = "input" ){
	if( type == "input" ){
		appStates.inputUnit = e.target.value;
	}else if( type = "output" ){
		appStates.outputUnit = e.target.value;
	}

	update();
}

fromValue.onkeydown = handleFromChange;
toValue.onkeydown = handleToChange;

from.onchange = (e) => handleLableChange(e, "input")
to.onchange = (e) => handleLableChange(e, "output")


update()