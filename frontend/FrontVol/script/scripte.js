
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	console.log("signup");
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});



// function getCsrfTokenFromCookie() {
// 	let cookieValue = null;
// 	let name = 'csrfToken';  // Replace this with the name of your CSRF token cookie
// 	if (document.cookie && document.cookie !== '') {
// 		let cookies = document.cookie.split(';');
// 		for (let i = 0; i < cookies.length; i++) {
// 			let cookie = cookies[i].trim();
// 			// Does this cookie string begin with the name we want?
// 			if (cookie.substring(0, name.length + 1) === (name + '=')) {
// 				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
// 				break;
// 			}
// 		}
// 	}
// 	return cookieValue;
// }



document.getElementById('signInForm').addEventListener('submit', function(event) {
	console.log("submit form checked in!");
	// Prevent the default form submission
	event.preventDefault();

	// Get the form data
	var formData = new FormData(event.target);
	const csrfToken = getCookie("csrf-token");
	
	// Send the form data using fetch
	fetch('/api/login/', {
		method: 'POST',
		body: formData,
		credentials: 'include',
		headers:{
			'X-CSRFToken':csrfToken
		}
	})
	.then(response => response.json())  // Parse the JSON from the response
	.then(data => {
		// Handle the data from the response
		showMessage(data.detail, "signInMessage");

		console.log(data);
	})
	.catch(error => console.error('Error:', error));
});

function check_password(){
	let pass1 = document.getElementById("register_pass_1");
	let pass2 = document.getElementById("register_pass_2");
	console.log(pass1.value, "-------", pass2.value);
	if(pass1.value === pass2.value)
		return 1;
	else
		return 0;
}

function showMessage(message, id)
{
	var elem = document.getElementById(id);
	elem.innerHTML = message;

	setTimeout(() => {
		elem.innerHTML = '';
	}, 3000);
}


document.getElementById('signUpForm').addEventListener('submit', function(event) {
	// Prevent the default form submission
	event.preventDefault();

	// Get the form data
	var formData = new FormData(event.target);
	const csrfToken = getCookie("csrf-token");
	console.log("check password: ", check_password());
	if(check_password())
	{
		// Send the form data using fetch
		fetch('/api/register/', {
			method: 'POST',
			body: formData,
			credentials: 'include',
			headers:{
				'X-CSRFToken':csrfToken
			}
		})
		.then(response => response.json())  // Parse the JSON from the response
		.then(data => {
			// Handle the data from the response
			if (data.detail){
				showMessage(data.detail, "signUpMessage");
			}else{
				let errorMessages = [];
				for (let field in data) {
					data[field].forEach(errorMessage => {
						errorMessages.push(`<h3>${field}: ${errorMessage}</h3>`);
					});
				}
				document.getElementById('errorContainerSignUp').innerHTML = errorMessages.join('');
			}
			
			console.log(data);
		})
		.catch(error => console.error('Error:', error));
	}
	else
	{
		showMessage("passwords not matched", 'signUpMessage');
	}

});



async function fetchCsrfToken() {
	const response = await fetch('/api/csrf-token/', {
		credentials: 'include'
	});
	const data = await response.json();
	return data.csrfToken;
}

fetchCsrfToken().then(csrfToken => {
	

	document.querySelector('meta[name="csrf-token"]').setAttribute('content', csrfToken);
	
	console.log(csrfToken);
});


function google_auth(){


		const clientId = '36859905646-l3ad3gji2poscl1u0r2osg2qmnehq405.apps.googleusercontent.com';
		const redirectUri = 'http://localhost:8080/accounts/google/login/callback/';
		const scope = 'profile email';
		const responseType = 'code';

		const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
		console.log(googleAuthUrl)
		// window.location.href = googleAuthUrl;

}

const exchangeCodeForToken = async (authCode) => {
    try {
        const response = await fetch('https://yourdomain.com/api/auth/google/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code: authCode })
        });

        if (response.ok) {
            const data = await response.json();
            const token = data.token;  // Assuming your backend responds with a JWT
            localStorage.setItem('jwt', token);  // Store the JWT in local storage or wherever you manage tokens
        } else {
            console.error('Failed to exchange code for token');
        }
    } catch (error) {
        console.error('Error exchanging code for token:', error);
    }
};

// Capture the authorization code from the URL
const urlParams = new URLSearchParams(window.location.search);
const authCode = urlParams.get('code');
if (authCode) {
    exchangeCodeForToken(authCode);
}