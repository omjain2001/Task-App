const calculateTip = (total,perc) => {
    var tip = total * perc;
    return total + tip;
}

const convertFarenheitToCelcius = (temp) => {

    return (temp - 32) / 1.8;
}

const convertCelciusToFarenhheit = (temp) => {

    return (temp * 1.8) + 32;
}

const get_promise = new Promise((resolve,reject) => {

    setTimeout(() => {
        console.log("This works asynchronously.");
        resolve("Resolved successfully.");
    },2000);

    console.log("This is written after setTimeOut");
})



module.exports = {

    calculateTip,
    convertCelciusToFarenhheit,
    convertFarenheitToCelcius,
    get_promise
}