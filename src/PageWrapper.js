import { motion } from "framer-motion";

export default function PageWrapper({ children }) {

    const AnimationSettings = {
      transition: { duration: 0.25 },
      initial: { opacity: 0, y: 0 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 0 }
    };    

    return (
      <motion.div {...AnimationSettings}>
        {children}
      </motion.div>
    );
}