from flask import Flask
from flask_cors import CORS
from graphql_server.flask import GraphQLView

from src.schema import schema

app = Flask(__name__)
cors = CORS(
    app,
    resources={r"/graphql": {"origins": "http://localhost:3000", "methods": ["POST"]}},
)

app.add_url_rule(
    "/graphql",
    view_func=GraphQLView.as_view(
        "graphql",
        schema=schema,
        graphiql=True,
    ),
)

if __name__ == "__main__":
    app.run()
