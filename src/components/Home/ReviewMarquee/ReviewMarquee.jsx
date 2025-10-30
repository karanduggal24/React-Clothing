import React from 'react';
import { reviews } from '../../../static';
import { Marquee } from '../../ui/marquee';
import { cn } from '../../../lib/utils';
function ReviewMarquee() {
const ReviewCard = ({
  img,
  name,
  username,
  body,
} ) => {
  return (
    <figure style={{padding: '8px'}}
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
    // light styles
    "border-gray-950/10 bg-white/20 hover:bg-gray-950/5",
    // dark styles
    "dark:border-gray-50/10 dark:bg-gray-50/10 dark:hover:bg-gray-50/15"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  )
}


  return (
    <div style={{marginBottom:"50px"}} className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <h1 style={{padding:"10px",margin:"15px"}} className='text-2xl font-medium '>Reviews</h1>
      
      <Marquee pauseOnHover className="[--duration:20s]">
        {reviews.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      </div>
  );
}

export default ReviewMarquee;
