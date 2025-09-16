# backend/app/app.py (Flask пример)
from flask import Flask, render_template, jsonify
import json

app = Flask(__name__, static_folder="../static", template_folder="../templates")

# Главная страница (рендер календаря)
@app.route("/")
def calendar():
    return render_template("calendar.html")

# API для событий
@app.route("/api/events")
def get_events():
    with open("events.json", "r", encoding="utf-8") as f:
        events = json.load(f)
    return jsonify(events)

if __name__ == "__main__":
    app.run(debug=True)