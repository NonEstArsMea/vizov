from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

# Связка "кто купил какие фото"
purchases = db.Table(
    "purchases",
    db.Column("user_id", db.Integer, db.ForeignKey("users.id"), primary_key=True),
    db.Column("photo_id", db.Integer, db.ForeignKey("photos.id"), primary_key=True),
    db.Column("timestamp", db.DateTime, default=datetime.utcnow)
)

class User(UserMixin, db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)

    # Фото, которые купил пользователь
    purchased_photos = db.relationship(
        "Photo",
        secondary=purchases,
        back_populates="buyers"
    )

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Photo(db.Model):
    __tablename__ = "photos"

    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    event = db.Column(db.String(100), nullable=True)
    title = db.Column(db.String(255), nullable=True)

    # кто купил это фото
    buyers = db.relationship(
        "User",
        secondary=purchases,
        back_populates="purchased_photos"
    )