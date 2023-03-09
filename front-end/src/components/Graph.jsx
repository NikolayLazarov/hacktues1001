import React from 'react';
import Plot from 'react-plotly.js';

class Graph extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        const { title, data } = this.props;


        const traces = [{
            x: data.map(item => item.date),
            y: data.map(item => item[title]),
            type: "bar", 
          }];

        return ( 
            <Plot 
                data = {traces}
                layout={{
                        width: 400, 
                        height: 250, 
                        title: "Graph for " + title, 
                        xaxis: {title: "Date"}, 
                        yaxis: {title: title}, 
                        margin: { l: 50, r: 50, b: 50, t: 100 },
                        displayModeBar: false
                    }}
                    config={{ displayModeBar: false }}
            />
        );

    };
}

export default Graph;