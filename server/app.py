# save this as app.py
from flask import Flask
import sqlite3
import os

app = Flask(__name__)


@app.route("/")
def hello():
    return "Hello, World!"


# sqlite stuff :)


def cursor():
    return conn.cursor()


def commit():
    conn.commit()


def start():
    c = cursor()
    c.execute(
        "CREATE TABLE IF NOT EXISTS blocks (user TEXT, child_id INT, day TEXT, count INTEGER)"
    )


def md5sum(m):
    return hashlib.md5(m.encode("utf-8")).hexdigest()


conn = sqlite3.connect("persist.sqlite")
conn.create_function("md5", 1, md5sum)
start()
