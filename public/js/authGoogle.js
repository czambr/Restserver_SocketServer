// Referencias HTML
const miFormulario = document.querySelector('form')

const url = 'http://localhost:8080/api/auth'

// Eventos
miFormulario.addEventListener('submit', ev => {
    ev.preventDefault()
    const formData = {};

    for (let el of miFormulario.elements) {
        if (el.name.length > 0) {
            formData[el.name] = el.value
        }
    }

    fetch(url + '/login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(resp => resp.json())
        .then(data => {
            const { msg, token } = data

            if (msg) {
                return console.log(msg)
            }
            localStorage.setItem('token', token)
            window.location = 'chat.html'
        })
        .catch(error => {
            console.log(error)
        })
})




function handleCredentialResponse(response) {

    // Google Token: ID_TOKEN
    const body = { id_token: response.credential };
    fetch(url + '/google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors',
        cache: 'default',
        body: JSON.stringify(body),
    })
        .then((resp) => resp.json())
        .then((resp) => {
            const { token } = resp
            localStorage.setItem('token', token)
            localStorage.setItem('email', resp.usuario.correo);
            window.location = 'chat.html'
        })
        .catch(console.log);
}

const button = document.getElementById('google_sigout');
button.onclick = () => {
    console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect();

    google.accounts.id.revoke(localStorage.getItem('email'), (done) => {
        localStorage.clear();
        location.reload();
    });
};