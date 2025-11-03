import React from 'react';
import Lottie from 'lottie-react';
// import Animation from '/src/animations/404ErrorDoodle.json';

function NotFound() {
  return (
    <div className='min-h-screen w-full bg-white flex flex-col items-center justify-center'>
        <div className='w-full height-80vh bg-white text-center '>
          <h1 className='text-4xl font-bold text-black pt-10'>404 - Page Not Found</h1>
            <p className='text-lg text-gray-600 mt-4'>Sorry, the page you are looking for does not exist.</p>
                   </div> 

    </div>
    
  );
}

export default NotFound;
