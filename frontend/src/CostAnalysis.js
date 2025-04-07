import React from 'react';
import './App.css';
import Subscription from './Subscription';

const CostAnalysis = ({costAnalysis}) => {
    return (
        <div className="summary-container">
            <h5>COST ANALYSIS</h5>
            {costAnalysis && (
                <div className="summary-cards">
                    <div className="card">Total Cost: ${costAnalysis.total_cost.toFixed(0)}</div>
                    <div className="card">Streaming Cost: ${costAnalysis.streaming_cost.toFixed(0)}</div>
                    <div className="card">Utilities Cost: ${costAnalysis.utilities_cost.toFixed(0)}</div>
                    <div className="card">Fitness Cost: ${costAnalysis.fitness_cost.toFixed(0)}</div>
                </div>
            )}
        </div>
    );
};

export default CostAnalysis;
