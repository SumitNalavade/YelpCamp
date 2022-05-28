from flask import abort

class AppError():
    def __init__(self, code, message):
        return abort(code, message)