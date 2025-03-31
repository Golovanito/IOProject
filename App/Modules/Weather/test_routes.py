import sys
from flask import render_template, request
from Modules.Weather import weather_bp


@weather_bp.route('/weather_test')
def weather_test():
    return render_template('home_js_test.html')


@weather_bp.route('/weather_test_results', methods=['POST'])
def weather_test_results():
    results = request.json

    # Save result in file
    s = f"Test results:\n{results}"
    orig_stdout = sys.stdout
    f = open('./IOProjekt/App/tests/unit/js_test_out.txt', 'w')
    sys.stdout = f

    print(s)

    sys.stdout = orig_stdout
    f.close()

    # Show test result in console
    print(s)
    return ''
