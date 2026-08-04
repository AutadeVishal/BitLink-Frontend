import React from 'react';
import SkillsSelector from  './components/common/SkillsSelector'
import { PROJECT_TYPES, getProjectTypeLabel } from './constants/projectTypes'

const FeedFilters = ({ filters, onFilterChange, onReset }) => {
  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  }; 

  const handleSkillsChange = (skills) => {
    onFilterChange({ ...filters, skills });
  };

  const toggleProjectType = (type) => {
    const updatedProjectTypes = filters.projectTypes.includes(type)
      ? filters.projectTypes.filter((projectType) => projectType !== type)
      : [...filters.projectTypes, type];
    
    onFilterChange({ ...filters, projectTypes: updatedProjectTypes });
  };

  const handleMinSkillChange = (value) => {
    const nextValue = Number(value);
    onFilterChange({
      ...filters,
      minSkillLevel: nextValue,
      maxSkillLevel: Math.max(nextValue, filters.maxSkillLevel)
    });
  };

  const handleMaxSkillChange = (value) => {
    const nextValue = Number(value);
    onFilterChange({
      ...filters,
      maxSkillLevel: nextValue,
      minSkillLevel: Math.min(filters.minSkillLevel, nextValue)
    });
  };

  return (
    <div className="glass-panel p-5 mb-6 space-y-4">
      <div className="space-y-4 pt-2">
        <div className="grid md:grid-cols-3 gap-3">
          <select
            value={filters.gender}
            onChange={(event) => handleFilterChange('gender', event.target.value)}
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
            onChange={(event) => handleFilterChange('minAge', event.target.value)}
            className="input-dark"
            placeholder="Min age"
          />
          <input
            type="number"
            min="18"
            value={filters.maxAge}
            onChange={(event) => handleFilterChange('maxAge', event.target.value)}
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
            onChange={(event) => handleMinSkillChange(event.target.value)}
            className="input-dark"
            placeholder="Min skill level"
          />
          <input
            type="number"
            min="1"
            max="10"
            value={filters.maxSkillLevel}
            onChange={(event) => handleMaxSkillChange(event.target.value)}
            className="input-dark"
            placeholder="Max skill level"
          />
        </div>

        <SkillsSelector
          selectedSkills={filters.skills}
          onChange={handleSkillsChange}
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
                className={`badge ${filters.projectTypes.includes(type)
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
          <button type="button" onClick={onReset} className="btn-secondary px-4">
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedFilters;