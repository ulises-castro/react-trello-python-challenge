# Use official Python image as the base
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Create a non-root user
RUN addgroup --system appgroup && adduser --system appuser --ingroup appgroup

# Set working directory
WORKDIR /app

# Install Python dependencies
COPY ./src/requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY src/ src/

# Change ownership to the non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose the port Flask runs on
EXPOSE 5000

# Define the entry point
CMD ["gunicorn", "src.app:app", "--bind", "0.0.0.0:5000", "--workers", "2"]