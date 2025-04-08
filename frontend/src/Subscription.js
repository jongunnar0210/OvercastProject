import React, { useState } from 'react';
import './App.css';
import ConfirmationDialog from './ConfirmationDialog';
import { convertDateFormat } from './Utils';

const Subscription = ({sub, index, cancelSubscriptionClick}) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const cancelYes = () => {
        cancelSubscriptionClick(sub.service_name);
        setIsDialogOpen(false);
    };

    const cancelNo = () => {
        setIsDialogOpen(false);
    };

    return (
        <li key={index} className='subscription-listitem'>
            <div>
                <strong>{sub.service_name}</strong> - <i>${sub.cost}</i> - DUE <i>{convertDateFormat(sub.renewal_date)}</i> - STATUS: <i>{sub.payment_status}</i> - CATEGORY: <i>{sub.category}</i>
            </div>
            <button className='cancel-button' onClick={() => setIsDialogOpen(true)}>CANCEL</button>
            {isDialogOpen && (
                <ConfirmationDialog
                    title={`Cancel ${sub.service_name}?`}
                    onConfirm={cancelYes}
                    onCancel={cancelNo}
                />
            )}
        </li>
    );
};

export default Subscription;
