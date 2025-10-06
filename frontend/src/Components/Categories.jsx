import bakery_image from "../assets/bakery_image.png";
import bottles_image from "../assets/bottles_image.png";
import dairy_product_image from "../assets/dairy_product_image.png";
import grain_image from "../assets/grain_image.png";
import fresh_fruits_image from "../assets/fresh_fruits_image.png";
import maggi_image from "../assets/maggi_image.png";
import organic_vegitable_image from "../assets/organic_vegitable_image.png";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    name: "Organic veggies",
    img: organic_vegitable_image,
    bg: "bg-yellow-50",
    category: "Vegetables",
  },
  {
    name: "Fresh Fruits",
    img: fresh_fruits_image,
    bg: "bg-pink-100",
    category: "Fruits",
  },
  {
    name: "Cold Drinks",
    img: bottles_image,
    bg: "bg-green-50",
    category: "Beverages",
  },
  {
    name: "Instant Food",
    img: maggi_image,
    bg: "bg-green-100",
    category: "Snacks",
  },
  {
    name: "Dairy Products",
    img: dairy_product_image,
    bg: "bg-orange-100",
    category: "Dairy",
  },
  {
    name: "Bakery & Breads",
    img: bakery_image,
    bg: "bg-blue-100",
    category: "Bakery",
  },
  {
    name: "Grains & Cereals",
    img: grain_image,
    bg: "bg-purple-100",
    category: "Cereals",
  },
];

export default function Categories() {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category}`);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 mt-16">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-10">
        Categories
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {categories.map((cat) => (
          <div
            key={cat.name}
            onClick={() => handleCategoryClick(cat.category)}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl ${cat.bg} p-6 shadow-sm transition hover:scale-105 duration-200 min-h-[220px]`}
          >
            <img
              src={cat.img}
              alt={cat.name}
              className="w-24 h-24 object-contain mb-4"
            />
            <span className="text-lg font-semibold text-gray-700 text-center">
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
