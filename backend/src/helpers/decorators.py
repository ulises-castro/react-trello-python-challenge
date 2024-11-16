from functools import wraps
import logging

from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)


def handle_client_error(func):
    """
    Decorator to handle ClientError for a function.
    Logs the error and raises it.
    """

    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except ClientError as err:
            logger.error(
                "An error occurred in %s. Error: %s: %s",
                func.__name__,
                err.response["Error"]["Code"],
                err.response["Error"]["Message"],
            )
            raise

    return wrapper
