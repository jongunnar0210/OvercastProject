
import React, { useEffect, useState } from 'react';
import './App.css';
import { BACKEND_HOST } from './constants';
import SubscriptionList from './SubscriptionList';
import AddSubscriptionForm from './AddSubscriptionForm';

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

    const cancelSubscriptionClick = async (service_name) => {
        console.log('service_name: ', service_name);

        try {
            const response = await fetch(BACKEND_HOST + `/subscriptions/${service_name}/cancel`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                // body: JSON.stringify(formData),
            });

            console.log('cancel body: ', response);
    
            if (response.ok) {
                const data = await response.json();
                console.log('Canceled:', service_name);
                console.log('Canceled data:', data);
                
                // Update the subscriptions list locally:
                setSubscriptions(subscriptions.filter((sub) => sub.service_name !== service_name));
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
                setFormData({ service_name: '', cost: '', renewal_date: '', payment_status: 'Pending', category: 'Streaming' });
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
                <AddSubscriptionForm formData={formData} handleSubmit={handleSubmit} handleInputChange={handleInputChange} />
                <SubscriptionList subscriptions={subscriptions} cancelSubscriptionClick={cancelSubscriptionClick} />
            </main>
        </div>
    );
};

export default App;
