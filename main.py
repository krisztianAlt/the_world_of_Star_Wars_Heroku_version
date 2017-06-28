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



if __name__ == '__main__':
    app.run(debug=True)
