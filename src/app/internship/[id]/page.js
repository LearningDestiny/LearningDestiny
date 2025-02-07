// pages/event/[id].js
import InternshipDetails from '../../../enrollpages/Intenshipdetail';
import React from 'react';

const Page = ({ params }) => {
  const { id } = params;

  if (!id) {
    return <div>Error: Event ID not found</div>;
  }

  return (
    <>
      <InternshipDetails id={id} />
    </>
  );
};

export default Page;
