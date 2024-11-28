
# File: app.py
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///subscriptions.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Subscription(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    service_name = db.Column(db.String(80), nullable=False)
    cost = db.Column(db.Float, nullable=False)
    renewal_date = db.Column(db.Date, nullable=False)

@app.route('/subscriptions', methods=['GET'])
def get_subscriptions():
    days = request.args.get('days', type=int)
    today = datetime.today().date()
    query = Subscription.query
    if days:
        query = query.filter(Subscription.renewal_date <= today + timedelta(days=days))
    subscriptions = query.all()
    return jsonify([{
        "id": sub.id,
        "service_name": sub.service_name,
        "cost": sub.cost,
        "renewal_date": sub.renewal_date.isoformat()
    } for sub in subscriptions])

@app.route('/subscriptions', methods=['POST'])
def add_subscription():
    data = request.json
    try:
        new_subscription = Subscription(
            service_name=data['service_name'],
            cost=data['cost'],
            renewal_date=datetime.strptime(data['renewal_date'], '%Y-%m-%d').date()
        )
        db.session.add(new_subscription)
        db.session.commit()
        return jsonify({"message": "Subscription added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    db.create_all()
    app.run(host="0.0.0.0", port=5000, debug=True,)
