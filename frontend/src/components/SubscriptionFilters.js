import React from 'react';
import '../App.css';

// Ofter filterings for the local frontend subscriptions:
const SubscriptionFilters = ({filters, handleFilterChange}) => {
    return (
        <div className='filters'>
            <h5>FILTER BY</h5>
            <section>
                <div className="mb-3">
                    <label htmlFor="payment_status" className="form-label">Payment Status</label>
                    <select
                        id="payment_status"
                        name="payment_status"
                        value={filters.payment_status}
                        onChange={handleFilterChange}
                        className="form-control"
                    >
                        <option value=""></option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="category" className="form-label">Category</label>
                    <select
                        id="category"
                        name="category"
                        value={filters.category}
                        onChange={handleFilterChange}
                        className="form-control"
                    >
                        <option value=""></option>
                        <option value="Streaming">Streaming</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Fitness">Fitness</option>
                    </select>
                </div>
            </section>
        </div>
    );
};

export default SubscriptionFilters;
