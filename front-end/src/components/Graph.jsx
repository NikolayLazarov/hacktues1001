import React, { useState,useEffect } from 'react';
import Plot from 'react-plotly.js';

function Graph(props)
{
    const { title, data } = props;
    const [traces,setTraces] = useState();
    console.log("aaaaaaa")
    console.log(data.length);
    let dates =[];
    let m =[];
    useEffect(()=>{
        let dates=[];
        let m =[];
        for(let i =0;i<data.length;i++){
            dates.push(data[i]['date'])
            m.push(data[i][title])
        }
        setTraces([{
            x:dates,
            y:m,
            type: "bar", 
            marker: {
                color: 'rgb(43, 158, 145)' 
              }
          }])
    },[])

      
    return (
        <>
            {traces
            ?<Plot
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
            :<></>
            }
                </>
        );

}

export default Graph;