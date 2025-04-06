
# File: app.py
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime, timedelta
import logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///subscriptions.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# The main data class for the database and application:
class Subscription(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    service_name = db.Column(db.String(80), nullable=False)
    cost = db.Column(db.Float, nullable=False)
    renewal_date = db.Column(db.Date, nullable=False)
    payment_status = db.Column(db.String(80), nullable=False)
    category = db.Column(db.String(80), nullable=False)
    reminder_sent = db.Column(db.Boolean, nullable=False)
    canceled = db.Column(db.Boolean, nullable=False)

# Get all subscriptions.
# Filters are:
#   'days' (optional) - Filter subscriptions due in the next X days.
@app.route('/subscriptions', methods=['GET'])
def get_subscriptions():
    days = request.args.get('days', type=int)
    today = datetime.today().date()
    query = Subscription.query.filter(Subscription.canceled == False)
    if days:
        query = query.filter(Subscription.renewal_date <= today + timedelta(days=days))
    subscriptions = query.all()
    return jsonify([{
        "id": sub.id,
        "service_name": sub.service_name,
        "cost": sub.cost,
        "renewal_date": sub.renewal_date.isoformat(),
        "payment_status": sub.payment_status,
        "category": sub.category,
    } for sub in subscriptions])

# Get all subscriptions with pending reminders:
@app.route('/subscriptions/reminders', methods=['GET'])
def get_subscriptions_pending_reminders():
    query = Subscription.query.filter(Subscription.reminder_sent == False and Subscription.canceled == False)
    subscriptions = query.all()
    return jsonify([{
        "id": sub.id,
        "service_name": sub.service_name,
        "cost": sub.cost,
        "renewal_date": sub.renewal_date.isoformat(),
        "payment_status": sub.payment_status,
        "category": sub.category,
    } for sub in subscriptions])

# Create a subscription:
@app.route('/subscriptions', methods=['POST'])
def add_subscription():
    data = request.json
    try:
        new_subscription = Subscription(
            service_name=data['service_name'],
            cost=data['cost'],
            renewal_date=datetime.strptime(data['renewal_date'], '%Y-%m-%d').date(),
            payment_status=data['payment_status'],
            category=data['category'],
            reminder_sent=False,
            canceled=False
        )
        db.session.add(new_subscription)
        db.session.commit()
        app.logger.info("Subscription added successfully")
        return jsonify({"message": "Subscription added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Cancel a subscription:
@app.route('/subscriptions/<int:id>/cancel', methods=['PUT'])
def cancel_subscription(id):
    subscription = Subscription.query.get(id)
    if not subscription:
        return jsonify({'error': 'Subscription not found'}), 404

    try:
        subscription.canceled = True
        db.session.commit()
        return jsonify({'message': f'Subscription {id} canceled successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update subscription', 'details': str(e)}), 500
    
    # data = request.json
    # try:
    #     new_subscription = Subscription(
    #         service_name=data['service_name'],
    #         cost=data['cost'],
    #         renewal_date=datetime.strptime(data['renewal_date'], '%Y-%m-%d').date(),
    #         payment_status=data['payment_status'],
    #         category=data['category'],
    #         reminder_sent=False,
    #         canceled=False
    #     )
    #     db.session.add(new_subscription)
    #     db.session.commit()
    #     app.logger.info("Subscription added successfully")
    #     return jsonify({"message": "Subscription added successfully"}), 201
    # except Exception as e:
    #     return jsonify({"error": str(e)}), 400

# Start the web server:
if __name__ == '__main__': 
    app.logger.info('Starting the web server...')
    db.create_all()
    app.run(host="0.0.0.0", port=5000, debug=True,)
