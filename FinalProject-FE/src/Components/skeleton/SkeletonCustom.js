import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React from 'react';

const SkeletonCustom = ({ absoluteCustom = false, fontSizeCustom = 40 }) => (
  <div
    className={`bg-gray-200/[.3] fixed top-0 bottom-0 right-0 left-0 center w-full h-full flex justify-center items-center`}
  >
    <Spin
      indicator={
        <LoadingOutlined
          style={{
            fontSize: fontSizeCustom,
          }}
          spin
        />
      }
    />
  </div>
);
export default SkeletonCustom;
