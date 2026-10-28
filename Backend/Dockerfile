FROM python:3.13-slim

# Bring in uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

ENV PYTHONUNBUFFERED=1

# Install Dependencies first 
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --no-install-project 

# Then copy the project code 
COPY . .

ENV PATH="/app/.venv/bin:$PATH"

EXPOSE 8000

CMD [ "sh", "-c", "python manage.py migrate --noinput && gunicorn config.wsgi:application --bind 0.0.0.0:8000 --timeout 300" ]