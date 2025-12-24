import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Swiper styles import karna mat bhulna
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const HeroSlider = () => {
  const banners = [
    {
      image: "https://res.cloudinary.com/demo/image/upload/v1/sample.jpg",
      title: "Grand Sale",
    }, // Yahan apne Cloudinary links dalein
    {
      image: "https://res.cloudinary.com/demo/image/upload/v1/sample.jpg",
      title: "New Tech",
    },
  ];

  return (
    <div className="my-4 px-6">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        className="rounded-3xl overflow-hidden shadow-2xl"
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={index}>
            <div className="h-[300px] md:h-[500px] relative">
              <img
                src={banner.image}
                className="w-full h-full object-cover"
                alt={banner.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-10">
                <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase">
                  {banner.title}
                </h2>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroSlider;
