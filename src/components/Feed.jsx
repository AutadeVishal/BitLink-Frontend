import React, { useCallback, useEffect, useMemo, useState } from 'react';
import FeedCard from './FeedCard';
import { useDispatch, useSelector } from 'react-redux';
import { setFeed } from '../utils/feedSlice';
import axios from 'axios';
import { BASE_URL } from '../constants/Constants';
import { useNavigate } from 'react-router-dom';
import SkillsSelector from './common/SkillsSelector';
import { PROJECT_TYPES, getProjectTypeLabel } from '../constants/projectTypes';

const Feed = () => {
  const feedData = useSelector(state => state.feed);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
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
    setSearchText('');
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

  const toggleProjectType = (type) => {
    setFilters((previous) => {
      const alreadySelected = previous.projectTypes.includes(type);
      return {
        ...previous,
        projectTypes: alreadySelected
          ? previous.projectTypes.filter((projectType) => projectType !== type)
          : [...previous.projectTypes, type]
      };
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      getFeedData(feedQuery);
    }, 350);

    return () => clearTimeout(timer);
  }, [feedQuery, getFeedData]);

  return (
    <div className="page-shell page-enter">
      <div className="mb-6">
        <h1 className="section-title">Discover Talent</h1>
        <p className="subtitle">Search by name and refine by age, skills, gender, and project domain.</p>
      </div>

      <div className="glass-panel p-5 mb-6 space-y-4">
        <div className="grid md:grid-cols-3 gap-3">
          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            className="input-dark md:col-span-2"
            placeholder="Search by first or last name"
          />

          <button
            type="button"
            onClick={() => setFiltersOpen((prev) => !prev)}
            className={`btn-secondary flex items-center justify-center gap-2 ${
              filtersOpen ? 'border-red-500/50 text-red-100' : ''
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="11" y1="18" x2="13" y2="18" />
            </svg>
            Filters
            {filtersOpen ? ' ▲' : ' ▼'}
          </button>
        </div>

        {filtersOpen && (
          <div className="space-y-4 pt-2 border-t border-white/10">
            <div className="grid md:grid-cols-3 gap-3">
              <select
                value={filters.gender}
                onChange={(event) => setFilters((previous) => ({ ...previous, gender: event.target.value }))}
                className="select-dark"
              >
                <option value="">All genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <input
                type="number"
                min="18"
                value={filters.minAge}
                onChange={(event) => setFilters((previous) => ({ ...previous, minAge: event.target.value }))}
                className="input-dark"
                placeholder="Min age"
              />
              <input
                type="number"
                min="18"
                value={filters.maxAge}
                onChange={(event) => setFilters((previous) => ({ ...previous, maxAge: event.target.value }))}
                className="input-dark"
                placeholder="Max age"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <input
                type="number"
                min="1"
                max="10"
                value={filters.minSkillLevel}
                onChange={(event) => {
                  const nextValue = Number(event.target.value);
                  setFilters((previous) => ({
                    ...previous,
                    minSkillLevel: nextValue,
                    maxSkillLevel: Math.max(nextValue, previous.maxSkillLevel)
                  }));
                }}
                className="input-dark"
                placeholder="Min skill level"
              />
              <input
                type="number"
                min="1"
                max="10"
                value={filters.maxSkillLevel}
                onChange={(event) => {
                  const nextValue = Number(event.target.value);
                  setFilters((previous) => ({
                    ...previous,
                    maxSkillLevel: nextValue,
                    minSkillLevel: Math.min(previous.minSkillLevel, nextValue)
                  }));
                }}
                className="input-dark"
                placeholder="Max skill level"
              />
            </div>

            <SkillsSelector
              selectedSkills={filters.skills}
              onChange={(skills) => setFilters((previous) => ({ ...previous, skills }))}
              label="Filter by skills"
              showLevelEditor={false}
              placeholder="Choose skills for matching"
            />

            <div>
              <p className="text-sm font-semibold text-red-100 mb-2 tracking-wide">Project Types</p>
              <div className="flex flex-wrap gap-2">
                {PROJECT_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleProjectType(type)}
                    className={`badge ${
                      filters.projectTypes.includes(type)
                        ? 'badge-accent'
                        : 'badge-muted'
                    }`}
                  >
                    {getProjectTypeLabel(type)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button type="button" onClick={resetFilters} className="btn-secondary px-4">
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {error && <div className="alert-error mb-4">{error}</div>}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-panel p-5 space-y-4">
              <div className="flex justify-center"><div className="skeleton-circle w-20 h-20" /></div>
              <div className="space-y-2">
                <div className="skeleton h-5 w-32 mx-auto" />
                <div className="flex justify-center gap-2">
                  <div className="skeleton h-5 w-16 rounded-full" />
                  <div className="skeleton h-5 w-14 rounded-full" />
                </div>
                <div className="skeleton h-4 w-full" />
                <div className="flex justify-center gap-1">
                  <div className="skeleton h-5 w-20 rounded-full" />
                  <div className="skeleton h-5 w-16 rounded-full" />
                  <div className="skeleton h-5 w-18 rounded-full" />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <div className="skeleton h-10 flex-1" />
                <div className="skeleton h-10 flex-1" />
              </div>
            </div>
          ))}
        </div>
      ) : !feedData || feedData.length === 0 ? (
        <div className="glass-panel p-8 text-center">
          <h2 className="text-xl font-semibold text-red-50 mb-2">No matching profiles</h2>
          <p className="subtitle">Try widening your filters or clearing search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-grid">
          {feedData.map((userData) => (
            <FeedCard key={userData._id} userInfo={userData} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;
