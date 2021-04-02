const {calculateTip,convertCelciusToFarenhheit: CtoF,convertFarenheitToCelcius: FtoC,get_promise} = require("../src/main");

// test("Should display PASS",() => {

// })

test("Should display calculated Tip",() => {

    const total = calculateTip(100,0.4);
    expect(total).toBe(140);
    if (total!==140){
        throw new Error("Incorrectly calculated the Tip.");
    }
})

test("Should convert 32 F to 0 degree celcius",() => {

    const temp = FtoC(32);
    expect(temp).toBe(0);
})

test("Should convert 0 C to 32 F",() => {

    const temp = CtoF(0);
    expect(temp).toBe(32);
})

test("Should work Asynchronously", (done) => {

    get_promise.then(result => {
        expect(result).toBe("Resolved successfully.");
        done();
    })
   
})

test("Should work Asynchronously",async() => {
    const get_result = await get_promise;
    expect(get_result).toBe("Resolved successfully.");
})


