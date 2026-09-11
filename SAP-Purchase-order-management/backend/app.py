from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return jsonify({
        "message": "SAP Purchase Order Management API is running"
    })


@app.route("/api/test")
def test_api():
    return jsonify({
        "status": "success",
        "message": "REST API is working"
    })


if __name__ == "__main__":
    app.run(debug=True)