const form = document.querySelector('form');
const currency_one = document.querySelector('#currency_one');
const currency_two = document.querySelector('#currency_two');
const list_one = document.querySelector('#list_one');
const list_two = document.querySelector('#list_two');
const amount = document.querySelector('#amount');
const result = document.querySelector('#result');
const spinner = document.querySelector('#spinner');

const api_url = 'https://open.er-api.com/v6/latest';

fetch(api_url)
.then(res => res.json())
.then(data => {
    const items = data.rates;
    let options = '';
    for (const item in items) {
        options += `<option value="${item}">`;
    }
    list_one.innerHTML = options;
    list_two.innerHTML = options;
});

const renderErr = err => {
    const toastElList = document.querySelectorAll('.toast');
    const toastList = [...toastElList].map(toastEl => new bootstrap.Toast(toastEl, { delay: 3000 }));

    toastList[0]._element.querySelector('.toast-body').innerText = err;
    toastList[0].show();
}

const renderReset = () => {
  result.innerHTML = '';
}

form.addEventListener('submit', e => {

    e.preventDefault();

    spinner.classList.remove('d-none');
    renderReset();

    setTimeout(() => {
        try {
            const currency_one_val = currency_one.value.trim();
            const currency_two_val = currency_two.value.trim();
            const amount_val = Math.abs(Number(amount.value));

            const isEmpty = currency_one_val && currency_two_val && amount_val;

            if(!isEmpty) {
                throw new Error('Do not leave any blank space');
            }

            fetch(api_url + '/' + currency_one_val)
                .then(res => res.json())
                .then(data => {
                    //console.log(data);
                    const convertResult = (data.rates[currency_two_val] * amount_val).toFixed(2);
                    result.innerHTML = `
                    <div class="card border-primary">
                        <div class="card-body text-center">
                            ${amount_val} ${currency_one_val} = ${convertResult} ${currency_two_val}
                        </div>
                    </div>`;
                })
                .catch(err => renderErr(err.message));
        }
        catch (err) {
            renderErr(err.message);
        }

        spinner.classList.add('d-none');
    }, 1500);
});