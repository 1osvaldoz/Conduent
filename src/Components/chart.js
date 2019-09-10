import React, { Component } from 'react'
import {Bar,Line,Pie} from 'react-chartjs-2'

export class chart extends Component {
    
    render() {
        return (
            <div className="chart">
                <Bar
                data={this.props.data}
                options={{maintainAspectRatio:false}}
                options={{
                  
                    scales: {
                      yAxes: [{
                        ticks: {
                          beginAtZero: true
                        }
                      }]
                    }
                  }}
                ></Bar>
                {console.log(this.props.data)}
            </div>
        )
    }
}

export default chart
