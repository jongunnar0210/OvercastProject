import React from 'react';
import './App.css';

const Subscription = ({sub, index, cancelSubscriptionClick}) => {
    return (
        <li key={index} className='subscription-listitem'>
            <div>
                {sub.service_name} - ${sub.cost} - DUE ON {sub.renewal_date} - PAYMENT STATUS: {sub.payment_status} - CATEGORY: {sub.category}
            </div>
            <button onClick={() => {cancelSubscriptionClick(sub.service_name)}}>Cancel Subscription</button>
        </li>
    );
};

export default Subscription;
