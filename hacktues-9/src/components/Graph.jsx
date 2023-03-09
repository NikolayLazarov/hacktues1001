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
            name: "nz"
          }];

        return ( 
            <Plot 
                data = {traces}
                layout={{width: 1000, height: 700, title: title}}
            />
        );

    };
}

export default Graph;