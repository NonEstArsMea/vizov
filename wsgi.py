import sys
import os

# Добавляем путь к проекту в Python path
sys.path.insert(0, os.path.dirname(__file__))

from app.app import app

if __name__ == "__main__":
    app.run()