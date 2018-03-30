module.exports = function future(promise) {  
    return promise.then(data => {
       return [null, data];
    })
    .catch(err => [err]);
 }
 