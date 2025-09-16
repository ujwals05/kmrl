# Backend folder

#FastAPI Backend

This is a backend service built with **FastAPI** and served using **Uvicorn**.

## Project Setup

### 1. Clone the Repository - This is done at the starting itself

git clone https://github.com/akshyeaa/kmrl <br/>
cd kmrl/backend

### 2. Create & Activate Virtual Environment

# Windows
python -m venv venv <br/>
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv <br/>
source venv/bin/activate

### 3. Install Dependencies

pip install -r requirement.txt

### 4. Run the Server

uvicorn main:app --reload

