var Listeafaire = angular.module('ListeaFaire', []);

function mainController($scope, $http, $window) {

    //Obtenir la liste (appel à la fonction get dans server.js)
    $http.get('/api/laliste')
        .success(function(data) {
            if (data == 401) $window.location.href = '/accueil';
            else $scope.laliste = data;
        })
        .error(function(data) {
            console.log('Error : ' + data);
    });

    //Obtenir la liste (appel à la fonction get dans server.js)
    $http.get('/api/category')
        .success(function(data) {
            $scope.categories = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error : ' + data);
    });

    $http.get('/api/user')
    .success(function(data) {
        $scope.username = data;
        console.log(data);
    })
    .error(function(data) {
        console.log('Error : ' + data);
});

    //rajout d'une donnée (appel à la fonction post dans server.js)
    $scope.createTodo = function(category, newtask) {
        $http.post('/api/laliste/' + category + '/' + newtask)
            .success(function(data) {
                $scope.laliste = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error : ' + data);
            }); 
    };

    $scope.createCategory = function(category) {
        $http.post('/api/category/' + category)
            .success(function(data) {
                $scope.categories = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error : ' + data);
            }); 
    };

    //rajout d'une donnée (appel à la fonction delete dans server.js)
    $scope.deleteTodo = function(id) {
        $http.delete('/api/laliste/' + id)
            .success(function(data) {
                $scope.laliste = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error : ' + data);
            }); 
    };

    $scope.deleteCategory = function(id) {
        var conf = confirm("Are you sure to delete the entire category?");
        if (conf){
            $http.delete('/api/category/' + id)
                .success(function(data) {
                    $scope.categories = data;
                    console.log(data);
                })
                .error(function(data) {
                    console.log('Error : ' + data);
                }); 
            };
    };

    $scope.check = function(id){
        $http.put('/api/laliste/' + id)
            .success(function(data){
                $scope.laliste = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error : ' + data);
            }); 
    };

    $scope.changename = function(id, newtext){
        $http.put('/api/laliste/todo/' + id + '/' + newtext)
            .success(function(data){
                $scope.newData = {}
                $scope.laliste = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error : ' + data);
            }); 
    };

    $scope.changerPage = function(){
        $window.location.href = '/accueil';
    }
}

function indexController($scope, $http, $window) {
    $scope.formData = {};

    $scope.changerPage = function(){
        $http.post('/api/user/', $scope.formData)
        .success(function(data) {
            $window.location.href = '/taches';
            $scope.formData = {};
            console.log(data);
        })
        .error(function(data) {
            console.log('Error : ' + data);
        }); 
        console.log(data);
    }

    $scope.creerCompte = function(){
        $http.post('/api/createuser/', $scope.formData)
        .success(function(data) {
            $scope.formData = {};
            console.log(data);
        })
        .error(function(data) {
            console.log('Error : ' + data);
        }); 
        console.log(data);
    }
}