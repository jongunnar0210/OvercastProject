import React from 'react';
import './App.css';
import Subscription from './Subscription';

const SubscriptionList = ({subscriptions, cancelSubscriptionClick}) => {
    return (
        <ul className='subscriptions'>
            {subscriptions.map((sub, index) => (
                <Subscription key={index} sub={sub} index={index} cancelSubscriptionClick={cancelSubscriptionClick} />
                // <li key={index}>
                //     {sub.service_name} - ${sub.cost} - DUE ON {sub.renewal_date} - PAYMENT STATUS: {sub.payment_status} - CATEGORY: {sub.category}
                // </li>
            ))}
        </ul>
    );
};

export default SubscriptionList;
