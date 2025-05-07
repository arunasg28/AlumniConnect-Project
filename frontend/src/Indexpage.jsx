import { motion } from "framer-motion";
import { Link } from "react-router-dom";
export default function Index() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <motion.img 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      className="h-28 rounded" src="../clg logo.png" alt="College logo" />
      <motion.h1 
       initial={{ opacity: 0, y: -20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.8 }}
      className=" font-bold">AlumniConnect</motion.h1>
      <br/>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-bold text-error mb-4"
      >
        Welcome to MAMCET Alumni Network
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-lg md:text-xl text-white max-w-xl mb-8"
      >
        Stay connected, discover opportunities, and grow with our vibrant alumni community.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="flex gap-4"
      >
       <Link to="/login" className="bg-white border border-blue-500 text-blue-500 px-6 py-2 rounded-xl shadow hover:bg-blue-50 transition">
          Sign In
        </Link>
        <Link to="/signup" className="bg-blue-600 text-white px-6 py-2 rounded-xl shadow hover:bg-blue-700 transition">
          Join Now
        </Link>
      </motion.div>
    </div>
  );
}
