import { useState } from 'react';
import { TECHNICAL_SKILLS } from '../../constants/skills';

const SkillsSelector = ({ selectedSkills, onChange, label, className = "" }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredSkills = TECHNICAL_SKILLS.filter(skill =>
    skill.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedSkills.includes(skill)
  );

  const addSkill = (skill) => {
    onChange([...selectedSkills, skill]);
    setSearchTerm('');
    setIsOpen(false);
  };

  const removeSkill = (skillToRemove) => {
    onChange(selectedSkills.filter(skill => skill !== skillToRemove));
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      
      {/* Selected Skills */}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedSkills.map(skill => (
            <span 
              key={skill} 
              className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              {skill}
              <button 
                onClick={() => removeSkill(skill)} 
                className="text-blue-600 hover:text-blue-800 ml-1"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search Input */}
      <input
        value={searchTerm}
        onChange={e => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder="Search and add skills..."
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Dropdown */}
      {isOpen && searchTerm && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
          {filteredSkills.length ? (
            filteredSkills.slice(0, 8).map(skill => (
              <button
                key={skill}
                onClick={() => addSkill(skill)}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
                {skill}
              </button>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">No skills found</div>
          )}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-5" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};
export default SkillsSelector;
