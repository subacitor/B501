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

		firebase.auth().onAuthStateChanged(function (user) {

			// setCookie("uid", user.uid);
			// setCookie("displayName", user.displayName);
			// console.log(user.uid);
			// console.log(user.displayName);

			// $.ajax({
			// 	url: "http://103.121.91.135:8080/api/user/createUser" + uid,
			// })
		})



		// FirebaseUI config.
		var uiConfig = {
			signInSuccessUrl: '../index.html',
			signInOptions: [
				// Leave the lines as is for the providers you want to offer your users.
				firebase.auth.GoogleAuthProvider.PROVIDER_ID,
				// firebase.auth.FacebookAuthProvider.PROVIDER_ID,
				// firebase.auth.TwitterAuthProvider.PROVIDER_ID,
				// firebase.auth.GithubAuthProvider.PROVIDER_ID,
				// firebase.auth.EmailAuthProvider.PROVIDER_ID,
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