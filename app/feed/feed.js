'use strict';

angular.module('myApp.feed', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/feed', {
    templateUrl: 'feed/feed.html',
    controller: 'FeedCtrl'
  });
}])

.controller('FeedCtrl', ['$scope','$firebase','$location','CommonProp', function($scope,$firebase, $location, CommonProp) {


    var firebaseObj = new Firebase("https://writesource.firebaseio.com/Articles/");


    var sync = $firebase(firebaseObj)
    $scope.articles = sync.$asArray();

    $scope.logout = function(){
    CommonProp.logoutUser();
    }

    //add comment function
    $scope.openComment = function(id){
        var firebaseObj = new Firebase("https://writesource.firebaseio.com/Articles/" + id);


        var sync = $firebase(firebaseObj)
        $scope.postToComment = sync.$asObject();
    }

    //push comments to firebase
    $scope.writeComment = function(){
        var fb = new Firebase("https://writesource.firebaseio.com/Comments/" + $scope.postToComment.$id);
        console.log(fb)

        var comment = $scope.postToComment.comment;

        var commenter = $scope.postToComment.commenter;

        var article = $firebase(fb);
        article.$push({
            comment: comment,
            commenter: commenter
        })

    }

    //read comments by syncing comments as array
    $scope.readComment = function(id){
        var fb = new Firebase("https://writesource.firebaseio.com/Comments/" + id);
        console.log(fb)

        var sync = $firebase(fb)
        $scope.comments = sync.$asArray();

    }




    ////////////////////////////////////////////
    $scope.post = "";
    //opens up dialog and displays text for link user clicked on
    $scope.read = function(id) {
    var firebaseObj = new Firebase("https://writesource.firebaseio.com/Articles/" + id);
    var sync = $firebase(firebaseObj)
    $scope.post = sync.$asObject();  

    };


    //like functionality - adds +1 each time button clicked
    

    $scope.plusOne = function(id) {
        var fb = new Firebase("https://writesource.firebaseio.com/Articles/" + id);
        
        //prevents from liking more than once
        $('.likeButton').click(function(){
        $(this).css({"opacity":"0", "display":"none"})
        })
        
        var syn = $firebase(fb);
        var likes = syn.$asArray();
        likes.$loaded(function(likes){

        var thisLikes = likes[0].$value
        var firebaseObj = new Firebase("https://writesource.firebaseio.com/Articles/" + id);
        var article = $firebase(firebaseObj);


        article.$update({
            likes: thisLikes + 1
        }).then(function(ref) {
            console.log(ref.key()); // bar
        }, function(error) {
            console.log("Error:", error);
        });

        })
        console.log(syn)

        console.log(id);

        
    }



}]);

