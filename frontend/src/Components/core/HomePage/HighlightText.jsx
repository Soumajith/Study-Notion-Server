import React from 'react';

function HighlightText({ text }) {
  return (
    <span className='bg-gradient-to-b from-[#FF5733] via-[#FFC300] to-[#DAF7A6] text-transparent bg-clip-text font-bold'>
      {" "}
      {text}
    </span>
  );
}

export default HighlightText;
