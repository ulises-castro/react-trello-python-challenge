import logging
import os
from uuid import uuid4
import boto3
from botocore.exceptions import ClientError
from datetime import datetime, timezone

from .dynamo_manager import DynamoManager

logger = logging.getLogger(__name__)

TABLE_TASKS_NAME = "Tasks"


class TaskTable:
    def __init__(self, dynamo_manager):
        self._dynamo_manager = dynamo_manager
        self._table = dynamo_manager.get_table_ins()

    def add_task(self, task):
        """
        Adds a task to the table.
        """
        try:
            title, description, status_format = task

            new_task = {
                "taskID": str(uuid4()),
                "title": title,
                "description": description,
                "status": status_format,
                "createdAt:": datetime.now(timezone.utc).isoformat(),
            }

            self._table.put_item(Item=new_task)
        except ClientError as err:
            logger.error(
                "Couldn't add task %s to table %s. Here's why: %s: %s",
                title,
                self._table.name,
                err.response["Error"]["Code"],
                err.response["Error"]["Message"],
            )
            raise
        else:
            return new_task

    def get_all_tasks(self):
        """
        Gets all tasks from the table
        """
        try:
            response = self._table.scan()
            data = response["Items"]
            while "LastEvaluatedKey" in response:
                response = self._table.scan(
                    ExclusiveStartKey=response["LastEvaluatedKey"]
                )
                data.extend(response["Items"])

        except ClientError as err:
            logger.error(
                "Couldn't tasks by status \"%s\" from table %s. Here's why: %s: %s",
                self._table.name,
                err.response["Error"]["Code"],
                err.response["Error"]["Message"],
            )
            raise
        else:
            return data

    def delete_task(self, taskID):
        """
        Deletes a task from the table.

        :param taskID: The taskID of the task to delete.
        """
        try:
            response = self._table.delete_item(Key={"taskID": taskID})
        except ClientError as err:
            logger.error(
                "Couldn't delete task %s. Here's why: %s: %s",
                taskID,
                err.response["Error"]["Code"],
                err.response["Error"]["Message"],
            )
            raise err
        else:
            return response

    def update_task(self, taskID, attributes_to_update):
        """
        Updates specific attributes of a task in the table.
        """
        try:
            update_expression = "SET "
            expression_attribute_values = {}
            for key, value in attributes_to_update.items():
                update_expression += f"{key} = :{key}, "
                expression_attribute_values[f":{key}"] = value

            update_expression = update_expression[:-2]

            response = self._table.update_item(
                Key={"taskID": taskID},
                UpdateExpression=update_expression,
                ExpressionAttributeValues=expression_attribute_values,
                ReturnValues="UPDATED_NEW",
                ConditionExpression="attribute_exists(taskID)",
            )
        except ClientError as err:
            logger.error(
                "Couldn't update task %s. Here's why: %s: %s",
                taskID,
                err.response["Error"]["Code"],
                err.response["Error"]["Message"],
            )
            raise err
        else:
            return response


def init():
    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
    local_dynamodb = boto3.resource(
        "dynamodb",
        region_name=os.getenv("AWS_DEFAULT_REGION", "us-west-2"),
        endpoint_url=os.getenv("AWS_ENDPOINT_URL", "http://localhost:8000"),
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID", "fakeAccessKeyId"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY", "fakeAccessKeyId"),
    )

    print("-" * 88)
    print("Task manager initialized.")
    print("-" * 88)
    dynamo_manager = DynamoManager(local_dynamodb)
    dynamo_manager.create_or_load_table(TABLE_TASKS_NAME)
    return TaskTable(dynamo_manager)


task_table = init()
