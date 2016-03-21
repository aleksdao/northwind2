var app = angular.module("northwind", []);

app.controller("add", function($scope, $http, $q) {

  $scope.display = function() {
    $http.get("/products")
      .then(function(response) {
        $scope.products = response.data;
    })
  }
  $scope.display();

  $scope.addProduct = function() {
    var newProduct = {
      name: $scope.name,
      priority: $scope.priority
    }
    $http.post("/", newProduct)
      .then(function(response) {
        $scope.display();
      })
  }

  $scope.isNotFirst = function(_product) {
    return $scope.products.indexOf(_product) !== 0;
  }

 $scope.isNotLast = function(_product) {
    return $scope.products.indexOf(_product) !== $scope.products.length - 1;
  }

  var swapPriorities = function(lowerIndex, higherIndex) {
    var lower = $scope.products[lowerIndex];
    var higher = $scope.products[higherIndex];
    var firstProm = $http.put("/" + lower._id, { priority: higher.priority })
      .then(function(response) {
        $scope.products[higherIndex] = response.data;
      });
    var secondProm = $http.put("/" + higher._id, { priority: lower.priority })
      .then(function(response) {
        $scope.products[lowerIndex] = response.data;
      })
    var promArray = [firstProm, secondProm];

    $q.all(promArray);
  }
  $scope.moveUp = function(_product) {
    var higherIndex = $scope.products.indexOf(_product);
    var lowerIndex = higherIndex - 1;
    swapPriorities(lowerIndex, higherIndex);
  }

  $scope.moveDown = function(_product) {
    var lowerIndex = $scope.products.indexOf(_product);
    var higherIndex = lowerIndex + 1;
    swapPriorities(lowerIndex, higherIndex);
  }

  $scope.remove = function(_product) {
    $http.delete("/" + _product._id)
      .then(function(response) {
        $scope.products = response.data;
      })
  }
})

// app.controller()