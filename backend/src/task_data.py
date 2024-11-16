from datetime import datetime, timezone, timedelta
from uuid import uuid4

current_time = datetime.now(timezone.utc)
DUMMY_TASKS = [
    {
        "taskID": str(uuid4()),
        "title": "Title task",
        "description": "Hello World!",
        "createdAt": (current_time - timedelta(minutes=10)).isoformat(),
        "status": "TODO",
    },
    {
        "taskID": str(uuid4()),
        "title": "Title task",
        "description": "DynamoDB is awesome!",
        "createdAt": (current_time - timedelta(minutes=5)).isoformat(),
        "status": "IN_PROGRESS",
    },
    {
        "taskID": str(uuid4()),
        "title": "Title task",
        "description": "Learning AWS.",
        "createdAt": current_time.isoformat(),
        "status": "REVIEWING",
    },
    {
        "taskID": str(uuid4()),
        "title": "user456",
        "description": "Another user post.",
        "createdAt": (current_time - timedelta(minutes=7)).isoformat(),
        "status": "DONE",
    },
]
DUMMY_TASKS = DUMMY_TASKS * 3
