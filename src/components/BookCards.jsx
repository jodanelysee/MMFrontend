import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import { Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';

const BookCards = ({headline, books}) => {
    console.log(books)

  return (
    <div className='my-16 px-4 lg:px-24 '>
        <h2 className='text-5xl text-center font-bold text-black my-5'>{headline}</h2>

        {/* cards */}
        <div className='mt-12'>
        <Swiper
        slidesPerView={1}
        spaceBetween={10}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 5,
            spaceBetween: 50,
          },
        }}
        modules={[Pagination]}
        className="mySwiper w-full h-full"
      >
        {
            books.map(book => <SwiperSlide key={book._id}>
                    <div className='relative'>
                        <img src={book.image_url} alt="" />
                    </div>
                    <div>
                    <div>
                        <h3>{book.title}</h3>
                        <p>{book.author}</p>
                    </div>
                    <div>
                      
                    </div>
                    </div>
            </SwiperSlide>)
        }
      </Swiper>
        </div>
    </div>
  )
}

export default BookCards