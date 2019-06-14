// {{if is actiove}}
//     <h1>show</h1>
// {{else}}
//     <h2>do not show </h2>
// {{/if}}

// Handlebars.registerHelper('if',function(conditional,options){
//     if(conditional){
//         return options.fn(this);
//     }else{
//         return options.inverse(this);
//     }
// })

module.exports = {
  //Handlebars.registerHelper("ifCond", function(a, b, options) {
  ifCond: function(a, b, options) {
    if (a == b) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  }
};
