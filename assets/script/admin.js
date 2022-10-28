const current = document.querySelector('#current');
const total = document.querySelector('#total');
const goalBtn = document.querySelector('.live__save')

const getGoal = async () => {
	const info = await fetch('http://localhost:8080/v1/api/file/status', {
		method: 'GET'
	})
	const json = await info.json();
	console.log(json);
	current.placeholder = json.collected;
	total.placeholder = json.total;
}

getGoal();

goalBtn.addEventListener('click', async (e) => {
	e.preventDefault();
	const info = await fetch('http://localhost:8080/v1/api/file/status', {
		method: 'GET'
	})
	const json = await info.json();
	const goal = {}
	goal.collected = current.value ? current.value : json.collected;
	goal.total = total.value ? total.value : json.total;

	fetch('http://localhost:8080/v1/api/project/status', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': localStorage.getItem('auth')
		},
		body: JSON.stringify(goal),
	})
	.then((info) => {
		window.location.reload();
	})
	
})


const title = document.querySelector('#title');
const img = document.querySelector('#image');
const pdf = document.querySelector('#pdf');
const cardSave = document.querySelector('.cards__save');

const sendImagePdf = async (file, id, type) => {
	const formData = new FormData()
	formData.append(
		'file',
		file,
		file.name
	)
	try {
		await fetch(`http://localhost:8080/v1/api/project/${type}/${id}`, {
			method: 'POST',
			headers: {
				'Authorization': localStorage.getItem('auth')
			},
			body: formData,
		})
		console.log("success")
	} catch (e) {
		alert(e)
	}
}

cardSave.addEventListener('click', async (e) => {
	e.preventDefault();
	fetch('http://localhost:8080/v1/api/project/create', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': localStorage.getItem('auth')
		},
		body: JSON.stringify({ title: title.value }),
	})
		.then(res => res.json())
		.then(async (res) => {
			const { id } = res;
			await sendImagePdf(img.files[0], id, 'image');
			await sendImagePdf(pdf.files[0], id, 'pdf');
			window.location.reload();
		})
})

const getCards = async () => {
	try {
	const json = await fetch('http://localhost:8080/v1/api/project/', {
		method: 'GET',
		headers: {
			'Authorization': localStorage.getItem('auth')
		},
	});
	const data = await json.json();
	console.log(data)
	const container = document.querySelector('.cards__exist.grid.grid__col-2');
	data.forEach((el) => {
		const dataStr = `
			<div class="card">
					<div class="card__image">
							<img src="http://localhost:8080/v1/api/file/${el?.image?.name}">
					</div>
					<p class="card__title">${el.title}</p>
					<div class="card__pdf d-flex align-center justify-between">
							<div class="card__file">
									<img src="./assets/images/icon.png">
							</div>
							<p class="card__pdf-name">${el.pdf.originalName}</p>
							<button class="card__del" id="b${el.id}">Del</button>
					</div>
			</div>
		`;

		container.innerHTML = container.innerHTML += dataStr


	})
	const dels = document.querySelectorAll('.card__del');
	dels.forEach((el) => {
		el.addEventListener('click', () => {
			fetch(`http://localhost:8080/v1/api/project/delete/${el.id.substring(1)}`, {
				method: 'POST',
				headers: {
					'Authorization': localStorage.getItem('auth')
				},
			})
				.then(() => window.location.reload())
		})
	})
	} catch (err) {
		localStorage.clear();
		document.location.href = "/admin"
	}
}

getCards()
