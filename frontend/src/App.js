
import React, { useEffect, useState } from 'react';
import './App.css';
import { BACKEND_HOST } from './constants';

const App = () => {
    const [subscriptions, setSubscriptions] = useState([]);

    const [formData, setFormData] = useState({
        service_name: '',
        cost: '',
        renewal_date: '',
        payment_status: ''
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
				// setData(result);
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
        setFormData({ ...formData, [name]: value });
    };

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
            <form onSubmit={handleSubmit} className="container mt-4">
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
                <button type="submit" className="btn btn-primary">Add Subscription</button>
            </form>
            <ul>
                {subscriptions.map((sub, index) => (
                    <li key={index}>
                        {sub.service_name} - ${sub.cost} - Due on {sub.renewal_date} - payment status: {sub.payment_status}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
