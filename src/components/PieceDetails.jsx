import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/thumbs';

const PieceDetails = ({ piece }) => {
    const [open, setOpen] = useState(false);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const images = piece?.images || [];
    const mainSwiperRef = useRef(null);

    return (
        <>
            {/* Thumbnail in the main view */}
            <div className="space-y-2 p-2 border rounded-xl">
                <Swiper slidesPerView="auto" spaceBetween={30} loop={true}>
                    {images.map((image, imageIndex) => (
                        <SwiperSlide key={imageIndex} className="w-full max-w-[70px]">
                            <img
                                src={image}
                                alt={`piece-${imageIndex}`}
                                className="w-full h-full object-contain cursor-pointer"
                                onClick={() => {
                                    setSelectedImage(imageIndex);
                                    setOpen(true);
                                }}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
                {/* <p className="text-xs">{piece?.name}</p> */}
                <p className="text-xs">{piece?.code}</p>
                <p className="text-xs">{piece?.price_in_egp} EGP</p>
                <p className="text-xs">{piece?.price_in_sar} SAR</p>
            </div>

            {/* Full-screen overlay with main image slider and thumbnail slider */}
            {open && (
                <div className="fixed top-0 space-y-1 left-0 w-full h-full bg-black/70 flex flex-col justify-center items-center z-50">
                    <div className="relative space-y-1 w-full max-w-4xl">
                        {/* Main Swiper */}
                        <Swiper
                            initialSlide={selectedImage}
                            onSwiper={(swiper) => {
                                mainSwiperRef.current = swiper;
                            }}
                            onSlideChange={(swiper) => setSelectedImage(swiper.activeIndex)}
                            className="w-full h-[500px]"
                        // Removing navigation prop to hide arrows
                        >
                            {images.map((image, imageIndex) => (
                                <SwiperSlide key={imageIndex} className="flex justify-center items-center">
                                    <img
                                        src={image}
                                        alt={`piece-${imageIndex}`}
                                        className="object-contain w-full h-full"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Custom Close Button */}
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-2 right-2 text-white bg-gray-800 rounded-full p-2 px-4 z-40"
                        >
                            X
                        </button>
                    </div>

                    {/* Thumbnails Slider */}
                    <div className="w-full max-w-4xl mt-4">
                        <Swiper
                            onSwiper={setThumbsSwiper}
                            slidesPerView={Math.min(images.length, 5)}
                            spaceBetween={10}
                            freeMode
                            className="h-24"
                        >
                            {images.map((image, imageIndex) => (
                                <SwiperSlide key={imageIndex} className="cursor-pointer w-full max-w-[100px]">
                                    <img
                                        src={image}
                                        alt={`thumb-${imageIndex}`}
                                        className={`object-cover w-full h-full ${selectedImage === imageIndex ? 'border-2 border-blue-500' : ''
                                            }`}
                                        onClick={() => {
                                            setSelectedImage(imageIndex);
                                            if (mainSwiperRef.current) {
                                                // Use slideToLoop if loop mode is enabled
                                                mainSwiperRef.current.slideToLoop(imageIndex);
                                            }
                                        }}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            )}
        </>
    );
};

export default PieceDetails;
