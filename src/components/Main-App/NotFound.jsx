import React from 'react';
import Lottie from 'lottie-react';
import { AuroraText } from '../ui/aurora-text';
// import Animation from '/src/animations/404ErrorDoodle.json';

function NotFound() {
  return (
    <div className='min-h-screen w-full bg-white flex flex-col items-center justify-center'>
        <div className='w-full height-80vh bg-white text-center '>
          <AuroraText className=' sm: text-[40px] md:text-[100px] font-bold'>404 - Page Not Found</AuroraText>
            <p className='text-lg text-gray-600 mt-4'>Sorry, the page you are looking for does not exist.</p>
                   <a href='/' style={{padding:"10px", margin:"20px"}} className='inline-block mt-6 px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition '>    Go to Home</a>
                   </div> 

    </div>
    
  );
}

export default NotFound;
