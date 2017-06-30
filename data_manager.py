import os
import psycopg2
import urllib


def database_connection():
    try:
        urllib.parse.uses_netloc.append('postgres')
        url = urllib.parse.urlparse(os.environ.get('DATABASE_URL'))
        connection = psycopg2.connect(
            database=url.path[1:],
            user=url.username,
            password=url.password,
            host=url.hostname,
            port=url.port
        )
        connection.autocommit = True
        cursor = connection.cursor()
    except Exception as e:
        print("There is no connection. Invalid dbname, user or password? Please, check it.")
        print(e)
    return cursor, connection


def query_result(*query):
    try:
        cursor, conn = database_connection()
        cursor.execute(*query)
        rows = cursor.fetchall()
        rows = [list(row) for row in rows]
    except psycopg2.OperationalError as e:
        print('OperationalError')
        print(e)
        rows = ""
    except psycopg2.ProgrammingError as e:
        print("Nothing to print")
        print(e)
        rows = ""
    except psycopg2.IntegrityError as e:
        print('IntegrityError')
        print(e)
        rows = ""
        raise e from query_result()
    finally:
        if conn:
            conn.close()
    return rows


def existing_users():
    existing_usernames = []
    existing_users = query_result("SELECT username FROM sw_users")
    for user in existing_users:
        existing_usernames.append(user[0])
    return existing_usernames


def add_new_user(username, password):
    # query_result('INSERT INTO sw_users (username, password) VALUES (%s, %s);', (username, password))
    query_result("INSERT INTO sw_users (username, password) VALUES ('" + username + "', '" + password + "');")


def get_user_datas(username):
    user_datas = query_result("SELECT * FROM sw_users WHERE username='" + username + "'")
    return user_datas


def add_new_vote(user_name, planet_name, time_now):
    user_id = query_result("SELECT id FROM sw_users WHERE username = '" + user_name + "';")
    query_result("INSERT INTO sw_planet_votes (planet_name, user_id, submission_time) VALUES (%s, %s, %s);",
                 (planet_name, user_id[0][0], time_now))


def get_votes_table():
    votes_table = query_result("""SELECT planet_name, COUNT(*)
                               FROM sw_planet_votes GROUP BY planet_name
                               ORDER BY COUNT(*) DESC, planet_name ASC;""")
    return votes_table
