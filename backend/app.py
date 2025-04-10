
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
# TODO: When we have more time, let the payment_status and category columns be a set of predetermined values
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
#   'payment_status' (optional) - Filter by payment_status.
#   'category' (optional) - Filter by category.
@app.route('/subscriptions', methods=['GET'])
def get_subscriptions():
    # Extract optional filter parameters and set local values:
    days = request.args.get('days', type=int)
    payment_status = request.args.get('payment_status', type=str)
    category = request.args.get('category', type=str)
    today = datetime.today().date()
    query = Subscription.query.filter(Subscription.canceled == False)

    # Use the possible filters:
    if days:
        query = query.filter(Subscription.renewal_date <= today + timedelta(days=days))
    if payment_status and payment_status != '':
        query = query.filter(Subscription.payment_status == payment_status)
    if category and category != '':
        query = query.filter(Subscription.category == category)

    # Get the data from the database and return it:
    subscriptions = query.all()
    return jsonify([{
        "id": sub.id,
        "service_name": sub.service_name,
        "cost": sub.cost,
        "renewal_date": sub.renewal_date.isoformat(),
        "payment_status": sub.payment_status,
        "category": sub.category,
    } for sub in subscriptions])

# Get all subscriptions with pending reminders.
# Currently just supported and not used in our application:
@app.route('/subscriptions/reminders', methods=['GET'])
def get_subscriptions_pending_reminders():
    query = Subscription.query.filter(Subscription.reminder_sent == False and Subscription.canceled == False)
    subscriptions = query.all()
    return jsonify([{
        "id": sub.id,
        "service_name": sub.service_name,
    } for sub in subscriptions])

# Get a cost analysis:
@app.route('/subscriptions/summary', methods=['GET'])
def get_subscriptions_summary():
    try:
        # Fetch aggregated data from db:
        results = Subscription.query.filter(Subscription.canceled == False).with_entities(
            db.func.sum(Subscription.cost),
            db.func.sum(db.case([(Subscription.category == 'Streaming', Subscription.cost)], else_=0)),
            db.func.sum(db.case([(Subscription.category == 'Utilities', Subscription.cost)], else_=0)),
            db.func.sum(db.case([(Subscription.category == 'Fitness', Subscription.cost)], else_=0))
        ).one()

        # Return response object:
        summary = {
            'total_cost': results[0] or 0.0,
            'streaming_cost': results[1] or 0.0,
            'utilities_cost': results[2] or 0.0,
            'fitness_cost': results[3] or 0.0
        }

        return jsonify(summary), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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
@app.route('/subscriptions/<string:serviceName>/cancel', methods=['PUT'])
def cancel_subscription(serviceName):
    subscriptions = Subscription.query.filter_by(service_name=serviceName).all()
    if not subscriptions:
        return jsonify({'error': 'Subscription not found'}), 404

    try:
        for subscription in subscriptions:
            subscription.canceled = True
        db.session.commit()
        return jsonify({'message': f'Subscription {serviceName} canceled successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to cancel subscription', 'details': str(e)}), 500

# Start the web server:
if __name__ == '__main__': 
    app.logger.info('Starting the web server...')
    db.create_all()
    app.run(host="0.0.0.0", port=5000, debug=True,)
