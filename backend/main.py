# Import the 'Flask' class from the 'flask' library.
from flask import Flask, g

from app.routes.auth_routes import auth_bp
from app.routes.book_routes import book_bp
from app.routes.comment_routes import comment_bp
from app.routes.tag_routes import tag_bp
from app.routes.bookmark_routes import bookmark_bp
from app.routes.review_vote_routes import review_vote_bp

# We'll use the pre-defined global '__name__' variable to tell Flask where it is.
app = Flask(__name__)

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(book_bp)
app.register_blueprint(comment_bp)
app.register_blueprint(tag_bp)
app.register_blueprint(bookmark_bp)
app.register_blueprint(review_vote_bp)

# This syntax is using a Python decorator, which is essentially a succinct way to wrap a function in another function.
@app.route('/')
def index():
  return "Hello, world!"

# Run our application, by default on port 5000
if __name__ == '__main__':
    app.run()