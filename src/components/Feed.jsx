import React, { useCallback, useEffect, useMemo, useState } from 'react';
import FeedCard from './FeedCard';
import FeedFilters from '../FeedFilters';
import { useDispatch, useSelector } from 'react-redux';
import { setFeed } from '../utils/feedSlice';
import axios from 'axios';
import { BASE_URL } from '../constants/Constants';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from "framer-motion";

const Feed = () => {
  const feedData = useSelector(state => state.feed);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minAge: '',
    maxAge: '',
    gender: '',
    skills: [],
    minSkillLevel: 1,
    maxSkillLevel: 10,
    projectTypes: []
  });

  const selectedSkillsKey = useMemo(
    () => filters.skills.map((skill) => `${skill.name}:${skill.level}`).join('|'),
    [filters.skills]
  );

  const selectedProjectTypesKey = useMemo(
    () => filters.projectTypes.join('|'),
    [filters.projectTypes]
  );

  const feedQuery = useMemo(() => {
    const params = {
      page: 1,
      limit: 30
    };

    if (searchText.trim()) {
      params.search = searchText.trim();
    }
    if (filters.minAge) {
      params.minAge = filters.minAge;
    }
    if (filters.maxAge) {
      params.maxAge = filters.maxAge;
    }
    if (filters.gender) {
      params.gender = filters.gender;
    }
    if (filters.skills.length > 0) {
      params.skills = filters.skills.map((skill) => skill.name).join(',');
      params.minSkillLevel = filters.minSkillLevel;
      params.maxSkillLevel = filters.maxSkillLevel;
    }
    if (filters.projectTypes.length > 0) {
      params.projectTypes = filters.projectTypes.join(',');
    }

    return params;
  }, [
    searchText,
    filters.minAge,
    filters.maxAge,
    filters.gender,
    filters.minSkillLevel,
    filters.maxSkillLevel,
    filters.skills,
    filters.projectTypes,
    selectedSkillsKey,
    selectedProjectTypesKey
  ]);

  const getFeedData = useCallback(async (params) => {
    try {
      const res = await axios.get(`${BASE_URL}/request/feed`, {
        withCredentials: true,
        params
      });

      const usersData = res.data?.data || [];
      dispatch(setFeed(usersData));
      setError('');
    }
    catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Could not fetch feed data');
      }
    } finally {
      setLoading(false);
    }
  }, [dispatch, navigate]);

  const resetFilters = () => {
    setFilters({
      minAge: '',
      maxAge: '',
      gender: '',
      skills: [],
      minSkillLevel: 1,
      maxSkillLevel: 10,
      projectTypes: []
    });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      getFeedData(feedQuery);
    }, 350);

    return () => clearTimeout(timer);
  }, [feedQuery, getFeedData]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        duration: 0.4
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.9,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  const searchBarVariants = {
    initial: { scale: 1 },
    focus: { 
      scale: 1.02,
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const filterToggleVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15
      }
    },
    tap: { 
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 600,
        damping: 20
      }
    }
  };

  const filterIconVariants = {
    closed: { 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        duration: 0.3
      }
    },
    open: { 
      rotate: 180,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        duration: 0.3
      }
    }
  };

  const filterPanelVariants = {
    hidden: { 
      opacity: 0,
      height: 0,
      y: -20,
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
        duration: 0.2
      }
    },
    visible: { 
      opacity: 1,
      height: "auto",
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.4,
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      height: 0,
      y: -20,
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
        duration: 0.25
      }
    }
  };

  const filterChildVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const errorVariants = {
    hidden: { 
      opacity: 0, 
      y: -10,
      height: 0
    },
    visible: {
      opacity: 1,
      y: 0,
      height: "auto",
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        duration: 0.5
      }
    }
  };

  const emptyStateVariants = {
    hidden: { 
      opacity: 0, 
      y: 25, 
      scale: 0.96 
    },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1 
    },
    exit: { 
      opacity: 0, 
      y: -15,
      scale: 0.9
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20
      }
    }
  };

  const floatingIconVariants = {
    animate: {
      y: [0, -8, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        y: {
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        },
        rotate: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    }
  };

  const loaderVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.25
      }
    }
  };

  const skeletonVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.2
      }
    }
  };

  const activeFiltersBadgeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 20
      }
    },
    exit: { 
      scale: 0, 
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.minAge) count++;
    if (filters.maxAge) count++;
    if (filters.gender) count++;
    if (filters.skills.length > 0) count++;
    if (filters.projectTypes.length > 0) count++;
    return count;
  };

  return (
    <motion.div 
      className="page-shell page-enter"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div 
        className="mb-6"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="section-title">Discover Talent</h1>
        <p className="subtitle">Search by name and refine by age, skills, gender, and project domain.</p>
      </motion.div>

      <motion.div 
        className="mb-4 flex flex-col sm:flex-row gap-3"
      >
        <motion.div 
          className="flex-1"
          initial="initial"
          whileFocus="focus"
          variants={searchBarVariants}
        >
          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            className="input-dark w-full"
            placeholder="Search by first or last name"
          />
        </motion.div>

        <motion.button
          className="btn-secondary flex items-center justify-center gap-2 whitespace-nowrap"
          onClick={toggleFilters}
          variants={filterToggleVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          animate={showFilters ? "open" : "closed"}
        >
          <motion.span
            variants={filterIconVariants}
            className="inline-block"
          >
            ⚙️
          </motion.span>
          <span>Filters</span>
          <AnimatePresence>
            {getActiveFilterCount() > 0 && (
              <motion.span
                variants={activeFiltersBadgeVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-blue-500 text-white text-xs font-bold rounded-full px-2 py-0.5 min-w-[20px]"
              >
                {getActiveFilterCount()}
              </motion.span>
            )}
          </AnimatePresence>
          <motion.span
            animate={{ 
              rotate: showFilters ? 180 : 0 
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25
            }}
          >
            ▼
          </motion.span>
        </motion.button>
      </motion.div>

      <AnimatePresence mode="wait">
        {showFilters && (
          <motion.div
            key="filterPanel"
            variants={filterPanelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mb-4 overflow-hidden"
          >
            <motion.div variants={filterChildVariants}>
              <FeedFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={resetFilters}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            className="alert-error mb-4"
            variants={errorVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            variants={loaderVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {[...Array(6)].map((_, i) => (
              <motion.div 
                key={i} 
                variants={skeletonVariants}
                className="glass-panel p-5 space-y-4"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
                  transition: { duration: 0.2 }
                }}
              >
                <div className="flex justify-center">
                  <motion.div 
                    className="skeleton-circle w-20 h-20"
                    animate={{
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <motion.div 
                    className="skeleton h-5 w-32 mx-auto"
                    animate={{
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.2
                    }}
                  />
                  <div className="flex justify-center gap-2">
                    <motion.div 
                      className="skeleton h-5 w-16 rounded-full"
                      animate={{
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.4
                      }}
                    />
                    <motion.div 
                      className="skeleton h-5 w-14 rounded-full"
                      animate={{
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{
                        duration: 1.7,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.3
                      }}
                    />
                  </div>

                  <motion.div 
                    className="skeleton h-4 w-full"
                    animate={{
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 1.9,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  />

                  <div className="flex justify-center gap-1">
                    <motion.div 
                      className="skeleton h-5 w-20 rounded-full"
                      animate={{
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{
                        duration: 1.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.1
                      }}
                    />
                    <motion.div 
                      className="skeleton h-5 w-16 rounded-full"
                      animate={{
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.3
                      }}
                    />
                    <motion.div 
                      className="skeleton h-5 w-18 rounded-full"
                      animate={{
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.2
                      }}
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <motion.div 
                    className="skeleton h-10 flex-1"
                    animate={{
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 1.3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  />
                  <motion.div 
                    className="skeleton h-10 flex-1"
                    animate={{
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.6
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : !feedData || feedData.length === 0 ? (
          <motion.div
            key="empty"
            variants={emptyStateVariants}
            initial="hidden"
            animate="animate"
            exit="exit"
            whileHover="hover"
            className="glass-panel p-10 text-center"
          >
            <motion.div
              variants={floatingIconVariants}
              animate="animate"
              className="text-6xl mb-4"
            >
              <div className="flex items-center justify-center">
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100"
                  height="100"
                  viewBox="0 0 50 50"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z" />
                </motion.svg>
              </div>
            </motion.div>

            <motion.h2 
              className="text-2xl font-bold text-red-50 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              No matching profiles
            </motion.h2>

            <motion.p 
              className="subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Try widening your filters or clearing search terms.
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="feed"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-grid"
          >
            {feedData.map((userData, index) => (
              <motion.div
                key={userData._id}
                variants={itemVariants}
                custom={index}
                whileHover={{ 
                  y: -4,
                  transition: { type: "spring", stiffness: 400, damping: 15 }
                }}
              >
                <FeedCard userInfo={userData} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Feed;