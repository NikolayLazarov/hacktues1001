import React, { useState,useEffect } from 'react';
import Plot from 'react-plotly.js';

function Graph(props)
{   
    const {data,title} = props;
    const traces = [{
        x: data.map(item => item.date),
        y: data.map(item => item[title]),
        type: "bar", 
      }];

      
    return (
        <>
            <Plot
            data = {traces}
                layout={{
                        width: 400, 
                        height: 250, 
                        title: "Graph for " + title, 
                        xaxis: {title: "Date"}, 
                        yaxis: {title: title}, 
                        margin: { l: 50, r: 50, b: 50, t: 100 },
                        displayModeBar: false,
                        paper_bgcolor:'rgba(0,0,0,0)',
                        plot_bgcolor:'rgba(100,0,0,0)'
                    }}
                    config={{ displayModeBar: false }}
            />
                </>
        );

}

export default Graph;