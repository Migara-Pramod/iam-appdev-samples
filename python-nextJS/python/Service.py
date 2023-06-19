from flask import Flask, render_template
import os

app = Flask(__name__)


@app.route('/')
def index():
  return 'Server Works!'


if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)