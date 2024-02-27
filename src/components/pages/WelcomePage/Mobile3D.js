import React, { Suspense } from 'react';
const Spline = React.lazy(() => import('@splinetool/react-spline'));

const Mobile3D = () => {

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
      <Spline scene="https://prod.spline.design/qKKnU5VIRHQsH5Xj/scene.splinecode"/>
      </Suspense>
    </div>
  );
};

export default Mobile3D;
