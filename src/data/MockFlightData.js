// Pre-occupied seat IDs
const OCCUPIED_3_2 = new Set(["1B", "1E", "2C", "3A", "4D", "5B", "6C", "7E", "8A", "9D"]);
const OCCUPIED_2_3_2 = new Set(["1B", "1E", "1G", "2D", "2H", "3A", "3F", "4E", "5B", "5G", "6D", "7A", "8F"]);

const generateSeats = (columns , totalRows, occupiedSeat ) =>{
const seat = []

for(let row = 1 ; row <= totalRows ; row++){
    for(const col of columns){
        const id = `${row}${col}`
        let category = "standard"
        let price = 0

        if(row === 1){
            category = "Extra Legroom"
            price = 350
        }
        else if (row===2 || row===3){
            category = "premium"
            price = 250
        }
        else if (row >= 4 && row <= 6 &&(col === "A" || col === columns[columns.length-1])){
            category = "Window"
            price = 150
        }
        seat.push({
            id,
            row,
            column : col,
            category,
            price,
            isOccupied : occupiedSeat.has(id)
        })
    }
}
return seat
}

export const FLIGHT_CONFIGS = {
"3-2":{
id: "3-2",
name : "3-2 narrowBody",
groups: [
    ["A","B","C"],
    ["D" , "E"]
],
seats : generateSeats(["A","B","C","D","E"],  10 ,OCCUPIED_3_2 )
},
"2-3-2":{
id: "2-3-2",
name : "2-3-2 narrowBody",
groups: [
    ["A","B"],
    ["C","D","E"],
    ["F","G"]
],
seats : generateSeats(["A","B","C","D","E","F","G"],  8 ,OCCUPIED_2_3_2  )
},
};

//Meals
export const MEAL_OPTIONS = [
  { id: "none", name: "No Meal Selected", price: 0 },
  { id: "free-snack", name: "Complimentary Water & Cookies", price: 0 },
  { id: "veg-combo", name: "Paneer Tikka Wrap + Beverage", price: 250 },
  { id: "nonveg-combo", name: "Chicken Club Sandwich + Beverage", price: 300 },
  { id: "healthy-bowl", name: "Quinoa & Roasted Veggie Bowl", price: 280 },
];