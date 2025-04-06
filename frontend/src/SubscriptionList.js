import React from 'react';
import './App.css';
import Subscription from './Subscription';

const SubscriptionList = ({subscriptions, cancelSubscriptionClick}) => {
    return (
        <div class="subscriptions">
            <h4>Subscriptions</h4>
            <ul>
                {subscriptions.map((sub, index) => (
                    <Subscription key={index} sub={sub} index={index} cancelSubscriptionClick={cancelSubscriptionClick} />
                ))}
            </ul>
        </div>
    );
};

export default SubscriptionList;
