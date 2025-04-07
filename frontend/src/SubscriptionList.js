import React from 'react';
import './App.css';
import Subscription from './Subscription';

const SubscriptionList = ({subscriptions, cancelSubscriptionClick}) => {
    return (
        <div className="subscriptions">
            <h5>SUBSCRIPTIONS</h5>
            <section>
                <label>Your subscriptions</label>
                <ul>
                    {subscriptions.map((sub, index) => (
                        <Subscription key={index} sub={sub} index={index} cancelSubscriptionClick={cancelSubscriptionClick} />
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default SubscriptionList;
