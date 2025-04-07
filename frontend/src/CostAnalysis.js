import React from 'react';
import './App.css';

// Show insights into the user's subscription spending.
const CostAnalysis = ({costAnalysis}) => {
    return (
        <div className="cost-analysis">
            <h5>COST ANALYSIS</h5>
            {costAnalysis && (
                <div class="card-wrapper">
                    <SummaryCards costAnalysis={costAnalysis} granularity='monthly' />
                    <SummaryCards costAnalysis={costAnalysis} granularity='annual' />
                </div>
            )}
        </div>
    );
};

// 'granularity' can be either 'monthly' or 'annual':
const SummaryCards = ({costAnalysis, granularity}) => {
    const multiplyer = () => {
        return granularity === 'monthly' ? 1 : 12;
    }
    
    return (
        <div className="summary-container">
            <h6>{granularity === 'monthly' ? 'MONTHLY' : 'ANNUALLY'}</h6>
            <div className="summary-cards">
                <div className="card">Total: ${costAnalysis.total_cost * multiplyer()}</div>
                <div className="card">Streaming: ${costAnalysis.streaming_cost * multiplyer()}</div>
                <div className="card">Utilities: ${costAnalysis.utilities_cost * multiplyer()}</div>
                <div className="card">Fitness: ${costAnalysis.fitness_cost * multiplyer()}</div>
            </div>
        </div>
    );
};

export default CostAnalysis;
