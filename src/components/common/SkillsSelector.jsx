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
  };
  const removeSkill = (s) => onChange(selectedSkills.filter(x => x !== s));

  return (
    <div className={`relative ${className}`}>
      {label && <label className="text-sm text-gray-300">{label}</label>}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2 p-2 bg-gray-700 rounded border border-gray-600">
          {selectedSkills.map(skill => (
            <span key={skill} className="bg-blue-600 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
              {skill}
              <button onClick={() => removeSkill(skill)} className="text-blue-200 hover:text-white">×</button>
            </span>
          ))}
        </div>
      )}
      <input
        value={searchTerm}
        onChange={e => { setSearchTerm(e.target.value); setIsOpen(true); }}
        onFocus={() => setIsOpen(true)}
        placeholder="Search and select skills..."
        className="w-full rounded bg-gray-700 border border-gray-600 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-400 outline-none"
      />
      {isOpen && searchTerm && (
        <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded max-h-48 overflow-y-auto">
          {filteredSkills.length ? filteredSkills.slice(0, 10).map(s => (
            <button key={s} onClick={() => addSkill(s)} className="w-full text-left px-4 py-2 hover:bg-gray-600 text-white">{s}</button>
          )) : <div className="px-4 py-2 text-gray-400">No skills found</div>}
        </div>
      )}
      {isOpen && <div className="fixed inset-0" onClick={() => setIsOpen(false)} />}
    </div>
  );
};
export default SkillsSelector;
