import React from 'react';
import ReactLoading from 'react-loading';

interface LoadingProps{
    color:string
}

const Loading = ({color} : LoadingProps) => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',  height: '100%', width: '100%' }}>
    <ReactLoading type="spin" color={color} height={50} width={50} />
  </div>
);

export default Loading;
