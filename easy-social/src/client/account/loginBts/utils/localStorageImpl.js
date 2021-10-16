var ls_key_exists = function _ls_key_exists(key, ls) {
    return ls ? key in ls : false;
};
export {ls_key_exists};
//export default (typeof localStorage === "undefined" ? null : localStorage);

// if(localStorage == undefined || localStorage === null) {
//   var LocalStorage = require('node-localstorage').LocalStorage;
//   localStorage = new LocalStorage('./scratch');
// }

var localStorageN = ((function(){
  var obj = {};
  return{
    setItem: function(name, value){
      if(name && value) {
        obj[name] = value;
      }
    },
    getItem: function(name) {
      return obj[name] ? obj[name] : undefined;
    },
    removeItem: function(name) {
      if(obj[name]) {
        delete obj[name];
      }
    }
  }
})());


// var LocalStorage = require('node-localstorage').LocalStorage;
// localSt = new LocalStorage('./scratch');
// console.log("node-localstorage: ",localSt);

export default (typeof localStorage === "undefined" ? localStorageN : localStorage);
