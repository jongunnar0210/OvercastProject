import React from 'react';
import './App.css';
import Subscription from './Subscription';

const SubscriptionList = ({subscriptions, cancelSubscriptionClick}) => {
    return (
        <div className="subscriptions">
            <h5>SUBSCRIPTIONS</h5>
            <section>
                <label>Your subscriptions</label>
                {
                    subscriptions.length > 0 ? (
                        <ul>
                            {subscriptions.map((sub, index) => (
                                <Subscription key={index} sub={sub} index={index} cancelSubscriptionClick={cancelSubscriptionClick} />
                            ))}
                        </ul>
                    ) : (
                        <div><i>You have no subscriptions</i></div>
                    )
                }
            </section>
        </div>
    );
};

export default SubscriptionList;
