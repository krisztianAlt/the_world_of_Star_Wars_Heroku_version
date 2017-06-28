import psycopg2


def database_connection():
    try:
        connect_str = "dbname='krisztian' user='krisztian' host='localhost'"
        conn = psycopg2.connect(connect_str)
        conn.autocommit = True
        cursor = conn.cursor()
    except Exception as e:
        print("There is no connection. Invalid dbname, user or password? Please, check it.")
        print(e)
    return cursor, conn


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
