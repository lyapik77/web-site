const API_URL = 'http://localhost:3000/api/user/login'; // ← поменяй под свой бек

const form = document.getElementById('loginForm');
const submitBtn = document.getElementById('submitBtn');
const serverError = document.getElementById('serverError');
const successMsg = document.getElementById('successMsg');

console.log('=== LOGIN SCRIPT LOADED ===');
console.log('API_URL:', API_URL);

// Автоподстановка email, если пришёл с регистрации
const savedEmail = sessionStorage.getItem('registeredEmail');
if (savedEmail) {
  document.getElementById('email').value = savedEmail;
  sessionStorage.removeItem('registeredEmail');
}

// Валидация
function validate(data) {
  const errors = {};

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Некорректный email';
  }
  if (!data.password || data.password.length < 6) {
    errors.password = 'Минимум 6 символов';
  }

  return errors;
}

function showErrors(errors) {
  document.querySelectorAll('.error').forEach(el => (el.textContent = ''));
  document.querySelectorAll('input').forEach(el => el.classList.remove('invalid'));

  for (const [field, msg] of Object.entries(errors)) {
    const errEl = document.querySelector(`[data-error="${field}"]`);
    if (errEl) errEl.textContent = msg;
    const input = document.getElementById(field);
    if (input) input.classList.add('invalid');
  }
}

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('1. submit fired');

    serverError.textContent = '';
    successMsg.textContent = '';

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    console.log('2. data:', data);

    const errors = validate(data);
    if (Object.keys(errors).length > 0) {
      showErrors(errors);
      console.warn('STOP: валидация не прошла');
      return;
    }
    showErrors({});

    submitBtn.disabled = true;
    submitBtn.textContent = 'Вход...';

    console.log('4. ОТПРАВЛЯЮ AXIOS на', API_URL);

    try {
      const res = await axios.post(
        API_URL,
        {
          email: data.email,
          password: data.password,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000,
        }
      );

      console.log('5. ОТВЕТ ПОЛУЧЕН, status =', res.status);
      const result = res.data;
      console.log('6. тело ответа:', result);

      successMsg.textContent = 'Вход выполнен! Перенаправляем...';

      if (result.token) {
        localStorage.setItem('token', result.token);
      }
      if (result.user) {
        localStorage.setItem('user', JSON.stringify(result.user));
      }

      form.reset();

      // Редирект на главную — поправь путь под свой проект
      setTimeout(() => {
        window.location.href = './dashboard.html';
      }, 1000);

    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        const result = err.response.data || {};
        console.error('7. ОШИБКА СЕРВЕРА:', status, result);

        if (result.errors && typeof result.errors === 'object') {
          showErrors(result.errors);
        } else {
          serverError.textContent = result.message || 'Неверный email или пароль';
        }
      } else if (err.request) {
        console.error('7. НЕТ ОТВЕТА ОТ СЕРВЕРА:', err.message);
        serverError.textContent = 'Сервер не отвечает.';
      } else {
        console.error('7. ОШИБКА ЗАПРОСА:', err.message);
        serverError.textContent = 'Ошибка запроса: ' + err.message;
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Войти';
    }
  });
}