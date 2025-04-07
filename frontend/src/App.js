import React, { useEffect, useState } from 'react';
import './App.css';
import { BACKEND_HOST } from './constants';
import SubscriptionList from './SubscriptionList';
import AddSubscriptionForm from './AddSubscriptionForm';
import SubscriptionFilters from './SubscriptionFilters';
import CostAnalysis from './CostAnalysis';

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

    const INITIAL_FILTER_STATUS = {payment_status: '', category: ''};

    const [filters, setFilters] = useState(INITIAL_FILTER_STATUS);

    const [costAnalysis, setCostAnalysis] = useState({
        total_cost: 0,
        streaming_cost: 0,
        utilities_cost: 0,
        fitness_cost: 0
    });

    // Fetch and display the subscription list:
    useEffect(() => {
        const fetchAllSubscriptions = async () => {
			try {
                // Fetch the subscriptions with our filters. At the moment we're not using 'days',
                // even though the backend supports it:
				const response = await fetch(BACKEND_HOST + `/subscriptions?payment_status=${filters.payment_status}&category=${filters.category}`);
				if (!response.ok) {
					throw new Error(`Error: ${response.statusText}`);
				}

				const result = await response.json();
                setSubscriptions([...result]);
			} catch (err) {
                console.log(err.message);
			} finally {
				// setLoading(false);
			}
		};

		fetchAllSubscriptions();
    }, [filters]);

    // Fetch and display the cost analysis:
    // In this case we simplify by always fetching this data from the database
    // because our local subscription list might be filtered. Later, optimize.
    useEffect(() => {
        const fetchCostAnalysis = async () => {
			try {
                // Fetch the cost analysis:
				const response = await fetch(BACKEND_HOST + '/subscriptions/summary');
				if (!response.ok) {
					throw new Error(`Error: ${response.statusText}`);
				}

				const result = await response.json();
                setCostAnalysis(result);
			} catch (err) {
                console.log(err.message);
			} finally {
				// setLoading(false);
			}
		};

		fetchCostAnalysis();
    }, [subscriptions]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const cancelSubscriptionClick = async (service_name) => {
        console.log('service_name: ', service_name);

        try {
            const response = await fetch(BACKEND_HOST + `/subscriptions/${service_name}/cancel`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('cancel body: ', response);
    
            if (response.ok) {
                const data = await response.json();
                console.log('Canceled:', service_name);
                console.log('Canceled data:', data);
                
                // Update the subscriptions list locally:
                setSubscriptions(subscriptions.filter((sub) => sub.service_name !== service_name));

                // Remove all filters:
                setFilters(INITIAL_FILTER_STATUS);
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

                // Reset the filters because the user might have just created a subscription with a currently set filter and we want it
                // to appear right away instead of confusing him/her:
                setFilters(INITIAL_FILTER_STATUS);
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
                <SubscriptionFilters filters={filters} handleFilterChange={handleFilterChange} />
                <CostAnalysis costAnalysis={costAnalysis} />
            </main>
        </div>
    );
};

export default App;
