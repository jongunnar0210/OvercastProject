
import React, { useEffect, useState } from 'react';
import './App.css';
import { BACKEND_HOST } from './constants';
import SubscriptionList from './SubscriptionList';

const App = () => {
    const [subscriptions, setSubscriptions] = useState([]);

    const [formData, setFormData] = useState({
        // TODO: Perhaps add "id: 0,"
        service_name: '',
        cost: '',
        renewal_date: '',
        payment_status: 'Pending',
        category: 'Streaming'
    });

    useEffect(() => {
        const fetchAllSubscriptions = async () => {
			try {
				const response = await fetch(BACKEND_HOST + '/subscriptions');
                console.log('response: ', response);

				if (!response.ok) {
					throw new Error(`Error: ${response.statusText}`);
				}
				const result = await response.json();
                console.log('result: ', result);

                setSubscriptions([...subscriptions, ...result]);
			} catch (err) {
                console.log(err.message);
			} finally {
				// setLoading(false);
			}
		};

		fetchAllSubscriptions();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log('handleInputChange:');
        console.log('name: ', name);
        console.log('value: ', value);

        setFormData({ ...formData, [name]: value });
    };

    const cancelSubscriptionClick = async (subscriptionId) => {
        console.log('subscriptionId: ', subscriptionId);

        try {
            const response = await fetch(BACKEND_HOST + `/subscriptions/${subscriptionId}/cancel`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                // body: JSON.stringify(formData),
            });

            console.log('cancel body: ', response);
    
            if (response.ok) {
                const data = await response.json();
                console.log('Canceled:', subscriptionId);
                console.log('Canceled data:', data);
                
                // Update the subscriptions list locally:
                setSubscriptions(subscriptions.filter((sub) => sub.id !== subscriptionId));
    
                // Reset the form fields
                setFormData({ service_name: '', cost: '', renewal_date: '' });
            } else {
                const errorData = await response.json();
                console.error('Error canceling subscription:', errorData);
                alert('Failed to cancel subscription: ' + errorData.error);
            }
        } catch (error) {
            console.error('Error connecting to the backend:', error);
            alert('Error connecting to the backend.');
        }
    }

    // Adds a new subscription to the database:
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch(BACKEND_HOST + '/subscriptions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log('Subscription added:', data);
                
                // Optionally, update the subscriptions list locally
                setSubscriptions([...subscriptions, formData]);
    
                // Reset the form fields
                setFormData({ service_name: '', cost: '', renewal_date: '' });
            } else {
                const errorData = await response.json();
                console.error('Error adding subscription:', errorData);
                alert('Failed to add subscription: ' + errorData.error);
            }
        } catch (error) {
            console.error('Error connecting to the backend:', error);
            alert('Error connecting to the backend.');
        }
    };

    return (
        <div className="App">
            <h1>Subscription Tracker</h1>
            <main>
                <form onSubmit={handleSubmit} className="creation-form mt-4">
                    <div className="mb-3">
                        <label htmlFor="service_name" className="form-label">Service Name</label>
                        <input
                            id="service_name"
                            name="service_name"
                            className="form-control"
                            placeholder="Service Name"
                            value={formData.service_name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="cost" className="form-label">Cost</label>
                        <input
                            id="cost"
                            name="cost"
                            className="form-control"
                            placeholder="Cost"
                            type="number"
                            value={formData.cost}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="renewal_date" className="form-label">Renewal Date</label>
                        <input
                            id="renewal_date"
                            name="renewal_date"
                            className="form-control"
                            placeholder="Renewal Date"
                            type="date"
                            value={formData.renewal_date}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="payment_status" className="form-label">Payment Status</label>
                        <select
                            id="payment_status"
                            name="payment_status"
                            value={formData.payment_status}
                            onChange={handleInputChange}
                            className="form-control"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                            <option value="Overdue">Overdue</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="category" className="form-label">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="form-control"
                        >
                            <option value="Streaming">Streaming</option>
                            <option value="Utilities">Utilities</option>
                            <option value="Fitness">Fitness</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary">Add Subscription</button>
                </form>
                <SubscriptionList subscriptions={subscriptions} cancelSubscriptionClick={cancelSubscriptionClick} />
            </main>
        </div>
    );
};

export default App;
