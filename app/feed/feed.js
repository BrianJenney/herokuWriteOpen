'use strict';

angular.module('myApp.feed', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/feed', {
    templateUrl: 'feed/feed.html',
    controller: 'FeedCtrl'
  });
}])

.controller('FeedCtrl', ['$scope', '$firebase','$location','CommonProp', function($scope, $firebase, $location, CommonProp) {

    var firebaseObj = new Firebase("https://writesource.firebaseio.com/Articles/");


    var sync = $firebase(firebaseObj)
    $scope.articles = sync.$asArray();
    console.log(sync);

    $scope.logout = function(){
    CommonProp.logoutUser();
    }

    //add comment function
    $scope.openComment = function(id){
        var firebaseObj = new Firebase("https://writesource.firebaseio.com/Articles/" + id);


        var sync = $firebase(firebaseObj)
        $scope.postToComment = sync.$asObject();
        console.log($scope.postToComment);

        $('.writeComment').css({"opacity":"1","z-index":"999"})

        $('.posts').css({"opacity":"0"})

        console.log("Done")
    }

    //push comments to firebase
    $scope.writeComment = function(){
        var fb = new Firebase("https://writesource.firebaseio.com/Comments/" + $scope.postToComment.$id);
        console.log(fb)

        var comment = $scope.postToComment.comment;
        console.log(comment)
        var commenter = $scope.postToComment.commenter;

        var article = $firebase(fb);
        article.$push({
            comment: comment,
            commenter: commenter
        })

        $('.writeComment').css({"opacity":"0","z-index":"-1"})

        $('.posts').css({"opacity":"1"})

    }

    //read comments by syncing comments as array
    $scope.readComment = function(id){
        var fb = new Firebase("https://writesource.firebaseio.com/Comments/" + id);
        console.log(fb)

        var sync = $firebase(fb)
        $scope.comments = sync.$asArray();

        console.log($scope.comments);

        $('.readComment').css({"opacity":"1","z-index":"999"})

        $('.posts').css({"opacity":"0"})

    }


    //close comment box
    $scope.closeWriteComment = function(){
        $('.writeComment').css({"opacity":"0","z-index":"-1"})

        $('.posts').css({"opacity":"1"})
    }

    //close reading comments
    $scope.closeReadComment = function(){
       $('.readComment').css({"opacity":"0","z-index":"-1"})

       $('.posts').css({"opacity":"1"})
    }



    ////////////////////////////////////////////

    //opens up dialog and displays text for link user clicked on
    $scope.read = function(id) {
    var firebaseObj = new Firebase("https://writesource.firebaseio.com/Articles/" + id);


    var sync = $firebase(firebaseObj)
    $scope.post = sync.$asObject();
    console.log($scope.post);

    $(".readPost").css({"opacity": "100", "z-index":"9999"})
    }

    //closes dialog
    $scope.closeMe = function(){
        $(".readPost").css({"opacity": "0", "z-index":"-9999"})
    }

    //like functionality - adds +1 each time button clicked
    

    $scope.plusOne = function(id) {
        var fb = new Firebase("https://writesource.firebaseio.com/Articles/" + id);
        
        //prevents from liking more than once
        $('.likeButton').click(function(){
        console.log("clicked")
        $(this).css({"opacity":"0", "display":"none"})
        })
        
        var syn = $firebase(fb);
        var likes = syn.$asArray();
        likes.$loaded(function(likes){

        console.log(likes)

        var thisLikes = likes[0].$value
        console.log(likes[0].$value)
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

