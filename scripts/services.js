myApp.service('auth', ['$rootScope', '$firebaseSimpleLogin', '$timeout', '$cookies', function ($rootScope, $firebaseSimpleLogin, $timeout, $cookies) {
    var ref = new Firebase('https://vivid-fire-5435.firebaseio.com/');
    
    //http://stackoverflow.com/questions/21593074/how-to-access-verify-the-contents-of-the-firebase-auth-object-when-using-firebas

    // We start by creating a new, empty scope because unlike controllers, services do not get their own scopes to play with
    var service = $rootScope.$new(true);
    // We use a scope instead of a normlal object because it is much easier to watch for async changes (i.e. the kind from
    // simple login when a user logs in) than if we used a normal object.

    // Then we create a simple login on our new scope.
    service.simpleLogin = $firebaseSimpleLogin(ref);

    // We use a normal watch to see when the user logs in
    service.$watch('simpleLogin.user', function (user) {
        // If the user is null then we know no one is currently signed in.
        if (!user) {
            // So we set isAdmin to false, because a guest can't possibly be an admin.
            service.privledges = {};
            //$cookies.hasSynced = "false";
            // Then return so we don't try to run an admin check.
            return;
        }
        //--------------------------------------------------------------------------------------------

        //if ($cookies.hasSynced != "true") {
            var cleanUser = angular.copy(user);

            delete cleanUser.accessToken;
            delete cleanUser.accessTokenSecret;
            delete cleanUser.firebaseAuthToken;
            cleanUser.avatar = cleanUser.thirdPartyUserData.profile_image_url;
            delete cleanUser.thirdPartyUserData;

            ref.child('users').child(user.uid).child('details').set(cleanUser);
            //$cookies.hasSynced = "true";
        //}

        //services.privledges = {};

        var privledgesRef = ref.child('users').child(user.uid).child('privledges');
        privledgesRef.once('value', function (snapshot) {
            $timeout(function () {
                service.privledges = snapshot.val(); 
            });
        });
        
        service.user = user;

        //--------------------------------------------------------------------------------------------
        // If we have a user, we will generate a location like /admins/twitter:293910 which will either
        // be set to true, be set to false, or not exist (null).
        //var adminRef = ref.child('admins').child(user.uid);
        // Then we request a value for that user's admin status
        //adminRef.once('value', function (snapshot) {
        // We use $timeout to make this next change to the service scope within the angular digestion cycle
        // if we called service.isAdmin = * without this, the update wouldn't occur until the next cycle.
        //  $timeout(function () {
        // Set service.isAdmin to the snapshot value (true, false, or null)
        //    service.isAdmin = snapshot.val(); 
        //});
        //});
    }, true);

    // Everything in this service is asyncronous. So we return the service almost immediately after
    // putting .simpleLogin on it, which means that it will be mostly empty when first given to a controller.
    // This is okay though because any change we make as a result of our $watch will impact the service everywhere
    // even though it's already been returned!
    return service;
}]);