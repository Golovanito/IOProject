from flask import Blueprint

bp = Blueprint('home', __name__, 
               template_folder='Templates', static_folder="static")

from Modules.Home import routes
