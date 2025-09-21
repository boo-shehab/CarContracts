// src/utilities/getChangedFields.ts
export function getChangedFields(original: any, updated: any) {
  const changed: any = {};
  Object.keys(updated).forEach((key) => {
    // treat undefined/null consistently
    const orig = original?.[key];
    const upd = updated[key];
    if (upd !== orig) changed[key] = upd;
  });
  return changed;
}
