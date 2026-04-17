import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
    initial: {
        opacity: 0,
        x: '-2%',
    },
    in: {
        opacity: 1,
        x: '0%',
    },
    out: {
        opacity: 0,
        x: '2%',
    }
};

const pageTransition = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.3
};

const TransitionWrapper = ({ children }) => {
    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            style={{ height: '100%' }}
        >
            {children}
        </motion.div>
    );
};

export default TransitionWrapper;
