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

    //initialize variable
    //if user has voted match will be set to true
    var match = false;
    var voterArray = []

    //like functionality - adds +1 each time button clicked
    
    //get current user from login
    var authData = firebaseObj.getAuth();
    if (authData) {
      console.log("Authenticated user with uid:", authData.uid);
      var currentUser = authData.uid;
    }

    $scope.plusOne = function(id) {
        var fb = new Firebase("https://writesource.firebaseio.com/Articles/" + id);
        voterArray = [];
        // //prevents from liking more than once
        // $('.likeButton').click(function(){
        // $(this).css({"opacity":"0", "display":"none"})
        // })

        //location for voters associated with question
        var voters = new Firebase("https://writesource.firebaseio.com/Articles/"+id+"/voters");

        //get value from voters fb and store in
        //temporary array
        voters.once('value', function(snap){
            snap.forEach(function(childSnap){
                var key = childSnap.key();
                var childData = childSnap.val()
                voterArray.push(childData)
            })
        })
        

        //iterate through temporary array 
        //if a match then bool match is true
        if(voterArray.indexOf(currentUser) > -1){
            match = true;
        }

        if(match == false){
        
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
        
        }else{
            console.log("you voted already!")
        }
        
    }



}]);

