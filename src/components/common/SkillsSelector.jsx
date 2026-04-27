import { useMemo, useState } from 'react';
import { TECHNICAL_SKILLS } from '../../constants/skills';
import { clampSkillLevel, normalizeSkillList } from '../../utils/skillHelpers';

const SkillsSelector = ({
  selectedSkills,
  onChange,
  label,
  className = "",
  showLevelEditor = true,
  defaultLevel = 5,
  minLevel = 1,
  maxLevel = 10,
  placeholder = 'Search and add skills...'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const normalizedSelectedSkills = useMemo(
    () => normalizeSkillList(selectedSkills, defaultLevel),
    [selectedSkills, defaultLevel]
  );

  const selectedSkillNames = useMemo(
    () => new Set(normalizedSelectedSkills.map((skill) => skill.name.toLowerCase())),
    [normalizedSelectedSkills]
  );

  const filteredSkills = TECHNICAL_SKILLS.filter((skill) => {
    const matchesSearch = skill.toLowerCase().includes(searchTerm.toLowerCase());
    const alreadySelected = selectedSkillNames.has(skill.toLowerCase());
    return matchesSearch && !alreadySelected;
  });

  const commitSkills = (nextSkills) => {
    onChange(normalizeSkillList(nextSkills, defaultLevel));
  };

  const addSkill = (skill) => {
    commitSkills([...normalizedSelectedSkills, { name: skill, level: defaultLevel }]);
    setSearchTerm('');
    setIsOpen(false);
  };

  const removeSkill = (skillToRemove) => {
    commitSkills(
      normalizedSelectedSkills.filter(
        (skill) => skill.name.toLowerCase() !== skillToRemove.toLowerCase()
      )
    );
  };

  const updateSkillLevel = (skillName, level) => {
    commitSkills(
      normalizedSelectedSkills.map((skill) => {
        if (skill.name.toLowerCase() !== skillName.toLowerCase()) {
          return skill;
        }

        return {
          ...skill,
          level: Math.max(minLevel, Math.min(maxLevel, clampSkillLevel(level, defaultLevel)))
        };
      })
    );
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-red-100 mb-2 tracking-wide">{label}</label>
      )}
      
      {normalizedSelectedSkills.length > 0 && (
        <div className="space-y-2 mb-3">
          {normalizedSelectedSkills.map((skill) => (
            <div
              key={skill.name}
              className="glass-subpanel flex flex-wrap items-center gap-2 px-3 py-2"
            >
              <span className="badge badge-primary">{skill.name}</span>

              {showLevelEditor && (
                <div className="flex items-center gap-2 text-sm text-red-100">
                  <span className="text-xs uppercase tracking-wide text-red-300">Level</span>
                  <input
                    type="number"
                    min={minLevel}
                    max={maxLevel}
                    value={skill.level}
                    onChange={(event) => updateSkillLevel(skill.name, event.target.value)}
                    className="w-16 input-dark px-2 py-1 text-center"
                  />
                </div>
              )}

              {!showLevelEditor && (
                <span className="badge badge-muted">L{skill.level}</span>
              )}

              <button
                type="button"
                onClick={() => removeSkill(skill.name)}
                className="ml-auto text-red-300 hover:text-red-100 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className="input-dark"
      />

      {isOpen && searchTerm && (
        <div className="absolute z-20 w-full mt-1 glass-panel max-h-56 overflow-y-auto">
          {filteredSkills.length ? (
            filteredSkills.slice(0, 8).map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => addSkill(skill)}
                className="w-full text-left px-4 py-2 hover:bg-red-500/20 border-b border-white/5 last:border-b-0 text-red-100"
              >
                {skill}
              </button>
            ))
          ) : (
            <div className="px-4 py-2 text-red-300">No skills found</div>
          )}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};
export default SkillsSelector;
