from flask import render_template,url_for
from Modules.Economy import eco_bp
from flask_login import login_required



test = True

@eco_bp.route('/currency')
@login_required
def EcoHome():
    return render_template('currency.html',test=test)

@eco_bp.route('/Gold')
@login_required
def EcoGold():
    return render_template('gold.html', test = not test)