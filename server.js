const mongoose = require('mongoose');
const express = require('express');
const app = express();
const FaggotSchema = new mongoose.Schema({
  name: 'String',
  size: 'String'
});
const Faggot = mongoose.model('Faggot', FaggotSchema);

routeGenerator(app, Faggot,['get','post','put','delete']);

function routeGenerator(app, Model, routes){
  var methods = {
    'get': 'find(',
    'put': 'update(',
    'delete': 'deleteOne('
  }
  routes.forEach(e=>{
    let route='/'+Model.modelName;
    if (e !='post') route += '/:id';
    else{
      var postfn = function(res){
        new Model(req.body).save()
        .then(saved=>res.json(saved))
        .catch(e=>res.end(e));
      }
    }
    (eval("app."+e))(route, function(req,res){
      if (e==='post') postfn(res);
      else{
        eval(Model.modelName+methods[e]
          +JSON.stringify(req.params.id)+')')
          .then(dbObj=>res.json(dbObj))
          .catch(er=>res.end(er))
      }

    })
  });
}
