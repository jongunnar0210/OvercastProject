import React, { useEffect, useState } from 'react';
import './App.css';
import { BACKEND_HOST } from './constants';
import SubscriptionList from './SubscriptionList';
import AddSubscriptionForm from './AddSubscriptionForm';
import SubscriptionFilters from './SubscriptionFilters';
import CostAnalysis from './CostAnalysis';
import Image from './images/background.jpg';

// Main logic handler:
// TODO:
// - Disallow duplicate service names. I didn't have time to add that.
//      Probably the best solution would be to show an error popup when the backend spots duplicates,
//      because the subscription list in the backend can be different from the frontend,
//      f.ex. the frontend list could be filtered and also not showing canceled subscriptions.
//
// - Make the application responsive and look good on smaller screens.
const App = () => {
    // Local subscription list. Note that it could be filtered compared to the backend list.
    const [subscriptions, setSubscriptions] = useState([]);

    // Data for creating a new subscription:
    const [formData, setFormData] = useState({
        service_name: '',
        cost: 1,
        renewal_date: '',
        payment_status: 'Pending',
        category: 'Streaming'
    });

    const INITIAL_FILTER_STATUS = {payment_status: '', category: ''};

    // Filters for the subscription list:
    const [filters, setFilters] = useState(INITIAL_FILTER_STATUS);

    // Aggregated cost analysis:
    const [costAnalysis, setCostAnalysis] = useState({
        total_cost: 0,
        streaming_cost: 0,
        utilities_cost: 0,
        fitness_cost: 0
    });

    // Reset the create subscription form data when the subscription list changes:
    useEffect(() => {
        let tmpDate = new Date();
        tmpDate.setMonth(tmpDate.getMonth() + 1);   // One month ahead is a good starting point.

        setFormData({
            service_name: '',
            cost: 1,
            renewal_date: tmpDate.toISOString().split('T')[0],
            payment_status: 'Pending',
            category: 'Streaming'
        });
    }, [subscriptions]);

    // Fetch and display the subscription list. Do this at loading time and when filters change:
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

    // In the future don't allow duplicate service names or renewal dates in the past f.ex.:
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Change filters:
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    // Cancel a subscription:
    const cancelSubscriptionClick = async (service_name) => {
        try {
            const response = await fetch(BACKEND_HOST + `/subscriptions/${service_name}/cancel`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();

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

    // Add a new subscription to the database:
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
                
                // Update the subscriptions list locally. This will also reset formData inside the useEffect above:
                setSubscriptions([...subscriptions, formData]);
    
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
        <div className="App" style={{ backgroundImage: `url(${Image})` }}>
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
