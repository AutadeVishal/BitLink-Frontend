export const clampSkillLevel = (value, fallback = 5) => {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    return fallback;
  }
  return Math.max(1, Math.min(10, Math.round(parsed)));
};

export const normalizeSkillEntry = (entry, fallbackLevel = 5) => {
  if (typeof entry === "string") {
    const skillName = entry.trim();
    if (!skillName) {
      return null;
    }
    return {
      name: skillName,
      level: clampSkillLevel(fallbackLevel, 5)
    };
  }

  if (!entry || typeof entry !== "object") {
    return null;
  }

  const rawName = typeof entry.name === "string" ? entry.name.trim() : "";
  if (!rawName) {
    return null;
  }

  return {
    name: rawName,
    level: clampSkillLevel(entry.level, fallbackLevel)
  };
};

export const normalizeSkillList = (skills = [], fallbackLevel = 5) => {
  const incoming = Array.isArray(skills) ? skills : [];
  const uniqueSkillMap = new Map();

  incoming.forEach((entry) => {
    const normalized = normalizeSkillEntry(entry, fallbackLevel);
    if (!normalized) {
      return;
    }

    const key = normalized.name.toLowerCase();
    const existing = uniqueSkillMap.get(key);

    if (!existing) {
      uniqueSkillMap.set(key, normalized);
      return;
    }

    existing.level = Math.max(existing.level, normalized.level);
  });

  return Array.from(uniqueSkillMap.values());
};

export const getSkillName = (skill) => {
  if (typeof skill === "string") {
    return skill;
  }
  if (skill && typeof skill === "object" && typeof skill.name === "string") {
    return skill.name;
  }
  return "";
};

export const getSkillLevel = (skill, fallbackLevel = 5) => {
  if (skill && typeof skill === "object") {
    return clampSkillLevel(skill.level, fallbackLevel);
  }
  return clampSkillLevel(fallbackLevel, 5);
};