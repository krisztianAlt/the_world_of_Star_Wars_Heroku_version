from flask import Flask, render_template, request, redirect, url_for
# import requests
import data_manager
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)


@app.route('/')
def main_page():
    return render_template('index.html')


@app.route('/registration', methods=['GET', 'POST'])
def user_registration():
    return render_template('registration.html')


@app.route('/registration/add', methods=['POST'])
def add_user_to_database():
    # data validation:
    username = request.form['username']
    password = request.form['password']
    confirm = request.form['confirm']
    existing_usernames = data_manager.existing_users()
    if len(username) == 0:
        registration_error_message = 'Empty username field.'
        return render_template('registration.html', registration_error_message=registration_error_message)
    if username in existing_usernames:
        registration_error_message = 'This username is already exists. Write another one.'
        return render_template('registration.html', registration_error_message=registration_error_message)
    if len(password) == 0:
        registration_error_message = 'Empty password field.'
        return render_template('registration.html', registration_error_message=registration_error_message)
    if len(confirm) == 0:
        registration_error_message = 'Empty confirm field.'
        return render_template('registration.html', registration_error_message=registration_error_message)
    if password != confirm:
        registration_error_message = 'Password does not match the confirm password.'
        return render_template('registration.html', registration_error_message=registration_error_message)
    # salting password and save user:
    salted_password = generate_password_hash(password, method='pbkdf2:sha256', salt_length=8)
    data_manager.add_new_user(username, salted_password)
    return render_template('index.html', registration_succeeded='registration_succeeded')


@app.route('/login', methods=['GET', 'POST'])
def user_login_page():
    return render_template('login.html')


@app.route('/login/user', methods=['GET', 'POST'])
def login_session():
    # data validation:
    username = request.form['username']
    password = request.form['password']
    userdatas = data_manager.get_user_datas(username)
    if len(userdatas) > 0:
        password_in_database = userdatas[0][2]
    else:
        password_in_database = ''
    login_error_message = "Login failed. Invalid username or password."
    if (
        len(username) == 0 or
        len(password) == 0 or
        len(userdatas) == 0 or
        check_password_hash(password_in_database, password) is False
    ):
        return render_template('login.html', login_error_message=login_error_message)
    return render_template('index.html', login_succeeded='login_succeeded', username=username)


if __name__ == '__main__':
    app.run(debug=True)
