import React from 'react';
import './App.css';

const Subscription = ({sub, index, cancelSubscriptionClick}) => {
    return (
        <li key={index} className='subscription-listitem'>
            <div>
                <strong>{sub.service_name}</strong> - <i>${sub.cost}</i> - DUE <i>{sub.renewal_date}</i> - STATUS: <i>{sub.payment_status}</i> - CATEGORY: <i>{sub.category}</i>
            </div>
            <button className='cancel-button' onClick={() => {cancelSubscriptionClick(sub.service_name)}}>CANCEL</button>
        </li>
    );
};

export default Subscription;
