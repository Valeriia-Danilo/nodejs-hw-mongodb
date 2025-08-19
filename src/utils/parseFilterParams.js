const parseContactType = (type) => {
  const isString = typeof type === 'string';
  if (!isString) return;
  const isContactType = (type) => ['work', 'home', 'personal'].includes(type);

  if (isContactType(type)) return type;
};

const parseBoolean = (value) => {
  if (typeof value !== 'string') return;
  const selectedValue = value.trim().toLowerCase();

  if (['true','1','yes','y'].includes(selectedValue))  return true;
    if (['false', '0', 'no', 'n'].includes(selectedValue)) return false;

    return;
};

export const parseFilterParams = (query) => {
  const {type, isFavourite} = query;

    const parsedContactType = parseContactType(type);
    const parsedFavourite = parseBoolean(isFavourite);
  return {
      type: parsedContactType,
      isFavourite: parsedFavourite,
  };
};

