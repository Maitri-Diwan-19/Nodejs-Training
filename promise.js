const cart = ["shoes","tie","pants"];

const promise= createorder(cart);
promise.then(function(orderId){
    console.log(orderId);
    return orderId;
})
.then(function(orderId){
    console.log("hereeeee");
  return proceedToPayment(orderId);

})
.catch(function(err){
    console.log(err.message);
})

function createorder(cart){

    const pr = new Promise(function(resolve,reject){
        //create order
        // validate order
        //order id
        if(!validatecart(cart)){
            const err= new Error("CART IS NOT VALID");
            reject(err);
        }
        const orderId="1233";
        if(orderId){
            setTimeout(function(){
                resolve(orderId);
            },5000);
        }

    });
    return pr;
}
function validatecart(cart){
    return true;
}

function proceedToPayment(orderId){
    console.log('heyyyyyyyyyyy')
   return new Promise(function(resolve,reject){
    resolve("Payment Succesfulll!!!");
   })
}