from flask import Flask, render_template, jsonify
import json
import os

app = Flask(__name__, static_folder="../static", template_folder="../templates")

# Главная

@app.route("/")
def index():
    return render_template("index.html", active_page="index")

@app.route("/anons")
def anons():
    return render_template("anons.html", active_page="anons")

@app.route("/calendar")
def calendar():
    return render_template("calendar.html", active_page="calendar")

@app.route("/kids")
def kids():
    return render_template("kids.html", active_page="kids")

@app.route("/gallery")
def gallery():
    user_logged_in = False
    return render_template("gallery.html", user_logged_in=user_logged_in, active_page="gallery")

@app.route('/login')
def login():
    return render_template("login.html")

@app.route('/register')
def register():
    return render_template("register.html")


# Страница отдельного события
@app.route("/event/<date>")
def event_page(date):
    # Пример: достаём события из JSON
    events_path = os.path.join(os.path.dirname(__file__), "events.json")
    with open(events_path, encoding="utf-8") as f:
        events = json.load(f)

    event = next((e for e in events if e["date"] == date), None)
    if not event:
        return render_template("404.html"), 404
    return render_template("event.html", event=event)

# API для событий (календарь)
@app.route("/api/events")
def api_events():
    events_path = os.path.join(os.path.dirname(__file__), "events.json")
    with open(events_path, encoding="utf-8") as f:
        events = json.load(f)
    return jsonify(events)

if __name__ == "__main__":
    app.run(debug=True)
