from flask import Flask, render_template, request, redirect, url_for, session, escape, json
import data_manager
import datetime
from werkzeug.security import generate_password_hash, check_password_hash
# good infos about using werkzeug:
# https://stackoverflow.com/questions/23432478/flask-generate-password-hash-not-constant-output


app = Flask(__name__)
app.secret_key = 'Star Trek is almost better'


@app.route('/<vote>', methods=['GET', 'POST'])
@app.route('/')
def main_page(vote='no'):
    if 'username' in session:
        username = session['username']
        return render_template('index.html', username=username, vote=vote)
    return render_template('index.html', vote=vote)


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
    if len(password) < 5:
        registration_error_message = 'Password must be at least five characters long.'
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
    login_error_message = "Login failed. Invalid username or password."
    if len(userdatas) > 0:
        password_in_database = userdatas[0][2]
    else:
        password_in_database = ''
    if (
        len(username) == 0 or
        len(password) == 0 or
        len(userdatas) == 0 or
        check_password_hash(password_in_database, password) is False
    ):
        return render_template('login.html', login_error_message=login_error_message)
    # create session for the logged-in user:
    session['username'] = username
    return redirect(url_for('main_page'))


@app.route('/logout')
def logout():
    # remove the username from the session if it is there
    session.pop('username', None)
    return redirect(url_for('main_page'))


# voting with AJAX (good tips: https://stackoverflow.com/questions/33211811/getting-400-bad-request)
@app.route('/vote', methods=['POST'])
def vote():
    datas_from_Javascript = request.form.to_dict()
    user_name = datas_from_Javascript['user_name']
    planet_name = datas_from_Javascript['planet_name']
    time_now = str(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    print(user_name, planet_name)
    # data_manager.add_new_vote(user_name, planet_name, time_now)
    return json.dumps({'answer': 'This is the answer of Python.'})


# original version of voting -- without AJAX:
# @app.route('/vote/<user_name>/<planet_name>')
# def vote(user_name, planet_name):
#     time_now = str(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
#     data_manager.add_new_vote(user_name, planet_name, time_now)
#     return redirect(url_for('main_page', vote='saved'), code=307)


if __name__ == '__main__':
    app.run(debug=True)
