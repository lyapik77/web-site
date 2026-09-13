const API_BASE = 'http://localhost:4000/api';

const greetingEl  = document.getElementById('greeting');
const usernameEl  = document.getElementById('username');
const pointsEl    = document.getElementById('pointsValue');
const ordersList  = document.getElementById('ordersList');
const ordersCount = document.getElementById('ordersCount');
const ordersEmpty = document.getElementById('ordersEmpty');
const logoutBtn   = document.getElementById('logoutBtn');

const token = localStorage.getItem('token');

// Без токена в ЛК не пускаем
if (!token) {
  window.location.replace('./login.html');
  throw new Error('Нет токена — редирект на логин');
}

// Axios с автоподстановкой токена
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { Authorization: `Bearer ${token}` },
});

// Любой 401 → на логин
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.replace('./login.html');
    }
    return Promise.reject(err);
  }
);

// Приветствие по времени суток
function getGreeting() {
  const h = new Date().getHours();
  if (h < 6)  return 'Доброй ночи';
  if (h < 12) return 'Доброе утро';
  if (h < 18) return 'Добрый день';
  return 'Добрый вечер';
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

function statusLabel(status) {
  const map = {
    done:      { text: 'Выполнен',    cls: 'order-status--done' },
    pending:   { text: 'В обработке', cls: 'order-status--pending' },
    cancelled: { text: 'Отменён',     cls: 'order-status--cancelled' },
  };
  return map[status] || { text: status, cls: 'order-status--pending' };
}

function renderOrders(orders) {
  ordersList.innerHTML = '';
  ordersCount.textContent = orders.length;

  if (!orders.length) {
    ordersEmpty.hidden = false;
    return;
  }
  ordersEmpty.hidden = true;

  for (const o of orders) {
    const s = statusLabel(o.status);
    const item = document.createElement('div');
    item.className = 'order-item';
    item.innerHTML = `
      <div class="order-icon">☕</div>
      <div class="order-info">
        <p class="order-title">${o.title}</p>
        <p class="order-meta">
          ${formatDate(o.createdAt)} · ${o.itemsCount} поз.
          <span class="order-status ${s.cls}">${s.text}</span>
        </p>
      </div>
      <div class="order-price">${o.total} ₽</div>
    `;
    ordersList.appendChild(item);
  }
}

async function loadDashboard() {
  try {
    // Профиль и заказы — параллельно
    const [profileRes, ordersRes] = await Promise.all([
      api.get('/user/me'),
      api.get('/purchases/get'),
    ]);

    const profile = profileRes.data;
    const orders  = ordersRes.data;

    console.log('Профиль:', profile);
    console.log('Заказы:', orders);

    // Подставляем имя пользователя
    greetingEl.textContent = getGreeting() + ',';
    usernameEl.textContent = profile.name_user || 'Пользователь';
    pointsEl.textContent   = profile.points ?? 0;

    renderOrders(orders);
  } catch (err) {
    console.error('Ошибка загрузки ЛК:', err);

    if (err.response && err.response.status !== 401) {
      greetingEl.textContent = getGreeting() + ',';
      usernameEl.textContent = 'Ошибка загрузки';
      pointsEl.textContent   = '—';
      renderOrders([]);
    }
  }
}

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.replace('./login.html');
});

loadDashboard();