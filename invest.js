
"use strict";
    
const request = require('request');

const importantFunction = () =>  console.log('ba' + +'a'+'a')

let properties = [];

const ROI = (amount,years,yeild,rent) =>{

    let newAmount = amount;

    for (let i = 0; i <= years; i++) {
        
        newAmount += ((newAmount*yeild)-rent);

    }

    return Math.round(newAmount);
}

function getPercentageChange(oldNumber, newNumber){
    
    var decreaseValue = oldNumber - newNumber;

    return -Math.round((decreaseValue / oldNumber) * 100)+100
}


const analyseBuyability = obj =>{

    let retalYeild = (obj.bedrooms<=2)?0.054:0.081;

    let housePrice = obj["asking-price"];

    let housePriceFuture = ROI(obj["asking-price"],20,retalYeild,obj["annual-rent-for-comparables"])

    let pricePerFoot = Math.round((housePrice/obj["usable-space"]))

    let schema = {

        originalHousePrice: ("£"+obj["asking-price"]),
        futurePrice: ("£"+Math.round(housePriceFuture)),
        rentalYeildMinusInflation: retalYeild,
        appriciation: getPercentageChange(housePrice,housePriceFuture)+"%"

    }

    properties.push(schema)

}

request.get({
    url:"https://api.immo.capital/v1/recruitment/challenge",
    method:'GET'
},(error, response, body) =>{
    
    if (error) throw error
    
    body = JSON.parse(body)

    for (var i = 0; i < body["potential-investment-properties"].length; i++) {
        
        analyseBuyability(body["potential-investment-properties"][i])

    }

    let toPost = {
        token: "c62a65ef-793c-477e-9a23-fb7051646157",
        name: "Ewan 'lets over complicate simple 5 minute programming questions' Roberts",
        email: "ewan-roberts@hotmail.com",
        phone: "07732551655 - usually i need a drink before i give this out",
        role: "Lots of Node, back-endy goodness, dash of Mongo if im lucky? An API that has had a good REST would be nice too",
        application_bio: "I'm 6 foot 8 so... screwing in lightbulbs i have sown up. I really love events and sockets... Really i just want someone to point me at something hard and give me lots of coffee",
        chosen_property: properties,
        justification_for_choice: "I had wanted to bind the object to something so i used the chosen property attribute, from that you can probably tell i went for the first one. I dont know why but I really overdid this, anyway: Square foot etc is all irrellevant when you're looking over 20 years. Inflation, rent of comparables, having full rooms and appriciation are the whats important here. Take the house price add yeild from renting based on room (5.4% for 2 room, 8.1% for 3 assuming full occupancy) minus compound inflation over 20 years then times by the expected appriciation. Hmmmm quite hard to explain in text, if you're not put off by my Friday afternoon inform tone, email me and i'll just give you the code"
    }

    console.log(properties)

    request.post({

        url: "https://api.immo.capital/v1/recruitment/applications",
        method:"POST",
        form: JSON.stringify(toPost)

    }, (error, response, body) =>{
        if (error) throw error
        console.log(error)
        console.log(body)

    });


});

