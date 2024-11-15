from flask import Flask
from flask_cors import CORS
from graphql_server.flask import GraphQLView

from .schema import schema

app = Flask(__name__)
CORS(app)

## TODO: See how to add blueprints to organize the code in a bette way
app.add_url_rule(
    "/graphql",
    view_func=GraphQLView.as_view(
        "graphql",
        schema=schema,
        graphiql=True,
    ),
)

# Optional, for adding batch query support (used in Apollo-Client)
# app.add_url_rule(
#     "/graphql/batch",
#     view_func=GraphQLView.as_view("graphql", schema=schema, batch=True),
# )

if __name__ == "__main__":
    app.run()
