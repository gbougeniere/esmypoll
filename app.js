/// TODO : Il conviendra de démontrer que CQRS est simplement un modèle d'écriture possible en CQRS, mais qui présente de nomhreux avantages
/// TODO : il conviendra d'ajouter des stats pour démontrer l'intérêt de la chose et expliquer pourquoi il serait couteux d'obtenir la même chose avec un model relationnel

angular.module('pollApp', ['ngRoute', 'chart.js']).config(function($routeProvider, ChartJsProvider) {
    
    ChartJsProvider.setOptions({ chartColors : [ '#419fc1', '#f8c62b', '#DCDCDC', '#46BFBD', '#00ADF9', '#949FB1', '#4D5360'] });
    
    $routeProvider
    .when("/", {
        templateUrl : "views/vote.htm"
    })
    .when("/admin", {
        templateUrl : "views/admin.htm"
    });
});

