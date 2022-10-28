const btn = document.querySelector('.auth__login')
const login = document.querySelector('#textid')
const pass = document.querySelector('#passwordid')

btn.addEventListener('click', (e) => {
	e.preventDefault();
	const user = {
		login : login.value,
		password : pass.value
	}

	fetch('http://localhost:8080/v1/api/auth', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(user),
	})
		.then((res) => res.text())
		.then((data) => {
			localStorage.setItem('auth', data);
			document.location.href= '/admin-page';
		})
})

fetch('http://localhost:8080/v1/api/file/projects')
.then(res => res.json())
.then((res) => {
	res.forEach((el) => {
		
	})
})