import React from 'react';
import './App.css';

const AddSubscriptionForm = ({formData, handleSubmit, handleInputChange}) => {
    return (
        <div className='add-subscription'>
            <h4>Add Subscription</h4>
            <form onSubmit={handleSubmit} className="creation-form mt-4">
                <div className="mb-3">
                    <label htmlFor="service_name" className="form-label">Service Name</label>
                    <input
                        id="service_name"
                        name="service_name"
                        className="form-control"
                        placeholder="Service Name"
                        value={formData.service_name}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="cost" className="form-label">Cost</label>
                    <input
                        id="cost"
                        name="cost"
                        className="form-control"
                        placeholder="Cost"
                        type="number"
                        value={formData.cost}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="renewal_date" className="form-label">Renewal Date</label>
                    <input
                        id="renewal_date"
                        name="renewal_date"
                        className="form-control"
                        placeholder="Renewal Date"
                        type="date"
                        value={formData.renewal_date}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="payment_status" className="form-label">Payment Status</label>
                    <select
                        id="payment_status"
                        name="payment_status"
                        value={formData.payment_status}
                        onChange={handleInputChange}
                        className="form-control"
                    >
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
                        value={formData.category}
                        onChange={handleInputChange}
                        className="form-control"
                    >
                        <option value="Streaming">Streaming</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Fitness">Fitness</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Add Subscription</button>
            </form>
        </div>
    );
};

export default AddSubscriptionForm;
