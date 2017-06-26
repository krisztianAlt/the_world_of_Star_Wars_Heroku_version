from flask import Flask, render_template, request, redirect, url_for
import requests

app = Flask(__name__)
# api_url_planets = 'https://swapi.co/api/planets/'


@app.route('/')
def main_page():
    # planet_request = requests.get(api_url_planets)
    # previous_page = planet_request.json()["previous"]
    # next_page = planet_request.json()["next"]
    # planet_datas = planet_request.json()["results"]
    # print(previous_page, next_page)
    # return render_template('index.html', planet_datas=planet_datas)
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)
