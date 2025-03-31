from flask import Blueprint,render_template

eco_bp = Blueprint('economy', __name__, template_folder='Templates', static_folder='Static')
