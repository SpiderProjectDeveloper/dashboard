import React, { Component } from 'react';

const RADIAN = Math.PI / 180;

export const PieChartLabel = function(
  params // { cx, cy, midAngle, innerRadius, outerRadius, percent, index }
) 
{
  const radius = params.innerRadius + (params.outerRadius - params.innerRadius) * 1.0 + 25;
  const x = params.cx + radius * Math.cos(-params.midAngle * RADIAN);
  const y = params.cy + radius * Math.sin(-params.midAngle * RADIAN);

  return (
    <text 
			x={x} 
			y={y} 
			fill="black" 
			textAnchor={x > params.cx ? 'start' : 'end'} 
			dominantBaseline="central"
		>
      {`${(params.percent * 100).toFixed(0)}%`}
    </text>
  );
}
