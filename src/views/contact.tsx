import React, { useEffect, useRef, useState } from "react";
import maplibregl from 'maplibre-gl';
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const Contact: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [coordinates, setCoordinates] = useState<{ lng: number; lat: number } | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return; // initialize map only once

    // Initialize map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json', // Demo tile style
      center: [106.7, 10.8], // Ho Chi Minh City coordinates
      zoom: 12
    });

    // Create draggable marker
    const marker = new maplibregl.Marker({ draggable: true })
      .setLngLat([106.7, 10.8])
      .addTo(map.current);

    function onDragEnd() {
      const lngLat = marker.getLngLat();
      setCoordinates({
        lng: parseFloat(lngLat.lng.toFixed(6)),
        lat: parseFloat(lngLat.lat.toFixed(6))
      });
    }

    marker.on('dragend', onDragEnd);

    // Set initial coordinates
    setCoordinates({
      lng: 106.7,
      lat: 10.8
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Banner */}
      <div className="relative w-full h-64 bg-gray-200 flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1521791055366-0d553872125f"
          alt="banner-vị-trí"
          className="absolute w-full h-full object-cover"
        />
        <div className="absolute w-full h-full bg-black/40" />
        <h1 className="relative text-white text-4xl font-bold z-10">
          ĐỊA CHỈ
        </h1>
      </div>

      {/* Bản đồ + Form liên hệ */}
      <div className="container mx-auto px-4 py-12 grid md:grid-cols-2 gap-8">
        {/* MapLibre GL Map */}
        <div className="w-full h-[400px] relative">
          <div ref={mapContainer} className="w-full h-full rounded-lg" />
          {coordinates && (
            <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-md border">
              <div className="text-sm font-semibold text-gray-700 mb-1">Vị trí hiện tại:</div>
              <div className="text-xs text-gray-600">
                Longitude: {coordinates.lng}<br />
                Latitude: {coordinates.lat}
              </div>
            </div>
          )}
        </div>

        {/* Form liên hệ */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Liên hệ với chúng tôi!</h2>
          <p className="text-gray-600 mb-6">
            Hãy cho chúng tôi biết thông tin để được hỗ trợ tốt nhất.
          </p>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Họ và tên"
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="tel"
              placeholder="Số điện thoại"
              className="w-full p-3 border rounded-lg"
            />
            <textarea
              placeholder="Nội dung..."
              rows={4}
              className="w-full p-3 border rounded-lg"
            ></textarea>
            <button
              type="submit"
              className="bg-teal-700 text-white px-6 py-3 rounded-lg hover:bg-teal-800 transition"
            >
              Gửi ngay
            </button>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 text-center grid md:grid-cols-3 gap-8">
        <div>
          <p className="font-semibold">Địa chỉ</p>
          <p>Quận 7, TP Hồ Chí Minh, Việt Nam</p>
        </div>
        <div>
          <p className="font-semibold">Email</p>
          <p>lienhe@ivyhealthgroup.vn</p>
        </div>
        <div>
          <p className="font-semibold">Điện thoại</p>
          <p>+84 28 1234 5678</p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Contact;
