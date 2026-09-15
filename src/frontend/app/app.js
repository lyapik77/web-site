const API_URL = 'http://localhost:3000/api/user/registration';

const form = document.getElementById('registerForm');
const submitBtn = document.getElementById('submitBtn');
const serverError = document.getElementById('serverError');
const successMsg = document.getElementById('successMsg');

// === ОТЛАДКА: проверим, что скрипт загрузился и элементы найдены ===
console.log('=== SCRIPT LOADED ===');
console.log('API_URL:', API_URL);
console.log('form:', form);
console.log('submitBtn:', submitBtn);
console.log('serverError:', serverError);
console.log('successMsg:', successMsg);

if (!form) console.error('НЕ НАЙДЕН элемент #registerForm — проверь id формы в HTML');
if (!submitBtn) console.error('НЕ НАЙДЕН элемент #submitBtn — проверь id кнопки в HTML');
if (!serverError) console.error('НЕ НАЙДЕН элемент #serverError');
if (!successMsg) console.error('НЕ НАЙДЕН элемент #successMsg');

// Валидация на клиенте
function validate(data) {
  const errors = {};

  if (!data.name_user || data.name_user.length < 3) {
    errors.name_user = 'Минимум 3 символа';
  }
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Некорректный email';
  }
  if (!data.password || data.password.length < 6) {
    errors.password = 'Минимум 6 символов';
  }
  if (data.password !== data.password2) {
    errors.password2 = 'Пароли не совпадают';
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
    console.log('2. data из формы:', data);

    // Клиентская валидация
    const errors = validate(data);
    console.log('3. errors валидации:', errors);
    if (Object.keys(errors).length > 0) {
      showErrors(errors);
      console.warn('STOP: клиентская валидация не прошла, на бек не отправляем');
      return;
    }
    showErrors({});

    // Отправка на бек
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';

    console.log('4. ОТПРАВЛЯЮ AXIOS на', API_URL);

    try {
      const res = await axios.post(
        API_URL,
        {
          name_user: data.name_user,
          email: data.email,
          password: data.password,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000, // 10 сек — чтобы не висеть в pending вечно
        }
      );

      console.log('5. ОТВЕТ ПОЛУЧЕН, status =', res.status, res.statusText);
      const result = res.data;
      console.log('6. тело ответа:', result);

      // Успех
      successMsg.textContent = 'Регистрация успешна! Перенаправляем...';

      if (result.token) {
        localStorage.setItem('token', result.token);
      }

      form.reset();

      // Редирект на страницу авторизации через 1.5 сек
        setTimeout(() => {
            window.location.href = './login.html';
      }, 1500);

    } catch (err) {
      // axios бросает ошибку на любой не-2xx статус.
      // Разбираем её аккуратно.
      if (err.response) {
        // Сервер ответил, но статус 4xx/5xx
        const status = err.response.status;
        const result = err.response.data || {};
        console.error('7. ОШИБКА СЕРВЕРА:', status, result);

        if (result.errors && typeof result.errors === 'object') {
          showErrors(result.errors);
        } else {
          serverError.textContent = result.message || `Ошибка ${status}`;
        }
      } else if (err.request) {
        // Запрос ушёл, но ответа нет (CORS, сервер не отвечает, таймаут)
        console.error('7. НЕТ ОТВЕТА ОТ СЕРВЕРА:', err.message);
        serverError.textContent = 'Сервер не отвечает.';
      } else {
        // Ошибка на этапе формирования запроса
        console.error('7. ОШИБКА ЗАПРОСА:', err.message);
        serverError.textContent = 'Ошибка запроса: ' + err.message;
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Зарегистрироваться';
    }
  });
}