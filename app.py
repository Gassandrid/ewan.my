from flask import *
import mysql.connector
import json

app = Flask(__name__)

credentials = json.load(open('credentials.json'))

@app.route('/temp', methods=['GET'])
def temp():
    database = mysql.connector.connect(
            host=credentials['host'],
            user=credentials['user'],
            password=credentials['password'],
            database=credentials['database']
                )
    cursor = database.cursor()

    # Your query to return records with ID 20 through 30 [inclusive]
    # from the test_data table
    query = "SELECT * FROM test_data WHERE id BETWEEN 20 AND 30"

    cursor.execute(query)
    data = cursor.fetchall()

    cursor.close()
    database.close()
    return render_template('temp_chart.html', data=data, name='Ewan Pedersen')

@app.route('/', methods=['GET'])
def default():
    return render_template('index.html')
