import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

export default function Order() {
  const foodServices = [
    {
      name: 'Zomato',
      logo: 'https://b.zmtcdn.com/web_assets/b40b97e677bc7b2ca77c58c61db266fe1603954218.png',
      url: 'https://www.zomato.com/'
    },
    {
      name: 'Swiggy',
      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/12/Swiggy_logo.svg/2560px-Swiggy_logo.svg.png',
      url: 'https://www.swiggy.com/'
    },
    {
      name: 'KFC',
      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/bf/KFC_logo.svg/1024px-KFC_logo.svg.png',
      url: 'https://online.kfc.co.in/'
    },
    {
      name: "Domino's",
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Domino%27s_pizza_logo.svg/2036px-Domino%27s_pizza_logo.svg.png',
      url: 'https://www.dominos.co.in/'
    },
    {
      name: 'Starbucks',
      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png',
      url: 'https://www.starbucks.in/'
    },
    {
      name: 'Burger King',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Burger_King_logo_%281999%29.svg/2024px-Burger_King_logo_%281999%29.svg.png',
      url: 'https://www.burgerking.in/'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Order Food Online</h1>
          <p className="text-gray-400">Choose your favorite food delivery service</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {foodServices.map((service, index) => (
            <motion.a
              key={service.name}
              href={service.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-900 rounded-xl p-6 flex flex-col items-center hover:transform hover:scale-105 transition-transform"
            >
              <img
                src={service.logo}
                alt={service.name}
                className="h-24 object-contain mb-4"
              />
              <h2 className="text-xl font-bold mb-2">{service.name}</h2>
              <span className="text-orange-500 flex items-center gap-2">
                Order Now
                <ExternalLink className="w-4 h-4" />
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}