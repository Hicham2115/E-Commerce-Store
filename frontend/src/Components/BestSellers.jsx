import dada from "../assets/dada.png";
import bakery_image from "../assets/bakery_image.png";
import spinach_image_1 from "../assets/spinach_image_1.png";
import tomato_image from "../assets/tomato_image.png";
import amul_milk_image from "../assets/amul_milk_image.png";
import maggi_image from "../assets/maggi_image.png";
import orange_image from "../assets/orange_image.png";

const products = [
  {
    category: "Bakery",
    name: "Whole Grain Bread 400g",
    rating: 5,
    reviews: 5,
    price: 120,
    oldPrice: 140,
    about_product: [
      "Made with 100% whole grains",
      "Low in sugar",
      "Perfect for a healthy breakfast",
    ],
    img: bakery_image,
  },
  {
    category: "Vegetables",
    name: "Fresh Tomatoes 1kg",
    rating: 5,
    reviews: 12,
    price: 60,
    oldPrice: 75,
    about_product: [
      "Juicy and ripe",
      "Perfect for sauces and salads",
      "Locally sourced",
    ],
    img: tomato_image,
  },
  {
    category: "Dairy",
    name: "Fresh Milk 1L",
    rating: 4,
    reviews: 10,
    price: 50,
    oldPrice: 60,
    about_product: ["Rich in calcium", "Farm fresh", "Pasteurized for safety"],
    img: amul_milk_image,
  },
  {
    category: "Vegetables",
    name: "Spinach Bunch",
    rating: "★★★★☆ (6)",
    price: "$30",
    original_price: "$40",
    about_product: [
      "Rich in iron and vitamins",
      "Ideal for salads and smoothies",
      "Organic and fresh",
    ],
    img: spinach_image_1,
  },
  {
    category: "Dairy",
    name: "Maggi Noodles 280g",
    rating: "★★★★★ (9)",
    price: "$20",
    original_price: "$25",
    about_product: ["Instant and easy to cook", "Delicious taste"],
    img: maggi_image,
  },
];

function StarRating({ rating }) {
  return (
    <div className="flex items-center text-green-500 text-base">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${
            i < rating ? "fill-green-400" : "fill-gray-200"
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
        </svg>
      ))}
    </div>
  );
}

export default function BestSellers() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 mt-16">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-10">
        Best Sellers
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8  ">
        {products.map((p) => (
          <div
            key={p.name}
            className="bg-white cursor-pointer rounded-2xl border border-gray-200 p-6 flex flex-col items-center shadow-sm hover:shadow-md transition"
          >
            <img
              src={p.img}
              alt={p.name}
              className="w-28 h-28 object-contain mb-4"
            />
            <div className="w-full text-left">
              <div className="text-gray-400 text-base mb-1">{p.category}</div>
              <div className="font-bold text-lg text-gray-800 mb-2 truncate w-40">
                {p.name}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <StarRating rating={p.rating} />
                <span className="text-gray-400 text-sm">({p.reviews})</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-green-500 text-xl font-bold">
                  ${p.price}
                </span>
                <span className="text-gray-400 line-through text-base">
                  ${p.oldPrice}
                </span>
              </div>
              <button className="flex items-center gap-2 border border-green-300 text-green-500 font-semibold rounded-md px-4 py-2 hover:bg-green-50 transition">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-5-9V6a2 2 0 10-4 0v3"
                  />
                </svg>
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-20 flex justify-center">
        <img src={dada} alt="" />
      </div>
    </section>
  );
}
