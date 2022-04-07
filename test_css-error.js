function calculatePrice(price, taxes, description) {
    if (taxes == null){
        taxes = 0.05
    }

takes = taxes ?? 0.05
description = description ?? 'Default Item'
const total = price * (1 + taxes)
console.log(`$c${description} With Tax: £${total}`, "font-weight: bold; color: red")
}

calculatePrice(100, 0.07, "My item")
calculatePrice(100, 0, "My other item")
calculatePrice(100, undefined, "My item")
