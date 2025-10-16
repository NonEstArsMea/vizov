from flask import Flask, render_template, jsonify, session, url_for, redirect, request, flash
import json
import os
import logging

# Настраиваем логирование
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# АБСОЛЮТНЫЕ ПУТИ
#BASE_DIR = '/var/www/vizovapp'
BASE_DIR = 'C:/Users/User/Desktop/,/vizov'
TEMPLATE_DIR = os.path.join(BASE_DIR, 'templates')
STATIC_DIR = os.path.join(BASE_DIR, 'static')

logger.info(f"Template directory: {TEMPLATE_DIR}")
logger.info(f"Static directory: {STATIC_DIR}")
logger.info(f"Index.html exists: {os.path.exists(os.path.join(TEMPLATE_DIR, 'index.html'))}")

app = Flask(__name__,
            template_folder=TEMPLATE_DIR,
            static_folder=STATIC_DIR)

# Секретный ключ для сессий
app.secret_key = 'your-secret-key-change-in-production'

# Mock данные пользователей (временная замена БД)
MOCK_USERS = {
    'test@example.com': {
        'password': 'password123',
        'name': 'Тестовый Пользователь',
        'verified': True
    }
}

# Mock данные фотографий
MOCK_PHOTOS = [
    {
        'id': 1,
        'title': 'Закат в горах',
        'price': 500,
        'image_url': '/static/images/sunset.jpg',
        'purchased': True,
        'purchase_date': '2024-10-10'
    },
    {
        'id': 2,
        'title': 'Городская ночь',
        'price': 750,
        'image_url': '/static/images/city_night.jpg',
        'purchased': True,
        'purchase_date': '2024-10-12'
    },
    {
        'id': 3,
        'title': 'Лесная тропа',
        'price': 600,
        'image_url': '/static/images/forest.jpg',
        'purchased': False
    }
]

# Mock данные мероприятий
MOCK_EVENTS = [
    {
        'id': 1,
        'title': 'Мастер-класс по фотографии',
        'date': '2024-11-15 19:00',
        'booked': True,
        'booking_date': '2024-10-05'
    },
    {
        'id': 2,
        'title': 'Выставка современного искусства',
        'date': '2024-11-20 18:00',
        'booked': True,
        'booking_date': '2024-10-08'
    },
    {
        'id': 3,
        'title': 'Воркшоп по обработке фото',
        'date': '2024-12-01 17:00',
        'booked': False
    }
]

# Главная страница
@app.route("/")
def index():
    user_data = session.get('user')
    return render_template("index.html", active_page="index", user=user_data)

@app.route("/anons")
def anons():
    user_data = session.get('user')
    return render_template("anons.html", active_page="anons", user=user_data)

@app.route("/calendar")
def calendar():
    user_data = session.get('user')
    return render_template("calendar.html", active_page="calendar", user=user_data)

@app.route("/kids")
def kids():
    user_data = session.get('user')
    return render_template("kids.html", active_page="kids", user=user_data)

@app.route("/gallery")
def gallery():
    user_data = session.get('user')
    return render_template("gallery.html", user_logged_in=bool(user_data), active_page="gallery", user=user_data)

# Страница входа
@app.route('/login', methods=['GET', 'POST'])
def login():
    # Если пользователь уже авторизован, перенаправляем в профиль
    if session.get('user'):
        return redirect(url_for('profile'))  # ← оставляем эту логику

    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        user = MOCK_USERS.get(email)
        if user and user['password'] == password:
            session['user'] = {
                'email': email,
                'name': user['name'],
                'verified': user['verified']
            }
            flash('Вы успешно вошли в систему!', 'success')
            return redirect(url_for('profile'))
        else:
            flash('Неверный email или пароль', 'error')

    return render_template("login.html")

# Выход
@app.route('/logout')
def logout():
    session.pop('user', None)
    flash('Вы вышли из системы', 'info')
    return redirect(url_for('index'))

# Регистрация (заглушка)
@app.route('/register')
def register():
    flash('Регистрация временно недоступна. Используйте test@example.com / password123', 'info')
    return redirect(url_for('login'))

# Личный кабинет
@app.route('/profile')
def profile():
    user_data = session.get('user')
    if not user_data:
        flash('Пожалуйста, войдите в систему', 'error')
        return redirect(url_for('login'))

    return render_template("profile.html", user=user_data)

# Мои фотографии
@app.route('/profile/photos')
def profile_photos():
    user_data = session.get('user')
    if not user_data:
        return redirect(url_for('login'))

    purchased_photos = [photo for photo in MOCK_PHOTOS if photo.get('purchased')]
    return render_template("profile_photos.html", user=user_data, photos=purchased_photos)

# Мои бронирования
@app.route('/profile/bookings')
def profile_bookings():
    user_data = session.get('user')
    if not user_data:
        return redirect(url_for('login'))

    user_bookings = [event for event in MOCK_EVENTS if event.get('booked')]
    return render_template("profile_bookings.html", user=user_data, bookings=user_bookings)

# Настройки профиля
@app.route('/profile/settings')
def profile_settings():
    user_data = session.get('user')
    if not user_data:
        return redirect(url_for('login'))

    return render_template("profile_settings.html", user=user_data)

# Страница отдельного события
@app.route("/event/<date>")
def event_page(date):
    user_data = session.get('user')
    events_path = os.path.join(os.path.dirname(__file__), "events.json")
    with open(events_path, encoding="utf-8") as f:
        events = json.load(f)

    event = next((e for e in events if e["date"] == date), None)
    if not event:
        return render_template("404.html"), 404
    return render_template("event.html", event=event, user=user_data)

# API для событий (календарь)
@app.route("/api/events")
def api_events():
    events_path = os.path.join(os.path.dirname(__file__), "events.json")
    with open(events_path, encoding="utf-8") as f:
        events = json.load(f)
    return jsonify(events)

# Обработчик 404 ошибок
@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404

# Обработчик 500 ошибок
@app.errorhandler(500)
def internal_error(error):
    return render_template('500.html'), 500


if __name__ == "__main__":
    app.run(debug=True)