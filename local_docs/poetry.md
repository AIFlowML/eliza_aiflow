# Poetry Commands for Eve Predict

## Installation and Setup
```bash
# Install Poetry
curl -sSL https://install.python-poetry.org | python3 -

# Configure Poetry to create virtual environment in project directory
poetry config virtualenvs.in-project true

# Initialize a new Poetry project (if starting from scratch)
poetry init

# Install all dependencies
poetry install

# Update dependencies
poetry update
```

## Daily Usage
```bash
# Activate virtual environment
poetry shell

# Run a command within the virtual environment
poetry run python script.py

# Add new dependencies
poetry add package-name
poetry add --group dev package-name  # for dev dependencies

# Remove dependencies
poetry remove package-name

# Show installed packages
poetry show

# Update lock file
poetry lock --no-update

# Export requirements.txt
poetry export -f requirements.txt --output requirements.txt
```

## Environment Management
```bash
# List all virtual environments
poetry env list

# Remove virtual environment
poetry env remove python

# Show environment info
poetry env info
```

## Project Dependencies
```bash
# Show dependency tree
poetry show --tree

# Check for security vulnerabilities
poetry check

# Update all dependencies
poetry update

# Update specific package
poetry update package-name
```

## Building and Publishing
```bash
# Build package
poetry build

# Publish package
poetry publish

# Build and publish
poetry publish --build
```

## Common Workflows

### Adding New Dependencies
```bash
# Add production dependency
poetry add package-name

# Add development dependency
poetry add --group dev package-name

# Add multiple packages
poetry add package1 package2 package3
```

### Dependency Version Management
```bash
# Add specific version
poetry add package-name@^2.0.0

# Add with extras
poetry add package-name[extra1,extra2]

# Add from git
poetry add git+https://github.com/user/repo.git

# Add from path
poetry add ./local/path/to/package/
```

### Environment Variables
```bash
# Load .env file automatically when using poetry run
poetry run python -c "import os; print(os.getenv('VARIABLE_NAME'))"
```

## Project Structure
```
eve_predict/
├── .env                    # Environment variables
├── .venv/                  # Virtual environment (if in-project)
├── pyproject.toml         # Poetry configuration and dependencies
├── poetry.lock           # Locked dependencies
└─��� src/                  # Source code
```
