function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
    //config firebase
    const firebaseConfig = {
        apiKey: "AIzaSyDD7Y5eelmdHmAW8xEwEcmMAFdZGVDzbSE",
        authDomain: "thuongmaidientu-1211f.firebaseapp.com",
        databaseURL: "https://thuongmaidientu-1211f-default-rtdb.firebaseio.com",
        projectId: "thuongmaidientu-1211f",
        storageBucket: "thuongmaidientu-1211f.appspot.com",
        messagingSenderId: "1008396240937",
        appId: "1:1008396240937:web:c4f4819834bfbac3e37438",
        measurementId: "G-LJM6J3R796"
    };

    const defaultApp = firebase.initializeApp(firebaseConfig);
    const auth = defaultApp.auth();
    const provider = new firebase.auth.GoogleAuthProvider();
    console.log(provider);
    // FirebaseUI config.

    var uiConfig = {
        signInSuccessUrl: '../index.html',
        signInOptions: [
            // Leave the lines as is for the providers you want to offer your users.
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
            // firebase.auth.GithubAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            // firebase.auth.PhoneAuthProvider.PROVIDER_ID,
            // firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
        ],
        // tosUrl and privacyPolicyUrl accept either url string or a callback
        // function.
        // Terms of service url/callback.
        tosUrl: '<Sigin.html>',
        // Privacy policy url/callback.
        privacyPolicyUrl: function () {
            window.location.assign('Sigin.html');
        }
    };

    // Initialize the FirebaseUI Widget using Firebase.
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    // The start method will wait until the DOM is loaded.
    ui.start('#firebaseui-auth-container', uiConfig);

    firebase.auth().onAuthStateChanged(function (user) {
        setCookie("uid", user.uid);
        setCookie("displayName", user.displayName);

        $("#displayName_user").text(user.displayName);
        $("#username").val(user.displayName);
        $("#username_edit").val(user.displayName);
        $("#email_edit").val(user.email);

        console.log(user.uid);
        console.log(user);
        console.log(user.displayName);


        var dataCreateUser = {};
        dataCreateUser.uid = user.uid;
        dataCreateUser.displayName = user.displayName;
        dataCreateUser.email = user.email;
        dataCreateUser.photoURL = user.photoURL;
        dataCreateUser.phoneNumber = user.phoneNumber;

        $.ajax({
            url: "http://103.121.91.135:8080/api/user/createUser?uid=" + user.uid,
            type: "POST",
            dataType: "json",
            data: dataCreateUser,
            success: function (dataCreateUser) {
                console.log("success!");
                console.log(dataCreateUser);
            }
        })
    //==================================================================================
    $(function () {
        $('#pnlEventCalendar').calendar({
            months: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            days: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'],
            onSelect: function (event) {
                $('#lblEventCalendar').text(event.label);
                $('#NgayMuon').val(event.label);
            }
        });
    });
    //==================================================================================
    var apiURL = "http://localhost:3000";
    function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
    function getCookie(cname) {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    // var uid = "";
    // var displayName = "";
    // uid = getCookie('uid');
    // displayName = getCookie('displayName');

    })
    //==================================================================================
    var modal = document.querySelector(".modal_edit_in4");
    window.onclick = function (event) {
        if (event.target == modal) {
            $(".modal_edit_in4").hide();
        }

    }
    //==================================================================================
    $("#SignOut").click(function () {
        firebase.auth().signOut().then(() => {
            // Sign-out successful.
            console.log("Dang xuat thanh cong!");
            setCookie("displayName", "");
            setCookie("uid", "");

            window.location.assign("Login/Sigin.html")
        }).catch((error) => {
            // An error happened.
        });
    })