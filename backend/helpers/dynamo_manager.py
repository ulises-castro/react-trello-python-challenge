import logging
import boto3
from boto3.dynamodb.conditions import Key
from botocore.exceptions import ClientError
from backend.task_data import DUMMY_TASKS

logger = logging.getLogger(__name__)


class DynamoManager:
    def __init__(self, dyn_resource):
        """
        :param dyn_resource: A Boto3 DynamoDB resource.
        """
        self.dyn_resource = dyn_resource
        self._table = None

    def get_table_ins(self):
        return self._table

    def create_or_load_table(self, table_name):
        """
        Determines whether a table exists. As a side effect, stores the table in
        a member variable.
        """
        try:
            table = self.dyn_resource.Table(table_name)
            table.load()
            exists = True
        except ClientError as err:
            if err.response["Error"]["Code"] == "ResourceNotFoundException":
                return self.create_table(table)
            else:
                logger.error(
                    "Couldn't check for existence of %s. Here's why: %s: %s",
                    table_name,
                    err.response["Error"]["Code"],
                    err.response["Error"]["Message"],
                )
                raise
        else:
            self._table = table
        return exists

    def create_table(self, table_name):
        """
        Creates table to store tasks.
        """
        try:
            self._table = self.dyn_resource.create_table(
                TableName=table_name,
                KeySchema=[
                    {"AttributeName": "taskID", "KeyType": "HASH"},  # Partition key
                ],
                AttributeDefinitions=[
                    {"AttributeName": "taskID", "AttributeType": "S"},
                    {"AttributeName": "createdAt", "AttributeType": "S"},
                    {"AttributeName": "status", "AttributeType": "S"},
                ],
                GlobalSecondaryIndexes=[
                    {
                        "IndexName": "taskStatusIndex",
                        "KeySchema": [
                            {"AttributeName": "status", "KeyType": "HASH"},
                            {"AttributeName": "createdAt", "KeyType": "RANGE"},
                        ],
                        "ProvisionedThroughput": {
                            "ReadCapacityUnits": 5,
                            "WriteCapacityUnits": 5,
                        },
                    },
                ],
                ProvisionedThroughput={
                    "ReadCapacityUnits": 10,
                    "WriteCapacityUnits": 10,
                },
            )
            self._table.wait_until_exists()
        except ClientError as err:
            logger.error(
                "Couldn't create table %s. Here's why: %s: %s",
                table_name,
                err.response["Error"]["Code"],
                err.response["Error"]["Message"],
            )
            raise
        else:
            return self._table

    def populate_table(self):
        for task in DUMMY_TASKS:
            self._table.put_item(Item=task)


def init(dyn_resource):
    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

    print("-" * 88)
    print("Welcome to the Amazon DynamoDB getting started demo.")
    print("-" * 88)
    table_name = "Tasks"
    dynamo_manager = DynamoManager(dyn_resource)
    tasks_exists = dynamo_manager.create_or_load_table(table_name)
    # movies_exists = movies.exists(table_name)
    if not tasks_exists:
        print(f"\nCreating table {table_name}...")
        dynamo_manager.create_table(table_name)
        print(f"\nCreated table {dynamo_manager._table.name}.")

    dynamo_manager.populate_table()
    # tasks.get_tasks_by_status("DONE")

    return dynamo_manager


if __name__ == "__main__":
    try:
        local_dynamodb = boto3.resource(
            "dynamodb",
            region_name="us-west-2",
            endpoint_url="http://localhost:8000",
            aws_access_key_id="fakeAccessKeyId",
            aws_secret_access_key="fakeSecretAccessKey",
        )
        init(local_dynamodb)

        # run_scenario("doc-example-table-movies", "moviedata.json", local_dynamodb)
    except Exception as e:
        print(f"Something went wrong with the demo! Here's what: {e}")
