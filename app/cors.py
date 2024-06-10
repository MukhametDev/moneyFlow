from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:3000",  
    "http://localhost:8080",  
    "http://127.0.0.1:3000",
]

def add_cors_middleware(app):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )