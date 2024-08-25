from flask import Flask, request, jsonify
import util


app = Flask(__name__)

@app.route('/recommend_movie', methods = ['GET','POST'])
def recommend_movie():
    movie_name = request.form['movie_name']

    response = jsonify(util.get_movie_recommendation(movie_name))

    response.headers.add('Access-Control-Allow-Origin','*')

    return response



if __name__ == "__main__":
    print("Starting Python Flask Server For Movie Recommendation System")
    app.run(host='0.0.0.0', port=5001, debug=True)